const should = require('should');
const prometheusAdapter = require('../../../app/adapters/prometheusAdapter');

const jobConfig = {
    reportId: '0d9d772d-ce0e-4318-af18-d695561f1320',
    testName: 'MickeysTest',
    cluster: 'Dev'
};

const metricsConfig = {
    push_gateway_url: 'url'
};

const expectedPluginConfiguartion = {
    prometheus:
        {
            pushGatewayUrl: 'url',
            labels: {
                testName: 'MickeysTest',
                testRunId: '0d9d772d-ce0e-4318-af18-d695561f1320',
                cluster: 'Dev'
            }
        }
};

describe('Prometheus adapter test', () => {
    it('Should retrieve prometheus plugin configuration without bucket_sizes or labels', () => {
        const pluginConfiguration = prometheusAdapter.buildMetricsPlugin(metricsConfig, jobConfig);
        should(pluginConfiguration).eql(expectedPluginConfiguartion);
    });

    it('Should retrieve prometheus plugin configuration with bucket_sizes and labels', () => {
        metricsConfig.bucket_sizes = [0.5, 1, 5, 10, 100];
        metricsConfig.labels = { key1: 'value2', key2: 'value2' };
        const pluginConfiguration = prometheusAdapter.buildMetricsPlugin(metricsConfig, jobConfig);
        expectedPluginConfiguartion.prometheus.bucketSizes = [0.5, 1, 5, 10, 100];
        expectedPluginConfiguartion.prometheus.labels = {
            'cluster': 'Dev',
            'key1': 'value2',
            'key2': 'value2',
            'testName': 'MickeysTest',
            'testRunId': '0d9d772d-ce0e-4318-af18-d695561f1320'
        };
        should(pluginConfiguration).eql(expectedPluginConfiguartion);
    });
});
