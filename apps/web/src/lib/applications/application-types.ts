/**
 * LEARN-2-HIRE 2.0: APPLICATION TRACKER TYPES & DOMAIN MODEL
 * Production-quality, evidence-driven application lifecycle system.
 * Explicit distinction between user action, employer communication,
 * system observation, and L2H analysis. Zero simulated outcomes.
 */

export type ApplicationStatus =
  | 'SAVED'
  | 'DRAFT'
  | 'READY_TO_APPLY'
  | 'APPLICATION_STARTED'
  | 'APPLIED'
  | 'SCREENING'
  | 'ASSESSMENT'
  | 'INTERVIEW'
  | 'OFFER'
  | 'OFFER_ACCEPTED'
  | 'OFFER_DECLINED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'CLOSED'
  | 'EXPIRED'
  | 'UNKNOWN';

export type EligibilityState =
  | 'ELIGIBLE'
  | 'POTENTIALLY_ELIGIBLE'
  | 'NOT_ELIGIBLE'
  | 'INSUFFICIENT_DATA';

export type OutcomeSourceType =
  | 'EMPLOYER_CONFIRMED'
  | 'EMPLOYER_EMAIL'
  | 'EMPLOYER_PORTAL'
  | 'AUTHORIZED_PROVIDER'
  | 'CANDIDATE_REPORTED'
  | 'SYSTEM_OBSERVED'
  | 'L2H_ANALYSIS'
  | 'UNKNOWN';

export type OutcomeSourceConfidence =
  | 'CONFIRMED'
  | 'USER_REPORTED'
  | 'SYSTEM_OBSERVED'
  | 'INFERRED'
  | 'UNKNOWN';

export type RejectionReasonCategory =
  | 'EXPERIENCE_REQUIREMENT'
  | 'SKILL_REQUIREMENT'
  | 'EDUCATION_REQUIREMENT'
  | 'CERTIFICATION_REQUIREMENT'
  | 'LOCATION_REQUIREMENT'
  | 'WORK_AUTHORIZATION'
  | 'SALARY_MISMATCH'
  | 'RESUME_NOT_SELECTED'
  | 'ASSESSMENT_NOT_PASSED'
  | 'TECHNICAL_INTERVIEW'
  | 'BEHAVIORAL_INTERVIEW'
  | 'HR_INTERVIEW'
  | 'ROLE_MISMATCH'
  | 'POSITION_FILLED'
  | 'HIRING_FREEZE'
  | 'POSITION_CANCELLED'
  | 'CANDIDATE_POOL'
  | 'UNKNOWN'
  | 'OTHER';

export type WithdrawalReasonCategory =
  | 'ACCEPTED_ANOTHER_OFFER'
  | 'FOUND_ANOTHER_OPPORTUNITY'
  | 'ROLE_MISMATCH'
  | 'SALARY_NOT_SUITABLE'
  | 'LOCATION_NOT_SUITABLE'
  | 'WORK_MODE_NOT_SUITABLE'
  | 'PERSONAL_REASON'
  | 'CONTINUING_EDUCATION'
  | 'MISTAKE_SUBMISSION'
  | 'NO_LONGER_INTERESTED'
  | 'OTHER';

export type ClosedReasonCategory =
  | 'POSITION_FILLED'
  | 'POSTING_CLOSED'
  | 'HIRING_CANCELLED'
  | 'ROLE_REMOVED'
  | 'UNKNOWN';

export type OfferDeclineReasonCategory =
  | 'SALARY'
  | 'LOCATION'
  | 'WORK_MODE'
  | 'ROLE_MISMATCH'
  | 'ANOTHER_OFFER'
  | 'CAREER_DIRECTION'
  | 'PERSONAL_REASON'
  | 'OTHER';

export type ApplicationEventType =
  | 'JOB_SAVED'
  | 'ELIGIBILITY_CHECKED'
  | 'RESUME_SELECTED'
  | 'APPLICATION_DRAFT_CREATED'
  | 'READY_TO_APPLY'
  | 'APPLICATION_STARTED'
  | 'APPLIED'
  | 'SCREENING'
  | 'ASSESSMENT'
  | 'INTERVIEW'
  | 'OFFER'
  | 'OFFER_ACCEPTED'
  | 'OFFER_DECLINED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'CLOSED'
  | 'EXPIRED'
  | 'STATUS_CHANGED'
  | 'FOLLOW_UP_SCHEDULED';

export interface ApplicationEventRecord {
  id: string;
  applicationId: string;
  eventType: ApplicationEventType;
  description: string;
  oldStatus?: ApplicationStatus;
  newStatus?: ApplicationStatus;
  reasonCategory?: string;
  reasonText?: string;
  sourceType: OutcomeSourceType;
  sourceConfidence: OutcomeSourceConfidence;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ApplicationRecord {
  id: string;
  opportunityId: string;
  company: string;
  title: string;
  location: string;
  workMode?: string;
  careerRoleSlug: string;
  careerRoleTitle?: string;
  resumeVersionId?: string;
  resumeTitle?: string;
  compatibilityScore?: number;
  eligibilityStatus?: EligibilityState;
  status: ApplicationStatus;
  appliedDate?: string;
  applicationStartedAt?: string;
  lastStatusChangeAt?: string;
  createdAt: string;
  updatedAt: string;
  applyUrl?: string;
  jobUrl?: string;
  source?: string;
  notes?: string;

  // Outcome details
  outcomeReason?: string;
  outcomeReasonCategory?: RejectionReasonCategory;
  outcomeSourceType?: OutcomeSourceType;
  outcomeSourceConfidence?: OutcomeSourceConfidence;
  outcomeDate?: string;

  // Withdrawal details
  withdrawnAt?: string;
  withdrawalReasonCategory?: WithdrawalReasonCategory;
  withdrawalReasonText?: string;

  // Closed details
  closedReasonCategory?: ClosedReasonCategory;

  // Offer details
  offerDate?: string;
  offerDetails?: string;
  offerAcceptedAt?: string;
  offerDeclinedReason?: OfferDeclineReasonCategory;
  joiningDate?: string;

  // Follow-up
  followUpDate?: string;
  followUpNotes?: string;

  // Audit trail of events
  events: ApplicationEventRecord[];
}

export interface ApplicationFunnelMetrics {
  total: number;
  saved: number;
  started: number;
  applied: number;
  screening: number;
  interview: number;
  offer: number;
  rejected: number;
  withdrawn: number;
  closed: number;
  expired: number;

  // Conversion rates (only calculated if sufficient sample size >= 5)
  rates: {
    appliedToScreeningRate: number | null;
    screeningToInterviewRate: number | null;
    interviewToOfferRate: number | null;
    overallOfferRate: number | null;
    hasReliableSample: boolean;
  };

  // Outcome breakdown counts
  rejectionReasons: Record<string, number>;
  withdrawalReasons: Record<string, number>;
}

export interface L2HObservationPattern {
  skillName: string;
  frequencyInApplications: number;
  totalApplicationsSampled: number;
  candidateCurrentLevel: string;
  targetLevel: string;
  observationNote: string;
  suggestedAction: string;
  actionUrl: string;
}
