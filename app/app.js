'use strict';
require('./utils/verifier').verifyEnvironmentVars();

const uuid = require('uuid/v4');
const semver = require('semver');

const runner = require('./models/runner'),
    logger = require('./utils/logger'),
    jobConfig = require('./config/jobConfig'),
    reporterConnector = require('./connectors/reporterConnector'),
    errorHandler = require('./handler/errorHandler'),
    { version: PREDATOR_RUNNER_VERSION } = require('../package.json');

const RUNNER_TIMEOUT_GRACE_MS = 300;

const getContainerId = () => {
    let containerId = uuid();
    if (process.env.MARATHON_APP_ID) {
        let marathonAppId = process.env.MARATHON_APP_ID.split('/');
        containerId = marathonAppId[marathonAppId.length - 1];
    }
    return containerId;
};

function verifyPredatorVersion() {
    if (semver.major(PREDATOR_RUNNER_VERSION) === semver.major(jobConfig.predatorVersion) &&
        semver.minor(PREDATOR_RUNNER_VERSION) === semver.minor(jobConfig.predatorVersion)) {
        return;
    }
    logger.error('Predator Runner and Predator must match in major and minor version, please change runner / predator version');
    throw new Error('Bad Predator-Runner version');
}

let start = async () => {
    if (jobConfig.delayRunnerMs > 0) {
        await timeout(jobConfig.delayRunnerMs);
    }
    jobConfig.containerId = getContainerId();
    try {
        logger.info({ runner_config: jobConfig }, 'Initialized test runner');

        process.on('SIGTERM', async function () {
            logger.warn('Test aborted');
            await reporterConnector.postStats(jobConfig, {
                phase_status: 'aborted',
                data: JSON.stringify(jobConfig)
            });
            process.exit(1);
        });
        process.on('SIGUSR1', async function() {
            logger.info('Runner exceeded test duration, sending DONE status and existing');
            await reporterConnector.postStats(jobConfig, {
                phase_status: 'done',
                data: JSON.stringify({ message: 'Test Finished' })
            });
            process.exit(1);
        });
        verifyPredatorVersion();
        setTimeout(function() {
            process.kill(process.pid, 'SIGUSR1');
        }, (jobConfig.duration * 1000) + jobConfig.delayRunnerMs + RUNNER_TIMEOUT_GRACE_MS);
        await runner.runTest(jobConfig);
        logger.info('Finished running test successfully');
        process.exit(0);
    } catch (err) {
        await errorHandler.handleError(jobConfig, err);
        process.exit(1);
    }
};

function timeout(ms) {
    logger.info(`sleeping for ${ms} ms before starting runner`);
    return new Promise(resolve => setTimeout(resolve, ms));
}

start();
