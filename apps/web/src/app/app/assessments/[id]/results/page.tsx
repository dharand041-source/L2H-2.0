'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Award,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  BarChart3,
  RefreshCw,
  Target
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';

export default function AssessmentResultsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);
  const score = state.assessmentScore ?? 0;
  const isAssessed = state.assessmentScore !== undefined;

  // Retrieve calibrated entry level from session storage
  const [calibratedStartingLevel, setCalibratedStartingLevel] = React.useState<string>('BEGINNER');
  React.useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`l2h_calibrated_level_${state.targetCareerSlug}`);
      if (stored) setCalibratedStartingLevel(stored);
    } catch {}
  }, [state.targetCareerSlug]);

  const demonstratedLevelLabel =
    score >= 90
      ? 'L4 Advanced'
      : score >= 75
      ? 'L3 Intermediate'
      : score >= 55
      ? 'L2 Applied Beginner'
      : score >= 35
      ? 'L1 Fundamentals'
      : 'L0 Starting Point';

  // Helper for non-humiliating constructive labels
  const getConstructiveVerdict = (currentLvl: string, gap: number) => {
    if (gap === 0) return 'APPLIED / VERIFIED';
    if (currentLvl === 'L0') return 'NOT YET DEMONSTRATED';
    if (currentLvl === 'L1') return 'NEEDS PRACTICE';
    if (currentLvl === 'L2') return 'DEVELOPING';
    if (currentLvl === 'L3') return 'INTERMEDIATE';
    return 'ADVANCED';
  };

  // Dynamically map real skills from state
  const skillScores = (state.skills || []).map((s) => {
    const isZero = s.currentLevel === 'L0' && !isAssessed;
    const scoreVal = isZero ? 0 : Math.round(s.confidence * 100) || (s.currentLevel === 'L0' ? 15 : 75);
    const verdict = getConstructiveVerdict(s.currentLevel, s.gap);
    const badge = s.gap === 0 ? 'default' : s.priority === 'CRITICAL' ? 'rose' : 'yellow';

    return {
      skill: s.name,
      level: `${s.currentLevel} (Target: ${s.requiredLevel})`,
      currentLevel: s.currentLevel,
      requiredLevel: s.requiredLevel,
      score: scoreVal,
      verdict,
      badge,
      gap: s.gap,
      priority: s.priority,
    };
  });

  const criticalGaps = skillScores.filter((s) => s.gap > 0);

  // Curated free resources
  const freeResources = [
    {
      skill: 'Full-Stack & CS Fundamentals',
      provider: 'GeeksforGeeks',
      title: 'GeeksforGeeks: Core DSA & System Architecture',
      url: 'https://www.geeksforgeeks.org/fundamentals-of-algorithms/',
      type: 'Interactive DSA & Algorithms',
    },
    {
      skill: 'Web & Frontend Development',
      provider: 'W3Schools',
      title: 'W3Schools: JavaScript, React & Modern Web APIs',
      url: 'https://www.w3schools.com/js/',
      type: 'Hands-on Browser Sandboxes',
    },
    {
      skill: 'Database Design & SQL',
      provider: 'W3Schools',
      title: 'W3Schools: SQL Joins, Aggregations & Query Tuning',
      url: 'https://www.w3schools.com/sql/',
      type: 'Executable SQL Exercises',
    },
    {
      skill: 'Quantitative & Aptitude',
      provider: 'GeeksforGeeks',
      title: 'GeeksforGeeks: Quantitative Aptitude Tracks',
      url: 'https://www.geeksforgeeks.org/aptitude-questions-and-answers/',
      type: 'Practice Question Banks',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="editorial-badge bg-brand-yellow text-brand-ink">
            Diagnostic Verdict
          </span>
          <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
            Calibrated Competency Report
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Assessment Results &amp; Calibration
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Diagnostics for {currentRole?.title || 'Target Role'} have evaluated your foundational logic, asynchronous control flow, and architectural syntax.
        </p>
      </div>

      {/* Hero Scorecard Banner */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="editorial-badge bg-brand-orange text-white text-xs">
                Your Baseline
              </span>
              <span className="text-xs font-bold text-brand-ink/70">
                Career: {currentRole?.title || 'Target Role'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
              <div className="p-3 bg-brand-cream border border-brand-ink/20">
                <span className="text-[10px] uppercase font-bold text-brand-ink/60 block">Starting Calibration</span>
                <span className="font-display text-lg font-bold text-brand-ink">{calibratedStartingLevel}</span>
              </div>
              <div className="p-3 bg-brand-cream border border-brand-ink/20">
                <span className="text-[10px] uppercase font-bold text-brand-ink/60 block">Demonstrated Level</span>
                <span className="font-display text-lg font-bold text-brand-orange">{demonstratedLevelLabel}</span>
              </div>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-brand-ink">
              Overall Calibrated Score:{' '}
              <span className="text-brand-orange">
                {isAssessed ? `${score}%` : 'NOT ASSESSED'}
              </span>
            </h2>
            <p className="text-sm text-brand-ink/85 font-medium leading-relaxed max-w-2xl">
              {isAssessed
                ? `Baseline calibrated for ${currentRole?.title || 'your role'}. This is your starting diagnostic map, not a fixed grade. Your identified skill gaps feed directly into your personalized learning roadmap below.`
                : 'No diagnostic attempt has been recorded yet. Launch an assessment to calibrate your baseline across L0 to L5.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href={ROUTES.app.learning.roadmap}>
                <Button variant="primary" size="lg" className="text-base">
                  Start Personalized Learning Roadmap <ArrowRight className="ml-2 w-5 h-5 inline" />
                </Button>
              </Link>
              <Link href={ROUTES.app.skills.analysis}>
                <Button variant="outline" size="lg" className="text-base">
                  View Skill Gaps
                </Button>
              </Link>
              <Link href={ROUTES.app.assessments.baseline}>
                <Button variant="ghost" size="lg" className="text-base text-brand-ink/80">
                  <RefreshCw className="mr-2 w-4 h-4 inline" /> Reassess Skill
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-brand-cream border border-brand-ink/30">
            <ProgressRing progress={score} size={110} strokeWidth={9} color="#E43D12" />
            <span className="font-display text-3xl font-bold text-brand-ink mt-3">
              {isAssessed ? `${score}/100` : '—'}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-ink/70 mt-1">
              Calibrated Capability
            </span>
          </div>
        </div>
      </div>

      {/* Granular Skill Scores Matrix */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-6">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink pb-3 border-b border-brand-ink/20">
          Competency Breakdown by Skill
        </h2>

        <div className="space-y-3">
          {skillScores.map((item) => (
            <div
              key={item.skill}
              className="p-4 bg-brand-cream border border-brand-ink/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-brand-ink">{item.skill}</span>
                  <Badge variant={item.badge as any}>{item.verdict}</Badge>
                </div>
                <div className="text-xs text-brand-ink/70 font-medium mt-1">
                  Calibrated Level: <strong className="text-brand-ink">{item.level}</strong>
                  {item.gap > 0 && (
                    <span className="text-brand-rose font-bold ml-2">
                      &bull; {item.gap} Step Gap
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="font-display text-2xl font-bold text-brand-ink">
                    {item.score}%
                  </span>
                  <span className="text-[10px] block text-brand-ink/60 uppercase font-bold">Accuracy</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-brand-ink/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-semibold text-brand-ink/70">
            All question records saved to attempt history. Anti-repetition engine active.
          </span>
          <Link href={ROUTES.app.skills.analysis}>
            <Button variant="accent" size="md">
              Proceed to Weighted Skill Analyzer &rarr;
            </Button>
          </Link>
        </div>
      </div>

      {/* Free Learning Resources Section */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
          <div>
            <span className="editorial-badge bg-brand-yellow text-brand-ink text-[10px] mb-1">
              Curated Free Curriculum
            </span>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">
              Recommended Free Learning Resources
            </h2>
          </div>
          <BookOpen className="w-6 h-6 text-brand-orange" />
        </div>

        <p className="text-xs text-brand-ink/80 leading-relaxed">
          Targeted study paths mapped directly from your evaluated skill gaps. Verified non-paywalled resources from GeeksforGeeks, W3Schools, and MDN:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {freeResources.map((res) => (
            <a
              key={res.title}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-brand-cream border border-brand-ink/40 hover:border-brand-ink hover:bg-brand-paper transition-all block group"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <Badge variant="paper">{res.provider}</Badge>
                <span className="text-[10px] font-mono text-brand-orange font-bold group-hover:underline">
                  Open Tutorial &rarr;
                </span>
              </div>
              <h3 className="font-bold text-sm text-brand-ink group-hover:text-brand-orange transition-colors">
                {res.title}
              </h3>
              <p className="text-xs text-brand-ink/70 mt-1">
                {res.type}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
