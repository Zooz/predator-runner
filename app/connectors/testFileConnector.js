let requestSender = require('../helpers/requestSender');
let logger = require('../utils/logger');

let getTest = async (jobConfig) => {
    let options = {
        method: 'GET',
        url: jobConfig.performanceFrameworkAPIUrl + `/v1/tests/${jobConfig.testId}`,
        headers: {
            'x-zooz-request-id': `runner_${jobConfig.runId}`
        }
    };
    logger.info(options, 'GET test file');
    const test = await requestSender.sendRequest(options);
    logger.info({test_file: test}, 'Retrieved test file successfully');
    jobConfig.revisionId = test.revision_id;
    jobConfig.testName = test.name;
    jobConfig.description = test.description;
    return test;
};

module.exports = {
    getTest: getTest
};