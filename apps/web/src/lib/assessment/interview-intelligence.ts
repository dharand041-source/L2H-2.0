/**
 * LEARN-2-HIRE 2.0: INTERVIEW INTELLIGENCE & DYNAMIC FOLLOW-UP ENGINE
 * Generates structured interview turns, contextual follow-ups, and rubric scoring.
 */

import { InterviewTurn } from './question-types';
import { getCareerBySlug } from '../data/careers-data';

/**
 * Generates an initial interview question set for a target career role.
 */
export function getInitialInterviewQuestions(roleSlug: string): InterviewTurn[] {
  const role = getCareerBySlug(roleSlug);
  const roleTitle = role ? role.title : 'Full-Stack Developer';

  return [
    {
      id: `int-tech-1-${roleSlug}`,
      stage: 'TECHNICAL',
      questionText: `In an enterprise ${roleTitle} architecture, how do you handle asynchronous operations and ensure long-running I/O tasks do not block incoming user requests?`,
      expectedConcepts: ['Event loop non-blocking I/O', 'Worker threads or background queue', 'Connection pooling', 'Error boundary handling'],
    },
    {
      id: `int-sys-2-${roleSlug}`,
      stage: 'SYSTEM_DESIGN',
      questionText: `Imagine your service experiences an unexpected 20x traffic surge during a promotional event. How would you architect the database and caching layer to prevent data corruption and overselling?`,
      expectedConcepts: ['Cache-aside with Redis', 'Atomic check-and-set', 'Database pessimistic/optimistic locking', 'Connection pooling'],
    },
    {
      id: `int-beh-3-${roleSlug}`,
      stage: 'BEHAVIORAL',
      questionText: `Tell me about a time you identified a critical production performance bug or architectural flaw. What telemetry did you use to isolate the root cause, and how did you prevent recurrence?`,
      expectedConcepts: ['STAR method: Situation & Task', 'Action with metrics/profiling', 'Result & Post-Mortem', 'Automated regression testing'],
    },
  ];
}

/**
 * Dynamically synthesizes a deep contextual follow-up question based on the candidate's answer
 * and the previous question's architectural context.
 */
export function generateContextualFollowUp(
  previousQuestion: InterviewTurn,
  candidateAnswer: string
): InterviewTurn {
  const answerLower = (candidateAnswer || '').toLowerCase();

  // Pattern A: Mentioned Caching / Redis
  if (answerLower.includes('cache') || answerLower.includes('redis') || answerLower.includes('memcached')) {
    return {
      id: `int-fu-cache-${Date.now()}`,
      stage: 'FOLLOW_UP',
      questionText: 'You mentioned using caching. When scaling this across multiple microservice replicas, how do you handle cache invalidation during database write mutations, and what strategy prevents a cache stampede (thundering herd) when a key expires?',
      expectedConcepts: ['TTL jittering', 'Mutex/distributed locking on cache miss', 'Write-through vs Cache-aside', 'CDC (Change Data Capture)'],
    };
  }

  // Pattern B: Mentioned Database / SQL / Locking
  if (answerLower.includes('database') || answerLower.includes('lock') || answerLower.includes('postgres') || answerLower.includes('sql') || answerLower.includes('transaction')) {
    return {
      id: `int-fu-db-${Date.now()}`,
      stage: 'FOLLOW_UP',
      questionText: 'Regarding your database strategy, what isolation level would you specify for concurrent financial or booking transactions, and how does your architecture prevent deadlocks when multiple transactions update related rows in different orders?',
      expectedConcepts: ['Serializable or Repeatable Read', 'Deterministic resource lock ordering', 'Transaction retry loops with backoff', 'MVCC snapshots'],
    };
  }

  // Pattern C: Mentioned Microservices / Queues / Async
  if (answerLower.includes('queue') || answerLower.includes('kafka') || answerLower.includes('rabbit') || answerLower.includes('event') || answerLower.includes('async')) {
    return {
      id: `int-fu-queue-${Date.now()}`,
      stage: 'FOLLOW_UP',
      questionText: 'With asynchronous message queues in place, what happens if a downstream consumer crashes mid-processing? How do you guarantee at-least-once delivery without creating duplicate business records?',
      expectedConcepts: ['Message acknowledgements (ACK/NACK)', 'Dead-Letter Queues (DLQ)', 'Consumer idempotency keying', 'Exponential retry backoff'],
    };
  }

  // Pattern D: Default Deep-Dive Trade-off Follow-up
  return {
    id: `int-fu-gen-${Date.now()}`,
    stage: 'FOLLOW_UP',
    questionText: 'That addresses the primary functional requirement. Now, what observability metrics and alert thresholds (SLIs/SLOs) would you configure to detect if this specific component begins degrading in production before end-users report errors?',
    expectedConcepts: ['P95/P99 latency thresholds', 'HTTP 5xx error rate spikes', 'Database connection pool saturation', 'Distributed tracing (OpenTelemetry)'],
  };
}

/**
 * Evaluates candidate interview response using structured rubrics.
 */
export function evaluateInterviewResponse(
  question: InterviewTurn,
  candidateAnswer: string
): NonNullable<InterviewTurn['evaluation']> {
  const answer = (candidateAnswer || '').trim();
  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  const answerLower = answer.toLowerCase();

  let matchedConcepts = 0;
  for (const concept of question.expectedConcepts) {
    const keywords = concept.toLowerCase().split(/\s+/);
    if (keywords.some(k => k.length > 3 && answerLower.includes(k))) {
      matchedConcepts++;
    }
  }

  const conceptCoverage = Math.min(matchedConcepts / Math.max(question.expectedConcepts.length, 1), 1);

  // Compute rubric components
  let technicalCorrectness = Math.round(55 + conceptCoverage * 40);
  let communication = wordCount > 40 ? 88 : wordCount > 20 ? 76 : 60;
  let problemSolving = Math.round(60 + conceptCoverage * 35);
  let structuralClarity = answerLower.includes('because') || answerLower.includes('first') || answerLower.includes('trade-off') || answerLower.includes('however') ? 86 : 74;

  if (wordCount < 10) {
    technicalCorrectness = 45;
    communication = 40;
    problemSolving = 45;
    structuralClarity = 40;
  }

  const strengths: string[] = [];
  const growthAreas: string[] = [];

  if (conceptCoverage >= 0.5) {
    strengths.push('Demonstrated accurate foundational vocabulary and technical principles');
  } else {
    growthAreas.push('Could incorporate more specific architectural terminology and concrete mechanics');
  }

  if (wordCount >= 40) {
    strengths.push('Thorough articulation with comprehensive structural depth');
  } else {
    growthAreas.push('Answer was relatively brief; consider expanding on trade-offs and edge cases');
  }

  const feedbackText = conceptCoverage >= 0.5
    ? `Strong response addressing key dimensions of ${question.expectedConcepts.slice(0, 2).join(' and ')}. Effectively justified trade-offs.`
    : `Good starting point, but would benefit from directly explaining trade-offs surrounding ${question.expectedConcepts.join(', ')}.`;

  const overallScore = Math.round((technicalCorrectness + communication + problemSolving + structuralClarity) / 4);

  return {
    technicalCorrectness,
    communication,
    problemSolving,
    structuralClarity,
    overallScore,
    feedbackText,
    detailedReport: feedbackText,
    strengths,
    growthAreas,
  };
}
