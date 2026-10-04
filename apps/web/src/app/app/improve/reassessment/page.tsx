'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Award
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ReassessmentEnginePage() {
  const router = useRouter();
  const { state, updateState } = useCandidateState();

  const weakAreaQuestions = [
    {
      id: 're-node-01',
      skill: 'Node.js',
      prompt: 'When using Node.js stream pipelines (e.g. `stream.pipeline()`), what mechanism ensures memory usage remains bounded during high-throughput file ingestion?',
      options: [
        'Automatic backpressure signaling that pauses the readable stream when the writable buffer fills',
        'V8 garbage collection automatically drops overflow packets',
        'Operating system page swapping to virtual disk',
        'Node.js worker threads spin up dynamic child processes'
      ],
      correctAnswer: 'Automatic backpressure signaling that pauses the readable stream when the writable buffer fills',
      explanation: 'Streams implement backpressure. When the destination buffer hits `highWaterMark`, write() returns false, causing the source stream to pause until the `drain` event is emitted.'
    },
    {
      id: 're-react-01',
      skill: 'React',
      prompt: 'In React 18, how does automatic batching behave inside asynchronous promises or setTimeout callbacks?',
      options: [
        'State updates are automatically batched together into a single re-render, unlike in React 17',
        'Batching is permanently disabled inside async functions',
        'It requires manually wrapping calls in ReactDOM.unstable_batchedUpdates',
        'It causes immediate synchronous re-renders for each state setter'
      ],
      correctAnswer: 'State updates are automatically batched together into a single re-render, unlike in React 17',
      explanation: 'React 18 introduces automatic batching across all contexts, including promises, setTimeouts, and native event handlers, eliminating unnecessary intermediate renders.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentQ = weakAreaQuestions[currentIndex];

  const handleSelect = (opt: string) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: opt }));
  };

  const handleNext = () => {
    if (currentIndex < weakAreaQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCompleted(true);

      // Upgrade Node.js and React competency levels
      updateState((prev) => ({
        ...prev,
        stage: 'REASSESSMENT_READY',
        readinessScore: Math.min(prev.readinessScore + 10, 96),
        skills: prev.skills.map((s) =>
          s.name === 'Node.js'
            ? { ...s, currentLevel: 'L3', gap: 0, priority: 'SATISFIED' }
            : s.name === 'React'
            ? { ...s, currentLevel: 'L3', gap: 0, priority: 'SATISFIED' }
            : s
        ),
      }));
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.improve.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Improvement Loop
        </Link>
        <span className="text-xs font-bold text-brand-rose uppercase">Focused Reassessment Test</span>
      </div>

      {completed ? (
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial text-center space-y-4">
          <div className="w-14 h-14 bg-brand-orange text-white rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl uppercase text-brand-ink">
            Reassessment Passed &bull; Competencies Upgraded!
          </h1>
          <p className="text-sm text-brand-ink/80 max-w-md mx-auto leading-relaxed">
            Your Node.js and React capabilities have been recalibrated from L1/L2 to verified <strong>L3 (Proficient)</strong>. Your updated readiness score is now reflected in the Skill Analyzer.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link href={ROUTES.app.skills.analysis}>
              <Button variant="outline">View Updated Skill Analyzer</Button>
            </Link>
            <Link href={ROUTES.app.projects.home}>
              <Button variant="primary">Proceed to Capstone Project →</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
            <div>
              <Badge variant="rose">REASSESSMENT: WEAK AREA CALIBRATION</Badge>
              <h2 className="font-display text-xl uppercase font-bold text-brand-ink mt-1">
                Question {currentIndex + 1} of {weakAreaQuestions.length} ({currentQ.skill})
              </h2>
            </div>
            <span className="text-xs font-bold text-brand-ink/60">Target: L3 Competency Upgrade</span>
          </div>

          <h3 className="text-lg font-semibold text-brand-ink leading-relaxed">
            {currentQ.prompt}
          </h3>

          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentQ.id] === opt;
              const letter = String.fromCharCode(65 + idx);

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`w-full p-4 text-left border-[1.5px] flex items-start gap-3 transition-all ${
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
                  <span className="text-xs font-medium leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-brand-ink/20 flex items-center justify-between">
            <span className="text-xs text-brand-ink/60 font-semibold">
              Reassessment items focus specifically on previous diagnostic gaps.
            </span>

            {currentIndex === weakAreaQuestions.length - 1 ? (
              <Button
                variant="accent"
                size="md"
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedAnswers[currentQ.id]}
              >
                {isSubmitting ? 'Recalibrating...' : 'Submit Reassessment →'}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                disabled={!selectedAnswers[currentQ.id]}
              >
                Next Item →
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
