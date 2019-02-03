let should = require('should');
let sinon = require('sinon');
let uuid = require('uuid');
let logger = require('../../../app/utils/logger');
let errorHandler = require('../../../app/handler/errorHandler');
let reporterConnector = require('../../../app/connectors/reporterConnector');

describe('Handle Error', () => {
    let sandbox, loggerErrorStub, reporterConnectorStub;
    const jobConfig = {
        testId: uuid()
    };
    before(() => {
        sandbox = sinon.createSandbox();
        loggerErrorStub = sandbox.stub(logger, 'error');
        reporterConnectorStub = sandbox.stub(reporterConnector, 'postStats');
    });
    beforeEach(() => {
        sandbox.resetHistory();
    });
    after(() => {
        sandbox.restore();
    });

    it('successfully send error to reporter', async () => {
        reporterConnectorStub.resolves();
        const expectedError = new Error('Error thrown');
        let exception;
        try {
            await errorHandler.handleError(jobConfig, expectedError);
        } catch (error) {
            exception = error;
        }
        should.not.exist(exception);

        loggerErrorStub.calledOnce.should.eql(true);
        loggerErrorStub.args[0][0].should.equal(expectedError);
        loggerErrorStub.args[0][1].should.equal('Test failed');
    });

    it('fail to send error to reporter', async () => {
        let exception;
        reporterConnectorStub.rejects(new Error('Failed to send message to reporter'));
        try {
            await errorHandler.handleError(jobConfig, new Error('Error thrown'));
        } catch (error) {
            exception = error;
        }
        should.not.exist(exception);

        loggerErrorStub.calledTwice.should.eql(true);
        loggerErrorStub.args[0][0].message.should.equal('Error thrown');
        loggerErrorStub.args[0][1].should.equal('Test failed');
        loggerErrorStub.args[1][0].message.should.equal('Failed to send message to reporter');
        loggerErrorStub.args[1][1].should.equal('Failed to update reporter of test failure');
    });
});