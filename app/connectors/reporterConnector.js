const requestSender = require('../helpers/requestSender');

let subscribeToReport = async (jobConfig) => {
    const options = {
        url: jobConfig.predatorUrl + `/tests/${jobConfig.testId}/reports/${jobConfig.reportId}/subscribe`,
        method: 'POST',
        headers: {
            'x-runner-id': `${jobConfig.containerId}`
        },
        body: {}
    };
    await requestSender.sendRequest(options);
};

let postStats = async (jobConfig, stats) => {
    let defaultBody = {
        runner_id: jobConfig.containerId,
        stats_time: Date.now().toString()
    };

    const requestBody = Object.assign(defaultBody, stats);

    let options = {
        url: jobConfig.predatorUrl + `/tests/${jobConfig.testId}/reports/${jobConfig.reportId}/stats`,
        method: 'POST',
        headers: {
            'x-runner-id': `${jobConfig.containerId}`
        },
        body: requestBody
    };

    await requestSender.sendRequest(options);
};

module.exports = {
    postStats,
    subscribeToReport
};
