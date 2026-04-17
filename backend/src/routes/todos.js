const express = require('express');
const service = require('../services/todoService');

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const { date } = req.query;
    const todos = service.listByDate(date);
    res.json(todos);
  } catch (err) {
    next(err);
  }
});

router.post('/', (req, res, next) => {
  try {
    const todo = service.createTodo(req.body || {});
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
