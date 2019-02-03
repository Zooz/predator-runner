'use strict';

require('./utils/verifier').verifyEnvironmentVars();
let runner = require('./models/runner');
let logger = require('./utils/logger');
let jobConfig = require('./config/jobConfig');
let reporterConnector = require('./connectors/reporterConnector');
let errorHandler = require('./handler/errorHandler');

const getRunId = () => {
    let runId;
    if (process.env.MARATHON_APP_ID) {
        let marathonAppId = process.env.MARATHON_APP_ID.split('/');
        runId = marathonAppId[marathonAppId.length - 1];
    } else {
        runId = process.env.RUN_ID;
    }

    if (!runId) {
        throw new Error('Missing mandatory variable: RUN_ID');
    }

    return runId;
};

let start = async () => {
    try {
        jobConfig.runId = getRunId();
        logger.info({runner_config: jobConfig}, 'Initialized test runner');

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

start();