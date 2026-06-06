import net from 'node:net';
import { spawn } from 'node:child_process';
import path from 'node:path';

function checkHost(host, port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => resolve(false));
    server.listen({ port, host }, () => {
      server.close(() => resolve(true));
    });
  });
}

async function isPortAvailable(port) {
  const hosts = ['127.0.0.1', '::'];
  for (const host of hosts) {
    if (!(await checkHost(host, port))) return false;
  }
  return true;
}

async function findAvailablePort(preferred = 3000, maxAttempts = 100) {
  for (let offset = 0; offset < maxAttempts; offset++) {
    const port = preferred + offset;
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`No free port found from ${preferred} to ${preferred + maxAttempts - 1}`);
}

function runNext(port) {
  return new Promise((resolve) => {
    const nextBin = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');
    const child = spawn(process.execPath, [nextBin, 'dev', '-p', String(port)], {
      cwd: process.cwd(),
      env: { ...process.env, PORT: String(port) },
    });

    let output = '';

    child.stdout?.on('data', (chunk) => {
      process.stdout.write(chunk);
      output += chunk;
    });

    child.stderr?.on('data', (chunk) => {
      process.stderr.write(chunk);
      output += chunk;
    });

    child.on('exit', (code, signal) => {
      if (signal) {
        resolve({ type: 'signal', signal });
        return;
      }

      if (output.includes('EADDRINUSE')) {
        resolve({ type: 'busy' });
        return;
      }

      resolve({ type: 'exit', code: code ?? 1 });
    });

    for (const signal of ['SIGINT', 'SIGTERM']) {
      process.on(signal, () => child.kill(signal));
    }
  });
}

const preferredPort = Number(process.env.PORT) || Number(process.argv[2]) || 3000;

for (let offset = 0; offset < 100; offset++) {
  const port = preferredPort + offset;

  if (!(await isPortAvailable(port))) {
    if (offset === 0) {
      console.log(`Port ${preferredPort} is busy, finding next available port...`);
    }
    continue;
  }

  if (port !== preferredPort) {
    console.log(`Using port ${port}`);
  } else {
    console.log(`Starting dev server on port ${port}`);
  }

  const result = await runNext(port);

  if (result.type === 'busy') {
    console.log(`Port ${port} was taken, retrying...`);
    continue;
  }

  if (result.type === 'signal') {
    process.exit(0);
  }

  process.exit(result.code);
}

console.error(`No free port found from ${preferredPort} to ${preferredPort + 99}`);
process.exit(1);
