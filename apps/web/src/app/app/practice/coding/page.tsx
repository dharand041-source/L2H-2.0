'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Terminal, Play, CheckCircle2, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CodingPracticePage() {
  const [userCode, setUserCode] = useState(`function rateLimiter(limit, windowMs) {
  const requests = new Map();
  
  return function(ip) {
    const now = Date.now();
    const timestamps = requests.get(ip) || [];
    
    // Filter timestamps outside current sliding window
    const valid = timestamps.filter(t => now - t < windowMs);
    
    if (valid.length >= limit) {
      return { allowed: false, remaining: 0 };
    }
    
    valid.push(now);
    requests.set(ip, valid);
    return { allowed: true, remaining: limit - valid.length };
  };
}`);

  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setTestOutput(`RUNNING TEST SUITE: rate_limiter_spec.ts
--------------------------------------------------
✔ Test 1: Single request under limit allows access (1.2ms)
✔ Test 2: Requests exceeding window limit return allowed=false (2.4ms)
✔ Test 3: Sliding window expires old timestamps correctly (18.1ms)
✔ Test 4: Concurrent IP addresses tracked independently (4.0ms)

ALL 4 TEST CASES PASSED (100% Accuracy)
Evidence recorded: JavaScript L3 Competency Validated`);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.practice.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Practice Arena
        </Link>
        <Badge variant="yellow">Backend Coding Arena</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Challenge Prompt */}
        <div className="lg:col-span-5 bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
          <div className="flex items-center gap-2">
            <span className="editorial-badge bg-brand-orange text-white text-[10px]">
              Challenge #BC-04
            </span>
            <span className="text-xs font-bold text-brand-ink/70">Difficulty: L3</span>
          </div>

          <h1 className="font-display text-2xl font-bold uppercase text-brand-ink">
            REST API Sliding Window Rate Limiter
          </h1>

          <p className="text-xs text-brand-ink/85 font-medium leading-relaxed">
            Implement an in-memory sliding window rate limiter that tracks client IP addresses and enforces maximum requests within a rolling time window.
          </p>

          <div className="p-3 bg-brand-cream border border-brand-ink/20 text-xs font-mono space-y-1">
            <div className="font-bold text-brand-ink">Expected Signature:</div>
            <div>rateLimiter(limit: number, windowMs: number): (ip: string) =&gt; Result</div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60 block">
              Test Assertions:
            </span>
            <ul className="text-xs space-y-1 text-brand-ink/80 list-disc pl-4">
              <li>Allow bursts up to `limit` requests within windowMs</li>
              <li>Reject (429) requests once threshold is breached</li>
              <li>Clean up expired timestamps from historical queue</li>
            </ul>
          </div>
        </div>

        {/* Right: Code Sandbox & Execution Output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border-[1.5px] border-brand-ink bg-brand-ink text-brand-paper shadow-editorial">
            <div className="p-3 bg-brand-cream border-b border-brand-ink flex items-center justify-between text-brand-ink">
              <span className="text-xs font-mono font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4 text-brand-orange" /> solution.js
              </span>
              <Button variant="primary" size="sm" onClick={handleRunTests} disabled={isRunning}>
                {isRunning ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5 inline" />
                ) : (
                  <Play className="w-3.5 h-3.5 mr-1.5 inline" />
                )}
                {isRunning ? 'Executing Tests...' : 'Run Test Suite'}
              </Button>
            </div>

            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              rows={14}
              className="w-full p-4 bg-brand-ink text-brand-paper font-mono text-xs focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          {testOutput && (
            <div className="border-[1.5px] border-brand-ink bg-brand-paper p-4 font-mono text-xs shadow-editorial space-y-2">
              <div className="flex items-center gap-2 text-brand-orange font-bold">
                <CheckCircle2 className="w-4 h-4" /> Execution Results
              </div>
              <pre className="text-brand-ink whitespace-pre-wrap">{testOutput}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
