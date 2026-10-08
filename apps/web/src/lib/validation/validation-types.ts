/**
 * LEARN-2-HIRE 2.0: PROTOTYPE VALIDATION TYPES & TRL CRITERIA DOMAIN
 * SEVA FIRST INNOVATION CHALLENGE 2026
 * Verifiable evidence structures, component integration matrices,
 * and honest readiness levels. Zero fabricated validation badges.
 */

export type TRLEvidenceLevel =
  | 'TRL_3_EVIDENCE'
  | 'TRL_4_EVIDENCE'
  | 'TRL_5_EVIDENCE'
  | 'TRL_6_EVIDENCE';

export type TRLValidationStatus =
  | 'NOT_VALIDATED'
  | 'PARTIALLY_VALIDATED'
  | 'LAB_VALIDATED'
  | 'RELEVANT_ENVIRONMENT_VALIDATED'
  | 'OPERATIONAL_DEMONSTRATION';

export interface CriticalComponentRecord {
  id: string;
  name: string;
  status: 'INTEGRATED' | 'IN_PROGRESS' | 'PLANNED';
  version: string;
  lastValidated: string;
  testCount: number;
  passCount: number;
  failCount: number;
  integrationStatus: 'PASS' | 'FAIL' | 'PENDING';
  evidenceLink: string;
  description: string;
}

export interface IntegrationMatrixRow {
  id: string;
  from: string;
  to: string;
  flowLabel: string;
  integrated: boolean;
  tested: boolean;
  dataFlowVerified: boolean;
  errorHandlingVerified: boolean;
  securityVerified: boolean;
  lastVerified: string;
}

export interface EvidenceVaultItem {
  id: string;
  category:
    | 'SYSTEM_TEST_REPORTS'
    | 'INTEGRATION_TESTS'
    | 'SECURITY_AUDIT'
    | 'RESUME_PARSING_TESTS'
    | 'JOB_SOURCE_VERIFICATION'
    | 'ASSESSMENT_TESTS'
    | 'PRACTICE_TESTS'
    | 'INTERVIEW_TESTS'
    | 'APPLICATION_FLOW_TESTS'
    | 'USER_FEEDBACK';
  title: string;
  description: string;
  createdAt: string;
  source: string;
  status: 'VERIFIED' | 'PASS' | 'DOC_READY';
  relatedComponent: string;
  metrics?: Record<string, any>;
}

export interface PilotCohortModel {
  cohortId: string;
  cohortName: string;
  status: 'PENDING_INSTITUTIONAL_PARTNER' | 'ACTIVE' | 'COMPLETED';
  enrolledCount: number;
  startDate?: string;
  targetCompletionDate?: string;
  isAvailable: boolean;
  disclaimer: string;
  fieldsTracked: string[];
}

export interface TRLCriteriaEvaluation {
  currentLevel: TRLEvidenceLevel;
  overallStatus: TRLValidationStatus;
  trl4CriteriaSatisfied: boolean;
  trl4CompletenessPercent: number;
  trl5CriteriaSatisfied: boolean;
  trl5RemainingRequirements: string[];
  honestDeclaration: string;
}
