let requestSender = require('../helpers/requestSender');

let createReport = async (jobConfig, test) => {
    const testConfiguration = {
        environment: jobConfig.environment,
        duration: jobConfig.duration,
        arrival_rate: jobConfig.arrivalRate,
        ramp_to: jobConfig.rampTo
    };
    const requestBody = {
        report_id: jobConfig.runId,
        revision_id: jobConfig.revisionId,
        job_id: jobConfig.jobId,
        test_type: test.type,
        start_time: Date.now().toString(),
        notes: jobConfig.notes,
        webhooks: jobConfig.webhooks,
        emails: jobConfig.emails,
        test_name: jobConfig.testName,
        test_description: jobConfig.description,
        test_configuration: testConfiguration
    };

    let options = {
        url: jobConfig.reporterUrl + `/v1/tests/${jobConfig.testId}/reports`,
        method: 'POST',
        headers: {
            'x-zooz-request-id': `runner_${jobConfig.runId}`
        },
        body: requestBody,
    };

    const report = await requestSender.sendRequest(options);
    return report;
};

let postStats = async (jobConfig, stats) => {
    let defaultBody = {
        stats_time: Date.now().toString()
    };

    const requestBody = Object.assign(defaultBody, stats);

    let options = {
        url: jobConfig.reporterUrl + `/v1/tests/${jobConfig.testId}/reports/${jobConfig.runId}/stats`,
        method: 'POST',
        headers: {
            'x-zooz-request-id': `runner_${jobConfig.runId}`
        },
        body: requestBody,
    };

    await requestSender.sendRequest(options);
};

module.exports = {
    postStats,
    createReport
};