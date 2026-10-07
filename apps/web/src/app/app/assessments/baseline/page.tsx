'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Terminal,
  HelpCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import {
  generateAssessmentBlueprint,
  buildAssessmentSession,
  evaluateAssessmentSession,
  AssessmentQuestion,
  UserHistoryRecord
} from '@/lib/assessment';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function BaselineAssessmentRunnerPage() {
  const router = useRouter();
  const { state, recordAssessmentCompletion } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  // Build dynamic blueprint and session dynamically for the current career role
  const testQuestions = useMemo(() => {
    const roleSlug = state.targetCareerSlug || 'full-stack-developer';
    const blueprint = generateAssessmentBlueprint(roleSlug, 'BASELINE', 'MEDIUM');
    const existingHistory: UserHistoryRecord[] = (state.seenQuestionIds || []).map((id) => ({
      questionId: id,
      normalizedHash: id,
      questionFamily: 'PREV',
      variantGroupId: 'PREV_GRP',
      seenAt: new Date().toISOString(),
      answeredCorrectly: true,
      timeTakenSeconds: 45,
    }));
    return buildAssessmentSession(blueprint, existingHistory);
  }, [state.targetCareerSlug, state.seenQuestionIds]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(1500); // 25 mins
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const currentQ = testQuestions[currentIndex] || testQuestions[0];
  const totalQuestions = testQuestions.length;

  const handleSelectOption = (option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);

    // Evaluate dynamically using the universal evaluation engine
    const roleSlug = state.targetCareerSlug || 'full-stack-developer';
    const evalResult = evaluateAssessmentSession(testQuestions, selectedAnswers, roleSlug);

    // Prepare seen questions for anti-repetition registry
    const seenQuestionsPayload = testQuestions.map((q) => ({
      questionId: q.id,
      normalizedHash: q.normalizedHash,
      questionFamily: q.questionFamily,
      variantGroupId: q.variantGroupId,
      correct: selectedAnswers[q.id] === q.correctAnswer,
      score: selectedAnswers[q.id] === q.correctAnswer ? 100 : 0,
    }));

    // Commit results to state store and Supabase persistence
    await recordAssessmentCompletion(evalResult.score, {
      questions: testQuestions.map((q) => ({ id: q.id, prompt: q.questionText || q.prompt || '' })),
      answers: selectedAnswers,
      calibratedSkills: evalResult.skillBreakdown.map((sb) => ({
        skillName: sb.skillName,
        calibratedLevel: sb.level,
        score: sb.score,
        confidence: 0.85,
      })),
      seenQuestions: seenQuestionsPayload,
    });

    setTimeout(() => {
      router.push(ROUTES.app.assessments.results('baseline'));
    }, 400);
  };

  if (!currentQ) {
    return (
      <div className="py-20 text-center">
        <h2 className="font-display text-2xl uppercase">No questions loaded</h2>
      </div>
    );
  }

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const answeredCount = Object.keys(selectedAnswers).length;
  const currentAnswer = selectedAnswers[currentQ.id];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Assessment Top Bar */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-4 shadow-editorial flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60 block">
            {currentRole?.title || 'Full-Stack Developer'} Baseline Diagnostic
          </span>
          <h1 className="font-display text-xl font-bold uppercase text-brand-ink">
            Question {currentIndex + 1} of {totalQuestions}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-cream border border-brand-ink text-xs font-mono font-bold text-brand-ink">
            <Clock className="w-3.5 h-3.5 text-brand-orange" />
            <span>{formatTime(timeRemaining)}</span>
          </div>

          {/* Answered Progress */}
          <span className="text-xs font-semibold text-brand-ink/70">
            {answeredCount} / {totalQuestions} Answered
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-4 sm:p-8 shadow-editorial space-y-6">
        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-brand-ink/10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">{currentQ.skillName}</Badge>
            <Badge level={currentQ.targetLevel as any}>{currentQ.difficulty} ({currentQ.targetLevel})</Badge>
            <Badge variant="paper">{currentQ.questionType.replace('_', ' ')}</Badge>
            <span className="text-xs font-semibold text-brand-ink/60">
              Topic: {currentQ.topic}
            </span>
          </div>
          <span className="text-[10px] font-mono text-brand-ink/50 uppercase">
            Family: {currentQ.questionFamily}
          </span>
        </div>

        {/* Prompt */}
        <h2 className="text-lg sm:text-xl font-semibold text-brand-ink leading-relaxed">
          {currentQ.questionText || (currentQ as any).prompt}
        </h2>

        {/* Code Snippet (if provided) */}
        {currentQ.codeSnippet && (
          <div className="border border-brand-ink bg-brand-ink text-brand-paper p-3 sm:p-4 font-mono text-xs overflow-x-auto rounded-none">
            <pre>{currentQ.codeSnippet}</pre>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQ.options?.map((option, idx) => {
            const isSelected = currentAnswer === option;
            const letter = String.fromCharCode(65 + idx);

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectOption(option)}
                className={`w-full p-3.5 sm:p-4 text-left border-[1.5px] transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-brand-orange text-white border-brand-ink shadow-editorial-sm -translate-y-0.5'
                    : 'bg-brand-cream text-brand-ink border-brand-ink/40 hover:bg-brand-paper hover:border-brand-ink'
                }`}
              >
                <span
                  className={`w-6 h-6 border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-white text-brand-ink border-white'
                      : 'bg-brand-paper text-brand-ink border-brand-ink'
                  }`}
                >
                  {letter}
                </span>
                <span className="text-sm font-medium leading-relaxed">
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="pt-6 border-t border-brand-ink/20 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-full sm:w-auto justify-center"
          >
            &larr; Previous
          </Button>

          {isLastQuestion ? (
            <Button
              variant="accent"
              size="md"
              onClick={handleSubmitAssessment}
              disabled={isSubmitting}
              className="w-full sm:w-auto justify-center"
            >
              {isSubmitting ? 'Evaluating Diagnostic...' : 'Submit Assessment \u2192'}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              className="w-full sm:w-auto justify-center"
            >
              Next Question &rarr;
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
