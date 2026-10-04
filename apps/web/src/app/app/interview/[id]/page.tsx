'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Mic, ArrowLeft, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';

export default function InterviewSessionDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { state } = useCandidateState();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.interview.history} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to History
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Session Record: {id}</span>
      </div>

      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
          <div>
            <Badge variant="yellow">EVALUATION VERDICT</Badge>
            <h1 className="font-display text-3xl uppercase text-brand-ink mt-2">
              Full-Stack Developer Comprehensive Simulation
            </h1>
          </div>
          <div className="text-right">
            <span className="font-display text-4xl font-bold text-brand-orange">{state.interviewScore || 87}%</span>
            <span className="text-[10px] block font-bold text-brand-ink/60 uppercase">Composite Score</span>
          </div>
        </div>

        <div className="p-4 bg-brand-cream border border-brand-ink/20 space-y-2 text-xs">
          <div className="font-bold text-brand-ink text-sm">Evaluator Feedback:</div>
          <p className="text-brand-ink/85 leading-relaxed">
            Strong command of asynchronous event loops, libuv workers, and relational database locking mechanisms. Response was structured, professional, and properly addressed failure modes.
          </p>
        </div>

        <div className="pt-4 flex justify-between">
          <Link href={ROUTES.app.interview.mock}>
            <Button variant="outline" size="sm">Retake Simulation</Button>
          </Link>
          <Link href={ROUTES.app.resume.builder}>
            <Button variant="primary" size="sm">Proceed to Resume Builder →</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
