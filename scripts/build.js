const fs   = require('fs');
const path = require('path');
const babel = require('@babel/core');

const HTML_SRC   = path.join(__dirname, '..', 'public', 'index.html');
const HTML_BUILT = path.join(__dirname, '..', 'public', '_built.html');

const raw = fs.readFileSync(HTML_SRC, 'utf8');
const m   = raw.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
if (!m) {
  fs.writeFileSync(HTML_BUILT, raw);
  console.log('Build ok (no JSX)');
  process.exit(0);
}

const { code } = babel.transformSync(m[1], {
  presets: [['@babel/preset-react', { runtime: 'classic' }]],
  plugins: ['@babel/plugin-transform-block-scoping'],
  compact: false,
  sourceMaps: false,
});

const built = raw
  .replace(/<script[^>]+unpkg\.com[^>]*><\/script>/g, '')
  .replace(m[0], `<script>${code}</script>`)
  .replace('</head>', '<script src="/vendor/react.js"></script>\n<script src="/vendor/react-dom.js"></script>\n</head>');

fs.writeFileSync(HTML_BUILT, built);
console.log('Build ok →', HTML_BUILT);
process.exit(0);
