const request = require('requestxn');

const logger = require('../utils/logger');

const DEFAULT_OPTIONS = {
    json: true,
    retryOn5xx: true,
    backoffBase: 1000,
    max: 3,
    onError: function(options, error, attempts) {
        logger.error(`Request to ${options.url} failed on the ${attempts} attempt with error ${error.message}`);
    },
    onSuccess: function(options, response) {
        logger.info(`Request to ${options.url} succeeded with status code ${response.statusCode}`);
    }
};

module.exports.sendRequest = (options) => {
    options = Object.assign(options, DEFAULT_OPTIONS);
    return request(options);
};
