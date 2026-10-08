/**
 * LEARN-2-HIRE 2.0: OPPORTUNITY MATCHER ENGINE
 * Matches live opportunities against active candidate state, career goals,
 * and verified competencies. Provides transparent multi-dimension score breakdown
 * and handles 0-match states honestly without injecting fake jobs.
 */

import { OpportunityItem, OpportunityMatchBreakdown } from './opportunity-types';
import { VERIFIED_OPPORTUNITIES } from './opportunity-catalog';

export interface OpportunityFilterOptions {
  roleSlug?: string;
  category?: 'ALL' | 'JOB' | 'INTERNSHIP' | 'STARTUP';
  tamilNaduOnly?: boolean;
  freshersOnly?: boolean;
  remoteOnly?: boolean;
  searchQuery?: string;
  includeHistorical?: boolean; // Defaults to false: only LIVE / RECENTLY_VERIFIED
}

export class OpportunityMatcher {
  /**
   * Retrieves active, verified opportunities matching user filters
   */
  public static getOpportunities(options: OpportunityFilterOptions = {}): OpportunityItem[] {
    const {
      roleSlug,
      category = 'ALL',
      tamilNaduOnly = false,
      freshersOnly = false,
      remoteOnly = false,
      searchQuery = '',
      includeHistorical = false,
    } = options;

    return VERIFIED_OPPORTUNITIES.filter((item) => {
      // 1. Live vs Historical check
      if (!includeHistorical && item.verificationStatus === 'HISTORICAL') {
        return false;
      }
      if (!includeHistorical && !item.isActive) {
        return false;
      }

      // 2. Category filter
      if (category !== 'ALL' && item.category !== category) {
        return false;
      }

      // 3. Tamil Nadu municipal filter
      if (tamilNaduOnly && !item.isTamilNadu) {
        return false;
      }

      // 4. Fresher filter
      if (freshersOnly && !item.isFresherEligible && item.minExperienceYears > 0) {
        return false;
      }

      // 5. Remote filter
      if (remoteOnly && !item.isRemote) {
        return false;
      }

      // 6. Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesQ =
          item.title.toLowerCase().includes(q) ||
          item.companyName.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.requiredSkills.some((s) => s.toLowerCase().includes(q));
        if (!matchesQ) return false;
      }

      return true;
    }).sort((a, b) => {
      // Priority to exact active role matches
      if (roleSlug) {
        const aExact = a.roleSlug === roleSlug ? 1 : 0;
        const bExact = b.roleSlug === roleSlug ? 1 : 0;
        if (bExact !== aExact) return bExact - aExact;
      }
      // Then prioritize LIVE verified status
      const aLive = a.verificationStatus === 'LIVE' ? 1 : 0;
      const bLive = b.verificationStatus === 'LIVE' ? 1 : 0;
      return bLive - aLive;
    });
  }

  /**
   * Evaluates match breakdown between candidate competencies and an opportunity
   */
  public static evaluateMatch(
    candidateSkills: { name: string; currentLevel: string }[],
    candidateRoleSlug: string,
    candidateYearsExp: number,
    opportunity: OpportunityItem
  ): OpportunityMatchBreakdown {
    const activeSkillsSet = new Set(
      candidateSkills
        .filter((s) => s.currentLevel !== 'L0')
        .map((s) => s.name.toLowerCase().trim())
    );

    // 1. Role Alignment (100 if matching, 40 if cross-disciplinary)
    const roleAlignmentScore =
      candidateRoleSlug === opportunity.roleSlug ? 100 : 40;

    // 2. Required Skills Match
    const matchedSkills: string[] = [];
    const missingCriticalSkills: string[] = [];

    opportunity.requiredSkills.forEach((req) => {
      const isMatched = Array.from(activeSkillsSet).some(
        (candSkill) =>
          candSkill.includes(req.toLowerCase()) ||
          req.toLowerCase().includes(candSkill)
      );
      if (isMatched) {
        matchedSkills.push(req);
      } else {
        missingCriticalSkills.push(req);
      }
    });

    const skillsMatchScore =
      opportunity.requiredSkills.length > 0
        ? Math.round(
            (matchedSkills.length / opportunity.requiredSkills.length) * 100
          )
        : 80;

    // 3. Experience Match
    let experienceMatchScore = 100;
    if (opportunity.minExperienceYears > 0) {
      if (candidateYearsExp >= opportunity.minExperienceYears) {
        experienceMatchScore = 100;
      } else {
        experienceMatchScore = Math.round(
          (candidateYearsExp / opportunity.minExperienceYears) * 80
        );
      }
    } else {
      experienceMatchScore = 100;
    }

    // 4. Location Match
    const locationMatchScore = 100; // Generic baseline

    // Overall Weighted Match Score
    const overallMatchScore = Math.round(
      roleAlignmentScore * 0.35 +
      skillsMatchScore * 0.40 +
      experienceMatchScore * 0.15 +
      locationMatchScore * 0.10
    );

    // Eligibility Check
    let eligibilityStatus: 'ELIGIBLE' | 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE' =
      'ELIGIBLE';
    if (
      opportunity.minExperienceYears > 0 &&
      candidateYearsExp < opportunity.minExperienceYears
    ) {
      eligibilityStatus =
        opportunity.isFresherEligible ? 'POTENTIALLY_ELIGIBLE' : 'NOT_ELIGIBLE';
    }

    return {
      opportunityId: opportunity.id,
      overallMatchScore,
      roleAlignmentScore,
      skillsMatchScore,
      experienceMatchScore,
      locationMatchScore,
      matchedSkills,
      missingCriticalSkills,
      eligibilityStatus,
      remedialRoadmapSkills: missingCriticalSkills,
    };
  }
}
