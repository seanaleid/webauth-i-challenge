const router = require('express').Router();

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const restrictedRouter = require('../restricted/restricted-router.js');

const Users = require('../users/users-helpers.js');

const bcrypt = require('bcryptjs');

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

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/restricted', gateKeeper, restrictedRouter)

router.get('/', (req, res) => {
    res.json({ api: "It's Alive"});
});

router.post('/hash', (req, res) => {
    const password = req.body.password;
    const hash = bcrypt.hashSync(password, 12);

    res.status(200).json({ password, hash });
});

module.exports = router;
