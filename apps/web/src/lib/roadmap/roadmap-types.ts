/**
 * LEARN-2-HIRE 2.0: ROADMAP ENGINE TYPE DEFINITIONS
 * 
 * Strict data contract for career-specific, skill-dependent, personalized roadmaps.
 * Supports all 12 platform career roles, L0-L5 progression, prerequisite DAGs,
 * verified educational resource provenance, and closed-loop platform integration.
 */

export type RoadmapNodeType =
  | 'LEARN'
  | 'READ'
  | 'WATCH'
  | 'PRACTICE'
  | 'CODE'
  | 'CASE_STUDY'
  | 'PROJECT'
  | 'QUIZ'
  | 'ASSESSMENT'
  | 'INTERVIEW'
  | 'RESOURCE'
  | 'REASSESSMENT'
  | 'PROOF';

export type RoadmapNodeStatus =
  | 'LOCKED'
  | 'AVAILABLE'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'SKIPPED'
  | 'RECOMMENDED'
  | 'REASSESSMENT_REQUIRED';

export type RoadmapPhaseId =
  | 'PHASE_01_FOUNDATIONS'
  | 'PHASE_02_CORE_SKILLS'
  | 'PHASE_03_APPLIED_PRACTICE'
  | 'PHASE_04_ADVANCED_SKILLS'
  | 'PHASE_05_PROJECT_PROOF'
  | 'PHASE_06_INTERVIEW_READINESS'
  | 'PHASE_07_JOB_READINESS'
  | 'PHASE_08_CONTINUOUS_IMPROVEMENT';

export type ResourceProvenanceStatus =
  | 'VERIFIED'
  | 'REFERENCE'
  | 'INDUSTRY_ALIGNED'
  | 'ORIGINAL_SYNTHESIS';

export interface RoadmapResource {
  id: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: 'DOCUMENTATION' | 'COURSE' | 'TUTORIAL' | 'VIDEO' | 'INTERACTIVE' | 'FRAMEWORK_DOCS';
  isFree: boolean;
  estimatedMinutes: number;
  difficulty: 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  lastVerifiedAt: string;
  provenanceStatus: ResourceProvenanceStatus;
  qualityScore: number;
  description: string;
}

export interface RoadmapNode {
  id: string;
  careerRoleSlug: string;
  careerRoleId: string;
  phaseId: RoadmapPhaseId;
  phaseTitle: string;
  stageOrder: number;
  skillName: string;
  competencyDomain: string;
  nodeType: RoadmapNodeType;
  title: string;
  description: string;
  currentLevel: 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  targetLevel: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  levelUpgrade: string;
  gap: number;
  status: RoadmapNodeStatus;
  prerequisites: string[]; // skill names or node IDs that must be completed/satisfied first
  estimatedHours: number;
  
  // Pedagogical 6-Question Framework (Step 50)
  why: string;      // WHY it matters in this career
  what: string;     // WHAT core concepts are covered
  how: string;      // HOW to learn using free resources
  practice: string; // WHAT to practice
  prove: string;    // HOW to prove mastery
  next: string;     // NEXT step after completion

  // Platform Integration Anchors
  practiceUrl?: string;
  practiceTitle?: string;
  projectUrl?: string;
  projectTitle?: string;
  assessmentUrl?: string;
  proofCriteria: string;

  // Educational Resources with Provenance
  resources: RoadmapResource[];
  isCompleted: boolean;
  completedAt?: string;
}

export interface RoadmapPhase {
  id: RoadmapPhaseId;
  phaseNumber: number;
  title: string;
  shortTitle: string;
  description: string;
  nodes: RoadmapNode[];
  completedCount: number;
  totalCount: number;
  isUnlocked: boolean;
}

export interface NextBestAction {
  primaryAction: RoadmapNode;
  whyThisAction: string;
  estimatedMinutes: number;
  urgency: 'IMMEDIATE' | 'NEXT_UP' | 'EXPLORATORY';
  alternatives: RoadmapNode[];
}

export interface WeeklyRoadmapWeek {
  weekNumber: number;
  title: string;
  focusDomain: string;
  targetHours: number;
  nodes: RoadmapNode[];
}

export interface DependencyGraphEdge {
  source: string; // prerequisite skill
  target: string; // dependent skill
  relation: 'PREREQUISITE' | 'RECOMMENDS';
}

export interface DependencyGraphNode {
  id: string;
  label: string;
  phaseId: RoadmapPhaseId;
  status: RoadmapNodeStatus;
  level: string;
  gap: number;
}

export interface CareerRoadmap {
  careerRoleSlug: string;
  careerRoleId: string;
  targetRoleTitle: string;
  roadmapVersion: string; // e.g. '2026.1'
  sourceVersion: string;
  lastVerifiedAt: string;
  currentLevelSummary: string;
  targetLevelSummary: string;
  readinessScore: number;
  progressPercent: number;
  userMode: 'BEGINNER' | 'AMATEUR' | 'PROFESSIONAL';
  isAssessed: boolean;
  totalNodes: number;
  completedNodes: number;
  estimatedTotalHours: number;
  criticalGapsCount: number;
  phases: RoadmapPhase[];
  nextBestAction?: NextBestAction;
  weeklyPlan: WeeklyRoadmapWeek[];
  dependencyGraph: {
    nodes: DependencyGraphNode[];
    edges: DependencyGraphEdge[];
  };
}

export interface GenerateRoadmapOptions {
  targetRoleSlug: string;
  userSkills?: Array<{
    name: string;
    currentLevel?: string;
    requiredLevel?: string;
    gap?: number;
  }>;
  assessmentScore?: number;
  completedNodeIds?: string[];
  searchQuery?: string;
  phaseFilter?: string;
  statusFilter?: string;
  typeFilter?: string;
}
