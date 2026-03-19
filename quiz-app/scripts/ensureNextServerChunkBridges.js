const fs = require('node:fs');
const path = require('node:path');

const distDir = (process.env.NEXT_DIST_DIR || '.next').trim() || '.next';
const serverDir = path.resolve(process.cwd(), distDir, 'server');
const chunksDir = path.join(serverDir, 'chunks');

if (!fs.existsSync(serverDir) || !fs.existsSync(chunksDir)) {
  console.log('[ensureNextServerChunkBridges] No server chunks directory found, skipping.');
  process.exit(0);
}

const chunkFiles = fs
  .readdirSync(chunksDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
  .map((entry) => entry.name);

let createdCount = 0;

for (const chunkFile of chunkFiles) {
  const bridgePath = path.join(serverDir, chunkFile);
  if (fs.existsSync(bridgePath)) {
    continue;
  }

  const bridgeSource = `module.exports = require("./chunks/${chunkFile}");\n`;
  fs.writeFileSync(bridgePath, bridgeSource, 'utf8');
  createdCount += 1;
}

console.log(
  `[ensureNextServerChunkBridges] ${createdCount > 0 ? `Created ${createdCount} bridge file(s)` : 'No bridge files needed'}.`,
);
