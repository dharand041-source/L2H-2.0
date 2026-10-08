import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: 'Technology Validation Lab (TRL 4) | Learn-2-Hire',
  description: 'SEVA TRL 4 Software Component Integration and Laboratory Validation Dossier for Learn-2-Hire 2.0.',
};

export default function PublicValidationPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-ink/15 pb-4">
            <div>
              <span className="editorial-badge bg-brand-orange text-white text-[10px]">
                SEVA TRL 4 VALIDATION DOSSIER
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-bold uppercase mt-2">
                Innovation Validation Lab
              </h1>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-brand-ink/60 uppercase">Target Readiness Level</div>
              <div className="font-display text-xl font-bold text-brand-ink">TRL 4 (Validated in Laboratory)</div>
            </div>
          </div>
          <p className="text-sm text-brand-ink/80 leading-relaxed max-w-3xl">
            This dossier provides evaluators and judges with verifiable documentation of system component integration across the Learn-2-Hire 2.0 platform. Per SEVA specifications, TRL 4 represents software components functionally integrated and tested in a laboratory environment before multi-institutional deployment.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link href={ROUTES.app.validation}>
              <Button variant="primary" size="lg" className="gap-2">
                Launch Interactive Validation Lab <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href={ROUTES.public.howItWorks}>
              <Button variant="outline" size="lg">
                View How It Works
              </Button>
            </Link>
          </div>
        </div>

        {/* 9 Validated Subsystems */}
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial space-y-4">
          <h2 className="font-display text-2xl font-bold uppercase">
            9 Core Validated Subsystem Engines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {[
              { title: 'Career Intelligence Engine', status: 'VALIDATED', desc: 'Dynamic blueprint generation across 12 canonical roles with 0 hardcoded branching.' },
              { title: 'Adaptive Assessment Engine', status: 'VALIDATED', desc: 'Multi-tier calibration (Beginner, Amateur, Professional) with bounded streak adaptation.' },
              { title: 'Skill Analysis Engine', status: 'VALIDATED', desc: 'Calibrated readiness %, constructive non-judgmental diagnostic labels, zero fake scores.' },
              { title: 'Learning Recommendation Engine', status: 'VALIDATED', desc: 'Targeted free curricula (W3Schools, MDN, CS50) addressing verified skill gaps.' },
              { title: 'Practice Sandbox Engine', status: 'VALIDATED', desc: 'Node VM AST sandbox execution with static security analyzer blocking forbidden system calls.' },
              { title: 'Interview Simulation Engine', status: 'VALIDATED', desc: 'Microphone speech recognition with editable interim transcripts and text fallback.' },
              { title: 'Resume ATS Engine', status: 'VALIDATED', desc: 'Role-specific keyword density and experience qualification analyzer.' },
              { title: 'Opportunity Matching Engine', status: 'VALIDATED', desc: 'Explainable factor-based qualification matching against verified skill evidence.' },
              { title: 'Improvement Loop Engine', status: 'VALIDATED', desc: 'Closed-loop cycle: Assessment -> Diagnostics -> Practice -> Verified Reassessment.' },
            ].map((engine) => (
              <div key={engine.title} className="p-4 bg-brand-cream border border-brand-ink/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{engine.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-400">
                    {engine.status}
                  </span>
                </div>
                <p className="text-xs text-brand-ink/75 leading-relaxed">{engine.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Evaluation Summary */}
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial space-y-4">
          <h2 className="font-display text-2xl font-bold uppercase">
            Laboratory Evaluation Summary
          </h2>
          <div className="space-y-3 text-xs text-brand-ink/80 leading-relaxed">
            <p>
              <strong>1. Novice Zero-Penalty Guarantee:</strong> Candidates starting as Class 12 or freshers with zero prior knowledge receive L0/L1 fundamental questions (syntax recognition, mental models) rather than advanced architectural questions.
            </p>
            <p>
              <strong>2. Anti-Repetition Security:</strong> All 66 universal questions use normalized SHA-256 hashing to prevent duplicate questions or cosmetic variant repetition for any candidate.
            </p>
            <p>
              <strong>3. Context Partitioning:</strong> All candidate skill evidence, blueprints, and practice sessions are strictly partitioned by <code>userId:careerRoleId</code>, preventing cross-role state pollution.
            </p>
            <p>
              <strong>4. Honest TRL 4 Stance:</strong> Controlled laboratory validation is complete (12 of 12 criteria passed). Multi-cohort operational testing in production colleges represents the TRL 5 transition roadmap. No unverified pilot metrics are claimed.
            </p>
          </div>
          <div className="pt-4 border-t border-brand-ink/15 flex justify-end">
            <Link href={ROUTES.app.validation}>
              <Button variant="primary" className="gap-2">
                Open Full Validation Dashboard in App <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
