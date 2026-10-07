/**
 * LEARN-2-HIRE 2.0: UNIVERSAL ASSESSMENT & INTERVIEW ENGINE AUTOMATED TEST SUITE
 * Tests Sections 51, 52, 53, 54:
 * - Dynamic Career Taxonomy & Blueprints
 * - SHA-256 Hash Normalization & Deterministic Anti-Repetition
 * - Duplicate Injection Tests (different ID, whitespace variations, semantic family)
 * - Adaptive Assessment Evaluation, L0-L5 Progression & Skill Gaps
 * - Free Educational Resources Mapping (GeeksforGeeks, W3Schools, MDN)
 * - Multi-turn Interview Engine with Dynamic Contextual Follow-ups
 */

import {
  computeNormalizedHash,
  cleanNormalizedText,
  UNIVERSAL_QUESTION_BANK,
  filterEligibleQuestions,
  generateAssessmentBlueprint,
  buildAssessmentSession,
  evaluateAssessmentSession,
  getInitialInterviewQuestions,
  evaluateInterviewResponse,
  generateContextualFollowUp,
  AssessmentQuestion,
  UserHistoryRecord,
} from '../apps/web/src/lib/assessment';
import { CAREER_ROLES_CATALOG } from '../apps/web/src/lib/data/careers-data';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ✗ FAILED: ${message}`);
    failedTests++;
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`  ✓ PASSED: ${message}`);
    passedTests++;
  }
}

console.log('============================================================');
console.log('LEARN-2-HIRE 2.0: UNIVERSAL QUESTION ENGINE TEST SUITE');
console.log('============================================================\n');

// TEST 1: Question Bank Integrity & Metadata Quality (Section 4, 5, 6, 25)
console.log('--- TEST 1: Question Bank Integrity & Taxonomy Validation ---');
assert(UNIVERSAL_QUESTION_BANK.length >= 25, `Bank contains ${UNIVERSAL_QUESTION_BANK.length} calibrated questions (expected >= 25)`);

UNIVERSAL_QUESTION_BANK.forEach((q) => {
  assert(!!q.id && q.id.length > 0, `Question ${q.id} has valid ID`);
  assert(!!q.questionText && q.questionText.length > 15, `Question ${q.id} has descriptive prompt`);
  assert(Array.isArray(q.options) && q.options.length >= 2, `Question ${q.id} has >= 2 options`);
  assert(q.options.includes(q.correctAnswer), `Question ${q.id} correct answer exists in options`);
  assert(!!q.explanation && q.explanation.length > 10, `Question ${q.id} has pedagogical explanation`);
  assert(!!q.normalizedHash && q.normalizedHash.length === 64, `Question ${q.id} has 64-char SHA-256 hash`);
  assert(!!q.questionFamily && q.questionFamily.length > 0, `Question ${q.id} belongs to a question family`);
  assert(!!q.variantGroupId, `Question ${q.id} has variant group ID`);
  assert(['L1', 'L2', 'L3', 'L4', 'L5'].includes(q.targetLevel), `Question ${q.id} has valid target level (${q.targetLevel})`);
  assert(
    ['VERIFIED_PUBLIC_REPORT', 'CURATED_COMPANY_PATTERN', 'COMMUNITY_REPORTED', 'PATTERN_INSPIRED', 'ORIGINAL_L2H'].includes(q.originalityStatus),
    `Question ${q.id} has valid originality status (${q.originalityStatus})`
  );
});

// TEST 2: Deterministic SHA-256 Hash Normalization (Section 16, 52)
console.log('\n--- TEST 2: SHA-256 Hash Normalization & Exact Invariance ---');
const baseText = 'What will be logged to the console?';
const spaceVariant = '  What   will    be   logged to  the console?  \n\n';
const punctVariant = 'What will be logged to the console???';

const hashA = computeNormalizedHash(baseText);
const hashB = computeNormalizedHash(spaceVariant);
const hashC = computeNormalizedHash(punctVariant);

assert(hashA.length === 64, 'Normalized hash produces 64-character SHA-256 hex string');
assert(hashA === hashB, 'Whitespace and newline variances collapse to the exact same hash');
assert(hashA === hashC, 'Punctuation noise collapses to the exact same normalized hash');

// TEST 3: Critical Repetition Test (Section 15, 19, 52)
console.log('\n--- TEST 3: Critical Anti-Repetition Blocking Engine ---');
const sampleQ = UNIVERSAL_QUESTION_BANK[0];

// Step 3A: User completes assessment, records seen hash
const userHistory: UserHistoryRecord[] = [
  {
    questionId: sampleQ.id,
    normalizedHash: sampleQ.normalizedHash,
    questionFamily: sampleQ.questionFamily,
    variantGroupId: sampleQ.variantGroupId,
    seenAt: new Date().toISOString(),
    answeredCorrectly: true,
    timeTakenSeconds: 30,
  },
];

// Step 3B: Assert identical question is blocked
const duplicateById = { ...sampleQ };
const filterById = filterEligibleQuestions([duplicateById], userHistory, []);
assert(filterById.eligibleQuestions.length === 0, 'Exact question ID match is blocked');
assert(filterById.blockedByExactHash === 1, 'Blocked due to previously seen hash (blockedByExactHash = 1)');

// Step 3C: Intentionally create same question with DIFFERENT ID -> Assert blocked by hash
const duplicateWithDifferentId: AssessmentQuestion = {
  ...sampleQ,
  id: 'forged-uuid-9999-different-id',
};
const filterByForgedId = filterEligibleQuestions([duplicateWithDifferentId], userHistory, []);
assert(filterByForgedId.eligibleQuestions.length === 0, 'Same question with forged different ID is blocked by SHA-256 hash');
assert(filterByForgedId.blockedByExactHash === 1, 'Hash detection caught forged ID duplicate');

// Step 3D: Intentionally create same question with whitespace changed -> Assert blocked
const duplicateWithWhitespace: AssessmentQuestion = {
  ...sampleQ,
  id: 'forged-uuid-8888-whitespace',
  questionText: `  \n  ${sampleQ.questionText}   \t  \n`,
  normalizedHash: computeNormalizedHash(`  \n  ${sampleQ.questionText}   \t  \n`),
};
const filterByWhitespace = filterEligibleQuestions([duplicateWithWhitespace], userHistory, []);
assert(filterByWhitespace.eligibleQuestions.length === 0, 'Same question with whitespace noise is blocked');

// Step 3E: Test question family cooldown limit within the same session
const familyQ1: AssessmentQuestion = {
  ...sampleQ,
  id: 'fam-q-1',
  normalizedHash: computeNormalizedHash('Unique prompt 1 for family test'),
  questionFamily: 'FAM_ASYNC_EVENT_LOOP',
  variantGroupId: 'vg-fam-1',
  topic: 'Topic 1',
};
const familyQ2: AssessmentQuestion = {
  ...sampleQ,
  id: 'fam-q-2',
  normalizedHash: computeNormalizedHash('Unique prompt 2 for family test'),
  questionFamily: 'FAM_ASYNC_EVENT_LOOP',
  variantGroupId: 'vg-fam-2',
  topic: 'Topic 2',
};
const familyQ3: AssessmentQuestion = {
  ...sampleQ,
  id: 'fam-q-3',
  normalizedHash: computeNormalizedHash('Unique prompt 3 for family test'),
  questionFamily: 'FAM_ASYNC_EVENT_LOOP',
  variantGroupId: 'vg-fam-3',
  topic: 'Topic 3',
};

// Suppose session already picked 2 questions from FAM_ASYNC_EVENT_LOOP
const currentSession = [familyQ1, familyQ2];
const familyFilter = filterEligibleQuestions([familyQ3], [], currentSession, { familyCooldownLimit: 2 });
assert(familyFilter.eligibleQuestions.length === 0, 'Question from same family exceeding cooldown limit (2) is blocked');
assert(familyFilter.blockedByFamilyCooldown === 1, 'Blocked due to FAMILY_COOLDOWN (blockedByFamilyCooldown = 1)');

// Step 3F: Legitimate new variant from a different family -> Assert allowed
const legitNewQ: AssessmentQuestion = {
  ...sampleQ,
  id: 'legit-new-variant-001',
  questionText: 'Which CSS property creates a new stacking context without changing layout bounds?',
  normalizedHash: computeNormalizedHash('Which CSS property creates a new stacking context without changing layout bounds?'),
  questionFamily: 'CSS_STACKING_CONTEXT',
  variantGroupId: 'CSS_STACK_01',
};
const legitFilter = filterEligibleQuestions([legitNewQ], userHistory, currentSession);
assert(legitFilter.eligibleQuestions.length === 1, 'Legitimate question from fresh family is allowed');

// TEST 4: Dynamic Career Blueprint & Adaptive Assessment Flow (Section 3, 21, 22, 53)
console.log('\n--- TEST 4: Dynamic Assessment Blueprints Across All Career Roles ---');
assert(CAREER_ROLES_CATALOG.length >= 12, `Career Catalog has ${CAREER_ROLES_CATALOG.length} dynamic roles`);

for (const career of CAREER_ROLES_CATALOG) {
  const blueprint = generateAssessmentBlueprint(career.slug, 'BASELINE', 'MEDIUM');
  assert(blueprint.careerRoleSlug === career.slug, `Blueprint generated for ${career.title} (${career.slug})`);
  assert(blueprint.distribution.length >= 3, `Blueprint for ${career.slug} contains multi-competency distributions`);

  const totalQuestionsTarget = blueprint.distribution.reduce((acc, d) => acc + d.count, 0);
  assert(totalQuestionsTarget >= 5, `Blueprint for ${career.slug} targets >= 5 questions (${totalQuestionsTarget})`);

  // Build real assessment session
  const session = buildAssessmentSession(blueprint, []);
  assert(session.length >= 5, `Built assessment session for ${career.slug} with ${session.length} questions`);

  // Verify non-repetition inside the session
  const hashesInSession = session.map(q => q.normalizedHash);
  const uniqueHashes = new Set(hashesInSession);
  assert(hashesInSession.length === uniqueHashes.size, `Session for ${career.slug} contains ZERO duplicate question hashes`);

  // Simulate answers submission (50% correct)
  const answers: Record<string, string> = {};
  session.forEach((q, idx) => {
    answers[q.id] = idx % 2 === 0 ? q.correctAnswer : 'WRONG_ANSWER';
  });

  const evaluation = evaluateAssessmentSession(session, answers, career.slug);
  assert(evaluation.totalQuestions === session.length, `Evaluation for ${career.slug} scored all questions`);
  assert(evaluation.accuracy >= 40 && evaluation.accuracy <= 60, `Evaluation accuracy properly reflects 50% response`);
  assert(evaluation.skillBreakdown.length > 0, `Evaluation produced skill breakdown for ${career.slug}`);
  assert(evaluation.recommendedResources.length >= 3, `Evaluation mapped free educational resources for ${career.slug}`);

  // Validate free learning resources (Section 37, 74)
  evaluation.recommendedResources.forEach((res) => {
    assert(
      res.url.startsWith('https://www.geeksforgeeks.org') ||
      res.url.startsWith('https://www.w3schools.com') ||
      res.url.startsWith('https://developer.mozilla.org') ||
      res.url.startsWith('https://www.freecodecamp.org'),
      `Resource ${res.title} links to verified free portal (${res.provider}): ${res.url}`
    );
  });
}

// TEST 5: Interview Intelligence & Dynamic Contextual Follow-Up Engine (Section 31, 33, 54)
console.log('\n--- TEST 5: Interview Intelligence & Dynamic Contextual Follow-Up Engine ---');
const testRoleSlug = 'backend-developer';
const initialInterviewQuestions = getInitialInterviewQuestions(testRoleSlug);
assert(initialInterviewQuestions.length >= 3, `Interview hub generates ${initialInterviewQuestions.length} initial interview turns`);

const techQ = initialInterviewQuestions[0];
assert(techQ.stage === 'TECHNICAL', `Initial turn is TECHNICAL question`);

// Scenario A: Candidate articulates answer with Redis & Caching
const candidateAnswerA = 'We introduced a Redis caching cluster with a TTL and cache-aside strategy to reduce relational database queries.';
const followUpA = generateContextualFollowUp(techQ, candidateAnswerA);

assert(followUpA.stage === 'FOLLOW_UP', 'Follow-up generator returns a FOLLOW_UP stage');
assert(
  followUpA.questionText.toLowerCase().includes('cache') || followUpA.questionText.toLowerCase().includes('stampede'),
  `Follow-up directly contextualizes candidate's mention of caching: "${followUpA.questionText.slice(0, 80)}..."`
);

// Scenario B: Candidate articulates answer with Database Locks & Transactions
const candidateAnswerB = 'We used PostgreSQL with SELECT FOR UPDATE row-level locking inside an ACID database transaction to avoid overselling.';
const followUpB = generateContextualFollowUp(techQ, candidateAnswerB);
assert(
  followUpB.questionText.toLowerCase().includes('isolation') || followUpB.questionText.toLowerCase().includes('deadlock'),
  `Follow-up directly contextualizes candidate's mention of database locking: "${followUpB.questionText.slice(0, 80)}..."`
);

// Test Rubric Scoring
const candidateAnswerTech = 'We handle long-running I/O tasks using an asynchronous event-loop with non-blocking I/O, offloading heavy CPU computation to worker threads or background message queues with database connection pooling.';
const evalScorecard = evaluateInterviewResponse(techQ, candidateAnswerTech);
assert(evalScorecard.technicalCorrectness >= 70, `Technical correctness evaluated: ${evalScorecard.technicalCorrectness}%`);
assert(evalScorecard.communication >= 70, `Communication evaluated: ${evalScorecard.communication}%`);
assert(evalScorecard.strengths.length > 0, `Strengths highlighted: ${evalScorecard.strengths[0]}`);
assert(!!evalScorecard.detailedReport, `Detailed feedback report synthesized`);

console.log('\n============================================================');
console.log(`TEST SUITE COMPLETE: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('ALL UNIVERSAL ASSESSMENT & INTERVIEW ENGINE GATES VERIFIED!');
console.log('============================================================\n');
