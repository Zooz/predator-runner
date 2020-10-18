const RUNNER_MANDATORY_VARIABLES = [
    'TEST_ID',
    'PREDATOR_URL',
    'DURATION',
    'JOB_ID',
    'RUN_ID'
];

const LOAD_TEST_MANDATORY_VARIABLES = [
    'ARRIVAL_RATE'
];

const FUNCTIONAL_TEST_MANDATORY_VARIABLES = [
    'ARRIVAL_COUNT'
];

const PLUGINS_MANDATORY_VARIABLES = {
    influx: ['host', 'database', 'username', 'password'],
    prometheus: ['push_gateway_url']
};

const LOAD_TEST = 'load_test';
const FUNCTIONAL_TEST = 'functional_test';

module.exports = {
    FUNCTIONAL_TEST,
    LOAD_TEST,
    LOAD_TEST_MANDATORY_VARIABLES,
    FUNCTIONAL_TEST_MANDATORY_VARIABLES,
    RUNNER_MANDATORY_VARIABLES,
    PLUGINS_MANDATORY_VARIABLES
};