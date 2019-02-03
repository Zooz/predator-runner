module.exports.buildMetricsPlugin = (metricsConfig, jobConfig) => {
    let prometheusPlugin = {
        'prometheus': {
            'pushGatewayUrl': metricsConfig.push_gateway_url,
            'labels': {
                'testName': jobConfig.testName,
                'testRunId': jobConfig.runId,
                'cluster': jobConfig.cluster
            }
        }
    };

    if (metricsConfig.bucket_sizes) {
        prometheusPlugin.prometheus.bucketSizes = metricsConfig.bucket_sizes;
    }

    return prometheusPlugin;
};