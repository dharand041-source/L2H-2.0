'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Kanban,
  ArrowLeft,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type ColumnStatus = 'SAVED' | 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'REJECTED';

export default function ApplicationsKanbanPage() {
  const { state, updateState } = useCandidateState();

  const columns: { id: ColumnStatus; label: string; badgeVariant: 'default' | 'yellow' | 'rose' }[] = [
    { id: 'SAVED', label: 'Saved', badgeVariant: 'default' },
    { id: 'APPLIED', label: 'Applied', badgeVariant: 'default' },
    { id: 'SCREENING', label: 'Screening', badgeVariant: 'yellow' },
    { id: 'INTERVIEW', label: 'Interview', badgeVariant: 'yellow' },
    { id: 'OFFER', label: 'Offer', badgeVariant: 'yellow' },
    { id: 'REJECTED', label: 'Outcome / Rejected', badgeVariant: 'rose' },
  ];

  const handleStatusChange = (appId: string, newStatus: ColumnStatus, outcomeReason?: string) => {
    updateState((prev) => ({
      ...prev,
      applications: prev.applications.map((a) =>
        a.id === appId
          ? { ...a, status: newStatus, ...(outcomeReason ? { outcomeReason } : {}) }
          : a
      ),
    }));
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
            Drag, transition, or update status across screening, interviews, and final outcomes. If rejected, trigger immediate closed-loop retraining.
          </p>
        </div>

        <Link href={ROUTES.app.opportunities.jobs}>
          <Button variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5 mr-1 inline" /> Find New Opportunities
          </Button>
        </Link>
      </div>

      {/* Kanban Multi-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto min-h-[500px]">
        {columns.map((col) => {
          const colApps = state.applications.filter((a) => a.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-brand-paper border-[1.5px] border-brand-ink p-3 shadow-editorial flex flex-col min-w-[220px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-brand-ink/20">
                <span className="font-display text-base font-bold uppercase text-brand-ink">
                  {col.label}
                </span>
                <span className="w-5 h-5 rounded-full bg-brand-cream border border-brand-ink text-brand-ink text-xs font-bold flex items-center justify-center">
                  {colApps.length}
                </span>
              </div>

              {/* Cards in Column */}
              <div className="space-y-3 flex-1">
                {colApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 bg-brand-cream border border-brand-ink/30 shadow-editorial-sm space-y-2 text-xs"
                  >
                    <span className="text-[10px] font-extrabold uppercase text-brand-ink/60 block">
                      {app.company}
                    </span>
                    <h4 className="font-bold text-brand-ink line-clamp-2">
                      {app.title}
                    </h4>
                    <div className="text-[10px] text-brand-ink/60">
                      Applied: {app.appliedDate}
                    </div>

                    {/* Status Mover Dropdown */}
                    <div className="pt-2 border-t border-brand-ink/10 flex items-center justify-between">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as ColumnStatus)}
                        className="p-1 bg-brand-paper border border-brand-ink text-[10px] font-bold uppercase text-brand-ink focus:outline-none"
                      >
                        {columns.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>

                      {app.status === 'REJECTED' && (
                        <Link href={ROUTES.app.improve.home} title="Trigger Retraining">
                          <button className="p-1 text-brand-rose hover:text-brand-orange">
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}

                {colApps.length === 0 && (
                  <div className="p-4 text-center text-[10px] font-bold text-brand-ink/40 uppercase border border-dashed border-brand-ink/20">
                    No Applications
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
