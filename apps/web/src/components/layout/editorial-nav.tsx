import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';

export const EditorialNav: React.FC = () => {
  return (
    <>
      {/* Top Swiss Editorial Ticker */}
      <div className="w-full bg-brand-ink text-brand-paper py-1.5 px-4 text-[11px] font-bold uppercase tracking-widest border-b border-brand-ink flex items-center justify-between overflow-hidden select-none">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-brand-yellow inline-block animate-pulse" />
          <span>L2H CAREER OS 2.0</span>
          <span className="hidden sm:inline text-brand-paper/50">|</span>
          <span className="hidden sm:inline text-brand-paper/80">TECHNICAL & NON-TECHNICAL OCCUPATIONAL TAXONOMY</span>
        </div>
        <div className="flex items-center gap-4 text-brand-paper/90">
          <span className="hidden md:inline">ESCO & O*NET ALIGNED</span>
          <span className="text-brand-orange font-black">ZERO-SCRAPING INTEGRITY</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="w-full border-b-[1.5px] border-brand-ink bg-brand-cream/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Editorial Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-brand-orange border-[1.5px] border-brand-ink flex items-center justify-center font-display text-white text-2xl shadow-editorial group-hover:bg-brand-rose group-hover:shadow-editorial-hover transition-all">
              L2H
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl tracking-tight leading-none text-brand-ink">
                LEARN-2-HIRE
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/75 mt-0.5">
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
              About & AI Ethics
            </Link>
          </nav>

          {/* CTA Actions */}
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};
