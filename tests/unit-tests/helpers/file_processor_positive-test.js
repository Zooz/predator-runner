const should = require('should'),
    fileDownloadConnector = require('../../../app/connectors/fileDownloadConnector'),
    requestSender = require('../../../app/helpers/requestSender'),
    sinon = require('sinon');

describe('Create file tests', () => {
    let getRequestStub,
        sandbox;
    before(() => {
        sandbox = sinon.sandbox.create();
        getRequestStub = sandbox.stub(requestSender, 'sendRequest');
    });

    after(() => {
        sandbox.restore();
    });

    it('Should get file from predator ', async () => {
        getRequestStub.resolves('File content');
        let res = await fileDownloadConnector.getFile({ runId: 'runId', predatorUrl: 'predatorUrl' }, 'file_id');
        should(getRequestStub.getCall(0).args[0].url).eql('predatorUrl/files/file_id');
        should(res).eql('File content');
    });
});
