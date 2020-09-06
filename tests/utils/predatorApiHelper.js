const should = require('should'),
    request = require('requestxn'),
    URL = require('url').URL;

let predatorUrlObject = new URL(process.env.PREDATOR_URL);

if (predatorUrlObject.pathname === '/' || predatorUrlObject.pathname === '' || predatorUrlObject.pathname === undefined) {
    predatorUrlObject.pathname = '/v1';
}

const predatorUrlWithApiVersion = predatorUrlObject.toString();
module.exports.createTest = async (body) => {
    const options = {
        url: predatorUrlWithApiVersion + '/tests',
        method: 'POST',
        json: true,
        headers: {
            'x-runner-id': 'mickey'
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

module.exports.createProcessor = async (body) => {
    const options = {
        url: predatorUrlWithApiVersion + '/processors',
        method: 'POST',
        json: true,
        headers: {
            'x-runner-id': 'mickey'
        },
        body: body
    };

    try {
        let processor = await request(options);
        should.exist(processor);
        return processor;
    } catch (e) {
        console.log(e);
        should.not.exist(e);
    }
};

module.exports.createJob = async (testId, type = 'load_test') => {
    const options = {
        url: predatorUrlWithApiVersion + '/jobs',
        method: 'POST',
        json: true,
        headers: {
            'x-runner-id': 'mickey'
        },
        body: cronJobBody(testId, type)
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

module.exports.getAggregatedReports = async (testId, reportId) => {
    const options = {
        url: predatorUrlWithApiVersion + `/tests/${testId}/reports/${reportId}/aggregate`,
        method: 'GET',
        json: true,
        headers: {
            'x-runner-id': 'mickey'
        }
    };

    try {
        let report = await request(options);
        should.exist(report);
        return report;
    } catch (e) {
        console.log(e);
        should.not.exist(e);
    }
};

module.exports.deleteJob = async (jobId) => {
    const options = {
        url: predatorUrlWithApiVersion + `/jobs/${jobId}`,
        method: 'DELETE',
        headers: {
            'x-runner-id': 'mickey'
        }
    };

    await request(options);
};

const cronJobBody = (testId, type) => {
    return {
        'test_id': `${testId}`,
        'type': type,
        'arrival_rate': 10,
        'duration': 10,
        'notes': 'Job that will not run',
        'environment': 'test',
        'run_immediately': false,
        'cron_expression': '0 0 1 1 *',
        'emails': [],
        'webhooks': []
    };
};