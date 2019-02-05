const should = require('should'),
    request = require('requestxn');

const PREDATOR_URL = process.env.PREDATOR_URL;

module.exports.createTest = async (body) => {
    const options = {
        url: PREDATOR_URL + '/v1/tests',
        method: 'POST',
        json: true,
        headers: {
            'x-zooz-request-id': 'mickey'
        },
        body: body
    };

    try {
        let testFile = await request(options);
        should.exist(testFile);
        return testFile;
    } catch (e) {
        console.log(e);
        should.not.exist(e);
    }
};