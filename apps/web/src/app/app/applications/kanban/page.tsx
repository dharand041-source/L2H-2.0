'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Kanban,
  ArrowLeft,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApplicationRecord, ApplicationStatus, ApplicationStore } from '@/lib/applications';

type ColumnStatus =
  | 'SAVED'
  | 'APPLICATION_STARTED'
  | 'APPLIED'
  | 'SCREENING'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';

export default function ApplicationsKanbanPage() {
  const { state, updateApplicationStatus } = useCandidateState();

  const allApplications: ApplicationRecord[] = useMemo(() => {
    return state.applications && state.applications.length > 0
      ? state.applications
      : ApplicationStore.getApplications();
  }, [state.applications]);

  const columns: { id: ColumnStatus; label: string; badgeVariant: 'default' | 'yellow' | 'rose' }[] = [
    { id: 'SAVED', label: 'Saved', badgeVariant: 'default' },
    { id: 'APPLICATION_STARTED', label: 'Started', badgeVariant: 'default' },
    { id: 'APPLIED', label: 'Applied', badgeVariant: 'default' },
    { id: 'SCREENING', label: 'Screening', badgeVariant: 'yellow' },
    { id: 'INTERVIEW', label: 'Interview', badgeVariant: 'yellow' },
    { id: 'OFFER', label: 'Offer', badgeVariant: 'yellow' },
    { id: 'REJECTED', label: 'Rejected', badgeVariant: 'rose' },
    { id: 'WITHDRAWN', label: 'Withdrawn', badgeVariant: 'default' },
  ];

  const handleStatusChange = async (appId: string, newStatus: ColumnStatus) => {
    await updateApplicationStatus({
      applicationId: appId,
      newStatus,
      sourceType: 'CANDIDATE_REPORTED',
      sourceConfidence: 'CONFIRMED',
      reasonText: newStatus === 'REJECTED' ? 'Employer did not provide a reason.' : undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.applications.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Application Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Interactive Kanban Board</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-tight text-brand-ink">
            Application Pipeline Kanban
          </h1>
          <p className="text-sm text-brand-ink/80 mt-1">
            Visual stage management across saved drafts, external starts, confirmed applications, screening, interviews, and final outcomes.
          </p>
        </div>

        <Link href={ROUTES.app.opportunities.jobs}>
          <Button variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5 mr-1 inline" /> Find New Opportunities
          </Button>
        </Link>
      </div>

      {/* Kanban Multi-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 overflow-x-auto min-h-[520px]">
        {columns.map((col) => {
          const colApps = allApplications.filter((a) => {
            if (col.id === 'SCREENING') return a.status === 'SCREENING' || a.status === 'ASSESSMENT';
            if (col.id === 'OFFER') return a.status === 'OFFER' || a.status === 'OFFER_ACCEPTED' || a.status === 'OFFER_DECLINED';
            return a.status === col.id;
          });

          return (
            <div
              key={col.id}
              className="bg-brand-paper border-[1.5px] border-brand-ink p-3 shadow-editorial flex flex-col min-w-[210px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-brand-ink/20">
                <span className="font-display text-sm font-bold uppercase text-brand-ink truncate">
                  {col.label}
                </span>
                <span className="w-5 h-5 rounded-full bg-brand-cream border border-brand-ink text-brand-ink text-xs font-bold flex items-center justify-center shrink-0">
                  {colApps.length}
                </span>
              </div>

              {/* Cards in Column */}
              <div className="space-y-2.5 flex-1">
                {colApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 bg-brand-cream border border-brand-ink/30 shadow-editorial-sm space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-brand-ink/60 truncate">
                        {app.company}
                      </span>
                      {app.compatibilityScore !== undefined && (
                        <span className="font-mono text-[10px] font-bold text-brand-orange">
                          {app.compatibilityScore}%
                        </span>
                      )}
                    </div>

                    <Link href={ROUTES.app.applications.detail(app.id)} className="block hover:underline">
                      <h4 className="font-bold text-brand-ink line-clamp-2">
                        {app.title}
                      </h4>
                    </Link>

                    {app.resumeTitle && (
                      <div className="text-[10px] font-mono text-brand-ink/70 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-brand-ink/50" /> {app.resumeTitle}
                      </div>
                    )}

                    <div className="text-[10px] text-brand-ink/60">
                      {app.appliedDate ? `Applied: ${app.appliedDate}` : `Updated: ${new Date(app.lastStatusChangeAt || app.updatedAt).toLocaleDateString()}`}
                    </div>

                    {/* Status Mover Dropdown */}
                    <div className="pt-2 border-t border-brand-ink/10 flex items-center justify-between gap-1">
                      <select
                        value={app.status === 'ASSESSMENT' ? 'SCREENING' : app.status === 'OFFER_ACCEPTED' ? 'OFFER' : app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as ColumnStatus)}
                        className="p-1 bg-brand-paper border border-brand-ink text-[9px] font-bold uppercase text-brand-ink focus:outline-none flex-1 truncate"
                      >
                        {columns.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>

                      <Link href={ROUTES.app.applications.detail(app.id)} title="View Detail Record">
                        <button className="p-1 text-brand-ink hover:text-brand-orange">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}

                {colApps.length === 0 && (
                  <div className="p-4 text-center text-[10px] font-bold text-brand-ink/40 uppercase border border-dashed border-brand-ink/20">
                    No Submissions
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
