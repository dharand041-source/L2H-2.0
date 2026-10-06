'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Initialize from localStorage or screen size on client
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        // Mobile / tablet default to closed
        setIsOpen(false);
        return;
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsOpen(stored === 'true');
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggle = React.useCallback(() => {
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
