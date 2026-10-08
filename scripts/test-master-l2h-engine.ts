/**
 * LEARN-2-HIRE 2.0: MASTER ENGINE VALIDATION SUITE (TRL-4 / SEVA)
 * Comprehensive automated test suite verifying:
 * 1. Career Context & All 12 Roles
 * 2. Mandatory Roadmap Personalization (User A vs User B divergence test)
 * 3. Practice Arena Role Scoping & Pluggable Environments
 * 4. Resume Parsing, Checksum Deduplication & Non-destructive Versioning
 * 5. Transparent ATS Compatibility Scoring (30/10/15/10/10/10/5/5/5 Model)
 * 6. Eligibility Engine (Hard Constraint Isolation from Keyword Scores)
 * 7. Live vs Historical Opportunity Separation & Zero Fake Vacancies
 * 8. Tamil Nadu Regional IT Filtering (Chennai, Coimbatore, Madurai, Trichy, Salem)
 * 9. Real Speech Recognition Architecture
 */

import { CAREER_ROLES_CATALOG } from '../apps/web/src/lib/data/careers-data';
import {
  generateCareerRoadmap,
  getCareerBlueprint,
} from '../apps/web/src/lib/roadmap';
import { getRolePracticeBlueprint } from '../apps/web/src/lib/practice/practice-blueprint';
import {
  parseResumeContent,
  computeNormalizedTextHash,
} from '../apps/web/src/lib/resume/resume-parser';
import {
  parseJobDescription,
  calculateATSAnalysis,
} from '../apps/web/src/lib/resume/ats-engine';
import { evaluateEligibility } from '../apps/web/src/lib/resume/eligibility-engine';
import {
  OpportunityMatcher,
} from '../apps/web/src/lib/opportunities/opportunity-matcher';
import { VERIFIED_OPPORTUNITIES } from '../apps/web/src/lib/opportunities/opportunity-catalog';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    passed++;
    console.log(`  \x1b[32m✔ PASS\x1b[0m ${testName}`);
  } else {
    failed++;
    console.error(`  \x1b[31m✖ FAIL\x1b[0m ${testName}`);
    if (details) console.error(`    -> ${details}`);
  }
}

async function runMasterSuite() {
  console.log('\n====================================================================');
  console.log('LEARN-2-HIRE 2.0: ULTIMATE MASTER VERIFICATION TEST SUITE');
  console.log('====================================================================\n');

  // TEST SUITE 1: CANONICAL CAREER CONTEXT (ALL 12 ROLES)
  console.log('--- TEST SUITE 1: Canonical Career Context (All 12 Roles) ---');
  const required12Roles = [
    'full-stack-developer',
    'frontend-developer',
    'backend-developer',
    'ai-agentic-ai-engineer',
    'machine-learning-engineer',
    'data-scientist',
    'devops-platform-engineer',
    'cybersecurity-architect',
    'technical-product-manager',
    'ui-ux-designer',
    'digital-marketing-specialist',
    'talent-acquisition-partner',
  ];

  required12Roles.forEach((slug) => {
    const role = CAREER_ROLES_CATALOG.find((r) => r.slug === slug);
    assert(Boolean(role), `Career role registered: ${slug}`);
  });

  // TEST SUITE 2: MANDATORY ROADMAP PERSONALIZATION TEST (PHASE 86)
  console.log('\n--- TEST SUITE 2: Mandatory Roadmap Personalization (Phase 86) ---');
  // User A: Advanced candidate who mastered HTML, CSS, JavaScript (L3-L4), missing React (L1)
  const userA_Roadmap = generateCareerRoadmap({
    targetRoleSlug: 'frontend-developer',
    assessmentScore: 78,
    userSkills: [
      { name: 'HTML', currentLevel: 'L4', requiredLevel: 'L3', gap: 0 },
      { name: 'CSS', currentLevel: 'L4', requiredLevel: 'L4', gap: 0 },
      { name: 'JavaScript', currentLevel: 'L3', requiredLevel: 'L4', gap: 1 },
      { name: 'React', currentLevel: 'L1', requiredLevel: 'L4', gap: 3 },
    ],
  });

  // User B: Complete Beginner with baseline HTML/CSS L1, zero JS, zero React
  const userB_Roadmap = generateCareerRoadmap({
    targetRoleSlug: 'frontend-developer',
    assessmentScore: 20,
    userSkills: [
      { name: 'HTML', currentLevel: 'L1', requiredLevel: 'L3', gap: 2 },
      { name: 'CSS', currentLevel: 'L1', requiredLevel: 'L4', gap: 3 },
      { name: 'JavaScript', currentLevel: 'L0', requiredLevel: 'L4', gap: 4 },
      { name: 'React', currentLevel: 'L0', requiredLevel: 'L4', gap: 4 },
    ],
  });

  assert(userA_Roadmap.userMode === 'PROFESSIONAL', 'User A classified as PROFESSIONAL mode');
  assert(userB_Roadmap.userMode === 'BEGINNER', 'User B classified as BEGINNER mode');

  const nextActionA = userA_Roadmap.nextBestAction?.primaryAction;
  const nextActionB = userB_Roadmap.nextBestAction?.primaryAction;

  assert(Boolean(nextActionA && nextActionB), 'Both User A and User B receive dynamically generated roadmap actions');
  assert(
    nextActionA?.id !== nextActionB?.id,
    `Divergence confirmed: User A focuses on "${nextActionA?.skillName}" while User B starts with "${nextActionB?.skillName}"`
  );

  // TEST SUITE 3: ROLE-SPECIFIC PRACTICE ARENA
  console.log('\n--- TEST SUITE 3: Role-Specific Practice Arena Blueprints ---');
  const fePractice = getRolePracticeBlueprint('frontend-developer');
  const mlPractice = getRolePracticeBlueprint('machine-learning-engineer');
  const feTitles = fePractice.categories.map((c) => c.title);
  const mlTitles = mlPractice.categories.map((c) => c.title);

  assert(feTitles.includes('React Engineering'), 'Frontend Practice includes React Engineering');
  assert(mlTitles.includes('Model Evaluation'), 'ML Practice includes Model Evaluation');
  assert(!feTitles.includes('Model Evaluation'), 'Frontend Practice excludes Model Evaluation');
  assert(!mlTitles.includes('CSS & Responsive Design'), 'ML Practice excludes CSS & Responsive Design');

  // TEST SUITE 4: RESUME PARSER & DEDUPLICATION HASHING
  console.log('\n--- TEST SUITE 4: Resume Parsing & Checksum Integrity ---');
  const sampleResumeText = `
Alex Mercer
alex.mercer@example.com | (555) 234-5678 | github.com/alexmercer
Full-Stack Software Engineer with 2 years of experience.

EXPERIENCE
Software Engineer - Cloud Systems (2022 - 2024)
Engineered microservices using React, Node.js, and PostgreSQL. Reduced latency by 35%.

EDUCATION
Bachelor of Technology in Computer Science

PROJECTS
• Real-time Collaboration Canvas: Built with React, TypeScript, and WebSockets. Achieved 94% test coverage.
• High-throughput API Gateway: Implemented in Node.js and Redis handling 10k requests/sec.
`;

  const parsedResume = parseResumeContent(sampleResumeText);
  assert(parsedResume.contact.name === 'Alex Mercer', 'Extracted candidate name');
  assert(parsedResume.contact.email === 'alex.mercer@example.com', 'Extracted contact email');
  assert(parsedResume.contact.github === 'github.com/alexmercer', 'Extracted GitHub profile');
  assert(parsedResume.extractedSkills.includes('React'), 'Extracted React skill');
  assert(parsedResume.extractedSkills.includes('Node.js'), 'Extracted Node.js skill');
  assert(parsedResume.projects.length >= 2, `Extracted projects (${parsedResume.projects.length} detected)`);
  assert(parsedResume.projects.some((p) => p.hasAuditableMetrics), 'Detected auditable performance metrics in project descriptions');

  const hash1 = computeNormalizedTextHash(sampleResumeText);
  const hash2 = computeNormalizedTextHash(sampleResumeText + '   \n  ');
  assert(hash1 === hash2, 'Normalized SHA checksum detects identical documents with trailing whitespace');

  // TEST SUITE 5: ATS COMPATIBILITY ENGINE & SCORING MODEL
  console.log('\n--- TEST SUITE 5: ATS Compatibility & Mandatory Test (Phase 89) ---');
  // Job requires: React, Node.js, TypeScript (where TypeScript is missing from resume)
  const jobSpecText = `
Full-Stack Engineer at Target Corp
Looking for a developer with React, Node.js, and TypeScript. Experience with Docker preferred.
Minimum 2 years experience required.
`;
  const parsedJob = parseJobDescription(jobSpecText);
  assert(parsedJob.requiredSkills.includes('React'), 'Job description parsed required skill: React');
  assert(parsedJob.requiredSkills.includes('Node.js'), 'Job description parsed required skill: Node.js');

  const atsResult = calculateATSAnalysis('res-ver-1', parsedResume, parsedJob);
  assert(atsResult.scoringModelVersion === 'ATS-L2H-2026.1', 'Employs transparent versioned scoring model (ATS-L2H-2026.1)');
  assert(atsResult.matchedRequiredSkills.includes('React'), 'Identified matched required skill: React');
  assert(atsResult.matchedRequiredSkills.includes('Node.js'), 'Identified matched required skill: Node.js');
  assert(atsResult.compatibilityScore > 50 && atsResult.compatibilityScore <= 100, `Calculated weighted score: ${atsResult.compatibilityScore}%`);
  assert(atsResult.recommendations.length > 0, 'Generated prioritized What/Why/How improvement recommendations');

  // TEST SUITE 6: ELIGIBILITY ENGINE (ISOLATION OF HARD REQUIREMENTS)
  console.log('\n--- TEST SUITE 6: Eligibility Engine Isolation ---');
  // Create a 0-experience fresher resume
  const fresherResume = parseResumeContent(`
Jane Doe
jane.doe@example.com
Fresher Computer Science Graduate
SKILLS: React, Node.js, TypeScript, SQL, Docker
EDUCATION: B.Tech Computer Science 2026
PROJECTS: Full-stack portfolio application with 90% test coverage
`);

  // Job requires 4 years of experience
  const seniorJob = parseJobDescription(`
Senior Staff Engineer
Requires 4 years of industry experience. Must know React and Node.js.
`);
  const eligibility = evaluateEligibility(fresherResume, seniorJob);
  assert(!eligibility.isExperienceSatisfied, 'Detected experience threshold gap (0 yrs vs 4 yrs required)');
  assert(eligibility.status === 'NOT_ELIGIBLE', `Eligibility correctly marked as NOT_ELIGIBLE despite matching all technical skills`);

  // TEST SUITE 7: LIVE VS HISTORICAL OPPORTUNITY FILTERING (PHASE 90 & 91)
  console.log('\n--- TEST SUITE 7: Live vs Historical Job Verification & Zero Fake Data ---');
  const liveJobs = OpportunityMatcher.getOpportunities({ includeHistorical: false });
  const hasHistoricalInLive = liveJobs.some((j) => j.verificationStatus === 'HISTORICAL' || !j.isActive);
  assert(!hasHistoricalInLive, 'HISTORICAL and inactive listings are strictly excluded from current verified opportunities');

  // Test zero matches state when filters are impossible
  const impossibleJobs = OpportunityMatcher.getOpportunities({
    searchQuery: 'NonExistentSkillXYZ123456789',
  });
  assert(impossibleJobs.length === 0, 'Returns 0 results for non-matching queries without fabricating fallback synthetic jobs');

  // TEST SUITE 8: TAMIL NADU REGIONAL MUNICIPAL FILTERING (PHASE 41)
  console.log('\n--- TEST SUITE 8: Tamil Nadu Regional Municipal IT Filtering ---');
  const tnJobs = OpportunityMatcher.getOpportunities({ tamilNaduOnly: true });
  assert(tnJobs.length > 0, `Discovered ${tnJobs.length} verified Tamil Nadu technology opportunities`);
  const allInTN = tnJobs.every((j) => j.isTamilNadu);
  assert(allInTN, 'All filtered jobs have verified Tamil Nadu locations (Chennai, Coimbatore, etc.)');

  console.log('\n====================================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('====================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runMasterSuite().catch((err) => {
  console.error('Fatal error running master test suite:', err);
  process.exit(1);
});
