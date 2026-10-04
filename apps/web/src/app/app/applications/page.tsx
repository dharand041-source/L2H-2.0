'use client';

import React from 'react';
import Link from 'next/link';
import {
  Kanban,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ApplicationsHubPage() {
  const { state } = useCandidateState();

  const pipelineStages = [
    { label: 'APPLIED', count: state.applications.filter(a => a.status === 'APPLIED').length },
    { label: 'SCREENING', count: state.applications.filter(a => a.status === 'SCREENING').length },
    { label: 'INTERVIEW', count: state.applications.filter(a => a.status === 'INTERVIEW').length },
    { label: 'OFFER', count: state.applications.filter(a => a.status === 'OFFER').length },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-orange text-white">
                Application Pipeline
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Full-Lifecycle Audit Trail
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Application Tracker
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Track candidate submissions from direct employer application to interview rounds, offers, and closed-loop feedback retraining.
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={ROUTES.app.applications.timeline}>
              <Button variant="outline" size="sm">
                <Clock className="w-4 h-4 mr-1.5 inline" /> Timeline View
              </Button>
            </Link>
            <Link href={ROUTES.app.applications.kanban}>
              <Button variant="primary" size="sm">
                <Kanban className="w-4 h-4 mr-1.5 inline" /> Interactive Kanban Board →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Pipeline Stages Metric Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pipelineStages.map((st) => (
          <div key={st.label} className="p-4 bg-brand-paper border-[1.5px] border-brand-ink shadow-editorial text-center">
            <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">{st.label}</span>
            <div className="font-display text-3xl font-bold text-brand-orange mt-1">{st.count}</div>
          </div>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">
            Active Submissions ({state.applications.length})
          </h2>
          <Link href={ROUTES.app.opportunities.jobs}>
            <Button variant="outline" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1 inline" /> Find More Openings
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {state.applications.map((app) => (
            <div
              key={app.id}
              className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-brand-ink/60 uppercase">{app.company}</span>
                  <Badge variant={app.status === 'OFFER' ? 'yellow' : app.status === 'REJECTED' ? 'rose' : 'default'}>
                    {app.status}
                  </Badge>
                  <span className="text-xs text-brand-ink/60">Applied: {app.appliedDate}</span>
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
                  {app.title}
                </h3>
                {app.outcomeReason && (
                  <div className="text-xs text-brand-rose font-medium mt-1">
                    Outcome Feedback: {app.outcomeReason}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {app.status === 'REJECTED' ? (
                  <Link href={ROUTES.app.improve.home}>
                    <Button variant="accent" size="sm">
                      <RefreshCw className="w-3.5 h-3.5 mr-1 inline" /> Retrain Feedback
                    </Button>
                  </Link>
                ) : (
                  <Link href={ROUTES.app.applications.detail(app.id)}>
                    <Button variant="outline" size="sm">
                      Application Details →
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
