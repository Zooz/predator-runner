const requestSender = require('../helpers/requestSender'),
    logger = require('../utils/logger');

let getTest = async (jobConfig) => {
    let options = {
        method: 'GET',
        url: `${jobConfig.predatorUrl}/tests/${jobConfig.testId}`,
        headers: {
            'x-runner-id': jobConfig.containerId
        }
    };
    logger.info(options, 'GET test file');
    try {
        const test = await requestSender.sendRequest(options);
        logger.info(`Request to ${options.url} succeeded with status code ${test.statusCode}`);
        logger.info({ test_file: test.body }, 'Retrieved test file successfully');
        jobConfig.revisionId = test.body.revision_id;
        jobConfig.testName = test.body.name;
        jobConfig.description = test.body.description;
        return test.body;
    } catch (error) {
        logger.error(`Request to ${options.url} failed on the ${error.response.retryCount} attempt with error ${error.response.body.message}`);
    }

};

module.exports = {
    getTest
};
