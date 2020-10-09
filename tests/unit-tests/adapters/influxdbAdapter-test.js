const should = require('should');
const influxdbAdapter = require('../../../app/adapters/influxAdapter');

const jobConfig = {
    reportId: '0d9d772d-ce0e-4318-af18-d695561f1320',
    testName: 'MickeysTest',
    cluster: 'Dev'
};

const metricsConfig = {
    host: 'host',
    username: 'username',
    password: 'pw',
    database: 'db'
};

const expectedPluginConfiguartion = {
    influxdb:
        { testName: 'MickeysTest',
            measurementName: 'artillery_latencies',
            errorMeasurementName: 'artillery_client_errors',
            testRunId: '0d9d772d-ce0e-4318-af18-d695561f1320',
            tags:
                {
                    environment: 'Dev'
                },
            influx:
                {
                    host: 'host',
                    username: 'username',
                    password: 'pw',
                    database: 'db'
                }
        }
};

describe('Influxdb adapter test', () => {
    it('Should retrieve influxdb plugin configuration', () => {
        const pluginConfiguration = influxdbAdapter.buildMetricsPlugin(metricsConfig, jobConfig);
        should(pluginConfiguration).eql(expectedPluginConfiguartion)
    });
});
