const nock = require('nock'),
    uuid = require('uuid/v4'),
    path = require('path'),
    should = require('should'),
    runner = require('../../../app/models/runner');

const TESTS_API_URL = process.env.TESTS_API_URL;
const REPORTER_URL = process.env.REPORTER_URL;
const duration = 10;
const arrivalRate = 10;
const runId = process.env.RUN_ID;

describe('Successfully run a custom test', function () {
    const testId = uuid();
    let testReport;

    before(async function () {
        const customTestPath = path.resolve(__dirname, '../../test-scripts/simple_test.json');
        const customTestBody = require(customTestPath);

        customTestBody.artillery_json = customTestBody.artillery_test;

        nock(TESTS_API_URL)
            .get(`/v1/tests/${testId}`)
            .reply(200, customTestBody);

        nock(REPORTER_URL)
            .post(`/v1/tests/${testId}/reports`)
            .times(20)
            .reply(201, {message: 'OK'});

        nock(REPORTER_URL)
            .post(`/v1/tests/${testId}/reports/${runId}/stats`)
            .times(20)
            .reply(201, {message: 'OK'});
    });

    it('Run test', async function () {
        this.timeout(100000);
        const jobConfig = {
            performanceFrameworkAPIUrl: process.env.TESTS_API_URL,
            reporterUrl: process.env.REPORTER_URL,
            testId,
            duration,
            arrivalRate,
            runId
        };

        testReport = await runner.runTest(jobConfig);
        console.log('REPORT:', testReport);
    });

    it('Test should finish successfully', function () {
        should.exist(testReport);

        const expected200Codes = duration * arrivalRate;
        should.equal(testReport.codes['200'], expected200Codes, 'All requests should return 200 resonse codes');
    });
});

describe('Fail to run a custom test - report not created', function () {
    const testId = uuid();

    before(async function () {
        nock(TESTS_API_URL)
            .get(`/v1/tests/${testId}`)
            .reply(200, { });

        nock(REPORTER_URL)
            .post(`/v1/tests/${testId}/reports`)
            .times(20)
            .reply(400, {error: 'ERROR'});

        nock(REPORTER_URL)
            .post(`/v1/tests/${testId}/reports/${runId}/stats`)
            .times(20)
            .reply(201, {message: 'OK'});
    });

    it('Run test', async function () {
        this.timeout(100000);
        const duration = 10;
        const arrivalRate = 10;

        const jobConfig = {
            predatorUrl: process.env.PREDATOR_URL,
            testId,
            duration,
            arrivalRate,
            runId
        };

        try {
            const report = await runner.runTest(jobConfig);
            should.not.exist(report);
        } catch (e) {
            should.exist(e);
            should.equal(e.statusCode, 400, 'Error returned should be with status code 400');
        }
    });
});

describe('Fail to run a custom test - fail to send final report stats to reporter', function () {
    const testId = uuid();

    before(async function () {
        const customTestPath = path.resolve(__dirname, '../../test-scripts/simple_test.json');
        const customTestBody = require(customTestPath);

        customTestBody.artillery_json = customTestBody.artillery_test;

        nock(TESTS_API_URL)
            .get(`/v1/tests/${testId}`)
            .reply(200, customTestBody);

        nock(REPORTER_URL)
            .post(`/v1/tests/${testId}/reports`)
            .times(20)
            .reply(201, {message: 'OK'});

        nock(REPORTER_URL)
            .post(`/v1/tests/${testId}/reports/${runId}/stats`)
            .times(20)
            .reply(400, {error: 'ERROR'});
    });

    it('Run test', async function () {
        this.timeout(100000);
        const jobConfig = {
            predatorUrl: process.env.PREDATOR_URL,
            testId,
            duration,
            arrivalRate,
            runId
        };

        try {
            const report = await runner.runTest(jobConfig);
            should.not.exist(report);
        } catch (e) {
            should.exist(e);
            should.equal(e.statusCode, 400, 'Error returned should be with status code 400');
        }
    });
});

describe('Fail to run a custom test - test not found', function () {
    const testId = uuid();

    before(async function () {
        nock(TESTS_API_URL)
            .get(`/v1/tests/${testId}`)
            .reply(404, { });

        nock(REPORTER_URL)
            .post(`/v1/tests/${testId}/reports`)
            .times(20)
            .reply(201, {message: 'OK'});

        nock(REPORTER_URL)
            .post(`/v1/tests/${testId}/reports/${runId}/stats`)
            .times(20)
            .reply(201, {message: 'OK'});
    });

    it('Run test', async function () {
        this.timeout(100000);
        const duration = 10;
        const arrivalRate = 10;

        const jobConfig = {
            testsAPIUrl: process.env.TESTS_API_URL,
            reporterUrl: process.env.REPORTER_URL,
            testId,
            duration,
            arrivalRate,
            runId
        };

        try {
            const report = await runner.runTest(jobConfig);
            should.not.exist(report);
        } catch (e) {
            should.exist(e);
            should.equal(e.statusCode, 404, 'Error returned should be with status code 404');
        }
    });
});