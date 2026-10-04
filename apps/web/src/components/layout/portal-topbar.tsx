'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Settings, Target, ChevronRight, Award } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';

export const PortalTopbar: React.FC = () => {
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  return (
    <header className="h-16 border-b-[1.5px] border-brand-ink bg-brand-cream px-6 flex items-center justify-between shrink-0">
      {/* Target Career Status Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href={ROUTES.app.career.discover}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-paper border border-brand-ink shadow-editorial-sm text-xs font-bold uppercase tracking-wider text-brand-ink hover:text-brand-orange transition-colors"
        >
          <Target className="w-3.5 h-3.5 text-brand-orange" />
          <span>{currentRole ? currentRole.title : 'Select Career Goal'}</span>
          <ChevronRight className="w-3 h-3 text-brand-ink/40" />
        </Link>
        <span className="hidden sm:inline-block text-xs font-semibold text-brand-ink/60">
          Stage: <span className="font-bold text-brand-ink uppercase">{state.stage.replace(/_/g, ' ')}</span>
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Readiness Meter Pill */}
        <Link
          href={ROUTES.app.skills.analysis}
          className="inline-flex items-center gap-2 px-3 py-1 bg-brand-paper border border-brand-ink text-xs font-bold uppercase tracking-wider text-brand-ink hover:bg-brand-yellow/20 transition-colors shadow-editorial-sm"
        >
          <Award className="w-3.5 h-3.5 text-brand-yellow" />
          <span>Readiness: <strong className="text-brand-orange">{state.readinessScore}%</strong></span>
        </Link>

        {/* Notifications Icon with count */}
        <Link
          href={ROUTES.app.notifications}
          className="relative p-2 bg-brand-paper border border-brand-ink text-brand-ink hover:text-brand-orange transition-colors shadow-editorial-sm"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-orange text-white text-[8px] font-black rounded-full flex items-center justify-center">
            2
          </span>
        </Link>

        {/* Settings Shortcut */}
        <Link
          href={ROUTES.app.settings}
          className="p-2 bg-brand-paper border border-brand-ink text-brand-ink hover:text-brand-orange transition-colors shadow-editorial-sm"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};
