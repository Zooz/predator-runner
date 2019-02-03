let should = require('should');
let sinon = require('sinon');
let request = require('request-promise-native');
let reporterConnector = require('../../../app/connectors/reporterConnector');

describe('Post stats to reporter', () => {
    let sandbox, requestStub;
    const stats = {

    };
    const test = {
        type: 'custom'
    };

    const jobConfig = {
        testId: 1,
        environment: 'test',
        duration: 5,
        arrival_rate: 5
    };

    before(() => {
        sandbox = sinon.createSandbox();
        requestStub = sandbox.stub(request, 'post');
    });
    beforeEach(() => {
        sandbox.resetHistory();
    });
    after(() => {
        sandbox.restore();
    });

    it('successfully create report', async () => {
        requestStub.resolves({
            statusCode: 201
        });

        let exception;
        try {
            await reporterConnector.createReport(jobConfig, test);
        } catch (e) {
            exception = e;
        }
        should.not.exist(exception);
        requestStub.callCount.should.be.eql(1);
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
        requestStub.callCount.should.be.eql(1);
    });

    it('fail to create report -> request error - check 3 retries', async () => {
        let expecterError = new Error('Failed to create report');
        requestStub.rejects({
            message: expecterError,
            statusCode: 500
        });

        let exception;
        try {
            await reporterConnector.createReport(jobConfig, test);
        } catch (e) {
            exception = e;
        }
        should.exist(exception);
        should.equal(expecterError, exception.message);
        requestStub.callCount.should.be.eql(3);
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
        requestStub.callCount.should.be.eql(3);
    });
});