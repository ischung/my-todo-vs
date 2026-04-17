const path = require('node:path');
const fs = require('node:fs');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

function createApp(opts = {}) {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
  app.use(express.json({ limit: '10kb' }));

  const corsOrigin =
    process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : false;
  app.use(cors({ origin: corsOrigin }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.GIT_SHA || 'dev',
    });
  });

  // Serve built frontend SPA from backend (same-origin, no CORS).
  const spaDir =
    opts.spaDir || path.resolve(__dirname, '..', '..', 'frontend', 'dist');

  if (fs.existsSync(spaDir)) {
    app.use(express.static(spaDir));

    // SPA fallback: non-/api routes → index.html
    app.get(/^\/(?!api\/).*/, (_req, res) => {
      res.sendFile(path.join(spaDir, 'index.html'));
    });
  }

  return app;
}

module.exports = { createApp };
