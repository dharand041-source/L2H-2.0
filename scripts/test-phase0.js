/**
 * LEARN-2-HIRE PHASE 0 AUTOMATED VERIFICATION SUITE
 * Validates architecture, design tokens, database schemas, types, and API contracts.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function runStep(title, fn) {
  process.stdout.write(`[PHASE 0 TEST] ${title}... `);
  try {
    fn();
    console.log('✓ PASSED');
  } catch (err) {
    console.log('✗ FAILED');
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

console.log('============================================================');
console.log('LEARN-2-HIRE 2.0: PHASE 0 ARCHITECTURE VALIDATION');
console.log('============================================================\n');

// 1. Directory Structure
runStep('Verifying Monorepo Topology', () => {
  const requiredDirs = [
    'apps/web/src/app',
    'apps/web/src/components/ui',
    'apps/web/src/components/layout',
    'apps/web/src/styles',
    'apps/api/app/core',
    'apps/api/app/domains',
    'apps/api/app/providers',
    'apps/api/app/schemas',
    'packages/types/src',
    'packages/validation/src',
    'packages/design-system/src',
    'packages/database/migrations',
    'packages/database/seeds',
    'docs/architecture',
  ];

  for (const dir of requiredDirs) {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing required directory: ${dir}`);
    }
  }
});

// 2. Exact Mandatory Color Palette Tokens
runStep('Verifying 5 Mandatory Brand Color Tokens', () => {
  const tokensPath = path.join(__dirname, '..', 'packages/design-system/src/tokens.ts');
  const tokensContent = fs.readFileSync(tokensPath, 'utf8');

  const requiredColors = [
    { name: 'orange', hex: '#E43D12' },
    { name: 'rose', hex: '#D6536D' },
    { name: 'pink', hex: '#FFA2B6' },
    { name: 'yellow', hex: '#EFB11D' },
    { name: 'cream', hex: '#EBE9E1' },
    { name: 'ink', hex: '#171714' },
    { name: 'paper', hex: '#F7F5EF' },
  ];

  for (const color of requiredColors) {
    if (!tokensContent.includes(color.hex)) {
      throw new Error(`Color token ${color.name} (${color.hex}) is missing from design tokens!`);
    }
  }
});

// 3. Database Schema and Seed DDL
runStep('Verifying Database DDL and Relational Integrity', () => {
  execSync('node packages/database/test-ddl.js', { stdio: 'pipe' });
});

// 4. Python API Schemas & Unit Tests
runStep('Verifying Python API Models and Unittests', () => {
  execSync('python apps/api/tests/test_api_unittest.py', { stdio: 'pipe' });
});

// 5. Environment Variables Spec
runStep('Verifying Environment Configuration Template (.env.example)', () => {
  const envPath = path.join(__dirname, '..', '.env.example');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.example missing!');
  }
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredKeys = [
    'DATABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'AI_PROVIDER_DEFAULT',
    'REDIS_URL'
  ];
  for (const key of requiredKeys) {
    if (!envContent.includes(key)) {
      throw new Error(`Required environment key ${key} is missing in .env.example`);
    }
  }
});

// 6. Documentation Blueprint Integrity
runStep('Verifying Master Architecture Documentation', () => {
  const docPath = path.join(__dirname, '..', 'docs/architecture/ARCHITECTURE_SPECIFICATION.md');
  if (!fs.existsSync(docPath)) {
    throw new Error('docs/architecture/ARCHITECTURE_SPECIFICATION.md missing!');
  }
});

console.log('\n============================================================');
console.log('ALL PHASE 0 ARCHITECTURAL GATES PASSED SUCCESSFULLY!');
console.log('The system foundation is structurally sound and ready for Phase 1.');
console.log('============================================================\n');
