/**
 * LEARN-2-HIRE 2.0: DATA-DRIVEN PERSONALIZED ROADMAP ENGINE
 * 
 * Dynamically computes career-specific, skill-dependent roadmaps strictly adhering to:
 * - Direct DAG prerequisite enforcement (no advanced nodes before foundational mastery)
 * - Honest L0-L5 level calculation (Target Level - Current Level)
 * - Automatic personalization across Beginner, Amateur, and Professional candidate modes
 * - Real educational resources with verified provenance
 * - Daily Next Best Action decisioning
 * - Role-scoped caching & stale response protection
 */

import {
  CareerRoadmap,
  GenerateRoadmapOptions,
  NextBestAction,
  RoadmapNode,
  RoadmapNodeStatus,
  RoadmapPhase,
  RoadmapPhaseId,
  WeeklyRoadmapWeek,
  DependencyGraphEdge,
  DependencyGraphNode
} from './roadmap-types';
import { CAREER_BLUEPRINTS, getCareerBlueprint, StageTemplate } from './roadmap-blueprints';
import { getRoleUuid } from '../data/state-store';

const LEVEL_NUMERIC_MAP: Record<string, number> = {
  L0: 0,
  L1: 1,
  L2: 2,
  L3: 3,
  L4: 4,
  L5: 5
};

const NUMERIC_TO_LEVEL: Record<number, 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5'> = {
  0: 'L0',
  1: 'L1',
  2: 'L2',
  3: 'L3',
  4: 'L4',
  5: 'L5'
};

const CANONICAL_PHASES: Array<{
  id: RoadmapPhaseId;
  phaseNumber: number;
  title: string;
  shortTitle: string;
  description: string;
}> = [
  {
    id: 'PHASE_01_FOUNDATIONS',
    phaseNumber: 1,
    title: 'Phase 01: Foundations & Systems',
    shortTitle: 'Foundations',
    description: 'Core computational fundamentals, architecture, and baseline toolkits.'
  },
  {
    id: 'PHASE_02_CORE_SKILLS',
    phaseNumber: 2,
    title: 'Phase 02: Core Fundamentals',
    shortTitle: 'Core Skills',
    description: 'Essential domain programming languages, frameworks, and syntax standards.'
  },
  {
    id: 'PHASE_03_APPLIED_PRACTICE',
    phaseNumber: 3,
    title: 'Phase 03: Applied Engineering Practice',
    shortTitle: 'Applied Practice',
    description: 'Component architecture, data persistence, and interactive sandboxes.'
  },
  {
    id: 'PHASE_04_ADVANCED_SKILLS',
    phaseNumber: 4,
    title: 'Phase 04: Advanced Systems & Reliability',
    shortTitle: 'Advanced Skills',
    description: 'Scalability, automated testing, security defense, and observability.'
  },
  {
    id: 'PHASE_05_PROJECT_PROOF',
    phaseNumber: 5,
    title: 'Phase 05: Real-World Capstone Project',
    shortTitle: 'Project Proof',
    description: 'Production-grade software synthesis backed by public GitHub evidence.'
  },
  {
    id: 'PHASE_06_INTERVIEW_READINESS',
    phaseNumber: 6,
    title: 'Phase 06: Technical Interview Preparation',
    shortTitle: 'Interview Prep',
    description: 'Simulated technical defense, system design, and live problem solving.'
  },
  {
    id: 'PHASE_07_JOB_READINESS',
    phaseNumber: 7,
    title: 'Phase 07: Job Market Alignment',
    shortTitle: 'Job Readiness',
    description: 'ATS resume keyword verification, portfolio proof, and job matching.'
  },
  {
    id: 'PHASE_08_CONTINUOUS_IMPROVEMENT',
    phaseNumber: 8,
    title: 'Phase 08: Verified Competency & Loop',
    shortTitle: 'Improvement',
    description: 'Diagnostic reassessment, L4 verification, and continuous improvement.'
  }
];

/**
 * Generate role-scoped cache key to prevent cross-candidate or cross-role leaks.
 */
export function getRoadmapCacheKey(userId: string, careerRoleId: string): string {
  return `roadmap:${userId || 'anon'}:${careerRoleId}`;
}

/**
 * Main Roadmap Generation Engine
 */
export function generateCareerRoadmap(options: GenerateRoadmapOptions): CareerRoadmap {
  const {
    targetRoleSlug,
    userSkills = [],
    assessmentScore,
    completedNodeIds = [],
    searchQuery = '',
    phaseFilter,
    statusFilter,
    typeFilter
  } = options;

  const blueprint = getCareerBlueprint(targetRoleSlug);
  const careerRoleId = getRoleUuid(blueprint.slug);
  const isAssessed = assessmentScore !== undefined && assessmentScore > 0;

  // 1. Build lookup map of user verified skill levels
  const userSkillMap = new Map<string, { currentLevel: string; requiredLevel: string; gap: number }>();
  userSkills.forEach((us) => {
    if (us.name) {
      userSkillMap.set(us.name.toLowerCase().trim(), {
        currentLevel: us.currentLevel || 'L0',
        requiredLevel: us.requiredLevel || 'L4',
        gap: us.gap !== undefined ? us.gap : 0
      });
    }
  });

  // Determine candidate mode based on assessment & verified skills
  let userMode: 'BEGINNER' | 'AMATEUR' | 'PROFESSIONAL' = 'BEGINNER';
  const assessedSkills = Array.from(userSkillMap.values());
  const maxVerifiedNum = assessedSkills.reduce((max, s) => Math.max(max, LEVEL_NUMERIC_MAP[s.currentLevel] || 0), 0);

  if (isAssessed && (assessmentScore >= 75 || maxVerifiedNum >= 3)) {
    userMode = 'PROFESSIONAL';
  } else if (isAssessed && (assessmentScore >= 45 || maxVerifiedNum >= 2)) {
    userMode = 'AMATEUR';
  } else {
    userMode = 'BEGINNER';
  }

  // 2. Track completed and satisfied skills for prerequisite graph evaluation
  const completedNodesSet = new Set<string>(completedNodeIds);
  const satisfiedSkillsSet = new Set<string>();

  // If candidate has verified skills, populate satisfied skills
  userSkillMap.forEach((entry, skillKey) => {
    if ((LEVEL_NUMERIC_MAP[entry.currentLevel] || 0) >= 2) {
      satisfiedSkillsSet.add(skillKey);
    }
  });

  // 3. Process blueprint stages into Roadmap Nodes with prerequisite locking
  const rawNodes: RoadmapNode[] = [];
  let totalHours = 0;
  let criticalGaps = 0;

  blueprint.stages.forEach((stage: StageTemplate) => {
    const nodeId = `node-${blueprint.slug}-${stage.idSuffix}`;
    const normalizedSkill = stage.skillName.toLowerCase().trim();

    // Check user's current verified level for this skill
    const userSkillEntry = userSkillMap.get(normalizedSkill);
    let curLevelStr = userSkillEntry ? userSkillEntry.currentLevel : 'L0';

    // If candidate has completed this node manually, mark as completed
    const isManuallyCompleted = completedNodesSet.has(nodeId);

    // If amateur or professional, foundations might be satisfied
    if (!userSkillEntry && userMode === 'PROFESSIONAL' && stage.phaseId === 'PHASE_01_FOUNDATIONS') {
      curLevelStr = 'L3';
    } else if (!userSkillEntry && userMode === 'AMATEUR' && stage.phaseId === 'PHASE_01_FOUNDATIONS') {
      curLevelStr = 'L2';
    }

    const curNum = LEVEL_NUMERIC_MAP[curLevelStr] ?? 0;
    const tgtNum = LEVEL_NUMERIC_MAP[stage.targetLevel] ?? 3;
    const gap = Math.max(0, tgtNum - curNum);

    if (gap >= 2) {
      criticalGaps++;
    }

    // Check prerequisites
    const unmetPrerequisites: string[] = [];
    stage.prerequisites.forEach((prereq) => {
      const normPrereq = prereq.toLowerCase().trim();
      const prereqSkillEntry = userSkillMap.get(normPrereq);
      const prereqNum = prereqSkillEntry ? LEVEL_NUMERIC_MAP[prereqSkillEntry.currentLevel] || 0 : 0;
      
      const isPrereqNodeCompleted = rawNodes.some(
        (n) => n.skillName.toLowerCase().trim() === normPrereq && (n.isCompleted || completedNodesSet.has(n.id))
      );

      const isSatisfied = prereqNum >= 2 || isPrereqNodeCompleted || satisfiedSkillsSet.has(normPrereq);
      if (!isSatisfied) {
        unmetPrerequisites.push(prereq);
      }
    });

    const isPrerequisitesMet = unmetPrerequisites.length === 0;

    // Status evaluation
    let status: RoadmapNodeStatus = 'LOCKED';
    let isCompleted = false;

    if (isManuallyCompleted || (curNum >= tgtNum && isPrerequisitesMet)) {
      status = 'COMPLETED';
      isCompleted = true;
      satisfiedSkillsSet.add(normalizedSkill);
    } else if (!isPrerequisitesMet) {
      status = 'LOCKED';
    } else {
      // Prerequisites are satisfied and gap exists
      if (gap > 0) {
        status = 'AVAILABLE';
      } else {
        status = 'COMPLETED';
        isCompleted = true;
        satisfiedSkillsSet.add(normalizedSkill);
      }
    }

    // Connect to practice arena URL if category slug exists
    const practiceUrl = stage.practiceCategorySlug
      ? `/app/practice/role?category=${stage.practiceCategorySlug}`
      : `/app/practice/role`;

    // Connect to capstone project URL
    const projectUrl = stage.projectTitle
      ? `/app/projects`
      : undefined;

    const node: RoadmapNode = {
      id: nodeId,
      careerRoleSlug: blueprint.slug,
      careerRoleId,
      phaseId: stage.phaseId,
      phaseTitle: stage.phaseTitle,
      stageOrder: stage.stageOrder,
      skillName: stage.skillName,
      competencyDomain: stage.competencyDomain,
      nodeType: stage.nodeType,
      title: stage.title,
      description: stage.description,
      currentLevel: (NUMERIC_TO_LEVEL[curNum] || 'L0'),
      targetLevel: stage.targetLevel,
      levelUpgrade: `${NUMERIC_TO_LEVEL[curNum] || 'L0'} → ${stage.targetLevel}`,
      gap,
      status,
      prerequisites: stage.prerequisites,
      estimatedHours: stage.estimatedHours,
      why: stage.why,
      what: stage.what,
      how: stage.how,
      practice: stage.practice,
      prove: stage.prove,
      next: stage.next,
      practiceUrl,
      practiceTitle: stage.practiceTitle,
      projectUrl,
      projectTitle: stage.projectTitle,
      proofCriteria: stage.proofCriteria,
      resources: stage.resources,
      isCompleted
    };

    totalHours += stage.estimatedHours;
    rawNodes.push(node);
  });

  // 4. Mark single top-priority AVAILABLE node as RECOMMENDED (Next Best Action)
  let recommendedNode: RoadmapNode | undefined = undefined;
  for (const n of rawNodes) {
    if (n.status === 'AVAILABLE' && n.gap > 0) {
      n.status = 'RECOMMENDED';
      recommendedNode = n;
      break;
    }
  }

  // If all nodes completed or no available gap, recommend capstone or reassessment
  if (!recommendedNode) {
    const uncompleted = rawNodes.find((n) => n.status !== 'COMPLETED' && n.status !== 'LOCKED');
    if (uncompleted) {
      uncompleted.status = 'RECOMMENDED';
      recommendedNode = uncompleted;
    } else {
      recommendedNode = rawNodes[0];
    }
  }

  // 5. Construct Next Best Action structure (Step 25)
  const availableAlternatives = rawNodes.filter(
    (n) => n.id !== recommendedNode?.id && (n.status === 'AVAILABLE' || n.status === 'IN_PROGRESS')
  ).slice(0, 3);

  const nextBestAction: NextBestAction = {
    primaryAction: recommendedNode || rawNodes[0],
    whyThisAction: `Your current verified level in ${recommendedNode?.skillName || 'this module'} is ${recommendedNode?.currentLevel || 'L0'}, whereas ${blueprint.title} requires ${recommendedNode?.targetLevel || 'L4'} with all prior prerequisites satisfied.`,
    estimatedMinutes: (recommendedNode?.estimatedHours || 4) * 60,
    urgency: recommendedNode?.gap && recommendedNode.gap >= 2 ? 'IMMEDIATE' : 'NEXT_UP',
    alternatives: availableAlternatives
  };

  // 6. Calculate real overall roadmap progress percent
  const completedCount = rawNodes.filter((n) => n.isCompleted || n.status === 'COMPLETED').length;
  const progressPercent = rawNodes.length > 0
    ? Math.round((completedCount / rawNodes.length) * 100)
    : 0;

  // 7. Group nodes into Canonical Phases
  const phases: RoadmapPhase[] = CANONICAL_PHASES.map((p) => {
    const phaseNodes = rawNodes.filter((n) => n.phaseId === p.id);
    const completedPhaseNodes = phaseNodes.filter((n) => n.isCompleted || n.status === 'COMPLETED').length;
    const isUnlocked = phaseNodes.some((n) => n.status !== 'LOCKED');

    return {
      id: p.id,
      phaseNumber: p.phaseNumber,
      title: p.title,
      shortTitle: p.shortTitle,
      description: p.description,
      nodes: phaseNodes,
      completedCount: completedPhaseNodes,
      totalCount: phaseNodes.length,
      isUnlocked
    };
  });

  // 8. Generate Weekly Plan (Step 24)
  const weeklyPlan: WeeklyRoadmapWeek[] = [];
  let currentWeekNodes: RoadmapNode[] = [];
  let currentWeekHours = 0;
  let weekCounter = 1;

  rawNodes.forEach((node) => {
    currentWeekNodes.push(node);
    currentWeekHours += node.estimatedHours;

    if (currentWeekHours >= 12 || node.phaseId === 'PHASE_05_PROJECT_PROOF') {
      weeklyPlan.push({
        weekNumber: weekCounter,
        title: `Week ${weekCounter}: ${currentWeekNodes[0]?.skillName} & Applications`,
        focusDomain: currentWeekNodes[0]?.competencyDomain || 'Core Domain',
        targetHours: currentWeekHours,
        nodes: [...currentWeekNodes]
      });
      weekCounter++;
      currentWeekNodes = [];
      currentWeekHours = 0;
    }
  });

  if (currentWeekNodes.length > 0) {
    weeklyPlan.push({
      weekNumber: weekCounter,
      title: `Week ${weekCounter}: Advanced Synthesis & Verification`,
      focusDomain: currentWeekNodes[0]?.competencyDomain || 'Verification',
      targetHours: Math.max(currentWeekHours, 4),
      nodes: currentWeekNodes
    });
  }

  // 9. Generate Dependency Graph (Step 46)
  const graphNodes: DependencyGraphNode[] = rawNodes.map((n) => ({
    id: n.id,
    label: n.skillName,
    phaseId: n.phaseId,
    status: n.status,
    level: n.targetLevel,
    gap: n.gap
  }));

  const graphEdges: DependencyGraphEdge[] = [];
  rawNodes.forEach((node) => {
    node.prerequisites.forEach((prereq) => {
      const sourceNode = rawNodes.find((n) => n.skillName.toLowerCase().trim() === prereq.toLowerCase().trim());
      if (sourceNode) {
        graphEdges.push({
          source: sourceNode.id,
          target: node.id,
          relation: 'PREREQUISITE'
        });
      }
    });
  });

  // 10. Filter nodes if search or filters are specified
  let filteredPhases = phases;
  if (searchQuery || phaseFilter || statusFilter || typeFilter) {
    const query = (searchQuery || '').toLowerCase().trim();
    filteredPhases = phases.map((phase) => {
      if (phaseFilter && phaseFilter !== 'ALL' && phase.id !== phaseFilter) {
        return { ...phase, nodes: [] };
      }

      const matchingNodes = phase.nodes.filter((node) => {
        if (query) {
          const matchTitle = node.title.toLowerCase().includes(query);
          const matchSkill = node.skillName.toLowerCase().includes(query);
          const matchDesc = node.description.toLowerCase().includes(query);
          if (!matchTitle && !matchSkill && !matchDesc) return false;
        }

        if (statusFilter && statusFilter !== 'ALL') {
          if (statusFilter === 'AVAILABLE' && node.status !== 'AVAILABLE' && node.status !== 'RECOMMENDED') return false;
          if (statusFilter === 'COMPLETED' && node.status !== 'COMPLETED') return false;
          if (statusFilter === 'LOCKED' && node.status !== 'LOCKED') return false;
          if (statusFilter === 'SKILL_GAP' && node.gap <= 0) return false;
        }

        if (typeFilter && typeFilter !== 'ALL') {
          if (node.nodeType !== typeFilter) return false;
        }

        return true;
      });

      return {
        ...phase,
        nodes: matchingNodes
      };
    });
  }

  return {
    careerRoleSlug: blueprint.slug,
    careerRoleId,
    targetRoleTitle: blueprint.title,
    roadmapVersion: blueprint.roadmapVersion,
    sourceVersion: blueprint.sourceVersion,
    lastVerifiedAt: blueprint.lastVerifiedAt,
    currentLevelSummary: userMode === 'PROFESSIONAL' ? 'L3 / Intermediate Systems' : userMode === 'AMATEUR' ? 'L2 / Applied Beginner' : 'L0-L1 / Fundamentals',
    targetLevelSummary: 'L4 / Industry Professional',
    readinessScore: assessmentScore !== undefined ? assessmentScore : Math.min(progressPercent, 50),
    progressPercent,
    userMode,
    isAssessed,
    totalNodes: rawNodes.length,
    completedNodes: completedCount,
    estimatedTotalHours: totalHours,
    criticalGapsCount: criticalGaps,
    phases: filteredPhases,
    nextBestAction,
    weeklyPlan,
    dependencyGraph: {
      nodes: graphNodes,
      edges: graphEdges
    }
  };
}
