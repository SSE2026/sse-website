/**
 * Post-build: copy dist/api/ to dist/root/api/
 * so Vercel finds the serverless function at dist/root/api/index.js
 * (Vercel looks for api/ at the root of the output directory artifact)
 */
const fs = require('fs');
const path = require('path');

const srcApi = path.join(__dirname, '..', 'dist', 'api');
const destRoot = path.join(__dirname, '..', 'dist', 'root');

if (!fs.existsSync(srcApi)) {
  console.error('dist/api/ not found — run "npm run build" first');
  process.exit(1);
}

// Remove existing dist/root
const rmrf = (dir) => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(f => {
      const p = path.join(dir, f);
      fs.statSync(p).isDirectory() ? rmrf(p) : fs.unlinkSync(p);
    });
    fs.rmdirSync(dir);
  }
};
rmrf(destRoot);

// Copy dist/api/ → dist/root/api/
const copyrf = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src).forEach(f => {
    const s = path.join(src, f);
    const d = path.join(dest, f);
    fs.statSync(s).isDirectory() ? copyrf(s, d) : fs.copyFileSync(s, d);
  });
};
copyrf(srcApi, path.join(destRoot, 'api'));

console.log('Copied dist/api/ → dist/root/api/');
