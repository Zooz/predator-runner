const RUNNER_MANDATORY_VARIABLES = [
    'ENVIRONMENT',
    'CLUSTER',
    'TEST_ID',
    'TESTS_API_URL',
    'DURATION',
    'ARRIVAL_RATE',
    'JOB_ID'
];

const PLUGINS_MANDATORY_VARIABLES = {
    influxdb: ['influx_host', 'influx_database', 'influx_username', 'influx_password'],
    prometheus: ['push_gateway_url']
};

module.exports = {
    RUNNER_MANDATORY_VARIABLES,
    PLUGINS_MANDATORY_VARIABLES
};