/**
 * LEARN-2-HIRE 2.0: DETERMINISTIC ANTI-REPETITION ENGINE
 * Enforces strict non-repetition across assessments, interviews, and practice rounds.
 */

import { AssessmentQuestion, UserHistoryRecord } from './question-types';
import { normalizeQuestionText, computeNormalizedHash } from './normalization';

export interface AntiRepetitionOptions {
  familyCooldownLimit?: number; // How many recent questions to check for same family (default: 5)
  maxQuestionsPerTopic?: number; // Maximum questions with the exact same topic per assessment (default: 2)
  allowDifficultyRelaxation?: boolean;
}

export interface AntiRepetitionFilterResult {
  eligibleQuestions: AssessmentQuestion[];
  blockedCount: number;
  blockedByExactHash: number;
  blockedByFamilyCooldown: number;
  blockedByVariantGroup: number;
  blockedByTopicCap: number;
  inventoryDepleted: boolean;
}

/**
 * Deterministically filters a candidate pool of questions against user exposure history
 * and active session constraints.
 */
export function filterEligibleQuestions(
  candidatePool: AssessmentQuestion[],
  userHistory: UserHistoryRecord[] = [],
  sessionQuestions: AssessmentQuestion[] = [],
  options: AntiRepetitionOptions = {}
): AntiRepetitionFilterResult {
  const familyCooldownLimit = options.familyCooldownLimit ?? 5;
  const maxQuestionsPerTopic = options.maxQuestionsPerTopic ?? 2;

  // 1. Build fast-lookup sets from user history
  const seenHashes = new Set<string>();
  const seenVariantGroups = new Set<string>();

  for (const record of userHistory) {
    if (record.normalizedHash) {
      seenHashes.add(record.normalizedHash);
    }
    if (record.variantGroupId) {
      seenVariantGroups.add(record.variantGroupId);
    }
  }

  // 2. Build session constraints (current assessment run)
  const sessionHashes = new Set<string>();
  const sessionTopicCounts: Record<string, number> = {};
  const recentFamilies: string[] = [];

  for (const q of sessionQuestions) {
    sessionHashes.add(q.normalizedHash);
    sessionTopicCounts[q.topic] = (sessionTopicCounts[q.topic] || 0) + 1;
    if (q.questionFamily) {
      recentFamilies.push(q.questionFamily);
    }
  }

  // Recent families within cooldown window
  const activeCooldownFamilies = new Set<string>(
    recentFamilies.slice(-familyCooldownLimit)
  );

  let blockedByExactHash = 0;
  let blockedByFamilyCooldown = 0;
  let blockedByVariantGroup = 0;
  let blockedByTopicCap = 0;

  const eligible: AssessmentQuestion[] = [];

  for (const candidate of candidatePool) {
    // Rule 1: Never repeat identical question hash for user or session
    if (seenHashes.has(candidate.normalizedHash) || sessionHashes.has(candidate.normalizedHash)) {
      blockedByExactHash++;
      continue;
    }

    // Rule 2: Block same variant group if seen in user history or active session
    if (candidate.variantGroupId && (seenVariantGroups.has(candidate.variantGroupId) || sessionQuestions.some(sq => sq.variantGroupId === candidate.variantGroupId))) {
      blockedByVariantGroup++;
      continue;
    }

    // Rule 3: Question Family Cooldown (prevent consecutive questions testing identical underlying concept)
    if (candidate.questionFamily && activeCooldownFamilies.has(candidate.questionFamily)) {
      blockedByFamilyCooldown++;
      continue;
    }

    // Rule 4: Cap maximum questions from the same topic within a single assessment
    const currentTopicCount = sessionTopicCounts[candidate.topic] || 0;
    if (currentTopicCount >= maxQuestionsPerTopic) {
      blockedByTopicCap++;
      continue;
    }

    eligible.push(candidate);
  }

  const blockedCount =
    blockedByExactHash +
    blockedByFamilyCooldown +
    blockedByVariantGroup +
    blockedByTopicCap;

  return {
    eligibleQuestions: eligible,
    blockedCount,
    blockedByExactHash,
    blockedByFamilyCooldown,
    blockedByVariantGroup,
    blockedByTopicCap,
    inventoryDepleted: eligible.length === 0,
  };
}

/**
 * Validates whether two prompts are duplicates, even if whitespace or casing differs.
 */
export function isDuplicatePrompt(promptA: string, promptB: string): boolean {
  if (!promptA || !promptB) return false;
  const hashA = computeNormalizedHash(promptA);
  const hashB = computeNormalizedHash(promptB);
  return hashA === hashB;
}
