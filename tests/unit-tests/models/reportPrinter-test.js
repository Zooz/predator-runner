let reportPrinter = require('../../../app/models/reportPrinter');
let logger = require('../../../app/utils/logger');
let sinon = require('sinon');
let should = require('should');

let report = {
    'timestamp': '2018-05-15T14:20:02.109Z',
    'scenariosCreated': 96,
    'scenariosCompleted': 92,
    'requestsCompleted': 185,
    'scenariosAvoided': 10,
    'latency': {
        'min': 167.6,
        'max': 667.5,
        'median': 193.8,
        'p95': 322.4,
        'p99': 609.6
    },
    'rps': {
        'count': 189,
        'mean': 19.15
    },
    'scenarioDuration': {
        'min': 367.7,
        'max': 1115.1,
        'median': 385.1,
        'p95': 780.8,
        'p99': 1060.9
    },
    'scenarioCounts': {
        'Scenario': 96
    },
    'errors': {
        'Server Error': 10
    },
    'codes': {
        '201': 185
    },
    'matches': 0,
    'customStats': {},
    'concurrency': 4,
    'pendingRequests': 4
};
describe('Report printer test', () => {
    let sandbox, loggerInfoStub;
    before(() => {
        sandbox = sinon.createSandbox();
        loggerInfoStub = sandbox.stub(logger, 'info');
    });

    beforeEach(() => {
        sandbox.resetHistory();
    });

    after(() => {
        sandbox.restore();
    });

    it('Test successful print', () => {
        reportPrinter.print('final', report, {showScenarioCounts: true});
        loggerInfoStub.args.should.eql([
            ['  Printing stats for stage %s', 'final'],
            ['  Scenarios launched:  %s', 96],
            ['  Scenarios completed: %s', 92],
            ['  Requests completed:  %s', 185],
            ['  Scenarios avoided:  %s', 10],
            ['  RPS sent: %s', 19.15],
            ['  Request latency:'],
            ['    min: %s', 167.6],
            ['    max: %s', 667.5],
            ['    median: %s', 193.8],
            ['    p95: %s', 322.4],
            ['    p99: %s', 609.6],
            ['  Scenario duration:'],
            ['    min: %s', 367.7],
            ['    max: %s', 1115.1],
            ['    median: %s', 385.1],
            ['    p95: %s', 780.8],
            ['    p99: %s', 1060.9],
            ['  Scenario counts:'],
            ['    %s: %s (%s%)', 'Scenario', 96, 100],
            ['  Codes:'],
            ['    %s: %s', '201', 185],
            ['  Errors:'],
            ['    %s: %s', 'Server Error', 10]
        ]);
    });
});