/**
 * LEARN-2-HIRE 2.0: CAREER-AWARE PRACTICE ARENA CORE TYPES
 * Scoped data structures for role practice blueprints, challenge environments,
 * and skill evidence logging.
 */

export type PracticeEnvironment =
  | 'CodeExecutionEnvironment'
  | 'SQLExecutionEnvironment'
  | 'WebPreviewEnvironment'
  | 'PythonDataEnvironment'
  | 'MLExecutionEnvironment'
  | 'DevOpsSimulationEnvironment'
  | 'SecurityLabEnvironment'
  | 'CaseStudyEnvironment'
  | 'DesignEvaluationEnvironment'
  | 'MarketingSimulationEnvironment'
  | 'RecruitmentSimulationEnvironment'
  | 'AptitudeEvaluationEnvironment';

export type PracticeEvaluationType =
  | 'AUTOMATED_TESTS'
  | 'SQL_RESULT'
  | 'HEURISTIC_RUBRIC'
  | 'SCENARIO_ANALYSIS'
  | 'DEFENSIVE_VERIFICATION'
  | 'MULTIPLE_CHOICE';

export type PracticeDifficulty =
  | 'BEGINNER'
  | 'EASY'
  | 'MEDIUM'
  | 'HARD'
  | 'VERY_HARD'
  | 'EXPERT';

export interface PracticeCategory {
  id: string;
  careerRoleSlug: string;
  careerRoleId: string;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  environment: PracticeEnvironment;
  evaluationType: PracticeEvaluationType;
  skillNames: string[];
  difficultyRange: [PracticeDifficulty, PracticeDifficulty];
  displayOrder: number;
  isActive: boolean;
  freeLearningUrl: string;
  freeLearningProvider: string;
  challengeCount?: number;
  userCompletedCount?: number;
  userBestScore?: number;
  userSkillLevel?: string;
  routeHref?: string;
}

export interface PracticeTestCase {
  id?: string;
  name: string;
  input?: string;
  expectedOutput?: string;
  isHidden?: boolean;
  testExpression?: string;
}

export interface PracticeScenarioOption {
  id: string;
  text: string;
  rationale: string;
  isOptimal?: boolean;
  points: number;
}

export interface PracticeChallenge {
  id: string;
  careerRoleSlug: string;
  careerRoleId: string;
  categoryId: string;
  categoryTitle: string;
  skillName: string;
  competencyId?: string;
  title: string;
  description: string;
  challengeType: string;
  difficulty: PracticeDifficulty;
  targetLevel: 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  environment: PracticeEnvironment;
  evaluationType: PracticeEvaluationType;
  questionFamily: string;
  variantGroupId: string;
  expectedTimeMinutes: number;
  sourceType: string;
  sourceName: string;
  sourceUrl: string;
  normalizedHash: string;
  starterCode?: string;
  solutionCode?: string;
  testCases?: PracticeTestCase[];
  scenarioPrompt?: string;
  scenarioOptions?: PracticeScenarioOption[];
  rubric?: Array<{ criterion: string; weight: number }>;
  hints?: string[];
  status: 'ACTIVE' | 'DRAFT';
  createdAt?: string;
  updatedAt?: string;
}

export interface PracticeAttempt {
  id: string;
  userId: string;
  careerRoleId: string;
  careerRoleSlug: string;
  categoryId: string;
  challengeId: string;
  challengeTitle: string;
  startedAt: string;
  completedAt?: string;
  score: number;
  status: 'PASSED' | 'FAILED' | 'IN_PROGRESS';
  executionTimeMs?: number;
  executionResult?: any;
  skillEvidence?: {
    skill: string;
    level: string;
    score: number;
    confidence: number;
    careerRoleId: string;
    timestamp: string;
  };
}

export interface RolePracticeBlueprint {
  careerRoleId: string;
  careerRoleSlug: string;
  careerRoleTitle: string;
  tagline: string;
  subtitle: string;
  categories: PracticeCategory[];
  totalChallenges: number;
}

export interface PracticeCategoryProgress {
  categoryId: string;
  totalChallenges: number;
  completedChallenges: number;
  bestScore: number;
  skillLevel: string;
  progressPercent: number;
}
