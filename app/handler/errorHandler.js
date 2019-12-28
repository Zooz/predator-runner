const logger = require('../utils/logger'),
    reporterConnector = require('../connectors/reporterConnector');

let handleError = async (jobConfig, error) => {
    logger.error(error, 'Test failed');
    try {
        await reporterConnector.postStats(jobConfig, {
            phase_status: 'error',
            data: JSON.stringify({ message: error.message }),
            error: error
        });
    } catch (err) {
        logger.error(err, 'Failed to update reporter of test failure');
    }
};

module.exports = {
    handleError: handleError
};