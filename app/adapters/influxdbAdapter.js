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
                'host': metricsConfig.influx_host,
                'username': metricsConfig.influx_username,
                'password': metricsConfig.influx_password,
                'database': metricsConfig.influx_database
            }
        }
    };
};