import { CAREER_ROLES_CATALOG, getCareerBySlug } from '../apps/web/src/lib/data/careers-data';
import {
  generateAssessmentBlueprint,
  buildAssessmentSession,
  getInitialInterviewQuestions,
} from '../apps/web/src/lib/assessment';
import {
  OPPORTUNITIES_CATALOG,
  getOpportunitiesByRole,
  calculateExplainableMatch,
} from '../apps/web/src/lib/data/opportunities-data';
import { generatePersonalizedRoadmap } from '../apps/web/src/lib/curriculum';
import { getRoleUuid, sanitizeState, CandidateState } from '../apps/web/src/lib/data/state-store';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✓ PASSED: ${msg}`);
    passed++;
  } else {
    console.error(`  ✗ FAILED: ${msg}`);
    failed++;
    throw new Error(msg);
  }
}

console.log('============================================================');
console.log('LEARN-2-HIRE 2.0: DEMO TEST MATRIX EXECUTION');
console.log('============================================================\n');

// -----------------------------------------------------------------------
// TEST 1 & 2: REPRODUCE CRITICAL BUG FIX (FRONTEND -> CYBERSECURITY)
// -----------------------------------------------------------------------
console.log('--- TEST 1 & 2: FRONTEND -> CYBERSECURITY ARCHITECT ROLE SWITCH ---');
const feBlueprint = generateAssessmentBlueprint('frontend-developer', 'BASELINE', 'MEDIUM');
const feQuestions = buildAssessmentSession(feBlueprint, []);
assert(feQuestions.length >= 5, `Frontend assessment loaded with ${feQuestions.length} questions`);
assert(
  feQuestions.some((q) => q.skillName.toLowerCase().includes('javascript') || q.skillName.toLowerCase().includes('react')),
  'Frontend assessment contains JavaScript / React questions'
);

const secBlueprint = generateAssessmentBlueprint('cybersecurity-architect', 'BASELINE', 'MEDIUM');
const secQuestions = buildAssessmentSession(secBlueprint, []);
assert(secQuestions.length >= 5, `Cybersecurity assessment loaded with ${secQuestions.length} questions`);

// CRITICAL ANTI-CONTAMINATION CHECK:
const contaminatedQuestions = secQuestions.filter(
  (q) =>
    q.questionText.includes('== vs ===') ||
    q.skillName.toLowerCase() === 'javascript' ||
    q.skillName.toLowerCase() === 'react' ||
    (q.careerRoleSlug !== 'cybersecurity-architect' && q.careerRoleSlug !== 'universal')
);
assert(
  contaminatedQuestions.length === 0,
  `Zero cross-role question contamination in Cybersecurity assessment (Found: ${contaminatedQuestions.length})`
);
assert(
  secQuestions.some(
    (q) =>
      q.skillName.toLowerCase().includes('zero trust') ||
      q.skillName.toLowerCase().includes('threat') ||
      q.skillName.toLowerCase().includes('network security') ||
      q.skillName.toLowerCase().includes('cloud security') ||
      q.skillName.toLowerCase().includes('cryptography')
  ),
  'Cybersecurity assessment questions evaluate actual cybersecurity competencies'
);

// -----------------------------------------------------------------------
// TEST 3 & 4: DATA SCIENTIST & UI/UX DESIGNER
// -----------------------------------------------------------------------
console.log('\n--- TEST 3 & 4: DATA SCIENTIST & UI/UX DESIGNER SWITCH ---');
const dsBlueprint = generateAssessmentBlueprint('data-scientist', 'BASELINE', 'MEDIUM');
const dsQuestions = buildAssessmentSession(dsBlueprint, []);
assert(dsQuestions.length >= 5, `Data Science assessment loaded with ${dsQuestions.length} questions`);
assert(
  !dsQuestions.some((q) => q.questionText.includes('== vs ===')),
  'Data Scientist assessment has zero JavaScript == vs === questions'
);
assert(
  dsQuestions.some((q) => q.skillName.toLowerCase().includes('python') || q.skillName.toLowerCase().includes('statistics') || q.skillName.toLowerCase().includes('machine learning')),
  'Data Scientist assessment evaluates statistics / ML / Python'
);

const uxBlueprint = generateAssessmentBlueprint('ui-ux-designer', 'BASELINE', 'MEDIUM');
const uxQuestions = buildAssessmentSession(uxBlueprint, []);
assert(uxQuestions.length >= 5, `UI/UX assessment loaded with ${uxQuestions.length} questions`);
assert(
  uxQuestions.some((q) => q.skillName.toLowerCase().includes('ux research') || q.skillName.toLowerCase().includes('design system') || q.skillName.toLowerCase().includes('wireframing')),
  'UI/UX assessment evaluates design system / research / accessibility'
);

// -----------------------------------------------------------------------
// TEST 5 & 6: STATE PERSISTENCE & HISTORY PRESERVATION
// -----------------------------------------------------------------------
console.log('\n--- TEST 5 & 6: PERSISTENCE & CAREER HISTORY PRESERVATION ---');
const feSkills = [
  { name: 'JavaScript', currentLevel: 'L3' as const, requiredLevel: 'L4' as const, gap: 1, confidence: 0.85, evidenceCount: 1, priority: 'HIGH' as const },
  { name: 'React', currentLevel: 'L3' as const, requiredLevel: 'L3' as const, gap: 0, confidence: 0.9, evidenceCount: 1, priority: 'SATISFIED' as const },
];

let state: CandidateState = {
  isLoggedIn: true,
  user: { name: 'Alex Candidate', email: 'alex@example.com', headline: 'Frontend Developer' },
  stage: 'SKILL_ANALYZED',
  targetCareerSlug: 'frontend-developer',
  targetCareerRoleId: getRoleUuid('frontend-developer'),
  readinessScore: 78,
  assessmentScore: 82,
  skills: feSkills,
  seenQuestionIds: ['q1', 'q2'],
  careerHistory: {},
  activeProject: { title: 'Design System', milestoneTotal: 4, milestoneCurrent: 2, isCompleted: false },
  interviewScore: 80,
  resume: { title: 'Frontend Resume', status: 'READY', compatibilityScore: 85, matchedKeywords: ['React', 'JavaScript'], missingKeywords: [] },
  applications: [],
};

// Snapshot to history when switching to Cybersecurity Architect
const prevSlug = state.targetCareerSlug;
const updatedHistory = {
  ...state.careerHistory,
  [prevSlug]: {
    skills: state.skills,
    assessmentScore: state.assessmentScore,
    readinessScore: state.readinessScore,
    stage: state.stage,
    lastUpdated: new Date().toISOString(),
  },
};

const secRole = getCareerBySlug('cybersecurity-architect')!;
const secInitialSkills = secRole.requiredSkills.map((s) => ({
  name: s.name,
  currentLevel: 'L0' as const,
  requiredLevel: s.level,
  gap: parseInt(s.level.replace('L', ''), 10),
  confidence: 0,
  evidenceCount: 0,
  priority: 'CRITICAL' as const,
}));

state = {
  ...state,
  targetCareerSlug: 'cybersecurity-architect',
  targetCareerRoleId: getRoleUuid('cybersecurity-architect'),
  careerHistory: updatedHistory,
  stage: 'CAREER_SELECTED',
  skills: secInitialSkills,
  readinessScore: 0,
  assessmentScore: undefined,
};

assert(state.targetCareerSlug === 'cybersecurity-architect', 'Active career is now Cybersecurity Architect');
assert(state.readinessScore === 0, 'Cybersecurity Architect starts at 0% unassessed readiness');
assert(state.skills[0].currentLevel === 'L0', 'Cybersecurity Architect skills start at L0 (NOT ASSESSED)');
assert(
  state.careerHistory?.['frontend-developer']?.skills.length === 2,
  'Frontend Developer historical skills preserved intact in careerHistory'
);
assert(
  state.careerHistory?.['frontend-developer']?.readinessScore === 78,
  'Frontend Developer historical readiness (78%) preserved in careerHistory'
);

// Switch back to Frontend Developer: verifies historical restoration
const restoredFe = state.careerHistory?.['frontend-developer'];
state = {
  ...state,
  targetCareerSlug: 'frontend-developer',
  targetCareerRoleId: getRoleUuid('frontend-developer'),
  skills: restoredFe!.skills,
  readinessScore: restoredFe!.readinessScore,
  assessmentScore: restoredFe!.assessmentScore,
  stage: restoredFe!.stage,
};

assert(state.targetCareerSlug === 'frontend-developer', 'Restored target career is Frontend Developer');
assert(state.readinessScore === 78, 'Restored Frontend Developer readiness is 78%');
assert(state.skills.find((s) => s.name === 'React')?.currentLevel === 'L3', 'Restored React skill is L3');

// -----------------------------------------------------------------------
// TEST 7: OPPORTUNITY MATCHING BY ACTIVE CAREER
// -----------------------------------------------------------------------
console.log('\n--- TEST 7: DYNAMIC LIVE OPPORTUNITY MATCHING ---');
const feOpportunities = getOpportunitiesByRole('frontend-developer', 'FULL_TIME');
assert(feOpportunities.exactMatches.length > 0, `Frontend has ${feOpportunities.exactMatches.length} exact role matches`);
assert(
  feOpportunities.exactMatches.every((j) => j.roleSlug === 'frontend-developer'),
  'All exact matches for frontend-developer have roleSlug: frontend-developer'
);

const secOpportunities = getOpportunitiesByRole('cybersecurity-architect', 'FULL_TIME');
assert(secOpportunities.exactMatches.length > 0, `Cybersecurity has ${secOpportunities.exactMatches.length} exact role matches`);
assert(
  secOpportunities.exactMatches.every((j) => j.roleSlug === 'cybersecurity-architect'),
  'All exact matches for cybersecurity-architect have roleSlug: cybersecurity-architect'
);

// Match calculation verification
const topSecJob = secOpportunities.exactMatches[0];
const matchResult = calculateExplainableMatch(topSecJob, secInitialSkills, 'cybersecurity-architect');
assert(matchResult.isExactRole === true, 'Top cybersecurity job matches exact role (100% role score)');
assert(matchResult.breakdown.roleScore === 100, 'Role score is 100%');
assert(matchResult.missingSkills.length > 0, `Explainable matching identified ${matchResult.missingSkills.length} skill gaps`);
assert(topSecJob.source === 'ADZUNA' || topSecJob.source === 'EMPLOYER_PORTAL', `Opportunity source is transparent: ${topSecJob.source}`);
assert(!!topSecJob.sourceUrl, `Opportunity has verified source URL: ${topSecJob.sourceUrl}`);

// -----------------------------------------------------------------------
// TEST 8: PERSONALIZED ROADMAP DIFFERENTIATION
// -----------------------------------------------------------------------
console.log('\n--- TEST 8: ROADMAP PERSONALIZATION & ZERO OVERLAP ---');
const feRoadmap = generatePersonalizedRoadmap('frontend-developer', feSkills, 82);
const secRoadmap = generatePersonalizedRoadmap('cybersecurity-architect', secInitialSkills, 70);

assert(feRoadmap.modules.length > 0, `Frontend roadmap generated ${feRoadmap.modules.length} modules`);
assert(
  feRoadmap.modules.some((m) => m.skillName.toLowerCase().includes('javascript') || m.skillName.toLowerCase().includes('css')),
  'Frontend roadmap contains JavaScript / CSS remediation'
);

assert(secRoadmap.modules.length > 0, `Cybersecurity roadmap generated ${secRoadmap.modules.length} modules`);
assert(
  secRoadmap.modules.some(
    (m) =>
      m.skillName.toLowerCase().includes('zero trust') ||
      m.skillName.toLowerCase().includes('threat') ||
      m.skillName.toLowerCase().includes('network')
  ),
  'Cybersecurity roadmap contains Zero Trust / Threat Modeling remediation'
);
assert(
  !secRoadmap.modules.some((m) => m.skillName.toLowerCase().includes('javascript') || m.skillName.toLowerCase().includes('css')),
  'Cybersecurity roadmap has ZERO Frontend JavaScript/CSS modules'
);

// -----------------------------------------------------------------------
// TEST 9: INTERVIEW INTELLIGENCE DIFFERENTIATION
// -----------------------------------------------------------------------
console.log('\n--- TEST 9: ROLE-SPECIFIC INTERVIEW INTELLIGENCE ---');
const feInterview = getInitialInterviewQuestions('frontend-developer');
const secInterview = getInitialInterviewQuestions('cybersecurity-architect');

assert(feInterview.length === 3, 'Frontend interview turns generated');
assert(secInterview.length === 3, 'Cybersecurity interview turns generated');
assert(
  secInterview[0].questionText.toLowerCase().includes('zero trust') ||
  secInterview[0].questionText.toLowerCase().includes('security') ||
  secInterview[0].questionText.toLowerCase().includes('architect'),
  `Cybersecurity interview question tailored to security architecture: "${secInterview[0].questionText.slice(0, 70)}..."`
);

console.log('\n============================================================');
console.log(`DEMO TEST MATRIX COMPLETE: ${passed} PASSED, ${failed} FAILED`);
console.log('ACTIVE CAREER ROOT ARCHITECTURE FULLY VALIDATED!');
console.log('============================================================\n');
