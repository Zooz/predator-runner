const path = require('path'),
    should = require('should'),
    testsApiHelper = require('../../utils/testsApiHelper'),
    defaults = require('../defaults'),
    simpleServerClient = require('../../utils/simpleServerClient'),
    runner = require('../../../app/models/runner');

const runId = process.env.RUN_ID;

let createTestResponse, testId;
let customTestBody;
let testReport;

describe('Max virtual users', function () {
    let duration, arrivalRate;

    before(function (done) {
        this.timeout(10000);

        setTimeout(async function () {
            const customTestPath = path.resolve(__dirname, '../../test-scripts/max_virtual_users.json');
            customTestBody = require(customTestPath);

            createTestResponse = await testsApiHelper.createTest(customTestBody);
            testId = createTestResponse.id;
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

        const jobConfig = {
            predatorUrl: process.env.PREDATOR_URL,
            testId,
            duration,
            arrivalRate,
            httpPoolSize,
            runId
        };
        Object.assign(jobConfig, defaults.jobConfig);

        testReport = await runner.runTest(jobConfig);
        console.log('REPORT:', testReport);
    });

    it('Runner should avoid scenarios if arrival rate is too high for service to handle', function () {
        should(testReport.scenariosAvoided).above(0, 'Should avoid some scenarios');
    });

    it('Median should not be impacted', function () {
        should(testReport.latency.median).lessThan(20, 'Median request latency should stay low');
    });
});