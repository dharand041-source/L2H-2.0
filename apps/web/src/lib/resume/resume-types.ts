/**
 * LEARN-2-HIRE 2.0: RESUME & ATS ENGINE TYPES
 * Canonical TypeScript interfaces for evidence-backed resume parsing, versioning,
 * transparent L2H ATS compatibility scoring, eligibility evaluation, and actionable improvements.
 */

export type ResumeFileType = 'PDF' | 'DOCX' | 'TXT';

export type EligibilityStatus =
  | 'ELIGIBLE'
  | 'POTENTIALLY_ELIGIBLE'
  | 'NOT_ELIGIBLE'
  | 'INSUFFICIENT_DATA';

export interface ParsedContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
}

export interface ParsedExperienceItem {
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  yearsEstimated: number;
  description: string;
  technologiesUsed: string[];
}

export interface ParsedEducationItem {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startYear?: number;
  endYear?: number;
  grade?: string;
}

export interface ParsedProjectItem {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  hasAuditableMetrics: boolean;
}

export interface ParsedResumeData {
  contact: ParsedContactInfo;
  summary?: string;
  extractedSkills: string[];
  experience: ParsedExperienceItem[];
  education: ParsedEducationItem[];
  projects: ParsedProjectItem[];
  certifications: string[];
  totalYearsExperience: number;
  isScannedOrImagePdf: boolean;
  rawCharacterCount: number;
  sectionDetection: {
    hasSummary: boolean;
    hasSkills: boolean;
    hasExperience: boolean;
    hasEducation: boolean;
    hasProjects: boolean;
  };
}

export interface ResumeVersion {
  id: string;
  userId: string;
  versionNumber: number;
  title: string;
  targetCareerSlug: string;
  targetCareerRoleId?: string;
  fileName: string;
  fileType: ResumeFileType;
  fileSize: number;
  storagePath?: string;
  checksum: string;
  rawText: string;
  parsedData: ParsedResumeData;
  createdAt: string;
}

export interface JobDescriptionSpec {
  title: string;
  company: string;
  location: string;
  experienceYearsRequired: number;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  technologies: string[];
  educationRequirement?: string;
  isRemote?: boolean;
  rawText: string;
}

export interface ATSDimensionScore {
  dimension: string;
  weightPercent: number; // e.g. 30 for 30%
  score: number; // 0 - 100
  weightedContribution: number;
  evidence: string;
}

export interface ATSAnalysisResult {
  id: string;
  resumeVersionId: string;
  jobTitle: string;
  companyName: string;
  scoringModelVersion: string; // e.g. 'ATS-L2H-2026.1'
  compatibilityScore: number; // 0 - 100 weighted estimate
  eligibilityStatus: EligibilityStatus;
  eligibilityReason: string;
  isFresherModeActive: boolean;

  // Breakdown dimensions (configurable 30/10/15/10/10/10/5/5/5 model)
  dimensions: {
    requiredSkills: ATSDimensionScore;
    preferredSkills: ATSDimensionScore;
    experienceAlignment: ATSDimensionScore;
    roleAlignment: ATSDimensionScore;
    responsibilityAlignment: ATSDimensionScore;
    technicalStack: ATSDimensionScore;
    projectEvidence: ATSDimensionScore;
    parseability: ATSDimensionScore;
    educationCertification: ATSDimensionScore;
  };

  matchedRequiredSkills: string[];
  missingRequiredSkills: string[]; // CRITICAL GAPS
  matchedPreferredSkills: string[];
  missingPreferredSkills: string[]; // OPTIONAL GAPS

  roleMismatchWarning?: {
    selectedRole: string;
    detectedRoleBias: string;
    warningMessage: string;
  };

  strengths: string[];
  gaps: string[];
  recommendations: ResumeImprovementItem[];
  analyzedAt: string;
}

export interface ResumeImprovementItem {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  category: 'REQUIRED_SKILL' | 'EXPERIENCE' | 'PROJECT_PROOF' | 'STRUCTURE' | 'QUANTIFY_METRICS';
  what: string;
  why: string;
  how: string;
  impactScoreBoostEstimated: number; // e.g. +5%
}
