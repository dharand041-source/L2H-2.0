-- ==============================================================================
-- LEARN-2-HIRE 2.0 CANONICAL DATABASE MASTER MIGRATION (001)
-- Engine: PostgreSQL 15+ with pgvector, pgcrypto, uuid-ossp
-- Philosophy: Single concept canonical models, strict FKs, check constraints, RLS
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. DOMAIN: AUTH & USERS EXTENSION (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  headline TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  phone TEXT,
  target_role_id UUID,
  career_track TEXT NOT NULL DEFAULT 'TECHNICAL' CHECK (career_track IN ('TECHNICAL', 'NON_TECHNICAL', 'HYBRID')),
  readiness_score NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (readiness_score >= 0 AND readiness_score <= 100),
  is_public_profile BOOLEAN NOT NULL DEFAULT false,
  preferred_work_modes TEXT[] DEFAULT ARRAY['REMOTE', 'HYBRID'],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_target_role ON public.profiles(target_role_id);
CREATE INDEX IF NOT EXISTS idx_profiles_career_track ON public.profiles(career_track);

-- 3. DOMAIN: EDUCATION & EXPERIENCE
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  start_year INTEGER NOT NULL CHECK (start_year >= 1950 AND start_year <= 2040),
  end_year INTEGER CHECK (end_year >= start_year),
  grade TEXT,
  is_current BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_education_user_id ON public.education(user_id);

CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  employment_type TEXT NOT NULL DEFAULT 'FULL_TIME' CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'FREELANCE')),
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_experience_user_id ON public.experience(user_id);

-- 4. DOMAIN: CAREERS & COMPETENCIES
CREATE TABLE IF NOT EXISTS public.career_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  track TEXT NOT NULL DEFAULT 'TECHNICAL' CHECK (track IN ('TECHNICAL', 'NON_TECHNICAL', 'HYBRID')),
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.career_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.career_categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  track TEXT NOT NULL DEFAULT 'TECHNICAL' CHECK (track IN ('TECHNICAL', 'NON_TECHNICAL', 'HYBRID')),
  industry TEXT NOT NULL,
  average_salary_usd NUMERIC(10,2),
  market_demand TEXT NOT NULL DEFAULT 'HIGH' CHECK (market_demand IN ('VERY_HIGH', 'HIGH', 'MODERATE', 'SPECIALIZED')),
  tasks TEXT[] NOT NULL DEFAULT '{}',
  education_requirements TEXT[] NOT NULL DEFAULT '{}',
  source TEXT NOT NULL DEFAULT 'LEARN_2_HIRE_ORIGINAL' CHECK (source IN ('ESCO', 'ONET', 'BLS', 'LEARN_2_HIRE_ORIGINAL')),
  source_id TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_career_roles_category ON public.career_roles(category_id);
CREATE INDEX IF NOT EXISTS idx_career_roles_track ON public.career_roles(track);

ALTER TABLE public.profiles 
  ADD CONSTRAINT fk_profiles_target_role FOREIGN KEY (target_role_id) 
  REFERENCES public.career_roles(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competency_id UUID REFERENCES public.competencies(id) ON DELETE SET NULL,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  is_technical BOOLEAN NOT NULL DEFAULT true,
  embedding vector(1536) -- For semantic matching and similarity search
);
CREATE INDEX IF NOT EXISTS idx_skills_competency ON public.skills(competency_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);

CREATE TABLE IF NOT EXISTS public.career_role_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_role_id UUID NOT NULL REFERENCES public.career_roles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  required_level TEXT NOT NULL CHECK (required_level IN ('L0', 'L1', 'L2', 'L3', 'L4', 'L5')),
  importance NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (importance >= 0.00 AND importance <= 1.00),
  source TEXT NOT NULL DEFAULT 'LEARN_2_HIRE_ORIGINAL',
  CONSTRAINT uq_career_role_skill UNIQUE (career_role_id, skill_id)
);
CREATE INDEX IF NOT EXISTS idx_career_role_skills_role ON public.career_role_skills(career_role_id);
CREATE INDEX IF NOT EXISTS idx_career_role_skills_skill ON public.career_role_skills(skill_id);

-- 5. DOMAIN: USER SKILLS & EVIDENCE GRAPH
CREATE TABLE IF NOT EXISTS public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  current_level TEXT NOT NULL DEFAULT 'L1' CHECK (current_level IN ('L0', 'L1', 'L2', 'L3', 'L4', 'L5')),
  confidence_score NUMERIC(3,2) NOT NULL DEFAULT 0.50 CHECK (confidence_score >= 0.00 AND confidence_score <= 1.00),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  evidence_count INTEGER NOT NULL DEFAULT 0,
  last_assessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_skill UNIQUE (user_id, skill_id)
);
CREATE INDEX IF NOT EXISTS idx_user_skills_user ON public.user_skills(user_id);

CREATE TABLE IF NOT EXISTS public.skill_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_skill_id UUID NOT NULL REFERENCES public.user_skills(id) ON DELETE CASCADE,
  evidence_type TEXT NOT NULL CHECK (evidence_type IN ('ASSESSMENT', 'PRACTICE', 'PROJECT', 'INTERVIEW', 'RESUME_VERIFIED')),
  reference_id UUID NOT NULL,
  score_achieved NUMERIC(5,2) NOT NULL CHECK (score_achieved >= 0 AND score_achieved <= 100),
  weight NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (weight >= 0.00 AND weight <= 1.00),
  verified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_skill_evidence_user_skill ON public.skill_evidence(user_skill_id);

CREATE TABLE IF NOT EXISTS public.skill_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  required_level TEXT NOT NULL CHECK (required_level IN ('L0', 'L1', 'L2', 'L3', 'L4', 'L5')),
  current_level TEXT NOT NULL CHECK (current_level IN ('L0', 'L1', 'L2', 'L3', 'L4', 'L5')),
  gap_steps INTEGER NOT NULL DEFAULT 1,
  priority TEXT NOT NULL DEFAULT 'HIGH' CHECK (priority IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
  recommended_action TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_skill_gap UNIQUE (user_id, skill_id)
);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_user ON public.skill_gaps(user_id);

-- 6. DOMAIN: ASSESSMENTS & QUESTIONS
CREATE TABLE IF NOT EXISTS public.question_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  url TEXT,
  license TEXT NOT NULL,
  is_redistributable BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('L0', 'L1', 'L2', 'L3', 'L4', 'L5')),
  question_type TEXT NOT NULL CHECK (question_type IN ('MCQ', 'MULTI_SELECT', 'CODING', 'SQL', 'DEBUGGING', 'SCENARIO', 'CASE_STUDY', 'SHORT_ANSWER')),
  prompt TEXT NOT NULL,
  options JSONB, -- Array of strings for MCQ
  correct_answer JSONB NOT NULL,
  explanation TEXT NOT NULL,
  distractor_explanations JSONB,
  concept_tested TEXT NOT NULL,
  source_id UUID REFERENCES public.question_sources(id) ON DELETE SET NULL,
  source_type TEXT NOT NULL DEFAULT 'LEARN_2_HIRE_ORIGINAL' CHECK (source_type IN ('OFFICIAL', 'OPEN_SOURCE', 'THIRD_PARTY', 'REPORTED_EXPERIENCE', 'LEARN_2_HIRE_ORIGINAL', 'AI_GENERATED')),
  source_url TEXT,
  quality_score NUMERIC(3,2) NOT NULL DEFAULT 4.50 CHECK (quality_score >= 1.00 AND quality_score <= 5.00),
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_questions_skill_diff ON public.questions(skill_id, difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_type ON public.questions(question_type);

CREATE TABLE IF NOT EXISTS public.assessment_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role_id UUID REFERENCES public.career_roles(id) ON DELETE SET NULL,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('BASELINE', 'TECHNICAL', 'APTITUDE', 'LOGICAL', 'ROLE', 'COMPANY_PATTERN')),
  total_questions INTEGER NOT NULL DEFAULT 10,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  passing_score NUMERIC(5,2) NOT NULL DEFAULT 70.00,
  skill_distribution JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS public.assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blueprint_id UUID NOT NULL REFERENCES public.assessment_blueprints(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'ABANDONED')),
  score NUMERIC(5,2) DEFAULT 0.00,
  passed BOOLEAN DEFAULT false,
  total_time_seconds INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user ON public.assessment_attempts(user_id);

CREATE TABLE IF NOT EXISTS public.assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  user_answer JSONB NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_attempt_question UNIQUE (attempt_id, question_id)
);
CREATE INDEX IF NOT EXISTS idx_assessment_answers_attempt ON public.assessment_answers(attempt_id);

-- 7. DOMAIN: LEARNING HUB & RESOURCES
CREATE TABLE IF NOT EXISTS public.resource_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  base_url TEXT NOT NULL,
  license_type TEXT NOT NULL DEFAULT 'OPEN_ACCESS',
  allows_deep_linking BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.resource_providers(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('L0', 'L1', 'L2', 'L3', 'L4', 'L5')),
  content_type TEXT NOT NULL CHECK (content_type IN ('COURSE', 'DOCUMENTATION', 'TUTORIAL', 'VIDEO', 'INTERACTIVE', 'BOOK')),
  duration_minutes INTEGER,
  is_free BOOLEAN NOT NULL DEFAULT true,
  has_certificate BOOLEAN NOT NULL DEFAULT false,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_resources_skill ON public.resources(skill_id);

CREATE TABLE IF NOT EXISTS public.learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_role_id UUID NOT NULL REFERENCES public.career_roles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_target_role_path UNIQUE (user_id, target_role_id)
);
CREATE INDEX IF NOT EXISTS idx_learning_paths_user ON public.learning_paths(user_id);

CREATE TABLE IF NOT EXISTS public.learning_path_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  sequence_order INTEGER NOT NULL,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  CONSTRAINT uq_path_sequence UNIQUE (learning_path_id, sequence_order)
);
CREATE INDEX IF NOT EXISTS idx_learning_path_items_path ON public.learning_path_items(learning_path_id);

-- 8. DOMAIN: PRACTICE ENGINE
CREATE TABLE IF NOT EXISTS public.practice_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('CODING', 'DSA', 'SQL', 'DEBUGGING', 'APTITUDE', 'LOGICAL', 'VERBAL', 'ROLE_CHALLENGE')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('L0', 'L1', 'L2', 'L3', 'L4', 'L5')),
  starter_code JSONB DEFAULT '{}'::jsonb,
  solution_code TEXT,
  test_cases JSONB DEFAULT '[]'::jsonb,
  hints TEXT[] DEFAULT '{}',
  source_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_practice_challenges_skill_cat ON public.practice_challenges(skill_id, category);

CREATE TABLE IF NOT EXISTS public.practice_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.practice_challenges(id) ON DELETE CASCADE,
  code_submitted TEXT,
  passed BOOLEAN NOT NULL DEFAULT false,
  test_cases_passed INTEGER NOT NULL DEFAULT 0,
  total_test_cases INTEGER NOT NULL DEFAULT 0,
  execution_time_ms INTEGER,
  score NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_practice_attempts_user ON public.practice_attempts(user_id);

-- 9. DOMAIN: REAL-WORLD PROJECTS & MILESTONES
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_role_id UUID NOT NULL REFERENCES public.career_roles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('L0', 'L1', 'L2', 'L3', 'L4', 'L5')),
  estimated_hours INTEGER NOT NULL DEFAULT 20,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  competencies_tested TEXT[] NOT NULL DEFAULT '{}',
  starter_repository_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  required_deliverable TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_project_milestones_proj ON public.project_milestones(project_id);

CREATE TABLE IF NOT EXISTS public.project_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  github_url TEXT NOT NULL,
  live_deployment_url TEXT,
  documentation_url TEXT,
  explanation_notes TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'EVALUATED', 'REVISION_REQUESTED')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_project_submission UNIQUE (user_id, project_id)
);
CREATE INDEX IF NOT EXISTS idx_project_submissions_user ON public.project_submissions(user_id);

CREATE TABLE IF NOT EXISTS public.project_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.project_submissions(id) ON DELETE CASCADE,
  overall_score NUMERIC(5,2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  passed BOOLEAN NOT NULL DEFAULT false,
  rubric_scores JSONB NOT NULL DEFAULT '[]'::jsonb,
  feedback_summary TEXT NOT NULL,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_submission_eval UNIQUE (submission_id)
);

-- 10. DOMAIN: INTERVIEWS & COMPANY PATTERNS
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  website_url TEXT,
  industry TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.company_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  assessment_sections TEXT[] NOT NULL DEFAULT '{}',
  technical_topics TEXT[] NOT NULL DEFAULT '{}',
  aptitude_topics TEXT[] NOT NULL DEFAULT '{}',
  interview_rounds JSONB NOT NULL DEFAULT '[]'::jsonb,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('L0', 'L1', 'L2', 'L3', 'L4', 'L5')),
  source TEXT NOT NULL DEFAULT 'REPORTED_EXPERIENCE',
  source_url TEXT,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_company_patterns_company ON public.company_patterns(company_id);

CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_role_id UUID NOT NULL REFERENCES public.career_roles(id) ON DELETE CASCADE,
  company_pattern_id UUID REFERENCES public.company_patterns(id) ON DELETE SET NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('TECHNICAL', 'HR', 'BEHAVIORAL', 'ROLE_SPECIFIC', 'MOCK')),
  level TEXT NOT NULL CHECK (level IN ('L0', 'L1', 'L2', 'L3', 'L4', 'L5')),
  status TEXT NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'TERMINATED')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user ON public.interview_sessions(user_id);

CREATE TABLE IF NOT EXISTS public.interview_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  technical_correctness_score NUMERIC(5,2) NOT NULL,
  communication_score NUMERIC(5,2) NOT NULL,
  problem_solving_score NUMERIC(5,2) NOT NULL,
  structural_clarity_score NUMERIC(5,2) NOT NULL,
  overall_score NUMERIC(5,2) NOT NULL,
  strengths TEXT[] DEFAULT '{}',
  areas_for_improvement TEXT[] DEFAULT '{}',
  detailed_report TEXT NOT NULL,
  disclaimer TEXT NOT NULL DEFAULT 'AI interview evaluation is an educational preparatory tool and does not guarantee employment outcomes.',
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_session_feedback UNIQUE (session_id)
);

-- 11. DOMAIN: RESUMES & ANALYZER
CREATE TABLE IF NOT EXISTS public.resume_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_role TEXT NOT NULL,
  summary TEXT NOT NULL,
  skills_included TEXT[] NOT NULL DEFAULT '{}',
  experience_ids UUID[] DEFAULT '{}',
  education_ids UUID[] DEFAULT '{}',
  project_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_resume_versions_user ON public.resume_versions(user_id);

CREATE TABLE IF NOT EXISTS public.resume_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_version_id UUID NOT NULL REFERENCES public.resume_versions(id) ON DELETE CASCADE,
  target_job_description TEXT,
  compatibility_score NUMERIC(5,2) NOT NULL,
  keyword_coverage_percent NUMERIC(5,2) NOT NULL,
  matched_keywords TEXT[] DEFAULT '{}',
  missing_keywords TEXT[] DEFAULT '{}',
  structural_issues TEXT[] DEFAULT '{}',
  actionable_recommendations TEXT[] DEFAULT '{}',
  analyzed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_version ON public.resume_analyses(resume_version_id);

-- 12. DOMAIN: OPPORTUNITIES & JOB MATCHING
CREATE TABLE IF NOT EXISTS public.job_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  base_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  rate_limit_per_minute INTEGER NOT NULL DEFAULT 60
);

CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL,
  provider_id UUID REFERENCES public.job_providers(id) ON DELETE SET NULL,
  source TEXT NOT NULL CHECK (source IN ('ADZUNA', 'JOOBLE', 'THE_MUSE', 'REMOTIVE', 'EMPLOYER_CAREER_PORTAL', 'DIRECT')),
  source_url TEXT NOT NULL,
  apply_url TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  title TEXT NOT NULL,
  normalized_title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  is_remote BOOLEAN NOT NULL DEFAULT false,
  employment_type TEXT NOT NULL CHECK (employment_type IN ('FULL_TIME', 'INTERNSHIP', 'APPRENTICESHIP', 'GRADUATE_TRAINEE', 'STARTUP', 'REMOTE', 'PART_TIME', 'CONTRACT')),
  experience_level_required TEXT,
  min_salary NUMERIC(10,2),
  max_salary NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',
  required_skills TEXT[] DEFAULT '{}',
  posted_at TIMESTAMPTZ NOT NULL,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  dedup_hash TEXT NOT NULL UNIQUE
);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON public.opportunities(employment_type);
CREATE INDEX IF NOT EXISTS idx_opportunities_remote ON public.opportunities(is_remote);
CREATE INDEX IF NOT EXISTS idx_opportunities_posted ON public.opportunities(posted_at DESC);

CREATE TABLE IF NOT EXISTS public.saved_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_saved_opp UNIQUE (user_id, opportunity_id)
);

-- 13. DOMAIN: APPLICATION TRACKER
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  resume_version_id UUID REFERENCES public.resume_versions(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'SAVED' CHECK (status IN ('SAVED', 'READY_TO_APPLY', 'APPLIED', 'SCREENING', 'ASSESSMENT', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN', 'CLOSED')),
  applied_date TIMESTAMPTZ,
  interview_date TIMESTAMPTZ,
  notes TEXT,
  outcome_reason TEXT DEFAULT 'Reason not provided',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_application UNIQUE (user_id, opportunity_id)
);
CREATE INDEX IF NOT EXISTS idx_applications_user_status ON public.applications(user_id, status);

CREATE TABLE IF NOT EXISTS public.application_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  event_timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_application_events_app ON public.application_events(application_id);

-- 14. DOMAIN: IMPROVEMENT ENGINE & RETRAINING
CREATE TABLE IF NOT EXISTS public.improvement_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('ASSESSMENT_WEAKNESS', 'PRACTICE_WEAKNESS', 'PROJECT_WEAKNESS', 'INTERVIEW_WEAKNESS', 'APPLICATION_REJECTION')),
  trigger_reference_id UUID,
  identified_gaps TEXT[] NOT NULL DEFAULT '{}',
  remedial_resource_ids UUID[] DEFAULT '{}',
  remedial_challenge_ids UUID[] DEFAULT '{}',
  reassessment_target_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_improvement_plans_user ON public.improvement_plans(user_id);

-- 15. DOMAIN: NOTIFICATIONS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('ASSESSMENT', 'LEARNING', 'PRACTICE', 'PROJECT', 'INTERVIEW', 'JOB', 'INTERNSHIP', 'APPLICATION', 'IMPROVEMENT', 'SYSTEM')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  domain TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);

-- 16. ROW-LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profile Access Policy
CREATE POLICY "Users can read own profile or public profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR is_public_profile = true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Standard User-Scoped Ownership Policies
CREATE POLICY "Users can manage own education" ON public.education FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own experience" ON public.experience FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own user_skills" ON public.user_skills FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own skill_gaps" ON public.skill_gaps FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own assessment_attempts" ON public.assessment_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own learning_paths" ON public.learning_paths FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own practice_attempts" ON public.practice_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own project_submissions" ON public.project_submissions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own interview_sessions" ON public.interview_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own resume_versions" ON public.resume_versions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own saved_opportunities" ON public.saved_opportunities FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own applications" ON public.applications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- Read-only Public Catalogs
ALTER TABLE public.career_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view career categories" ON public.career_categories FOR SELECT USING (true);

ALTER TABLE public.career_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view career roles" ON public.career_roles FOR SELECT USING (true);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);

ALTER TABLE public.career_role_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view career role skills" ON public.career_role_skills FOR SELECT USING (true);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view learning resources" ON public.resources FOR SELECT USING (true);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view opportunities" ON public.opportunities FOR SELECT USING (true);
