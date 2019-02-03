'use strict';
let pidusage = require('pidusage');

let logger = require('../utils/logger');

module.exports.getMetrics = async () => {
    let stats = await pidusage(process.pid);
    stats.memory = stats.memory / 1048576;
    return stats;
};

module.exports.printMetrics = (stats) => {
    stats.memory = `${stats.memory}MB`;
    stats.cpu = `${stats.cpu}%`;
    logger.info(stats);
};
