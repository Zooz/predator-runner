//
// let verifier = require('../../../app/utils/verifier');
// let should = require('should');
// let sinon = require('sinon');
// let logger = require('../../../app/utils/logger');
// const MANDATORY_VARIABLES = require('../../../app/utils/consts').MANDATORY_VARIABLES;
// const INFLUX_VARIABLES = ['INFLUX_HOST', 'INFLUX_DATABASE', 'INFLUX_PASSWORD', 'INFLUX_USERNAME'];
// describe('Verifier test', () => {
//     let sandbox, loggerErrorStub;
//
//     before(() => {
//         sandbox = sinon.createSandbox();
//         loggerErrorStub = sandbox.stub(logger, 'error');
//     });
//
//     beforeEach(() => {
//         sandbox.resetHistory();
//         MANDATORY_VARIABLES.concat(INFLUX_VARIABLES).forEach((variable) => {
//             process.env[variable] = 'value';
//         });
//     });
//
//     afterEach(() => {
//         MANDATORY_VARIABLES.forEach((variable) => {
//             if (process.env[variable]) {
//                 delete process.env[variable];
//             }
//         });
//     });
//
//     after(() => {
//         sandbox.restore();
//     });
//
//     it('Verification passes when all env variables exist', () => {
//         let exception;
//         try {
//             verifier.verifyRunnerEnvironmentVars();
//         } catch (error) {
//             exception = error;
//         }
//         should.not.exist(exception);
//         loggerErrorStub.called.should.eql(false);
//     });
//
//     it('Verification passes when all env variables exist and also influx variables exists', () => {
//         process.env.INFLUX_HOST = 'INFLUX_HOST';
//         process.env.INFLUX_DATABASE = 'INFLUX_DATABASE';
//         process.env.INFLUX_USERNAME = 'INFLUX_USERNAME';
//         process.env.INFLUX_PASSWORD = 'INFLUX_PASSWORD';
//
//         let exception;
//         try {
//             verifier.verifyRunnerEnvironmentVars();
//         } catch (error) {
//             exception = error;
//         }
//         should.not.exist(exception);
//         loggerErrorStub.called.should.eql(false);
//     });
//
//     it('Verification fails when at least one env variable is missing', () => {
//         delete process.env[MANDATORY_VARIABLES[0]];
//
//         let expectedError = new Error('Missing mandatory variables: ' + MANDATORY_VARIABLES[0]);
//         let exception;
//         try {
//             verifier.verifyRunnerEnvironmentVars();
//         } catch (error) {
//             exception = error;
//         }
//         exception.should.not.eql(undefined);
//         exception.should.have.property('message').which.is.eql('Missing mandatory variables: ' + MANDATORY_VARIABLES[0]);
//         loggerErrorStub.args[0][0].message.should.equal(expectedError.message);
//     });
// });