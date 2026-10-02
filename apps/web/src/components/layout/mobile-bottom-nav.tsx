'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Terminal, Briefcase, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Learn', href: '/learning', icon: BookOpen },
    { label: 'Practice', href: '/practice', icon: Terminal },
    { label: 'Jobs', href: '/opportunities', icon: Briefcase },
    { label: 'Profile', href: '/profile/settings', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-cream/95 backdrop-blur-md border-t-[1.5px] border-brand-ink px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-sm transition-all duration-150 ${
                isActive
                  ? 'bg-brand-orange text-white shadow-editorial-sm border border-brand-ink'
                  : 'text-brand-ink hover:text-brand-orange'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
