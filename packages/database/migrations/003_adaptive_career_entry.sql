-- ==============================================================================
-- LEARN-2-HIRE 2.0 CANONICAL DATABASE MIGRATION (003)
-- Adaptive Career Entry, Calibration Levels, & Multi-Factor Assessment Model
-- ==============================================================================

-- 1. EXTEND ASSESSMENT ATTEMPTS FOR ADAPTIVE CALIBRATION
ALTER TABLE public.assessment_attempts
  ADD COLUMN IF NOT EXISTS career_role_id UUID REFERENCES public.career_roles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS entry_level TEXT DEFAULT 'BEGINNER' CHECK (entry_level IN ('BEGINNER', 'AMATEUR', 'PROFESSIONAL')),
  ADD COLUMN IF NOT EXISTS calibrated_level TEXT DEFAULT 'L1' CHECK (calibrated_level IN ('L0', 'L1', 'L2', 'L3', 'L4', 'L5')),
  ADD COLUMN IF NOT EXISTS weighted_score NUMERIC(5,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS readiness_score NUMERIC(5,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS skill_scores JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS question_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS correct_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_assessment_attempts_role ON public.assessment_attempts(career_role_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_entry_level ON public.assessment_attempts(entry_level);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user_role ON public.assessment_attempts(user_id, career_role_id);

-- 2. EXTEND ASSESSMENT ANSWERS FOR SECTION & DIFFICULTY TRACKING
ALTER TABLE public.assessment_answers
  ADD COLUMN IF NOT EXISTS career_role_id UUID REFERENCES public.career_roles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'L2',
  ADD COLUMN IF NOT EXISTS skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS question_family TEXT,
  ADD COLUMN IF NOT EXISTS response_time_ms INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS score NUMERIC(5,2) DEFAULT 0.00;

CREATE INDEX IF NOT EXISTS idx_assessment_answers_role ON public.assessment_answers(career_role_id);
CREATE INDEX IF NOT EXISTS idx_assessment_answers_skill ON public.assessment_answers(skill_id);

-- 3. VALIDATION TEST RUNS TABLE (FOR TRL 4 LABORATORY AUDIT TRAILS)
CREATE TABLE IF NOT EXISTS public.validation_test_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id TEXT NOT NULL,
  component TEXT NOT NULL,
  input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  expected_output JSONB NOT NULL DEFAULT '{}'::jsonb,
  actual_output JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL CHECK (status IN ('PASS', 'FAIL', 'SKIPPED')),
  duration_ms INTEGER DEFAULT 0,
  environment TEXT NOT NULL DEFAULT 'LABORATORY_TRL4',
  version TEXT NOT NULL DEFAULT '2.0.0',
  executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_validation_test_runs_test_id ON public.validation_test_runs(test_id);
CREATE INDEX IF NOT EXISTS idx_validation_test_runs_status ON public.validation_test_runs(status);

-- Enable RLS for validation_test_runs (read-only for all authenticated users)
ALTER TABLE public.validation_test_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read validation test runs"
  ON public.validation_test_runs FOR SELECT
  USING (true);
