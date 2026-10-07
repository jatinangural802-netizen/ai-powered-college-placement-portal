import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const targets = [
  { label: 'root', cwd: root },
  { label: 'server', cwd: path.join(root, 'server') },
  { label: 'client', cwd: path.join(root, 'client') },
];

for (const { label, cwd } of targets) {
  console.log(`\nInstalling ${label} dependencies...\n`);
  const result = spawnSync(npm, ['install'], {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('\nAll dependencies installed successfully.\n');
