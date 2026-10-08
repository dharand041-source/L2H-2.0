-- ==============================================================================
-- LEARN-2-HIRE 2.0: MASTER RESUME, ATS & OPPORTUNITY ENGINE MIGRATION (006)
-- Engine: PostgreSQL 15+ (Supabase)
-- Philosophy: Private storage, non-destructive versioning, transparent scoring models,
--             zero fabricated vacancies, Row Level Security (RLS) enforcement.
-- ==============================================================================

-- 1. RESUME VERSIONS TABLE (Phase 21, 22: Private Storage & Multi-Version Vault)
-- Preserves every document uploaded or modified (V1, V2, V3...) without destructive overwrites.
CREATE TABLE IF NOT EXISTS public.resume_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  target_role TEXT NOT NULL DEFAULT 'full-stack-developer',
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('PDF', 'DOCX', 'TXT')),
  file_size INTEGER NOT NULL DEFAULT 0,
  storage_path TEXT, -- Private bucket path: resumes/{user_id}/{version_id}.pdf
  checksum TEXT NOT NULL, -- SHA-256 normalized hash for exact duplicate detection
  raw_text TEXT NOT NULL,
  parsed_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_resume_version UNIQUE (user_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_resume_versions_user ON public.resume_versions(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_versions_checksum ON public.resume_versions(checksum);

-- 2. RESUME ANALYSES TABLE (Phase 26, 27, 28, 76, 78: Transparent ATS Compatibility & Model Versioning)
-- Stores calculated compatibility scores against specific job descriptions using configurable weights.
CREATE TABLE IF NOT EXISTS public.resume_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_version_id UUID NOT NULL REFERENCES public.resume_versions(id) ON DELETE CASCADE,
  target_job_description TEXT NOT NULL,
  target_job_title TEXT NOT NULL,
  target_company TEXT NOT NULL,
  scoring_model_version TEXT NOT NULL DEFAULT 'ATS-L2H-2026.1',
  compatibility_score NUMERIC(5,2) NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  eligibility_status TEXT NOT NULL DEFAULT 'POTENTIALLY_ELIGIBLE' CHECK (eligibility_status IN ('ELIGIBLE', 'POTENTIALLY_ELIGIBLE', 'NOT_ELIGIBLE', 'INSUFFICIENT_DATA')),
  eligibility_reason TEXT NOT NULL,
  matched_required_skills TEXT[] NOT NULL DEFAULT '{}',
  missing_required_skills TEXT[] NOT NULL DEFAULT '{}',
  matched_preferred_skills TEXT[] NOT NULL DEFAULT '{}',
  missing_preferred_skills TEXT[] NOT NULL DEFAULT '{}',
  dimensions_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  analyzed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resume_analyses_version ON public.resume_analyses(resume_version_id);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_score ON public.resume_analyses(compatibility_score DESC);

-- 3. HISTORICAL JOB SNAPSHOTS TABLE (Phase 37, 38, 77: Live vs Historical Vacancy Auditing)
-- Allows historical market demand tracking while cleanly segregating inactive from live listings.
CREATE TABLE IF NOT EXISTS public.job_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL,
  source TEXT NOT NULL,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  location TEXT NOT NULL,
  is_tamil_nadu BOOLEAN NOT NULL DEFAULT false,
  is_remote BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL CHECK (category IN ('JOB', 'INTERNSHIP', 'STARTUP')),
  verification_status TEXT NOT NULL DEFAULT 'LIVE' CHECK (verification_status IN ('LIVE', 'RECENTLY_VERIFIED', 'UNCONFIRMED', 'HISTORICAL')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  required_skills TEXT[] NOT NULL DEFAULT '{}',
  preferred_skills TEXT[] NOT NULL DEFAULT '{}',
  raw_snapshot_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_snapshots_active ON public.job_snapshots(is_active, verification_status);
CREATE INDEX IF NOT EXISTS idx_job_snapshots_tamil_nadu ON public.job_snapshots(is_tamil_nadu);

-- 4. APPLICATION TRACKER EXTENSION (Phase 49, 50: Associate Submissions with Specific Resume Versions)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'resume_version_id'
  ) THEN
    ALTER TABLE public.applications
    ADD COLUMN resume_version_id UUID REFERENCES public.resume_versions(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 5. ROW LEVEL SECURITY (RLS) POLICIES (Phase 21, 58: Data Privacy Enforcement)
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_snapshots ENABLE ROW LEVEL SECURITY;

-- Resume Versions Policies: Users can only view, insert, update, or delete their own documents
DROP POLICY IF EXISTS "Users can view own resume versions" ON public.resume_versions;
CREATE POLICY "Users can view own resume versions"
  ON public.resume_versions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own resume versions" ON public.resume_versions;
CREATE POLICY "Users can create own resume versions"
  ON public.resume_versions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own resume versions" ON public.resume_versions;
CREATE POLICY "Users can update own resume versions"
  ON public.resume_versions FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own resume versions" ON public.resume_versions;
CREATE POLICY "Users can delete own resume versions"
  ON public.resume_versions FOR DELETE
  USING (auth.uid() = user_id);

-- Resume Analyses Policies: Inherits security from resume_versions
DROP POLICY IF EXISTS "Users can view own resume analyses" ON public.resume_analyses;
CREATE POLICY "Users can view own resume analyses"
  ON public.resume_analyses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.resume_versions rv
      WHERE rv.id = resume_analyses.resume_version_id AND rv.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own resume analyses" ON public.resume_analyses;
CREATE POLICY "Users can insert own resume analyses"
  ON public.resume_analyses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.resume_versions rv
      WHERE rv.id = resume_analyses.resume_version_id AND rv.user_id = auth.uid()
    )
  );

-- Job Snapshots Policies: Public read access for verified vacancies, restricted write access
DROP POLICY IF EXISTS "Public can view verified job snapshots" ON public.job_snapshots;
CREATE POLICY "Public can view verified job snapshots"
  ON public.job_snapshots FOR SELECT
  USING (true);
