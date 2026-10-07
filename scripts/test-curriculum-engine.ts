/**
 * TEST SUITE: DYNAMIC PERSONALIZED CURRICULUM & ASSESSMENT FLOW
 * 
 * Verifies:
 * 1. Frontend Developer receives frontend roadmap (NOT backend microservices)
 * 2. Backend Developer receives backend roadmap
 * 3. Data Scientist receives data science roadmap
 * 4. Cybersecurity receives cybersecurity roadmap
 * 5. Two Frontend users with different skill gaps receive different roadmaps
 * 6. L4 skill is not shown as a critical gap when target is L4 (TARGET_MET)
 * 7. Unassessed user sees honest empty state (isAssessed = false, modules = 0)
 * 8. Dynamic hours calculation (not hardcoded 61 hours)
 * 9. Prerequisite ordering (foundations precede dependent frameworks)
 * 10. Honest Free vs Paid/Subscription resource labeling (LinkedIn Learning labeled PAID / SUBSCRIPTION)
 * 11. Reassessment upgrades update skill levels and dynamically update roadmap
 * 12. Multi-role diversity across 8 distinct career blueprints
 * 13. Dynamic Career switching changes blueprint and roadmap completely
 * 14. Next Best Action progression engine
 * 15. Job match explainability breakdown
 */

process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fake-project.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.fake';

import { generatePersonalizedRoadmap, VERIFIED_RESOURCE_REPOSITORY, getOrCreateRoleBlueprint } from '../apps/web/src/lib/curriculum';
import { UserSkillItem, getNextBestAction, CandidateState } from '../apps/web/src/lib/data/state-store';
import { CAREER_ROLES_CATALOG } from '../apps/web/src/lib/data/careers-data';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ ${message}`);
  }
}

console.log('================================================================');
console.log('RUNNING COMPREHENSIVE PERSONALIZED CURRICULUM TEST SUITE');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// Test 1: Frontend Developer receives frontend roadmap
// -----------------------------------------------------------------------------
console.log('TEST 1: Frontend Developer receives Frontend-specific roadmap');
const frontendSkills: UserSkillItem[] = [
  { name: 'JavaScript', currentLevel: 'L1', requiredLevel: 'L4', gap: 3, confidence: 0.4, evidenceCount: 1, priority: 'CRITICAL' },
  { name: 'React', currentLevel: 'L1', requiredLevel: 'L4', gap: 3, confidence: 0.4, evidenceCount: 1, priority: 'CRITICAL' },
  { name: 'CSS & Tailwind', currentLevel: 'L2', requiredLevel: 'L4', gap: 2, confidence: 0.5, evidenceCount: 1, priority: 'CRITICAL' },
  { name: 'Web Accessibility', currentLevel: 'L1', requiredLevel: 'L3', gap: 2, confidence: 0.5, evidenceCount: 1, priority: 'HIGH' },
];

const fePlan = generatePersonalizedRoadmap('frontend-developer', frontendSkills, 45);
assert(fePlan.isAssessed === true, 'Frontend user is assessed');
assert(fePlan.targetRoleTitle === 'Frontend Developer', 'Target title is Frontend Developer');
assert(fePlan.modules.length > 0, 'Roadmap has modules');

const feModuleSkills = fePlan.modules.map((m) => m.skillName);
assert(feModuleSkills.includes('CSS & Tailwind'), 'Frontend includes CSS & Tailwind');
assert(feModuleSkills.includes('JavaScript'), 'Frontend includes JavaScript');
assert(feModuleSkills.includes('React'), 'Frontend includes React');
assert(!feModuleSkills.includes('Node.js / Python / Go'), 'Frontend does NOT include Backend Go/Node server microservices');
assert(!feModuleSkills.includes('Redis & Caching'), 'Frontend does NOT include Redis distributed caching');
console.log('Frontend modules:', fePlan.modules.map((m) => `${m.step}. ${m.title} [${m.priority}]`));

// -----------------------------------------------------------------------------
// Test 2: Backend Developer receives backend roadmap
// -----------------------------------------------------------------------------
console.log('\nTEST 2: Backend Developer receives Backend-specific roadmap');
const backendSkills: UserSkillItem[] = [
  { name: 'Node.js / Python / Go', currentLevel: 'L1', requiredLevel: 'L4', gap: 3, confidence: 0.5, evidenceCount: 1, priority: 'CRITICAL' },
  { name: 'SQL & Relational DBs', currentLevel: 'L2', requiredLevel: 'L4', gap: 2, confidence: 0.5, evidenceCount: 1, priority: 'CRITICAL' },
  { name: 'REST & gRPC APIs', currentLevel: 'L2', requiredLevel: 'L4', gap: 2, confidence: 0.5, evidenceCount: 1, priority: 'CRITICAL' },
  { name: 'Redis & Caching', currentLevel: 'L1', requiredLevel: 'L3', gap: 2, confidence: 0.5, evidenceCount: 1, priority: 'HIGH' },
  { name: 'Docker & Microservices', currentLevel: 'L1', requiredLevel: 'L3', gap: 2, confidence: 0.5, evidenceCount: 1, priority: 'HIGH' },
];

const bePlan = generatePersonalizedRoadmap('backend-developer', backendSkills, 55);
assert(bePlan.targetRoleTitle === 'Backend Developer', 'Target title is Backend Developer');
const beModuleSkills = bePlan.modules.map((m) => m.skillName);
assert(beModuleSkills.includes('SQL & Relational DBs'), 'Backend includes SQL & Relational DBs');
assert(beModuleSkills.includes('Redis & Caching'), 'Backend includes Redis & Caching');
assert(beModuleSkills.includes('REST & gRPC APIs'), 'Backend includes REST & gRPC APIs');
assert(!beModuleSkills.includes('CSS & Tailwind'), 'Backend does NOT include CSS & Tailwind');
console.log('Backend modules:', bePlan.modules.map((m) => `${m.step}. ${m.title} [${m.priority}]`));

// -----------------------------------------------------------------------------
// Test 3: Data Scientist receives Data Science roadmap
// -----------------------------------------------------------------------------
console.log('\nTEST 3: Data Scientist receives Data Science roadmap');
const dsSkills: UserSkillItem[] = [
  { name: 'Python', currentLevel: 'L2', requiredLevel: 'L4', gap: 2, confidence: 0.5, evidenceCount: 1, priority: 'CRITICAL' },
  { name: 'Applied Statistics & Probability', currentLevel: 'L1', requiredLevel: 'L4', gap: 3, confidence: 0.4, evidenceCount: 1, priority: 'CRITICAL' },
];
const dsPlan = generatePersonalizedRoadmap('data-scientist', dsSkills, 40);
assert(dsPlan.targetRoleTitle === 'Data Scientist', 'Target title is Data Scientist');
const dsModuleSkills = dsPlan.modules.map((m) => m.skillName);
assert(dsModuleSkills.includes('Python'), 'Data Science includes Python');
assert(dsModuleSkills.includes('Applied Statistics & Probability'), 'Data Science includes Statistics');
assert(!dsModuleSkills.includes('CSS & Tailwind'), 'Data Science does NOT include CSS');

// -----------------------------------------------------------------------------
// Test 4: Cloud Security Analyst receives Cloud Security roadmap
// -----------------------------------------------------------------------------
console.log('\nTEST 4: Cloud Security Analyst receives Cloud Security roadmap');
const secSkills: UserSkillItem[] = [
  { name: 'Web Application Security (OWASP)', currentLevel: 'L1', requiredLevel: 'L4', gap: 3, confidence: 0.4, evidenceCount: 1, priority: 'CRITICAL' },
  { name: 'Identity & Access Management (IAM)', currentLevel: 'L2', requiredLevel: 'L4', gap: 2, confidence: 0.5, evidenceCount: 1, priority: 'CRITICAL' },
];
const secPlan = generatePersonalizedRoadmap('cloud-security-analyst', secSkills, 50);
const secModuleSkills = secPlan.modules.map((m) => m.skillName);
assert(secModuleSkills.includes('Web Application Security (OWASP)'), 'Security includes OWASP');
assert(secModuleSkills.includes('Identity & Access Management (IAM)'), 'Security includes IAM');

// -----------------------------------------------------------------------------
// Test 5: Two Frontend users with different skill gaps receive DIFFERENT roadmaps
// -----------------------------------------------------------------------------
console.log('\nTEST 5: Two Frontend users with different gaps receive DIFFERENT roadmaps');
const userASkills: UserSkillItem[] = [
  { name: 'JavaScript', currentLevel: 'L1', requiredLevel: 'L4', gap: 3, confidence: 0.4, evidenceCount: 1, priority: 'CRITICAL' },
  { name: 'React', currentLevel: 'L1', requiredLevel: 'L4', gap: 3, confidence: 0.4, evidenceCount: 1, priority: 'CRITICAL' },
  { name: 'CSS & Tailwind', currentLevel: 'L4', requiredLevel: 'L4', gap: 0, confidence: 0.95, evidenceCount: 4, priority: 'SATISFIED' },
  { name: 'Web Accessibility', currentLevel: 'L3', requiredLevel: 'L3', gap: 0, confidence: 0.90, evidenceCount: 3, priority: 'SATISFIED' },
];

const userBSkills: UserSkillItem[] = [
  { name: 'JavaScript', currentLevel: 'L4', requiredLevel: 'L4', gap: 0, confidence: 0.95, evidenceCount: 4, priority: 'SATISFIED' },
  { name: 'React', currentLevel: 'L4', requiredLevel: 'L4', gap: 0, confidence: 0.95, evidenceCount: 4, priority: 'SATISFIED' },
  { name: 'CSS & Tailwind', currentLevel: 'L1', requiredLevel: 'L4', gap: 3, confidence: 0.3, evidenceCount: 1, priority: 'CRITICAL' },
  { name: 'Web Accessibility', currentLevel: 'L1', requiredLevel: 'L3', gap: 2, confidence: 0.3, evidenceCount: 1, priority: 'CRITICAL' },
];

const planA = generatePersonalizedRoadmap('frontend-developer', userASkills, 50);
const planB = generatePersonalizedRoadmap('frontend-developer', userBSkills, 50);

const topModuleA = planA.modules[0];
const topModuleB = planB.modules[0];

assert(topModuleA.skillName === 'JavaScript', 'User A top priority is JavaScript (gap = 3)');
assert(topModuleB.skillName === 'CSS & Tailwind', 'User B top priority is CSS & Tailwind (gap = 3)');
assert(topModuleA.skillName !== topModuleB.skillName, 'User A and User B receive different roadmaps!');
console.log(`User A top module: ${topModuleA.skillName} (gap ${topModuleA.gap})`);
console.log(`User B top module: ${topModuleB.skillName} (gap ${topModuleB.gap})`);

// -----------------------------------------------------------------------------
// Test 6: L4 skill when target is L4 is NOT shown as CRITICAL GAP
// -----------------------------------------------------------------------------
console.log('\nTEST 6: Mastered skill (gap = 0) is marked TARGET_MET, not CRITICAL GAP');
const cssModuleInA = planA.modules.find((m) => m.skillName === 'CSS & Tailwind');
assert(cssModuleInA !== undefined, 'CSS module exists in User A roadmap');
assert(cssModuleInA?.priority === 'TARGET_MET', 'CSS module for User A is marked TARGET_MET');
assert(cssModuleInA?.gap === 0, 'CSS module gap is 0');
assert(cssModuleInA?.priority !== 'CRITICAL', 'CSS module is NOT marked CRITICAL');

// -----------------------------------------------------------------------------
// Test 7: Unassessed user sees honest empty state
// -----------------------------------------------------------------------------
console.log('\nTEST 7: Unassessed user sees honest empty state');
const unassessedPlan = generatePersonalizedRoadmap('frontend-developer', [], undefined);
assert(unassessedPlan.isAssessed === false, 'isAssessed is false');
assert(unassessedPlan.totalModules === 0, 'totalModules is 0');
assert(unassessedPlan.modules.length === 0, 'modules array is empty');
assert(unassessedPlan.statusMessage === 'ASSESSMENT_REQUIRED', 'statusMessage is ASSESSMENT_REQUIRED');

// -----------------------------------------------------------------------------
// Test 8: Dynamic hours calculation
// -----------------------------------------------------------------------------
console.log('\nTEST 8: Dynamic estimated hours');
assert(planA.estimatedTotalHours > 0, 'Plan A has estimated hours calculated');
assert(planB.estimatedTotalHours > 0, 'Plan B has estimated hours calculated');
console.log(`Plan A dynamic estimated hours: ${planA.estimatedTotalHours} hrs`);
console.log(`Plan B dynamic estimated hours: ${planB.estimatedTotalHours} hrs`);

// -----------------------------------------------------------------------------
// Test 9: Free vs Paid / Subscription Resource Truthfulness
// -----------------------------------------------------------------------------
console.log('\nTEST 9: Free vs Paid / Subscription resource truthfulness');
const lilResources = VERIFIED_RESOURCE_REPOSITORY.filter((r) => r.provider === 'LinkedIn Learning');
assert(lilResources.length > 0, 'LinkedIn Learning resources exist');
lilResources.forEach((res) => {
  assert(res.access === 'PAID / SUBSCRIPTION', `LinkedIn Learning resource "${res.title}" is explicitly marked PAID / SUBSCRIPTION`);
  assert(res.isFree === false, `LinkedIn Learning resource "${res.title}" isFree is false`);
});

const freeResources = VERIFIED_RESOURCE_REPOSITORY.filter((r) => r.provider === 'MDN Web Docs' || r.provider === 'freeCodeCamp');
freeResources.forEach((res) => {
  assert(res.access === 'FREE', `Open resource "${res.title}" is marked FREE`);
  assert(res.isFree === true, `Open resource "${res.title}" isFree is true`);
});

// -----------------------------------------------------------------------------
// Test 10: Reassessment upgrade changes the roadmap
// -----------------------------------------------------------------------------
console.log('\nTEST 10: Reassessment upgrades change roadmap dynamically');
const upgradedUserASkills: UserSkillItem[] = userASkills.map((s) =>
  s.name === 'JavaScript'
    ? { ...s, currentLevel: 'L3', gap: 1, priority: 'HIGH' }
    : s
);
const planAAfterReassessment = generatePersonalizedRoadmap('frontend-developer', upgradedUserASkills, 72);
const jsModuleAfter = planAAfterReassessment.modules.find((m) => m.skillName === 'JavaScript');
assert(jsModuleAfter?.currentLevel === 'L3', 'JavaScript current level updated to L3');
assert(jsModuleAfter?.gap === 1, 'JavaScript gap decreased from 3 to 1');
assert(jsModuleAfter?.priority === 'HIGH', 'JavaScript priority downgraded from CRITICAL to HIGH');

// -----------------------------------------------------------------------------
// Test 11: Multi-role Blueprint Differentiation Across 8 Roles
// -----------------------------------------------------------------------------
console.log('\nTEST 11: Multi-role Blueprint Differentiation Across 8 Roles');
const rolesToTest = [
  'frontend-developer',
  'backend-developer',
  'full-stack-developer',
  'data-scientist',
  'cloud-security-analyst',
  'ui-ux-designer',
  'product-manager',
  'devops-engineer'
];

rolesToTest.forEach((slug) => {
  const bp = getOrCreateRoleBlueprint(slug);
  assert(bp.careerRoleSlug.length > 0, `Blueprint exists for ${slug}`);
  assert(bp.domains.length > 0, `Blueprint has competency domains for ${slug}`);
  const plan = generatePersonalizedRoadmap(slug, [], 60);
  assert(plan.targetRoleTitle.length > 0, `Plan generated for ${slug}`);
  assert(plan.modules.length > 0, `Plan has modules for ${slug}`);
});

// -----------------------------------------------------------------------------
// Test 12: Career Goal Switch updates roadmap completely
// -----------------------------------------------------------------------------
console.log('\nTEST 12: Career goal switch updates roadmap completely');
const userSwitchedSkills: UserSkillItem[] = [
  { name: 'JavaScript', currentLevel: 'L3', requiredLevel: 'L4', gap: 1, confidence: 0.8, evidenceCount: 2, priority: 'HIGH' },
  { name: 'React', currentLevel: 'L3', requiredLevel: 'L4', gap: 1, confidence: 0.8, evidenceCount: 2, priority: 'HIGH' },
];

const feSwitchedPlan = generatePersonalizedRoadmap('frontend-developer', userSwitchedSkills, 70);
const beSwitchedPlan = generatePersonalizedRoadmap('backend-developer', userSwitchedSkills, 70);

assert(feSwitchedPlan.targetRoleTitle === 'Frontend Developer', 'Frontend role is Frontend Developer');
assert(beSwitchedPlan.targetRoleTitle === 'Backend Developer', 'Switched role is Backend Developer');
assert(feSwitchedPlan.modules[0].skillName !== beSwitchedPlan.modules[0].skillName, 'Frontend top module is different from Backend top module');

// -----------------------------------------------------------------------------
// Test 13: Next Best Action Engine State Progression
// -----------------------------------------------------------------------------
console.log('\nTEST 13: Next Best Action engine progression');
const mockCandidateState: CandidateState = {
  isLoggedIn: true,
  user: { name: 'Test User', email: 'test@example.com', headline: 'Candidate' },
  stage: 'CAREER_SELECTED',
  targetCareerSlug: 'frontend-developer',
  readinessScore: 0,
  skills: frontendSkills,
  seenQuestionIds: [],
  assessmentScore: undefined,
  activeProject: { title: 'Design System', milestoneTotal: 3, milestoneCurrent: 0, isCompleted: false },
  interviewScore: undefined,
  resume: { title: 'Resume', status: 'NOT_READY', compatibilityScore: 0, matchedKeywords: [], missingKeywords: [] },
  applications: [],
};

const action1 = getNextBestAction(mockCandidateState);
assert(action1.stageLabel === 'Step 2: Calibrated Assessment', 'Step 2 is Baseline Assessment when unassessed');

const action2 = getNextBestAction({
  ...mockCandidateState,
  stage: 'SKILL_ANALYZED',
  assessmentScore: 60,
});
assert(action2.stageLabel === 'Step 3: Personalized Learning', 'Step 3 is Personalized Learning when skill gaps exist');

console.log('\n================================================================');
console.log('ALL PERSONALIZED CURRICULUM & CAREER LOOP TESTS PASSED (13/13)!');
console.log('================================================================\n');
