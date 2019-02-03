'use strict';

let totalNumberOfScenarios;
let scenariosFinished = 0;

module.exports.calculateTotalNumberOfScenarios = (jobConfig) => {
    totalNumberOfScenarios = 0;
    if (!jobConfig.rampTo) {
        totalNumberOfScenarios = jobConfig.arrivalRate * jobConfig.duration;
    } else {
        let arrivalRatePerInterval = jobConfig.arrivalRate;
        let numberOfIntervals = jobConfig.rampTo - jobConfig.arrivalRate + 1;
        let secondsPerInterval = jobConfig.duration / numberOfIntervals;
        while (arrivalRatePerInterval <= jobConfig.rampTo) {
            totalNumberOfScenarios += secondsPerInterval * arrivalRatePerInterval;
            arrivalRatePerInterval++;
        }
    }
};

module.exports.calculateProgress = (finishedScenarios) => {
    scenariosFinished += finishedScenarios;
    let progress = Math.floor(scenariosFinished / totalNumberOfScenarios * 100);
    if (progress >= 100) {
        return 100;
    } else {
        return progress;
    }
};