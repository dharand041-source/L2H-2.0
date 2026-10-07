'use client';

import React from 'react';
import { PortalSidebar } from '@/components/layout/portal-sidebar';
import { PortalTopbar } from '@/components/layout/portal-topbar';
import { SidebarProvider, useSidebar } from '@/components/layout/sidebar-context';

import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ROUTES } from '@/lib/routes';

function PortalLayoutInner({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useSidebar();
  const pathname = usePathname();

  // Close sidebar ONLY on actual route change on mobile/tablet screens
  const prevPathnameRef = React.useRef(pathname);
  React.useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        close();
      }
    }
  }, [pathname, close]);

  // Lock scroll when sidebar is open on mobile
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
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
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
          className="fixed inset-0 bg-brand-ink/45 backdrop-blur-[2px] z-40 lg:hidden transition-opacity cursor-pointer"
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Responsive Sidebar:
          - Mobile / Tablet (< 1024px): Slide-over drawer over the screen (exact same website sidebar, zero content compression)
          - Desktop (>= 1024px): Docked Sidebar with smooth collapse/expand
      */}
      <div
        className={`fixed inset-y-0 left-0 z-50 h-full w-72 max-w-[85vw] transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none lg:static lg:h-screen lg:shrink-0 lg:z-30 lg:transition-[width] ${
          isOpen
            ? 'translate-x-0 lg:w-64'
            : '-translate-x-full pointer-events-none lg:translate-x-0 lg:w-0 lg:overflow-hidden'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-full">
          <PortalSidebar />
        </div>
      </div>

      {/* Main Workspace Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300 ease-in-out">
        <PortalTopbar />
        
        <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 pb-6 sm:pb-8 lg:pb-8 overflow-y-auto transition-colors">
          <div className="max-w-7xl mx-auto min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!isMounted) return;

        if (error || !user) {
          setIsAuthenticated(false);
          const redirectUrl = `${ROUTES.auth.login}?next=${encodeURIComponent(pathname || ROUTES.app.dashboard)}`;
          window.location.href = redirectUrl;
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        if (!isMounted) return;
        setIsAuthenticated(false);
        window.location.href = ROUTES.auth.login;
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === 'SIGNED_OUT' || !session?.user) {
        setIsAuthenticated(false);
        window.location.href = ROUTES.auth.login;
      } else if (session?.user) {
        setIsAuthenticated(true);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  // Loading state prevents auth flash
  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-screen bg-brand-cream flex flex-col items-center justify-center p-6 text-brand-ink">
        <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
          <div className="w-9 h-9 border-2 border-brand-ink border-t-brand-orange animate-spin" />
          <div className="space-y-1">
            <span className="editorial-badge bg-brand-yellow text-brand-ink text-[10px]">
              SECURITY CLEARANCE
            </span>
            <p className="font-display text-lg font-bold tracking-tight uppercase text-brand-ink">
              AUTHENTICATING...
            </p>
            <p className="text-xs text-brand-ink/70 font-medium">
              Verifying candidate credentials with Supabase.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <PortalLayoutInner>{children}</PortalLayoutInner>
    </SidebarProvider>
  );
}
