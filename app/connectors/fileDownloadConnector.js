const requestSender = require('../helpers/requestSender'),
    logger = require('../utils/logger');

let getFile = async (jobConfig, fileId) => {
    const url = jobConfig.predatorUrl + `/files/${fileId}`;
    const file = await downloadFileResource(url, 'GET', jobConfig.reportId);
    return file;
};

let getProcessor = async (jobConfig, processorId) => {
    const url = jobConfig.predatorUrl + `/processors/${processorId}`;
    const processor = await downloadFileResource(url, 'GET', jobConfig.reportId);
    return processor;
};

const downloadFileResource = async (url, method, reportId) => {
    const options = {
        method,
        url,
        headers: {
            'x-zooz-request-id': `runner_${reportId}`
        }
    };

    logger.info(options, 'Download file resource from predator');
    try {
        const resource = await requestSender.sendRequest(options);
        logger.info(`Request to ${options.url} succeeded with status code ${resource.statusCode}`);
        logger.info({ resource: resource.body }, 'Retrieved resource file from predator');
        return resource.body;
    } catch (error) {
        logger.error(`Request to ${options.url} failed on the ${error.response.retryCount} attempt with error ${error.response.body.message}`);
    }
};

module.exports = {
    getFile,
    getProcessor
};
