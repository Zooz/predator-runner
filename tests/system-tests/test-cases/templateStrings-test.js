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

describe('Template strings', function () {
    const reportId = uuid();
    let duration, arrivalRate, rampTo;

    before(function (done) {
        this.timeout(10000);
        setTimeout(async function () {
            const customTestPath = path.resolve(__dirname, '../../test-scripts/template_strings.json');
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

    it('Runner should successfully run test', async function () {
        this.timeout(100000);
        const artilleryTest = customTestBody.artillery_test;
        duration = artilleryTest.config.phases[0].duration;
        arrivalRate = artilleryTest.config.phases[0].arrivalRate;
        rampTo = artilleryTest.config.phases[0].rampTo;
        const httpPoolSize = artilleryTest.config.http.pool;
        const containerId = uuid();

        const jobConfig = {
            predatorUrl: process.env.PREDATOR_URL,
            testId,
            duration,
            arrivalRate,
            rampTo,
            httpPoolSize,
            reportId,
            jobId,
            containerId
        };

        Object.assign(jobConfig, defaults.jobConfig);

        testReport = await runner.runTest(jobConfig);
    });

    it('Template strings in headers', async function () {
        const lastRequest = await simpleServerClient.getIncomingRequest();

        const variableHeader = parseInt(lastRequest.headers['variable-header']);
        should(Number.isInteger(variableHeader)).eql(true, 'variable-header should be a number');
        should(variableHeader).greaterThanOrEqual(0).lessThanOrEqual(10, 'variable-header should be between 0 and 10');

    });

    it('Template strings in body', async function () {
        const entries = await simpleServerClient.getPets();
        const entry = entries[0];

        const UUID4Regex = RegExp('[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}');
        should(UUID4Regex.test(entry.id)).eql(true, 'ID should be UUID');

        const name = entry.name;
        should(name.length).greaterThanOrEqual(0).lessThanOrEqual(15, 'name length should be between 0 and 15');

        const petNumber = parseInt(entry.petNumber);
        should(Number.isInteger(petNumber)).eql(true, 'petNumber should be a number');
        should(petNumber).greaterThanOrEqual(0).lessThanOrEqual(10, 'petNumber should be between 0 and 10');

        const date = new Date(parseInt(entry.DOB));
        should.exist(date, 'DOB should be valid timestamp');
    });
});
