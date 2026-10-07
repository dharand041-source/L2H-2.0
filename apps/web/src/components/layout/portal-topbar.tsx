'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Settings, Target, ChevronRight, Award, Check, AlertTriangle, X } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug, CAREER_ROLES_CATALOG } from '@/lib/data/careers-data';
import { useSidebar } from './sidebar-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const PortalTopbar: React.FC = () => {
  const { state, setTargetRole } = useCandidateState();
  const { isOpen, toggle } = useSidebar();
  const pathname = usePathname();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [pendingRoleSlug, setPendingRoleSlug] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isAssessmentPage = pathname?.includes('/assessments');

  const handleSelectRole = (slug: string) => {
    if (slug === state.targetCareerSlug) {
      setIsSwitcherOpen(false);
      return;
    }

    if (isAssessmentPage) {
      setPendingRoleSlug(slug);
      setShowConfirmModal(true);
      return;
    }

    setTargetRole(slug);
    setIsSwitcherOpen(false);
  };

  const handleConfirmChange = async () => {
    if (pendingRoleSlug) {
      await setTargetRole(pendingRoleSlug);
      setPendingRoleSlug(null);
    }
    setShowConfirmModal(false);
    setIsSwitcherOpen(false);
  };

  const handleCancelChange = () => {
    setPendingRoleSlug(null);
    setShowConfirmModal(false);
  };

  const targetRoleTitle = pendingRoleSlug ? getCareerBySlug(pendingRoleSlug)?.title : '';

  return (
    <>
      <header className="h-16 border-b-[1.5px] border-brand-ink bg-brand-cream px-3 sm:px-6 flex items-center justify-between shrink-0 gap-2 sm:gap-3">
        {/* Left controls: Sidebar toggle & Target Career Status */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          {/* Sidebar Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            className="inline-flex items-center justify-center p-1.5 sm:p-2 bg-brand-paper border border-brand-ink shadow-editorial-sm text-brand-ink hover:text-brand-orange hover:bg-brand-yellow/10 transition-all cursor-pointer shrink-0"
            title={isOpen ? 'Hide Sidebar (Ctrl+B)' : 'Show Sidebar (Ctrl+B)'}
            aria-label={isOpen ? 'Hide Sidebar' : 'Show Sidebar'}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 sm:w-5 sm:h-5 text-brand-ink hover:text-brand-orange transition-colors"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="2.5" y="4.5" width="13" height="3.5" rx="1.75" fill="currentColor" />
              <circle cx="19.25" cy="6.25" r="2.25" fill="#EFB11D" />
              <rect x="2.5" y="10.25" width="13" height="3.5" rx="1.75" fill="currentColor" />
              <rect x="2.5" y="16" width="8" height="3.5" rx="1.75" fill="currentColor" />
            </svg>
          </button>

          {/* Quick Role Switcher trigger button */}
          <button
            type="button"
            onClick={() => setIsSwitcherOpen(true)}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-brand-paper border border-brand-ink shadow-editorial-sm text-xs font-bold uppercase tracking-wider text-brand-ink hover:text-brand-orange transition-colors truncate max-w-[140px] xs:max-w-[180px] sm:max-w-none shrink text-left"
            title="Click to Switch Active Career Role"
          >
            <Target className="w-3.5 h-3.5 text-brand-orange shrink-0" />
            <span className="truncate">{currentRole ? currentRole.title : 'Select Career Goal'}</span>
            <ChevronRight className="w-3 h-3 text-brand-ink/40 shrink-0" />
          </button>
          <span className="hidden md:inline-block text-xs font-semibold text-brand-ink/60 truncate">
            Stage: <span className="font-bold text-brand-ink uppercase">{state.stage.replace(/_/g, ' ')}</span>
          </span>
        </div>

      {/* Right Controls - guaranteed to fit smoothly on all screens */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Readiness Meter Pill */}
        <Link
          href={ROUTES.app.skills.analysis}
          className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-brand-paper border border-brand-ink text-xs font-bold uppercase tracking-wider text-brand-ink hover:bg-brand-yellow/20 transition-colors shadow-editorial-sm shrink-0"
        >
          <Award className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
          <span><span className="hidden sm:inline">Readiness: </span><strong className="text-brand-orange">{state.assessmentScore !== undefined && state.assessmentScore > 0 ? `${state.readinessScore}%` : 'NOT ASSESSED'}</strong></span>
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

      {/* Quick Role Switcher Modal */}
      {isSwitcherOpen && (
        <div
          className="fixed inset-0 bg-brand-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsSwitcherOpen(false)}
        >
          <div
            className="bg-brand-paper border-[1.5px] border-brand-ink shadow-editorial max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-brand-ink/20 flex items-center justify-between bg-brand-cream">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60 block">
                  Active Career Root Context
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-brand-ink">
                  Select Target Career
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSwitcherOpen(false)}
                className="p-1 border border-brand-ink bg-brand-paper text-brand-ink hover:text-brand-orange hover:bg-brand-cream transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Roles List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {CAREER_ROLES_CATALOG.map((r) => {
                const isActive = r.slug === state.targetCareerSlug;
                return (
                  <button
                    key={r.slug}
                    type="button"
                    onClick={() => handleSelectRole(r.slug)}
                    className={`w-full p-3 text-left border-[1.5px] transition-all flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-brand-ink text-brand-paper border-brand-ink shadow-editorial-sm'
                        : 'bg-brand-cream text-brand-ink border-brand-ink/30 hover:border-brand-ink hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm tracking-tight">{r.title}</span>
                        {isActive && (
                          <Badge variant="yellow" className="text-[9px] py-0 px-1.5">
                            ACTIVE
                          </Badge>
                        )}
                      </div>
                      <div className={`text-xs mt-0.5 ${isActive ? 'text-brand-paper/70' : 'text-brand-ink/60'}`}>
                        {r.track} · {r.averageSalary} · {r.openRolesCount.toLocaleString()} open roles
                      </div>
                    </div>
                    {isActive ? (
                      <Check className="w-5 h-5 text-brand-yellow shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-brand-ink/40 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-brand-ink/20 bg-brand-cream flex items-center justify-between">
              <Link
                href={ROUTES.app.career.discover}
                onClick={() => setIsSwitcherOpen(false)}
                className="text-xs font-bold uppercase text-brand-orange hover:underline flex items-center gap-1"
              >
                Browse Career Atlas &rarr;
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSwitcherOpen(false)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Career Switch Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 bg-brand-ink/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={handleCancelChange}
        >
          <div
            className="bg-brand-paper border-[2px] border-brand-ink shadow-editorial max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-brand-orange pb-2 border-b border-brand-ink/20">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-display text-lg font-bold uppercase text-brand-ink">
                Change Career?
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-brand-ink/80 leading-relaxed">
              Your current assessment belongs to: <strong className="text-brand-ink uppercase">{currentRole?.title}</strong>.
            </p>
            <p className="text-xs sm:text-sm text-brand-ink/80 leading-relaxed">
              Your new assessment will belong to: <strong className="text-brand-orange uppercase">{targetRoleTitle}</strong>.
            </p>
            <div className="p-3 bg-brand-cream border border-brand-ink/30 text-xs text-brand-ink/70">
              ✓ Your current assessment answers will remain safely saved in your career history.
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={handleCancelChange}
              >
                Keep Current
              </Button>
              <Button
                variant="accent"
                size="md"
                onClick={handleConfirmChange}
              >
                Change Career &rarr;
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
