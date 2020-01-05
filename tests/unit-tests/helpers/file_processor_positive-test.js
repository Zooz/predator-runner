const rewire = require('rewire'),
    should = require('should'),
    fs = require('fs'),
    runner = rewire('../../../app/models/runner'),
    path = require('path'),
    fileConector = require('../../../app/connectors/customJSConnector'),
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

    it('Should write new file and succeed', async () => {
        const writeFileToLocalFile = runner.__get__('writeFileToLocalFile');
        const jsContent = 'test content';
        const res = await writeFileToLocalFile(jsContent);
        should(res).eql(path.resolve(__dirname, '..', '..', '..', 'processor_file.js'));
        const content = fs.readFileSync(path.resolve(__dirname, '..', '..', '..', 'processor_file.js'), 'utf8');
        should(content).eql('test content');
    });

    it('Should get file from predator ', async () => {
        getRequestStub.resolves('File content');
        let res = await fileConector.getFile({runId: 'runId', predatorUrl: 'predatorUrl'}, 'file_id');
        should(getRequestStub.getCall(0).args[0].url).eql('predatorUrl/tests/file/file_id');
        should(res).eql('File content');
    });
});
