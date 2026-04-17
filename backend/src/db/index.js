const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

let dbInstance = null;

function getDbPath() {
  return process.env.DB_PATH || path.join(process.cwd(), 'data', 'todo.db');
}

function openDb(dbPath = getDbPath()) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);

  return db;
}

function getDb() {
  if (!dbInstance) {
    dbInstance = openDb();
  }
  return dbInstance;
}

function closeDb() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

module.exports = { getDb, openDb, closeDb, getDbPath };
