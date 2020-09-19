'use strict';
const URL = require('url').URL;

const constants = require('../utils/consts');

let getPredatorUrlWithApiVersion = (predatorUrl) => {
    let predatorUrlObject = new URL(predatorUrl);

    if (predatorUrlObject.pathname === '/' || predatorUrlObject.pathname === '' || predatorUrlObject.pathname === undefined) {
        predatorUrlObject.pathname = '/v1';
    }

    return predatorUrlObject.toString();
};

let config = {
    environment: process.env.ENVIRONMENT,
    cluster: process.env.CLUSTER || 'default',
    logLevel: process.env.LOG_LEVEL || 'info',
    statsInterval: process.env.STATS_INTERVAL || 30,
    testId: process.env.TEST_ID,
    jobId: process.env.JOB_ID,
    jobType: process.env.JOB_TYPE || constants.LOAD_TEST,
    predatorUrl: getPredatorUrlWithApiVersion(process.env.PREDATOR_URL),
    duration: parseInt(process.env.DURATION),
    arrivalRate: parseInt(process.env.ARRIVAL_RATE) || undefined,
    arrivalCount: parseInt(process.env.ARRIVAL_COUNT) || undefined,
    rampTo: parseInt(process.env.RAMP_TO) || undefined,
    maxVusers: parseInt(process.env.MAX_VIRTUAL_USERS) || undefined,
    // WHY DO WE NEED EMAILS AND WEBHOOKS?
    emails: process.env.EMAILS ? process.env.EMAILS.split(';') : [],
    webhooks: process.env.WEBHOOKS ? process.env.WEBHOOKS.split(';') : [],
    httpPoolSize: process.env.HTTP_POOL_SIZE || 250,
    notes: process.env.NOTES,
    metricsPluginName: process.env.METRICS_PLUGIN_NAME,
    metricsExportConfig: process.env.METRICS_EXPORT_CONFIG,
    runId: process.env.RUN_ID,
    proxyUrl: process.env.PROXY_URL,
    delayRunnerMs: parseInt(process.env.DELAY_RUNNER_MS),
    reportId: process.env.REPORT_ID
};

module.exports = config;
