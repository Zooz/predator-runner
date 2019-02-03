const should = require('should'),
    request = require('requestxn');

const TESTS_API_URL = process.env.TESTS_API_URL;

module.exports.createTest = async (body) => {
    const options = {
        url: TESTS_API_URL + '/v1/tests',
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