import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const node = process.execPath;
const task = process.argv[2];

const tasks = {
  seed: {
    cwd: path.join(root, 'server'),
    args: ['src/seed/seed.js'],
  },
  test: {
    cwd: path.join(root, 'server'),
    args: [
      '--experimental-vm-modules',
      'node_modules/jest/bin/jest.js',
      '--forceExit',
      '--detectOpenHandles',
    ],
  },
  build: {
    cwd: path.join(root, 'client'),
    args: ['node_modules/vite/bin/vite.js', 'build'],
  },
  'dev-server': {
    cwd: path.join(root, 'server'),
    args: ['--watch', 'src/server.js'],
  },
  'dev-client': {
    cwd: path.join(root, 'client'),
    args: ['node_modules/vite/bin/vite.js'],
  },
};

const config = tasks[task];
if (!config) {
  console.error(`Unknown task: ${task}`);
  process.exit(1);
}

const result = spawnSync(node, config.args, {
  cwd: config.cwd,
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 1);
