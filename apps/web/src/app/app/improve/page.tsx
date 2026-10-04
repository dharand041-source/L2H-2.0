'use client';

import React from 'react';
import Link from 'next/link';
import {
  RefreshCw,
  TrendingUp,
  AlertCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Award
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ImproveHubPage() {
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-rose text-white">
                Closed-Loop Engineering
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Retrain &bull; Reassess &bull; Upgrade
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Improvement &amp; Retraining Loop
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Never let an interview mistake or application rejection go unaddressed. The closed loop automatically creates remediation modules and launches targeted reassessments.
            </p>
          </div>

          <Link href={ROUTES.app.improve.reassessment}>
            <Button variant="primary" size="md">
              Launch Reassessment Test <ArrowRight className="ml-2 w-4 h-4 inline" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Loop Visualizer Banner */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <Badge variant="yellow">Continuous Calibration Loop</Badge>
            <h2 className="font-display text-3xl font-bold uppercase text-brand-ink">
              Turn Rejection Into Verified Competency
            </h2>
            <p className="text-sm text-brand-ink/85 font-medium leading-relaxed max-w-2xl">
              When an employer provides feedback or an assessment identifies low confidence, Learn-2-Hire queues targeted learning modules, code practice, and a focused reassessment that updates your Skill Analyzer score.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link href={ROUTES.app.improve.retraining}>
                <Button variant="primary" size="sm">
                  Active Retraining Modules →
                </Button>
              </Link>
              <Link href={ROUTES.app.improve.reassessment}>
                <Button variant="outline" size="sm">
                  Take Targeted Reassessment →
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 bg-brand-cream border border-brand-ink/30 space-y-2 text-xs font-mono">
            <div className="font-bold text-brand-ink text-sm pb-1 border-b border-brand-ink/20">Loop Architecture:</div>
            <div>&gt; OUTCOME (Rejection Feedback)</div>
            <div>&gt; SKILL GAP EXTRACTION</div>
            <div>&gt; TARGETED RETRAINING (FCC/MDN)</div>
            <div>&gt; REASSESSMENT (Weak Areas)</div>
            <div className="text-brand-orange font-bold">&gt; SKILL ANALYZER UPGRADED</div>
          </div>
        </div>
      </div>

      {/* Retraining Modules & Reassessment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card accentBorder="rose" hoverable className="space-y-3">
          <Badge variant="rose">STEP 1 &bull; DIAGNOSE</Badge>
          <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
            Skill Gaps Analysis
          </h3>
          <p className="text-xs text-brand-ink/80 font-medium">
            Review weighted step differentials and priority rankings across all target role skills.
          </p>
          <Link href={ROUTES.app.improve.skillGaps}>
            <Button variant="outline" size="sm">
              Review Gaps →
            </Button>
          </Link>
        </Card>

        <Card accentBorder="yellow" hoverable className="space-y-3">
          <Badge variant="yellow">STEP 2 &bull; RETRAIN</Badge>
          <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
            Targeted Retraining
          </h3>
          <p className="text-xs text-brand-ink/80 font-medium">
            Directed lessons targeting Node.js async streams, React reconciliations, and SQL optimization.
          </p>
          <Link href={ROUTES.app.improve.retraining}>
            <Button variant="outline" size="sm">
              Start Retraining →
            </Button>
          </Link>
        </Card>

        <Card accentBorder="orange" hoverable className="space-y-3">
          <Badge variant="default">STEP 3 &bull; RECALIBRATE</Badge>
          <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
            Targeted Reassessment
          </h3>
          <p className="text-xs text-brand-ink/80 font-medium">
            Verify newly acquired capabilities and upgrade your passport from L1/L2 to verified L3.
          </p>
          <Link href={ROUTES.app.improve.reassessment}>
            <Button variant="primary" size="sm">
              Launch Test →
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
