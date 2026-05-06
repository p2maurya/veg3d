const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\39a65e1b-c8d5-435f-968e-e4d47ce43d3a';
const destDir = path.join(__dirname, 'web', 'public', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach(file => {
  if (file.endsWith('.png')) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    console.log(`Copied ${file} to public/images/`);
  }
});

console.log('Done copying images!');
