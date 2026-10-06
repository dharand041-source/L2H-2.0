'use client';

import React from 'react';
import { PortalSidebar } from '@/components/layout/portal-sidebar';
import { PortalTopbar } from '@/components/layout/portal-topbar';
import { PortalMobileNav } from '@/components/layout/portal-mobile-nav';
import { SidebarProvider, useSidebar } from '@/components/layout/sidebar-context';

import { usePathname } from 'next/navigation';

function PortalLayoutInner({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useSidebar();
  const pathname = usePathname();

  // Close sidebar on route change on mobile/tablet screens
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      close();
    }
  }, [pathname, close]);

  // Lock scroll when sidebar is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="h-screen bg-brand-cream text-brand-ink flex overflow-hidden">
      {/* Mobile / Tablet Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={close}
          className="fixed inset-0 bg-brand-ink/45 backdrop-blur-[2px] z-40 lg:hidden transition-opacity cursor-pointer"
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Responsive Sidebar:
          - Mobile / Tablet (< 1024px): Slide-over drawer over the screen (zero compression on content)
          - Desktop (>= 1024px): Docked Sidebar with smooth collapse/expand
      */}
      <div
        className={`fixed inset-y-0 left-0 z-50 h-full w-72 max-w-[85vw] transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none lg:static lg:h-screen lg:shrink-0 lg:z-30 ${
          isOpen
            ? 'translate-x-0 opacity-100 lg:w-64'
            : '-translate-x-full opacity-0 pointer-events-none lg:w-0'
        }`}
      >
        <div className="w-full h-full">
          <PortalSidebar />
        </div>
      </div>

      {/* Main Workspace Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300 ease-in-out">
        <PortalTopbar />
        
        <main
          className={`flex-1 p-3 sm:p-5 md:p-6 lg:p-8 pb-24 lg:pb-8 transition-colors ${
            isOpen ? 'overflow-hidden' : 'overflow-y-auto'
          }`}
        >
          <div className="max-w-7xl mx-auto min-w-0">
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
