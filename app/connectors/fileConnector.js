let requestSender = require('../helpers/requestSender');
let logger = require('../utils/logger');

let getFile = async (jobConfig, fileId) => {
    if (fileId) {
        let options = {
            method: 'GET',
            url: jobConfig.predatorUrl + `/tests/file/${fileId}`,
            headers: {
                'x-zooz-request-id': `runner_${jobConfig.runId}`
            }
        };
        logger.info(options, 'GET file for test');
        const file = await requestSender.sendRequest(options);
        logger.info({test_file: file}, 'Retrieved test file successfully');
        return file;
    }
};

module.exports = {
    getFile: getFile
};