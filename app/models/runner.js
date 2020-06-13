'use strict';

const artillery = require('artillery/core'),
    csv = require('csv-parse/lib/sync'),
    testFileConnector = require('../connectors/testFileConnector'),
    fileDownloadConnector = require('../connectors/fileDownloadConnector'),
    reporterConnector = require('../connectors/reporterConnector'),
    logger = require('../utils/logger'),
    reportPrinter = require('./reportPrinter'),
    progressCalculator = require('../helpers/progressCalculator'),
    metrics = require('../helpers/runnerMetrics');

let statsToRecord = 0;
let firstIntermediate = true;

module.exports.runTest = async (jobConfig) => {
    const test = await testFileConnector.getTest(jobConfig);
    let processorJavascript = await getProcessorJavascript(jobConfig, test);
    const csvData = await getCSVData(jobConfig, test);
    await reporterConnector.createReport(jobConfig, test);
    updateTestParameters(jobConfig, test.artillery_test, processorJavascript, csvData);
    logger.info(`Starting test: ${test.name}, testId: ${test.id}`);
    progressCalculator.calculateTotalNumberOfScenarios(jobConfig);

    const ee = await artillery.runner(test.artillery_test, csvData ? csvData.data : undefined, { isAggregateReport: false });
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
            let handleFinishedReport = async () => {
                try {
                    await reporterConnector.postStats(jobConfig, {
                        phase_status: 'done',
                        data: JSON.stringify({ message: 'Test Finished' })
                    });
                    resolve();
                } catch (e) {
                    logger.error({ error: e }, 'Failed to send final report to predator');
                    reject(e);
                }
            };
            await waitForLiveStatsToFinish(handleFinishedReport);
        });
        ee.run();
    });
};

let updateTestParameters = (jobConfig, testFile, processorJavascript, csvData) => {
    if (jobConfig.metricsExportConfig && jobConfig.metricsPluginName) {
        injectPlugins(testFile, jobConfig);
    }
    if (processorJavascript) {
        let m = new module.constructor();
        m.paths = module.paths;
        m._compile(processorJavascript, 'none');
        testFile.config.processor = m.exports;
    }

    if (csvData) {
        testFile.config.payload = { fields: csvData.fields };
    }

    if (!testFile.config.phases) {
        testFile.config.phases = [{}];
    }
    testFile.config.phases[0].duration = jobConfig.duration;
    testFile.config.phases[0].arrivalRate = 0;
    testFile.config.phases[0].arrivalCount = jobConfig.arrivalCount || testFile.config.phases[0].arrivalCount;

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

    logger.info({ updated_test_config: testFile.config }, 'Test successfully updated parameters');
};

function injectPlugins(testFile, jobConfig) {
    const metricsPluginName = jobConfig.metricsPluginName.toLowerCase();
    const metricsAdapter = require(`../adapters/${metricsPluginName}Adapter`);
    let asciiMetricsExportConfig = (Buffer.from(jobConfig.metricsExportConfig, 'base64').toString('ascii'));
    let parsedMetricsConfig = JSON.parse(asciiMetricsExportConfig);
    testFile.config.plugins = metricsAdapter.buildMetricsPlugin(parsedMetricsConfig, jobConfig);
}

async function getProcessorJavascript(jobConfig, test) {
    let javascript;
    if (test['file_id']) {
        logger.warn('DEPRECATED: Using file_id in tests is deprecated and will soon be no longer supported. Please use the Processors API in order to use custom javascript in your tests.\n Link to API documentation: https://zooz.github.io/predator/indexapiref.html#tag/Processors');
        const fileContentBase64 = await fileDownloadConnector.getFile(jobConfig, test['file_id']);
        javascript = Buffer.from(fileContentBase64, 'base64').toString('utf8');
    } else if (test['processor_id']) {
        const processor = await fileDownloadConnector.getProcessor(jobConfig, test['processor_id']);
        javascript = processor.javascript;
    }
    return javascript;
}

async function getCSVData(jobConfig, test) {
    const csvFileId = test['csv_file_id'];
    if (!csvFileId) {
        return;
    }
    const payload = await fileDownloadConnector.getFile(jobConfig, csvFileId);
    let csvData;
    try {
        csvData = csv(payload);
    } catch (error) {
        throw new Error(`Failure to parse csv file with id: ${csvFileId}\n${error}`);
    }
    const fields = csvData.shift();

    logger.info({ csv_file_id: csvFileId, headers: fields, number_of_rows: csvData.length, first_row: csvData[0] }, 'Parsed CSV successfully');
    return { fields, data: csvData };
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
