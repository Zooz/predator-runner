'use strict';
const env = process.env;
const logger = require('./logger');
const RUNNER_MANDATORY_VARIABLES = require('../utils/consts').RUNNER_MANDATORY_VARIABLES;
const PLUGINS_MANDATORY_VARIABLES = require('../utils/consts').PLUGINS_MANDATORY_VARIABLES;

module.exports.verifyEnvironmentVars = () => {
    let missingVars = getMissingVariables(env, RUNNER_MANDATORY_VARIABLES);

    if (env.METRICS_PLUGIN_NAME && env.METRICS_EXPORT_CONFIG) {
        let parsedMetricsConfig;
        try {
            parsedMetricsConfig = JSON.parse(env.METRICS_EXPORT_CONFIG);
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