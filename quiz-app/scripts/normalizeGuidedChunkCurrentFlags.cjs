/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');

const storePath = path.join(process.cwd(), '.runtime', 'guided-chunk-version-store.json');

function main() {
  if (!fs.existsSync(storePath)) {
    throw new Error(`Store not found: ${storePath}`);
  }

  const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
  const versions = Array.isArray(store.versions) ? store.versions : [];
  const lessons = Array.isArray(store.lessons) ? store.lessons : [];

  for (const lesson of lessons) {
    const lessonVersions = versions
      .filter((version) => version.lessonId === lesson.id)
      .sort((a, b) => a.versionNo - b.versionNo);

    for (const version of lessonVersions) {
      version.isCurrent = false;
    }

    const published = lessonVersions.filter((version) => version.status === 'published');
    const preferred = published[published.length - 1] ?? lessonVersions[lessonVersions.length - 1] ?? null;
    if (preferred) {
      preferred.isCurrent = preferred.status !== 'retired';
    }
  }

  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
  console.log('Normalized guided chunk current flags.');
}

main();
