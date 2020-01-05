const _ = require('lodash');

const logger = require('../utils/logger');

module.exports.print = (stage, report) => {
    logger.info('  Printing stats for stage %s', stage);
    logger.info('  Scenarios launched:  %s', report.scenariosCreated);
    logger.info('  Scenarios completed: %s', report.scenariosCompleted);
    logger.info('  Requests completed:  %s', report.requestsCompleted);
    logger.info('  Scenarios avoided:  %s', report.scenariosAvoided);

    logger.info('  RPS sent: %s', report.rps.mean);
    logger.info('  Request latency:');
    logger.info('    min: %s', report.latency.min);
    logger.info('    max: %s', report.latency.max);
    logger.info('    median: %s', report.latency.median);
    logger.info('    p95: %s', report.latency.p95);
    logger.info('    p99: %s', report.latency.p99);

    logger.info('  Scenario duration:');
    logger.info('    min: %s', report.scenarioDuration.min);
    logger.info('    max: %s', report.scenarioDuration.max);
    logger.info('    median: %s', report.scenarioDuration.median);
    logger.info('    p95: %s', report.scenarioDuration.p95);
    logger.info('    p99: %s', report.scenarioDuration.p99);

    if (_.keys(report.codes).length !== 0) {
        logger.info('  Codes:');
        _.each(report.codes, function (count, code) {
            logger.info('    %s: %s', code, count);
        });
    }
    if (_.keys(report.errors).length !== 0) {
        logger.info('  Errors:');
        _.each(report.errors, function (count, code) {
            logger.info('    %s: %s', code, count);
        });
    }
};