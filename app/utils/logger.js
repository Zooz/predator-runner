'use strict';

let bunyan = require('bunyan');

let logger = bunyan.createLogger({
    name: 'predator-runner',
    level: process.env.LOG_LEVEL || 'info'
});

module.exports = logger;