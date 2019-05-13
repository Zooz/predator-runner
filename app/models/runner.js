'use strict';
let artillery = require('artillery/core');
let testFileConnector = require('../connectors/testFileConnector');
let fileConnector = require('../connectors/fileConnector');
const fs = require('fs');
let reporterConnector = require('../connectors/reporterConnector');
let logger = require('../utils/logger');
let reportPrinter = require('./reportPrinter');
let progressCalculator = require('../helpers/progressCalculator');
let metrics = require('../helpers/runnerMetrics');
const path = require('path');
let statsToRecord = 0;
let artilleryReport;
let firstIntermediate = true;
module.exports.runTest = async (jobConfig) => {
    let test, fileContent;
    test = await testFileConnector.getTest(jobConfig);
    fileContent = await fileConnector.getFile(jobConfig, test['file_id']);
    const localProcessorPath = await writeFileToLocalFile(fileContent);
    await reporterConnector.createReport(jobConfig, test);
    updateTestParameters(jobConfig, test.artillery_test, localProcessorPath);
    logger.info(`Starting test: ${test.name}, testId: ${test.id}`);
    progressCalculator.calculateTotalNumberOfScenarios(jobConfig);

    const ee = await artillery.runner(test.artillery_test);
    return new Promise((resolve, reject) => {
        ee.on('phaseStarted', (info) => {
            logger.info('Starting phase: %s - %j', new Date(), JSON.stringify(info));
            const phaseIndex = info.index ? info.index.toString() : '0';
            reporterConnector.postStats(jobConfig, {
                phase_index: phaseIndex,
                phase_status: 'started_phase',
                data: JSON.stringify(info)
            });
        });
        ee.on('phaseCompleted', () => {
            logger.info('Phase completed - %s', new Date());
        });
        ee.on('stats', async (stats) => {
            statsToRecord++;
            let intermediateReport = stats.report();
            let progress = progressCalculator.calculateProgress(stats._completedScenarios + stats._scenariosAvoided);
            logger.info(`Completed ${progress}%`);
            reportPrinter.print('intermediate', intermediateReport);
            delete intermediateReport.latencies;

            reporterConnector.postStats(jobConfig, {
                phase_status: firstIntermediate ? 'first_intermediate' : 'intermediate',
                data: JSON.stringify(intermediateReport)
            });
            firstIntermediate = false;

            const runnerMetrics = await metrics.getMetrics();
            await metrics.printMetrics(runnerMetrics);

            statsToRecord--;
        });
        ee.on('done', async (report) => {
            reportPrinter.print('aggregate', report);
            delete report.latencies;
            artilleryReport = report;
            let handleFinishedReport = async () => {
                try {
                    await reporterConnector.postStats(jobConfig, {
                        phase_status: 'done',
                        data: JSON.stringify(report)
                    });
                    resolve(artilleryReport);
                } catch (e) {
                    logger.error({error: e, final_report: artilleryReport}, 'Failed to send final report to reporter');
                    reject(e);
                }
            };
            await waitForLiveStatsToFinish(handleFinishedReport);
        });
        ee.run();
    });
};

let updateTestParameters = (jobConfig, testFile, localProcessorPath) => {
    if (jobConfig.metricsExportConfig && jobConfig.metricsPluginName) {
        injectPlugins(testFile, jobConfig);
    }
    if (localProcessorPath) {
        const processor = require(localProcessorPath);
        testFile.config.processor = processor;
    }
    if (!testFile.config.phases) {
        testFile.config.phases = [{}];
    }
    testFile.config.phases[0].duration = jobConfig.duration;
    testFile.config.phases[0].arrivalRate = jobConfig.arrivalRate;

    if (!testFile.config.http) {
        testFile.config.http = {};
    }
    testFile.config.http.pool = jobConfig.httpPoolSize;

    testFile.config.statsInterval = jobConfig.statsInterval;

    if (!jobConfig.rampTo) {
        delete testFile.config.phases[0].rampTo;
    } else {
        testFile.config.phases[0].rampTo = jobConfig.rampTo;
    }

    if (!jobConfig.maxVusers) {
        delete testFile.config.phases[0].maxVusers;
    } else {
        testFile.config.phases[0].maxVusers = jobConfig.maxVusers;
    }

    logger.info({updated_test_config: testFile.config}, 'Test successfully updated parameters');
};

async function writeFileToLocalFile(fileContent) {
    if (fileContent) {
        const fileName = 'processor_file.js';
        const jsCode = Buffer.from(fileContent, 'base64').toString('utf8');
        try {
            await fs.writeFileSync(fileName, jsCode);
            return path.resolve(__dirname, '..', '..', fileName);
        } catch (err) {
            let error = new Error('Something went wrong. error: ' + err);
            logger.error(error);
            throw error;
        }
    }
}

function injectPlugins(testFile, jobConfig) {
    const metricsPluginName = jobConfig.metricsPluginName.toLowerCase();
    const metricsAdapter = require(`../adapters/${metricsPluginName}Adapter`);
    let asciiMetricsExportConfig = (Buffer.from(jobConfig.metricsExportConfig, 'base64').toString('ascii'));
    let parsedMetricsConfig = JSON.parse(asciiMetricsExportConfig);
    testFile.config.plugins = metricsAdapter.buildMetricsPlugin(parsedMetricsConfig, jobConfig);
}

let waitForLiveStatsToFinish = async (callback) => {
    if (statsToRecord) {
        setTimeout(() => {
            waitForLiveStatsToFinish(callback);
        }, 1500);
    } else {
        await callback();
    }
};
