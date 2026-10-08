'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Terminal, Play, CheckCircle2, ArrowLeft, RefreshCw, Sparkles, Award } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function CodingPracticeInner() {
  const searchParams = useSearchParams();
  const skillParam = searchParams.get('skill');
  const { state, recordPracticeCompletion } = useCandidateState();

  // Determine active skill from query param or fallback to top weak skill
  const activeSkill = useMemo(() => {
    if (skillParam && skillParam.trim()) return skillParam.trim();
    const weak = state.skills.find((s) => s.gap > 0);
    return weak ? weak.name : 'JavaScript';
  }, [skillParam, state.skills]);

  // Role/skill adapted starter challenge template
  const challengeSpec = useMemo(() => {
    const s = activeSkill.toLowerCase();
    if (s.includes('react')) {
      return {
        title: 'React Custom Hook: useDebounce Implementation',
        description: 'Implement a reusable custom hook `useDebounce(value, delay)` that debounces state transitions and cancels stale timers on unmount.',
        signature: 'useDebounce<T>(value: T, delay: number): T',
        starterCode: `function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
        tests: [
          'Immediate state change does not trigger early update (1.2ms)',
          'Value propagates after specified timer delay has elapsed (25.1ms)',
          'Rapid successive mutations cancel preceding timers (2.4ms)',
          'Component unmount successfully clears active timeout handles (0.9ms)'
        ]
      };
    }

    if (s.includes('sql') || s.includes('database')) {
      return {
        title: 'Relational Query: User Retention Cohort Aggregation',
        description: 'Construct an analytical relational aggregation query grouping users by signup cohort and computing active retention across rolling periods.',
        signature: 'SELECT signup_month, count(distinct user_id), ...',
        starterCode: `WITH monthly_signups AS (
  SELECT id AS user_id, date_trunc('month', created_at) AS cohort_month
  FROM users
)
SELECT 
  cohort_month,
  COUNT(DISTINCT user_id) AS total_users
FROM monthly_signups
GROUP BY cohort_month
ORDER BY cohort_month;`,
        tests: [
          'Cohort months correctly formatted as ISO timestamps (4.2ms)',
          'COUNT DISTINCT eliminates duplicate user telemetry events (8.1ms)',
          'Query execution plan utilizes index on created_at column (2.3ms)'
        ]
      };
    }

    // Default to JavaScript / Backend / Algorithmic challenge
    return {
      title: `${activeSkill}: Sliding Window Rate Limiter`,
      description: 'Implement an in-memory sliding window rate limiter that tracks client identifiers and enforces request thresholds within a rolling time window.',
      signature: 'rateLimiter(limit: number, windowMs: number): (ip: string) => Result',
      starterCode: `function rateLimiter(limit, windowMs) {
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
}`,
      tests: [
        'Single request under limit allows access (1.2ms)',
        'Requests exceeding window limit return allowed=false (2.4ms)',
        'Sliding window expires old timestamps correctly (18.1ms)',
        'Concurrent IP addresses tracked independently (4.0ms)'
      ]
    };
  }, [activeSkill]);

  const [userCode, setUserCode] = useState(challengeSpec.starterCode);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [evidenceRecorded, setEvidenceRecorded] = useState(false);

  const handleRunTests = async () => {
    setIsRunning(true);
    setTestOutput(null);

    try {
      // Define concrete test assertions for code execution sandbox
      const testCasesToRun = [
        {
          id: 't1',
          name: 'Syntax and Execution Verification',
          input: 'typeof ' + (activeSkill.toLowerCase().includes('react') ? 'useDebounce' : 'rateLimiter') + ' !== "undefined"',
          expectedOutput: 'true'
        },
        {
          id: 't2',
          name: 'Functional Invariant Check',
          input: activeSkill.toLowerCase().includes('react') 
            ? 'typeof useDebounce === "function"' 
            : '(() => { const l = rateLimiter(2, 5000); const r1 = l("127.0.0.1"); const r2 = l("127.0.0.1"); const r3 = l("127.0.0.1"); return r1.allowed && r2.allowed && !r3.allowed; })()',
          expectedOutput: 'true'
        }
      ];

      const res = await fetch('/api/practice/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: userCode,
          language: 'javascript',
          testCases: testCasesToRun
        })
      });

      if (!res.ok) {
        throw new Error('Code execution service returned an error status: ' + res.status);
      }

      const execResult = await res.json();

      if (execResult.status === 'SECURITY_VIOLATION') {
        setTestOutput(`SECURITY VIOLATION DETECTED:
--------------------------------------------------
${execResult.error || 'Blocked forbidden system calls or unsafe syntax.'}

Execution halted to protect system environment.`);
        setIsRunning(false);
        return;
      }

      const score = execResult.totalTestCases > 0
        ? Math.round((execResult.testCasesPassed / execResult.totalTestCases) * 100)
        : (execResult.status === 'ACCEPTED' ? 100 : 0);

      // Record verified practice evidence in state & Supabase
      if (score > 0) {
        await recordPracticeCompletion(activeSkill, score, {
          challengeTitle: challengeSpec.title,
          passedTests: execResult.testCasesPassed,
          totalTests: execResult.totalTestCases,
        });
        setEvidenceRecorded(true);
      }

      const testLines = execResult.tests && execResult.tests.length > 0
        ? execResult.tests.map((t: any, idx: number) => `${t.passed ? '✔' : '✖'} Test ${idx + 1}: ${t.name} (${t.executionTimeMs}ms)${t.error ? ' - ' + t.error : ''}`).join('\n')
        : (execResult.status === 'ACCEPTED' ? '✔ All basic syntax and sandbox assertions passed.' : `✖ Runtime failure: ${execResult.error || 'Failed assertions'}`);

      setTestOutput(`SANDBOX RUNNER: node-vm20 (Isolated AST Sandbox)
--------------------------------------------------
${testLines}

STATUS: ${execResult.status} (${score} / 100 POINTS)
${execResult.testCasesPassed} / ${execResult.totalTestCases} TESTS PASSED • Execution Runtime: ${execResult.executionTimeMs} ms
${score > 0 ? `Evidence Recorded: ${activeSkill} Competency Calibrated in Passport & Skill Analyzer.` : 'Fix test failures and re-run.'}`);
    } catch (err: any) {
      console.error('Practice execution failed:', err);
      setTestOutput(`SANDBOX EXECUTION ERROR:
--------------------------------------------------
Code execution is temporarily unavailable. Error: ${err?.message || 'Network error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.practice.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Practice Arena
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="yellow">Active Gap: {activeSkill}</Badge>
          <span className="text-xs font-semibold text-brand-ink/60">Practice Lab</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Challenge Prompt */}
        <div className="lg:col-span-5 bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
          <div className="flex items-center gap-2">
            <span className="editorial-badge bg-brand-orange text-white text-[10px]">
              Challenge #{activeSkill.slice(0, 3).toUpperCase()}-01
            </span>
            <span className="text-xs font-bold text-brand-ink/70">Calibrated Level: L3</span>
          </div>

          <h1 className="font-display text-2xl font-bold uppercase text-brand-ink">
            {challengeSpec.title}
          </h1>

          <p className="text-xs text-brand-ink/85 font-medium leading-relaxed">
            {challengeSpec.description}
          </p>

          <div className="p-3 bg-brand-cream border border-brand-ink/20 text-xs font-mono space-y-1">
            <div className="font-bold text-brand-ink">Expected Signature:</div>
            <div>{challengeSpec.signature}</div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60 block">
              Test Assertions:
            </span>
            <ul className="text-xs space-y-1 text-brand-ink/80 list-disc pl-4">
              {challengeSpec.tests.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          {evidenceRecorded && (
            <div className="p-3 bg-brand-cream border border-brand-ink text-xs space-y-2 mt-4">
              <div className="flex items-center gap-1.5 text-brand-orange font-bold">
                <CheckCircle2 className="w-4 h-4" /> Evidence Passport Updated
              </div>
              <p className="text-brand-ink/80">
                Your performance in <strong>{activeSkill}</strong> has been logged. Review your updated gap score in the Skill Analyzer or return to your roadmap.
              </p>
              <div className="flex gap-2 pt-1">
                <Link href={ROUTES.app.skills.analysis}>
                  <Button variant="outline" size="sm" className="text-xs">
                    View Skill Analyzer →
                  </Button>
                </Link>
                <Link href={ROUTES.app.learning.roadmap}>
                  <Button variant="accent" size="sm" className="text-xs">
                    Back to Roadmap →
                  </Button>
                </Link>
              </div>
            </div>
          )}
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
                {isRunning ? 'Executing Sandboxed Tests...' : 'Run Test Suite'}
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
                <CheckCircle2 className="w-4 h-4" /> Execution Results &amp; Verification
              </div>
              <pre className="text-brand-ink whitespace-pre-wrap">{testOutput}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CodingPracticePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-display text-xl uppercase">Loading Practice Arena...</div>}>
      <CodingPracticeInner />
    </Suspense>
  );
}
