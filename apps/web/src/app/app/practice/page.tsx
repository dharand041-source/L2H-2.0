'use client';

import React, { Suspense, useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  History,
  ArrowRight,
  ExternalLink,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Lock,
  Layers,
  Flame,
  Award
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  getHydratedRolePracticeBlueprint,
  getRecommendedNextChallenge,
  RolePracticeBlueprint
} from '@/lib/practice';
import { getPracticeCategoryIcon } from '@/lib/practice/practice-icons';

function PracticeHubInner() {
  const searchParams = useSearchParams();
  const skillParam = searchParams.get('skill');
  const { state } = useCandidateState();

  const activeRoleSlug = state.targetCareerSlug || 'full-stack-developer';

  // Stale data protection: track active role for query cancellation / guard
  const [currentRoleSlug, setCurrentRoleSlug] = useState<string>(activeRoleSlug);
  const [isLoadingRole, setIsLoadingRole] = useState<boolean>(false);

  useEffect(() => {
    if (state.targetCareerSlug && state.targetCareerSlug !== currentRoleSlug) {
      setIsLoadingRole(true);
      const timer = setTimeout(() => {
        setCurrentRoleSlug(state.targetCareerSlug);
        setIsLoadingRole(false);
      }, 50); // Immediate smooth transition with role guard
      return () => clearTimeout(timer);
    }
  }, [state.targetCareerSlug, currentRoleSlug]);

  // Generate hydrated blueprint with real catalog inventory and candidate skill gaps
  const blueprint: RolePracticeBlueprint = useMemo(() => {
    return getHydratedRolePracticeBlueprint(currentRoleSlug, state.skills);
  }, [currentRoleSlug, state.skills]);

  // Recommended next challenge personalized for candidate's skill gap
  const recommendedChallenge = useMemo(() => {
    return getRecommendedNextChallenge(currentRoleSlug, state.skills);
  }, [currentRoleSlug, state.skills]);

  const activeWeakSkill =
    skillParam ||
    recommendedChallenge?.skillName ||
    state.skills.find((s) => s.gap > 0)?.name;

  if (isLoadingRole) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="font-display text-2xl uppercase tracking-tight text-brand-ink">
          Loading Practice Blueprint...
        </h2>
        <p className="text-xs text-brand-ink/70">
          Calibrating role-specific challenge pool and evaluation engine...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8" key={`practice-arena-${currentRoleSlug}`}>
      {/* Editorial Header - Career Aware */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-yellow text-brand-ink">
                Active Career Role
              </span>
              <span className="text-xs font-mono text-brand-ink font-bold uppercase tracking-wider bg-brand-cream px-2 py-0.5 border border-brand-ink/20">
                {blueprint.careerRoleTitle}
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-semibold uppercase">
                &bull; Stage: {state.stage.replace(/_/g, ' ')}
              </span>
              <span className="text-xs font-mono text-brand-orange font-bold uppercase">
                &bull; Readiness: {state.readinessScore}%
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Practice Arena
            </h1>
            <p className="text-base text-brand-ink/80 max-w-3xl mt-1">
              {blueprint.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={ROUTES.app.practice.history}>
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-1.5 inline" /> Practice History
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic Personalized Skill Gap Recommendation Banner */}
      {recommendedChallenge && (
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="rose">RECOMMENDED FOR YOUR SKILL GAP</Badge>
              <span className="text-xs font-bold text-brand-orange uppercase">
                {recommendedChallenge.skillName} ({recommendedChallenge.targetLevel})
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-brand-cream border border-brand-ink/20 font-bold uppercase">
                {recommendedChallenge.difficulty}
              </span>
            </div>
            <h2 className="font-display text-lg uppercase text-brand-ink font-bold">
              {recommendedChallenge.title}
            </h2>
            <p className="text-xs text-brand-ink/80 font-medium max-w-2xl">
              {recommendedChallenge.description}
            </p>
          </div>

          <Link
            href={`/app/practice/role?challengeId=${encodeURIComponent(
              recommendedChallenge.id
            )}&category=${encodeURIComponent(recommendedChallenge.categoryId)}`}
          >
            <Button variant="accent" size="sm" className="whitespace-nowrap">
              Start Recommended Challenge →
            </Button>
          </Link>
        </div>
      )}

      {/* Role Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {blueprint.categories.map((cat, idx) => {
          const Icon = getPracticeCategoryIcon(cat.iconName);
          const hasChallenges = (cat.challengeCount || 0) > 0;
          const completedCount = cat.userCompletedCount || 0;
          const totalCount = cat.challengeCount || 0;
          const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          // Alternate editorial accents
          const accents: Array<'orange' | 'yellow' | 'rose' | 'pink'> = [
            'orange',
            'rose',
            'yellow',
            'pink'
          ];
          const accent = accents[idx % accents.length];

          return (
            <Card
              key={`${currentRoleSlug}-${cat.id}`}
              hoverable={hasChallenges}
              accentBorder={accent}
              className={`flex flex-col justify-between transition-all ${
                !hasChallenges ? 'opacity-85 bg-brand-paper/70' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-brand-cream border border-brand-ink flex items-center justify-center">
                    <Icon className="w-5 h-5 text-brand-orange" />
                  </div>

                  {/* Real Database Count Badge */}
                  {hasChallenges ? (
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/70 bg-brand-cream px-2 py-0.5 border border-brand-ink/20">
                      {totalCount} {totalCount === 1 ? 'Challenge' : 'Challenges'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/40 bg-brand-paper px-2 py-0.5 border border-brand-ink/10">
                      Coming Soon
                    </span>
                  )}
                </div>

                <h3 className="font-display text-2xl font-bold uppercase text-brand-ink mt-0.5 mb-2 leading-tight">
                  {cat.title}
                </h3>
                <p className="text-xs text-brand-ink/80 font-medium leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* Candidate Skill & Progress Stats */}
                <div className="space-y-1.5 pt-3 border-t border-brand-ink/10 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-brand-ink/70">
                    <span>Target Skill:</span>
                    <span className="font-bold text-brand-ink">{cat.skillNames[0] || 'Core'}</span>
                  </div>

                  {hasChallenges ? (
                    <>
                      <div className="flex items-center justify-between text-brand-ink/70">
                        <span>Completed:</span>
                        <span className="font-bold text-brand-ink">
                          {completedCount} / {totalCount}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-brand-cream h-2 border border-brand-ink/30 overflow-hidden mt-1">
                        <div
                          className="bg-brand-orange h-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="text-[10px] text-brand-ink/50 italic pt-1">
                      Content preparing for this competency
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Enter Arena & Learn Free CTA */}
              <div className="mt-6 pt-4 border-t border-brand-ink/20 space-y-2">
                {hasChallenges ? (
                  <Link href={cat.routeHref || `/app/practice/role?category=${cat.id}`}>
                    <Button variant="primary" size="sm" fullWidth>
                      Enter Arena <ArrowRight className="w-3.5 h-3.5 ml-1.5 inline" />
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" fullWidth disabled>
                    <Lock className="w-3.5 h-3.5 mr-1.5 inline" /> Preparing Challenges
                  </Button>
                )}

                {/* Step 64 Free Learning CTA */}
                {cat.freeLearningUrl && (
                  <a
                    href={cat.freeLearningUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-brand-ink/70 hover:text-brand-orange transition-colors pt-1"
                  >
                    <BookOpen className="w-3 h-3 inline" />
                    Learn Free ({cat.freeLearningProvider})
                    <ExternalLink className="w-2.5 h-2.5 inline" />
                  </a>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function PracticeHubPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center font-display text-xl uppercase tracking-tight text-brand-ink">
          Loading Practice Arena...
        </div>
      }
    >
      <PracticeHubInner />
    </Suspense>
  );
}
