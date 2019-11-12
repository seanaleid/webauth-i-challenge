const router = require('express').Router();

const Users = require('./restricted-helpers.js');

const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});

// router.post('/something', (req, res) => {
//     let userInfo = req.body;

//     const hashedPassword = bcrypt.hashSync(userInfo.password, 12);
//     userInfo.password = hashedPassword;

//     Users.add(userInfo)
//         .then(saved => {
//             res.status(201).json(saved);
//         })
//         .catch(error => {
//             res.status(500).json(error);
//         });
// })

module.exports = router;