'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { EditorialNav } from '@/components/layout/editorial-nav';
import { Button } from '@/components/ui/button';

export default function EthicsPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink flex flex-col bg-grid-subtle">
      <EditorialNav />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="border-b-[1.5px] border-brand-ink pb-8 space-y-3">
            <span className="editorial-badge bg-brand-yellow text-brand-ink text-xs">
              Ethics &amp; Governance
            </span>
            <h1 className="font-display-hero text-brand-ink tracking-tight">
              AI ETHICS &amp; DATA <br />
              <span className="text-brand-orange">INTEGRITY CHARTER.</span>
            </h1>
            <p className="text-lg text-brand-ink/80 leading-relaxed font-medium">
              Learn-2-Hire operates on principles of algorithmic explainability, anti-hallucination guardrails, and respect for legal intellectual property boundaries.
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-brand-ink/90 font-medium leading-relaxed">
            <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial space-y-3">
              <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
                1. No Fabricated Job Specifications or ATS Claims
              </h2>
              <p>
                We never invent job openings, scrape unauthorized portals, or claim universal third-party ATS guarantees. When we calculate compatibility, we explicitly present a &quot;Learn-2-Hire compatibility estimate&quot; based on transparent keyword and competency differentials.
              </p>
            </div>

            <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial space-y-3">
              <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
                2. Anti-Hallucination &amp; Non-Repetition In Assessments
              </h2>
              <p>
                Candidate assessment items are validated against concrete standard programming specifications (ECMAScript, ISO SQL, W3C standards). Anti-repetition logs prevent redundant test generation and protect candidate evaluation accuracy.
              </p>
            </div>

            <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial space-y-3">
              <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
                3. Respect for Copyrighted Educational Ecosystems
              </h2>
              <p>
                We do not scrape or republish proprietary course content from Coursera, Udemy, LeetCode, or HackerRank. We link directly to legitimate open sources (freeCodeCamp, MDN Web Docs, SQLBolt) with proper provider attribution and metadata.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <Link href={ROUTES.public.about}>
              <Button variant="outline">← About Learn-2-Hire</Button>
            </Link>
            <Link href={ROUTES.public.contact}>
              <Button variant="primary">Inquire with Trust &amp; Safety →</Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-brand-cream border-t-[1.5px] border-brand-ink py-8 px-4 text-center text-xs font-semibold text-brand-ink/70">
        Learn-2-Hire 2.0 &bull; AI Ethics Charter
      </footer>
    </div>
  );
}
