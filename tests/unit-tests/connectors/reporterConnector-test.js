const should = require('should'),
    sinon = require('sinon'),
    uuid = require('uuid');

const request = require('../../../app/helpers/requestSender'),
    reporterConnector = require('../../../app/connectors/reporterConnector');

describe('Post stats to reporter', () => {
    let sandbox, requestStub;
    const stats = {

    };
    const test = {
        type: 'custom'
    };

    const jobConfig = {
        testId: 1,
        reportId: '0d9d772d-ce0e-4318-af18-d695561f1320',
        environment: 'test',
        duration: 5,
        arrival_rate: 5,
        predatorUrl: 'http://localhost/v1',
        reportId: uuid.v4(),
        containerIdL: uuid.v4()
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

    it('successfully Subscribe Runner To Report', async () => {
        requestStub.resolves({
            statusCode: 204
        });

        let exception;
        try {
            await reporterConnector.subscribeToReport(jobConfig);
        } catch (e) {
            exception = e;
        }
        should.not.exist(exception);
        requestStub.callCount.should.be.eql(1);
        requestStub.args[0][0].should.deepEqual({
            url: `${jobConfig.predatorUrl}/tests/${jobConfig.testId}/reports/${jobConfig.reportId}/subscribe`,
            method: 'POST',
            headers: {
                'x-runner-id': jobConfig.containerId
            },
            body: {}
        });
    });

    it('successfully post stats', async () => {
        requestStub.resolves({
            statusCode: 201
        });

        let exception;
        try {
            await reporterConnector.postStats(jobConfig, stats);
        } catch (e) {
            exception = e;
        }
        should.not.exist(exception);
    });

    it('fail to subscribe runner to report -> request error - check 3 retries', async () => {
        let expecterError = new Error('Failed to create report');
        requestStub.rejects({
            message: expecterError,
            statusCode: 500
        });

        let exception;
        try {
            await reporterConnector.subscribeToReport(jobConfig);
        } catch (e) {
            exception = e;
        }
        should.exist(exception);
        should.equal(expecterError, exception.message);
    });

    it('fail to send stats -> request error - check 3 retries', async () => {
        let expecterError = new Error('Failed to send stats to reporter');
        requestStub.rejects({
            message: expecterError,
            statusCode: 500
        });

        let exception;
        try {
            await reporterConnector.postStats(jobConfig, stats);
        } catch (e) {
            exception = e;
        }
        should.exist(exception);
        should.equal(expecterError, exception.message);
    });
});
