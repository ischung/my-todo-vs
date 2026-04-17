const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const request = require('supertest');

describe('GET /api/todos', () => {
  let app;
  let tmpPath;

  beforeAll(() => {
    tmpPath = path.join(os.tmpdir(), `todos-api-test-${Date.now()}.db`);
    process.env.DB_PATH = tmpPath;
    // Force fresh require with new DB_PATH
    jest.resetModules();
    app = require('../src/app').createApp({ spaDir: '/nonexistent' });
    const db = require('../src/db').getDb();
    db.prepare('INSERT INTO todos (title, date) VALUES (?, ?)').run('회의 준비', '2026-04-17');
    db.prepare('INSERT INTO todos (title, date) VALUES (?, ?)').run('점심 약속', '2026-04-17');
    db.prepare('INSERT INTO todos (title, date) VALUES (?, ?)').run('내일 할일', '2026-04-18');
  });

  afterAll(() => {
    require('../src/db').closeDb();
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    delete process.env.DB_PATH;
  });

  it('returns todos for a given date', async () => {
    const res = await request(app).get('/api/todos?date=2026-04-17');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toMatchObject({
      title: '회의 준비',
      date: '2026-04-17',
      completed: false,
    });
  });

  it('returns empty array for a date with no todos', async () => {
    const res = await request(app).get('/api/todos?date=2026-04-20');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 400 for missing date param', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(400);
    expect(res.body.error.message).toMatch(/날짜 형식/);
  });

  it('returns 400 for malformed date', async () => {
    const res = await request(app).get('/api/todos?date=nope');
    expect(res.status).toBe(400);
  });
});
