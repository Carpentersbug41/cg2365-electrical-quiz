const fs = require('node:fs');
const path = require('node:path');

const distDir = (process.env.NEXT_DIST_DIR || '.next').trim() || '.next';
const resolvedDistDir = path.resolve(process.cwd(), distDir);

if (!fs.existsSync(resolvedDistDir)) {
  process.exit(0);
}

fs.rmSync(resolvedDistDir, { recursive: true, force: true });
console.log(`[cleanNextDist] Removed ${resolvedDistDir}`);
