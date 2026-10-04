'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Award, Heart } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { EditorialNav } from '@/components/layout/editorial-nav';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink flex flex-col bg-grid-subtle">
      <EditorialNav />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="border-b-[1.5px] border-brand-ink pb-8 space-y-3">
            <span className="editorial-badge bg-brand-orange text-white text-xs">
              Our Founding Thesis
            </span>
            <h1 className="font-display-hero text-brand-ink tracking-tight">
              ENGINEERED EMPLOYMENT. <br />
              <span className="text-brand-orange">NOT RESUME LOTTERIES.</span>
            </h1>
            <p className="text-lg text-brand-ink/80 leading-relaxed font-medium">
              Learn-2-Hire was created to eliminate the broken dynamics of modern hiring: blind resume blasting, fabricated claims, generic bootcamps, and predatory paywalls.
            </p>
          </div>

          <div className="space-y-6 text-sm text-brand-ink/90 font-medium leading-relaxed">
            <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial space-y-3">
              <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
                1. Knowledge Must Remain Free
              </h2>
              <p>
                The world&apos;s best educational materials already exist freely online on freeCodeCamp, MDN Web Docs, Harvard CS50, and MIT OpenCourseWare. Charging thousands of dollars for recycled tutorial videos is exploitative. Learn-2-Hire organizes open materials into auditable roadmaps.
              </p>
            </div>

            <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial space-y-3">
              <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
                2. True Competency Is Measurable
              </h2>
              <p>
                Self-reported resumes are dying. Candidates need proof: non-repetitive diagnostic scorecards, reproducible GitHub code repositories, automated unit test suites, and live edge deployments.
              </p>
            </div>

            <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial space-y-3">
              <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
                3. Zero-Scraping Integrity
              </h2>
              <p>
                We do not scrape behind login walls, break terms of service, or simulate automated job submissions. Every employer link in our engine is an authenticated API feed or official corporate career destination.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <Link href={ROUTES.public.ethics}>
              <Button variant="outline" size="md">Read Our AI Ethics Charter →</Button>
            </Link>
            <Link href={ROUTES.auth.signup}>
              <Button variant="primary" size="md">Join Learn-2-Hire →</Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-brand-cream border-t-[1.5px] border-brand-ink py-8 px-4 text-center text-xs font-semibold text-brand-ink/70">
        Learn-2-Hire 2.0 &bull; About Us
      </footer>
    </div>
  );
}
