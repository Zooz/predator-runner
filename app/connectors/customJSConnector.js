const requestSender = require('../helpers/requestSender'),
    logger = require('../utils/logger');

let getFile = async (jobConfig, fileId) => {
    const url = jobConfig.predatorUrl + `/files/${fileId}`;
    const file = await getCustomJavascriptResource(url, 'GET', jobConfig.runId);
    return file;
};

let getProcessor = async (jobConfig, processorId) => {
    const url = jobConfig.predatorUrl + `/processors/${processorId}`;
    const processor = await getCustomJavascriptResource(url, 'GET', jobConfig.runId);
    return processor;
};

const getCustomJavascriptResource = async (url, method, runId) => {
    const options = {
        method,
        url,
        headers: {
            'x-zooz-request-id': `runner_${runId}`
        }
    };

    logger.info(options, 'GET custom javascript resource for test');
    const customJavascriptResource = await requestSender.sendRequest(options);
    logger.info({ custom_javascript_resource: customJavascriptResource }, 'Retrieved custom javascript resource successfully');
    return customJavascriptResource;
};

module.exports = {
    getFile,
    getProcessor
};
