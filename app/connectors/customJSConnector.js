const requestSender = require('../helpers/requestSender'),
    logger = require('../utils/logger');

let getFile = async (jobConfig, fileId) => {
    let options = {
        method: 'GET',
        url: jobConfig.predatorUrl + `/tests/file/${fileId}`,
        headers: {
            'x-zooz-request-id': `runner_${jobConfig.runId}`
        }
    };
    logger.info(options, 'GET file for test');
    const file = await requestSender.sendRequest(options);
    logger.info({ test_file: file }, 'Retrieved test file successfully');
    return file;
};

let getProcessor = async (jobConfig, processorId) => {
    let options = {
        method: 'GET',
        url: jobConfig.predatorUrl + `/processors/${processorId}`,
        headers: {
            'x-zooz-request-id': `runner_${jobConfig.runId}`
        }
    };
    logger.info(options, 'GET processor for test');
    const processor = await requestSender.sendRequest(options);
    logger.info({ processor: processor }, 'Retrieved processor successfully');
    return processor;
};

module.exports = {
    getFile,
    getProcessor
};
