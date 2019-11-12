const express = require('express');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionsStorage = require('connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const restrictedRouter = require('../restricted/restricted-router.js');
const knexConnection = require('../database/dbConfig.js');

const Users = require('../users/users-helpers.js');
const server = express();

const sessionConfiguration = {
    name: 'monkey',
    secret: process.env.COOKIE_SECRET || 'Keep it secret, keep it safe!',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: process.env.NODE_ENV === 'development' ? false : true,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: true, 
    store: new KnexSessionsStorage({
        knex: knexConnection,
        clearInterval: 1000 * 60 * 10,
        tablename: 'user_sessions',
        sidfieldname: 'id',
        createtable: true,
    }),
}

function gateKeeper(req, res, next) {
    let { username, password} = req.headers;

    if(username && password) {
        Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                next();
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
    } else {
        res.status(400).json({ message: 'You shall not pass!'});
    }
}

server.use(session(sessionConfiguration));

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/restricted', gateKeeper, restrictedRouter)

router.get('/', (req, res) => {
    res.json({ api: "It's Alive", session: req.session});
});

router.post('/hash', (req, res) => {
    const password = req.body.password;
    const hash = bcrypt.hashSync(password, 12);

    res.status(200).json({ password, hash });
});

module.exports = router;
