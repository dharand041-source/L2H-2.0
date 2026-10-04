'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  CheckSquare,
  TrendingUp,
  BookOpen,
  Terminal,
  FolderGit2,
  Mic,
  FileText,
  Briefcase,
  RefreshCw,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { EditorialNav } from '@/components/layout/editorial-nav';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'TARGET CAREER BLUEPRINT',
      lead: 'Standardized occupational taxonomies aligned with ESCO and O*NET benchmarks.',
      desc: 'Select from 22+ standard technical and hybrid occupations. Every role defines calibrated competency requirements from Level 1 (Fundamentals) to Level 5 (Systems Mastery).'
    },
    {
      num: '02',
      title: 'CALIBRATED BASELINE DIAGNOSTIC',
      lead: 'Non-repetitive assessment evaluates true capability across multi-choice, coding, and debugging.',
      desc: 'Our anti-repetition engine tracks your attempt history and evaluates conceptual boundaries to pinpoint exact current levels.'
    },
    {
      num: '03',
      title: 'WEIGHTED SKILL GAP ANALYSIS',
      lead: 'Differential engine calculates exact step differentials between current and required benchmarks.',
      desc: 'See exactly which concepts require study. Your readiness score updates dynamically as tangible evidence is established.'
    },
    {
      num: '04',
      title: 'PERSONALIZED OPEN ROADMAP',
      lead: 'Zero-paywall curated curricula from freeCodeCamp, MDN Web Docs, CS50, and SQLBolt.',
      desc: 'We never gatekeep or paywall knowledge. High-quality open educational resources are sequenced into a directed learning plan.'
    },
    {
      num: '05',
      title: 'INTERACTIVE PRACTICE ARENA',
      lead: 'In-browser code execution, SQL query tester, and company-pattern problem sets.',
      desc: 'Test your logic against sliding window rate limiters, relational aggregations, and reported employer problem sets.'
    },
    {
      num: '06',
      title: 'AUDITABLE PROJECT DELIVERABLES',
      lead: 'Production software with GitHub repository commits, live edge deployments, and rubric grading.',
      desc: 'Move beyond toy tutorial apps. Build distributed booking platforms, authentication APIs, and verifiable portfolio deliverables.'
    },
    {
      num: '07',
      title: 'SIMULATED INTERVIEWS & ATS RESUME',
      lead: 'Role-calibrated mock interview simulator + ATS keyword compatibility scoring.',
      desc: 'Practice technical articulation with simulated audio prompts and generate resumes built solely on verified receipts.'
    },
    {
      num: '08',
      title: 'DIRECT EMPLOYER APPLICATION & RETRAINING',
      lead: 'Direct apply links with zero web-scraping + closed-loop retraining on outcome feedback.',
      desc: 'Apply directly to verified employer links with our Resume Approval Gate. If rejected, the system automatically launches targeted retraining.'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink flex flex-col bg-grid-subtle">
      <EditorialNav />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <div className="border-b-[1.5px] border-brand-ink pb-8 space-y-3">
            <span className="editorial-badge bg-brand-yellow text-brand-ink text-xs">
              Platform Architecture
            </span>
            <h1 className="font-display-hero text-brand-ink tracking-tight">
              HOW LEARN-2-HIRE <br />
              <span className="text-brand-orange">ACTUALLY WORKS.</span>
            </h1>
            <p className="text-lg sm:text-xl text-brand-ink/80 max-w-3xl font-medium leading-relaxed">
              We engineered Learn-2-Hire as an end-to-end career operating system. Here is the architectural anatomy of our connected candidate journey.
            </p>
          </div>

          {/* Steps List */}
          <div className="space-y-6">
            {steps.map((st) => (
              <div
                key={st.num}
                className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-2">
                    <span className="font-display text-5xl font-bold text-brand-orange">
                      {st.num}
                    </span>
                  </div>
                  <div className="md:col-span-10 space-y-2">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-brand-ink">
                      {st.title}
                    </h2>
                    <p className="text-sm font-bold text-brand-orange">
                      {st.lead}
                    </p>
                    <p className="text-xs sm:text-sm text-brand-ink/85 font-medium leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="bg-brand-ink text-brand-paper p-8 sm:p-12 text-center space-y-6 shadow-editorial">
            <h3 className="font-display text-4xl sm:text-5xl uppercase text-white font-bold">
              READY TO ENGINEER YOUR CAREER?
            </h3>
            <p className="text-sm sm:text-base text-brand-paper/80 max-w-xl mx-auto">
              Join thousands of candidates establishing verified skill evidence and unlocking legitimate employer matches.
            </p>
            <div className="flex justify-center gap-4">
              <Link href={ROUTES.auth.signup}>
                <Button variant="accent" size="lg">
                  Start Your Journey <ArrowRight className="w-4 h-4 ml-2 inline" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-brand-cream border-t-[1.5px] border-brand-ink py-8 px-4 text-center text-xs font-semibold text-brand-ink/70">
        Learn-2-Hire 2.0 &bull; Swiss Editorial Architecture &bull; All Rights Reserved
      </footer>
    </div>
  );
}
