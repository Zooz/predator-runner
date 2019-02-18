const path = require('path'),
    should = require('should'),
    predatorApiHelper = require('../../utils/predatorApiHelper'),
    runner = require('../../../app/models/runner'),
    simpleServerClient = require('../../utils/simpleServerClient'),
    defaults = require('../defaults');

let createTestResponse;
let testId;
let createJobResponse;
let jobId;
let customTestBody;
let testReport;

describe('Rampto and scenario weights', function () {
    const runId = `system-tester-${Date.now()}-${Math.random() * 14}`;
    let duration, arrivalRate, rampTo;

    before(function (done) {
        this.timeout(10000);

        setTimeout(async function () {
            const customTestPath = path.resolve(__dirname, '../../test-scripts/rampto_with_weights.json');
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
        rampTo = artilleryTest.config.phases[0].rampTo;
        const httpPoolSize = artilleryTest.config.http.pool;

        const jobConfig = {
            predatorUrl: process.env.PREDATOR_URL,
            testId,
            duration,
            arrivalRate,
            rampTo,
            httpPoolSize,
            runId,
            jobId
        };

        Object.assign(jobConfig, defaults.jobConfig);

        testReport = await runner.runTest(jobConfig);
        console.log('REPORT:', testReport);
    });

    it('Weighted scenarios', function () {
        should(testReport.codes['201']).greaterThan(testReport.codes['200'] * 4,
            'There should be atleast 4 times more 201 response codes than 200 response codes');
    });

    it('Rampto', function () {
        const maxNumberOfScenarios = duration * rampTo;
        const minNumberOfScenarios = duration * arrivalRate;
        should(testReport.scenariosCreated).lessThan(maxNumberOfScenarios,
            'There should be less scenarios than the max number of scenarios because use of rampto');
        should(testReport.scenariosCreated).greaterThan(minNumberOfScenarios,
            'There should be more scenarios than the min number of scenarios');
    });

    // it('Template strings', function () {
    //     const UUID4Regex = '[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}';
    //     const entries = server.get20EntriesFromDB();
    //     should(UUID4Regex.test(entries[0].id)).eql(true, 'ID should be UUID');
    //     should(Number.isInteger(entries[0].petNumber)).eql(true, 'petNumber should be a number');
    // });
});