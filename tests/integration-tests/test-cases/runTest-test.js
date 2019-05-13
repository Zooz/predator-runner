const nock = require('nock'),
    uuid = require('uuid/v4'),
    path = require('path'),
    should = require('should'),
    runner = require('../../../app/models/runner');

const PREDATOR_URL = process.env.PREDATOR_URL;
const duration = 10;
const arrivalRate = 10;
const runId = process.env.RUN_ID;

describe('Successfully run a custom test', function () {
    const testId = uuid();
    let testReport;

    before(async function () {
        const customTestPath = path.resolve(__dirname, '../../test-scripts/simple_test.json');
        const customTestBody = require(customTestPath);

        customTestBody.artillery_test = customTestBody.artillery_test;

        nock(PREDATOR_URL)
            .get(`/tests/${testId}`)
            .reply(200, customTestBody);

        nock(PREDATOR_URL)
            .post(`/tests/${testId}/reports`)
            .times(20)
            .reply(201, {message: 'OK'});

        nock(PREDATOR_URL)
            .post(`/tests/${testId}/reports/${runId}/stats`)
            .times(20)
            .reply(201, {message: 'OK'});
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
        nock(PREDATOR_URL)
            .get(`/tests/${testId}`)
            .reply(200, { });

        nock(PREDATOR_URL)
            .post(`/tests/${testId}/reports`)
            .times(20)
            .reply(400, {error: 'ERROR'});

        nock(PREDATOR_URL)
            .post(`/tests/${testId}/reports/${runId}/stats`)
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

        customTestBody.artillery_test = customTestBody.artillery_test;

        nock(PREDATOR_URL)
            .get(`/tests/${testId}`)
            .reply(200, customTestBody);

        nock(PREDATOR_URL)
            .post(`/tests/${testId}/reports`)
            .times(20)
            .reply(201, {message: 'OK'});

        nock(PREDATOR_URL)
            .post(`/tests/${testId}/reports/${runId}/stats`)
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
        nock(PREDATOR_URL)
            .get(`/tests/${testId}`)
            .reply(404, { });

        nock(PREDATOR_URL)
            .post(`/tests/${testId}/reports`)
            .times(20)
            .reply(201, {message: 'OK'});

        nock(PREDATOR_URL)
            .post(`/tests/${testId}/reports/${runId}/stats`)
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
            should.equal(e.statusCode, 404, 'Error returned should be with status code 404');
        }
    });
});

describe('Fail to get file ,file not found', function () {
    const fileId = uuid();
    const testId = uuid();
    before(async function () {
        const customTestPath = path.resolve(__dirname, '../../test-scripts/simple_test.json');
        const customTestBody = require(customTestPath);
        const testBody = Object.assign({}, customTestBody);
        testBody.file_id = fileId;
        nock(PREDATOR_URL)
            .get(`/tests/${testId}`)
            .reply(200, testBody);
        nock(PREDATOR_URL)
            .get(`/tests/file/${fileId}`)
            .reply(404, {});
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
            should.equal(e.statusCode, 404, 'Error returned should be with status code 404');
        }
    });
});
