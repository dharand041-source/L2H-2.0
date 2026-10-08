-- ====================================================================
-- LEARN-2-HIRE 2.0: DATABASE MIGRATION 007
-- APPLICATION TRACKER PRODUCTION LIFECYCLE UPGRADE
-- Multi-status lifecycle, immutable events, outcome source attribution,
-- withdrawal flow, and RLS data isolation.
-- ====================================================================

-- 1. EXTEND STATUS CHECK CONSTRAINT ON APPLICATIONS
DO $$
BEGIN
  -- Drop existing status constraint if exists to update status domain
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'applications_status_check'
  ) THEN
    ALTER TABLE public.applications DROP CONSTRAINT applications_status_check;
  END IF;

  ALTER TABLE public.applications
  ADD CONSTRAINT applications_status_check CHECK (
    status IN (
      'SAVED',
      'DRAFT',
      'READY_TO_APPLY',
      'APPLICATION_STARTED',
      'APPLIED',
      'SCREENING',
      'ASSESSMENT',
      'INTERVIEW',
      'OFFER',
      'OFFER_ACCEPTED',
      'OFFER_DECLINED',
      'REJECTED',
      'WITHDRAWN',
      'CLOSED',
      'EXPIRED',
      'UNKNOWN'
    )
  );
END $$;

-- 2. ADD LIFECYCLE & OUTCOME COLUMNS TO APPLICATIONS
DO $$
BEGIN
  -- career_role_slug
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'career_role_slug') THEN
    ALTER TABLE public.applications ADD COLUMN career_role_slug TEXT;
  END IF;

  -- compatibility_score
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'compatibility_score') THEN
    ALTER TABLE public.applications ADD COLUMN compatibility_score INTEGER DEFAULT NULL;
  END IF;

  -- eligibility_status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'eligibility_status') THEN
    ALTER TABLE public.applications ADD COLUMN eligibility_status TEXT DEFAULT 'INSUFFICIENT_DATA';
  END IF;

  -- application_started_at
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'application_started_at') THEN
    ALTER TABLE public.applications ADD COLUMN application_started_at TIMESTAMPTZ;
  END IF;

  -- last_status_change_at
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'last_status_change_at') THEN
    ALTER TABLE public.applications ADD COLUMN last_status_change_at TIMESTAMPTZ DEFAULT now();
  END IF;

  -- outcome_reason_category
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'outcome_reason_category') THEN
    ALTER TABLE public.applications ADD COLUMN outcome_reason_category TEXT;
  END IF;

  -- outcome_source_type
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'outcome_source_type') THEN
    ALTER TABLE public.applications ADD COLUMN outcome_source_type TEXT DEFAULT 'UNKNOWN';
  END IF;

  -- outcome_source_confidence
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'outcome_source_confidence') THEN
    ALTER TABLE public.applications ADD COLUMN outcome_source_confidence TEXT DEFAULT 'UNKNOWN';
  END IF;

  -- withdrawal columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'withdrawn_at') THEN
    ALTER TABLE public.applications ADD COLUMN withdrawn_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'withdrawal_reason_category') THEN
    ALTER TABLE public.applications ADD COLUMN withdrawal_reason_category TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'withdrawal_reason_text') THEN
    ALTER TABLE public.applications ADD COLUMN withdrawal_reason_text TEXT;
  END IF;

  -- offer columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'offer_date') THEN
    ALTER TABLE public.applications ADD COLUMN offer_date TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'offer_details') THEN
    ALTER TABLE public.applications ADD COLUMN offer_details TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'offer_accepted_at') THEN
    ALTER TABLE public.applications ADD COLUMN offer_accepted_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'offer_declined_reason') THEN
    ALTER TABLE public.applications ADD COLUMN offer_declined_reason TEXT;
  END IF;

  -- follow up columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'follow_up_date') THEN
    ALTER TABLE public.applications ADD COLUMN follow_up_date TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'follow_up_notes') THEN
    ALTER TABLE public.applications ADD COLUMN follow_up_notes TEXT;
  END IF;

  -- apply url & job url
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'apply_url') THEN
    ALTER TABLE public.applications ADD COLUMN apply_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'job_url') THEN
    ALTER TABLE public.applications ADD COLUMN job_url TEXT;
  END IF;
END $$;

-- 3. EXTEND APPLICATION_EVENTS COLUMNS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'application_events' AND column_name = 'old_status') THEN
    ALTER TABLE public.application_events ADD COLUMN old_status TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'application_events' AND column_name = 'new_status') THEN
    ALTER TABLE public.application_events ADD COLUMN new_status TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'application_events' AND column_name = 'reason_category') THEN
    ALTER TABLE public.application_events ADD COLUMN reason_category TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'application_events' AND column_name = 'reason_text') THEN
    ALTER TABLE public.application_events ADD COLUMN reason_text TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'application_events' AND column_name = 'source_type') THEN
    ALTER TABLE public.application_events ADD COLUMN source_type TEXT DEFAULT 'UNKNOWN';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'application_events' AND column_name = 'metadata') THEN
    ALTER TABLE public.application_events ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- 4. PERFORMANCE & SCOPING INDEXES
CREATE INDEX IF NOT EXISTS idx_applications_user_role ON public.applications(user_id, career_role_slug);
CREATE INDEX IF NOT EXISTS idx_applications_user_applied ON public.applications(user_id, applied_date);
CREATE INDEX IF NOT EXISTS idx_applications_updated ON public.applications(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_application_events_app_time ON public.application_events(application_id, event_timestamp DESC);

-- 5. ROW LEVEL SECURITY RE-VERIFICATION
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own applications" ON public.applications;
CREATE POLICY "Users can manage own applications"
  ON public.applications FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own application events" ON public.application_events;
CREATE POLICY "Users can manage own application events"
  ON public.application_events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = application_events.application_id AND a.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = application_events.application_id AND a.user_id = auth.uid()
    )
  );
