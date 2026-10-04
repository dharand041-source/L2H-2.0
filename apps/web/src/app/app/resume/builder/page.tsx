'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, ArrowRight, CheckCircle2, Download, Sparkles } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ResumeBuilderPage() {
  const { state, updateState } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  const [headline, setHeadline] = useState(state.user.headline || 'Full-Stack Software Engineer');
  const [summary, setSummary] = useState(
    'Aspiring software engineer with calibrated capabilities in React, Node.js, and relational databases. Builder of distributed systems with verified GitHub pull requests, automated unit test suites, and Vercel edge deployments.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    updateState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        headline,
      },
      resume: {
        ...prev.resume,
        status: 'READY',
        compatibilityScore: 92,
      },
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.resume.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Resume Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Interactive Document Builder</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
            Verified Resume Builder
          </h1>
          <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
            Built strictly from your verified diagnostic test scores, milestone deliverables, and authentic project evidence. No exaggerated or fabricated claims.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            Save Changes
          </Button>
          <Link href={ROUTES.app.resume.analyzer}>
            <Button variant="primary" size="sm">
              ATS Compatibility Scan →
            </Button>
          </Link>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-brand-cream border border-brand-orange text-xs font-bold text-brand-orange flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Resume saved and updated in state! Compatibility score refreshed.
        </div>
      )}

      {/* Swiss Editorial Document Canvas */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 sm:p-12 shadow-editorial max-w-4xl mx-auto space-y-8">
        {/* Document Header */}
        <div className="border-b-[1.5px] border-brand-ink pb-6">
          <h2 className="font-display text-4xl font-bold uppercase text-brand-ink">
            {state.user.name}
          </h2>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full text-base font-bold text-brand-orange uppercase mt-1 bg-transparent border-b border-dashed border-brand-ink/30 focus:outline-none focus:border-brand-orange pb-0.5"
          />
          <div className="text-xs font-medium text-brand-ink/70 mt-2">
            {state.user.email} &bull; GitHub: github.com/alexmercer &bull; Verified Portfolio
          </div>
        </div>

        {/* Professional Summary */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-ink/60 block">
            Verified Profile Summary
          </span>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full p-3 bg-brand-cream border border-brand-ink/30 text-xs font-medium text-brand-ink leading-relaxed focus:outline-none"
          />
        </div>

        {/* Verified Technical Competencies */}
        <div className="space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-ink/60 block">
            Calibrated Core Competencies (From Diagnostic Tests)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {state.skills.map((s) => (
              <div key={s.name} className="p-2.5 bg-brand-cream border border-brand-ink/20 text-xs">
                <span className="font-bold text-brand-ink block">{s.name}</span>
                <span className="text-[10px] text-brand-ink/70">
                  Calibrated Level: <strong>{s.currentLevel}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Auditable Capstone Projects */}
        <div className="space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-ink/60 block">
            Auditable Real-World Deliverables
          </span>
          <div className="p-4 bg-brand-cream border border-brand-ink/30 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                {state.activeProject?.title || 'Distributed Event Booking Service'}
              </h3>
              <Badge variant="yellow">Rubric Score: 94%</Badge>
            </div>
            <p className="text-xs text-brand-ink/80 font-medium leading-relaxed">
              Architected a high-concurrency reservation API utilizing Node.js, Express, and PostgreSQL. Solved seat overselling using ACID transactions and distributed locking.
            </p>
            <div className="text-[11px] font-mono text-brand-ink/70">
              Repository: {state.activeProject?.githubUrl || 'https://github.com/alexmercer/event-booking-service'}
            </div>
          </div>
        </div>

        {/* Education & Open Certifications */}
        <div className="space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-ink/60 block">
            Verified Certifications &amp; Education
          </span>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-brand-cream border border-brand-ink/20 flex justify-between items-center">
              <div>
                <span className="font-bold text-brand-ink">freeCodeCamp JavaScript Algorithms Certification</span>
                <div className="text-[10px] text-brand-ink/60">Issued: Sept 2024 &bull; ID: FCC-JS-90142</div>
              </div>
              <Badge variant="default">VERIFIED</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
