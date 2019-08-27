let should = require('should');
let sinon = require('sinon');
let request = require('../../../app/helpers/requestSender');
let testFileConnector = require('../../../app/connectors/testFileConnector');
let testUtils = require('../../utils/consts');

describe('Get test file', () => {
    let sandbox, requestStub;

    const jobConfig = {
        testId: 1,
        runId: 14,
        environment: 'test',
        duration: 5,
        arrival_rate: 5,
        predatorUrl: 'http://localhost/v1'
    };

    before(() => {
        sandbox = sinon.createSandbox();
        requestStub = sandbox.stub(request, 'sendRequest');
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
            await testFileConnector.getTest(jobConfig);
        } catch (e) {
            exception = e;
        }
        should.not.exist(exception);
        requestStub.calledOnce.should.eql(true);
    });

    it('fail to get test file -> request error', async () => {
        let expecterError = new Error('Failed to retrieve test file');
        requestStub.rejects(expecterError);

        let exception;
        try {
            await testFileConnector.getTest(jobConfig);
        } catch (e) {
            exception = e;
        }
        should.exist(exception);
        exception.should.eql(expecterError);
    });
});