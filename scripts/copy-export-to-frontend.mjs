import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const sourceDir = path.join(repoRoot, 'osks', 'exported', 'v1');
const targetDir = path.join(repoRoot, 'frontend', 'public', 'api', 'v1');

if (!fs.existsSync(sourceDir)) {
  throw new Error(`Source export directory not found: ${sourceDir}`);
}

fs.mkdirSync(targetDir, { recursive: true });

let copiedCount = 0;
for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
  const sourcePath = path.join(sourceDir, entry.name);
  const targetPath = path.join(targetDir, entry.name);

  if (entry.isDirectory()) {
    fs.cpSync(sourcePath, targetPath, { recursive: true, force: true });
  } else {
    fs.copyFileSync(sourcePath, targetPath);
  }
  copiedCount += 1;
}

console.log(`Copied ${copiedCount} export file(s) from ${sourceDir} to ${targetDir}`);
