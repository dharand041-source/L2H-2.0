const fs = require('fs');
const path = require('path');

function testDDL() {
  console.log('Testing Canonical Database Schema & Seeds DDL...');

  const migrationPath = path.join(__dirname, 'migrations', '001_initial_canonical_schema.sql');
  const seedPath = path.join(__dirname, 'seeds', '001_initial_seed.sql');

  if (!fs.existsSync(migrationPath)) {
    throw new Error(`Migration file not found at ${migrationPath}`);
  }
  if (!fs.existsSync(seedPath)) {
    throw new Error(`Seed file not found at ${seedPath}`);
  }

  const migrationSql = fs.readFileSync(migrationPath, 'utf8');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  // Verify critical tables are present
  const requiredTables = [
    'profiles',
    'education',
    'experience',
    'career_categories',
    'career_roles',
    'competencies',
    'skills',
    'career_role_skills',
    'user_skills',
    'skill_evidence',
    'skill_gaps',
    'questions',
    'assessment_blueprints',
    'assessment_attempts',
    'assessment_answers',
    'resource_providers',
    'resources',
    'learning_paths',
    'learning_path_items',
    'practice_challenges',
    'practice_attempts',
    'projects',
    'project_milestones',
    'project_submissions',
    'project_evaluations',
    'companies',
    'company_patterns',
    'interview_sessions',
    'interview_feedback',
    'resume_versions',
    'resume_analyses',
    'job_providers',
    'opportunities',
    'saved_opportunities',
    'applications',
    'application_events',
    'improvement_plans',
    'notifications',
    'audit_logs'
  ];

  for (const table of requiredTables) {
    const tablePattern = new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table}\\b`, 'i');
    if (!tablePattern.test(migrationSql)) {
      throw new Error(`Missing expected table definition: public.${table}`);
    }
  }

  // Check RLS enabled
  for (const table of ['profiles', 'user_skills', 'assessment_attempts', 'applications', 'learning_paths']) {
    const rlsPattern = new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY`, 'i');
    if (!rlsPattern.test(migrationSql)) {
      throw new Error(`Missing RLS enablement for table: public.${table}`);
    }
  }

  // Check seeds contain key companies and providers
  if (!seedSql.includes('freeCodeCamp') || !seedSql.includes('Full Stack Developer') || !seedSql.includes('Tata Consultancy Services (TCS)')) {
    throw new Error('Seed file is missing expected benchmark reference data');
  }

  console.log(`✓ DDL Validation Passed: ${requiredTables.length} tables verified with RLS and seed integrity.`);
}

testDDL();
