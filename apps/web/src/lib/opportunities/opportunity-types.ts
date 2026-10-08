/**
 * LEARN-2-HIRE 2.0: OPPORTUNITY & LIVE JOB ENGINE TYPES
 * Legitimate job schema supporting Live vs Historical verification,
 * Tamil Nadu municipal hub filtering, fresher filtering, and genuine deduplication.
 */

export type OpportunitySourceType =
  | 'GREENHOUSE'
  | 'LEVER'
  | 'ASHBY'
  | 'EMPLOYER_PORTAL'
  | 'ADZUNA'
  | 'REMOTIVE'
  | 'JOOBLE'
  | 'PUBLIC_TECH_FEED';

export type OpportunityCategory = 'JOB' | 'INTERNSHIP' | 'STARTUP';

export type VerificationStatus =
  | 'LIVE'               // Currently verified directly against employer/ATS source
  | 'RECENTLY_VERIFIED'  // Confirmed within the past 48 hours
  | 'UNCONFIRMED'        // Feed unverified or awaiting scheduled crawl
  | 'HISTORICAL';        // Previously observed; no longer active/confirmed

export interface OpportunityItem {
  id: string;
  externalId: string;
  source: OpportunitySourceType;
  sourceUrl: string;
  applyUrl: string;
  companyName: string;
  companyLogoText: string;
  title: string;
  roleSlug: string;
  category: OpportunityCategory;
  description: string;
  location: string;
  city?: string;
  state?: string;
  isTamilNadu: boolean;
  isRemote: boolean;
  employmentType: 'FULL_TIME' | 'INTERNSHIP' | 'STARTUP' | 'PART_TIME' | 'CONTRACT';
  experienceLevelRequired: string;
  isFresherEligible: boolean;
  minExperienceYears: number;
  salary: string; // Real or 'Not Disclosed' - Never fabricated
  stipend?: string; // Real stipend for internships - Never fabricated
  requiredSkills: string[];
  preferredSkills: string[];
  postedAt: string;
  lastVerifiedAt: string;
  verificationStatus: VerificationStatus;
  isActive: boolean;
}

export interface OpportunityMatchBreakdown {
  opportunityId: string;
  overallMatchScore: number; // 0 - 100
  roleAlignmentScore: number; // 0 - 100
  skillsMatchScore: number;   // 0 - 100
  experienceMatchScore: number; // 0 - 100
  locationMatchScore: number; // 0 - 100
  matchedSkills: string[];
  missingCriticalSkills: string[];
  eligibilityStatus: 'ELIGIBLE' | 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE';
  remedialRoadmapSkills: string[];
}
