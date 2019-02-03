const should = require('should');
const influxdbAdapter = require('../../../app/adapters/influxdbAdapter');

const jobConfig = {
    runId: '123',
    testName: 'MickeysTest',
    cluster: 'Dev'
};

const metricsConfig = {
    influx_host: 'host',
    influx_username: 'username',
    influx_password: 'pw',
    influx_database: 'db'
};

const expectedPluginConfiguartion = {
    influxdb:
        { testName: 'MickeysTest',
            measurementName: 'artillery_latencies',
            errorMeasurementName: 'artillery_client_errors',
            testRunId: '123',
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