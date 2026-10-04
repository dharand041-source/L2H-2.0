'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  TrendingUp,
  CheckSquare,
  BookOpen,
  Terminal,
  FolderGit2,
  ShieldCheck,
  Mic,
  FileText,
  Briefcase,
  Layers,
  Sparkles,
  Kanban,
  RefreshCw,
  BarChart3,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Target,
  PanelLeftClose
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { useCandidateState } from '@/lib/data/state-store';
import { useSidebar } from './sidebar-context';

export const PortalSidebar: React.FC = () => {
  const pathname = usePathname();
  const { state, signOut } = useCandidateState();
  const { close } = useSidebar();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navigationGroups = [
    {
      label: 'MAIN',
      items: [
        { label: 'Dashboard', href: ROUTES.app.dashboard, icon: LayoutDashboard },
      ],
    },
    {
      label: 'CAREER',
      items: [
        { label: 'Career Discovery', href: ROUTES.app.career.discover, icon: Compass },
        { label: 'Career Goals', href: ROUTES.app.career.goals, icon: Target },
        { label: 'Skill Analysis', href: ROUTES.app.skills.analysis, icon: TrendingUp },
      ],
    },
    {
      label: 'DEVELOP',
      items: [
        { label: 'Assessments', href: ROUTES.app.assessments.home, icon: CheckSquare },
        { label: 'Learning Hub', href: ROUTES.app.learning.home, icon: BookOpen },
        { label: 'Practice Arena', href: ROUTES.app.practice.home, icon: Terminal },
      ],
    },
    {
      label: 'PROVE',
      items: [
        { label: 'Projects', href: ROUTES.app.projects.home, icon: FolderGit2 },
        { label: 'Skill Proof', href: ROUTES.app.skillProof.home, icon: ShieldCheck },
      ],
    },
    {
      label: 'PREPARE',
      items: [
        { label: 'Interview Simulator', href: ROUTES.app.interview.home, icon: Mic },
        { label: 'Resume & ATS', href: ROUTES.app.resume.home, icon: FileText },
      ],
    },
    {
      label: 'OPPORTUNITIES',
      items: [
        { label: 'Jobs & Feeds', href: ROUTES.app.opportunities.jobs, icon: Briefcase },
        { label: 'Internships', href: ROUTES.app.opportunities.internships, icon: Layers },
        { label: 'Startups', href: ROUTES.app.opportunities.startups, icon: Sparkles },
        { label: 'Application Tracker', href: ROUTES.app.applications.home, icon: Kanban },
      ],
    },
    {
      label: 'GROW',
      items: [
        { label: 'Improvement Loop', href: ROUTES.app.improve.home, icon: RefreshCw },
        { label: 'Analytics Cockpit', href: ROUTES.app.analytics.home, icon: BarChart3 },
      ],
    },
    {
      label: 'SYSTEM',
      items: [
        { label: 'Notifications', href: ROUTES.app.notifications, icon: Bell },
        { label: 'Profile', href: ROUTES.app.profile, icon: User },
        { label: 'Settings', href: ROUTES.app.settings, icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-brand-cream border-r-[1.5px] border-brand-ink flex flex-col justify-between shrink-0 select-none h-full">
      {/* Brand Header */}
      <div>
        <div className="h-20 border-b-[1.5px] border-brand-ink px-4 flex items-center justify-between gap-2">
          <Link href={ROUTES.app.dashboard} prefetch={true} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-brand-orange border border-brand-ink flex items-center justify-center font-display text-white text-xl shadow-editorial-sm group-hover:bg-brand-rose transition-colors shrink-0">
              L2H
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl tracking-tight leading-none text-brand-ink">
                LEARN-2-HIRE
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-brand-ink/70">
                Career Operating System
              </span>
            </div>
          </Link>

          {/* Hide Sidebar Button */}
          <button
            onClick={close}
            className="p-1.5 bg-brand-paper hover:bg-brand-yellow/20 hover:text-brand-orange border border-brand-ink shadow-editorial-sm text-brand-ink transition-colors shrink-0"
            title="Hide Sidebar (Ctrl+B)"
            aria-label="Hide Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navigationGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <div className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/50">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== ROUTES.app.dashboard && pathname?.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
                        isActive
                          ? 'bg-brand-orange text-white border border-brand-ink shadow-editorial-sm'
                          : 'text-brand-ink hover:bg-brand-paper hover:text-brand-orange border border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Footer Card */}
      <div className="p-4 border-t-[1.5px] border-brand-ink bg-brand-paper">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden" suppressHydrationWarning>
            {mounted && state.user.avatarUrl ? (
              <img
                src={state.user.avatarUrl}
                alt={state.user.name || 'Candidate'}
                className="w-8 h-8 rounded-full object-cover border border-brand-ink shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-orange border border-brand-ink text-white font-display flex items-center justify-center text-sm shrink-0">
                {state.user.name ? state.user.name.charAt(0) : 'U'}
              </div>
            )}
            <div className="truncate" suppressHydrationWarning>
              <div className="text-xs font-bold text-brand-ink truncate">{state.user.name || 'Candidate'}</div>
              {state.user.email && (
                <div className="text-[10px] text-brand-ink/60 truncate">{state.user.email}</div>
              )}
            </div>
          </div>
          <button
            onClick={() => signOut()}
            title="Sign Out"
            className="p-1.5 text-brand-ink hover:text-brand-rose transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
