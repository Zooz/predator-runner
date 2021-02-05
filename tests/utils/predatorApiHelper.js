const should = require('should'),
    got = require('got'),
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
        responseType: 'json',
        json: body,
        headers: {
            'x-runner-id': 'mickey'
        },
    };

    try {
        let testFile = await got(options);
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
        responseType: 'json',
        json: body,
        headers: {
            'x-runner-id': 'mickey'
        },
    };

    try {
        let processor = await got(options);
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
        responseType: 'json',
        json: cronJobBody(testId, type),
        headers: {
            'x-runner-id': 'mickey'
        },
    };

    try {
        let job = await got(options);
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
        responseType: 'json',
        headers: {
            'x-runner-id': 'mickey'
        }
    };

    try {
        let report = await got(options);
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
        responseType: 'json',
        headers: {
            'x-runner-id': 'mickey'
        }
    };

    await got(options);
};

module.exports.createReport = async (testId, body) => {
    const options = {
        url: predatorUrlWithApiVersion + `/tests/${testId}/reports`,
        method: 'POST',
        responseType: 'json',
        headers: {
            'x-runner-id': 'mickey'
        },
        json: body
    };

    await got(options);
};

const cronJobBody = (testId, type) => {
    return {
        test_id: `${testId}`,
        type: type,
        arrival_rate: 10,
        arrival_count: 10,
        duration: 10,
        notes: 'Job that will not run',
        environment: 'test',
        run_immediately: false,
        cron_expression: '0 0 1 1 *'
    };
};