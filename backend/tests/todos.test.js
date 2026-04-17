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

describe('POST /api/todos', () => {
  let app;
  let tmpPath;

  beforeAll(() => {
    tmpPath = path.join(os.tmpdir(), `todos-post-test-${Date.now()}.db`);
    process.env.DB_PATH = tmpPath;
    jest.resetModules();
    app = require('../src/app').createApp({ spaDir: '/nonexistent' });
  });

  afterAll(() => {
    require('../src/db').closeDb();
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    delete process.env.DB_PATH;
  });

  it('creates a todo and returns 201', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: '회의 준비', date: '2026-04-17' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: '회의 준비',
      date: '2026-04-17',
      completed: false,
    });
    expect(res.body.id).toBeGreaterThan(0);
  });

  it('returns 400 for empty title', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: '', date: '2026-04-17' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for title over 100 chars', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'a'.repeat(101), date: '2026-04-17' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid date', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'valid', date: 'no-date' });
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/todos/:id', () => {
  let app;
  let tmpPath;
  let created;

  beforeAll(async () => {
    tmpPath = path.join(os.tmpdir(), `todos-patch-test-${Date.now()}.db`);
    process.env.DB_PATH = tmpPath;
    jest.resetModules();
    app = require('../src/app').createApp({ spaDir: '/nonexistent' });
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'original', date: '2026-04-17' });
    created = res.body;
  });

  afterAll(() => {
    require('../src/db').closeDb();
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    delete process.env.DB_PATH;
  });

  it('updates title', async () => {
    const res = await request(app)
      .patch(`/api/todos/${created.id}`)
      .send({ title: 'updated' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('updated');
  });

  it('toggles completed', async () => {
    const res = await request(app)
      .patch(`/api/todos/${created.id}`)
      .send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('returns 404 for missing id', async () => {
    const res = await request(app)
      .patch(`/api/todos/99999`)
      .send({ title: 'nope' });
    expect(res.status).toBe(404);
  });

  it('returns 400 for empty title', async () => {
    const res = await request(app)
      .patch(`/api/todos/${created.id}`)
      .send({ title: '' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/todos/dates', () => {
  let app;
  let tmpPath;

  beforeAll(async () => {
    tmpPath = path.join(os.tmpdir(), `todos-dates-test-${Date.now()}.db`);
    process.env.DB_PATH = tmpPath;
    jest.resetModules();
    app = require('../src/app').createApp({ spaDir: '/nonexistent' });
    await request(app).post('/api/todos').send({ title: 'a', date: '2026-04-03' });
    await request(app).post('/api/todos').send({ title: 'b', date: '2026-04-17' });
    await request(app).post('/api/todos').send({ title: 'c', date: '2026-04-17' });
    await request(app).post('/api/todos').send({ title: 'd', date: '2026-05-01' });
  });

  afterAll(() => {
    require('../src/db').closeDb();
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    delete process.env.DB_PATH;
  });

  it('returns distinct dates in requested month', async () => {
    const res = await request(app).get('/api/todos/dates?year=2026&month=4');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(['2026-04-03', '2026-04-17']);
  });

  it('returns empty array for month with no todos', async () => {
    const res = await request(app).get('/api/todos/dates?year=2026&month=12');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 400 for invalid month', async () => {
    const res = await request(app).get('/api/todos/dates?year=2026&month=13');
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/todos/:id', () => {
  let app;
  let tmpPath;

  beforeAll(() => {
    tmpPath = path.join(os.tmpdir(), `todos-del-test-${Date.now()}.db`);
    process.env.DB_PATH = tmpPath;
    jest.resetModules();
    app = require('../src/app').createApp({ spaDir: '/nonexistent' });
  });

  afterAll(() => {
    require('../src/db').closeDb();
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    delete process.env.DB_PATH;
  });

  it('deletes a todo and returns 204', async () => {
    const created = await request(app)
      .post('/api/todos')
      .send({ title: 'to delete', date: '2026-04-17' });
    const res = await request(app).delete(`/api/todos/${created.body.id}`);
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  it('returns 404 for missing id', async () => {
    const res = await request(app).delete(`/api/todos/99999`);
    expect(res.status).toBe(404);
  });
});
