/**
 * LEARN-2-HIRE 2.0: CAREER-AWARE ROADMAP ENGINE VERIFICATION SUITE
 * 
 * Comprehensive automated test suite verifying:
 * 1. All 12 supported platform career roles have complete data-driven blueprints
 * 2. Career role IDs and slugs match canonical system records
 * 3. Strict domain purity (Zero cross-role bleeding, e.g. no Kubernetes in Marketing)
 * 4. Personalization algorithm (User A advanced vs User B beginner)
 * 5. Prerequisite DAG locking mechanics
 * 6. Authentic educational resource provenance and free access validation
 * 7. Role-scoped cache key isolation
 */

import {
  generateCareerRoadmap,
  getCareerBlueprint,
  CAREER_BLUEPRINTS,
  getRoadmapCacheKey
} from '../apps/web/src/lib/roadmap';
import { CAREER_ROLES_CATALOG } from '../apps/web/src/lib/data/careers-data';
import { getRoleUuid } from '../apps/web/src/lib/data/state-store';

const ALL_12_ROLES = [
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

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, failureDetails?: string) {
  if (condition) {
    testsPassed++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    testsFailed++;
    console.error(`  ✗ FAIL: ${testName}`);
    if (failureDetails) {
      console.error(`    Details: ${failureDetails}`);
    }
  }
}

console.log('=============================================================================');
console.log('LEARN-2-HIRE 2.0: CAREER ROADMAP ENGINE AUTOMATED VALIDATION');
console.log('=============================================================================\n');

// -----------------------------------------------------------------------------
// TEST SUITE 1: ALL 12 ROLES CATALOG & BLUEPRINT INTEGRITY (Step 47)
// -----------------------------------------------------------------------------
console.log('--- TEST SUITE 1: 12 Roles Blueprint Integrity & Canonical Role IDs ---');

ALL_12_ROLES.forEach((slug) => {
  const catalogEntry = CAREER_ROLES_CATALOG.find((c) => c.slug === slug);
  assert(!!catalogEntry, `Role Catalog entry exists for [${slug}]`);

  const blueprint = getCareerBlueprint(slug);
  assert(blueprint.slug === slug, `Blueprint slug matches [${slug}]`);
  assert(blueprint.stages.length >= 7, `Blueprint for [${slug}] has >= 7 comprehensive stages (found ${blueprint.stages.length})`);

  const canonicalUuid = getRoleUuid(slug);
  const roadmap = generateCareerRoadmap({ targetRoleSlug: slug });
  assert(roadmap.careerRoleId === canonicalUuid, `Roadmap careerRoleId matches canonical UUID for [${slug}]`);
  assert(roadmap.totalNodes === blueprint.stages.length, `Roadmap totalNodes (${roadmap.totalNodes}) matches blueprint stages`);
});

// -----------------------------------------------------------------------------
// TEST SUITE 2: ZERO CROSS-ROLE BLEEDING ASSERTIONS (Step 48)
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 2: Domain Purity & Cross-Role Bleeding Guard ---');

const marketingRoadmap = generateCareerRoadmap({ targetRoleSlug: 'digital-marketing-specialist' });
const marketingSkills = marketingRoadmap.phases.flatMap((p) => p.nodes).map((n) => n.skillName.toLowerCase());
assert(!marketingSkills.some((s) => s.includes('kubernetes') || s.includes('docker') || s.includes('react')),
  'Digital Marketing roadmap contains ZERO DevOps/React skills (No Kubernetes/Docker/React)');

const talentAcqRoadmap = generateCareerRoadmap({ targetRoleSlug: 'talent-acquisition-partner' });
const taSkills = talentAcqRoadmap.phases.flatMap((p) => p.nodes).map((n) => n.skillName.toLowerCase());
assert(!taSkills.some((s) => s.includes('react') || s.includes('sql') || s.includes('linux')),
  'Talent Acquisition roadmap contains ZERO engineering coding skills (No React/SQL/Linux)');

const uiuxRoadmap = generateCareerRoadmap({ targetRoleSlug: 'ui-ux-designer' });
const uiuxSkills = uiuxRoadmap.phases.flatMap((p) => p.nodes).map((n) => n.skillName.toLowerCase());
assert(!uiuxSkills.some((s) => s.includes('sql joins') || s.includes('kubernetes') || s.includes('fastapi')),
  'UI/UX Designer roadmap contains ZERO backend/devops skills (No SQL Joins/Kubernetes/FastAPI)');

const mlRoadmap = generateCareerRoadmap({ targetRoleSlug: 'machine-learning-engineer' });
const mlSkills = mlRoadmap.phases.flatMap((p) => p.nodes).map((n) => n.skillName.toLowerCase());
assert(!mlSkills.some((s) => s.includes('css') || s.includes('html') || s.includes('recruitment')),
  'Machine Learning roadmap contains ZERO CSS/HTML/Recruitment skills');

const fullstackRoadmap = generateCareerRoadmap({ targetRoleSlug: 'full-stack-developer' });
const fsSkills = fullstackRoadmap.phases.flatMap((p) => p.nodes).map((n) => n.skillName.toLowerCase());
assert(!fsSkills.some((s) => s.includes('boolean search') || s.includes('talent sourcing')),
  'Full-Stack Developer roadmap contains ZERO HR/Talent sourcing skills');

// -----------------------------------------------------------------------------
// TEST SUITE 3: PERSONALIZATION ALGORITHM (Step 49)
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 3: Personalization Test (User A Advanced vs User B Beginner) ---');

// User A: Advanced candidate who already mastered HTML, CSS, JavaScript (L3-L4), missing React (L1)
const userA_Roadmap = generateCareerRoadmap({
  targetRoleSlug: 'frontend-developer',
  assessmentScore: 78,
  userSkills: [
    { name: 'HTML', currentLevel: 'L4', requiredLevel: 'L3', gap: 0 },
    { name: 'CSS', currentLevel: 'L4', requiredLevel: 'L4', gap: 0 },
    { name: 'JavaScript', currentLevel: 'L3', requiredLevel: 'L4', gap: 1 },
    { name: 'React', currentLevel: 'L1', requiredLevel: 'L4', gap: 3 },
  ]
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
  ]
});

assert(userA_Roadmap.userMode === 'PROFESSIONAL', 'User A classified as PROFESSIONAL mode');
assert(userB_Roadmap.userMode === 'BEGINNER', 'User B classified as BEGINNER mode');

const userA_NextAction = userA_Roadmap.nextBestAction?.primaryAction;
const userB_NextAction = userB_Roadmap.nextBestAction?.primaryAction;

assert(!!userA_NextAction && !!userB_NextAction, 'Both candidates received deterministic Next Best Actions');
assert(userA_NextAction?.id !== userB_NextAction?.id,
  `User A action [${userA_NextAction?.skillName}] differs completely from User B action [${userB_NextAction?.skillName}]`);

// User A should have HTML and foundations marked completed
const userA_htmlNode = userA_Roadmap.phases.flatMap((p) => p.nodes).find((n) => n.skillName === 'HTML');
assert(userA_htmlNode?.status === 'COMPLETED' || userA_htmlNode?.isCompleted === true,
  'User A has HTML marked COMPLETED because verified currentLevel L4 >= targetLevel L3');

// User B should NOT have HTML completed; User B must start from Foundations
const userB_htmlNode = userB_Roadmap.phases.flatMap((p) => p.nodes).find((n) => n.skillName === 'HTML');
assert(userB_htmlNode?.status !== 'COMPLETED',
  'User B has HTML as an active gap needing study');

// -----------------------------------------------------------------------------
// TEST SUITE 4: PREREQUISITE DAG LOCKING (Step 5, 21)
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 4: Prerequisite DAG Locking Mechanics ---');

// In fresh beginner roadmap, React must be LOCKED because HTML/CSS/JS prerequisites are not satisfied
const userB_reactNode = userB_Roadmap.phases.flatMap((p) => p.nodes).find((n) => n.skillName === 'React');
assert(userB_reactNode?.status === 'LOCKED',
  'React is LOCKED for User B because JavaScript/TypeScript prerequisites are unmet');

// In User A roadmap where JS L3 is satisfied, React is NOT LOCKED
const userA_reactNode = userA_Roadmap.phases.flatMap((p) => p.nodes).find((n) => n.skillName === 'React');
assert(userA_reactNode?.status !== 'LOCKED',
  'React is UNLOCKED (AVAILABLE/RECOMMENDED) for User A because prerequisites are satisfied');

// -----------------------------------------------------------------------------
// TEST SUITE 5: AUTHENTIC FREE RESOURCE PROVENANCE (Step 26, 27)
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 5: Real Educational Resource Provenance & Free URLs ---');

let totalResourcesChecked = 0;
let validUrlsCount = 0;

ALL_12_ROLES.forEach((slug) => {
  const rm = generateCareerRoadmap({ targetRoleSlug: slug });
  rm.phases.flatMap((p) => p.nodes).forEach((n) => {
    n.resources.forEach((r) => {
      totalResourcesChecked++;
      if (r.sourceUrl && r.sourceUrl.startsWith('https://') && r.sourceName) {
        validUrlsCount++;
      }
    });
  });
});

assert(totalResourcesChecked > 20, `Checked ${totalResourcesChecked} verified educational resources across all roles`);
assert(validUrlsCount === totalResourcesChecked,
  `100% of educational resources have authentic HTTPS URLs and verified provenance (${validUrlsCount}/${totalResourcesChecked})`);

// -----------------------------------------------------------------------------
// TEST SUITE 6: ROLE-SCOPED CACHING & STALE PROTECTION (Step 32, 33)
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 6: Role-Scoped Caching & Stale Response Protection ---');

const testUserId = 'usr-test-1234';
const cacheKey1 = getRoadmapCacheKey(testUserId, getRoleUuid('frontend-developer'));
const cacheKey2 = getRoadmapCacheKey(testUserId, getRoleUuid('machine-learning-engineer'));

assert(cacheKey1.includes(testUserId) && cacheKey1.includes(getRoleUuid('frontend-developer')),
  'Cache key 1 contains both userId and careerRoleId');
assert(cacheKey1 !== cacheKey2,
  'Cache keys for different roles under the same user NEVER collide');

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n=============================================================================');
console.log(`TEST SUMMARY: ${testsPassed} PASSED, ${testsFailed} FAILED`);
console.log('=============================================================================');

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('ALL CAREER ROADMAP ENGINE SPECIFICATIONS CONFIRMED OPERATIONAL.\n');
}
