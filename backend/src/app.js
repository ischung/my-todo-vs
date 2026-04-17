const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(express.json({ limit: '10kb' }));

  const corsOrigin = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
    : false;
  app.use(cors({ origin: corsOrigin }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.GIT_SHA || 'dev',
    });
  });

  return app;
}

module.exports = { createApp };
