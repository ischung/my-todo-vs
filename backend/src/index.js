const { createApp } = require('./app');

const PORT = process.env.PORT || 8080;
const app = createApp();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[backend] listening on http://localhost:${PORT}`);
});
