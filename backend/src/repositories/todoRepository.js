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

function update(id, patch) {
  const db = getDb();
  const fields = [];
  const values = [];
  if (typeof patch.title !== 'undefined') {
    fields.push('title = ?');
    values.push(patch.title);
  }
  if (typeof patch.completed !== 'undefined') {
    fields.push('completed = ?');
    values.push(patch.completed ? 1 : 0);
  }
  if (fields.length === 0) return findById(id);
  fields.push("updated_at = datetime('now')");
  values.push(id);
  const result = db
    .prepare(`UPDATE todos SET ${fields.join(', ')} WHERE id = ?`)
    .run(...values);
  if (result.changes === 0) return null;
  return findById(id);
}

module.exports = { findByDate, findById, create, update };
