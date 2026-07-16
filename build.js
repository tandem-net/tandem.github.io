// Zero-dependency build: copy the static site into ./build for GitHub Pages.
// The deploy workflow (.github/workflows/deploy.yml) runs `npm run build` and
// publishes ./build. Node 18+ (fs.cpSync / fs.rmSync) — CI uses Node 22.
const fs = require('fs');
const path = require('path');

const root = __dirname;
const out = path.join(root, 'build');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

// Top-level files shipped as-is.
const files = ['index.html', 'styles.css', 'landing.css', 'main.js', 'CNAME'];
for (const f of files) {
  fs.copyFileSync(path.join(root, f), path.join(out, f));
}

// Static asset directories.
fs.cpSync(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });

console.log('Built site into ./build (' + files.length + ' files + assets/)');
