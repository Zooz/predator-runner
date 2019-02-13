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

module.exports.createJob = async (testId) => {
    const options = {
        url: PREDATOR_URL + '/v1/jobs',
        method: 'POST',
        json: true,
        headers: {
            'x-zooz-request-id': 'mickey'
        },
        body: cronJobBody(testId)
    };

    try {
        let job = await request(options);
        should.exist(job);
        return job;
    } catch (e) {
        console.log(e);
        should.not.exist(e);
    }
};

const cronJobBody = (testId) => {
    return {
        'test_id': `${testId}`,
        'arrival_rate': 10,
        'duration': 10,
        'notes': 'Job that will never run',
        'environment': 'test',
        'run_immediately': false,
        'cron_expression': '0 0 * 1 *',
        'emails': [],
        'webhooks': []
    };
};