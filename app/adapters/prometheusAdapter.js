module.exports.buildMetricsPlugin = (metricsConfig, jobConfig) => {
    const labels = Object.assign({
        'testName': jobConfig.testName,
        'testRunId': jobConfig.reportId,
        'cluster': jobConfig.cluster

    }, metricsConfig.labels);
    let prometheusPlugin = {
        'prometheus': {
            'pushGatewayUrl': metricsConfig.push_gateway_url,
            labels
        }
    };

    if (metricsConfig.buckets_sizes) {
        prometheusPlugin.prometheus.bucketSizes = metricsConfig.buckets_sizes;
    }

    return prometheusPlugin;
};
