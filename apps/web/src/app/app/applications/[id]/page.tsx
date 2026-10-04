'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Kanban, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { state, updateState } = useCandidateState();

  const application = state.applications.find(a => a.id === id) || state.applications[0];
  const [outcomeReason, setOutcomeReason] = useState(application?.outcomeReason || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleRecordOutcome = (status: 'OFFER' | 'REJECTED') => {
    updateState((prev) => ({
      ...prev,
      applications: prev.applications.map((a) =>
        a.id === application.id
          ? { ...a, status, outcomeReason: outcomeReason.trim() ? outcomeReason : 'Reason not provided.' }
          : a
      ),
      stage: status === 'REJECTED' ? 'RETRAINING' : 'OUTCOME_RECORDED',
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.applications.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Applications Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Application Record: {id}</span>
      </div>

      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-ink/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={application.status === 'OFFER' ? 'yellow' : application.status === 'REJECTED' ? 'rose' : 'default'}>
                {application.status}
              </Badge>
              <span className="text-xs font-semibold text-brand-ink/60">Applied: {application.appliedDate}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl uppercase text-brand-ink">
              {application.title}
            </h1>
            <span className="text-sm font-bold text-brand-orange">{application.company}</span>
          </div>

          <div className="shrink-0 flex gap-2">
            <Link href={ROUTES.app.applications.kanban}>
              <Button variant="outline" size="sm">Kanban Board</Button>
            </Link>
          </div>
        </div>

        {/* Outcome Recording Section (Section 36) */}
        <div className="p-6 bg-brand-cream border border-brand-ink/30 space-y-4">
          <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
            Record Final Employer Outcome
          </h3>
          <p className="text-xs text-brand-ink/80 font-medium">
            Did you receive an offer or a rejection? If the employer provided feedback, record it below to automatically configure targeted retraining.
          </p>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
              Employer Feedback / Reason (Optional):
            </label>
            <input
              type="text"
              value={outcomeReason}
              onChange={(e) => setOutcomeReason(e.target.value)}
              placeholder="e.g. Required deeper Docker container orchestration experience, or leave empty if not provided..."
              className="w-full p-2.5 bg-brand-paper border border-brand-ink text-xs text-brand-ink focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="accent"
              size="sm"
              onClick={() => handleRecordOutcome('OFFER')}
            >
              Record Offer / Hired!
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleRecordOutcome('REJECTED')}
            >
              Record Rejection &bull; Trigger Retraining
            </Button>
            {savedSuccess && (
              <span className="text-xs font-bold text-brand-orange flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Outcome Recorded!
              </span>
            )}
          </div>
        </div>

        {application.status === 'REJECTED' && (
          <div className="p-4 bg-brand-paper border border-brand-rose space-y-2">
            <div className="font-display text-lg uppercase text-brand-rose font-bold">
              Closed-Loop Retraining Recommended
            </div>
            <p className="text-xs text-brand-ink/80">
              Turn rejection feedback into verified skill upgrades. Launch your targeted retraining curriculum and prepare for reassessment.
            </p>
            <Link href={ROUTES.app.improve.home}>
              <Button variant="primary" size="sm">
                Open Retraining Module →
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
