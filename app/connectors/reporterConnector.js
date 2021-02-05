const requestSender = require('../helpers/requestSender');
const logger = require('../utils/logger');


let subscribeToReport = async (jobConfig) => {
    console.table(jobConfig);
    const options = {
        url: `${jobConfig.predatorUrl}/tests/${jobConfig.testId}/reports/${jobConfig.reportId}/subscribe`,
        method: 'POST',
        headers: {
            'x-runner-id': jobConfig.containerId
        },
        json: {}
    };
    try {
        const response = await requestSender.sendRequest(options);
        logger.info(`Request to ${options.url} succeeded with status code ${response.statusCode}`);
    } catch (error) {
        logger.error(`Request to ${options.url} failed on the ${error.response.retryCount} attempt with error ${error.response.body.message}`);
    }
};

let postStats = async (jobConfig, stats) => {
    let defaultBody = {
        runner_id: jobConfig.containerId,
        stats_time: Date.now().toString()
    };

    const requestBody = Object.assign(defaultBody, stats);

    let options = {
        url: `${jobConfig.predatorUrl}/tests/${jobConfig.testId}/reports/${jobConfig.reportId}/stats`,
        method: 'POST',
        headers: {
            'x-runner-id': jobConfig.containerId
        },
        json: requestBody
    };
    try {
        const response = await requestSender.sendRequest(options);
        logger.info(`Request to ${options.url} succeeded with status code ${response.statusCode}`);
    } catch (error) {
        logger.error(`Request to ${options.url} failed on the ${error.response.retryCount} attempt with error ${error.response.body.message}`);
    }
};

module.exports = {
    postStats,
    subscribeToReport
};
