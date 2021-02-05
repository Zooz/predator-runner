const got = require('got');

const DEFAULT_OPTIONS = {
    responseType: 'json',
    retry: 3
};

module.exports.sendRequest = (options) => {
    options = Object.assign(options, DEFAULT_OPTIONS);
    return got(options);
};
