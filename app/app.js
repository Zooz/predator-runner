'use strict';

require('./utils/verifier').verifyEnvironmentVars();
let uuid = require('uuid/v4');
let runner = require('./models/runner');
let logger = require('./utils/logger');
let jobConfig = require('./config/jobConfig');
let reporterConnector = require('./connectors/reporterConnector');
let errorHandler = require('./handler/errorHandler');

const getContainerId = () => {
    let containerId = uuid();
    if (process.env.MARATHON_APP_ID) {
        let marathonAppId = process.env.MARATHON_APP_ID.split('/');
        containerId = marathonAppId[marathonAppId.length - 1];
    }
    return containerId;
};

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