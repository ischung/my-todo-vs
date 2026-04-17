const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { openDb } = require('../src/db');

describe('DB initialization', () => {
  let tmpPath;
  let db;

  beforeEach(() => {
    tmpPath = path.join(os.tmpdir(), `todo-test-${Date.now()}-${Math.random()}.db`);
  });

  afterEach(() => {
    if (db) db.close();
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
  });

  it('creates DB file and todos table with required columns', () => {
    db = openDb(tmpPath);
    expect(fs.existsSync(tmpPath)).toBe(true);

    const info = db.prepare("PRAGMA table_info(todos)").all();
    const columnNames = info.map((c) => c.name).sort();
    expect(columnNames).toEqual(
      ['completed', 'created_at', 'date', 'id', 'title', 'updated_at'].sort()
    );
  });

  it('creates idx_todos_date index', () => {
    db = openDb(tmpPath);
    const indexes = db
      .prepare("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='todos'")
      .all()
      .map((r) => r.name);
    expect(indexes).toContain('idx_todos_date');
  });

  it('is idempotent — running openDb twice on same path does not error', () => {
    db = openDb(tmpPath);
    db.close();
    db = openDb(tmpPath);
    expect(() => db.prepare('SELECT COUNT(*) FROM todos').get()).not.toThrow();
  });
});
