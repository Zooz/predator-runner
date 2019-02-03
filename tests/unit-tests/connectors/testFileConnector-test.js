let should = require('should');
let sinon = require('sinon');
let request = require('request-promise-native');
let logger = require('../../../app/utils/logger');
let testFileConnector = require('../../../app/connectors/testFileConnector');
let testUtils = require('../../utils/consts');
let testId = 14;

describe('Get test file', () => {
    let sandbox, loggerInfoStub, requestStub;

    before(() => {
        sandbox = sinon.createSandbox();
        loggerInfoStub = sandbox.stub(logger, 'info');
        requestStub = sandbox.stub(request, 'Request');
    });
    beforeEach(() => {
        sandbox.resetHistory();
    });
    after(() => {
        sandbox.restore();
    });

    it('successfully get test file', async () => {
        requestStub.resolves({
            body: testUtils.VALID_CUSTOM_TEST,
            statsCude: 200
        });

        let exception;
        try {
            await testFileConnector.getTest(testId);
        } catch (e) {
            exception = e;
        }
        should.not.exist(exception);
        requestStub.calledOnce.should.eql(true);

        loggerInfoStub.args[2][0].should.eql({test_file: testUtils.VALID_CUSTOM_TEST});
    });

    it('fail to get test file -> request error', async () => {
        let expecterError = new Error('Failed to retrieve test file');
        requestStub.rejects(expecterError);

        let exception;
        try {
            await testFileConnector.getTest(testId);
        } catch (e) {
            exception = e;
        }
        should.exist(exception);
        exception.should.eql(expecterError);
        requestStub.callCount.should.be.eql(3);
    });
});