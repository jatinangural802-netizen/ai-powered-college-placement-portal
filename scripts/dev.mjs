import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const node = process.execPath;
const serverDir = path.join(root, 'server');

function loadEnv() {
  const env = { ...process.env };
  const p = path.join(serverDir, '.env');
  if (!existsSync(p)) return env;
  readFileSync(p, 'utf8').split('\n').forEach((line) => {
    const t = line.trim();
    if (!t || t.startsWith('#')) return;
    const i = t.indexOf('=');
    if (i === -1) return;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  });
  return env;
}

const env = loadEnv();

console.log('\n🚀 CareerBridge\n  Frontend → http://localhost:5173');
console.log('  Backend  → http://localhost:5000/api');
console.log('  Login    → student@example.com / Student@123\n');

const server = spawn(node, ['--watch', 'src/server.js'], { cwd: serverDir, stdio: 'inherit', env });
const client = spawn(node, ['node_modules/vite/bin/vite.js'], { cwd: path.join(root, 'client'), stdio: 'inherit', env });

const stop = () => { server.kill(); client.kill(); process.exit(0); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
