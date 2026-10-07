'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  RefreshCw,
  Clock,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import {
  getInitialInterviewQuestions,
  evaluateInterviewResponse,
  generateContextualFollowUp,
  InterviewTurn
} from '@/lib/assessment';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';

export default function MockInterviewSimulationPage() {
  const router = useRouter();
  const { state, updateState } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  const [difficulty, setDifficulty] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('INTERMEDIATE');
  const [questions, setQuestions] = useState<InterviewTurn[]>(() =>
    getInitialInterviewQuestions(state.targetCareerSlug || 'full-stack-developer')
  );
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [candidateResponse, setCandidateResponse] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [scorecard, setScorecard] = useState<any | null>(null);
  const [hasInjectedFollowUp, setHasInjectedFollowUp] = useState(false);

  // Sync questions when role changes
  useEffect(() => {
    setQuestions(getInitialInterviewQuestions(state.targetCareerSlug || 'full-stack-developer'));
    setCurrentQIndex(0);
    setCandidateResponse('');
    setScorecard(null);
    setHasInjectedFollowUp(false);
  }, [state.targetCareerSlug]);

  const currentQuestion = questions[currentQIndex] || questions[0];

  const handleEvaluateAnswer = async () => {
    if (!currentQuestion || !candidateResponse.trim()) return;
    setIsEvaluating(true);

    const evalResult = evaluateInterviewResponse(currentQuestion, candidateResponse);

    // Contextual Follow-Up Engine (injects if on a primary technical/system question and hasn't yet)
    let followUpQ: InterviewTurn | null = null;
    if (
      !hasInjectedFollowUp &&
      (currentQuestion.stage === 'TECHNICAL' || currentQuestion.stage === 'SYSTEM_DESIGN') &&
      candidateResponse.trim().length > 25
    ) {
      followUpQ = generateContextualFollowUp(currentQuestion, candidateResponse);
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: sessionRows } = await supabase.from('interview_sessions').insert({
          user_id: user.id,
          target_role_id: '50000000-0000-0000-0000-000000000001',
          session_type: currentQuestion.stage,
          level: difficulty === 'BEGINNER' ? 'L1' : difficulty === 'ADVANCED' ? 'L4' : difficulty === 'EXPERT' ? 'L5' : 'L3',
          status: 'COMPLETED',
          completed_at: new Date().toISOString(),
        }).select();

        if (sessionRows && sessionRows[0]?.id) {
          await supabase.from('interview_feedback').insert({
            session_id: sessionRows[0].id,
            technical_correctness_score: evalResult.technicalCorrectness,
            communication_score: evalResult.communication,
            problem_solving_score: evalResult.problemSolving,
            structural_clarity_score: evalResult.structuralClarity,
            overall_score: evalResult.overallScore,
            strengths: evalResult.strengths,
            areas_for_improvement: evalResult.growthAreas,
            detailed_report: evalResult.detailedReport,
          });
        }
      }
    } catch (err) {
      console.warn('Persist interview feedback note:', err);
    }

    setTimeout(() => {
      setIsEvaluating(false);
      setScorecard({
        technicalAccuracy: evalResult.technicalCorrectness,
        communicationScore: evalResult.communication,
        tradeoffReasoning: evalResult.problemSolving,
        structuralClarity: evalResult.structuralClarity,
        overallScore: evalResult.overallScore,
        feedback: evalResult.detailedReport,
        strengths: evalResult.strengths,
        growthAreas: evalResult.growthAreas,
        hasFollowUp: !!followUpQ,
      });

      // Inject the follow-up question right after current question if applicable
      if (followUpQ) {
        setQuestions((prev) => {
          const nextQuestions = [...prev];
          nextQuestions.splice(currentQIndex + 1, 0, followUpQ!);
          return nextQuestions;
        });
        setHasInjectedFollowUp(true);
      }

      // Update candidate state with genuine interview score
      updateState((prev) => ({
        ...prev,
        interviewScore: evalResult.overallScore,
        stage: 'RESUME_READY',
      }));
    }, 900);
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setCandidateResponse('');
      setScorecard(null);
    } else {
      router.push(ROUTES.app.resume.builder);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.interview.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Interview Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">
          {currentRole?.title || 'Target Role'} Mock Simulation
        </span>
      </div>

      {/* Difficulty Switcher */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-4 shadow-editorial flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60 block">
            Target Difficulty Calibration
          </span>
          <span className="font-display text-lg font-bold uppercase text-brand-ink">
            Question {currentQIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficulty(lvl)}
              className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all ${
                difficulty === lvl
                  ? 'bg-brand-ink text-white border-brand-ink'
                  : 'bg-brand-cream text-brand-ink border-brand-ink/30 hover:bg-brand-paper'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
          <div className="flex items-center gap-2">
            <Badge variant="yellow">{currentQuestion.stage.replace('_', ' ')}</Badge>
            <Badge variant="default">{difficulty}</Badge>
            {currentQuestion.stage === 'FOLLOW_UP' && (
              <Badge variant="rose">DYNAMIC FOLLOW-UP</Badge>
            )}
          </div>
          <button
            onClick={() => {
              if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(currentQuestion.questionText);
                window.speechSynthesis.speak(utterance);
              }
            }}
            className="p-1.5 border border-brand-ink bg-brand-cream text-brand-ink hover:bg-brand-paper flex items-center gap-1 text-xs font-bold uppercase"
          >
            <Volume2 className="w-4 h-4 text-brand-orange" /> Listen Prompt
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-brand-ink leading-relaxed">
          &ldquo;{currentQuestion.questionText}&rdquo;
        </h2>

        {/* Expected Concepts */}
        <div className="p-3 bg-brand-cream border border-brand-ink/20 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60 block">
            Evaluator Rubric Criteria:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {currentQuestion.expectedConcepts.map((c) => (
              <span key={c} className="text-[11px] font-semibold px-2 py-0.5 bg-brand-paper border border-brand-ink/30 text-brand-ink">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Response Box */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-widest text-brand-ink/70">
              Your Articulated Response:
            </span>
            <button
              type="button"
              onClick={() => setIsRecording(!isRecording)}
              className={`px-3 py-1 text-xs font-bold uppercase border flex items-center gap-1.5 ${
                isRecording
                  ? 'bg-brand-rose text-white border-brand-ink animate-pulse'
                  : 'bg-brand-cream text-brand-ink border-brand-ink hover:bg-brand-paper'
              }`}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-brand-orange" />}
              {isRecording ? 'Listening...' : 'Simulate Audio Input'}
            </button>
          </div>

          <textarea
            rows={6}
            value={candidateResponse}
            onChange={(e) => setCandidateResponse(e.target.value)}
            placeholder="Type your structured explanation here (or use simulated voice input)... For example: Node.js utilizes an event-driven architecture powered by libuv's event loop with non-blocking I/O polling..."
            className="w-full p-4 bg-brand-cream border border-brand-ink text-xs font-medium text-brand-ink leading-relaxed focus:outline-none"
          />
        </div>

        <div className="pt-4 border-t border-brand-ink/20 flex items-center justify-between">
          <span className="text-xs font-semibold text-brand-ink/60">
            Multi-factor scoring evaluates accuracy, clarity, and trade-offs.
          </span>
          <Button
            variant="primary"
            size="md"
            onClick={handleEvaluateAnswer}
            disabled={isEvaluating || candidateResponse.trim().length === 0}
          >
            {isEvaluating ? 'Analyzing Scorecard...' : 'Submit & Evaluate Answer →'}
          </Button>
        </div>
      </div>

      {/* Scorecard Feedback Section */}
      {scorecard && (
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
            <div>
              <span className="editorial-badge bg-brand-yellow text-brand-ink text-[10px] mb-1">
                Rubric Scorecard
              </span>
              <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
                Evaluation Verdict: {scorecard.overallScore}%
              </h3>
            </div>
            <Badge variant="yellow">INTERVIEW READY</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-brand-cream border border-brand-ink/20 text-center">
              <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Technical Accuracy</span>
              <div className="font-display text-2xl font-bold text-brand-orange mt-1">
                {scorecard.technicalAccuracy}%
              </div>
            </div>
            <div className="p-3 bg-brand-cream border border-brand-ink/20 text-center">
              <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Communication Clarity</span>
              <div className="font-display text-2xl font-bold text-brand-ink mt-1">
                {scorecard.communicationScore}%
              </div>
            </div>
            <div className="p-3 bg-brand-cream border border-brand-ink/20 text-center">
              <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Trade-Off Reasoning</span>
              <div className="font-display text-2xl font-bold text-brand-yellow mt-1">
                {scorecard.tradeoffReasoning}%
              </div>
            </div>
          </div>

          <div className="p-4 bg-brand-cream border border-brand-ink/20 space-y-2 text-xs">
            <div className="font-bold text-brand-ink">Evaluator Summary:</div>
            <p className="text-brand-ink/85 leading-relaxed">{scorecard.feedback}</p>
          </div>

          <div className="pt-4 border-t border-brand-ink/20 flex items-center justify-between">
            <Link href={ROUTES.app.resume.builder}>
              <Button variant="accent" size="md">
                Proceed to Resume Optimizer →
              </Button>
            </Link>

            <Button variant="outline" size="md" onClick={handleNextQuestion}>
              {currentQIndex === questions.length - 1
                ? 'Finish Simulation'
                : scorecard.hasFollowUp
                ? 'Address Follow-Up Question \u2192'
                : 'Next Question \u2192'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
