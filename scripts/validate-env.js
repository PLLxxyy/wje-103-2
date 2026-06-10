const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const envExamplePath = path.join(rootDir, '.env.example');

function parseEnv(filePath) {
  const vars = {};
  if (!fs.existsSync(filePath)) return vars;
  const content = fs.readFileSync(filePath, 'utf-8');
  content.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) return;
    const key = line.slice(0, eqIdx).trim();
    const value = line.slice(eqIdx + 1).trim();
    vars[key] = value;
  });
  return vars;
}

function validate() {
  console.log('🔍 Validating environment configuration...\n');

  const exampleVars = parseEnv(envExamplePath);
  const exampleKeys = Object.keys(exampleVars);

  if (exampleKeys.length === 0) {
    console.error('❌ .env.example not found or empty');
    process.exit(1);
  }

  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found. Copy .env.example to .env and fill in the values.');
    process.exit(1);
  }

  const envVars = parseEnv(envPath);
  const missing = [];
  const weak = [];

  for (const key of exampleKeys) {
    if (!(key in envVars) || envVars[key] === '') {
      missing.push(key);
    }
  }

  const secretKeys = ['JWT_SECRET', 'DB_ROOT_PASSWORD', 'DB_PASSWORD'];
  for (const key of secretKeys) {
    if (envVars[key] && envVars[key].length < 10) {
      weak.push(key);
    }
    if (envVars[key] && envVars[key].includes('your-') && envVars[key].includes('change')) {
      if (!weak.includes(key)) weak.push(key);
    }
  }

  let hasError = false;

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables:\n`);
    missing.forEach(k => console.error(`   - ${k}`));
    console.log('');
    hasError = true;
  }

  if (weak.length > 0) {
    console.warn(`⚠️  Weak or default values detected (production warning):\n`);
    weak.forEach(k => console.warn(`   - ${k}`));
    console.log('');
  }

  if (hasError) {
    console.error('❌ Environment validation failed.');
    process.exit(1);
  }

  console.log('✅ Environment configuration is valid.');
  if (weak.length > 0) {
    console.log(`   (${weak.length} warning(s) — consider updating before production use)`);
  }
  console.log('');
}

validate();
