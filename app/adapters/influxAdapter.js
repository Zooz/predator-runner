module.exports.buildMetricsPlugin = (metricsConfig, jobConfig) => {
    return {
        'influxdb': {
            'testName': jobConfig.testName,
            'measurementName': 'artillery_latencies',
            'errorMeasurementName': 'artillery_client_errors',
            'testRunId': jobConfig.runId,
            'tags': {
                'environment': jobConfig.cluster
            },
            'influx': {
                'host': metricsConfig.host,
                'username': metricsConfig.username,
                'password': metricsConfig.password,
                'database': metricsConfig.database
            }
        }
    };
};