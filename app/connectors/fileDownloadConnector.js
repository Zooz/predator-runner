const requestSender = require('../helpers/requestSender'),
    logger = require('../utils/logger');

let getFile = async (jobConfig, fileId) => {
    const url = jobConfig.predatorUrl + `/files/${fileId}`;
    const file = await downloadFileResource(url, 'GET', jobConfig.runId);
    return file;
};

let getProcessor = async (jobConfig, processorId) => {
    const url = jobConfig.predatorUrl + `/processors/${processorId}`;
    const processor = await downloadFileResource(url, 'GET', jobConfig.runId);
    return processor;
};

const downloadFileResource = async (url, method, runId) => {
    const options = {
        method,
        url,
        headers: {
            'x-zooz-request-id': `runner_${runId}`
        }
    };

    logger.info(options, 'Download file resource from predator');
    const resource = await requestSender.sendRequest(options);
    logger.info({ resource }, 'Retrieved resource file from predator');
    return resource;
};

module.exports = {
    getFile,
    getProcessor
};
