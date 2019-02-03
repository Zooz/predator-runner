let sinon = require('sinon');
let should = require('should');
let proxyquire = require('proxyquire');
let _ = require('lodash');

let metricsModulePath = '../../../app/helpers/runnerMetrics.js';

let logger = require('../../../app/utils/logger');

let metricsPrinted = {
    'cpu': '20.793%',
    'memory': '56.703125MB',
    'ctime': 2.96,
    'elapsed': 1527444115000,
    'timestamp': 51486300,
    'ppid': 0
};

let metricsReturned = {
    'cpu': '20.793',
    'memory': '84841255.703125',
    'ctime': 2.96,
    'elapsed': 1527444115000,
    'timestamp': 51486300,
    'ppid': 0
};

describe('Metrics printer test', () => {
    let sandbox, loggerInfoStub;

    before(() => {
        sandbox = sinon.createSandbox();
        loggerInfoStub = sandbox.stub(logger, 'info');
    });

    beforeEach(() => {
        sandbox.resetHistory();
    });

    after(() => {
        sandbox.restore();
    });

    it('Should successfully retrieve metrics.js', async () => {
        let pidusageStub = sinon.stub().resolves(metricsReturned);
        const metricsModule = proxyquire(metricsModulePath, {
            'pidusage': pidusageStub
        });

        let runnerMetrics = await metricsModule.getMetrics();
        should(runnerMetrics).eql(metricsReturned);
    });

    it('Should successfully print metrics.js', async () => {
        let pidusageStub = sinon.stub().resolves(metricsPrinted);
        const metricsModule = proxyquire(metricsModulePath, {
            'pidusage': pidusageStub
        });

        let runnerMetrics = await metricsModule.getMetrics();
        metricsModule.printMetrics(runnerMetrics);
        should(loggerInfoStub.args[0][0]).eql(metricsPrinted);
    });

    it('Should fail to retrieve metrics.js', async () => {
        let expectedError = new Error('Pid does not exist');
        let pidusageStub = sinon.stub().rejects(expectedError);
        const metricsModule = proxyquire(metricsModulePath, {
            'pidusage': pidusageStub
        });
        try {
            let runnerMetrics = await metricsModule.getMetrics();
            should.not.exist(runnerMetrics);
        } catch (e) {
            should(e).eql(expectedError);
        }
    });
});