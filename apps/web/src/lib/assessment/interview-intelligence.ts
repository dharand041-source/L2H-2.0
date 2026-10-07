/**
 * LEARN-2-HIRE 2.0: INTERVIEW INTELLIGENCE & DYNAMIC FOLLOW-UP ENGINE
 * Generates structured interview turns, contextual follow-ups, and rubric scoring.
 */

import { InterviewTurn } from './question-types';
import { getCareerBySlug } from '../data/careers-data';

/**
 * Generates an initial interview question set for a target career role.
 */
export function getInitialInterviewQuestions(
  roleSlug: string,
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' = 'INTERMEDIATE'
): InterviewTurn[] {
  const role = getCareerBySlug(roleSlug);
  const roleTitle = role ? role.title : 'Full-Stack Developer';
  const topics = role?.interviewTopics && role.interviewTopics.length > 0
    ? role.interviewTopics
    : ['System Architecture', 'Production Reliability', 'Security & Scale'];

  const t1 = topics[0] || 'Core Architecture';
  const t2 = topics[1] || topics[0] || 'System Design';

  if (role?.track === 'NON_TECHNICAL' || roleSlug.includes('product') || roleSlug.includes('marketing') || roleSlug.includes('talent')) {
    if (difficulty === 'BEGINNER') {
      return [
        {
          id: `int-tech-1-${roleSlug}-beg`,
          stage: 'TECHNICAL',
          questionText: `As an aspiring ${roleTitle}, what are the fundamental concepts behind ${t1}, and how do you apply them in basic day-to-day tasks?`,
          expectedConcepts: ['Foundational concepts', 'KPI basics', 'Team communication', 'Iterative prioritization'],
        },
        {
          id: `int-sys-2-${roleSlug}-beg`,
          stage: 'SYSTEM_DESIGN',
          questionText: `Walk through how you organize and execute a project related to ${t2} when given clear requirements and team guidance.`,
          expectedConcepts: ['Task breakdown', 'Time management', 'Clear milestones', 'Quality checks'],
        },
        {
          id: `int-beh-3-${roleSlug}-beg`,
          stage: 'BEHAVIORAL',
          questionText: `Tell me about a time you received constructive feedback on a project. How did you adapt your approach and implement the suggestions?`,
          expectedConcepts: ['STAR method: Situation & Task', 'Receptiveness to feedback', 'Action taken', 'Growth outcome'],
        },
      ];
    }

    return [
      {
        id: `int-tech-1-${roleSlug}`,
        stage: 'TECHNICAL',
        questionText: `As a ${roleTitle}, how do you approach ${t1}? Walk through the exact methodologies, frameworks, and metrics you rely on when evaluating trade-offs.`,
        expectedConcepts: ['Evidence-based decision making', 'KPI / Metric definition', 'Stakeholder alignment', 'Iterative prioritization'],
      },
      {
        id: `int-sys-2-${roleSlug}`,
        stage: 'SYSTEM_DESIGN',
        questionText: `Describe how you would design a scalable strategy around ${t2} when facing ambiguous requirements, tight cross-functional constraints, and competing deadlines.`,
        expectedConcepts: ['Structured discovery framework', 'Risk mitigation', 'Clear milestone tracking', 'Outcome validation'],
      },
      {
        id: `int-beh-3-${roleSlug}`,
        stage: 'BEHAVIORAL',
        questionText: `Tell me about a time you had to persuade senior stakeholders or cross-functional team members to adopt a difficult strategy. How did you structure your argument and navigate pushback?`,
        expectedConcepts: ['STAR method: Situation & Task', 'Data and qualitative evidence', 'Consensus building', 'Measurable business outcome'],
      },
    ];
  }

  // Technical Track
  if (difficulty === 'BEGINNER') {
    return [
      {
        id: `int-tech-1-${roleSlug}-beg`,
        stage: 'TECHNICAL',
        questionText: `From a foundational perspective in ${roleTitle}, how do you explain the core concepts of ${t1}? What basic patterns or principles should every junior engineer master?`,
        expectedConcepts: [
          t1,
          'Core syntax and mechanics',
          'Basic error handling',
          'Code readability and standards',
        ],
      },
      {
        id: `int-sys-2-${roleSlug}-beg`,
        stage: 'SYSTEM_DESIGN',
        questionText: `How would you structure a clean, maintainable module focusing on ${t2} for a single-service application with straightforward requirements?`,
        expectedConcepts: [
          t2,
          'Modular code structure',
          'Data validation',
          'Separation of concerns',
        ],
      },
      {
        id: `int-beh-3-${roleSlug}-beg`,
        stage: 'BEHAVIORAL',
        questionText: `Tell me about a time you encountered a technical concept you didn't understand while learning ${roleTitle}. How did you approach researching and mastering it?`,
        expectedConcepts: [
          'STAR method: Situation & Task',
          'Documentation & research',
          'Hands-on experimentation',
          'Learned takeaway',
        ],
      },
    ];
  }

  if (difficulty === 'EXPERT') {
    return [
      {
        id: `int-tech-1-${roleSlug}-exp`,
        stage: 'TECHNICAL',
        questionText: `As a principal authority in ${roleTitle}, how do you design governance, security boundaries, and protocol-level abstractions around ${t1}? How do you balance extreme scale with developer ergonomics?`,
        expectedConcepts: [
          t1,
          'Event loop non-blocking I/O',
          'Worker threads or background queue',
          'Connection pooling',
          'Zero Trust & security boundaries',
          'Observability and SLIs/SLOs',
        ],
      },
      {
        id: `int-sys-2-${roleSlug}-exp`,
        stage: 'SYSTEM_DESIGN',
        questionText: `Architect a global, multi-region distributed ecosystem addressing ${t2} with strict latency SLOs, cross-region replication consistency, and automated disaster recovery.`,
        expectedConcepts: [
          t2,
          'Decoupled modular architecture',
          'Fault isolation & recovery',
          'Cache-aside with Redis',
          'Distributed consensus & replication',
          'Automated failover',
        ],
      },
      {
        id: `int-beh-3-${roleSlug}-exp`,
        stage: 'BEHAVIORAL',
        questionText: `Tell me about a time you drove a company-wide architectural overhaul or cultural engineering shift. How did you align conflicting VP/C-level stakeholders and navigate systemic resistance?`,
        expectedConcepts: [
          'STAR method: Situation & Task',
          'Executive stakeholder alignment',
          'Risk mitigation and phased rollout',
          'Measurable organizational outcome',
        ],
      },
    ];
  }

  return [
    {
      id: `int-tech-1-${roleSlug}`,
      stage: 'TECHNICAL',
      questionText: `In an enterprise ${roleTitle} environment, how do you architect solutions around ${t1}? What edge cases, failure modes, and performance trade-offs do you account for?`,
      expectedConcepts: [
        t1,
        'Event loop non-blocking I/O',
        'Worker threads or background queue',
        'Connection pooling',
        'Error handling & resilience',
        'Performance / latency trade-offs',
      ],
    },
    {
      id: `int-sys-2-${roleSlug}`,
      stage: 'SYSTEM_DESIGN',
      questionText: `Imagine you need to design an enterprise system focusing on ${t2} that must handle rapid scale and high availability. How do you partition responsibilities and ensure resilience against single points of failure?`,
      expectedConcepts: [
        t2,
        'Decoupled modular architecture',
        'Fault isolation & recovery',
        'Cache-aside with Redis',
        'Database pessimistic/optimistic locking',
        'Security & access control',
      ],
    },
    {
      id: `int-beh-3-${roleSlug}`,
      stage: 'BEHAVIORAL',
      questionText: `Tell me about a time you diagnosed a severe production failure or architectural blocker in ${roleTitle} work. What telemetry or diagnostic tools did you use to find the root cause, and how did you resolve it?`,
      expectedConcepts: [
        'STAR method: Situation & Task',
        'Action with root cause analysis',
        'Metrics and profiling telemetry',
        'Result with post-mortem',
        'Automated regression safeguards',
      ],
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
  let communication = wordCount >= 35 ? 88 : wordCount >= 18 ? 76 : 60;
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
