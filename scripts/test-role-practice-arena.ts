/**
 * LEARN-2-HIRE 2.0: CAREER-AWARE PRACTICE ARENA VERIFICATION SUITE
 * Validates role-specific blueprints, challenge pools, anti-repetition protection,
 * non-coding rubric evaluators, and TRL 4 compliance across all 12 canonical roles.
 */

import {
  getRolePracticeBlueprint,
  getSupportedPracticeRoleSlugs,
  getHydratedRolePracticeBlueprint,
  getRecommendedNextChallenge,
  getPracticeChallengesForRole,
  evaluatePracticeSubmission,
  PRACTICE_CHALLENGES_CATALOG
} from '../apps/web/src/lib/practice';
import { UserSkillItem } from '../apps/web/src/lib/data/state-store';

let passedAssertions = 0;
let totalAssertions = 0;

function assert(condition: boolean, message: string) {
  totalAssertions++;
  if (!condition) {
    console.error(`  [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedAssertions++;
  console.log(`  [PASS] ${message}`);
}

console.log('============================================================');
console.log('LEARN-2-HIRE 2.0: CAREER-AWARE PRACTICE ARENA VERIFICATION');
console.log('============================================================\n');

// ----------------------------------------------------------------------------
// TEST 1: ALL 12 CANONICAL ROLES HAVE DISTINCT BLUEPRINTS
// ----------------------------------------------------------------------------
console.log('1. Verifying Practice Blueprints Across All 12 Roles:');
const expectedRoles = [
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
  'talent-acquisition-partner'
];

for (const slug of expectedRoles) {
  const bp = getRolePracticeBlueprint(slug);
  assert(bp.careerRoleSlug === slug, `Role "${slug}" returns matching careerRoleSlug`);
  assert(bp.categories.length >= 10, `Role "${slug}" has at least 10 specialized categories (found: ${bp.categories.length})`);
  assert(Boolean(bp.careerRoleId), `Role "${slug}" has deterministic UUID: ${bp.careerRoleId}`);
  assert(Boolean(bp.subtitle), `Role "${slug}" features role-aware subtitle`);
}

// ----------------------------------------------------------------------------
// TEST 2: NON-CODING ROLES GET ROLE-APPROPRIATE EVALUATION (NO DSA)
// ----------------------------------------------------------------------------
console.log('\n2. Verifying Non-Coding Career Tracks (Step 59):');

// UI/UX Designer
const uxBp = getRolePracticeBlueprint('ui-ux-designer');
const uxTitles = uxBp.categories.map((c) => c.title.toLowerCase());
assert(uxTitles.some((t) => t.includes('design critique') || t.includes('wireframing')), 'UI/UX includes Design Critique & Wireframing');
assert(!uxTitles.some((t) => t.includes('dsa & problem solving')), 'UI/UX does NOT include generic DSA problem solving');
assert(!uxTitles.some((t) => t.includes('backend api')), 'UI/UX does NOT include Backend API engineering');

// Technical Product Manager
const pmBp = getRolePracticeBlueprint('technical-product-manager');
const pmTitles = pmBp.categories.map((c) => c.title.toLowerCase());
assert(pmTitles.some((t) => t.includes('prioritization') || t.includes('product metrics')), 'Product Manager includes Prioritization & Metrics');
assert(!pmTitles.some((t) => t.includes('kubernetes')), 'Product Manager does NOT include Kubernetes arena');

// Digital Marketing Specialist
const mktBp = getRolePracticeBlueprint('digital-marketing-specialist');
const mktTitles = mktBp.categories.map((c) => c.title.toLowerCase());
assert(mktTitles.some((t) => t.includes('seo') || t.includes('analytics')), 'Marketing includes SEO & Funnel Analytics');
assert(!mktTitles.some((t) => t.includes('backend api engineering')), 'Marketing does NOT include Backend API engineering');

// Talent Acquisition Partner
const taBp = getRolePracticeBlueprint('talent-acquisition-partner');
const taTitles = taBp.categories.map((c) => c.title.toLowerCase());
assert(taTitles.some((t) => t.includes('boolean search') || t.includes('sourcing')), 'Talent Acquisition includes Boolean Search & Sourcing');
assert(!taTitles.some((t) => t.includes('react engineering')), 'Talent Acquisition does NOT include React Engineering');

// ----------------------------------------------------------------------------
// TEST 3: MACHINE LEARNING VS FRONTEND CROSS-ROLE CONTAMINATION (Step 55)
// ----------------------------------------------------------------------------
console.log('\n3. Verifying Cross-Role Isolation & Zero Contamination (Step 55):');

const mlBp = getRolePracticeBlueprint('machine-learning-engineer');
const mlTitles = mlBp.categories.map((c) => c.title);
const feBp = getRolePracticeBlueprint('frontend-developer');
const feTitles = feBp.categories.map((c) => c.title);

assert(mlTitles.includes('Model Evaluation'), 'ML Engineer blueprint contains Model Evaluation');
assert(mlTitles.includes('Data Preprocessing'), 'ML Engineer blueprint contains Data Preprocessing');
assert(!feTitles.includes('Model Evaluation'), 'Frontend Developer blueprint does NOT contain Model Evaluation');
assert(!feTitles.includes('Hyperparameter Tuning'), 'Frontend Developer blueprint does NOT contain Hyperparameter Tuning');

assert(feTitles.includes('React Engineering'), 'Frontend Developer blueprint contains React Engineering');
assert(feTitles.includes('CSS & Responsive Design'), 'Frontend Developer blueprint contains CSS & Responsive Design');
assert(!mlTitles.includes('CSS & Responsive Design'), 'ML Engineer blueprint does NOT contain CSS & Responsive Design');

// ----------------------------------------------------------------------------
// TEST 4: INVENTORY INTEGRITY & REAL DATABASE COUNTS (Step 17 & 61)
// ----------------------------------------------------------------------------
console.log('\n4. Verifying Zero-Fabricated Inventory & Real Catalog Counts (Step 17 & 61):');

const hydratedMl = getHydratedRolePracticeBlueprint('machine-learning-engineer');
for (const cat of hydratedMl.categories) {
  const actualInCatalog = PRACTICE_CHALLENGES_CATALOG.filter(
    (ch) => ch.careerRoleSlug === 'machine-learning-engineer' && ch.categoryId === cat.id
  ).length;

  assert(
    cat.challengeCount === actualInCatalog,
    `Category "${cat.title}" displays exact count ${cat.challengeCount} matching catalog (${actualInCatalog})`
  );
}

// ----------------------------------------------------------------------------
// TEST 5: DIFFICULTY LEVEL MAPPING & ADAPTIVE CALIBRATION (Step 25 & 58)
// ----------------------------------------------------------------------------
console.log('\n5. Verifying Adaptive Difficulty Mapping (Step 25 & 58):');

// Candidate A (Novice L0/L1) vs Candidate B (Professional L4)
const skillsUserA: UserSkillItem[] = [
  { name: 'Python', currentLevel: 'L0', requiredLevel: 'L4', gap: 4, confidence: 0, evidenceCount: 0, priority: 'CRITICAL' }
];

const skillsUserB: UserSkillItem[] = [
  { name: 'Python', currentLevel: 'L4', requiredLevel: 'L4', gap: 0, confidence: 0.9, evidenceCount: 5, priority: 'SATISFIED' },
  { name: 'Scikit-Learn & PyTorch', currentLevel: 'L3', requiredLevel: 'L4', gap: 1, confidence: 0.7, evidenceCount: 3, priority: 'HIGH' }
];

const recA = getRecommendedNextChallenge('machine-learning-engineer', skillsUserA);
assert(Boolean(recA), 'Recommended next challenge generated for Candidate A');
assert(
  recA?.difficulty === 'BEGINNER' || recA?.difficulty === 'EASY',
  `Candidate A with L0 skill receives beginner challenge: ${recA?.title} (${recA?.difficulty})`
);

const recB = getRecommendedNextChallenge('machine-learning-engineer', skillsUserB);
assert(Boolean(recB), 'Recommended next challenge generated for Candidate B');
assert(
  recB?.difficulty === 'MEDIUM' || recB?.difficulty === 'HARD',
  `Candidate B with L3-L4 skill receives medium/hard challenge: ${recB?.title} (${recB?.difficulty})`
);

// ----------------------------------------------------------------------------
// TEST 6: ANTI-REPETITION FIREWALL (Step 34 & 57)
// ----------------------------------------------------------------------------
console.log('\n6. Verifying Anti-Repetition Firewall (Step 34 & 57):');

const firstRec = getRecommendedNextChallenge('machine-learning-engineer', skillsUserA);
assert(Boolean(firstRec), 'Initial challenge selected');

// Pass seenChallengeIds containing first challenge
const seenIds = [firstRec!.id];
const secondRec = getRecommendedNextChallenge('machine-learning-engineer', skillsUserA, seenIds);

assert(secondRec?.id !== firstRec?.id, `Subsequent challenge recommendation (${secondRec?.id}) avoids previously seen (${firstRec?.id})`);

// ----------------------------------------------------------------------------
// TEST 7: SCENARIO / RUBRIC EVALUATION FOR NON-CODING ROLES (Step 31)
// ----------------------------------------------------------------------------
console.log('\n7. Verifying Non-Coding Scenario Evaluator (Step 31):');

const pmChallenge = PRACTICE_CHALLENGES_CATALOG.find((ch) => ch.careerRoleSlug === 'technical-product-manager');
assert(Boolean(pmChallenge), 'Found Technical Product Manager challenge');

// Evaluate optimal selection
const evalPass = evaluatePracticeSubmission(pmChallenge!, {
  selectedOptionId: pmChallenge!.scenarioOptions![0].id
});
assert(evalPass.passed === true, 'Optimal product decision achieves PASSED verdict');
assert(evalPass.score === 100, 'Optimal product decision achieves 100% score');
assert(Boolean(evalPass.skillEvidence), 'Evaluator yields structured skill evidence');
assert(evalPass.skillEvidence.skill === pmChallenge!.skillName, `Skill evidence mapped to ${pmChallenge!.skillName}`);

// Evaluate suboptimal selection
const evalSuboptimal = evaluatePracticeSubmission(pmChallenge!, {
  selectedOptionId: pmChallenge!.scenarioOptions![1].id
});
assert(evalSuboptimal.passed === false, 'Suboptimal product decision fails passing gate');
assert(evalSuboptimal.score < 100, `Suboptimal score calibrated to ${evalSuboptimal.score}%`);

// ----------------------------------------------------------------------------
// TEST 8: FREE LEARNING RESOURCE INTEGRATION (Step 64)
// ----------------------------------------------------------------------------
console.log('\n8. Verifying Free Learning Resources Integration (Step 64):');

for (const slug of expectedRoles) {
  const bp = getRolePracticeBlueprint(slug);
  const sampleCat = bp.categories[0];
  assert(Boolean(sampleCat.freeLearningUrl), `Role "${slug}" category "${sampleCat.title}" contains free learning URL: ${sampleCat.freeLearningUrl}`);
  assert(Boolean(sampleCat.freeLearningProvider), `Role "${slug}" specifies provider: ${sampleCat.freeLearningProvider}`);
}

console.log('\n============================================================');
console.log(`RESULTS: ${passedAssertions} / ${totalAssertions} ASSERTIONS PASSED (100% SUCCESS)`);
console.log('CAREER-AWARE PRACTICE ARENA FULLY VALIDATED FOR TRL 4 AUDIT!');
console.log('============================================================\n');
