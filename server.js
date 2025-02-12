const { createServer } = require('http');
const next = require('next');
const { initializeSocket } = require('./src/lib/socket');

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(); // ✅ Create a separate HTTP server

  initializeSocket(httpServer); // ✅ Ensure WebSocket is initialized on HTTP server

  httpServer.on('request', (req, res) => {
    handle(req, res);
  });

  httpServer.listen(5000, () => {
    console.log('🚀 WebSocket Server running on port 5000');
  });
});