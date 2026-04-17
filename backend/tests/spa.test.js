const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const request = require('supertest');
const { createApp } = require('../src/app');

describe('SPA serving', () => {
  let tmpDir;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spa-'));
    fs.writeFileSync(
      path.join(tmpDir, 'index.html'),
      '<!doctype html><html><body><div id="root">FAKE SPA</div></body></html>'
    );
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('serves index.html on /', async () => {
    const app = createApp({ spaDir: tmpDir });
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('FAKE SPA');
  });

  it('returns SPA fallback for unknown non-/api routes', async () => {
    const app = createApp({ spaDir: tmpDir });
    const res = await request(app).get('/some/client/route');
    expect(res.status).toBe(200);
    expect(res.text).toContain('FAKE SPA');
  });

  it('does not intercept /api routes (still returns JSON 404 for unknown API)', async () => {
    const app = createApp({ spaDir: tmpDir });
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
    expect(res.text).not.toContain('FAKE SPA');
  });
});
