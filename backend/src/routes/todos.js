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

router.get('/dates', (req, res, next) => {
  try {
    const dates = service.listDatesInMonth(req.query.year, req.query.month);
    res.json(dates);
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

router.patch('/:id', (req, res, next) => {
  try {
    const todo = service.updateTodo(req.params.id, req.body || {});
    res.json(todo);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    service.deleteTodo(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
