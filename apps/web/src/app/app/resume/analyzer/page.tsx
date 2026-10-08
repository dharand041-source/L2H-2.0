'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import {
  ResumeStore,
  ResumeVersion,
  parseJobDescription,
  calculateATSAnalysis,
  ATSAnalysisResult
} from '@/lib/resume';

export default function ResumeAnalyzerPage() {
  const { state } = useCandidateState();
  const [activeVersion, setActiveVersion] = useState<ResumeVersion | null>(null);

  const [jobDescription, setJobDescription] = useState(
`Seeking a Junior to Mid-Level Full-Stack Engineer with strong capabilities in React, Next.js, Node.js, and SQL. 
Experience with Docker containerization, RESTful API design, and automated testing (Jest/Playwright) is highly desired. 
Must possess solid understanding of Git version control. Minimum 1 year experience requested.`
  );

  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ATSAnalysisResult | null>(null);

  useEffect(() => {
    const active = ResumeStore.getActiveVersion();
    setActiveVersion(active);

    if (active) {
      // Auto analyze active version against default job spec
      const parsedJob = parseJobDescription(jobDescription);
      const result = calculateATSAnalysis(
        active.id,
        active.parsedData,
        parsedJob,
        state.targetCareerSlug
      );
      setAnalysisResult(result);
    }
  }, []);

  const handleScan = () => {
    if (!activeVersion) return;
    setIsScanning(true);

    setTimeout(() => {
      const parsedJob = parseJobDescription(jobDescription);
      const result = calculateATSAnalysis(
        activeVersion.id,
        activeVersion.parsedData,
        parsedJob,
        state.targetCareerSlug
      );
      ResumeStore.saveAnalysis(result);
      setAnalysisResult(result);
      setIsScanning(false);
    }, 400);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.resume.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Resume Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">
          L2H ATS Compatibility Engine &bull; {analysisResult?.scoringModelVersion || 'ATS-L2H-2026.1'}
        </span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="editorial-badge bg-brand-yellow text-brand-ink">
            Configurable Scoring Model
          </span>
          <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
            Required vs Preferred Breakdown
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          ATS &amp; Job Specification Scanner
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Evaluate your actual resume against authentic job postings. We provide a transparent compatibility estimate and eligibility evaluation—not a fabricated employer score.
        </p>
      </div>

      {!activeVersion ? (
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-brand-orange mx-auto" />
          <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
            No Resume Version Available to Scan
          </h2>
          <p className="text-xs text-brand-ink/75 max-w-md mx-auto">
            Please upload your resume document or paste plain text in the Resume Hub first before running ATS compatibility scans.
          </p>
          <Link href={ROUTES.app.resume.home}>
            <Button variant="primary" size="md">
              Go to Resume Hub &amp; Upload →
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Main Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Target Job Description Input */}
            <div className="lg:col-span-6 bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-brand-ink/70">
                  Target Job Description Spec:
                </span>
                <span className="text-[11px] font-mono text-brand-ink/60">
                  Active Document: <strong className="text-brand-ink">{activeVersion.title}</strong>
                </span>
              </div>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={11}
                className="w-full p-3 font-mono text-xs bg-brand-cream border border-brand-ink text-brand-ink focus:outline-none leading-relaxed"
                placeholder="Paste authentic employer job description here..."
              />

              <Button
                variant="primary"
                size="md"
                fullWidth
                disabled={isScanning}
                onClick={handleScan}
              >
                {isScanning ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Scanning Semantic Tokens...
                  </span>
                ) : (
                  'Run L2H ATS Compatibility Evaluation →'
                )}
              </Button>
            </div>

            {/* Right: Compatibility & Eligibility Scorecard */}
            <div className="lg:col-span-6 bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-6">
              {analysisResult ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-ink/20">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="editorial-badge bg-brand-orange text-white text-[10px]">
                          L2H Compatibility Estimate
                        </span>
                        <Badge
                          variant={
                            analysisResult.eligibilityStatus === 'ELIGIBLE'
                              ? 'yellow'
                              : analysisResult.eligibilityStatus === 'POTENTIALLY_ELIGIBLE'
                              ? 'default'
                              : 'rose'
                          }
                        >
                          {analysisResult.eligibilityStatus.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
                        {analysisResult.jobTitle}
                      </h3>
                      <p className="text-[11px] text-brand-ink/70 font-semibold mt-0.5">
                        {analysisResult.eligibilityReason}
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 bg-brand-cream border border-brand-ink/30 shrink-0">
                      <ProgressRing
                        progress={analysisResult.compatibilityScore}
                        size={84}
                        strokeWidth={7}
                        color="#FFA2B6"
                      />
                      <span className="font-display text-2xl font-bold text-brand-ink mt-1">
                        {analysisResult.compatibilityScore}%
                      </span>
                    </div>
                  </div>

                  {/* Multi-Dimension Breakdown (9 configurable dimensions) */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/70 block">
                      Weighted Scoring Breakdown:
                    </span>
                    <div className="space-y-1.5 text-xs">
                      {Object.values(analysisResult.dimensions).map((dim) => (
                        <div
                          key={dim.dimension}
                          className="p-2 bg-brand-cream border border-brand-ink/20 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-brand-ink">{dim.dimension}</span>
                            <span className="text-[10px] text-brand-ink/60 ml-2">({dim.weightPercent}% wt)</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-brand-ink">{dim.score}%</span>
                            <span className="text-[10px] text-brand-ink/60 ml-1.5 block sm:inline">
                              contrib: +{dim.weightedContribution}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-xs text-brand-ink/60">
                  Ready to evaluate. Click the button to calculate compatibility.
                </div>
              )}
            </div>
          </div>

          {/* Matched vs Missing Gaps (Required vs Preferred) */}
          {analysisResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths & Matched Skills */}
              <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                  <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                    Matched Required Competencies ({analysisResult.matchedRequiredSkills.length})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.matchedRequiredSkills.map((sk) => (
                    <span key={sk} className="text-xs font-bold px-2.5 py-1 bg-brand-cream border border-brand-ink/30 text-brand-ink">
                      {sk} &#10003;
                    </span>
                  ))}
                  {analysisResult.matchedRequiredSkills.length === 0 && (
                    <span className="text-xs text-brand-ink/60 italic">No exact required skills matched in resume.</span>
                  )}
                </div>

                {analysisResult.matchedPreferredSkills.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-extrabold uppercase text-brand-ink/60 block mb-1.5">
                      Matched Preferred Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.matchedPreferredSkills.map((sk) => (
                        <span key={sk} className="text-[11px] font-semibold px-2 py-0.5 bg-brand-cream border border-brand-ink/20 text-brand-ink">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Critical & Optional Gaps */}
              <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-brand-rose" />
                  <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                    Missing Required Skills ({analysisResult.missingRequiredSkills.length})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.missingRequiredSkills.map((sk) => (
                    <span key={sk} className="text-xs font-bold px-2.5 py-1 bg-brand-cream border border-brand-rose text-brand-rose">
                      ! {sk}
                    </span>
                  ))}
                  {analysisResult.missingRequiredSkills.length === 0 && (
                    <span className="text-xs text-brand-ink/80 font-bold">&#10003; All core required skills satisfied!</span>
                  )}
                </div>

                {analysisResult.missingPreferredSkills.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-extrabold uppercase text-brand-ink/60 block mb-1.5">
                      Missing Preferred (Optional) Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.missingPreferredSkills.map((sk) => (
                        <span key={sk} className="text-[11px] font-medium px-2 py-0.5 bg-brand-paper border border-brand-ink/30 text-brand-ink/70">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actionable Improvement Recommendations (Phase 33: What, Why, How) */}
          {analysisResult && analysisResult.recommendations.length > 0 && (
            <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-orange" />
                  <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
                    Prioritized Improvement Recommendations
                  </h3>
                </div>
                <Badge variant="rose">Actionable Gaps</Badge>
              </div>

              <div className="space-y-3">
                {analysisResult.recommendations.map((rec) => (
                  <div key={rec.id} className="p-4 bg-brand-cream border border-brand-ink/30 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-brand-ink text-sm uppercase">
                        {rec.what}
                      </div>
                      <span className="editorial-badge bg-brand-paper text-brand-ink text-[10px]">
                        Est. Impact: +{rec.impactScoreBoostEstimated}%
                      </span>
                    </div>
                    <p className="text-brand-ink/85 font-medium">
                      <strong>Why:</strong> {rec.why}
                    </p>
                    <p className="text-brand-ink/75 font-mono text-[11px]">
                      <strong>How:</strong> {rec.how}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link href={ROUTES.app.learning.roadmap}>
                  <Button variant="primary" size="sm">
                    Remediate Gaps via Career Roadmap →
                  </Button>
                </Link>
                <Link href={ROUTES.app.opportunities.jobs}>
                  <Button variant="outline" size="sm">
                    Browse Verified Openings →
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
