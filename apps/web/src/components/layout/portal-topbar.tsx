'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Settings, Target, ChevronRight, Award, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { useSidebar } from './sidebar-context';

export const PortalTopbar: React.FC = () => {
  const { state } = useCandidateState();
  const { isOpen, toggle } = useSidebar();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  return (
    <header className="h-16 border-b-[1.5px] border-brand-ink bg-brand-cream px-3 sm:px-6 flex items-center justify-between shrink-0 gap-2 sm:gap-3">
      {/* Left controls: Sidebar toggle (desktop only) & Target Career Status */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Sidebar Toggle Button - hidden on mobile, visible on desktop */}
        <button
          onClick={toggle}
          className="hidden lg:inline-flex items-center gap-2 px-2.5 py-1.5 bg-brand-paper border border-brand-ink shadow-editorial-sm text-xs font-bold uppercase tracking-wider text-brand-ink hover:text-brand-orange hover:bg-brand-yellow/10 transition-all cursor-pointer shrink-0"
          title={isOpen ? 'Hide Sidebar (Ctrl+B)' : 'Show Sidebar (Ctrl+B)'}
          aria-label="Toggle Sidebar"
        >
          {isOpen ? (
            <PanelLeftClose className="w-4 h-4 text-brand-orange shrink-0" />
          ) : (
            <PanelLeftOpen className="w-4 h-4 text-brand-orange shrink-0" />
          )}
          <span className="font-bold">
            {isOpen ? 'Hide Sidebar' : 'Show Sidebar'}
          </span>
        </button>

        <Link
          href={ROUTES.app.career.discover}
          prefetch={true}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-brand-paper border border-brand-ink shadow-editorial-sm text-xs font-bold uppercase tracking-wider text-brand-ink hover:text-brand-orange transition-colors truncate max-w-[140px] sm:max-w-none shrink"
        >
          <Target className="w-3.5 h-3.5 text-brand-orange shrink-0" />
          <span className="truncate">{currentRole ? currentRole.title : 'Select Career Goal'}</span>
          <ChevronRight className="w-3 h-3 text-brand-ink/40 shrink-0" />
        </Link>
        <span className="hidden md:inline-block text-xs font-semibold text-brand-ink/60 truncate">
          Stage: <span className="font-bold text-brand-ink uppercase">{state.stage.replace(/_/g, ' ')}</span>
        </span>
      </div>

      {/* Right Controls - guaranteed to fit and keep Settings button visible */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Readiness Meter Pill */}
        <Link
          href={ROUTES.app.skills.analysis}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-brand-paper border border-brand-ink text-xs font-bold uppercase tracking-wider text-brand-ink hover:bg-brand-yellow/20 transition-colors shadow-editorial-sm shrink-0"
        >
          <Award className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
          <span>Readiness: <strong className="text-brand-orange">{state.readinessScore}%</strong></span>
        </Link>

        {/* Notifications Icon with count */}
        <Link
          href={ROUTES.app.notifications}
          className="relative p-1.5 sm:p-2 bg-brand-paper border border-brand-ink text-brand-ink hover:text-brand-orange transition-colors shadow-editorial-sm shrink-0"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-orange text-white text-[8px] font-black rounded-full flex items-center justify-center">
            2
          </span>
        </Link>

        {/* Settings Shortcut - always visible on mobile & desktop */}
        <Link
          href={ROUTES.app.settings}
          className="p-1.5 sm:p-2 bg-brand-paper border border-brand-ink text-brand-ink hover:text-brand-orange transition-colors shadow-editorial-sm shrink-0"
          aria-label="Platform Settings"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};
