const express = require('express');

const apiRouter = require('../api/auth-router');
const configureMiddleware = require('./configure-middleware.js');

const server = express();

configureMiddleware(server);

server.use('/api', apiRouter);

module.exports = server;