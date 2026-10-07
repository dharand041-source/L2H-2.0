'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Code2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { generatePersonalizedRoadmap, PersonalizedRoadmapModule } from '@/lib/curriculum';
import { ROUTES } from '@/lib/routes';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LearningRoadmapPage() {
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  // Dynamically synthesize role-specific, gap-driven personalized roadmap
  const plan = useMemo(() => {
    return generatePersonalizedRoadmap(
      state.targetCareerSlug || 'full-stack-developer',
      state.skills || [],
      state.assessmentScore
    );
  }, [state.targetCareerSlug, state.skills, state.assessmentScore]);

  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Hydrate completed learning steps from localStorage and Supabase on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`l2h_completed_learning_${state.targetCareerSlug || 'fs'}`);
      if (stored) {
        setCompletedSteps(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    const loadRemote = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: paths } = await supabase
            .from('learning_paths')
            .select('id')
            .eq('user_id', user.id)
            .limit(1);

          if (paths && paths.length > 0) {
            const { data: items } = await supabase
              .from('learning_path_items')
              .select('sequence_order, is_completed')
              .eq('learning_path_id', paths[0].id)
              .eq('is_completed', true);

            if (items && items.length > 0) {
              const remoteSteps = items.map((i) => String(i.sequence_order).padStart(2, '0'));
              setCompletedSteps((prev) => Array.from(new Set([...prev, ...remoteSteps])));
            }
          }
        }
      } catch (err) {
        console.warn('Load remote learning progress note:', err);
      }
    };

    loadRemote();
  }, [state.targetCareerSlug]);

  const toggleComplete = async (step: string) => {
    const next = completedSteps.includes(step)
      ? completedSteps.filter((s) => s !== step)
      : [...completedSteps, step];

    setCompletedSteps(next);
    try {
      localStorage.setItem(`l2h_completed_learning_${state.targetCareerSlug || 'fs'}`, JSON.stringify(next));
    } catch {
      // ignore
    }

    // Persist to Supabase learning_paths & learning_path_items
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const totalMod = Math.max(plan.totalModules, 1);
        const { data: pathRow } = await supabase
          .from('learning_paths')
          .upsert(
            {
              user_id: user.id,
              target_role_id: '50000000-0000-0000-0000-000000000001',
              title: `${currentRole?.title || 'Full-Stack Developer'} Remediation Roadmap`,
              description: 'Personalized remediation modules for calibrated gaps',
              progress_percent: Math.round((next.length / totalMod) * 100),
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,target_role_id' }
          )
          .select();

        const pathId = pathRow && pathRow[0]?.id;
        if (pathId) {
          const stepNum = parseInt(step, 10);
          const targetMod = plan.modules.find((m) => m.step === step);
          await supabase.from('learning_path_items').upsert(
            {
              learning_path_id: pathId,
              sequence_order: stepNum,
              skill_id: '40000000-0000-0000-0000-000000000001',
              topic: targetMod?.title || 'Roadmap Topic',
              is_completed: next.includes(step),
              completed_at: next.includes(step) ? new Date().toISOString() : null,
            },
            { onConflict: 'learning_path_id,sequence_order' }
          );
        }
      }
    } catch (err) {
      console.warn('Persist learning item note:', err);
    }
  };

  // Section 64: Honest Empty State for Unassessed Candidates
  if (!plan.isAssessed) {
    return (
      <div className="space-y-8">
        <div className="border-b-[1.5px] border-brand-ink pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="editorial-badge bg-brand-rose text-white">
              Personalized Curriculum
            </span>
            <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
              Target Role: {currentRole?.title || 'Full-Stack Developer'}
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
            Competency Remediation Roadmap
          </h1>
          <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
            Curated from your assessment evidence, skill gaps, target role, and learning progress.
          </p>
        </div>

        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 sm:p-12 shadow-editorial text-center space-y-6">
          <div className="w-16 h-16 bg-brand-orange text-white rounded-none border border-brand-ink flex items-center justify-center mx-auto shadow-editorial-sm">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="max-w-lg mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-rose">
              Assessment Required
            </span>
            <h2 className="font-display text-3xl uppercase text-brand-ink font-bold">
              No Assessment Data Yet
            </h2>
            <p className="text-sm text-brand-ink/80 leading-relaxed font-medium">
              Your personalized curriculum is constructed dynamically from empirical assessment evidence. Take your role diagnostic to benchmark your true capabilities and unlock your customized roadmap.
            </p>
          </div>

          <div className="pt-2">
            <Link href={ROUTES.app.assessments.baseline}>
              <Button variant="accent" size="lg">
                Start Baseline Diagnostic Assessment →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-orange text-white">
                Personalized Curriculum
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Target Role: {plan.targetRoleTitle}
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Competency Remediation Roadmap
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Curated from your assessment evidence, skill gaps, target role, and learning progress.
            </p>
          </div>

          <Link href={ROUTES.app.practice.home}>
            <Button variant="accent" size="md">
              Practice Challenges →
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress Telemetry Banner (Dynamic values, not hardcoded!) */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-4 shadow-editorial flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="yellow">
            {completedSteps.length} of {plan.totalModules} Modules Completed
          </Badge>
          <span className="text-xs font-semibold text-brand-ink/70">
            Estimated Curriculum Time: {plan.estimatedTotalHours} Hours Total
          </span>
        </div>

        <Link href={ROUTES.app.improve.reassessment}>
          <span className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1">
            Ready for Reassessment? Test Now →
          </span>
        </Link>
      </div>

      {/* Structured Sequential Roadmap */}
      <div className="space-y-6">
        {plan.modules.map((mod: PersonalizedRoadmapModule) => {
          const isDone = completedSteps.includes(mod.step) || mod.status === 'TARGET_MET';

          return (
            <div
              key={mod.step}
              className={`bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial transition-all ${
                isDone ? 'opacity-75 bg-brand-cream/60' : ''
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Step Index & Checkbox */}
                <div className="lg:col-span-1 flex lg:flex-col items-center gap-2">
                  <span className="font-display text-3xl font-bold text-brand-orange">
                    {mod.step}
                  </span>
                  <button
                    onClick={() => toggleComplete(mod.step)}
                    className="p-1 border border-brand-ink bg-brand-cream hover:bg-brand-yellow/30"
                    title={isDone ? 'Mark Incomplete' : 'Mark Complete'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                    ) : (
                      <Circle className="w-5 h-5 text-brand-ink/40" />
                    )}
                  </button>
                </div>

                {/* Module Details */}
                <div className="lg:col-span-8 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        mod.priority === 'CRITICAL'
                          ? 'rose'
                          : mod.priority === 'TARGET_MET'
                          ? 'paper'
                          : 'yellow'
                      }
                    >
                      {mod.priority === 'TARGET_MET' ? 'TARGET MET' : `${mod.priority} GAP`}
                    </Badge>

                    <span className="editorial-badge bg-brand-cream text-brand-ink text-[10px]">
                      {mod.primaryResource?.provider || 'Educational Standard'}
                    </span>

                    {/* Honest Free vs Paid/Subscription Access Badge */}
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                        mod.primaryResource?.access === 'FREE'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-600'
                          : 'bg-amber-50 text-amber-800 border-amber-600'
                      }`}
                    >
                      {mod.primaryResource?.access || 'FREE'}
                    </span>

                    <span className="text-xs font-bold text-brand-orange">
                      Target Upgrade: {mod.levelUpgrade}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-brand-ink/80 font-medium leading-relaxed">
                    {mod.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {mod.topics.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-semibold px-2 py-0.5 bg-brand-cream border border-brand-ink/20 text-brand-ink"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Resource Recommendation Sub-Card */}
                  {mod.resources && mod.resources.length > 0 && (
                    <div className="pt-3 border-t border-brand-ink/10 mt-3 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-ink/60 block">
                        Recommended Verified Learning Resources:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {mod.resources.slice(0, 2).map((res) => (
                          <a
                            key={res.id}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 border border-brand-ink/30 bg-brand-cream/40 hover:bg-white transition-all text-left block"
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[10px] font-bold text-brand-orange">
                                {res.provider}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1 py-0.2 border ${
                                  res.isFree
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                                    : 'bg-amber-50 text-amber-800 border-amber-500'
                                }`}
                              >
                                {res.access}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-brand-ink line-clamp-1">
                              {res.title}
                            </p>
                            <span className="text-[10px] text-brand-ink/60 mt-1 block">
                              {res.qualityWhy}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Action Link & Practice Button */}
                <div className="lg:col-span-3 flex flex-col gap-2 items-start lg:items-end justify-between h-full pt-1">
                  <span className="text-xs font-semibold text-brand-ink/70 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {mod.estimatedHours} hrs
                  </span>

                  <div className="space-y-2 w-full lg:w-auto">
                    <a
                      href={mod.primaryResource?.url || 'https://developer.mozilla.org'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full lg:w-auto block"
                    >
                      <Button variant="primary" size="sm" fullWidth className="text-xs">
                        Open Free Curriculum <ExternalLink className="ml-1 w-3.5 h-3.5 inline" />
                      </Button>
                    </a>

                    <Link href={mod.practiceChallengeUrl} className="w-full lg:w-auto block">
                      <Button variant="outline" size="sm" fullWidth className="text-xs">
                        <Code2 className="mr-1 w-3.5 h-3.5 inline" /> Practice Skill Lab
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
