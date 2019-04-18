const path = require('path'),
    should = require('should'),
    colors = require('colors'),
    uuid = require('uuid/v4'),
    predatorApiHelper = require('../../utils/predatorApiHelper'),
    defaults = require('../defaults'),
    simpleServerClient = require('../../utils/simpleServerClient'),
    runner = require('../../../app/models/runner');

const LOCAL_TEST = process.env.LOCAL_TEST || false;

let createTestResponse;
let testId;
let createJobResponse;
let jobId;
let customTestBody;

describe('Runner performance validations', function () {
    const runId = `system-tester-${Date.now()}-${Math.random() * 14}`;
    before(function (done) {
        this.timeout(10000);

        setTimeout(async function () {
            const customTestPath = path.resolve(__dirname, '../../test-scripts/simple_test.json');
            customTestBody = require(customTestPath);

            createTestResponse = await predatorApiHelper.createTest(customTestBody);
            testId = createTestResponse.id;
            createJobResponse = await predatorApiHelper.createJob(testId);
            jobId = createJobResponse.id;
            done();
        }, 500);
    });

    after(async function () {
        await predatorApiHelper.deleteJob(jobId);
        await simpleServerClient.deleteDB();
    });

    //  IMPORTANT: Test can fail. Makes sure that runner performance is up to standard
    it('Should support minimum RPS when testing a local server that returns a simple response', async function () {
        this.timeout(100000);
        const artilleryTest = customTestBody.artillery_test;
        const duration = artilleryTest.config.phases[0].duration;
        const arrivalRate = artilleryTest.config.phases[0].arrivalRate;
        const httpPoolSize = artilleryTest.config.http.pool;
        const containerId = uuid();
        const jobConfig = {
            predatorUrl: process.env.PREDATOR_URL,
            testId,
            duration,
            arrivalRate,
            httpPoolSize,
            runId,
            jobId,
            containerId
        };

        Object.assign(jobConfig, defaults.jobConfig);

        const report = await runner.runTest(jobConfig);
        try {
            if (LOCAL_TEST) {
                should(report.rps.mean).aboveOrEqual(650, 'Local test should have atleast 600 RPS');
            } else {
                should(report.rps.mean).aboveOrEqual(900, 'Remote test should have atleast 900 RPS');
            }

            const expected200Codes = duration * arrivalRate;
            should.equal(report.codes['200'], expected200Codes, 'All requests should return 200');
            console.log(colors.green('Performance test passes!'));
        } catch (e) {
            console.log(colors.red.bold('Performance test failed! Please check that runner performance did not regress.'));
        }
    });
});