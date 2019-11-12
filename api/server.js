const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStorage = require('connect-session-knex')(session);

const apiRouter = require('./api-router');
const configureMiddleware = require('./configure-middleware.js');
const knexConnection = require('../database/dbConfig.js');

const server = express();

configureMiddleware(server);

const sessionConfiguration = {
    name: 'monkey',
    secret: process.env.COOKIE_SECRET || 'keep it secret, keep it safe!',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: process.env.NODE_ENV === 'development' ? false : true,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStorage({
        knex: knexConnection,
        tablename: 'user_sessions',
        sidfieldname: 'id',
        createtable: true,
    }),
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfiguration));

server.use('/api', apiRouter);

server.get('/', (req, res) => {
    res.json({ api: "running, hang ten!", session: req.session});
});

// test test

module.exports = server;