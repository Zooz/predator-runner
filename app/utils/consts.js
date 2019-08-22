const RUNNER_MANDATORY_VARIABLES = [
    'ENVIRONMENT',
    'TEST_ID',
    'PREDATOR_URL',
    'DURATION',
    'ARRIVAL_RATE',
    'JOB_ID',
    'RUN_ID'
];

const PLUGINS_MANDATORY_VARIABLES = {
    influx: ['host', 'database', 'username', 'password'],
    prometheus: ['push_gateway_url']
};

module.exports = {
    RUNNER_MANDATORY_VARIABLES,
    PLUGINS_MANDATORY_VARIABLES
};