const Hapi = require('@hapi/hapi');
const uuid = require('uuid/v4');

const PORT = process.env.PORT || 3003;

let DB = {};

let INCOMING_REQUEST;
let server;

const start = async () => {
    if (server) {
        return server;
    }
    server = Hapi.server({ port: PORT });
    route(server);
    await server.start();
    return server;
};

function route(server) {
    server.route({
        method: 'DELETE',
        path: '/db',
        handler: deleteDB
    });
    server.route({
        method: 'GET',
        path: '/pets',
        handler: readAll
    });
    server.route({
        method: 'POST',
        path: '/pets',
        handler: create
    });
    server.route({
        method: 'GET',
        path: '/pets/{id}',
        handler: read
    });
    server.route({
        method: 'GET',
        path: '/incomingRequest',
        handler: getIncomingRequest
    });
    server.route({
        method: 'POST',
        path: '/incomingRequest',
        handler: logIncomingRequest
    });
}

function create(req, h) {
    const id = uuid();

    DB[id] = req.payload;
    DB[id].id = id;
    return h.response({id}).code(201);
}

function read(req, h) {
    const result = DB[req.params.id];
    if (result) {
        return h.response(result).code(200);
    } else {
        return h.response().code(404);
    }
}

function readAll(req, h) {
    const MAX_SIZE = 20;
    const entries = Object.keys(DB);
    let result = [];
    for (let i = entries.length - 1; i > entries.length - MAX_SIZE; i--) {
        const dbEntry = DB[entries[i]];
        if (dbEntry) {
            result.push(dbEntry);
        } else {
            break;
        }
    }
    return h.response(result).code(200);
}

function logIncomingRequest(req, h) {
    const incomingRequest = {
        headers: req.headers,
        params: req.params,
        payload: req.payload
    };
    INCOMING_REQUEST = incomingRequest;

    return h.response(INCOMING_REQUEST).code(201);
}

function getIncomingRequest(req, h) {
    return h.response(INCOMING_REQUEST).code(200);
}

function deleteDB(req, h) {
    for (let key in DB) {
        delete DB[key];
    }
    return h.response().code(204);
}

start();