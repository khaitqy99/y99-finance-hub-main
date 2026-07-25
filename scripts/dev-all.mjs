import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const apps = [
  {
    name: 'webclient',
    cwd: path.join(root, 'y99-webclient'),
    port: 3000,
    command: process.execPath,
    args: [path.join(root, 'scripts', 'dev-next.mjs'), '3000'],
  },
  {
    name: 'webadmin',
    cwd: path.join(root, 'y99-webadmin'),
    port: 3001,
    command: process.execPath,
    args: [path.join(root, 'scripts', 'dev-next.mjs'), '3001'],
  },
  {
    name: 'lms',
    cwd: path.join(root, 'y99-lms'),
    port: 3002,
    command: process.execPath,
    args: [path.join(root, 'y99-lms', 'node_modules', 'next', 'dist', 'bin', 'next'), 'dev', '-p', '3002'],
  },
];

const children = [];

function prefixOutput(name, port, stream) {
  stream.on('data', (chunk) => {
    const lines = chunk.toString().split('\n');
    for (const line of lines) {
      if (line.length > 0) {
        process.stdout.write(`[${name}:${port}] ${line}\n`);
      }
    }
  });
}

for (const app of apps) {
  const child = spawn(app.command, app.args, {
    cwd: app.cwd,
    env: { ...process.env, PORT: String(app.port) },
  });

  prefixOutput(app.name, app.port, child.stdout);
  prefixOutput(app.name, app.port, child.stderr);

  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`[${app.name}] stopped (${signal})`);
      return;
    }
    if (code !== 0) {
      console.error(`[${app.name}] exited with code ${code}`);
    }
  });

  children.push(child);
}

console.log('Y99 dev servers:');
console.log('  webclient → http://localhost:3000');
console.log('  webadmin  → http://localhost:3001');
console.log('  lms       → http://localhost:3002');

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    for (const child of children) child.kill(signal);
  });
}
