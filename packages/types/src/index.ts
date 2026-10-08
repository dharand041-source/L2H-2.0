/**
 * LEARN-2-HIRE CANONICAL DOMAIN TYPES
 * Single source of truth for all domain entities, DTOs, and provider contracts.
 */

// =============================================================================
// 1. COMMON & SYSTEM PRIMITIVES
// =============================================================================

export type UUID = string;
export type ISODateString = string;

export type DifficultyLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  L0: 'Awareness',
  L1: 'Beginner',
  L2: 'Basic',
  L3: 'Intermediate',
  L4: 'Advanced',
  L5: 'Expert',
};

export type ContentSourceType = 
  | 'OFFICIAL'
  | 'OPEN_SOURCE'
  | 'THIRD_PARTY'
  | 'REPORTED_EXPERIENCE'
  | 'LEARN_2_HIRE_ORIGINAL'
  | 'AI_GENERATED';

// =============================================================================
// 2. USER, PROFILE, EDUCATION & EXPERIENCE
// =============================================================================

export interface UserProfile {
  id: UUID; // Maps directly to auth.users(id)
  email: string;
  fullName: string;
  headline?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  phone?: string;
  targetRoleId?: UUID;
  targetRoleName?: string;
  careerTrack: 'TECHNICAL' | 'NON_TECHNICAL' | 'HYBRID';
  readinessScore: number; // 0 - 100
  isPublicProfile: boolean;
  preferredWorkModes: Array<'REMOTE' | 'HYBRID' | 'ONSITE'>;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface EducationRecord {
  id: UUID;
  userId: UUID;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  grade?: string;
  isCurrent: boolean;
  createdAt: ISODateString;
}

export interface ExperienceRecord {
  id: UUID;
  userId: UUID;
  company: string;
  title: string;
  location?: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT' | 'FREELANCE';
  startDate: ISODateString;
  endDate?: ISODateString;
  isCurrent: boolean;
  description?: string;
  createdAt: ISODateString;
}

// =============================================================================
// 3. CAREER TAXONOMY, COMPETENCIES & SKILLS
// =============================================================================

export interface CareerCategory {
  id: UUID;
  name: string;
  slug: string;
  description: string;
  track: 'TECHNICAL' | 'NON_TECHNICAL' | 'HYBRID';
  icon?: string;
  displayOrder: number;
}

export interface CareerRole {
  id: UUID;
  categoryId: UUID;
  name: string;
  slug: string;
  description: string;
  track: 'TECHNICAL' | 'NON_TECHNICAL' | 'HYBRID';
  industry: string;
  averageSalaryUsd?: number;
  marketDemand: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'SPECIALIZED';
  tasks: string[];
  educationRequirements: string[];
  source: 'ESCO' | 'ONET' | 'BLS' | 'LEARN_2_HIRE_ORIGINAL';
  sourceId?: string;
  sourceUrl?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Competency {
  id: UUID;
  name: string;
  slug: string;
  description: string;
  category: string;
}

export interface Skill {
  id: UUID;
  competencyId?: UUID;
  name: string;
  slug: string;
  category: string;
  description?: string;
  isTechnical: boolean;
}

export interface CareerRoleSkill {
  id: UUID;
  careerRoleId: UUID;
  skillId: UUID;
  requiredLevel: DifficultyLevel; // e.g. L3
  importance: number; // 0.0 - 1.0
  source: ContentSourceType;
}

// =============================================================================
// 4. SKILL GRAPH & INTELLIGENCE ANALYZER
// =============================================================================

export type SkillEvidenceType = 
  | 'ASSESSMENT' 
  | 'PRACTICE' 
  | 'PROJECT' 
  | 'INTERVIEW' 
  | 'RESUME_VERIFIED';

export interface SkillEvidence {
  id: UUID;
  userSkillId: UUID;
  evidenceType: SkillEvidenceType;
  referenceId: UUID; // ID in assessment_attempts, project_submissions, etc.
  scoreAchieved: number; // 0 - 100
  weight: number; // 0.0 - 1.0
  verifiedAt: ISODateString;
  notes?: string;
}

export interface UserSkill {
  id: UUID;
  userId: UUID;
  skillId: UUID;
  skillName: string;
  currentLevel: DifficultyLevel;
  confidenceScore: number; // 0.0 - 1.0
  isVerified: boolean;
  evidenceCount: number;
  lastAssessedAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface SkillGap {
  skillId: UUID;
  skillName: string;
  requiredLevel: DifficultyLevel;
  currentLevel: DifficultyLevel;
  gapSteps: number; // e.g. L4 - L2 = 2
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
}

export interface CandidateReadinessAnalysis {
  userId: UUID;
  targetRoleId: UUID;
  targetRoleName: string;
  overallReadinessScore: number; // 0 - 100
  totalRequiredSkills: number;
  satisfiedSkillsCount: number;
  gaps: SkillGap[];
  strongestSkills: UserSkill[];
  weakestSkills: SkillGap[];
  nextBestAction: {
    title: string;
    description: string;
    actionType: 'ASSESSMENT' | 'LESSON' | 'PRACTICE' | 'PROJECT';
    deepLinkUrl: string;
  };
  generatedAt: ISODateString;
}

// =============================================================================
// 5. ASSESSMENT ENGINE & QUESTION NON-REPETITION
// =============================================================================

export type QuestionType = 
  | 'MCQ' 
  | 'MULTI_SELECT'
  | 'TRUE_FALSE'
  | 'CODE_OUTPUT'
  | 'CODE_COMPLETION'
  | 'CODING' 
  | 'DEBUGGING' 
  | 'SQL'
  | 'DATABASE_DESIGN'
  | 'API_DESIGN'
  | 'SYSTEM_DESIGN'
  | 'ARCHITECTURE'
  | 'SCENARIO' 
  | 'CASE_STUDY'
  | 'PROJECT_TASK'
  | 'PRACTICAL_TASK'
  | 'APTITUDE'
  | 'LOGICAL_REASONING'
  | 'NUMERICAL_REASONING'
  | 'DATA_INTERPRETATION'
  | 'VERBAL_REASONING'
  | 'COMMUNICATION'
  | 'BEHAVIORAL'
  | 'ROLE_PLAY'
  | 'PROJECT_DEFENSE'
  | 'TECHNICAL_INTERVIEW'
  | 'HR_INTERVIEW'
  | 'FOLLOW_UP'
  | 'SHORT_ANSWER';

export interface QuestionSource {
  id: UUID;
  name: string; // e.g. iGET, Sansal, ProSculpt, BANKI, L2H Original, GeeksforGeeks, W3Schools
  url?: string;
  license: string;
  isRedistributable: boolean;
}

export interface Question {
  id: UUID;
  skillId: UUID;
  careerRoleId?: UUID;
  competencyId?: UUID;
  topic: string;
  subtopic?: string;
  difficulty: DifficultyLevel;
  targetLevel?: DifficultyLevel;
  questionType: QuestionType;
  questionFamily?: string;
  questionVariant?: string;
  prompt: string;
  codeSnippet?: string;
  options?: string[]; // For MCQ/Multi-select
  correctAnswer: string | string[]; // Answer key or expected output
  explanation: string;
  solution?: string;
  distractorExplanations?: Record<string, string>;
  evaluationData?: Record<string, any>;
  conceptTested: string;
  expectedTimeSeconds?: number;
  points?: number;
  sourceId?: UUID;
  sourceType: ContentSourceType;
  sourceName?: string;
  sourceUrl?: string;
  sourceYear?: number;
  sourceCompany?: string;
  sourceConfidence?: 'HIGH' | 'MEDIUM' | 'COMMUNITY_REPORTED' | 'LOW';
  originalityStatus?: 'ORIGINAL_L2H' | 'PATTERN_INSPIRED' | 'VERIFIED_PUBLIC_REPORT';
  fingerprint?: string;
  normalizedHash?: string;
  variantGroupId?: string;
  qualityScore: number; // 0.0 - 5.0
  usageCount: number;
  status?: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'RETIRED';
  createdAt: ISODateString;
}

export interface UserQuestionHistory {
  id: UUID;
  userId: UUID;
  questionId?: UUID;
  normalizedHash: string;
  questionFamily?: string;
  variantGroupId?: string;
  attemptId?: UUID;
  careerRoleId?: UUID;
  seenAt: ISODateString;
  answeredCorrectly: boolean;
  score: number;
  timeTaken: number;
}

export interface AssessmentBlueprint {
  id: UUID;
  name: string;
  roleId?: UUID;
  assessmentType: 'BASELINE' | 'TECHNICAL' | 'APTITUDE' | 'LOGICAL' | 'ROLE' | 'COMPANY_PATTERN';
  totalQuestions: number;
  durationMinutes: number;
  passingScore: number;
  skillDistribution: Array<{
    skillId: UUID;
    skillName: string;
    questionCount: number;
    targetDifficulty: DifficultyLevel;
  }>;
}

export type CandidateEntryLevel = 'BEGINNER' | 'AMATEUR' | 'PROFESSIONAL';

export interface CalibrationAnswers {
  priorStudy: 'none' | 'basics' | 'projects' | 'professional';
  learningDuration: 'not_yet' | 'under_3_months' | '3_to_12_months' | 'over_1_year' | 'professional';
  builtProjects: boolean;
  workedProfessionally: boolean;
  techComfort: 'very_new' | 'beginner' | 'comfortable' | 'advanced';
}

export interface AssessmentAttempt {
  id: UUID;
  userId: UUID;
  blueprintId: UUID;
  careerRoleId?: UUID;
  title: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  entryLevel?: CandidateEntryLevel;
  calibratedLevel?: DifficultyLevel;
  score: number; // 0 - 100
  weightedScore?: number;
  passed: boolean;
  totalTimeSeconds: number;
  questionCount?: number;
  correctCount?: number;
  skillScores?: Record<string, number>;
  readinessScore?: number;
  metadata?: Record<string, any>;
  startedAt: ISODateString;
  completedAt?: ISODateString;
}

export interface AssessmentAnswerRecord {
  id: UUID;
  attemptId: UUID;
  questionId: UUID;
  userAnswer: string | string[];
  isCorrect: boolean;
  timeSpentSeconds: number;
  feedback?: string;
}

// =============================================================================
// 6. LEARNING HUB & RESOURCE PROVIDERS
// =============================================================================

export type ResourceContentType = 
  | 'COURSE' 
  | 'DOCUMENTATION' 
  | 'TUTORIAL' 
  | 'VIDEO' 
  | 'INTERACTIVE' 
  | 'BOOK';

export interface EducationalResource {
  id: UUID;
  provider: 'FREECODECAMP' | 'MDN' | 'CS50' | 'MIT_OCW' | 'NPTEL' | 'SWAYAM' | 'KHAN_ACADEMY' | 'MICROSOFT_LEARN' | 'AWS_SKILL_BUILDER' | 'SQLBOLT' | 'OFFICIAL_DOCS';
  title: string;
  url: string;
  description: string;
  skillId: UUID;
  topic: string;
  difficulty: DifficultyLevel;
  contentType: ResourceContentType;
  durationMinutes?: number;
  isFree: boolean;
  hasCertificate: boolean;
  lastVerifiedAt: ISODateString;
}

export interface LearningPathItem {
  id: UUID;
  learningPathId: UUID;
  sequenceOrder: number;
  skillId: UUID;
  topic: string;
  resourceId?: UUID;
  resource?: EducationalResource;
  isCompleted: boolean;
  completedAt?: ISODateString;
}

export interface LearningPath {
  id: UUID;
  userId: UUID;
  targetRoleId: UUID;
  title: string;
  description: string;
  items: LearningPathItem[];
  progressPercent: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// =============================================================================
// 7. PRACTICE ENGINE
// =============================================================================

export interface PracticeChallenge {
  id: UUID;
  skillId: UUID;
  title: string;
  slug: string;
  description: string;
  category: 'CODING' | 'DSA' | 'SQL' | 'DEBUGGING' | 'APTITUDE' | 'LOGICAL' | 'VERBAL' | 'ROLE_CHALLENGE';
  difficulty: DifficultyLevel;
  starterCode?: Record<string, string>; // { python: '...', typescript: '...' }
  solutionCode?: string;
  testCases?: Array<{
    input: string;
    expectedOutput: string;
    isPublic: boolean;
  }>;
  hints: string[];
  sourceUrl?: string;
}

export interface PracticeAttempt {
  id: UUID;
  userId: UUID;
  challengeId: UUID;
  codeSubmitted?: string;
  passed: boolean;
  testCasesPassed: number;
  totalTestCases: number;
  executionTimeMs?: number;
  score: number;
  attemptedAt: ISODateString;
}

// =============================================================================
// 8. PROJECT & SKILL EVIDENCE ENGINE
// =============================================================================

export interface ProjectMilestone {
  id: UUID;
  projectId: UUID;
  title: string;
  description: string;
  requiredDeliverable: string;
  orderIndex: number;
  isCompleted: boolean;
}

export interface Project {
  id: UUID;
  targetRoleId: UUID;
  title: string;
  slug: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  technologies: string[];
  competenciesTested: string[];
  milestones: ProjectMilestone[];
  starterRepositoryUrl?: string;
}

export interface ProjectSubmission {
  id: UUID;
  userId: UUID;
  projectId: UUID;
  githubUrl: string;
  liveDeploymentUrl?: string;
  documentationUrl?: string;
  explanationNotes: string;
  submittedAt: ISODateString;
  status: 'PENDING' | 'EVALUATED' | 'REVISION_REQUESTED';
}

export interface ProjectEvaluation {
  id: UUID;
  submissionId: UUID;
  overallScore: number; // 0 - 100
  passed: boolean;
  rubricScores: Array<{
    criterion: string;
    maxScore: number;
    scoreGiven: number;
    comments: string;
  }>;
  feedbackSummary: string;
  evaluatedAt: ISODateString;
}

// =============================================================================
// 9. INTERVIEW ENGINE & COMPANY PATTERNS
// =============================================================================

export interface CompanyPattern {
  id: UUID;
  companyName: string;
  targetRole: string;
  assessmentSections: string[];
  technicalTopics: string[];
  aptitudeTopics: string[];
  interviewRounds: Array<{
    roundNumber: number;
    roundName: string;
    description: string;
    typicalDurationMinutes: number;
  }>;
  difficulty: DifficultyLevel;
  source: ContentSourceType;
  sourceUrl?: string;
  lastVerifiedAt: ISODateString;
}

export interface InterviewSession {
  id: UUID;
  userId: UUID;
  targetRoleId: UUID;
  companyPatternId?: UUID;
  sessionType: 'TECHNICAL' | 'HR' | 'BEHAVIORAL' | 'ROLE_SPECIFIC' | 'MOCK';
  level: DifficultyLevel;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'TERMINATED';
  startedAt: ISODateString;
  completedAt?: ISODateString;
}

export interface InterviewFeedback {
  id: UUID;
  sessionId: UUID;
  technicalCorrectnessScore: number; // 0 - 100
  communicationScore: number; // 0 - 100
  problemSolvingScore: number; // 0 - 100
  structuralClarityScore: number; // 0 - 100
  overallScore: number; // 0 - 100
  strengths: string[];
  areasForImprovement: string[];
  detailedReport: string;
  disclaimer: string; // Mandatory non-guarantee disclaimer
}

// =============================================================================
// 10. RESUME SYSTEM
// =============================================================================

export interface ResumeVersion {
  id: UUID;
  userId: UUID;
  title: string;
  targetRole: string;
  summary: string;
  skillsIncluded: string[];
  experienceIds: UUID[];
  educationIds: UUID[];
  projectIds: UUID[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ResumeAnalysis {
  id: UUID;
  resumeVersionId: UUID;
  targetJobDescription?: string;
  compatibilityScore: number; // 0 - 100
  keywordCoveragePercent: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  structuralIssues: string[];
  actionableRecommendations: string[];
  analyzedAt: ISODateString;
}

// =============================================================================
// 11. OPPORTUNITIES & JOB MATCHING ENGINE
// =============================================================================

export type OpportunityType = 
  | 'FULL_TIME' 
  | 'INTERNSHIP' 
  | 'APPRENTICESHIP' 
  | 'GRADUATE_TRAINEE' 
  | 'STARTUP' 
  | 'REMOTE' 
  | 'PART_TIME' 
  | 'CONTRACT';

export interface Opportunity {
  id: UUID;
  externalId: string;
  source: 'ADZUNA' | 'JOOBLE' | 'THE_MUSE' | 'REMOTIVE' | 'EMPLOYER_CAREER_PORTAL' | 'DIRECT';
  sourceUrl: string;
  applyUrl: string;
  companyName: string;
  companyLogoUrl?: string;
  title: string;
  normalizedTitle: string;
  description: string;
  location: string;
  isRemote: boolean;
  employmentType: OpportunityType;
  experienceLevelRequired?: string;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  requiredSkills: string[];
  postedAt: ISODateString;
  lastVerifiedAt: ISODateString;
  expiresAt?: ISODateString;
}

export interface JobEligibilityReport {
  opportunityId: UUID;
  userId: UUID;
  status: 'ELIGIBLE' | 'POSSIBLY_ELIGIBLE' | 'REQUIREMENTS_MISSING' | 'REQUIREMENTS_UNKNOWN';
  matchScore: number; // 0 - 100
  skillMatchScore: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  experienceMatch: boolean;
  educationMatch: boolean;
  locationMatch: boolean;
  explainableFactors: Array<{
    factor: string;
    verdict: 'STRONG' | 'PARTIAL' | 'MISSING' | 'NOT_APPLICABLE';
    notes: string;
  }>;
}

// =============================================================================
// 12. APPLICATION TRACKER & IMPROVEMENT ENGINE
// =============================================================================

export type ApplicationStatus = 
  | 'SAVED' 
  | 'READY_TO_APPLY' 
  | 'APPLIED' 
  | 'SCREENING' 
  | 'ASSESSMENT' 
  | 'INTERVIEW' 
  | 'OFFER' 
  | 'REJECTED' 
  | 'WITHDRAWN' 
  | 'CLOSED';

export interface Application {
  id: UUID;
  userId: UUID;
  opportunityId: UUID;
  opportunity: Opportunity;
  resumeVersionId?: UUID;
  status: ApplicationStatus;
  appliedDate?: ISODateString;
  interviewDate?: ISODateString;
  notes?: string;
  outcomeReason?: string; // If known, otherwise "Reason not provided"
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ImprovementPlan {
  id: UUID;
  userId: UUID;
  triggerType: 'ASSESSMENT_WEAKNESS' | 'PRACTICE_WEAKNESS' | 'PROJECT_WEAKNESS' | 'INTERVIEW_WEAKNESS' | 'APPLICATION_REJECTION';
  triggerReferenceId?: UUID;
  identifiedGaps: string[];
  remedialLessons: EducationalResource[];
  remedialChallenges: PracticeChallenge[];
  reassessmentTargetDate: ISODateString;
  status: 'ACTIVE' | 'COMPLETED';
}

// =============================================================================
// 13. NOTIFICATIONS & ANALYTICS
// =============================================================================

export type NotificationType = 
  | 'ASSESSMENT' 
  | 'LEARNING' 
  | 'PRACTICE' 
  | 'PROJECT' 
  | 'INTERVIEW' 
  | 'JOB' 
  | 'INTERNSHIP' 
  | 'APPLICATION' 
  | 'IMPROVEMENT' 
  | 'SYSTEM';

export interface AppNotification {
  id: UUID;
  userId: UUID;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl: string;
  isRead: boolean;
  createdAt: ISODateString;
}
