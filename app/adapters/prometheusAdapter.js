module.exports.buildMetricsPlugin = (metricsConfig, jobConfig) => {
    const labels = Object.assign({
        'testName': jobConfig.testName,
        'testRunId': jobConfig.runId,
        'cluster': jobConfig.cluster

    }, metricsConfig.labels);
    let prometheusPlugin = {
        'prometheus': {
            'pushGatewayUrl': metricsConfig.push_gateway_url,
            labels
        }
    };

    if (metricsConfig.bucket_sizes) {
        prometheusPlugin.prometheus.bucketSizes = metricsConfig.bucket_sizes;
    }

    return prometheusPlugin;
};
