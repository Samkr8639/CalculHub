const fs = require('fs');
const path = require('path');

function scrubNewlines(dir) {
  const files = fs.readdirSync(dir);
  let changed = 0;
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      changed += scrubNewlines(fullPath);
    } else if (fullPath.endsWith('.html') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('\\n')) {
        content = content.replace(/\\n/g, '');
        fs.writeFileSync(fullPath, content);
        console.log('Scrubbed literal \\n from', fullPath);
        changed++;
      }
    }
  }
  return changed;
}

const total = scrubNewlines(path.join(__dirname, 'src/app/Allcalculators'));
console.log('Total files scrubbed:', total);
