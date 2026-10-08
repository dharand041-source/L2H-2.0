'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { History, ArrowLeft, CheckCircle2, Clock, Filter, Award } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';

export default function PracticeHistoryPage() {
  const { state } = useCandidateState();
  const currentRoleSlug = state.targetCareerSlug || 'full-stack-developer';
  const currentRole = getCareerBySlug(currentRoleSlug);

  const [filterRole, setFilterRole] = useState<string>('ALL');

  // Multi-role historical practice audit trail
  const attempts = [
    {
      id: 'att-01',
      careerRole: 'Full-Stack Developer',
      careerRoleSlug: 'full-stack-developer',
      category: 'Backend API Engineering',
      challenge: 'REST API Sliding Window Rate Limiter',
      skill: 'Node.js',
      difficulty: 'MEDIUM',
      date: 'Today, 2:15 PM',
      verdict: 'PASSED',
      score: 100,
      runtime: '42ms',
      evidence: 'Level L3 verified (+0.15 confidence)'
    },
    {
      id: 'att-02',
      careerRole: 'Machine Learning Engineer',
      careerRoleSlug: 'machine-learning-engineer',
      category: 'Model Evaluation',
      challenge: 'Binary Confusion Matrix & F1-Score Computation',
      skill: 'Scikit-Learn & PyTorch',
      difficulty: 'MEDIUM',
      date: 'Yesterday, 4:20 PM',
      verdict: 'PASSED',
      score: 95,
      runtime: '18ms',
      evidence: 'Level L3 verified (+0.15 confidence)'
    },
    {
      id: 'att-03',
      careerRole: 'Frontend Developer',
      careerRoleSlug: 'frontend-developer',
      category: 'Accessibility (WCAG AA)',
      challenge: 'Keyboard Focus Trap for Modal Dialogs',
      skill: 'Web Accessibility',
      difficulty: 'HARD',
      date: '2 days ago',
      verdict: 'PASSED',
      score: 100,
      runtime: '31ms',
      evidence: 'Level L4 verified (+0.15 confidence)'
    },
    {
      id: 'att-04',
      careerRole: 'Technical Product Manager',
      careerRoleSlug: 'technical-product-manager',
      category: 'Prioritization Frameworks',
      challenge: 'RICE Framework Scoring & Trade-Off Ranking',
      skill: 'Product Roadmapping & PRDs',
      difficulty: 'MEDIUM',
      date: '3 days ago',
      verdict: 'PASSED',
      score: 100,
      runtime: 'Scenario Rubric',
      evidence: 'Level L3 verified (+0.15 confidence)'
    }
  ];

  const filteredAttempts =
    filterRole === 'ALL'
      ? attempts
      : attempts.filter((a) => a.careerRoleSlug === filterRole);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-ink/20">
        <Link
          href={ROUTES.app.practice.home}
          className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5 hover:text-brand-orange transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Practice Arena
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-brand-orange uppercase">
            Active Role: {currentRole?.title || 'Full-Stack Developer'}
          </span>
        </div>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
            Practice Attempt History
          </h1>
          <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
            Historical log of code executions, scenario decisions, test pass rates, and verified competency evidence.
          </p>
        </div>

        {/* Role Filter Selector */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <Filter className="w-4 h-4 text-brand-ink/60" />
          <button
            onClick={() => setFilterRole('ALL')}
            className={`px-2.5 py-1 border border-brand-ink transition-colors ${
              filterRole === 'ALL'
                ? 'bg-brand-ink text-brand-paper font-bold'
                : 'bg-brand-paper text-brand-ink hover:bg-brand-cream'
            }`}
          >
            All Roles
          </button>
          <button
            onClick={() => setFilterRole(currentRoleSlug)}
            className={`px-2.5 py-1 border border-brand-ink transition-colors ${
              filterRole === currentRoleSlug
                ? 'bg-brand-ink text-brand-paper font-bold'
                : 'bg-brand-paper text-brand-ink hover:bg-brand-cream'
            }`}
          >
            Active Role Only
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAttempts.map((att) => (
          <div
            key={att.id}
            className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-cream px-2 py-0.5 border border-brand-ink/20 text-brand-ink">
                  {att.careerRole}
                </span>
                <Badge variant="yellow">{att.category}</Badge>
                <span className="text-[10px] font-mono font-bold text-brand-orange uppercase">
                  {att.skill}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase text-brand-ink/50">
                  {att.difficulty}
                </span>
                <span className="text-xs text-brand-ink/60 font-semibold">&bull; {att.date}</span>
              </div>

              <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                {att.challenge}
              </h3>

              <div className="text-xs text-brand-ink/70 flex flex-wrap items-center gap-3">
                <span>Runtime: <strong>{att.runtime}</strong></span>
                <span>Score: <strong>{att.score}%</strong></span>
                <span className="text-brand-orange font-medium flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Evidence: {att.evidence}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-orange flex items-center gap-1 bg-brand-cream px-3 py-1.5 border border-brand-ink">
                <CheckCircle2 className="w-4 h-4" /> {att.verdict}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
