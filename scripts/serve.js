// Tiny zero-dependency static server for local preview of ./build.
// Usage: npm start  (builds then serves)  ·  npm run serve  (serves existing build)
const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'build');
const port = process.env.PORT || 3000;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.webm': 'video/webm',
  '.json': 'application/json',
};

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/' || rel.endsWith('/')) rel += 'index.html';
  const file = path.normalize(path.join(dir, rel));
  if (!file.startsWith(dir)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, () => console.log('Serving ./build on http://localhost:' + port));
