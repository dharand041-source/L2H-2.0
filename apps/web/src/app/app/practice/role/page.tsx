'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  BookOpen,
  ExternalLink,
  Code2,
  HelpCircle,
  Layers,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  getPracticeChallengesForRole,
  getPracticeChallengeById,
  evaluatePracticeSubmission,
  getRolePracticeBlueprint,
  PracticeChallenge
} from '@/lib/practice';

function RolePracticeInner() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const challengeParam = searchParams.get('challengeId');

  const { state, recordPracticeCompletion } = useCandidateState();
  const currentRoleSlug = state.targetCareerSlug || 'full-stack-developer';
  const currentRole = getCareerBySlug(currentRoleSlug);
  const blueprint = getRolePracticeBlueprint(currentRoleSlug);

  // Filter challenges for active career role, optionally filtered by category
  const roleChallenges = useMemo(() => {
    return getPracticeChallengesForRole(currentRoleSlug, categoryParam || undefined);
  }, [currentRoleSlug, categoryParam]);

  // Active selected challenge
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(
    challengeParam || (roleChallenges[0]?.id ?? null)
  );

  const activeChallenge: PracticeChallenge | undefined = useMemo(() => {
    if (selectedChallengeId) {
      const found = getPracticeChallengeById(selectedChallengeId);
      if (found && found.careerRoleSlug === currentRoleSlug) return found;
    }
    return roleChallenges[0];
  }, [selectedChallengeId, roleChallenges, currentRoleSlug]);

  // Code editor state
  const [userCode, setUserCode] = useState<string>(activeChallenge?.starterCode || '');
  // Scenario option state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Execution result state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<{
    score: number;
    passed: boolean;
    feedback: string;
    verdict: 'PASSED' | 'FAILED';
  } | null>(null);

  // Synchronize code starter when active challenge changes
  React.useEffect(() => {
    if (activeChallenge) {
      setUserCode(activeChallenge.starterCode || '');
      setSelectedOptionId(null);
      setSubmissionResult(null);
    }
  }, [activeChallenge?.id]);

  const handleSubmit = async () => {
    if (!activeChallenge) return;
    setIsSubmitting(true);

    try {
      const evaluation = evaluatePracticeSubmission(activeChallenge, {
        code: userCode,
        selectedOptionId: selectedOptionId || undefined
      });

      setSubmissionResult(evaluation);

      // Record validated skill evidence to state and Supabase
      if (evaluation.passed) {
        await recordPracticeCompletion(activeChallenge.skillName, evaluation.score, {
          challengeTitle: activeChallenge.title,
          passedTests: activeChallenge.testCases?.length || 3,
          totalTests: activeChallenge.testCases?.length || 3
        });
      }
    } catch (err) {
      console.error('Submission evaluation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryMeta = blueprint.categories.find((c) => c.id === categoryParam);

  return (
    <div className="space-y-8" key={`role-practice-${currentRoleSlug}`}>
      {/* Top Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-ink/20">
        <Link
          href={ROUTES.app.practice.home}
          className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5 hover:text-brand-orange transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Practice Arena
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-brand-ink uppercase bg-brand-cream px-2 py-0.5 border border-brand-ink/20">
            {blueprint.careerRoleTitle}
          </span>
          {categoryParam && (
            <span className="text-xs font-mono font-bold text-brand-orange uppercase">
              &bull; {selectedCategoryMeta?.title || categoryParam}
            </span>
          )}
        </div>
      </div>

      {/* Main Role Title */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          {selectedCategoryMeta?.title || `${blueprint.careerRoleTitle} Practice Lab`}
        </h1>
        <p className="text-base text-brand-ink/80 max-w-3xl mt-1">
          {selectedCategoryMeta?.description || blueprint.subtitle}
        </p>
      </div>

      {/* Empty State Guard if category has no challenges */}
      {roleChallenges.length === 0 ? (
        <Card className="p-8 text-center space-y-4 bg-brand-paper border-[1.5px] border-brand-ink">
          <div className="w-12 h-12 bg-brand-cream border border-brand-ink flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6 text-brand-orange" />
          </div>
          <h2 className="font-display text-2xl uppercase tracking-tight text-brand-ink">
            Practice content is being prepared for this skill
          </h2>
          <p className="text-sm text-brand-ink/80 max-w-lg mx-auto">
            Our curriculum team is calibrating production challenges for this category. In the meantime, access official free learning documentation below.
          </p>
          {selectedCategoryMeta?.freeLearningUrl && (
            <div className="pt-2">
              <a
                href={selectedCategoryMeta.freeLearningUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="accent" size="sm">
                  Open Free Learning Track ({selectedCategoryMeta.freeLearningProvider}){' '}
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5 inline" />
                </Button>
              </a>
            </div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Challenge Selector & Navigation */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="font-display text-lg uppercase tracking-tight text-brand-ink font-bold flex items-center justify-between">
              <span>Available Challenges</span>
              <span className="text-xs font-mono font-bold text-brand-ink/60">
                {roleChallenges.length} Total
              </span>
            </h2>

            <div className="space-y-3">
              {roleChallenges.map((ch) => {
                const isSelected = activeChallenge?.id === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setSelectedChallengeId(ch.id);
                      setSubmissionResult(null);
                    }}
                    className={`w-full text-left p-4 border-[1.5px] transition-all ${
                      isSelected
                        ? 'bg-brand-cream border-brand-ink shadow-editorial'
                        : 'bg-brand-paper border-brand-ink/40 hover:border-brand-ink'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-brand-paper border border-brand-ink/20 font-bold uppercase">
                        {ch.difficulty}
                      </span>
                      <span className="text-xs font-bold text-brand-orange uppercase">
                        {ch.skillName} ({ch.targetLevel})
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold uppercase text-brand-ink leading-snug">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-brand-ink/70 line-clamp-2 mt-1">
                      {ch.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Interactive Challenge Runner */}
          {activeChallenge && (
            <div className="lg:col-span-8 space-y-6">
              <Card className="p-6 border-[1.5px] border-brand-ink shadow-editorial space-y-6">
                {/* Challenge Header & Metadata */}
                <div className="space-y-2 border-b border-brand-ink/20 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default">{activeChallenge.difficulty}</Badge>
                    <Badge variant="yellow">{activeChallenge.skillName}</Badge>
                    <span className="text-xs font-mono text-brand-ink/60">
                      Target Level: <strong>{activeChallenge.targetLevel}</strong>
                    </span>
                    <span className="text-xs font-mono text-brand-ink/60">
                      &bull; Est. Time: {activeChallenge.expectedTimeMinutes} mins
                    </span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl uppercase font-bold text-brand-ink">
                    {activeChallenge.title}
                  </h2>
                  <p className="text-sm text-brand-ink/90 leading-relaxed">
                    {activeChallenge.description}
                  </p>
                </div>

                {/* Scenario / Rubric Interface (Non-coding roles: TPM, UI/UX, Marketing, TA) */}
                {activeChallenge.scenarioPrompt && activeChallenge.scenarioOptions && (
                  <div className="space-y-4">
                    <div className="bg-brand-cream border border-brand-ink p-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-ink/70 block mb-1">
                        Scenario Assessment Prompt
                      </span>
                      <p className="text-sm font-medium text-brand-ink leading-relaxed">
                        {activeChallenge.scenarioPrompt}
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-ink block">
                        Select Strategic Recommendation:
                      </span>
                      {activeChallenge.scenarioOptions.map((opt) => (
                        <label
                          key={opt.id}
                          className={`flex items-start gap-3 p-3.5 border-[1.5px] cursor-pointer transition-all ${
                            selectedOptionId === opt.id
                              ? 'bg-brand-cream border-brand-ink font-semibold'
                              : 'bg-brand-paper border-brand-ink/30 hover:border-brand-ink'
                          }`}
                        >
                          <input
                            type="radio"
                            name="scenarioOption"
                            value={opt.id}
                            checked={selectedOptionId === opt.id}
                            onChange={() => setSelectedOptionId(opt.id)}
                            className="mt-1 accent-brand-orange"
                          />
                          <span className="text-xs leading-relaxed text-brand-ink">
                            {opt.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Executable Code / SQL Interface (Coding roles) */}
                {!activeChallenge.scenarioPrompt && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-ink flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-brand-orange" />
                        Sandboxed Implementation Editor
                      </span>
                      <span className="text-[11px] font-mono text-brand-ink/60">
                        Environment: {activeChallenge.environment}
                      </span>
                    </div>

                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      rows={10}
                      className="w-full font-mono text-xs p-4 bg-brand-cream border-[1.5px] border-brand-ink text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-ink resize-y"
                      placeholder="Write your solution here..."
                    />

                    {/* Test Cases List */}
                    {activeChallenge.testCases && activeChallenge.testCases.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                          Validation Test Cases:
                        </span>
                        <div className="space-y-1.5">
                          {activeChallenge.testCases.map((tc, idx) => (
                            <div
                              key={idx}
                              className="text-xs font-mono p-2 bg-brand-paper border border-brand-ink/20 flex items-center gap-2 text-brand-ink/80"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                              <span>{tc.name}</span>
                              {tc.isHidden && (
                                <span className="ml-auto text-[10px] uppercase font-bold text-brand-ink/40">
                                  Hidden Test
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Submission Feedback Banner */}
                {submissionResult && (
                  <div
                    className={`p-4 border-[1.5px] space-y-1.5 ${
                      submissionResult.passed
                        ? 'bg-brand-yellow/30 border-brand-ink'
                        : 'bg-brand-rose/20 border-brand-ink'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {submissionResult.passed ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                          <span className="font-display text-lg font-bold uppercase text-brand-ink">
                            Challenge Passed ({submissionResult.score}%)
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-brand-rose" />
                          <span className="font-display text-lg font-bold uppercase text-brand-ink">
                            Evaluation Incomplete ({submissionResult.score}%)
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-brand-ink/90 font-medium leading-relaxed">
                      {submissionResult.feedback}
                    </p>
                    {submissionResult.passed && (
                      <div className="text-[11px] font-mono text-brand-ink/80 pt-1">
                        &bull; Skill evidence logged for{' '}
                        <strong>{activeChallenge.skillName}</strong>. Readiness score updated in Skill Analyzer.
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-brand-ink/20">
                  <div className="text-xs text-brand-ink/70">
                    Source Reference:{' '}
                    <a
                      href={activeChallenge.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline hover:text-brand-orange"
                    >
                      {activeChallenge.sourceName}
                    </a>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Evaluating Solution...'
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1.5 inline" /> Run Solution &amp; Verify
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RolePracticePage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center font-display text-xl uppercase tracking-tight text-brand-ink">
          Loading Role Practice Lab...
        </div>
      }
    >
      <RolePracticeInner />
    </Suspense>
  );
}
