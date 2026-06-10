const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) return;
    const key = line.slice(0, eqIdx).trim();
    const value = line.slice(eqIdx + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  });
}

function ensureDerivedVars() {
  if (!process.env.DATABASE_URL) {
    const user = process.env.DB_USER;
    const pass = process.env.DB_PASSWORD;
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '3306';
    const name = process.env.DB_NAME;
    if (user && pass && name) {
      process.env.DATABASE_URL = `mysql://${user}:${pass}@${host}:${port}/${name}`;
    }
  }
}

function parseArgs(argv) {
  let cwd = null;
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--cwd' && i + 1 < argv.length) {
      cwd = argv[i + 1];
      i++;
    } else {
      rest.push(argv[i]);
    }
  }
  return { cwd, rest };
}

function main() {
  const args = process.argv.slice(2);
  const { cwd, rest } = parseArgs(args);

  if (rest.length === 0) {
    console.error('Usage: node run-with-env.js [--cwd <dir>] <command> [args...]');
    process.exit(1);
  }

  loadEnv();
  ensureDerivedVars();

  const [cmd, ...cmdArgs] = rest;
  const childCwd = cwd ? path.resolve(rootDir, cwd) : undefined;
  const child = spawn(cmd, cmdArgs, {
    stdio: 'inherit',
    env: process.env,
    cwd: childCwd,
    shell: process.platform === 'win32'
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
    } else {
      process.exit(code ?? 0);
    }
  });

  child.on('error', err => {
    console.error(`Failed to execute: ${cmd} ${cmdArgs.join(' ')}`);
    console.error(err.message);
    process.exit(1);
  });
}

main();
