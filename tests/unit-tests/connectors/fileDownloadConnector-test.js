const should = require('should'),
    sinon = require('sinon'),
    uuid = require('uuid');

const request = require('../../../app/helpers/requestSender'),
    fileDownloadConnector = require('../../../app/connectors/fileDownloadConnector');
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

    it('successfully get processor', async () => {
        const processor = {
            id: uuid(),
            javascript: 'module.exports.mickey = 1',
            description: 'this is a test',
            name: 'test1'
        };
        requestStub.resolves({
            body: processor,
            statsCude: 200
        });

        let exception;
        try {
            await fileDownloadConnector.getProcessor(jobConfig, processor.id);
        } catch (e) {
            exception = e;
        }
        should.not.exist(exception);
        requestStub.calledOnce.should.eql(true);
    });

    it('fail to get test processor -> request error', async () => {
        let expectedError = new Error('Failed to retrieve processor');
        requestStub.rejects(expectedError);

        let exception;
        try {
            await fileDownloadConnector.getProcessor(jobConfig, uuid());
        } catch (e) {
            exception = e;
        }
        should.exist(exception);
        exception.should.eql(expectedError);
    });
});
