let should = require('should');
let rewire = require('rewire');

let progressCalculator = rewire('../../../app/helpers/progressCalculator');

describe('progress Calculator test', () => {

    it('calculate total number of requests without ramp to', () => {
        const jobConfig = {
            arrivalRate: 100,
            duration: 60
        };
        progressCalculator.calculateTotalNumberOfScenarios(jobConfig);
        should(progressCalculator.__get__('totalNumberOfScenarios')).eql(6000);
    });

    it('calculate total number of requests with ramp to', () => {
        const jobConfig = {
            rampTo: 50,
            arrivalRate: 10,
            duration: 60
        };
        progressCalculator.calculateTotalNumberOfScenarios(jobConfig);
        should(progressCalculator.__get__('totalNumberOfScenarios')).be.within(1750,1850);
    });

    it('calculate total number of requests with ramp to = arrival rate', () => {
        const jobConfig = {
            rampTo: 50,
            arrivalRate: 50,
            duration: 60
        };

        progressCalculator.calculateTotalNumberOfScenarios(jobConfig);
        should(progressCalculator.__get__('totalNumberOfScenarios')).be.eql(3000);
    });


    it('calculate progress when progress is above 100% (ramp to)', () => {
        progressCalculator.__set__('scenariosFinished', '0');
        progressCalculator.__set__('totalNumberOfScenarios', '6000');
        let completedScenarios = 6005;
        let progress = progressCalculator.calculateProgress(completedScenarios);
        should(progress).be.eql(100);
    });

    it('calculate progress when progress is below 100%', () => {
        progressCalculator.__set__('scenariosFinished', '0');
        progressCalculator.__set__('totalNumberOfScenarios', '6000');
        let completedScenarios = 5000;
        let progress = progressCalculator.calculateProgress(completedScenarios);
        should(progress).be.eql(83);
    });
});