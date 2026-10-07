-- ==============================================================================
-- LEARN-2-HIRE 2.0 CANONICAL DATABASE MIGRATION (002)
-- Universal Question Engine, Anti-Repetition History, & Assessment Architecture
-- ==============================================================================

-- 1. EXTEND QUESTIONS TABLE WITH METADATA, TAXONOMY, & HASHING
ALTER TABLE public.questions 
  ADD COLUMN IF NOT EXISTS career_role_id UUID REFERENCES public.career_roles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS competency_id UUID REFERENCES public.competencies(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS subtopic TEXT,
  ADD COLUMN IF NOT EXISTS target_level TEXT DEFAULT 'L2',
  ADD COLUMN IF NOT EXISTS question_family TEXT,
  ADD COLUMN IF NOT EXISTS question_variant TEXT,
  ADD COLUMN IF NOT EXISTS solution TEXT,
  ADD COLUMN IF NOT EXISTS evaluation_data JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS expected_time_seconds INTEGER DEFAULT 60,
  ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 10,
  ADD COLUMN IF NOT EXISTS source_name TEXT,
  ADD COLUMN IF NOT EXISTS source_year INTEGER,
  ADD COLUMN IF NOT EXISTS source_company TEXT,
  ADD COLUMN IF NOT EXISTS source_confidence TEXT DEFAULT 'HIGH',
  ADD COLUMN IF NOT EXISTS originality_status TEXT DEFAULT 'ORIGINAL_L2H',
  ADD COLUMN IF NOT EXISTS fingerprint TEXT,
  ADD COLUMN IF NOT EXISTS normalized_hash TEXT,
  ADD COLUMN IF NOT EXISTS variant_group_id TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE';

-- Relax/update question_type check constraint to support universal assessment types
ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS questions_question_type_check;
ALTER TABLE public.questions ADD CONSTRAINT questions_question_type_check 
  CHECK (question_type IN (
    'MCQ', 'MULTI_SELECT', 'TRUE_FALSE', 'CODE_OUTPUT', 'CODE_COMPLETION',
    'CODING', 'DEBUGGING', 'SQL', 'DATABASE_DESIGN', 'API_DESIGN',
    'SYSTEM_DESIGN', 'ARCHITECTURE', 'SCENARIO', 'CASE_STUDY',
    'PROJECT_TASK', 'PRACTICAL_TASK', 'APTITUDE', 'LOGICAL_REASONING',
    'NUMERICAL_REASONING', 'DATA_INTERPRETATION', 'VERBAL_REASONING',
    'COMMUNICATION', 'BEHAVIORAL', 'ROLE_PLAY', 'PROJECT_DEFENSE',
    'TECHNICAL_INTERVIEW', 'HR_INTERVIEW', 'FOLLOW_UP', 'SHORT_ANSWER'
  ));

CREATE INDEX IF NOT EXISTS idx_questions_role ON public.questions(career_role_id);
CREATE INDEX IF NOT EXISTS idx_questions_family ON public.questions(question_family);
CREATE INDEX IF NOT EXISTS idx_questions_hash ON public.questions(normalized_hash);
CREATE INDEX IF NOT EXISTS idx_questions_status ON public.questions(status);

-- 2. USER QUESTION HISTORY TABLE (DETERMINISTIC ANTI-REPETITION)
CREATE TABLE IF NOT EXISTS public.user_question_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
  normalized_hash TEXT NOT NULL,
  question_family TEXT,
  variant_group_id TEXT,
  attempt_id UUID REFERENCES public.assessment_attempts(id) ON DELETE SET NULL,
  career_role_id UUID REFERENCES public.career_roles(id) ON DELETE SET NULL,
  seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  answered_correctly BOOLEAN DEFAULT false,
  score NUMERIC(5,2) DEFAULT 0.00,
  time_taken INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_uqh_user_hash ON public.user_question_history(user_id, normalized_hash);
CREATE INDEX IF NOT EXISTS idx_uqh_user_family ON public.user_question_history(user_id, question_family);
CREATE INDEX IF NOT EXISTS idx_uqh_user_role ON public.user_question_history(user_id, career_role_id);

-- 3. RLS POLICIES FOR USER QUESTION HISTORY & RELATED TABLES
ALTER TABLE public.user_question_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own question history"
  ON public.user_question_history FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own assessment_answers"
  ON public.assessment_answers FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.assessment_attempts a
    WHERE a.id = assessment_answers.attempt_id AND a.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own interview_feedback"
  ON public.interview_feedback FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.interview_sessions s
    WHERE s.id = interview_feedback.session_id AND s.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own skill_evidence"
  ON public.skill_evidence FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.user_skills u
    WHERE u.id = skill_evidence.user_skill_id AND u.user_id = auth.uid()
  ));
