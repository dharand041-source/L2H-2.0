'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Clock, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, FileText, Building2 } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApplicationStore, ApplicationRecord, ApplicationEventRecord } from '@/lib/applications';

export default function ApplicationsTimelinePage() {
  const { state } = useCandidateState();

  const allApplications: ApplicationRecord[] = useMemo(() => {
    return state.applications && state.applications.length > 0
      ? state.applications
      : ApplicationStore.getApplications();
  }, [state.applications]);

  // Aggregate and sort all events chronologically across applications
  const timelineEvents = useMemo(() => {
    const list: Array<ApplicationEventRecord & { company: string; title: string; appRecordId: string }> = [];

    allApplications.forEach((app) => {
      (app.events || []).forEach((ev) => {
        list.push({
          ...ev,
          company: app.company,
          title: app.title,
          appRecordId: app.id,
        });
      });
    });

    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [allApplications]);

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.applications.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Applications Pipeline
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Audit Chronology</span>
      </div>

      {/* Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
            Application Timeline
          </h1>
          <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
            Chronological audit log of every application lifecycle event: saves, resume selections, portal opens, submissions, screening, interviews, and verified outcomes.
          </p>
        </div>

        <Link href={ROUTES.app.applications.kanban}>
          <Button variant="outline" size="sm">
            Kanban View →
          </Button>
        </Link>
      </div>

      {/* Events Feed */}
      <div className="space-y-4">
        {timelineEvents.length === 0 ? (
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-10 text-center shadow-editorial space-y-3">
            <Clock className="w-8 h-8 text-brand-orange mx-auto" />
            <h3 className="font-display text-xl uppercase tracking-tight text-brand-ink font-bold">
              No Timeline Events Recorded Yet
            </h3>
            <p className="text-xs text-brand-ink/75 max-w-md mx-auto leading-relaxed">
              Events are automatically recorded when you save opportunities, evaluate resumes, open external employer portals, confirm submissions, and log interview or outcome updates.
            </p>
            <div className="pt-2">
              <Link href={ROUTES.app.opportunities.jobs}>
                <Button variant="primary" size="sm">
                  Find Verified Vacancies →
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          timelineEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={ev.eventType === 'OFFER' ? 'yellow' : ev.eventType === 'REJECTED' ? 'rose' : 'default'}>
                    {ev.eventType.replace(/_/g, ' ')}
                  </Badge>
                  <span className="text-xs font-bold text-brand-ink/60 uppercase">
                    {ev.company}
                  </span>
                  <span className="text-xs text-brand-ink/50">
                    &bull; {new Date(ev.timestamp).toLocaleString()}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                  {ev.title}
                </h3>

                <p className="text-xs text-brand-ink/80 font-medium leading-relaxed">
                  {ev.description}
                </p>

                <div className="flex items-center gap-3 text-[10px] font-mono text-brand-ink/60 pt-1">
                  <span>Source: <strong className="text-brand-ink">{ev.sourceType}</strong></span>
                  <span>Confidence: <strong className="text-brand-orange">{ev.sourceConfidence}</strong></span>
                  {ev.reasonCategory && (
                    <span>Category: <strong>{ev.reasonCategory}</strong></span>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                <Link href={ROUTES.app.applications.detail(ev.appRecordId)}>
                  <Button variant="outline" size="sm" className="text-xs">
                    View Record →
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
