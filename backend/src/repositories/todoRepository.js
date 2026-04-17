const { getDb } = require('../db');

function rowToTodo(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    completed: row.completed === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function findByDate(date) {
  const db = getDb();
  const rows = db
    .prepare('SELECT * FROM todos WHERE date = ? ORDER BY id ASC')
    .all(date);
  return rows.map(rowToTodo);
}

function findById(id) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  return rowToTodo(row);
}

function create({ title, date }) {
  const db = getDb();
  const { lastInsertRowid } = db
    .prepare('INSERT INTO todos (title, date) VALUES (?, ?)')
    .run(title, date);
  return findById(lastInsertRowid);
}

module.exports = { findByDate, findById, create };
