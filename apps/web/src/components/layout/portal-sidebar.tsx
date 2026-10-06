'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  TrendingUp,
  CheckSquare,
  BookOpen,
  Terminal,
  FolderGit2,
  Mic,
  FileText,
  Briefcase,
  Layers,
  Kanban,
  RefreshCw,
  BarChart3,
  Bell,
  User,
  Settings,
  LogOut,
  Target,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { useCandidateState } from '@/lib/data/state-store';
import { UserProfileSidebar, type NavItem } from '@/components/ui/menu';
import { useSidebar } from './sidebar-context';

export const PortalSidebar: React.FC = () => {
  const pathname = usePathname();
  const { state, signOut } = useCandidateState();
  const { close } = useSidebar();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const user = {
    name: mounted && state.user.name ? state.user.name : 'Emma',
    email: mounted && state.user.email ? state.user.email : 'emma@nucleus-ui.com',
    avatarUrl:
      mounted && state.user.avatarUrl
        ? state.user.avatarUrl
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  };

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: ROUTES.app.dashboard,
      icon: <LayoutDashboard className="h-full w-full" />,
      isActive: pathname === ROUTES.app.dashboard,
    },
    {
      label: 'Career Discovery',
      href: ROUTES.app.career.discover,
      icon: <Compass className="h-full w-full" />,
      isActive: pathname?.startsWith(ROUTES.app.career.discover),
    },
    {
      label: 'Career Goals',
      href: ROUTES.app.career.goals,
      icon: <Target className="h-full w-full" />,
      isActive: pathname?.startsWith(ROUTES.app.career.goals),
    },
    {
      label: 'Skill Analysis',
      href: ROUTES.app.skills.analysis,
      icon: <TrendingUp className="h-full w-full" />,
      isActive: pathname?.startsWith(ROUTES.app.skills.analysis),
    },
    {
      label: 'Assessments',
      href: ROUTES.app.assessments.home,
      icon: <CheckSquare className="h-full w-full" />,
      isActive: pathname?.startsWith(ROUTES.app.assessments.home),
      isSeparator: true,
    },
    {
      label: 'Learning Hub',
      href: ROUTES.app.learning.home,
      icon: <BookOpen className="h-full w-full" />,
      isActive: pathname?.startsWith(ROUTES.app.learning.home),
    },
    {
      label: 'Practice Arena',
      href: ROUTES.app.practice.home,
      icon: <Terminal className="h-full w-full" />,
      isActive: pathname?.startsWith(ROUTES.app.practice.home),
    },
    {
      label: 'Projects & Proof',
      href: ROUTES.app.projects.home,
      icon: <FolderGit2 className="h-full w-full" />,
      isActive: pathname?.startsWith(ROUTES.app.projects.home),
    },
    {
      label: 'Interview Simulator',
      href: ROUTES.app.interview.home,
      icon: <Mic className="h-full w-full" />,
      isActive: pathname?.startsWith(ROUTES.app.interview.home),
    },
    {
      label: 'Resume & ATS',
      href: ROUTES.app.resume.home,
      icon: <FileText className="h-full w-full" />,
      isActive: pathname?.startsWith(ROUTES.app.resume.home),
    },
    {
      label: 'Jobs & Feeds',
      href: ROUTES.app.opportunities.jobs,
      icon: <Briefcase className="h-full w-full" />,
      isActive: pathname?.startsWith(ROUTES.app.opportunities.jobs),
      isSeparator: true,
    },
    {
      label: 'Internships',
      href: ROUTES.app.opportunities.internships,
      icon: <Layers className="h-full w-full" />,
      isActive: pathname?.startsWith(ROUTES.app.opportunities.internships),
    },
    {
      label: 'Application Tracker',
      href: ROUTES.app.applications.home,
      icon: <Kanban className="h-full w-full" />,
      isActive: pathname?.startsWith(ROUTES.app.applications.home),
    },
    {
      label: 'Improvement Loop',
      href: ROUTES.app.improve.home,
      icon: <RefreshCw className="h-full w-full" />,
      isActive: pathname?.startsWith(ROUTES.app.improve.home),
    },
    {
      label: 'Analytics Cockpit',
      href: ROUTES.app.analytics.home,
      icon: <BarChart3 className="h-full w-full" />,
      isActive: pathname?.startsWith(ROUTES.app.analytics.home),
    },
    {
      label: 'Notifications',
      href: ROUTES.app.notifications,
      icon: <Bell className="h-full w-full" />,
      isActive: pathname === ROUTES.app.notifications,
      isSeparator: true,
    },
    {
      label: 'Profile',
      href: ROUTES.app.profile,
      icon: <User className="h-full w-full" />,
      isActive: pathname === ROUTES.app.profile,
    },
    {
      label: 'Settings',
      href: ROUTES.app.settings,
      icon: <Settings className="h-full w-full" />,
      isActive: pathname === ROUTES.app.settings,
    },
  ];

  const logoutItem = {
    label: 'Log out',
    icon: <LogOut className="h-full w-full" />,
    onClick: () => signOut(),
  };

  return (
    <UserProfileSidebar
      user={user}
      navItems={navItems}
      logoutItem={logoutItem}
      onClose={close}
      className="h-full w-full rounded-none border-y-0 border-l-0 border-r-[1.5px] border-brand-ink bg-brand-cream shadow-none max-w-none"
    />
  );
};
