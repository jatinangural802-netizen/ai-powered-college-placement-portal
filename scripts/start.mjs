import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
spawn(process.execPath, ['scripts/dev.mjs'], { cwd: root, stdio: 'inherit' });
