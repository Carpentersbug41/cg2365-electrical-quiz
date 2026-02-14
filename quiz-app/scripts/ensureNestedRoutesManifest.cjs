const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const baseName = path.basename(cwd);
const sourceNextDir = path.join(cwd, '.next');

if (!fs.existsSync(sourceNextDir)) {
  process.exit(0);
}

const nestedNextDir = path.join(cwd, baseName, '.next');
fs.mkdirSync(path.dirname(nestedNextDir), { recursive: true });
fs.cpSync(sourceNextDir, nestedNextDir, { recursive: true, force: true });
