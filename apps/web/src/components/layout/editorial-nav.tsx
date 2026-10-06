import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';

export const EditorialNav: React.FC = () => {
  return (
    <header className="w-full border-b-[1.5px] border-brand-ink bg-brand-cream/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Editorial Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0">
            <div className="w-8 h-8 sm:w-11 sm:h-11 bg-brand-orange border-[1.5px] border-brand-ink flex items-center justify-center font-display text-white text-lg sm:text-2xl shadow-editorial group-hover:bg-brand-rose transition-all shrink-0">
              L2H
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-display text-lg sm:text-2xl tracking-tight leading-none text-brand-ink whitespace-nowrap">
                LEARN-2-HIRE
              </span>
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/75 mt-0.5 hidden sm:inline-block truncate">
                Full-Stack Career System
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/how-it-works"
              className="text-xs font-bold uppercase tracking-widest text-brand-ink hover:text-brand-orange transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-brand-orange after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              How It Works
            </Link>
            <Link
              href="/careers"
              className="text-xs font-bold uppercase tracking-widest text-brand-ink hover:text-brand-orange transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-brand-orange after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              Careers Atlas
            </Link>
            <Link
              href="/resources"
              className="text-xs font-bold uppercase tracking-widest text-brand-ink hover:text-brand-orange transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-brand-orange after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              Free Curricula
            </Link>
            <Link
              href="/about"
              className="text-xs font-bold uppercase tracking-widest text-brand-ink hover:text-brand-orange transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-brand-orange after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              About &amp; AI Ethics
            </Link>
          </nav>

          {/* CTA Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="px-2.5 sm:px-4 py-1.5 text-xs font-bold whitespace-nowrap">
                Log In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary" size="sm" className="px-3 sm:px-5 py-1.5 text-xs font-bold whitespace-nowrap">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>
  );
};
