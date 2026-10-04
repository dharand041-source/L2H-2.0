'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Target, CheckCircle2, ArrowRight, Award, Compass, RefreshCw } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug, CAREER_ROLES_CATALOG } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CareerGoalsPage() {
  const { state, setTargetRole } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);
  const [selectedRole, setSelectedRole] = useState(state.targetCareerSlug);
  const [targetTimeline, setTargetTimeline] = useState('3_MONTHS');
  const [targetSeniority, setTargetSeniority] = useState('ENTRY_LEVEL');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveGoal = () => {
    if (selectedRole !== state.targetCareerSlug) {
      setTargetRole(selectedRole);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="editorial-badge bg-brand-yellow text-brand-ink">
            Strategic Direction
          </span>
          <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
            Target Role &amp; Milestone Calibration
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Career Goals &amp; Objectives
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Lock in your target occupation, seniority benchmark, and achievement horizon. The Next Action Engine dynamically aligns all learning, practice, and matching to this goal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Goal Settings */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-6">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink pb-3 border-b border-brand-ink/20">
              Target Occupation Calibration
            </h2>

            {/* Target Role Dropdown */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-widest text-brand-ink/70 mb-2">
                Primary Target Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full p-3 bg-brand-cream border border-brand-ink text-sm font-bold text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-ink"
              >
                {CAREER_ROLES_CATALOG.map((role) => (
                  <option key={role.slug} value={role.slug}>
                    {role.title} ({role.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Seniority Level */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-widest text-brand-ink/70 mb-2">
                Target Level / Seniority
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'ENTRY_LEVEL', label: 'Entry / Junior', desc: 'L1 &ndash; L2 Focus' },
                  { id: 'MID_LEVEL', label: 'Mid-Level', desc: 'L3 Core Focus' },
                  { id: 'SENIOR', label: 'Senior / Lead', desc: 'L4 &ndash; L5 Mastery' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setTargetSeniority(lvl.id)}
                    className={`p-3 text-left border transition-all ${
                      targetSeniority === lvl.id
                        ? 'bg-brand-ink text-white border-brand-ink shadow-editorial-sm'
                        : 'bg-brand-cream text-brand-ink border-brand-ink/30 hover:bg-brand-paper'
                    }`}
                  >
                    <div className="text-xs font-bold uppercase">{lvl.label}</div>
                    <div className="text-[10px] opacity-75 mt-0.5">{lvl.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Horizon */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-widest text-brand-ink/70 mb-2">
                Target Employment Horizon
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: '1_MONTH', label: '1 Month', desc: 'Intensive Sprint' },
                  { id: '3_MONTHS', label: '3 Months', desc: 'Balanced Mastery' },
                  { id: '6_MONTHS', label: '6 Months', desc: 'Comprehensive' },
                ].map((tl) => (
                  <button
                    key={tl.id}
                    type="button"
                    onClick={() => setTargetTimeline(tl.id)}
                    className={`p-3 text-left border transition-all ${
                      targetTimeline === tl.id
                        ? 'bg-brand-orange text-white border-brand-ink shadow-editorial-sm'
                        : 'bg-brand-cream text-brand-ink border-brand-ink/30 hover:bg-brand-paper'
                    }`}
                  >
                    <div className="text-xs font-bold uppercase">{tl.label}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{tl.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-brand-ink/20 flex items-center justify-between">
              <Button variant="primary" size="md" onClick={handleSaveGoal}>
                Update Career Goal
              </Button>
              {savedSuccess && (
                <span className="text-xs font-bold text-brand-orange flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Goal Saved Successfully!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Goal Summary & Next Milestones */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-brand-ink pb-2 border-b border-brand-ink/20">
              Active Strategy Blueprint
            </h3>

            <div className="p-4 bg-brand-cream border border-brand-ink/20 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-brand-ink/70 font-semibold">Active Role:</span>
                <strong className="text-brand-ink">{currentRole?.title}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-ink/70 font-semibold">Current Readiness:</span>
                <strong className="text-brand-orange">{state.readinessScore}%</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-ink/70 font-semibold">Benchmark Salary:</span>
                <strong className="text-brand-ink">{currentRole?.averageSalary}</strong>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-ink/70 block">
                Next Logical Milestones:
              </span>
              <div className="space-y-1.5 text-xs font-medium">
                <div className="p-2.5 bg-brand-cream border border-brand-ink/20 flex items-center justify-between">
                  <span>1. Role-Calibrated Diagnostic</span>
                  <Link href={ROUTES.app.assessments.baseline} className="text-brand-orange font-bold hover:underline">
                    Take Test →
                  </Link>
                </div>
                <div className="p-2.5 bg-brand-cream border border-brand-ink/20 flex items-center justify-between">
                  <span>2. Skill Gap Remediation</span>
                  <Link href={ROUTES.app.skills.analysis} className="text-brand-orange font-bold hover:underline">
                    Analyze →
                  </Link>
                </div>
                <div className="p-2.5 bg-brand-cream border border-brand-ink/20 flex items-center justify-between">
                  <span>3. Portfolio Milestone Proof</span>
                  <Link href={ROUTES.app.projects.home} className="text-brand-orange font-bold hover:underline">
                    Build →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
