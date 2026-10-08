-- =============================================================================
-- LEARN-2-HIRE 2.0: MIGRATION 005 - CAREER-AWARE DYNAMIC ROADMAP ENGINE
-- =============================================================================
-- Enhances learning_paths and learning_path_items to support:
-- 1. Career-specific role blueprints across all 12 supported platform roles
-- 2. Roadmap node types (LEARN, PRACTICE, CODE, PROJECT, INTERVIEW, REASSESSMENT)
-- 3. Dynamic node statuses (LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED, RECOMMENDED)
-- 4. Prerequisite DAG tracking and estimated effort
-- 5. RLS security ensuring candidates only access their own private roadmaps

-- 1. Extend learning_paths table
ALTER TABLE public.learning_paths
  ADD COLUMN IF NOT EXISTS roadmap_version TEXT NOT NULL DEFAULT '2026.1',
  ADD COLUMN IF NOT EXISTS source_version TEXT NOT NULL DEFAULT 'Industry Standards 2026',
  ADD COLUMN IF NOT EXISTS user_mode TEXT NOT NULL DEFAULT 'BEGINNER' CHECK (user_mode IN ('BEGINNER', 'AMATEUR', 'PROFESSIONAL')),
  ADD COLUMN IF NOT EXISTS total_nodes INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completed_nodes INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS estimated_total_hours NUMERIC(6,1) NOT NULL DEFAULT 0.0;

-- 2. Extend learning_path_items table
ALTER TABLE public.learning_path_items
  ADD COLUMN IF NOT EXISTS node_id TEXT,
  ADD COLUMN IF NOT EXISTS node_type TEXT NOT NULL DEFAULT 'LEARN' 
    CHECK (node_type IN ('LEARN', 'READ', 'WATCH', 'PRACTICE', 'CODE', 'CASE_STUDY', 'PROJECT', 'QUIZ', 'ASSESSMENT', 'INTERVIEW', 'RESOURCE', 'REASSESSMENT', 'PROOF')),
  ADD COLUMN IF NOT EXISTS node_status TEXT NOT NULL DEFAULT 'LOCKED'
    CHECK (node_status IN ('LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED', 'RECOMMENDED', 'REASSESSMENT_REQUIRED')),
  ADD COLUMN IF NOT EXISTS phase_id TEXT NOT NULL DEFAULT 'PHASE_01_FOUNDATIONS'
    CHECK (phase_id IN ('PHASE_01_FOUNDATIONS', 'PHASE_02_CORE_SKILLS', 'PHASE_03_APPLIED_PRACTICE', 'PHASE_04_ADVANCED_SKILLS', 'PHASE_05_PROJECT_PROOF', 'PHASE_06_INTERVIEW_READINESS', 'PHASE_07_JOB_READINESS', 'PHASE_08_CONTINUOUS_IMPROVEMENT')),
  ADD COLUMN IF NOT EXISTS phase_title TEXT,
  ADD COLUMN IF NOT EXISTS prerequisites TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS estimated_hours NUMERIC(4,1) NOT NULL DEFAULT 4.0,
  ADD COLUMN IF NOT EXISTS why_reason TEXT,
  ADD COLUMN IF NOT EXISTS current_level TEXT NOT NULL DEFAULT 'L0' CHECK (current_level IN ('L0', 'L1', 'L2', 'L3', 'L4', 'L5')),
  ADD COLUMN IF NOT EXISTS target_level TEXT NOT NULL DEFAULT 'L4' CHECK (target_level IN ('L1', 'L2', 'L3', 'L4', 'L5')),
  ADD COLUMN IF NOT EXISTS gap INTEGER NOT NULL DEFAULT 0;

-- Make skill_id optional in learning_path_items if referencing composite blueprint nodes
ALTER TABLE public.learning_path_items
  ALTER COLUMN skill_id DROP NOT NULL;

-- 3. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_learning_paths_target_role 
  ON public.learning_paths(target_role_id);

CREATE INDEX IF NOT EXISTS idx_learning_path_items_node_status 
  ON public.learning_path_items(learning_path_id, node_status);

CREATE INDEX IF NOT EXISTS idx_learning_path_items_phase 
  ON public.learning_path_items(learning_path_id, phase_id);

CREATE INDEX IF NOT EXISTS idx_learning_path_items_node_id 
  ON public.learning_path_items(node_id);

-- 4. Row Level Security Policies
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_path_items ENABLE ROW LEVEL SECURITY;

-- Candidates can view their own learning paths
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'learning_paths' AND policyname = 'Candidates can view their own learning paths'
  ) THEN
    CREATE POLICY "Candidates can view their own learning paths"
      ON public.learning_paths
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Candidates can insert their own learning paths
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'learning_paths' AND policyname = 'Candidates can insert their own learning paths'
  ) THEN
    CREATE POLICY "Candidates can insert their own learning paths"
      ON public.learning_paths
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Candidates can update their own learning paths
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'learning_paths' AND policyname = 'Candidates can update their own learning paths'
  ) THEN
    CREATE POLICY "Candidates can update their own learning paths"
      ON public.learning_paths
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Candidates can view their own path items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'learning_path_items' AND policyname = 'Candidates can view their own path items'
  ) THEN
    CREATE POLICY "Candidates can view their own path items"
      ON public.learning_path_items
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.learning_paths lp
          WHERE lp.id = learning_path_items.learning_path_id
            AND lp.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Candidates can update their own path items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'learning_path_items' AND policyname = 'Candidates can update their own path items'
  ) THEN
    CREATE POLICY "Candidates can update their own path items"
      ON public.learning_path_items
      FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.learning_paths lp
          WHERE lp.id = learning_path_items.learning_path_id
            AND lp.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Candidates can insert their own path items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'learning_path_items' AND policyname = 'Candidates can insert their own path items'
  ) THEN
    CREATE POLICY "Candidates can insert their own path items"
      ON public.learning_path_items
      FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.learning_paths lp
          WHERE lp.id = learning_path_items.learning_path_id
            AND lp.user_id = auth.uid()
        )
      );
  END IF;
END $$;
