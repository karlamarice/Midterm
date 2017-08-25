var router = require('express').Router();

router.get('/', (req, res) => {
    res.status(200).send({
        name: 'express-boilerplate-api',
        version: 1.0
    });
});

router.use('/todos', require('./todos/api'));
router.use('/users', require('./users/api'));

exports.api = router;