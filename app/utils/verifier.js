'use strict';
const env = process.env;
const logger = require('./logger');
const {
    FUNCTIONAL_TEST,
    FUNCTIONAL_TEST_MANDATORY_VARIABLES,
    LOAD_TEST_MANDATORY_VARIABLES,
    RUNNER_MANDATORY_VARIABLES,
    PLUGINS_MANDATORY_VARIABLES } = require('../utils/consts');

module.exports.verifyEnvironmentVars = () => {
    let missingVars = getMissingVariables(env, RUNNER_MANDATORY_VARIABLES);

    if (env.JOB_TYPE === FUNCTIONAL_TEST) {
        const runnerMissingVars = getMissingVariables(env, FUNCTIONAL_TEST_MANDATORY_VARIABLES);
        missingVars = missingVars.concat(runnerMissingVars);
    } else {
        const runnerMissingVars = getMissingVariables(env, LOAD_TEST_MANDATORY_VARIABLES);
        missingVars = missingVars.concat(runnerMissingVars);
    }

    if (env.METRICS_PLUGIN_NAME && env.METRICS_EXPORT_CONFIG) {
        let parsedMetricsConfig;
        try {
            let asciiMetricsExportConfig = (Buffer.from(env.METRICS_EXPORT_CONFIG, 'base64').toString('ascii'));
            parsedMetricsConfig = JSON.parse(asciiMetricsExportConfig);
        } catch (e) {
            let invalidJsonError = new Error('Plugin configuration is not a valid JSON');
            logger.error(invalidJsonError, e);
            throw invalidJsonError;
        }
        const pluginMissingVars = getMissingVariables(parsedMetricsConfig, PLUGINS_MANDATORY_VARIABLES[env.METRICS_PLUGIN_NAME]);
        missingVars = missingVars.concat(pluginMissingVars);
    }

    if (missingVars.length > 0) {
        let error = new Error('Missing mandatory variables: ' + missingVars);
        logger.error(error);
        throw error;
    }
};

const getMissingVariables = (config, mandatoryVariables) => {
    return mandatoryVariables.filter((variable) => {
        if (!config[variable]) {
            return variable;
        }
    });
};