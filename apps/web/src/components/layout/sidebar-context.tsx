'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: true,
  toggle: () => {},
  open: () => {},
  close: () => {},
});

const STORAGE_KEY = 'l2h_sidebar_visible';

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mobile defaults to false to prevent initial flash on load; Desktop initializes to preference
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isMobileRef = useRef<boolean>(true);
  const lastToggleTimeRef = useRef<number>(0);

  // Initialize from screen size and localStorage on client
  useEffect(() => {
    try {
      const mobile = window.innerWidth < 1024;
      isMobileRef.current = mobile;
      if (mobile) {
        setIsOpen(false);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        setIsOpen(stored !== null ? stored === 'true' : true);
      }
    } catch {
      // Ignore storage errors
    }

    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      if (isMobileRef.current !== mobile) {
        isMobileRef.current = mobile;
        if (!mobile) {
          try {
            const stored = localStorage.getItem(STORAGE_KEY);
            setIsOpen(stored !== null ? stored === 'true' : true);
          } catch {
            setIsOpen(true);
          }
        } else {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggle = React.useCallback(() => {
    const now = Date.now();
    // Prevent double-click ghost updates on mobile touch devices
    if (now - lastToggleTimeRef.current < 250) {
      return;
    }
    lastToggleTimeRef.current = now;

    setIsOpen((prev) => {
      const next = !prev;
      try {
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
          localStorage.setItem(STORAGE_KEY, String(next));
        }
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const open = React.useCallback(() => {
    setIsOpen(true);
    try {
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        localStorage.setItem(STORAGE_KEY, 'true');
      }
    } catch {}
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
    try {
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        localStorage.setItem(STORAGE_KEY, 'false');
      }
    } catch {}
  }, []);

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  const value = React.useMemo(
    () => ({ isOpen, toggle, open, close }),
    [isOpen, toggle, open, close]
  );

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
