const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const scriptDir = __dirname;
const backendDir = path.resolve(scriptDir, '..');
const rootDir = path.resolve(scriptDir, '../..');

function loadEnvFrom(dir) {
  const envPath = path.join(dir, '.env');
  if (!fs.existsSync(envPath)) return false;
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
  return true;
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

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node scripts/load-env.cjs <command> [args...]');
    process.exit(1);
  }

  loadEnvFrom(rootDir) || loadEnvFrom(backendDir);
  ensureDerivedVars();

  const [cmd, ...cmdArgs] = args;
  const child = spawn(cmd, cmdArgs, {
    stdio: 'inherit',
    env: process.env,
    cwd: backendDir,
    shell: process.platform === 'win32'
  });

  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    else process.exit(code ?? 0);
  });

  child.on('error', err => {
    console.error(`Failed to execute: ${cmd} ${cmdArgs.join(' ')}`);
    console.error(err.message);
    process.exit(1);
  });
}

main();
