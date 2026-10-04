'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  Terminal,
  Briefcase,
  User,
  Menu,
  X,
  Compass,
  CheckSquare,
  FolderGit2,
  Mic,
  FileText,
  TrendingUp,
  RefreshCw,
  BarChart3,
  Bell,
  Settings,
  Target
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { useCandidateState } from '@/lib/data/state-store';

export const PortalMobileNav: React.FC = () => {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { signOut } = useCandidateState();

  const bottomNavItems = [
    { label: 'Home', href: ROUTES.app.dashboard, icon: Home },
    { label: 'Learn', href: ROUTES.app.learning.home, icon: BookOpen },
    { label: 'Practice', href: ROUTES.app.practice.home, icon: Terminal },
    { label: 'Jobs', href: ROUTES.app.opportunities.jobs, icon: Briefcase },
    { label: 'Profile', href: ROUTES.app.profile, icon: User },
  ];

  const drawerSections = [
    { label: 'Career Discovery', href: ROUTES.app.career.discover, icon: Compass },
    { label: 'Career Goals', href: ROUTES.app.career.goals, icon: Target },
    { label: 'Skill Analysis', href: ROUTES.app.skills.analysis, icon: TrendingUp },
    { label: 'Assessments', href: ROUTES.app.assessments.home, icon: CheckSquare },
    { label: 'Real-World Projects', href: ROUTES.app.projects.home, icon: FolderGit2 },
    { label: 'Interview Simulator', href: ROUTES.app.interview.home, icon: Mic },
    { label: 'Resume & ATS', href: ROUTES.app.resume.home, icon: FileText },
    { label: 'Application Tracker', href: ROUTES.app.applications.home, icon: Briefcase },
    { label: 'Improvement Loop', href: ROUTES.app.improve.home, icon: RefreshCw },
    { label: 'Analytics Cockpit', href: ROUTES.app.analytics.home, icon: BarChart3 },
    { label: 'Notifications', href: ROUTES.app.notifications, icon: Bell },
    { label: 'Settings', href: ROUTES.app.settings, icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-end"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="w-80 bg-brand-cream border-l-[1.5px] border-brand-ink h-full p-6 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-brand-ink/20 mb-6">
                <span className="font-display text-xl uppercase tracking-tight text-brand-ink">
                  More Navigation
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 border border-brand-ink bg-brand-paper"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {drawerSections.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase tracking-wider text-brand-ink hover:bg-brand-paper hover:text-brand-orange border border-transparent hover:border-brand-ink"
                    >
                      <Icon className="w-4 h-4 text-brand-orange" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-brand-ink/20">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  signOut();
                }}
                className="w-full py-2.5 bg-brand-paper border border-brand-ink text-xs font-bold uppercase tracking-wider text-brand-ink hover:text-brand-rose"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Dock */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-cream/95 backdrop-blur-md border-t-[1.5px] border-brand-ink px-3 py-2 flex items-center justify-between">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== ROUTES.app.dashboard && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center p-1.5 transition-all ${
                isActive ? 'text-brand-orange font-bold' : 'text-brand-ink hover:text-brand-orange'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* More Menu Trigger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center p-1.5 text-brand-ink hover:text-brand-orange"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">
            More
          </span>
        </button>
      </div>
    </>
  );
};
