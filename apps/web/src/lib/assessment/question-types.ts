/**
 * LEARN-2-HIRE 2.0: UNIVERSAL ASSESSMENT TAXONOMY & ENGINE CONTRACTS
 */

export type AssessmentDifficulty = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export type CandidateEntryLevel = 'BEGINNER' | 'AMATEUR' | 'PROFESSIONAL';

export interface CalibrationAnswers {
  priorStudy: 'none' | 'basics' | 'projects' | 'professional';
  learningDuration: 'not_yet' | 'under_3_months' | '3_to_12_months' | 'over_1_year' | 'professional';
  builtProjects: boolean;
  workedProfessionally: boolean;
  techComfort: 'very_new' | 'beginner' | 'comfortable' | 'advanced';
}

export type AssessmentSection =
  | 'CAREER_FUNDAMENTALS'
  | 'ROLE_KNOWLEDGE'
  | 'CORE_SKILL'
  | 'APPLIED_PROBLEM_SOLVING'
  | 'CODING_PRACTICAL'
  | 'APTITUDE'
  | 'LOGICAL_REASONING'
  | 'ROLE_SCENARIO';

export type QuestionDomainType =
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
  | 'FOLLOW_UP';

export type QuestionSourceTag =
  | 'ORIGINAL_L2H'
  | 'PATTERN_INSPIRED'
  | 'CURATED_COMPANY_PATTERN'
  | 'VERIFIED_PUBLIC_REPORT'
  | 'COMMUNITY_REPORTED'
  | 'GFG_REFERENCE'
  | 'GEEKSFORGEEKS_REFERENCE'
  | 'W3SCHOOLS_REFERENCE'
  | 'MDN_REFERENCE'
  | 'OFFICIAL_DOCUMENTATION';

export interface AssessmentQuestion {
  id: string;
  careerRoleSlug: string;
  skillName: string;
  competency: string;
  section?: AssessmentSection;
  topic: string;
  subtopic?: string;
  difficulty: AssessmentDifficulty;
  targetLevel?: AssessmentDifficulty;
  questionType: QuestionDomainType;
  questionFamily: string;
  questionVariant: string;
  variantGroupId: string;
  prompt: string;
  questionText?: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  solution?: string;
  distractorExplanations?: Record<string, string>;
  conceptTested: string;
  expectedTimeSeconds: number;
  points: number;
  sourceType: QuestionSourceTag;
  sourceName: string;
  sourceUrl?: string;
  sourceYear?: number;
  sourceCompany?: string;
  sourceConfidence: 'HIGH' | 'MEDIUM' | 'COMMUNITY_REPORTED' | 'LOW';
  originalityStatus: QuestionSourceTag;
  normalizedHash: string;
  tags?: string[];
}

export interface UserHistoryRecord {
  questionId?: string;
  normalizedHash: string;
  questionFamily: string;
  variantGroupId?: string;
  seenAt: string;
  answeredCorrectly: boolean;
  score?: number;
  timeTakenSeconds?: number;
}

export interface BlueprintSkillRequirement {
  skillName: string;
  targetDifficulty: AssessmentDifficulty;
  count: number;
  category: 'CORE' | 'BREADTH' | 'APPLIED' | 'REASONING' | 'FUNDAMENTALS';
  section?: AssessmentSection;
}

export interface DynamicAssessmentBlueprint {
  id: string;
  careerRoleSlug: string;
  title: string;
  entryLevel?: CandidateEntryLevel;
  totalQuestions: number;
  durationMinutes: number;
  passingScore: number;
  distribution: BlueprintSkillRequirement[];
}

export interface EvaluationResult {
  score: number;
  weightedScore?: number;
  entryLevel?: CandidateEntryLevel;
  demonstratedLevel?: AssessmentDifficulty;
  passed: boolean;
  accuracy: number;
  totalQuestions: number;
  correctCount: number;
  skillBreakdown: Array<{
    skillName: string;
    level: AssessmentDifficulty;
    score: number;
    targetLevel: AssessmentDifficulty;
    gap: number;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'SATISFIED';
  }>;
  strengths: string[];
  weaknesses: string[];
  recommendedResources: Array<{
    skill: string;
    topic: string;
    title: string;
    provider: 'GeeksforGeeks' | 'W3Schools' | 'MDN Web Docs' | 'freeCodeCamp' | 'CS50' | 'SQLBolt' | 'Official Documentation';
    url: string;
    description: string;
  }>;
}

export interface InterviewTurn {
  id: string;
  questionText: string;
  stage: 'TECHNICAL' | 'SYSTEM_DESIGN' | 'PROJECT_DEFENSE' | 'BEHAVIORAL' | 'FOLLOW_UP';
  expectedConcepts: string[];
  candidateAnswer?: string;
  evaluation?: {
    technicalCorrectness: number;
    communication: number;
    problemSolving: number;
    structuralClarity: number;
    overallScore: number;
    feedbackText: string;
    detailedReport?: string;
    strengths: string[];
    growthAreas: string[];
  };
  followUpPrompt?: string;
}
