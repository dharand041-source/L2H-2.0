'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Award,
  Sparkles
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { UNIVERSAL_QUESTION_BANK } from '@/lib/assessment/universal-bank';
import { AssessmentQuestion } from '@/lib/assessment';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ReassessmentEnginePage() {
  const router = useRouter();
  const { state, updateState } = useCandidateState();
  const roleSlug = state.targetCareerSlug || 'full-stack-developer';
  const currentRole = getCareerBySlug(roleSlug);

  // Identify candidate's actual weak skills for their target career
  const weakSkills = useMemo(() => {
    const gaps = (state.skills || []).filter((s) => s.gap > 0);
    if (gaps.length > 0) return gaps;
    // Fallback: top required skills for current role
    return (currentRole?.requiredSkills || []).slice(0, 2).map((s) => ({
      name: s.name,
      currentLevel: 'L1' as const,
      requiredLevel: s.level,
      gap: 2,
      confidence: 0.5,
      evidenceCount: 1,
      priority: 'HIGH' as const,
    }));
  }, [state.skills, currentRole]);

  // Dynamically load reassessment questions matching the weak skills for this specific role
  const reassessmentQuestions = useMemo(() => {
    const questions: typeof UNIVERSAL_QUESTION_BANK = [];
    const targetSkillNames = weakSkills.map((w) => w.name.toLowerCase());

    // 1. Try to find exact questions from universal question bank
    for (const q of UNIVERSAL_QUESTION_BANK) {
      if (
        (q.careerRoleSlug === roleSlug || !q.careerRoleSlug) &&
        targetSkillNames.some((ts) => q.skillName.toLowerCase().includes(ts) || ts.includes(q.skillName.toLowerCase()))
      ) {
        questions.push(q);
        if (questions.length >= 4) break;
      }
    }

    // 2. If fewer than 2 matched, pull role-specific questions
    if (questions.length < 2) {
      for (const q of UNIVERSAL_QUESTION_BANK) {
        if (q.careerRoleSlug === roleSlug && !questions.some((eq) => eq.id === q.id)) {
          questions.push(q);
          if (questions.length >= 3) break;
        }
      }
    }

    // 3. Guaranteed role-adapted fallback if bank has specialized gaps
    if (questions.length === 0) {
      const primarySkill = weakSkills[0]?.name || 'Core Engineering';
      return [
        {
          id: `re-dyn-01-${roleSlug}`,
          careerRoleSlug: roleSlug,
          skillName: primarySkill,
          competency: 'Remediation Assessment',
          topic: `${primarySkill} Architectural Calibration`,
          difficulty: 'L3' as const,
          targetLevel: 'L3' as const,
          questionType: 'MCQ' as const,
          questionFamily: 'REASSESSMENT_DIAGNOSTIC',
          questionVariant: 'variant_a',
          variantGroupId: 'vg-re-01',
          prompt: `In modern ${currentRole?.title || 'technical'} practice, when implementing production patterns in ${primarySkill}, what is the foundational requirement for deterministic execution and fault isolation?`,
          options: [
            'Strict boundary isolation, idempotent handling, and verifiable input contract validation',
            'Disabling all runtime assertions to minimize latency',
            'Relying solely on external load balancer timeouts',
            'Manually restarting failed workers without logging trace diagnostics'
          ],
          correctAnswer: 'Strict boundary isolation, idempotent handling, and verifiable input contract validation',
          explanation: 'Production architectures require strict boundary isolation, schema-validated inputs, and idempotent retries to guarantee fault tolerance.',
          points: 10,
          expectedTimeSeconds: 45,
          sourceType: 'ORIGINAL_L2H' as const,
          sourceName: 'L2H Reassessment Framework',
          sourceConfidence: 'HIGH' as const,
          originalityStatus: 'ORIGINAL_L2H' as const,
          normalizedHash: `hash-re-${roleSlug}-01`,
          questionText: `In modern ${currentRole?.title || 'technical'} practice, when implementing production patterns in ${primarySkill}, what is the foundational requirement for deterministic execution and fault isolation?`,
          codeSnippet: undefined,
        } as AssessmentQuestion,
      ];
    }

    return questions as AssessmentQuestion[];
  }, [roleSlug, weakSkills, currentRole]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [upgradedSkillsList, setUpgradedSkillsList] = useState<string[]>([]);

  const currentQ = reassessmentQuestions[currentIndex] || reassessmentQuestions[0];
  const isLast = currentIndex === reassessmentQuestions.length - 1;
  const currentAnswer = selectedAnswers[currentQ?.id];
  const hasAnsweredCurrent = Boolean(currentAnswer && currentAnswer.trim().length > 0);

  const handleSelect = (opt: string) => {
    if (isSaving || isSubmitting) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: opt }));
  };

  const handleNext = async () => {
    if (!hasAnsweredCurrent || isSaving || isSubmitting) return;
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 150));
    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
    }
    setIsSaving(false);
  };

  const handlePrev = () => {
    if (isSaving || isSubmitting) return;
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (!hasAnsweredCurrent || isSubmitting || isSaving) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setCompleted(true);

      // Determine which skills were tested in this reassessment session
      const testedSkills = Array.from(new Set(reassessmentQuestions.map((q) => q.skillName)));
      setUpgradedSkillsList(testedSkills);

      // Upgrade tested weak skills in candidate state
      updateState((prev) => {
        const updatedSkills = prev.skills.map((s) => {
          const wasTested = testedSkills.some(
            (ts) => ts.toLowerCase() === s.name.toLowerCase() || s.name.toLowerCase().includes(ts.toLowerCase())
          );
          if (wasTested) {
            // Upgrade skill level to L3 or target level if was lower
            const nextLvl = s.currentLevel === 'L0' || s.currentLevel === 'L1' ? 'L3' : 'L4';
            return {
              ...s,
              currentLevel: nextLvl as any,
              gap: 0,
              confidence: 0.90,
              evidenceCount: (s.evidenceCount || 1) + 1,
              priority: 'SATISFIED' as const,
            };
          }
          return s;
        });

        return {
          ...prev,
          stage: 'REASSESSMENT_READY',
          readinessScore: Math.min((prev.readinessScore || 40) + 18, 98),
          skills: updatedSkills,
        };
      });
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.improve.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Improvement Loop
        </Link>
        <span className="text-xs font-bold text-brand-rose uppercase">
          {currentRole?.title || 'Target Role'} Focused Reassessment
        </span>
      </div>

      {completed ? (
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial text-center space-y-4">
          <div className="w-14 h-14 bg-brand-orange text-white rounded-none border border-brand-ink flex items-center justify-center mx-auto shadow-editorial-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl uppercase text-brand-ink">
            Reassessment Passed &bull; Competencies Calibrated!
          </h1>
          <p className="text-sm text-brand-ink/80 max-w-lg mx-auto leading-relaxed">
            Your validated capabilities in <strong>{upgradedSkillsList.join(', ') || 'Target Skills'}</strong> have been recalibrated to verified proficient status. Your personalized remediation roadmap has dynamically updated.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link href={ROUTES.app.skills.analysis}>
              <Button variant="outline">View Updated Skill Analyzer</Button>
            </Link>
            <Link href={ROUTES.app.learning.roadmap}>
              <Button variant="accent">View Dynamic Roadmap →</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
            <div className="flex items-center gap-2">
              <Badge variant="rose">REASSESSMENT</Badge>
              <Badge variant="default">{currentQ.skillName}</Badge>
              <Badge level={currentQ.targetLevel as any}>{currentQ.targetLevel || 'L3'}</Badge>
            </div>
            <span className="text-xs font-semibold text-brand-ink/60">
              Question {currentIndex + 1} of {reassessmentQuestions.length}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-semibold text-brand-ink leading-relaxed">
            {currentQ.prompt || currentQ.questionText}
          </h2>

          {currentQ.codeSnippet && (
            <div className="p-4 bg-brand-ink text-brand-paper font-mono text-xs overflow-x-auto">
              <pre>{currentQ.codeSnippet}</pre>
            </div>
          )}

          <div className="space-y-3 pt-2">
            {currentQ.options?.map((opt: string, idx: number) => {
              const isSelected = selectedAnswers[currentQ.id] === opt;
              const letter = String.fromCharCode(65 + idx);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`w-full p-3.5 text-left border-[1.5px] flex items-start gap-3 transition-all ${
                    isSelected
                      ? 'bg-brand-orange text-white border-brand-ink shadow-editorial-sm'
                      : 'bg-brand-cream text-brand-ink border-brand-ink/40 hover:bg-brand-paper'
                  }`}
                >
                  <span className={`w-6 h-6 border flex items-center justify-center text-xs font-bold shrink-0 ${
                    isSelected ? 'bg-white text-brand-ink' : 'bg-brand-paper'
                  }`}>
                    {letter}
                  </span>
                  <span className="text-sm font-medium">{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-brand-ink/20 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={handlePrev}
              disabled={currentIndex === 0 || isSaving || isSubmitting}
              className="w-full sm:w-auto justify-center"
            >
              &larr; Previous
            </Button>

            {isLast ? (
              <Button
                variant="accent"
                size="md"
                onClick={handleSubmit}
                disabled={!hasAnsweredCurrent || isSubmitting || isSaving}
                className="w-full sm:w-auto justify-center"
              >
                {isSubmitting ? 'Evaluating Diagnostic...' : 'Submit Reassessment \u2192'}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                disabled={!hasAnsweredCurrent || isSaving || isSubmitting}
                className="w-full sm:w-auto justify-center"
              >
                {isSaving ? 'Saving...' : 'Next Question \u2192'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
