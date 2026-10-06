'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  isSeparator?: boolean;
  isActive?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

export interface UserProfileSidebarProps {
  user: UserProfile;
  navItems: NavItem[];
  logoutItem: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  };
  className?: string;
  onClose?: () => void;
}

export const sidebarVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export const UserProfileSidebar = React.forwardRef<HTMLDivElement, UserProfileSidebarProps>(
  ({ user, navItems, logoutItem, className, onClose }, ref) => {
    return (
      <motion.aside
        ref={ref}
        className={cn(
          'flex h-full w-full max-w-xs flex-col rounded-xl border border-brand-ink/20 bg-brand-cream p-4 text-brand-ink shadow-editorial-sm select-none',
          className
        )}
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        aria-label="User Profile Menu"
      >
        {/* User Info Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between p-1.5 shrink-0 gap-2">
          <div className="flex items-center space-x-3.5 min-w-0">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={`${user.name}'s avatar`}
              className="h-11 w-11 rounded-full object-cover shrink-0 border border-brand-ink shadow-editorial-sm bg-brand-paper"
            />
            <div className="flex flex-col truncate">
              <span className="font-bold text-base text-brand-ink truncate leading-tight tracking-tight">{user.name}</span>
              <span className="text-xs font-semibold text-brand-ink/60 truncate leading-normal">{user.email}</span>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 text-brand-ink hover:text-brand-orange hover:bg-brand-paper border border-brand-ink/30 transition-colors cursor-pointer shrink-0"
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="my-3.5 border-t border-brand-ink/15 shrink-0" />

        {/* Navigation Links */}
        <nav className="flex-1 min-h-0 space-y-1 overflow-y-auto pr-1 overscroll-contain" role="navigation">
          {navItems.map((item, index) => {
            const isInternal = item.href.startsWith('/');
            const activeClasses = item.isActive
              ? 'bg-brand-paper text-brand-ink border border-brand-ink shadow-editorial-sm font-bold'
              : 'text-brand-ink/80 hover:bg-brand-paper hover:text-brand-orange border border-transparent font-bold';

            const content = (
              <>
                <span className={cn(
                  'mr-3 h-4 w-4 shrink-0 flex items-center justify-center transition-colors',
                  item.isActive ? 'text-brand-orange' : 'text-brand-ink/65 group-hover:text-brand-orange'
                )}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
                <ChevronRight className={cn(
                  'ml-auto h-3.5 w-3.5 shrink-0 transition-opacity',
                  item.isActive ? 'opacity-100 text-brand-orange' : 'opacity-0 text-brand-ink/40 group-hover:opacity-100 group-hover:text-brand-orange'
                )} />
              </>
            );

            const handleLinkClick = () => {
              if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                onClose?.();
              }
            };

            return (
              <React.Fragment key={index}>
                {item.isSeparator && <motion.div variants={itemVariants} className="h-5" />}
                {isInternal ? (
                  <motion.div variants={itemVariants}>
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        'group flex items-center rounded-lg px-3 py-2 text-xs uppercase tracking-wider transition-all',
                        activeClasses
                      )}
                    >
                      {content}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.a
                    href={item.href}
                    variants={itemVariants}
                    onClick={handleLinkClick}
                    className={cn(
                      'group flex items-center rounded-lg px-3 py-2 text-xs uppercase tracking-wider transition-all',
                      activeClasses
                    )}
                  >
                    {content}
                  </motion.a>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Logout Button */}
        <motion.div variants={itemVariants} className="mt-3 pt-3 border-t border-brand-ink/15 shrink-0">
          <button
            onClick={logoutItem.onClick}
            className="group flex w-full items-center rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-brand-orange transition-all hover:bg-brand-paper hover:text-brand-rose border border-transparent hover:border-brand-ink hover:shadow-editorial-sm"
          >
            <span className="mr-3 h-4 w-4 shrink-0 flex items-center justify-center text-brand-orange group-hover:text-brand-rose">
              {logoutItem.icon}
            </span>
            <span>{logoutItem.label}</span>
          </button>
        </motion.div>
      </motion.aside>
    );
  }
);

UserProfileSidebar.displayName = 'UserProfileSidebar';

import {
  Truck,
  Star,
  Home,
  Eye,
  Heart,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
} from 'lucide-react';

export function UserProfileSidebarDemo() {
  const user = {
    name: 'Emma',
    email: 'emma@nucleus-ui.com',
    avatarUrl: 'https://cdn.21st.dev/assets/mirror/bc/bc55f88ce6b77d2bed85230412d90f73e6998cceae2398aa3a20f46efe0546dd.jpg',
  };

  const navItems: NavItem[] = [
    {
      label: 'My orders',
      href: '#orders',
      icon: <Truck className="h-full w-full" />,
    },
    {
      label: 'Reviews',
      href: '#reviews',
      icon: <Star className="h-full w-full" />,
    },
    {
      label: 'Delivery addresses',
      href: '#addresses',
      icon: <Home className="h-full w-full" />,
    },
    {
      label: 'Recently viewed',
      href: '#viewed',
      icon: <Eye className="h-full w-full" />,
    },
    {
      label: 'Favorite items',
      href: '#favorites',
      icon: <Heart className="h-full w-full" />,
    },
    {
      label: 'Settings',
      href: '#settings',
      icon: <SettingsIcon className="h-full w-full" />,
      isSeparator: true,
    },
  ];

  const logoutItem = {
    label: 'Log out',
    icon: <LogOutIcon className="h-full w-full" />,
    onClick: () => alert('Logging out...'),
  };

  return (
    <div className="flex h-[600px] w-full items-center justify-center bg-background p-10">
      <UserProfileSidebar user={user} navItems={navItems} logoutItem={logoutItem} />
    </div>
  );
}

export default UserProfileSidebar;
