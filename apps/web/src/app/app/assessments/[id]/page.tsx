'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
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

export default function DynamicAssessmentRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || 'baseline';
  const { state, recordAssessmentCompletion } = useCandidateState();
  const roleSlug = state.targetCareerSlug || 'full-stack-developer';
  const currentRole = getCareerBySlug(roleSlug);

  // Dynamic blueprint and anti-repetition question selection
  const questions = useMemo(() => {
    let blueprintType: 'BASELINE' | 'TECHNICAL_SPECIALTY' | 'COMPANY_PATTERN' | 'APTITUDE' = 'BASELINE';
    if (id.includes('aptitude')) blueprintType = 'APTITUDE';
    else if (id.includes('technical') || id.includes('specialty')) blueprintType = 'TECHNICAL_SPECIALTY';
    else if (id.includes('company')) blueprintType = 'COMPANY_PATTERN';

    const blueprint = generateAssessmentBlueprint(roleSlug, blueprintType, 'MEDIUM');
    const existingHistory: UserHistoryRecord[] = (state.seenQuestionIds || []).map((qId) => ({
      questionId: qId,
      normalizedHash: qId,
      questionFamily: 'PREV',
      variantGroupId: 'PREV_GRP',
      seenAt: new Date().toISOString(),
      answeredCorrectly: true,
      timeTakenSeconds: 45,
    }));
    return buildAssessmentSession(blueprint, existingHistory);
  }, [id, roleSlug, state.seenQuestionIds]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];
  const isLast = currentIndex === questions.length - 1;

  const handleSelect = (opt: string) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: opt }));
  };

  const handleNext = () => {
    if (!isLast) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const evalResult = evaluateAssessmentSession(questions, selectedAnswers, roleSlug);

    const seenQuestionsPayload = questions.map((q) => ({
      questionId: q.id,
      normalizedHash: q.normalizedHash,
      questionFamily: q.questionFamily,
      variantGroupId: q.variantGroupId,
      correct: selectedAnswers[q.id] === q.correctAnswer,
      score: selectedAnswers[q.id] === q.correctAnswer ? 100 : 0,
    }));

    await recordAssessmentCompletion(evalResult.score, {
      questions: questions.map((q) => ({ id: q.id, prompt: q.questionText || q.prompt || '' })),
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
      router.push(ROUTES.app.assessments.results(id));
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.assessments.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> All Assessments
        </Link>
        <span className="text-xs font-bold uppercase text-brand-orange">
          Assessment: {id} &bull; {currentRole?.title || 'Target Role'}
        </span>
      </div>

      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
          <div className="flex items-center gap-2">
            <Badge variant="default">{currentQ.skillName}</Badge>
            <Badge level={currentQ.targetLevel as any}>{currentQ.difficulty} ({currentQ.targetLevel})</Badge>
            <Badge variant="paper">{currentQ.questionType.replace('_', ' ')}</Badge>
          </div>
          <span className="text-xs font-semibold text-brand-ink/60">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-brand-ink leading-relaxed">
          {currentQ.questionText || (currentQ as any).prompt}
        </h2>

        {currentQ.codeSnippet && (
          <div className="p-4 bg-brand-ink text-brand-paper font-mono text-xs overflow-x-auto">
            <pre>{currentQ.codeSnippet}</pre>
          </div>
        )}

        <div className="space-y-3 pt-2">
          {currentQ.options?.map((opt, idx) => {
            const isSelected = selectedAnswers[currentQ.id] === opt;
            const letter = String.fromCharCode(65 + idx);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full p-3.5 text-left border-[1.5px] flex items-start gap-3 transition-all ${
                  isSelected
                    ? 'bg-brand-orange text-white border-brand-ink'
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

        <div className="pt-6 border-t border-brand-ink/20 flex items-center justify-between">
          <Button variant="outline" size="md" onClick={handlePrev} disabled={currentIndex === 0}>
            &larr; Previous
          </Button>
          {isLast ? (
            <Button variant="accent" size="md" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Evaluating Diagnostic...' : 'Complete & View Results \u2192'}
            </Button>
          ) : (
            <Button variant="primary" size="md" onClick={handleNext}>
              Next Question &rarr;
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
