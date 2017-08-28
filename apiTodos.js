var router = require('express').Router();
var db = require('../../../lib/database')();

// /api/todos
router.post('/all', (req, res) => {
    db.query('SELECT * FROM todos WHERE `assignedTo` = ? || assignedBy = ?', [req.body.username, req.body.username], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results);
    });
});

router.post('/my', (req, res) => {
    db.query('SELECT * FROM `todos` WHERE `assignedTo` = ? && `done` = 0', [req.body.username], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results);
    });
});

router.post('/myCompleted', (req, res) => {
    db.query('SELECT * FROM `todos` WHERE `assignedTo` = ? && `done` = 1', [req.body.username], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results);
    });
});

router.post('/others', (req, res) => {
    db.query('SELECT * FROM `todos` WHERE `assignedBy` = ? && `done` = 0', [req.body.username], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results);
    });
});

router.post('/othersCompleted', (req, res) => {
    db.query('SELECT * FROM `todos` WHERE `assignedBy` = ? && `done` = 1', [req.body.username], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results);
    });
});

// /api/todos/:id
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM todos WHERE id=?', [req.params.id], (err, results, fields) => {
        if (err) return res.status(302).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully deleted item.' });
    });
});

// /api/todos
router.post('/', (req, res) => {
    db.query('INSERT INTO todos (`title`, `description`, `dateTime`, `assignedTo`, `assignedBy`, `done`) VALUES (?, ?, now(), ?, ?, false)', [req.body.title, req.body.description, req.body.assignedTo, req.body.assignedBy], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully added todo!' });
    });
});

// /api/todos/:id
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM todos WHERE id=?', [req.params.id], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send(results);
    });
});

// /api/todos/:id
router.put('/:id', (req, res) => {
    db.query('UPDATE todos SET title=?, description=?, dateTime=now(), done=? WHERE id=?', [req.body.title, req.body.description, req.body.done, req.params.id], (err, results, fields) => {
        if (err) return res.status(400).send({ error: err.toString() });
        res.status(200).send({ message: 'Successfully updated item.' });
    });
});

module.exports = router;