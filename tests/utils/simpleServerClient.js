const request = require('request-promise-native');

const PORT = process.env.PORT || 3003;

module.exports.deleteDB = async () => {
    const requestOptions = {
        url: `http://localhost:${PORT}/db`
    };
    return request.delete(requestOptions);
};

module.exports.getIncomingRequest = () => {
    const requestOptions = {
        url: `http://localhost:${PORT}/incomingRequest`,
        json: true
    };
    return request.get(requestOptions);
};

module.exports.getPets = () => {
    const requestOptions = {
        url: `http://localhost:${PORT}/pets`,
        json: true
    };
    return request.get(requestOptions);
};