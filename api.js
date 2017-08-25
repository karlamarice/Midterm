var router = require('express').Router();
var db = require('../../../lib/database')();

// /api/users
router.post('/login', (req, res) => {
    db.query('SELECT * FROM `users` WHERE `username`=? && `password`=? ', [req.body.username, req.body.password], (err, results, fields) => {
        if (err) return res.status(400).send({ message: 'User not found!' });
        res.status(200).send(results[0]);
    });
});

// /api/users
router.post('/', (req, res) => {
    db.query('INSERT INTO users (`name`, `username`, `password`) VALUES (?, ?, ?)', [req.body.name, req.body.username, req.body.password], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Welcome ' + req.body.name + '!' });
    });
});

module.exports = router;