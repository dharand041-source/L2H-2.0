/**
 * LEARN-2-HIRE 2.0: ADAPTIVE CAREER ENTRY & DIAGNOSTIC CALIBRATION ENGINE
 * Dynamically selects calibrated items based on candidate starting signals
 * and adjusts difficulty without cross-role contamination or repetitive items.
 */

import {
  AssessmentQuestion,
  DynamicAssessmentBlueprint,
  EvaluationResult,
  UserHistoryRecord,
  CandidateEntryLevel,
  CalibrationAnswers,
  AssessmentDifficulty,
} from './question-types';
import { UNIVERSAL_QUESTION_BANK } from './universal-bank';
import { filterEligibleQuestions } from './anti-repetition';
import { getCareerBySlug } from '../data/careers-data';

/**
 * Calculates initial entry level calibration signal from self-reported answers.
 * Note: This only sets the starting point of adaptive question selection.
 * Actual demonstrated performance determines final baseline skill levels.
 */
export function calculateInitialEntryLevel(answers?: Partial<CalibrationAnswers>): {
  entryLevel: CandidateEntryLevel;
  confidence: number;
} {
  if (!answers) {
    return { entryLevel: 'BEGINNER', confidence: 0.8 };
  }

  const { priorStudy, learningDuration, builtProjects, workedProfessionally, techComfort } = answers;

  // Professional signal: verified industry experience or advanced track
  if (
    workedProfessionally ||
    learningDuration === 'professional' ||
    priorStudy === 'professional' ||
    (builtProjects && techComfort === 'advanced' && learningDuration === 'over_1_year')
  ) {
    return { entryLevel: 'PROFESSIONAL', confidence: 0.85 };
  }

  // Beginner signal: zero prior background, fresh learner, very new
  if (
    priorStudy === 'none' ||
    learningDuration === 'not_yet' ||
    (!builtProjects && !workedProfessionally && (techComfort === 'very_new' || techComfort === 'beginner'))
  ) {
    return { entryLevel: 'BEGINNER', confidence: 0.9 };
  }

  // Amateur / intermediate default
  return { entryLevel: 'AMATEUR', confidence: 0.8 };
}

/**
 * Difficulty level helper mapping numeric order
 */
export const DIFFICULTY_ORDER: AssessmentDifficulty[] = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'];
export const LABEL_DIFFICULTY_ORDER = ['EASY', 'MEDIUM', 'HARD', 'VERY_HARD'] as const;

export function difficultyToNumeric(diff: string): number {
  switch (diff?.toUpperCase()) {
    case 'L0': return 0;
    case 'L1':
    case 'EASY': return 1;
    case 'L2':
    case 'MEDIUM': return 2;
    case 'L3': return 3;
    case 'L4':
    case 'HARD': return 4;
    case 'L5':
    case 'VERY_HARD': return 5;
    default: return 2;
  }
}

export function numericToDifficulty(num: number): AssessmentDifficulty {
  const bounded = Math.max(0, Math.min(5, Math.round(num)));
  return DIFFICULTY_ORDER[bounded];
}

/**
 * Micro-adaptation difficulty stepping on streaks.
 * Flexibly accepts and maintains either L0-L5 or EASY/MEDIUM/HARD/VERY_HARD notation.
 */
export function adaptDifficulty(
  currentDifficulty: string,
  correctStreak: number,
  incorrectStreak: number
): any {
  const upper = currentDifficulty?.toUpperCase() || 'L2';

  // If using EASY / MEDIUM / HARD / VERY_HARD label notation
  if (['EASY', 'MEDIUM', 'HARD', 'VERY_HARD'].includes(upper)) {
    const labels = ['EASY', 'MEDIUM', 'HARD', 'VERY_HARD'];
    const curIdx = labels.indexOf(upper);

    if (correctStreak >= 2) {
      return labels[Math.min(labels.length - 1, curIdx + 1)];
    }
    if (incorrectStreak >= 2) {
      return labels[Math.max(0, curIdx - 1)];
    }
    return upper;
  }

  // Otherwise, use L0 - L5 standard ladder
  const currentNum = difficultyToNumeric(upper);
  if (correctStreak >= 2) {
    return numericToDifficulty(currentNum + 1);
  }
  if (incorrectStreak >= 2) {
    return numericToDifficulty(currentNum - 1);
  }
  return upper as AssessmentDifficulty;
}

/**
 * Builds an adaptive assessment session matching candidate's entry level
 * and role blueprint, enforcing anti-repetition and zero role contamination.
 */
export function buildAssessmentSession(
  blueprint: DynamicAssessmentBlueprint,
  userHistory: UserHistoryRecord[] = [],
  entryLevel: CandidateEntryLevel = 'AMATEUR'
): AssessmentQuestion[] {
  const sessionQuestions: AssessmentQuestion[] = [];
  const roleSlug = blueprint.careerRoleSlug;

  // Filter pool strictly restricted to current role or universal aptitude/reasoning
  const rolePool = UNIVERSAL_QUESTION_BANK.filter(
    (q) =>
      q.careerRoleSlug === roleSlug ||
      q.careerRoleSlug === 'universal' ||
      q.questionType === 'APTITUDE' ||
      q.questionType === 'LOGICAL_REASONING' ||
      q.questionType === 'VERBAL_REASONING'
  );

  // Determine allowed difficulty envelope based on candidate calibration
  let targetDifficulties: AssessmentDifficulty[];
  switch (entryLevel) {
    case 'BEGINNER':
      // Novice learners start at L0 / L1 and progress up to L2
      targetDifficulties = ['L0', 'L1', 'L2'];
      break;
    case 'PROFESSIONAL':
      // Experienced developers start at L3 / L4 and progress to L5
      targetDifficulties = ['L3', 'L4', 'L5', 'L2'];
      break;
    case 'AMATEUR':
    default:
      // Applied intermediate learners test L1 to L3
      targetDifficulties = ['L1', 'L2', 'L3'];
      break;
  }

  // 1. Process blueprint distributions with difficulty alignment
  for (const requirement of blueprint.distribution) {
    let needed = requirement.count;

    const skillCandidates = rolePool.filter((q) => {
      // Aptitude / Reasoning checks
      if (requirement.skillName === 'Quantitative Reasoning') {
        return q.questionType === 'APTITUDE' || q.skillName === 'Quantitative Reasoning';
      }
      if (requirement.skillName === 'Logical Reasoning') {
        return q.questionType === 'LOGICAL_REASONING' || q.skillName === 'Logical Reasoning';
      }
      if (requirement.skillName === 'Verbal Reasoning') {
        return q.questionType === 'VERBAL_REASONING' || q.skillName === 'Verbal Reasoning';
      }

      // Role-specific matching
      const roleMatches = q.careerRoleSlug === roleSlug;
      const skillMatches =
        q.skillName.toLowerCase() === requirement.skillName.toLowerCase() ||
        q.competency.toLowerCase().includes(requirement.skillName.toLowerCase()) ||
        requirement.skillName.toLowerCase().includes(q.skillName.toLowerCase());

      return roleMatches && skillMatches;
    });

    // Sort by preferred entry difficulty
    const prioritized = [...skillCandidates].sort((a, b) => {
      const aIndex = targetDifficulties.indexOf(a.difficulty);
      const bIndex = targetDifficulties.indexOf(b.difficulty);
      const aScore = aIndex >= 0 ? aIndex : 99;
      const bScore = bIndex >= 0 ? bIndex : 99;
      return aScore - bScore;
    });

    const filterResult = filterEligibleQuestions(prioritized, userHistory, sessionQuestions, {
      familyCooldownLimit: 3,
      maxQuestionsPerTopic: 2,
    });

    const picked = filterResult.eligibleQuestions.slice(0, needed);
    sessionQuestions.push(...picked);
    needed -= picked.length;

    // Fallback within same role pool if pool constrained
    if (needed > 0) {
      const fallbackPool = rolePool.filter((q) => !sessionQuestions.some((sq) => sq.id === q.id));
      const fallbackFilter = filterEligibleQuestions(fallbackPool, userHistory, sessionQuestions);
      const fallbackPicked = fallbackFilter.eligibleQuestions.slice(0, needed);
      sessionQuestions.push(...fallbackPicked);
    }
  }

  // Ensure minimum balanced questions (at least 5) strictly from role/universal pool
  if (sessionQuestions.length < 5) {
    const remaining = rolePool.filter((q) => !sessionQuestions.some((sq) => sq.id === q.id));
    sessionQuestions.push(...remaining.slice(0, 5 - sessionQuestions.length));
  }

  // Hard firewall: Guarantee zero cross-role contamination
  const validatedQuestions = sessionQuestions.filter(
    (q) =>
      q.careerRoleSlug === roleSlug ||
      q.careerRoleSlug === 'universal' ||
      q.questionType === 'APTITUDE' ||
      q.questionType === 'LOGICAL_REASONING' ||
      q.questionType === 'VERBAL_REASONING'
  );

  return validatedQuestions;
}

/**
 * Evaluates candidate responses against correct answers, calculates weighted accuracy,
 * determines calibrated skill levels from L0 to L5, and maps priority gaps.
 */
export function evaluateAssessmentSession(
  questions: AssessmentQuestion[],
  answers: Record<string, string>,
  targetRoleSlug: string,
  entryLevel: CandidateEntryLevel = 'AMATEUR'
): EvaluationResult {
  const role = getCareerBySlug(targetRoleSlug);
  let correctCount = 0;
  let totalWeight = 0;
  let earnedWeight = 0;
  const totalQuestions = Math.max(questions.length, 1);

  // Group performance by skill
  const skillPerformance: Record<
    string,
    { total: number; correct: number; maxCorrectDiff: AssessmentDifficulty; attemptedDiffs: AssessmentDifficulty[] }
  > = {};

  questions.forEach((q) => {
    const isCorrect = answers[q.id] === q.correctAnswer;
    if (isCorrect) correctCount++;

    // Weighted scoring based on question difficulty
    const diffNum = difficultyToNumeric(q.difficulty);
    const weight = 1 + diffNum * 0.5; // L0=1.0, L1=1.5, L2=2.0, L3=2.5, L4=3.0, L5=3.5
    totalWeight += weight;
    if (isCorrect) earnedWeight += weight;

    const skill = q.skillName || 'General';
    if (!skillPerformance[skill]) {
      skillPerformance[skill] = { total: 0, correct: 0, maxCorrectDiff: 'L0', attemptedDiffs: [] };
    }
    skillPerformance[skill].total += 1;
    skillPerformance[skill].attemptedDiffs.push(q.difficulty);

    if (isCorrect) {
      skillPerformance[skill].correct += 1;
      if (diffNum > difficultyToNumeric(skillPerformance[skill].maxCorrectDiff)) {
        skillPerformance[skill].maxCorrectDiff = q.difficulty;
      }
    }
  });

  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const weightedScore = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : accuracy;
  const score = weightedScore;

  // Determine overall demonstrated level
  let demonstratedLevel: AssessmentDifficulty = 'L1';
  if (score >= 90) demonstratedLevel = 'L4';
  else if (score >= 75) demonstratedLevel = 'L3';
  else if (score >= 55) demonstratedLevel = 'L2';
  else if (score >= 35) demonstratedLevel = 'L1';
  else demonstratedLevel = 'L0';

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const skillBreakdown: EvaluationResult['skillBreakdown'] = [];

  // Determine calibrated level for each role skill
  const requiredSkills = role?.requiredSkills || [
    { name: 'JavaScript', level: 'L4' },
    { name: 'React', level: 'L3' },
    { name: 'Node.js', level: 'L3' },
    { name: 'SQL & Relational DBs', level: 'L3' },
  ];

  requiredSkills.forEach((req) => {
    const perf = skillPerformance[req.name];
    let calibratedLevel: AssessmentDifficulty = 'L1';
    let skillScore = 50;

    if (perf && perf.total > 0) {
      const ratio = perf.correct / perf.total;
      skillScore = Math.round(ratio * 100);
      if (ratio >= 0.8) {
        calibratedLevel = perf.maxCorrectDiff !== 'L0' ? perf.maxCorrectDiff : 'L3';
        strengths.push(`Solid demonstration of ${req.name} (${calibratedLevel})`);
      } else if (ratio >= 0.5) {
        calibratedLevel = 'L2';
      } else {
        calibratedLevel = ratio > 0 ? 'L1' : 'L0';
        weaknesses.push(`Foundational gaps identified in ${req.name}`);
      }
    } else {
      // Skill not directly sampled in this subset; extrapolate based on overall score
      calibratedLevel = score >= 75 ? 'L2' : 'L1';
    }

    const curNum = difficultyToNumeric(calibratedLevel);
    const reqNum = difficultyToNumeric(req.level as AssessmentDifficulty);
    const gap = Math.max(0, reqNum - curNum);

    skillBreakdown.push({
      skillName: req.name,
      level: calibratedLevel,
      score: skillScore,
      targetLevel: req.level as AssessmentDifficulty,
      gap,
      priority: gap === 0 ? 'SATISFIED' : gap >= 2 ? 'CRITICAL' : 'HIGH',
    });
  });

  // Free Educational Resources mapping
  const recommendedResources: EvaluationResult['recommendedResources'] = [
    {
      skill: 'Core Foundations',
      topic: 'Web & Programming Basics',
      title: 'W3Schools: Web Development Fundamentals',
      provider: 'W3Schools',
      url: 'https://www.w3schools.com/',
      description: 'Hands-on beginner exercises explaining HTML, CSS, JavaScript, SQL, and Python with live browser editors.',
    },
    {
      skill: 'JavaScript',
      topic: 'Closures & Scoping',
      title: 'MDN Web Docs: Closures in Depth',
      provider: 'MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
      description: 'Master lexical scoping, function factories, and memory lifecycle without paywalls.',
    },
    {
      skill: 'SQL & Relational DBs',
      topic: 'SQL Joins & Indexes',
      title: 'W3Schools: SQL JOIN Operations',
      provider: 'W3Schools',
      url: 'https://www.w3schools.com/sql/sql_join.asp',
      description: 'Interactive browser exercises explaining INNER, LEFT, RIGHT, and FULL outer joins.',
    },
    {
      skill: 'React',
      topic: 'Hooks & Component Lifecycle',
      title: 'freeCodeCamp: React Hooks Interactive Guide',
      provider: 'freeCodeCamp',
      url: 'https://www.freecodecamp.org/news/react-hooks-fundamentals/',
      description: 'Hands-on tutorials explaining useState, useEffect dependency graphs, and custom hooks.',
    },
    {
      skill: 'Quantitative & Logical Reasoning',
      topic: 'Time and Work & Series Patterns',
      title: 'GeeksforGeeks: Aptitude Preparation Tracks',
      provider: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/aptitude-questions-and-answers/',
      description: 'Free comprehensive problem sets with step-by-step mathematical explanations.',
    },
  ];

  return {
    score,
    weightedScore,
    entryLevel,
    demonstratedLevel,
    passed: score >= 60,
    accuracy,
    totalQuestions,
    correctCount,
    skillBreakdown,
    strengths: strengths.length > 0 ? strengths : ['Basic algorithmic logic intact'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['Advanced asynchronous edge cases require reinforcement'],
    recommendedResources,
  };
}
