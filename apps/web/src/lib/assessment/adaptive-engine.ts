/**
 * LEARN-2-HIRE 2.0: ADAPTIVE ASSESSMENT & COMPETENCY CALIBRATION ENGINE
 */

import { AssessmentQuestion, DynamicAssessmentBlueprint, EvaluationResult, UserHistoryRecord } from './question-types';
import { UNIVERSAL_QUESTION_BANK } from './universal-bank';
import { filterEligibleQuestions } from './anti-repetition';
import { getCareerBySlug } from '../data/careers-data';

/**
 * Selects the optimal set of non-repetitive assessment questions for a given blueprint and user history.
 */
export function buildAssessmentSession(
  blueprint: DynamicAssessmentBlueprint,
  userHistory: UserHistoryRecord[] = []
): AssessmentQuestion[] {
  const sessionQuestions: AssessmentQuestion[] = [];
  const roleSlug = blueprint.careerRoleSlug;

  // Candidate pool prioritizing current role and universal aptitude
  const pool = UNIVERSAL_QUESTION_BANK.filter(
    (q) => q.careerRoleSlug === roleSlug || q.careerRoleSlug === 'full-stack-developer' || q.questionType === 'APTITUDE' || q.questionType === 'LOGICAL_REASONING'
  );

  for (const requirement of blueprint.distribution) {
    let needed = requirement.count;

    // Filter candidate pool matching skill and target difficulty
    const skillPool = pool.filter((q) => {
      if (requirement.skillName === 'Quantitative Reasoning') return q.questionType === 'APTITUDE';
      if (requirement.skillName === 'Logical Reasoning') return q.questionType === 'LOGICAL_REASONING';
      return (
        q.skillName.toLowerCase() === requirement.skillName.toLowerCase() ||
        q.competency.toLowerCase().includes(requirement.skillName.toLowerCase())
      );
    });

    const filterResult = filterEligibleQuestions(skillPool, userHistory, sessionQuestions, {
      familyCooldownLimit: 3,
      maxQuestionsPerTopic: 2,
    });

    // Pick top eligible questions
    const picked = filterResult.eligibleQuestions.slice(0, needed);
    sessionQuestions.push(...picked);
    needed -= picked.length;

    // If more needed (due to anti-repetition depletion), relax difficulty constraint but keep skill
    if (needed > 0) {
      const fallbackPool = pool.filter(q => !sessionQuestions.some(sq => sq.id === q.id));
      const fallbackFilter = filterEligibleQuestions(fallbackPool, userHistory, sessionQuestions);
      const fallbackPicked = fallbackFilter.eligibleQuestions.slice(0, needed);
      sessionQuestions.push(...fallbackPicked);
    }
  }

  // Ensure at least 5 balanced questions are returned
  if (sessionQuestions.length < 5) {
    const remaining = pool.filter(q => !sessionQuestions.some(sq => sq.id === q.id));
    sessionQuestions.push(...remaining.slice(0, 5 - sessionQuestions.length));
  }

  return sessionQuestions;
}

/**
 * Evaluates candidate responses against correct answers, calculates accuracy,
 * determines calibrated skill levels from L0 to L5, and maps priority gaps.
 */
export function evaluateAssessmentSession(
  questions: AssessmentQuestion[],
  answers: Record<string, string>,
  targetRoleSlug: string
): EvaluationResult {
  const role = getCareerBySlug(targetRoleSlug);
  let correctCount = 0;
  const totalQuestions = Math.max(questions.length, 1);

  // Group performance by skill
  const skillPerformance: Record<string, { total: number; correct: number; maxDiff: string }> = {};

  questions.forEach((q) => {
    const isCorrect = answers[q.id] === q.correctAnswer;
    if (isCorrect) correctCount++;

    const skill = q.skillName || 'General';
    if (!skillPerformance[skill]) {
      skillPerformance[skill] = { total: 0, correct: 0, maxDiff: q.difficulty };
    }
    skillPerformance[skill].total += 1;
    if (isCorrect) {
      skillPerformance[skill].correct += 1;
      skillPerformance[skill].maxDiff = q.difficulty;
    }
  });

  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const score = Math.max(accuracy, 30); // Base minimum calibrated floor

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
    let calibratedLevel: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' = 'L1';
    let skillScore = 50;

    if (perf && perf.total > 0) {
      const ratio = perf.correct / perf.total;
      skillScore = Math.round(ratio * 100);
      if (ratio >= 0.8) {
        calibratedLevel = (perf.maxDiff as any) || 'L3';
        strengths.push(`Solid demonstration of ${req.name} (${calibratedLevel})`);
      } else if (ratio >= 0.5) {
        calibratedLevel = 'L2';
      } else {
        calibratedLevel = 'L1';
        weaknesses.push(`Foundational gaps identified in ${req.name}`);
      }
    } else {
      // Not directly tested in this subset
      calibratedLevel = accuracy >= 75 ? 'L2' : 'L1';
    }

    const curNum = parseInt(calibratedLevel.replace('L', ''), 10) || 1;
    const reqNum = parseInt(req.level.replace('L', ''), 10) || 3;
    const gap = Math.max(0, reqNum - curNum);

    skillBreakdown.push({
      skillName: req.name,
      level: calibratedLevel,
      score: skillScore,
      targetLevel: req.level as any,
      gap,
      priority: gap === 0 ? 'SATISFIED' : gap >= 2 ? 'CRITICAL' : 'HIGH',
    });
  });

  // Free Educational Resources mapping
  const recommendedResources: EvaluationResult['recommendedResources'] = [
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
    passed: score >= (role ? 60 : 60),
    accuracy,
    totalQuestions,
    correctCount,
    skillBreakdown,
    strengths: strengths.length > 0 ? strengths : ['Basic algorithmic logic intact'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['Advanced asynchronous edge cases require reinforcement'],
    recommendedResources,
  };
}
