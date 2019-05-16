const rewire = require('rewire'),
    should = require('should'),
    fs = require('fs'),
    runner = rewire('../../../app/models/runner'),
    sinon = require('sinon');

describe('Create file tests negative', () => {
    let writeFileSyncStub,
        sandbox;
    before(() => {
        sandbox = sinon.sandbox.create();
        writeFileSyncStub = sandbox.stub(fs, 'writeFileSync');
    });
    after(() => {
        sandbox.restore();
    });

    it('Should write new file and fail with exception ', async () => {
        const writeFileToLocalFile = runner.__get__('writeFileToLocalFile');
        const base64String = Buffer.from('test content', 'utf8').toString('base64');
        writeFileSyncStub.throws('Fail to write file');
        try {
            await writeFileToLocalFile(base64String);
            should.fail('Should throw error');
        } catch (err) {
            should(err.message).eql('Something went wrong. error: Fail to write file');
        }
    });
    it('Should write new file and fail with exception ', async () => {
        const writeFileToLocalFile = runner.__get__('writeProcessorFile');
        try {
            await writeFileToLocalFile(undefined);
            should.fail('Should throw error');
        } catch (err) {
            should(err.message).eql('Something went wrong with file content.');
        }
    });
});
