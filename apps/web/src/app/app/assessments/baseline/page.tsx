'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  BookOpen,
  Compass,
  Award,
  Layers,
  Info
} from 'lucide-react';
import {
  generateAssessmentBlueprint,
  buildAssessmentSession,
  evaluateAssessmentSession,
  calculateInitialEntryLevel,
  adaptDifficulty,
  AssessmentQuestion,
  UserHistoryRecord,
  CandidateEntryLevel,
  CalibrationAnswers,
  AssessmentDifficulty
} from '@/lib/assessment';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type AssessmentFlowStage = 'ROLE_INTRO' | 'CALIBRATION' | 'ASSESSMENT';

export default function BaselineAssessmentRunnerPage() {
  const router = useRouter();
  const { state, recordAssessmentCompletion } = useCandidateState();
  const roleSlug = state.targetCareerSlug || 'full-stack-developer';
  const currentRole = getCareerBySlug(roleSlug);

  // Flow Stage: INTRO -> CALIBRATION -> ASSESSMENT
  const [flowStage, setFlowStage] = useState<AssessmentFlowStage>('ROLE_INTRO');

  // Calibration State
  const [calibrationAnswers, setCalibrationAnswers] = useState<CalibrationAnswers>({
    priorStudy: 'none',
    learningDuration: 'not_yet',
    builtProjects: false,
    workedProfessionally: false,
    techComfort: 'beginner',
  });

  const [calibratedEntryLevel, setCalibratedEntryLevel] = useState<CandidateEntryLevel>('BEGINNER');

  // Load saved calibration state from session if available
  useEffect(() => {
    try {
      const savedLevel = sessionStorage.getItem(`l2h_calibrated_level_${roleSlug}`) as CandidateEntryLevel;
      if (savedLevel && ['BEGINNER', 'AMATEUR', 'PROFESSIONAL'].includes(savedLevel)) {
        setCalibratedEntryLevel(savedLevel);
        setFlowStage('ASSESSMENT');
      }
    } catch {}
  }, [roleSlug]);

  // Build dynamic blueprint and session dynamically for the current career role and entry level
  const testQuestions = useMemo(() => {
    const blueprint = generateAssessmentBlueprint(roleSlug, 'BASELINE', 'MEDIUM', calibratedEntryLevel);
    const existingHistory: UserHistoryRecord[] = (state.seenQuestionIds || []).map((id) => ({
      questionId: id,
      normalizedHash: id,
      questionFamily: 'PREV',
      variantGroupId: 'PREV_GRP',
      seenAt: new Date().toISOString(),
      answeredCorrectly: true,
      timeTakenSeconds: 45,
    }));
    return buildAssessmentSession(blueprint, existingHistory, calibratedEntryLevel);
  }, [roleSlug, state.seenQuestionIds, calibratedEntryLevel]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedExplanation, setRevealedExplanation] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(1500); // 25 mins
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Difficulty tracking for micro-adaptation
  const [correctStreak, setCorrectStreak] = useState(0);
  const [incorrectStreak, setIncorrectStreak] = useState(0);
  const [currentDiff, setCurrentDiff] = useState<AssessmentDifficulty>('L1');

  // Hydrate answers from sessionStorage to survive page refresh
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`l2h_baseline_answers_${roleSlug}`);
      if (stored) {
        setSelectedAnswers(JSON.parse(stored));
      } else {
        setSelectedAnswers({});
      }
      const storedIdx = sessionStorage.getItem(`l2h_baseline_idx_${roleSlug}`);
      if (storedIdx) {
        const parsedIdx = parseInt(storedIdx, 10);
        if (!isNaN(parsedIdx) && parsedIdx >= 0) {
          setCurrentIndex(parsedIdx);
        } else {
          setCurrentIndex(0);
        }
      } else {
        setCurrentIndex(0);
      }
    } catch {}
  }, [roleSlug]);

  // Timer countdown
  useEffect(() => {
    if (flowStage !== 'ASSESSMENT') return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [flowStage]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const currentQ = testQuestions[currentIndex] || testQuestions[0];
  const totalQuestions = testQuestions.length;

  const handleStartCalibration = () => {
    setFlowStage('CALIBRATION');
  };

  const handleCompleteCalibration = () => {
    const { entryLevel } = calculateInitialEntryLevel(calibrationAnswers);
    setCalibratedEntryLevel(entryLevel);
    try {
      sessionStorage.setItem(`l2h_calibrated_level_${roleSlug}`, entryLevel);
    } catch {}
    setFlowStage('ASSESSMENT');
  };

  const handleSelectOption = (option: string) => {
    if (isSaving || isSubmitting) return;

    setSelectedAnswers((prev) => {
      const next = {
        ...prev,
        [currentQ.id]: option,
      };
      try {
        sessionStorage.setItem(`l2h_baseline_answers_${roleSlug}`, JSON.stringify(next));
      } catch {}
      return next;
    });

    // Beginner education mode: show concept explanation after answer selection
    if (calibratedEntryLevel === 'BEGINNER' && currentQ.explanation) {
      setRevealedExplanation(currentQ.explanation);
    }
  };

  const handleNext = async () => {
    const currentAnswer = selectedAnswers[currentQ.id];
    if (!currentAnswer || isSaving || isSubmitting) return;

    setIsSaving(true);

    // Update streak tracking for micro-adaptation
    const isCorrect = currentAnswer === currentQ.correctAnswer;
    if (isCorrect) {
      const nextCorrect = correctStreak + 1;
      setCorrectStreak(nextCorrect);
      setIncorrectStreak(0);
      setCurrentDiff(adaptDifficulty(currentQ.difficulty, nextCorrect, 0));
    } else {
      const nextIncorrect = incorrectStreak + 1;
      setIncorrectStreak(nextIncorrect);
      setCorrectStreak(0);
      setCurrentDiff(adaptDifficulty(currentQ.difficulty, 0, nextIncorrect));
    }

    try {
      sessionStorage.setItem(`l2h_baseline_answers_${roleSlug}`, JSON.stringify(selectedAnswers));
      sessionStorage.setItem(`l2h_baseline_idx_${roleSlug}`, String(currentIndex + 1));
    } catch {}

    await new Promise((r) => setTimeout(r, 150));

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setRevealedExplanation(null);
    }
    setIsSaving(false);
  };

  const handlePrev = () => {
    if (isSaving || isSubmitting) return;
    if (currentIndex > 0) {
      setCurrentIndex((prev) => {
        const next = prev - 1;
        try {
          sessionStorage.setItem(`l2h_baseline_idx_${roleSlug}`, String(next));
        } catch {}
        return next;
      });
      setRevealedExplanation(null);
    }
  };

  const handleSubmitAssessment = async () => {
    const currentAnswer = selectedAnswers[currentQ.id];
    if (!currentAnswer || isSubmitting || isSaving) return;

    setIsSubmitting(true);

    try {
      // Evaluate dynamically using the adaptive evaluation engine
      const evalResult = evaluateAssessmentSession(
        testQuestions,
        selectedAnswers,
        roleSlug,
        calibratedEntryLevel
      );

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
        entryLevel: calibratedEntryLevel,
        calibratedLevel: evalResult.demonstratedLevel || 'L1',
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

      // Clear session persistence upon successful completion
      try {
        sessionStorage.removeItem(`l2h_baseline_answers_${roleSlug}`);
        sessionStorage.removeItem(`l2h_baseline_idx_${roleSlug}`);
      } catch {}

      setTimeout(() => {
        router.push(ROUTES.app.assessments.results('baseline'));
      }, 400);
    } catch (err) {
      console.error('Failed to submit assessment:', err);
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  // VIEW 1: ROLE INTRODUCTION (Step 12)
  // =========================================================================
  if (flowStage === 'ROLE_INTRO') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
          <div className="flex items-center gap-2">
            <span className="editorial-badge bg-brand-orange text-white text-xs">
              Adaptive Baseline Assessment
            </span>
            <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
              Diagnostic Mode
            </span>
          </div>

          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-ink/60 block">
              Your Selected Career
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase text-brand-ink mt-1">
              {currentRole?.title || 'Full-Stack Developer'}
            </h1>
            <p className="text-sm text-brand-ink/80 mt-2 leading-relaxed">
              {currentRole?.shortDesc || currentRole?.description}
            </p>
          </div>

          {/* Tested competencies */}
          <div className="p-4 bg-brand-cream border border-brand-ink/30 space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-ink">
              What You Will Be Tested On
            </h2>
            <div className="flex flex-wrap gap-2">
              {currentRole?.requiredSkills.map((s) => (
                <Badge key={s.name} variant="default" className="text-xs">
                  {s.name} ({s.level})
                </Badge>
              ))}
              <Badge variant="paper" className="text-xs">Aptitude &amp; Reasoning</Badge>
            </div>
          </div>

          {/* Beginner reassurance */}
          <div className="p-4 border-[1.5px] border-brand-ink bg-brand-yellow/20 space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-brand-ink">
              <Sparkles className="w-4 h-4 text-brand-orange shrink-0" />
              <span>No Prior Experience? That&apos;s Completely Okay.</span>
            </div>
            <p className="text-xs text-brand-ink/80 leading-relaxed">
              This diagnostic assessment begins from the fundamentals and adapts to your current level.
              Your score is not a judgment or a pass/fail test—it is your baseline starting map.
            </p>
          </div>

          {/* Assessment attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-brand-ink/80">
            <div className="p-3 border border-brand-ink/20 bg-brand-paper">
              <span className="text-[10px] uppercase text-brand-ink/50 block">Estimated Time</span>
              <span className="font-bold">20-30 Minutes</span>
            </div>
            <div className="p-3 border border-brand-ink/20 bg-brand-paper">
              <span className="text-[10px] uppercase text-brand-ink/50 block">Question Delivery</span>
              <span className="font-bold">Adaptive Ladder</span>
            </div>
            <div className="p-3 border border-brand-ink/20 bg-brand-paper">
              <span className="text-[10px] uppercase text-brand-ink/50 block">Practical/Coding</span>
              <span className="font-bold">Level-Calibrated</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-brand-ink/10">
            <Link href={ROUTES.app.career.discover}>
              <Button variant="outline" size="md">
                &larr; Change Career Role
              </Button>
            </Link>
            <Button variant="primary" size="lg" onClick={handleStartCalibration}>
              Let&apos;s Find Your Starting Point &rarr;
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: SELF-REPORTED CAREER CALIBRATION (Step 3)
  // =========================================================================
  if (flowStage === 'CALIBRATION') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="editorial-badge bg-brand-rose text-white text-[10px]">
                Calibration Stage
              </span>
              <span className="text-xs font-mono text-brand-ink/60 font-bold uppercase">
                Zero-Penalty Diagnostics
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-brand-ink">
              Let&apos;s Find Your Starting Point
            </h1>
            <p className="text-xs sm:text-sm text-brand-ink/80 mt-1">
              Don&apos;t worry if you&apos;re new to this career. This assessment adapts to your current level.
              Your answers here initialize question difficulty without penalizing your baseline score.
            </p>
          </div>

          <div className="space-y-5 pt-2">
            {/* Question 1 */}
            <div className="space-y-2 p-4 border border-brand-ink/20 bg-brand-cream/60">
              <label className="text-xs font-bold text-brand-ink uppercase block">
                1. Have you studied this field before?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { value: 'none', label: "No, I'm completely new" },
                  { value: 'basics', label: 'I know the basics' },
                  { value: 'projects', label: 'I have practiced projects' },
                  { value: 'professional', label: 'I have professional experience' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCalibrationAnswers((p) => ({ ...p, priorStudy: opt.value as any }))}
                    className={`p-3 text-left border text-xs font-medium transition-all ${
                      calibrationAnswers.priorStudy === opt.value
                        ? 'bg-brand-orange text-white border-brand-ink font-bold shadow-sm'
                        : 'bg-brand-paper text-brand-ink border-brand-ink/40 hover:border-brand-ink'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div className="space-y-2 p-4 border border-brand-ink/20 bg-brand-cream/60">
              <label className="text-xs font-bold text-brand-ink uppercase block">
                2. How long have you been learning this area?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { value: 'not_yet', label: 'Not yet' },
                  { value: 'under_3_months', label: 'Less than 3 months' },
                  { value: '3_to_12_months', label: '3-12 months' },
                  { value: 'over_1_year', label: 'More than 1 year' },
                  { value: 'professional', label: 'Professional experience' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCalibrationAnswers((p) => ({ ...p, learningDuration: opt.value as any }))}
                    className={`p-2.5 text-left border text-xs font-medium transition-all ${
                      calibrationAnswers.learningDuration === opt.value
                        ? 'bg-brand-orange text-white border-brand-ink font-bold shadow-sm'
                        : 'bg-brand-paper text-brand-ink border-brand-ink/40 hover:border-brand-ink'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3 & 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 p-4 border border-brand-ink/20 bg-brand-cream/60">
                <label className="text-xs font-bold text-brand-ink uppercase block">
                  3. Have you built anything in this area?
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCalibrationAnswers((p) => ({ ...p, builtProjects: true }))}
                    className={`flex-1 p-2.5 text-center border text-xs font-medium ${
                      calibrationAnswers.builtProjects
                        ? 'bg-brand-orange text-white border-brand-ink font-bold'
                        : 'bg-brand-paper text-brand-ink border-brand-ink/40'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalibrationAnswers((p) => ({ ...p, builtProjects: false }))}
                    className={`flex-1 p-2.5 text-center border text-xs font-medium ${
                      !calibrationAnswers.builtProjects
                        ? 'bg-brand-orange text-white border-brand-ink font-bold'
                        : 'bg-brand-paper text-brand-ink border-brand-ink/40'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="space-y-2 p-4 border border-brand-ink/20 bg-brand-cream/60">
                <label className="text-xs font-bold text-brand-ink uppercase block">
                  4. Worked professionally in this area?
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCalibrationAnswers((p) => ({ ...p, workedProfessionally: true }))}
                    className={`flex-1 p-2.5 text-center border text-xs font-medium ${
                      calibrationAnswers.workedProfessionally
                        ? 'bg-brand-orange text-white border-brand-ink font-bold'
                        : 'bg-brand-paper text-brand-ink border-brand-ink/40'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalibrationAnswers((p) => ({ ...p, workedProfessionally: false }))}
                    className={`flex-1 p-2.5 text-center border text-xs font-medium ${
                      !calibrationAnswers.workedProfessionally
                        ? 'bg-brand-orange text-white border-brand-ink font-bold'
                        : 'bg-brand-paper text-brand-ink border-brand-ink/40'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* Question 5 */}
            <div className="space-y-2 p-4 border border-brand-ink/20 bg-brand-cream/60">
              <label className="text-xs font-bold text-brand-ink uppercase block">
                5. How comfortable are you with technical concepts?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'very_new', label: 'Very new' },
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'comfortable', label: 'Comfortable' },
                  { value: 'advanced', label: 'Advanced' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCalibrationAnswers((p) => ({ ...p, techComfort: opt.value as any }))}
                    className={`p-2.5 text-center border text-xs font-medium transition-all ${
                      calibrationAnswers.techComfort === opt.value
                        ? 'bg-brand-orange text-white border-brand-ink font-bold shadow-sm'
                        : 'bg-brand-paper text-brand-ink border-brand-ink/40 hover:border-brand-ink'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-brand-ink/10">
            <Button variant="outline" size="md" onClick={() => setFlowStage('ROLE_INTRO')}>
              &larr; Back
            </Button>
            <Button variant="primary" size="lg" onClick={handleCompleteCalibration}>
              Start Calibrated Assessment &rarr;
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: ADAPTIVE QUESTION RUNNER (Steps 13, 50, 72)
  // =========================================================================
  if (!currentQ) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-display text-2xl uppercase">No questions loaded for this profile</h2>
        <Button variant="primary" onClick={() => setFlowStage('ROLE_INTRO')}>
          Reset Calibration
        </Button>
      </div>
    );
  }

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const answeredCount = Object.keys(selectedAnswers).length;
  const currentAnswer = selectedAnswers[currentQ.id];
  const hasAnsweredCurrent = Boolean(currentAnswer && currentAnswer.trim().length > 0);

  // Friendly challenge label (avoid intimidating novices)
  const challengeLabel =
    currentQ.difficulty === 'L0' || currentQ.difficulty === 'L1'
      ? 'FOUNDATION'
      : currentQ.difficulty === 'L2' || currentQ.difficulty === 'L3'
      ? 'APPLIED'
      : 'ADVANCED';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Assessment Top Bar */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-4 shadow-editorial flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60">
              {currentRole?.title || 'Full-Stack Developer'}
            </span>
            <Badge variant="yellow" className="text-[10px]">
              {calibratedEntryLevel} CALIBRATION
            </Badge>
          </div>
          <h1 className="font-display text-xl font-bold uppercase text-brand-ink">
            Question {currentIndex + 1} of {totalQuestions}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Challenge Level Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-cream border border-brand-ink/30 text-xs font-mono font-bold text-brand-ink">
            <Layers className="w-3.5 h-3.5 text-brand-orange" />
            <span>Challenge: {challengeLabel}</span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-cream border border-brand-ink text-xs font-mono font-bold text-brand-ink">
            <Clock className="w-3.5 h-3.5 text-brand-orange" />
            <span>{formatTime(timeRemaining)}</span>
          </div>

          {/* Progress */}
          <span className="text-xs font-semibold text-brand-ink/70 hidden sm:inline">
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
            {currentQ.section && (
              <Badge variant="paper">{currentQ.section.replace(/_/g, ' ')}</Badge>
            )}
            <Badge level={currentQ.targetLevel as any}>{currentQ.difficulty}</Badge>
            <span className="text-xs font-semibold text-brand-ink/60">
              Topic: {currentQ.topic}
            </span>
          </div>
          <span className="text-[10px] font-mono text-brand-ink/50 uppercase">
            Source: {currentQ.sourceType.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Prompt */}
        <h2 className="text-lg sm:text-xl font-semibold text-brand-ink leading-relaxed">
          {currentQ.questionText || currentQ.prompt}
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
                <span className="text-sm font-medium leading-relaxed">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Beginner Education Mode: Pedagogical Explanation Box (Step 72) */}
        {revealedExplanation && (
          <div className="p-4 border-[1.5px] border-brand-ink bg-brand-paper shadow-sm space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-ink uppercase">
              <Info className="w-3.5 h-3.5 text-brand-orange" />
              <span>Concept Being Tested</span>
            </div>
            <p className="text-xs text-brand-ink/80 leading-relaxed">{revealedExplanation}</p>
          </div>
        )}

        {/* Navigation Controls: Strict Next/Submit Button State Machine */}
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

          {isLastQuestion ? (
            <Button
              variant="accent"
              size="md"
              onClick={handleSubmitAssessment}
              disabled={!hasAnsweredCurrent || isSubmitting || isSaving}
              className="w-full sm:w-auto justify-center"
            >
              {isSubmitting ? 'Evaluating Diagnostic...' : 'Submit Assessment \u2192'}
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
    </div>
  );
}
