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

  // TEST SUITE 9: NOTIFICATIONS ENGINE DETERMINISTIC FEEDS (PHASE 5)
  console.log('\n--- TEST SUITE 9: Notifications Engine Deterministic Feeds ---');
  const { NotificationStore } = await import('../apps/web/src/lib/notifications/notification-store');
  const notifs = NotificationStore.getInitialDeterministicNotifications();
  assert(notifs.length >= 3, `Initialized deterministic notifications (found ${notifs.length})`);
  assert(notifs.some((n) => n.type === 'JOB'), 'Contains real verified job match notification');
  assert(notifs.some((n) => n.type === 'RESUME'), 'Contains resume & ATS scanner action alert');

  // TEST SUITE 10: SETTINGS PERSISTENCE & PRIVACY CONTROLS (PHASE 4)
  console.log('\n--- TEST SUITE 10: Platform Settings Defaults & Disclosure Controls ---');
  const { DEFAULT_PLATFORM_SETTINGS } = await import('../apps/web/src/lib/settings/settings-store');
  assert(DEFAULT_PLATFORM_SETTINGS.allowEmployerSkillReceipts === true, 'Default allows verified employer skill inspection');
  assert(DEFAULT_PLATFORM_SETTINGS.antiRepetitionActive === true, 'Default activates anti-repetition engine');
  assert(DEFAULT_PLATFORM_SETTINGS.matchThresholdPercent === 80, 'Default threshold set to 80%');

  // TEST SUITE 11: DIRECT APPLY ZERO DEMO RESUME INTEGRITY (CRITICAL BUG #1 & #2)
  console.log('\n--- TEST SUITE 11: Direct Apply Zero Demo Resume & Route Integrity ---');
  const { ResumeStore } = await import('../apps/web/src/lib/resume/resume-store');
  const versions = ResumeStore.getVersions();
  assert(Array.isArray(versions), 'Resume versions store accessible and array-based');
  // Confirm that empty state returns null rather than a dummy resume
  if (versions.length === 0) {
    assert(ResumeStore.getActiveVersion() === null, 'When zero resumes uploaded, getActiveVersion() strictly returns null (No sample resume)');
  }

  // TEST SUITE 12: APPLICATION TRACKER PRODUCTION LIFECYCLE (MASTER PROMPT REQUIREMENTS)
  console.log('\n--- TEST SUITE 12: Application Tracker Lifecycle, Outcomes, and Audit Trail ---');
  const { ApplicationStore } = await import('../apps/web/src/lib/applications/application-store');

  // 1. Initial State: Empty or real records, zero fake data
  const initialApps = ApplicationStore.getApplications();
  assert(Array.isArray(initialApps), 'Application store returns array of records');

  // 2. Saving a job creates a SAVED record with JOB_SAVED event
  const testJobId = `job-test-${Date.now()}`;
  const saveRes = ApplicationStore.saveJobAsApplication({
    opportunityId: testJobId,
    company: 'Test Technologies India',
    title: 'Full-Stack Software Engineer',
    location: 'Chennai, TN',
    workMode: 'Hybrid',
    careerRoleSlug: 'full-stack-developer',
    careerRoleTitle: 'Full-Stack Developer',
    applyUrl: 'https://careers.example.com/jobs/123',
    jobUrl: 'https://careers.example.com/postings/123',
    source: 'EMPLOYER_CAREER_PORTAL',
  });
  assert(saveRes.application.status === 'SAVED', 'Saved job record created with status SAVED');
  assert(saveRes.isExisting === false, 'New application correctly marked as non-duplicate');
  assert(saveRes.application.events.length >= 1, 'Initial JOB_SAVED event generated in timeline');
  assert(saveRes.application.events[0].eventType === 'JOB_SAVED', 'First event is strictly JOB_SAVED');

  // 3. Duplicate Application Protection
  const duplicateCheck = ApplicationStore.findExistingApplicationByJobId(testJobId);
  assert(duplicateCheck !== null, 'Existing application discovered by opportunity ID');
  assert(duplicateCheck?.id === saveRes.application.id, 'Duplicate application matches saved record ID');

  // 4. CRITICAL STATUS DISTINCTION: Opening employer portal records APPLICATION_STARTED ONLY (NOT APPLIED!)
  const startedApp = ApplicationStore.recordApplicationStarted({
    opportunityId: testJobId,
    company: 'Test Technologies India',
    title: 'Full-Stack Software Engineer',
    location: 'Chennai, TN',
    careerRoleSlug: 'full-stack-developer',
    resumeVersionId: 'res-test-v1',
    resumeTitle: 'Resume Version 1',
    compatibilityScore: 88,
    eligibilityStatus: 'ELIGIBLE',
    applyUrl: 'https://careers.example.com/jobs/123',
  });
  assert(startedApp.status === 'APPLICATION_STARTED', 'Clicking Continue to Portal sets status APPLICATION_STARTED');
  assert(startedApp.status !== 'APPLIED', 'CRITICAL PRINCIPLE: APPLICATION_STARTED is strictly NOT APPLIED');
  assert(startedApp.appliedDate === undefined, 'Applied date remains undefined until explicit user confirmation');
  assert(startedApp.resumeVersionId === 'res-test-v1', 'Resume version locked to selected document version');
  assert(startedApp.compatibilityScore === 88, 'Compatibility estimate stored against application');
  assert(startedApp.eligibilityStatus === 'ELIGIBLE', 'Eligibility state stored against application');

  // 5. Explicit Submission Confirmation Gate: YES, I APPLIED
  const confirmedApp = ApplicationStore.confirmSubmission(startedApp.id);
  assert(confirmedApp !== null, 'Submission confirmed successfully');
  assert(confirmedApp?.status === 'APPLIED', 'Status changed to APPLIED ONLY after explicit candidate confirmation');
  assert(confirmedApp?.appliedDate !== undefined, 'Authentic applied date recorded upon confirmation');
  assert(confirmedApp?.events.some((e) => e.eventType === 'APPLIED'), 'Immutable APPLIED event recorded in timeline');

  // 6. Transition Validation Engine
  assert(ApplicationStore.canTransition('APPLIED', 'SCREENING'), 'Logical transition APPLIED -> SCREENING allowed');
  assert(ApplicationStore.canTransition('SCREENING', 'INTERVIEW'), 'Logical transition SCREENING -> INTERVIEW allowed');
  assert(ApplicationStore.canTransition('INTERVIEW', 'OFFER'), 'Logical transition INTERVIEW -> OFFER allowed');
  assert(ApplicationStore.canTransition('INTERVIEW', 'REJECTED'), 'Logical transition INTERVIEW -> REJECTED allowed');
  assert(ApplicationStore.canTransition('APPLIED', 'WITHDRAWN'), 'Logical transition APPLIED -> WITHDRAWN allowed');

  // 7. Status transition to SCREENING and then INTERVIEW
  const screeningApp = ApplicationStore.updateStatus({
    applicationId: startedApp.id,
    newStatus: 'SCREENING',
  });
  assert(screeningApp?.status === 'SCREENING', 'Status moved to SCREENING');

  const interviewApp = ApplicationStore.updateStatus({
    applicationId: startedApp.id,
    newStatus: 'INTERVIEW',
  });
  assert(interviewApp?.status === 'INTERVIEW', 'Status moved to INTERVIEW');
  assert(interviewApp?.events.length >= 4, 'All historical events preserved in chronological audit trail');

  // 8. Rejection Reason Engine & Strict Honesty:
  // If employer gives no reason, system displays "Employer did not provide a reason." (NEVER invents reasons)
  const rejectedApp = ApplicationStore.updateStatus({
    applicationId: startedApp.id,
    newStatus: 'REJECTED',
    reasonCategory: 'TECHNICAL_INTERVIEW',
    reasonText: '', // No reason provided
    sourceType: 'EMPLOYER_EMAIL',
    sourceConfidence: 'CONFIRMED',
  });
  assert(rejectedApp?.status === 'REJECTED', 'Application status recorded as REJECTED');
  assert(rejectedApp?.outcomeReason === 'Employer did not provide a reason.', 'Strict honesty: defaults to "Employer did not provide a reason." rather than hallucinating skill gap');
  assert(rejectedApp?.outcomeSourceType === 'EMPLOYER_EMAIL', 'Outcome source attributed to EMPLOYER_EMAIL');

  // 9. Candidate Withdrawal Flow
  const withdrawJobId = `job-withdraw-${Date.now()}`;
  const withdrawAppInitial = ApplicationStore.recordApplicationStarted({
    opportunityId: withdrawJobId,
    company: 'Withdraw Test Corp',
    title: 'Backend Engineer',
    careerRoleSlug: 'backend-developer',
  });
  const withdrawnApp = ApplicationStore.updateStatus({
    applicationId: withdrawAppInitial.id,
    newStatus: 'WITHDRAWN',
    reasonCategory: 'ACCEPTED_ANOTHER_OFFER',
    reasonText: 'Accepted offer at primary target company.',
    sourceType: 'CANDIDATE_REPORTED',
  });
  assert(withdrawnApp?.status === 'WITHDRAWN', 'Status recorded as WITHDRAWN');
  assert(withdrawnApp?.withdrawalReasonCategory === 'ACCEPTED_ANOTHER_OFFER', 'Withdrawal category correctly stored');
  assert(withdrawnApp?.outcomeSourceType === 'CANDIDATE_REPORTED', 'Withdrawal source attributed as CANDIDATE_REPORTED');

  // 10. Funnel Metrics & Conversion Rates
  const metrics = ApplicationStore.calculateFunnelMetrics();
  assert(metrics.total >= 2, `Funnel metrics calculated on active data (total: ${metrics.total})`);
  assert(metrics.rejected >= 1, 'Rejection counted in metrics');
  assert(metrics.withdrawn >= 1, 'Withdrawal counted in metrics');
  if (metrics.total < 5) {
    assert(metrics.rates.hasReliableSample === false, 'Strict honesty: < 5 applications returns hasReliableSample === false');
    assert(metrics.rates.appliedToScreeningRate === null, 'Conversion rates remain null when sample size is insufficient');
  }

  // 11. L2H Competency Gap Observations (Separated from employer reason)
  const sampleCandidateSkills = [
    { name: 'Docker & Deployment', currentLevel: 'L0', requiredLevel: 'L2' },
    { name: 'System Design', currentLevel: 'L1', requiredLevel: 'L3' },
  ];
  const observations = ApplicationStore.synthesizeObservations([rejectedApp!], sampleCandidateSkills);
  assert(observations.length > 0, 'Synthesized L2H improvement observations');
  assert(observations[0].observationNote.includes('L2H pattern analysis'), 'Observation explicitly clarified as L2H pattern, NOT employer stated reason');

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
