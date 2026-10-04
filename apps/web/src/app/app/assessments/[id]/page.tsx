'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { QUESTION_BANK } from '@/lib/data/questions-data';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DynamicAssessmentRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { state, recordAssessmentCompletion } = useCandidateState();

  const questions = QUESTION_BANK.slice(0, 5);
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

  const handleSubmit = () => {
    setIsSubmitting(true);
    recordAssessmentCompletion(82);
    setTimeout(() => {
      router.push(ROUTES.app.assessments.results(id));
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.assessments.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> All Assessments
        </Link>
        <span className="text-xs font-bold uppercase text-brand-orange">
          Assessment: {id}
        </span>
      </div>

      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
          <div className="flex items-center gap-2">
            <Badge variant="default">{currentQ.skillName}</Badge>
            <Badge variant="yellow">{currentQ.difficulty}</Badge>
          </div>
          <span className="text-xs font-semibold text-brand-ink/60">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-brand-ink leading-relaxed">
          {currentQ.prompt}
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
            ← Previous
          </Button>
          {isLast ? (
            <Button variant="accent" size="md" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Evaluating...' : 'Complete & View Results →'}
            </Button>
          ) : (
            <Button variant="primary" size="md" onClick={handleNext}>
              Next Question →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
