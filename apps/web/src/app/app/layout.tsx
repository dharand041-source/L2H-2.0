'use client';

import React from 'react';
import { PortalSidebar } from '@/components/layout/portal-sidebar';
import { PortalTopbar } from '@/components/layout/portal-topbar';
import { PortalMobileNav } from '@/components/layout/portal-mobile-nav';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink flex">
      {/* Desktop Portal Sidebar */}
      <div className="hidden lg:flex h-screen sticky top-0 shrink-0">
        <PortalSidebar />
      </div>

      {/* Main Workspace Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <PortalTopbar />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile Navigation Dock & Drawer */}
        <PortalMobileNav />
      </div>
    </div>
  );
}
