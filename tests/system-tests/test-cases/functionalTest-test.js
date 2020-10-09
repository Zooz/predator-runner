const path = require('path'),
    should = require('should'),
    uuid = require('uuid/v4'),
    predatorApiHelper = require('../../utils/predatorApiHelper'),
    defaults = require('../defaults'),
    simpleServerClient = require('../../utils/simpleServerClient'),
    runner = require('../../../app/models/runner');

let createTestResponse;
let testId;
let createJobResponse;
let jobId;
let customTestBody;

describe('Functional test', function () {
    const reportId = uuid();
    let duration, arrivalCount, maxVusers;

    before(function (done) {
        this.timeout(10000);

        setTimeout(async function () {
            const customTestPath = path.resolve(__dirname, '../../test-scripts/simple_test_functional.json');
            customTestBody = require(customTestPath);

            createTestResponse = await predatorApiHelper.createTest(customTestBody);
            testId = createTestResponse.id;
            createJobResponse = await predatorApiHelper.createJob(testId, 'functional_test');
            jobId = createJobResponse.id;
            done();
        }, 500);
    });

    after(async function () {
        await predatorApiHelper.deleteJob(jobId);
        await simpleServerClient.deleteDB();
    });

    it('Runner should successfully run test', async function () {
        this.timeout(100000);
        const artilleryTest = customTestBody.artillery_test;
        duration = artilleryTest.config.phases[0].duration;
        arrivalCount = artilleryTest.config.phases[0].arrivalCount;
        maxVusers = artilleryTest.config.phases[0].maxVusers;
        const httpPoolSize = artilleryTest.config.http.pool;
        const containerId = uuid();

        const jobConfig = {
            predatorUrl: process.env.PREDATOR_URL,
            jobType: 'functional_test',
            testId,
            duration,
            arrivalCount,
            maxVusers,
            httpPoolSize,
            reportId,
            jobId,
            containerId
        };
        Object.assign(jobConfig, defaults.jobConfig);

        await runner.runTest(jobConfig);
    });

    it('Runner should send 2 requests in duration of test', async function () {
        let aggregatedReport = await predatorApiHelper.getAggregatedReports(testId, reportId);
        should(aggregatedReport.aggregate.scenariosCompleted).equal(2, 'should send 2 requests in 10 seconds');
    });
});
