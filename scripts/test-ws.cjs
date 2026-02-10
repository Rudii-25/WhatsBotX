const WebSocket = require('ws');
const url = process.argv[2] || 'wss://web.whatsapp.com/ws/chat';

console.log('Testing WebSocket TLS connection to:', url);

const ws = new WebSocket(url, {
  handshakeTimeout: 20000,
  rejectUnauthorized: true
});

ws.on('open', () => {
  console.log('OPEN: WebSocket connection established');
  ws.close();
});

ws.on('close', (code, reason) => {
  console.log('CLOSE:', code, reason && reason.toString());
});

ws.on('error', (err) => {
  console.error('ERROR:', err && err.stack ? err.stack : err);
});

ws.on('unexpected-response', (req, res) => {
  console.error('UNEXPECTED RESPONSE:', res.statusCode);
});
