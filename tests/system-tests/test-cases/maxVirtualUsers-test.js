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
let testReport;

describe('Max virtual users', function () {
    const reportId = uuid();
    let duration, arrivalRate, maxVusers;

    before(function (done) {
        this.timeout(10000);

        setTimeout(async function () {
            const customTestPath = path.resolve(__dirname, '../../test-scripts/max_virtual_users.json');
            customTestBody = require(customTestPath);

            createTestResponse = await predatorApiHelper.createTest(customTestBody);
            testId = createTestResponse.id;
            createJobResponse = await predatorApiHelper.createJob(testId);
            jobId = createJobResponse.id;

            const reportBody = {
                report_id: reportId,
                job_id: jobId,
                revision_id: createTestResponse.revision_id,
                test_type: customTestBody.type,
                test_name: customTestBody.name,
                test_description: customTestBody.description,
                start_time: Date.now().toString(),
                runner_id: `x-mickey-${Date.now().toString()}`
            };

            await predatorApiHelper.createReport(testId, reportBody);
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
        arrivalRate = artilleryTest.config.phases[0].arrivalRate;
        maxVusers = artilleryTest.config.phases[0].maxVusers;
        const httpPoolSize = artilleryTest.config.http.pool;
        const containerId = uuid();

        const jobConfig = {
            predatorUrl: process.env.PREDATOR_URL,
            testId,
            duration,
            arrivalRate,
            maxVusers,
            httpPoolSize,
            reportId,
            jobId,
            containerId
        };
        Object.assign(jobConfig, defaults.jobConfig);

        testReport = await runner.runTest(jobConfig);
    });

    it('Runner should avoid scenarios if arrival rate is too high for service to handle', async function () {
        let aggregatedReport = await predatorApiHelper.getAggregatedReports(testId, reportId);
        should(aggregatedReport.aggregate.scenariosAvoided).above(0, 'Should avoid some scenarios');
    });
});

describe('Heavy load test without max virtual users', function () {
    const reportId = uuid();
    let duration, arrivalRate;

    before(function (done) {
        this.timeout(10000);

        setTimeout(async function () {
            const customTestPath = path.resolve(__dirname, '../../test-scripts/max_virtual_users.json');
            customTestBody = require(customTestPath);
            delete customTestBody.artillery_test.config.phases[0].maxVusers;

            createTestResponse = await predatorApiHelper.createTest(customTestBody);
            testId = createTestResponse.id;
            createJobResponse = await predatorApiHelper.createJob(testId);
            jobId = createJobResponse.id;

            const reportBody = {
                report_id: reportId,
                job_id: jobId,
                revision_id: createTestResponse.revision_id,
                test_type: customTestBody.type,
                test_name: customTestBody.name,
                test_description: customTestBody.description,
                start_time: Date.now().toString(),
                runner_id: `x-mickey-${Date.now().toString()}`
            };

            await predatorApiHelper.createReport(testId, reportBody);
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
        arrivalRate = artilleryTest.config.phases[0].arrivalRate;
        const httpPoolSize = artilleryTest.config.http.pool;
        const containerId = uuid();

        const jobConfig = {
            predatorUrl: process.env.PREDATOR_URL,
            testId,
            duration,
            arrivalRate,
            httpPoolSize,
            reportId,
            jobId,
            containerId

        };
        Object.assign(jobConfig, defaults.jobConfig);

        testReport = await runner.runTest(jobConfig);
    });

    it('Runner should not avoid scenarios', async function () {
        let aggregatedReport = await predatorApiHelper.getAggregatedReports(testId, reportId);
        should(aggregatedReport.aggregate.scenariosAvoided).eql(0, 'Should not avoid any scenarios');
    });
});
