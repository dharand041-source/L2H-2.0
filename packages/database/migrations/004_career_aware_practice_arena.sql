-- ==============================================================================
-- LEARN-2-HIRE 2.0 CANONICAL DATABASE MIGRATION (004)
-- Career-Aware Practice Arena: Role Blueprints, Scoped Challenges & Attempts
-- ==============================================================================

-- 1. PRACTICE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.practice_categories (
  id TEXT PRIMARY KEY,
  career_role_id UUID NOT NULL REFERENCES public.career_roles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  short_title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Code2',
  environment TEXT NOT NULL DEFAULT 'CodeExecutionEnvironment',
  evaluation_type TEXT NOT NULL DEFAULT 'AUTOMATED_TESTS',
  skill_ids TEXT[] NOT NULL DEFAULT '{}',
  difficulty_range TEXT[] NOT NULL DEFAULT ARRAY['BEGINNER', 'EXPERT'],
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  free_learning_url TEXT,
  free_learning_provider TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_practice_categories_role ON public.practice_categories(career_role_id);
CREATE INDEX IF NOT EXISTS idx_practice_categories_order ON public.practice_categories(display_order);

-- 2. EXTEND PRACTICE CHALLENGES TABLE FOR ROLE SCOPING & ANTI-REPETITION
ALTER TABLE public.practice_challenges
  ADD COLUMN IF NOT EXISTS career_role_id UUID REFERENCES public.career_roles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS category_id TEXT,
  ADD COLUMN IF NOT EXISTS competency_id UUID REFERENCES public.competencies(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS challenge_type TEXT DEFAULT 'CODING',
  ADD COLUMN IF NOT EXISTS target_level TEXT DEFAULT 'L2',
  ADD COLUMN IF NOT EXISTS environment TEXT DEFAULT 'CodeExecutionEnvironment',
  ADD COLUMN IF NOT EXISTS evaluation_type TEXT DEFAULT 'AUTOMATED_TESTS',
  ADD COLUMN IF NOT EXISTS question_family TEXT,
  ADD COLUMN IF NOT EXISTS variant_group_id TEXT,
  ADD COLUMN IF NOT EXISTS expected_time_minutes INTEGER DEFAULT 15,
  ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'LEARN_2_HIRE_ORIGINAL',
  ADD COLUMN IF NOT EXISTS source_name TEXT DEFAULT 'Learn-2-Hire Original',
  ADD COLUMN IF NOT EXISTS normalized_hash TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS scenario_data JSONB DEFAULT '{}'::jsonb;

-- Drop obsolete category check constraint to allow role-specific categories
ALTER TABLE public.practice_challenges DROP CONSTRAINT IF EXISTS practice_challenges_category_check;

CREATE INDEX IF NOT EXISTS idx_practice_challenges_role ON public.practice_challenges(career_role_id);
CREATE INDEX IF NOT EXISTS idx_practice_challenges_role_cat ON public.practice_challenges(career_role_id, category_id);
CREATE INDEX IF NOT EXISTS idx_practice_challenges_hash ON public.practice_challenges(normalized_hash);
CREATE INDEX IF NOT EXISTS idx_practice_challenges_family ON public.practice_challenges(question_family);

-- 3. EXTEND PRACTICE ATTEMPTS TABLE FOR ROLE SCOPING & SKILL EVIDENCE
ALTER TABLE public.practice_attempts
  ADD COLUMN IF NOT EXISTS career_role_id UUID REFERENCES public.career_roles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS category_id TEXT,
  ADD COLUMN IF NOT EXISTS skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS execution_result JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS skill_evidence JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_practice_attempts_user_role ON public.practice_attempts(user_id, career_role_id);
CREATE INDEX IF NOT EXISTS idx_practice_attempts_challenge ON public.practice_attempts(challenge_id);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.practice_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY;

-- Practice Categories: Public read for all authenticated users
DROP POLICY IF EXISTS "Anyone can view active practice categories" ON public.practice_categories;
CREATE POLICY "Anyone can view active practice categories"
  ON public.practice_categories FOR SELECT
  USING (is_active = true);

-- Practice Challenges: Public read for active challenges (hidden test expressions stay server-side)
DROP POLICY IF EXISTS "Anyone can view active practice challenges" ON public.practice_challenges;
CREATE POLICY "Anyone can view active practice challenges"
  ON public.practice_challenges FOR SELECT
  USING (status = 'ACTIVE');

-- Practice Attempts: Scoped strictly to the authenticated user
DROP POLICY IF EXISTS "Users can read own practice attempts" ON public.practice_attempts;
CREATE POLICY "Users can read own practice attempts"
  ON public.practice_attempts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own practice attempts" ON public.practice_attempts;
CREATE POLICY "Users can insert own practice attempts"
  ON public.practice_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own practice attempts" ON public.practice_attempts;
CREATE POLICY "Users can update own practice attempts"
  ON public.practice_attempts FOR UPDATE
  USING (auth.uid() = user_id);
