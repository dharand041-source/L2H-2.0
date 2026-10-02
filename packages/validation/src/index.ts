import { z } from 'zod';

/**
 * LEARN-2-HIRE CANONICAL ZOD VALIDATION SCHEMAS
 * Strict runtime input verification for forms, route handlers, and API payloads.
 */

// =============================================================================
// 1. PRIMITIVES & ENUMS
// =============================================================================

export const DifficultyLevelSchema = z.enum(['L0', 'L1', 'L2', 'L3', 'L4', 'L5']);

export const CareerTrackSchema = z.enum(['TECHNICAL', 'NON_TECHNICAL', 'HYBRID']);

export const ContentSourceTypeSchema = z.enum([
  'OFFICIAL',
  'OPEN_SOURCE',
  'THIRD_PARTY',
  'REPORTED_EXPERIENCE',
  'LEARN_2_HIRE_ORIGINAL',
  'AI_GENERATED',
]);

export const QuestionTypeSchema = z.enum([
  'MCQ',
  'MULTI_SELECT',
  'CODING',
  'SQL',
  'DEBUGGING',
  'SCENARIO',
  'CASE_STUDY',
  'SHORT_ANSWER',
]);

export const OpportunityTypeSchema = z.enum([
  'FULL_TIME',
  'INTERNSHIP',
  'APPRENTICESHIP',
  'GRADUATE_TRAINEE',
  'STARTUP',
  'REMOTE',
  'PART_TIME',
  'CONTRACT',
]);

export const ApplicationStatusSchema = z.enum([
  'SAVED',
  'READY_TO_APPLY',
  'APPLIED',
  'SCREENING',
  'ASSESSMENT',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
  'CLOSED',
]);

// =============================================================================
// 2. AUTHENTICATION & PROFILE SCHEMAS
// =============================================================================

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const SignupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  fullName: z.string().min(2, 'Full name is required'),
  careerTrack: CareerTrackSchema.default('TECHNICAL'),
});

export const ProfileUpdateSchema = z.object({
  fullName: z.string().min(2).optional(),
  headline: z.string().max(160).optional(),
  bio: z.string().max(2000).optional(),
  location: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  targetRoleId: z.string().uuid().optional(),
  careerTrack: CareerTrackSchema.optional(),
  isPublicProfile: z.boolean().optional(),
  preferredWorkModes: z.array(z.enum(['REMOTE', 'HYBRID', 'ONSITE'])).optional(),
});

export const OnboardingWizardSchema = z.object({
  // Step 1: Basic Information
  fullName: z.string().min(2, 'Full name is required'),
  headline: z.string().optional(),
  location: z.string().optional(),
  // Step 2: Education
  education: z.object({
    institution: z.string().min(2),
    degree: z.string().min(2),
    fieldOfStudy: z.string().min(2),
    graduationYear: z.number().int().min(1970).max(2035),
  }).optional(),
  // Step 3: Experience
  experienceLevel: z.enum(['STUDENT', 'FRESHER', '0_2_YEARS', '3_5_YEARS', '5_PLUS_YEARS']),
  // Step 4 & 5: Career Track Preference
  careerTrack: CareerTrackSchema,
  // Step 6: Target Career Role
  targetRoleId: z.string().uuid('Please select a target role'),
  // Step 7: Existing Self-Reported Skills
  existingSkills: z.array(z.object({
    skillId: z.string().uuid(),
    selfAssessedLevel: DifficultyLevelSchema,
  })).default([]),
  // Step 8: Preferences
  preferredWorkModes: z.array(z.enum(['REMOTE', 'HYBRID', 'ONSITE'])).min(1),
  // Step 9: Baseline Assessment Flag
  takeBaselineImmediately: z.boolean().default(true),
});

// =============================================================================
// 3. CAREER & SKILL SCHEMAS
// =============================================================================

export const CareerRoleCreateSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(20),
  track: CareerTrackSchema,
  industry: z.string().min(2),
  averageSalaryUsd: z.number().positive().optional(),
  marketDemand: z.enum(['VERY_HIGH', 'HIGH', 'MODERATE', 'SPECIALIZED']).default('HIGH'),
  tasks: z.array(z.string()).min(1),
  educationRequirements: z.array(z.string()).default([]),
  source: z.enum(['ESCO', 'ONET', 'BLS', 'LEARN_2_HIRE_ORIGINAL']),
  sourceId: z.string().optional(),
  sourceUrl: z.string().url().optional(),
});

export const UserSkillRecordSchema = z.object({
  skillId: z.string().uuid(),
  currentLevel: DifficultyLevelSchema,
  confidenceScore: z.number().min(0).max(1),
  isVerified: z.boolean().default(false),
});

// =============================================================================
// 4. ASSESSMENT SCHEMAS
// =============================================================================

export const QuestionCreateSchema = z.object({
  skillId: z.string().uuid(),
  topic: z.string().min(2),
  difficulty: DifficultyLevelSchema,
  questionType: QuestionTypeSchema,
  prompt: z.string().min(10),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  explanation: z.string().min(10),
  distractorExplanations: z.record(z.string()).optional(),
  conceptTested: z.string().min(2),
  sourceType: ContentSourceTypeSchema,
  sourceUrl: z.string().url().optional(),
  qualityScore: z.number().min(1).max(5).default(4.5),
});

export const AssessmentSubmissionSchema = z.object({
  attemptId: z.string().uuid(),
  answers: z.array(z.object({
    questionId: z.string().uuid(),
    userAnswer: z.union([z.string(), z.array(z.string())]),
    timeSpentSeconds: z.number().nonnegative(),
  })),
});

// =============================================================================
// 5. PROJECT & PRACTICE SUBMISSIONS
// =============================================================================

export const PracticeSubmissionSchema = z.object({
  challengeId: z.string().uuid(),
  codeSubmitted: z.string().min(1, 'Code or solution cannot be empty'),
  language: z.string().default('javascript'),
});

export const ProjectSubmissionSchema = z.object({
  projectId: z.string().uuid(),
  githubUrl: z.string().url().regex(/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+/, 'Must be a valid GitHub repository URL'),
  liveDeploymentUrl: z.string().url().optional(),
  documentationUrl: z.string().url().optional(),
  explanationNotes: z.string().min(50, 'Please provide an architectural explanation (at least 50 characters)'),
});

// =============================================================================
// 6. RESUME & APPLICATION SCHEMAS
// =============================================================================

export const ResumeVersionCreateSchema = z.object({
  title: z.string().min(2),
  targetRole: z.string().min(2),
  summary: z.string().min(20),
  skillsIncluded: z.array(z.string()).min(1),
  experienceIds: z.array(z.string().uuid()),
  educationIds: z.array(z.string().uuid()),
  projectIds: z.array(z.string().uuid()),
});

export const ApplicationStatusUpdateSchema = z.object({
  status: ApplicationStatusSchema,
  notes: z.string().optional(),
  interviewDate: z.string().datetime().optional(),
  outcomeReason: z.string().optional(),
});
