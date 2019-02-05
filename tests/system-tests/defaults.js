const uuid = require('uuid');

module.exports.jobConfig = {
    predatorUrl: process.env.PREDATOR_URL,
    emails: [],
    webhooks: [],
    jobId: uuid(),
    environment: 'test'
};