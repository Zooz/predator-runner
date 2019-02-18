const path = require('path'),
    should = require('should'),
    predatorApiHelper = require('../../utils/predatorApiHelper'),
    defaults = require('../defaults'),
    simpleServerClient = require('../../utils/simpleServerClient'),
    runner = require('../../../app/models/runner');

let createTestResponse;
let testId;
let createJobResponse;
let jobId;
let customTestBody;
let testReport;

describe('Before test flow', function () {
    const runId = `system-tester-${Date.now()}-${Math.random() * 14}`;
    let duration, arrivalRate;

    before(function (done) {
        this.timeout(10000);
        setTimeout(async function () {
            const customTestPath = path.resolve(__dirname, '../../test-scripts/before_test.json');
            customTestBody = require(customTestPath);

            createTestResponse = await predatorApiHelper.createTest(customTestBody);
            testId = createTestResponse.id;
            createJobResponse = await predatorApiHelper.createJob(testId);
            jobId = createJobResponse.id;
            done();
        }, 500);
    });

    after(async function () {
        await simpleServerClient.deleteDB();
    });

    it('Runner should successfully run test', async function () {
        this.timeout(100000);
        const artilleryTest = customTestBody.artillery_test;
        duration = artilleryTest.config.phases[0].duration;
        arrivalRate = artilleryTest.config.phases[0].arrivalRate;
        const httpPoolSize = artilleryTest.config.http.pool;

        let jobConfig = {
            predatorUrl: process.env.PREDATOR_URL,
            testId,
            duration,
            arrivalRate,
            httpPoolSize,
            runId,
            jobId
        };

        Object.assign(jobConfig, defaults.jobConfig);

        testReport = await runner.runTest(jobConfig);
        console.log('REPORT:', testReport);
    });

    it('All requests should return response code 200', function () {
        const expectedAmountResponses = duration * arrivalRate;
        should(testReport.scenariosCompleted).eql(expectedAmountResponses);
        should(testReport.codes[200]).eql(expectedAmountResponses);
    });
});