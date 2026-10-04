'use client';

import React from 'react';
import { PortalSidebar } from '@/components/layout/portal-sidebar';
import { PortalTopbar } from '@/components/layout/portal-topbar';
import { PortalMobileNav } from '@/components/layout/portal-mobile-nav';
import { SidebarProvider, useSidebar } from '@/components/layout/sidebar-context';

function PortalLayoutInner({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink flex overflow-x-hidden">
      {/* Desktop Portal Sidebar with animated show/hide */}
      <div
        className={`hidden lg:flex h-screen sticky top-0 shrink-0 transition-all duration-300 ease-in-out z-30 ${
          isOpen ? 'w-64 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full overflow-hidden pointer-events-none'
        }`}
      >
        <div className="w-64 h-full">
          <PortalSidebar />
        </div>
      </div>

      {/* Main Workspace Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out">
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

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <PortalLayoutInner>{children}</PortalLayoutInner>
    </SidebarProvider>
  );
}
