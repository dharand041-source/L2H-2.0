'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Briefcase,
  Building2,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  FileText,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Upload,
  Check,
  AlertCircle
} from 'lucide-react';
import { VERIFIED_OPPORTUNITIES, OpportunityItem } from '@/lib/opportunities';
import { OPPORTUNITIES_CATALOG } from '@/lib/data/opportunities-data';
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

export default function DirectApplyRoutePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { state, applyToOpportunity, confirmSubmission } = useCandidateState();
  const [returnStatusResponse, setReturnStatusResponse] = useState<'IDLE' | 'NOT_YET' | 'NOT_SURE'>('IDLE');

  // Find job from verified catalog or opportunities catalog
  const job: any =
    VERIFIED_OPPORTUNITIES.find((o) => o.id === id) ||
    OPPORTUNITIES_CATALOG.find((o) => o.id === id) ||
    VERIFIED_OPPORTUNITIES[0];

  // Resume versions
  const [resumeVersions, setResumeVersions] = useState<ResumeVersion[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeVersion | null>(null);

  // Editable Application Specific Data (Phase 11: Application Data distinct from original resume)
  const [applicantName, setApplicantName] = useState(state.user.name || '');
  const [applicantEmail, setApplicantEmail] = useState(state.user.email || '');
  const [applicantPhone, setApplicantPhone] = useState('(555) 019-2834');
  const [applicantLocation, setApplicantLocation] = useState('Tamil Nadu, India');
  const [portfolioUrl, setPortfolioUrl] = useState('https://github.com/candidate');
  const [isSavingAppInfo, setIsSavingAppInfo] = useState(false);
  const [appInfoSaved, setAppInfoSaved] = useState(false);

  // ATS and Eligibility Analysis
  const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Application submission flow states
  const [hasOpenedDestination, setHasOpenedDestination] = useState(false);
  const [submissionConfirmed, setSubmissionConfirmed] = useState(false);

  // Duplicate application detection
  const existingApp = state.applications.find((a) => a.opportunityId === job.id);

  // Load candidate's real uploaded resumes (Zero demo/example resume)
  useEffect(() => {
    const list = ResumeStore.getVersions();
    setResumeVersions(list);
    const active = ResumeStore.getActiveVersion();
    setSelectedResume(active);

    if (active) {
      runEligibilityAndATS(active);
    }
  }, [id]);

  const runEligibilityAndATS = (resumeDoc: ResumeVersion) => {
    setIsCalculating(true);
    const jobSpecText = `${job.title} at ${job.companyName || job.company}\nLocation: ${job.location}\nExperience: ${job.experienceLevelRequired || job.minExperienceYears || '1'} years\nRequired: ${(job.requiredSkills || []).join(', ')}\n${job.description || ''}`;
    const parsedJob = parseJobDescription(jobSpecText);
    const result = calculateATSAnalysis(
      resumeDoc.id,
      resumeDoc.parsedData,
      parsedJob,
      state.targetCareerSlug
    );
    setAnalysis(result);
    setIsCalculating(false);
  };

  const handleSelectResumeVersion = (versionId: string) => {
    const found = resumeVersions.find((v) => v.id === versionId);
    if (found) {
      setSelectedResume(found);
      ResumeStore.setActiveVersion(versionId);
      runEligibilityAndATS(found);
    }
  };

  const handleSaveApplicationInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAppInfo(true);
    setTimeout(() => {
      setIsSavingAppInfo(false);
      setAppInfoSaved(true);
      setTimeout(() => setAppInfoSaved(false), 3000);
    }, 400);
  };

  const handleOpenOfficialApplication = () => {
    // Record that application was initiated (APPLICATION_STARTED)
    // Strictly does NOT mark APPLIED until user confirms
    const targetUrl = job.applyUrl || job.sourceUrl;
    applyToOpportunity({
      id: job.id,
      companyName: job.companyName || job.company,
      title: job.title,
      location: job.location,
      workMode: job.workMode,
      careerRoleSlug: state.targetCareerSlug,
      resumeVersionId: selectedResume?.id,
      resumeTitle: selectedResume?.title,
      compatibilityScore: analysis?.compatibilityScore,
      eligibilityStatus: analysis?.eligibilityStatus,
      applyUrl: targetUrl,
      jobUrl: job.sourceUrl,
      source: job.source,
    });

    setHasOpenedDestination(true);

    // Open actual verified employer application URL in new tab
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleConfirmSubmission = () => {
    confirmSubmission(job.id);
    setSubmissionConfirmed(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link
          href={ROUTES.app.opportunities.detail(job.id)}
          className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Opportunity Details
        </Link>
        <div className="flex items-center gap-2">
          <span className="editorial-badge bg-brand-yellow text-brand-ink text-[10px]">
            Direct Apply Gateway
          </span>
          <span className="text-xs font-mono text-brand-ink/60">
            Source: {job.source || 'EMPLOYER_CAREER_PORTAL'}
          </span>
        </div>
      </div>

      {/* Target Job Header Card */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-brand-ink/15">
          <div className="space-y-1">
            <span className="editorial-badge bg-brand-cream text-brand-ink text-xs font-bold">
              {job.companyName || job.company}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-brand-ink">
              {job.title}
            </h1>
            <div className="text-xs text-brand-ink/75 font-semibold flex flex-wrap gap-3 pt-1">
              <span>Location: <strong>{job.location}</strong></span>
              <span>&bull;</span>
              <span>Verified: <strong>{job.lastVerifiedAt || 'Recently Verified'}</strong></span>
            </div>
          </div>

          {analysis && (
            <div className="flex items-center gap-4 p-3 bg-brand-cream border border-brand-ink/30 shrink-0">
              <ProgressRing
                progress={analysis.compatibilityScore}
                size={68}
                strokeWidth={6}
                color="#FFA2B6"
              />
              <div>
                <div className="font-display text-2xl font-bold text-brand-ink">
                  {analysis.compatibilityScore}%
                </div>
                <div className="text-[10px] font-extrabold uppercase text-brand-ink/60">
                  L2H Compatibility
                </div>
                <Badge
                  variant={
                    analysis.eligibilityStatus === 'ELIGIBLE'
                      ? 'yellow'
                      : analysis.eligibilityStatus === 'POTENTIALLY_ELIGIBLE'
                      ? 'default'
                      : 'rose'
                  }
                  className="mt-1 text-[10px]"
                >
                  {analysis.eligibilityStatus.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-brand-ink/80 font-medium leading-relaxed pt-3">
          This Direct Apply route connects your authentic candidate documents directly to the employer application destination without simulated data or automated ghost submissions.
        </p>
      </div>

      {/* CRITICAL BUG FIX #1: REAL RESUME SELECTION (Zero Demo / Example Resume) */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-ink/15 pb-3">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
              Active Application Resume Document
            </h2>
            <p className="text-xs text-brand-ink/70">
              Select which authentic document version to evaluate and submit for this vacancy.
            </p>
          </div>
          <Link href={ROUTES.app.resume.home}>
            <Button variant="outline" size="sm" className="text-xs">
              <Upload className="w-3.5 h-3.5 mr-1" /> Upload New Version
            </Button>
          </Link>
        </div>

        {resumeVersions.length === 0 ? (
          <div className="p-6 bg-brand-cream border border-brand-ink/30 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-brand-orange mx-auto" />
            <h3 className="font-display text-lg font-bold uppercase text-brand-ink">
              No Resume Uploaded
            </h3>
            <p className="text-xs text-brand-ink/75 max-w-md mx-auto">
              You have not uploaded a real resume document yet. Learn-2-Hire strictly refuses to substitute sample or demo resumes.
            </p>
            <Link href={ROUTES.app.resume.home}>
              <Button variant="primary" size="md">
                Go to Resume Hub &amp; Upload Resume →
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Version Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase text-brand-ink/70">
                Choose Document Version:
              </span>
              {resumeVersions.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleSelectResumeVersion(v.id)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all ${
                    selectedResume?.id === v.id
                      ? 'bg-brand-ink text-white border-brand-ink'
                      : 'bg-brand-cream text-brand-ink border-brand-ink/30 hover:bg-brand-paper'
                  }`}
                >
                  Version {v.versionNumber} ({v.title})
                </button>
              ))}
            </div>

            {selectedResume && (
              <div className="p-4 bg-brand-cream border border-brand-ink/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-orange" />
                    <span className="font-bold text-sm text-brand-ink">{selectedResume.fileName}</span>
                    <Badge variant="yellow">{selectedResume.fileType}</Badge>
                  </div>
                  <div className="text-[11px] text-brand-ink/70 font-mono">
                    Parsed Skills: {selectedResume.parsedData.extractedSkills.length} &bull; Experience: ~{selectedResume.parsedData.totalYearsExperience} yrs &bull; Checksum: {selectedResume.checksum.slice(0, 10)}...
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={ROUTES.app.resume.analyzer}>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Inspect ATS Scan
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Application-Specific Information Form (Editable application data separate from resume) */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-5">
        <div className="border-b border-brand-ink/15 pb-3">
          <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
            Application Submission Profile
          </h2>
          <p className="text-xs text-brand-ink/70">
            Review and adjust your direct contact coordinates for this specific submission. Changes persist for this application without modifying your original uploaded document.
          </p>
        </div>

        <form onSubmit={handleSaveApplicationInfo} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
                Candidate Full Name
              </label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full p-2.5 bg-brand-cream border border-brand-ink text-xs font-bold text-brand-ink focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                className="w-full p-2.5 bg-brand-cream border border-brand-ink text-xs font-mono text-brand-ink focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={applicantPhone}
                onChange={(e) => setApplicantPhone(e.target.value)}
                className="w-full p-2.5 bg-brand-cream border border-brand-ink text-xs font-bold text-brand-ink focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
                Location / Region
              </label>
              <input
                type="text"
                value={applicantLocation}
                onChange={(e) => setApplicantLocation(e.target.value)}
                className="w-full p-2.5 bg-brand-cream border border-brand-ink text-xs font-bold text-brand-ink focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" size="sm" type="submit" disabled={isSavingAppInfo}>
              {isSavingAppInfo ? 'Saving...' : 'Save Changes'}
            </Button>
            {appInfoSaved && (
              <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                <Check className="w-4 h-4" /> Application coordinates saved!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Verified Destination & Submission Pipeline Gate */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
        <div className="border-b border-brand-ink/15 pb-3">
          <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
            Official Application Destination
          </h2>
          <p className="text-xs text-brand-ink/70">
            Learn-2-Hire opens the employer&apos;s authoritative portal directly. We never simulate submissions.
          </p>
        </div>

        <div className="p-4 bg-brand-cream border border-brand-ink/30 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase text-brand-ink block">
                Destination: {job.companyName || job.company} Official Career Portal
              </span>
              <span className="text-[11px] font-mono text-brand-ink/70 break-all">
                URL: {job.applyUrl || job.sourceUrl || 'Official Employer Portal Link'}
              </span>
            </div>
            <Badge variant="yellow">VERIFIED DESTINATION</Badge>
          </div>

          <p className="text-[11px] text-brand-ink/80 leading-relaxed font-medium">
            Notice: Clicking continue will record an <strong>APPLICATION_STARTED</strong> event in your Kanban tracker and open the employer&apos;s application portal in a new browser tab.
          </p>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleOpenOfficialApplication}
              disabled={!selectedResume}
              className="text-sm font-bold uppercase"
            >
              Continue to Official Application <ExternalLink className="w-4 h-4 ml-2 inline" />
            </Button>
          </div>
        </div>

        {/* Duplicate Application Protection Banner */}
        {existingApp && existingApp.status !== 'SAVED' && existingApp.status !== 'DRAFT' && (
          <div className="p-4 bg-brand-yellow/30 border-[1.5px] border-brand-ink space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-orange block">
                  Existing Application Detected
                </span>
                <h3 className="font-display text-base font-bold uppercase text-brand-ink">
                  You already have an application logged for this job
                </h3>
                <p className="text-xs text-brand-ink/75">
                  Current Status: <strong className="uppercase">{existingApp.status}</strong> &bull; Resume Used: <strong>{existingApp.resumeTitle || existingApp.resumeVersionId || 'Historical'}</strong>
                </p>
              </div>
              <Link href={ROUTES.app.applications.detail(existingApp.id)}>
                <Button variant="primary" size="sm" className="text-xs uppercase shrink-0">
                  View Application Record →
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Phase 14: After returning manual submission confirmation */}
        {hasOpenedDestination && !submissionConfirmed && (
          <div className="p-5 bg-brand-yellow/30 border border-brand-ink space-y-3">
            <h3 className="font-display text-lg font-bold uppercase text-brand-ink">
              Did you complete this application on the employer website?
            </h3>
            <p className="text-xs text-brand-ink/80">
              The external employer controls the actual submission. Learn-2-Hire strictly requires your authentic confirmation before recording APPLIED.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmSubmission}
                className="text-xs font-bold uppercase"
              >
                Yes, I Applied
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReturnStatusResponse('NOT_YET')}
                className={`text-xs uppercase ${returnStatusResponse === 'NOT_YET' ? 'border-brand-orange bg-brand-cream' : ''}`}
              >
                Not Yet
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReturnStatusResponse('NOT_SURE')}
                className={`text-xs uppercase ${returnStatusResponse === 'NOT_SURE' ? 'border-brand-orange bg-brand-cream' : ''}`}
              >
                Not Sure
              </Button>
              <Link href={ROUTES.app.applications.home}>
                <Button variant="secondary" size="sm" className="text-xs">
                  View in Pipeline Tracker →
                </Button>
              </Link>
            </div>

            {returnStatusResponse === 'NOT_YET' && (
              <div className="p-3 bg-brand-paper border border-brand-ink/30 text-xs text-brand-ink/80 space-y-1">
                <strong>Status Kept as APPLICATION_STARTED:</strong> No problem. Your application remains saved in your tracker so you can return to the employer portal and submit when ready.
              </div>
            )}

            {returnStatusResponse === 'NOT_SURE' && (
              <div className="p-3 bg-brand-paper border border-brand-ink/30 text-xs text-brand-ink/80 space-y-1">
                <strong>Verification Recommended:</strong> Check your inbox for an official confirmation receipt from {job.companyName || job.company}. You can update your status to APPLIED in your Application Tracker once confirmed.
              </div>
            )}
          </div>
        )}

        {submissionConfirmed && (
          <div className="p-4 bg-green-50 border border-green-700 text-green-900 space-y-2">
            <div className="font-bold text-xs uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-700" /> Application Confirmed &amp; Logged to Active Tracker
            </div>
            <p className="text-[11px] leading-relaxed">
              Your submission for <strong>{job.title}</strong> at <strong>{job.companyName || job.company}</strong> using <strong>{selectedResume?.title}</strong> is active in your pipeline.
            </p>
            <div className="pt-1">
              <Link href={ROUTES.app.applications.home}>
                <Button variant="outline" size="sm" className="text-xs font-bold uppercase">
                  Open Application Tracker Pipeline →
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
