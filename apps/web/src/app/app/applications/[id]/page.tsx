'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  MapPin,
  Briefcase,
  TrendingUp,
  RefreshCw,
  Calendar,
  XCircle,
  Share2,
  Eye,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ApplicationStore,
  ApplicationRecord,
  ApplicationStatus,
  OutcomeSourceType,
  RejectionReasonCategory,
  WithdrawalReasonCategory,
  OfferDeclineReasonCategory,
} from '@/lib/applications';
import { ResumeStore } from '@/lib/resume/resume-store';

const REJECTION_CATEGORIES: { id: RejectionReasonCategory; label: string }[] = [
  { id: 'TECHNICAL_INTERVIEW', label: 'Technical Interview' },
  { id: 'SKILL_REQUIREMENT', label: 'Specific Skill Requirement' },
  { id: 'EXPERIENCE_REQUIREMENT', label: 'Years of Experience Requirement' },
  { id: 'EDUCATION_REQUIREMENT', label: 'Education / Degree Requirement' },
  { id: 'RESUME_NOT_SELECTED', label: 'Resume / ATS Screening Not Selected' },
  { id: 'ASSESSMENT_NOT_PASSED', label: 'Online Assessment / Code Signal' },
  { id: 'BEHAVIORAL_INTERVIEW', label: 'Behavioral / Culture Alignment' },
  { id: 'HR_INTERVIEW', label: 'HR / Managerial Round' },
  { id: 'ROLE_MISMATCH', label: 'Role Scope Mismatch' },
  { id: 'POSITION_FILLED', label: 'Position Filled by Other Candidate' },
  { id: 'HIRING_FREEZE', label: 'Hiring Freeze / Headcount Paused' },
  { id: 'LOCATION_REQUIREMENT', label: 'Location / Relocation Requirement' },
  { id: 'WORK_AUTHORIZATION', label: 'Work Authorization / Visa' },
  { id: 'SALARY_MISMATCH', label: 'Salary Expectation Mismatch' },
  { id: 'UNKNOWN', label: 'No Specific Category Disclosed' },
  { id: 'OTHER', label: 'Other Reason' },
];

const WITHDRAWAL_CATEGORIES: { id: WithdrawalReasonCategory; label: string }[] = [
  { id: 'ACCEPTED_ANOTHER_OFFER', label: 'Accepted another offer' },
  { id: 'FOUND_ANOTHER_OPPORTUNITY', label: 'Found another opportunity' },
  { id: 'ROLE_MISMATCH', label: 'Role no longer matches career goal' },
  { id: 'SALARY_NOT_SUITABLE', label: 'Salary not suitable' },
  { id: 'LOCATION_NOT_SUITABLE', label: 'Location not suitable' },
  { id: 'WORK_MODE_NOT_SUITABLE', label: 'Work mode not suitable' },
  { id: 'PERSONAL_REASON', label: 'Personal / family reason' },
  { id: 'CONTINUING_EDUCATION', label: 'Continuing education / degree' },
  { id: 'MISTAKE_SUBMISSION', label: 'Application submitted by mistake' },
  { id: 'NO_LONGER_INTERESTED', label: 'No longer interested in company' },
  { id: 'OTHER', label: 'Other reason' },
];

const DECLINE_CATEGORIES: { id: OfferDeclineReasonCategory; label: string }[] = [
  { id: 'ANOTHER_OFFER', label: 'Accepted a competing offer' },
  { id: 'SALARY', label: 'Compensation / benefits below expectation' },
  { id: 'LOCATION', label: 'Location / commute constraints' },
  { id: 'WORK_MODE', label: 'In-office vs remote work mode preference' },
  { id: 'ROLE_MISMATCH', label: 'Role responsibilities differed from expectation' },
  { id: 'CAREER_DIRECTION', label: 'Pursuing different career track' },
  { id: 'PERSONAL_REASON', label: 'Personal reasons' },
  { id: 'OTHER', label: 'Other reason' },
];

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { state, updateApplicationStatus } = useCandidateState();

  // Find targeted application
  const application: ApplicationRecord | null = useMemo(() => {
    const fromState = state.applications.find((a) => a.id === id);
    if (fromState) return fromState;
    return ApplicationStore.getApplicationById(id);
  }, [state.applications, id]);

  // Modals & form state
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ApplicationStatus>('SCREENING');
  const [rejectionSource, setRejectionSource] = useState<OutcomeSourceType>('EMPLOYER_EMAIL');
  const [rejectionCategory, setRejectionCategory] = useState<RejectionReasonCategory>('TECHNICAL_INTERVIEW');
  const [rejectionReasonText, setRejectionReasonText] = useState('');
  const [hasNoRejectionReason, setHasNoRejectionReason] = useState(false);

  const [withdrawalCategory, setWithdrawalCategory] = useState<WithdrawalReasonCategory>('ACCEPTED_ANOTHER_OFFER');
  const [withdrawalNotes, setWithdrawalNotes] = useState('');

  const [offerDetails, setOfferDetails] = useState('');
  const [offerJoiningDate, setOfferJoiningDate] = useState('');
  const [offerDeclineReason, setOfferDeclineReason] = useState<OfferDeclineReasonCategory>('ANOTHER_OFFER');

  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');

  const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Resume used for this application
  const resumeUsed = useMemo(() => {
    if (!application?.resumeVersionId) return null;
    const versions = ResumeStore.getVersions();
    return versions.find((v) => v.id === application.resumeVersionId) || null;
  }, [application?.resumeVersionId]);

  // L2H Observations on candidate gaps
  const l2hObservations = useMemo(() => {
    return ApplicationStore.synthesizeObservations(
      state.applications.length > 0 ? state.applications : application ? [application] : [],
      state.skills
    );
  }, [state.applications, state.skills, application]);

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href={ROUTES.app.applications.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Application Hub
        </Link>
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 text-center shadow-editorial space-y-3">
          <AlertCircle className="w-8 h-8 text-brand-orange mx-auto" />
          <h2 className="font-display text-2xl uppercase tracking-tight text-brand-ink font-bold">
            Application Record Not Found
          </h2>
          <p className="text-xs text-brand-ink/70">
            No application record matches ID <code>{id}</code>. Return to the Application Tracker pipeline.
          </p>
          <div className="pt-2">
            <Link href={ROUTES.app.applications.home}>
              <Button variant="primary" size="sm">
                View Active Tracker →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Next Best Action logic
  const getNextBestAction = () => {
    switch (application.status) {
      case 'SAVED':
      case 'DRAFT':
        return {
          title: 'Prepare & Submit Application',
          desc: 'Select your verified resume version and proceed to official employer portal.',
          actionLabel: 'Launch Direct Apply',
          actionUrl: ROUTES.app.opportunities.apply(application.opportunityId),
        };
      case 'APPLICATION_STARTED':
        return {
          title: 'Confirm Employer Submission',
          desc: 'Return to mark APPLIED once submitted on external employer portal.',
          actionLabel: 'Update Status to Applied',
          actionModal: 'APPLIED',
        };
      case 'APPLIED':
        return {
          title: 'Follow-up or Prepare Screening',
          desc: 'Monitor employer communications and prepare for behavioral and technical screens.',
          actionLabel: 'Schedule Follow-Up Reminder',
          openFollowUp: true,
        };
      case 'SCREENING':
      case 'ASSESSMENT':
        return {
          title: 'Review Role Core Competencies',
          desc: 'Calibrate your technical responses against verified role expectations.',
          actionLabel: 'Open Skill Analyzer',
          actionUrl: ROUTES.app.skills.analysis,
        };
      case 'INTERVIEW':
        return {
          title: 'Simulate Technical Interview',
          desc: 'Practice system design, algorithms, and behavioral STAR stories.',
          actionLabel: 'Launch Interview Simulator',
          actionUrl: ROUTES.app.interview.home,
        };
      case 'OFFER':
        return {
          title: 'Review Compensation & Respond',
          desc: 'Review offer details, deadline, and confirm your decision.',
          actionLabel: 'Record Acceptance / Decline',
          actionModal: 'OFFER_ACCEPTED',
        };
      case 'REJECTED':
        return {
          title: 'Closed-Loop Improvement Retraining',
          desc: 'Convert rejection feedback into verified skill upgrades to match future openings.',
          actionLabel: 'Launch Retraining Plan',
          actionUrl: ROUTES.app.improve.home,
        };
      default:
        return {
          title: 'Explore More Verified Listings',
          desc: 'Continue expanding your active pipeline with high-compatibility vacancies.',
          actionLabel: 'Find Openings',
          actionUrl: ROUTES.app.opportunities.jobs,
        };
    }
  };

  const nextAction = getNextBestAction();

  const handleOpenStatusModal = (status: ApplicationStatus) => {
    setTargetStatus(status);
    setIsStatusModalOpen(true);
  };

  const handleExecuteStatusUpdate = async () => {
    setIsSubmitting(true);

    let effectiveReasonText = rejectionReasonText.trim();
    if (hasNoRejectionReason) {
      effectiveReasonText = 'Employer did not provide a reason.';
    }

    await updateApplicationStatus({
      applicationId: application.id,
      newStatus: targetStatus,
      reasonCategory:
        targetStatus === 'REJECTED'
          ? rejectionCategory
          : targetStatus === 'WITHDRAWN'
          ? withdrawalCategory
          : targetStatus === 'OFFER_DECLINED'
          ? offerDeclineReason
          : undefined,
      reasonText:
        targetStatus === 'REJECTED'
          ? effectiveReasonText
          : targetStatus === 'WITHDRAWN'
          ? withdrawalNotes
          : undefined,
      sourceType:
        targetStatus === 'REJECTED'
          ? rejectionSource
          : targetStatus === 'WITHDRAWN'
          ? 'CANDIDATE_REPORTED'
          : targetStatus === 'OFFER_DECLINED'
          ? 'CANDIDATE_REPORTED'
          : 'CANDIDATE_REPORTED',
      sourceConfidence: 'CONFIRMED',
      offerDetails: targetStatus === 'OFFER' ? offerDetails : undefined,
      joiningDate: targetStatus === 'OFFER_ACCEPTED' ? offerJoiningDate : undefined,
    });

    setIsSubmitting(false);
    setIsStatusModalOpen(false);
    setActionSuccessMsg(`Application status updated to ${targetStatus}!`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleSaveFollowUp = async () => {
    if (!followUpDate) return;
    setIsSubmitting(true);
    ApplicationStore.setFollowUp(application.id, followUpDate, followUpNotes);
    await updateApplicationStatus({
      applicationId: application.id,
      newStatus: application.status,
      followUpDate,
      followUpNotes,
    });
    setIsSubmitting(false);
    setIsFollowUpModalOpen(false);
    setActionSuccessMsg('Follow-up reminder recorded successfully!');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.applications.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Applications Pipeline
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-brand-ink/60">
            Audit ID: <strong className="text-brand-ink">{application.id}</strong>
          </span>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3 bg-green-50 border border-green-700 text-green-900 text-xs font-bold flex items-center gap-2 shadow-editorial-sm">
          <CheckCircle2 className="w-4 h-4 text-green-700" /> {actionSuccessMsg}
        </div>
      )}

      {/* Main Application Header Card */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-brand-ink/15 pb-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="editorial-badge bg-brand-cream text-brand-ink text-xs font-bold uppercase">
                {application.company}
              </span>
              <Badge variant={application.status === 'OFFER' ? 'yellow' : application.status === 'REJECTED' ? 'rose' : 'default'}>
                {application.status === 'APPLICATION_STARTED' ? 'APPLICATION STARTED' : application.status}
              </Badge>
              {application.source && (
                <span className="text-[11px] font-mono text-brand-ink/60">
                  Source: {application.source}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-brand-ink font-bold">
              {application.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-brand-ink/75 pt-1">
              {application.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-ink/60" /> {application.location}
                </span>
              )}
              {application.workMode && (
                <span>&bull; {application.workMode}</span>
              )}
              {application.appliedDate && (
                <span>&bull; Applied: <strong>{application.appliedDate}</strong></span>
              )}
              <span>&bull; Last Status Update: <strong>{new Date(application.lastStatusChangeAt || application.updatedAt).toLocaleDateString()}</strong></span>
            </div>
          </div>

          {/* Status Transition Action Buttons */}
          <div className="shrink-0 flex flex-wrap gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenStatusModal('SCREENING')}
              className="text-xs font-bold uppercase"
            >
              Update Status
            </Button>
            {application.status !== 'WITHDRAWN' && application.status !== 'REJECTED' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenStatusModal('WITHDRAWN')}
                className="text-xs uppercase"
              >
                Withdraw
              </Button>
            )}
          </div>
        </div>

        {/* 4-Box Key Signals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Resume Used (Permanent historical snapshot) */}
          <div className="p-4 bg-brand-cream border border-brand-ink/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Resume Used</span>
              <FileText className="w-4 h-4 text-brand-orange" />
            </div>
            <div className="font-display text-lg font-bold uppercase text-brand-ink truncate">
              {application.resumeTitle || (resumeUsed ? resumeUsed.title : 'Historical Snapshot')}
            </div>
            <p className="text-[10px] text-brand-ink/65 leading-tight">
              Permanently locked to this submission version.
            </p>
            {resumeUsed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsResumePreviewOpen(true)}
                className="w-full text-[11px] py-1 mt-1"
              >
                <Eye className="w-3 h-3 mr-1 inline" /> View Resume
              </Button>
            )}
          </div>

          {/* 2. L2H Compatibility */}
          <div className="p-4 bg-brand-cream border border-brand-ink/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">L2H Compatibility</span>
              <TrendingUp className="w-4 h-4 text-brand-orange" />
            </div>
            <div className="font-display text-2xl font-bold text-brand-orange">
              {application.compatibilityScore !== undefined ? `${application.compatibilityScore}%` : 'N/A'}
            </div>
            <p className="text-[10px] text-brand-ink/70 leading-tight">
              Calculated estimate based on stated vacancy criteria. Not an employer ATS score.
            </p>
          </div>

          {/* 3. Verified Eligibility */}
          <div className="p-4 bg-brand-cream border border-brand-ink/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Eligibility</span>
              <ShieldCheck className="w-4 h-4 text-brand-ink/60" />
            </div>
            <div className={`font-display text-lg font-bold uppercase ${application.eligibilityStatus === 'ELIGIBLE' ? 'text-green-700' : 'text-brand-ink'}`}>
              {application.eligibilityStatus ? application.eligibilityStatus.replace(/_/g, ' ') : 'NOT EVALUATED'}
            </div>
            <p className="text-[10px] text-brand-ink/65 leading-tight">
              Baseline verification against role experience &amp; skill requirements.
            </p>
          </div>

          {/* 4. Employer Application Destination */}
          <div className="p-4 bg-brand-cream border border-brand-ink/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Destination</span>
              <ExternalLink className="w-4 h-4 text-brand-ink/60" />
            </div>
            <div className="font-display text-sm font-bold uppercase text-brand-ink truncate">
              {application.company} Portal
            </div>
            <p className="text-[10px] text-brand-ink/65 leading-tight">
              Direct authoritative careers destination.
            </p>
            {application.applyUrl ? (
              <a
                href={application.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block pt-1"
              >
                <Button variant="outline" size="sm" className="w-full text-[11px] py-1">
                  Open Destination <ExternalLink className="w-3 h-3 ml-1 inline" />
                </Button>
              </a>
            ) : (
              <span className="text-[11px] text-brand-ink/50 italic block pt-1">URL not registered</span>
            )}
          </div>
        </div>

        {/* Outcome Feedback Block (Strict Distinction: Employer vs Candidate-Reported) */}
        {application.status === 'REJECTED' && (
          <div className="p-5 bg-brand-paper border-[1.5px] border-brand-rose space-y-3">
            <div className="flex items-center justify-between border-b border-brand-rose/30 pb-2">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-brand-rose" />
                <h3 className="font-display text-xl font-bold uppercase text-brand-rose">
                  Application Rejected
                </h3>
              </div>
              <span className="text-xs font-mono text-brand-ink/70 uppercase">
                Source: <strong>{application.outcomeSourceType || 'CANDIDATE_REPORTED'}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-ink/60 block">Stated Reason:</span>
                <p className="font-medium text-brand-ink mt-0.5 text-sm">
                  {application.outcomeReason || 'Employer did not provide a reason.'}
                </p>
              </div>

              {application.outcomeReasonCategory && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-brand-ink/60 block">Category:</span>
                  <p className="font-bold uppercase text-brand-ink mt-0.5">
                    {application.outcomeReasonCategory.replace(/_/g, ' ')}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-brand-rose/20">
              <p className="text-[11px] text-brand-ink/80 italic">
                {application.outcomeSourceType === 'EMPLOYER_CONFIRMED' || application.outcomeSourceType === 'EMPLOYER_EMAIL'
                  ? 'Reason confirmed by authentic employer communication.'
                  : 'Candidate-reported status update. L2H does not fabricate employer rationale.'}
              </p>
              <Link href={ROUTES.app.improve.home}>
                <Button variant="accent" size="sm" className="text-xs">
                  <RefreshCw className="w-3.5 h-3.5 mr-1 inline" /> Launch Retraining Loop →
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Withdrawal Details Block */}
        {application.status === 'WITHDRAWN' && (
          <div className="p-5 bg-brand-cream border-[1.5px] border-brand-ink space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold uppercase text-brand-ink">
                Candidate Withdrawal Record
              </h3>
              <span className="text-[10px] font-mono text-brand-ink/60 uppercase">
                Source: CANDIDATE_REPORTED
              </span>
            </div>
            <p className="text-brand-ink">
              Reason: <strong>{application.withdrawalReasonCategory?.replace(/_/g, ' ') || 'Personal reason'}</strong>
            </p>
            {application.withdrawalReasonText && (
              <p className="text-brand-ink/80">
                Notes: {application.withdrawalReasonText}
              </p>
            )}
          </div>
        )}

        {/* Offer Details Block */}
        {(application.status === 'OFFER' || application.status === 'OFFER_ACCEPTED') && (
          <div className="p-5 bg-brand-cream border-[1.5px] border-green-700 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold uppercase text-green-800">
                Offer Received! 🎉
              </h3>
              <Badge variant="yellow">{application.status}</Badge>
            </div>
            {application.offerDetails && (
              <p className="text-brand-ink">
                Details: <strong>{application.offerDetails}</strong>
              </p>
            )}
            {application.joiningDate && (
              <p className="text-brand-ink">
                Target Joining Date: <strong>{application.joiningDate}</strong>
              </p>
            )}
          </div>
        )}

        {/* L2H Improvement Observation Panel (Clearly separated from employer reason!) */}
        {l2hObservations.length > 0 && (
          <div className="p-5 bg-brand-cream border border-brand-ink/30 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-brand-orange" />
              <h3 className="font-display text-base font-bold uppercase text-brand-ink">
                L2H Competency Observation
              </h3>
            </div>
            <p className="text-xs text-brand-ink/80 leading-relaxed">
              {l2hObservations[0].observationNote}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-brand-ink/15">
              <span className="text-[11px] font-bold text-brand-orange uppercase">
                Notice: This is an L2H pattern analysis, not the employer&apos;s stated rejection cause.
              </span>
              <Link href={l2hObservations[0].actionUrl}>
                <Button variant="outline" size="sm" className="text-xs">
                  {l2hObservations[0].suggestedAction} →
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Next Best Action Card */}
        <div className="p-5 bg-brand-paper border-[1.5px] border-brand-ink shadow-editorial-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="editorial-badge bg-brand-orange text-white text-[10px]">
              Recommended Next Action
            </span>
            <h4 className="font-display text-xl font-bold uppercase text-brand-ink">
              {nextAction.title}
            </h4>
            <p className="text-xs text-brand-ink/75 max-w-xl">
              {nextAction.desc}
            </p>
          </div>

          <div className="shrink-0">
            {nextAction.actionUrl ? (
              <Link href={nextAction.actionUrl}>
                <Button variant="primary" size="sm" className="text-xs uppercase font-bold">
                  {nextAction.actionLabel} →
                </Button>
              </Link>
            ) : nextAction.openFollowUp ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsFollowUpModalOpen(true)}
                className="text-xs uppercase font-bold"
              >
                {nextAction.actionLabel}
              </Button>
            ) : nextAction.actionModal ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenStatusModal(nextAction.actionModal as ApplicationStatus)}
                className="text-xs uppercase font-bold"
              >
                {nextAction.actionLabel}
              </Button>
            ) : null}
          </div>
        </div>

        {/* Application Timeline Audit Trail */}
        <div className="space-y-4 pt-4 border-t border-brand-ink/15">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-ink" />
              <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
                Application Timeline
              </h3>
            </div>
            <span className="text-xs font-mono text-brand-ink/60">
              {application.events.length} Historical Events Logged
            </span>
          </div>

          <div className="space-y-3">
            {application.events.length === 0 ? (
              <div className="p-4 bg-brand-cream border border-brand-ink/20 text-xs text-brand-ink/60 italic text-center">
                No intermediate events logged for this application yet.
              </div>
            ) : (
              application.events.map((ev, idx) => (
                <div
                  key={ev.id || idx}
                  className="p-4 bg-brand-cream border border-brand-ink/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase text-brand-ink">
                        {ev.eventType.replace(/_/g, ' ')}
                      </span>
                      {ev.newStatus && (
                        <Badge variant="default" className="text-[10px] py-0">
                          {ev.newStatus}
                        </Badge>
                      )}
                      <span className="text-[10px] font-mono text-brand-ink/60">
                        {new Date(ev.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-brand-ink/80 leading-relaxed font-medium">
                      {ev.description}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-[10px] font-mono text-brand-ink/60 uppercase block">
                      Source: {ev.sourceType}
                    </span>
                    <span className="text-[10px] font-mono text-brand-orange uppercase block">
                      Confidence: {ev.sourceConfidence}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: STATUS UPDATE DIALOG */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-ink/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-paper border-[2px] border-brand-ink p-6 max-w-lg w-full shadow-editorial space-y-5">
            <div className="flex items-center justify-between border-b border-brand-ink/20 pb-3">
              <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                Update Application Status
              </h3>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="text-brand-ink/60 hover:text-brand-ink font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-brand-ink/70 mb-1">
                  Target Status:
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as ApplicationStatus)}
                  className="w-full p-2.5 bg-brand-cream border border-brand-ink font-bold uppercase text-xs text-brand-ink focus:outline-none"
                >
                  <option value="APPLIED">APPLIED (Confirmed)</option>
                  <option value="SCREENING">SCREENING</option>
                  <option value="ASSESSMENT">ASSESSMENT</option>
                  <option value="INTERVIEW">INTERVIEW</option>
                  <option value="OFFER">OFFER</option>
                  <option value="OFFER_ACCEPTED">OFFER ACCEPTED</option>
                  <option value="OFFER_DECLINED">OFFER DECLINED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="WITHDRAWN">WITHDRAWN</option>
                  <option value="CLOSED">CLOSED (Posting ended)</option>
                  <option value="EXPIRED">EXPIRED (Deadline passed)</option>
                </select>
              </div>

              {/* Conditional Form: REJECTED */}
              {targetStatus === 'REJECTED' && (
                <div className="p-3 bg-brand-cream border border-brand-rose space-y-3">
                  <div>
                    <label className="block font-bold uppercase text-brand-ink/70 mb-1">
                      Who provided this outcome? (Source)
                    </label>
                    <select
                      value={rejectionSource}
                      onChange={(e) => setRejectionSource(e.target.value as OutcomeSourceType)}
                      className="w-full p-2 bg-brand-paper border border-brand-ink text-xs focus:outline-none"
                    >
                      <option value="EMPLOYER_EMAIL">Employer Email</option>
                      <option value="EMPLOYER_PORTAL">Employer Portal Status</option>
                      <option value="EMPLOYER_CONFIRMED">Employer Communication / Phone</option>
                      <option value="CANDIDATE_REPORTED">Candidate Reported (No employer note)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-brand-ink/70 mb-1">
                      Rejection Reason Category:
                    </label>
                    <select
                      value={rejectionCategory}
                      onChange={(e) => setRejectionCategory(e.target.value as RejectionReasonCategory)}
                      className="w-full p-2 bg-brand-paper border border-brand-ink text-xs focus:outline-none"
                    >
                      {REJECTION_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="noReason"
                        checked={hasNoRejectionReason}
                        onChange={(e) => setHasNoRejectionReason(e.target.checked)}
                      />
                      <label htmlFor="noReason" className="font-bold text-brand-ink/80">
                        Employer did not provide a reason
                      </label>
                    </div>

                    {!hasNoRejectionReason && (
                      <div>
                        <label className="block font-bold uppercase text-brand-ink/70 mb-1">
                          Employer Feedback Text:
                        </label>
                        <input
                          type="text"
                          value={rejectionReasonText}
                          onChange={(e) => setRejectionReasonText(e.target.value)}
                          placeholder="e.g. Technical interview unsuccessful, or lacking AWS production scale"
                          className="w-full p-2 bg-brand-paper border border-brand-ink text-xs focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Conditional Form: WITHDRAWN */}
              {targetStatus === 'WITHDRAWN' && (
                <div className="p-3 bg-brand-cream border border-brand-ink space-y-3">
                  <div>
                    <label className="block font-bold uppercase text-brand-ink/70 mb-1">
                      Why are you withdrawing?
                    </label>
                    <select
                      value={withdrawalCategory}
                      onChange={(e) => setWithdrawalCategory(e.target.value as WithdrawalReasonCategory)}
                      className="w-full p-2 bg-brand-paper border border-brand-ink text-xs focus:outline-none"
                    >
                      {WITHDRAWAL_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-brand-ink/70 mb-1">
                      Additional Details (Optional):
                    </label>
                    <input
                      type="text"
                      value={withdrawalNotes}
                      onChange={(e) => setWithdrawalNotes(e.target.value)}
                      placeholder="Optional candidate private notes..."
                      className="w-full p-2 bg-brand-paper border border-brand-ink text-xs focus:outline-none"
                    >
                    </input>
                  </div>
                </div>
              )}

              {/* Conditional Form: OFFER */}
              {targetStatus === 'OFFER' && (
                <div className="p-3 bg-brand-cream border border-brand-ink space-y-3">
                  <div>
                    <label className="block font-bold uppercase text-brand-ink/70 mb-1">
                      Offer Details / Compensation (Optional):
                    </label>
                    <input
                      type="text"
                      value={offerDetails}
                      onChange={(e) => setOfferDetails(e.target.value)}
                      placeholder="e.g. 14 LPA Base + Benefits, Chennai hybrid"
                      className="w-full p-2 bg-brand-paper border border-brand-ink text-xs focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Conditional Form: OFFER_ACCEPTED */}
              {targetStatus === 'OFFER_ACCEPTED' && (
                <div className="p-3 bg-brand-cream border border-brand-ink space-y-3">
                  <div>
                    <label className="block font-bold uppercase text-brand-ink/70 mb-1">
                      Target Joining Date (Optional):
                    </label>
                    <input
                      type="date"
                      value={offerJoiningDate}
                      onChange={(e) => setOfferJoiningDate(e.target.value)}
                      className="w-full p-2 bg-brand-paper border border-brand-ink text-xs focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Conditional Form: OFFER_DECLINED */}
              {targetStatus === 'OFFER_DECLINED' && (
                <div className="p-3 bg-brand-cream border border-brand-ink space-y-3">
                  <div>
                    <label className="block font-bold uppercase text-brand-ink/70 mb-1">
                      Why did you decline this offer?
                    </label>
                    <select
                      value={offerDeclineReason}
                      onChange={(e) => setOfferDeclineReason(e.target.value as OfferDeclineReasonCategory)}
                      className="w-full p-2 bg-brand-paper border border-brand-ink text-xs focus:outline-none"
                    >
                      {DECLINE_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-ink/20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsStatusModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExecuteStatusUpdate}
                disabled={isSubmitting}
                className="font-bold uppercase"
              >
                {isSubmitting ? 'Saving...' : 'Confirm Status Update'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FOLLOW-UP REMINDER DIALOG */}
      {isFollowUpModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-ink/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-paper border-[2px] border-brand-ink p-6 max-w-md w-full shadow-editorial space-y-4">
            <div className="flex items-center justify-between border-b border-brand-ink/20 pb-3">
              <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                Schedule Follow-Up Reminder
              </h3>
              <button
                onClick={() => setIsFollowUpModalOpen(false)}
                className="text-brand-ink/60 hover:text-brand-ink font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-brand-ink/70 mb-1">
                  Follow-up Date:
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full p-2 bg-brand-cream border border-brand-ink text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-brand-ink/70 mb-1">
                  Follow-up Notes:
                </label>
                <textarea
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="e.g. Check in with HR recruiter via email regarding initial screening result."
                  rows={3}
                  className="w-full p-2 bg-brand-cream border border-brand-ink text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-ink/20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFollowUpModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveFollowUp}
                disabled={!followUpDate || isSubmitting}
                className="font-bold uppercase"
              >
                {isSubmitting ? 'Saving...' : 'Set Reminder'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: RESUME DOCUMENT VIEWER */}
      {isResumePreviewOpen && resumeUsed && (
        <div className="fixed inset-0 z-50 bg-brand-ink/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-paper border-[2px] border-brand-ink p-6 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-editorial space-y-4">
            <div className="flex items-center justify-between border-b border-brand-ink/20 pb-3">
              <div>
                <span className="editorial-badge bg-brand-cream text-brand-ink text-[10px]">
                  Version {resumeUsed.versionNumber}
                </span>
                <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                  {resumeUsed.title}
                </h3>
              </div>
              <button
                onClick={() => setIsResumePreviewOpen(false)}
                className="text-brand-ink/60 hover:text-brand-ink font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-brand-cream border border-brand-ink/20 text-xs">
              <div className="border-b border-brand-ink/15 pb-2">
                <span className="text-[10px] font-bold uppercase text-brand-ink/60 block">Document Details:</span>
                <p className="font-bold text-brand-ink">Filename: {resumeUsed.fileName}</p>
                <p className="text-[11px] text-brand-ink/70">Uploaded: {new Date(resumeUsed.createdAt).toLocaleString()}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-brand-ink/60 block mb-1">Extracted Summary:</span>
                <p className="font-medium text-brand-ink leading-relaxed">
                  {resumeUsed.parsedData?.summary || 'Standard candidate resume profile.'}
                </p>
              </div>

              {resumeUsed.parsedData?.extractedSkills && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-brand-ink/60 block mb-1">Identified Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeUsed.parsedData.extractedSkills.map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 bg-brand-paper border border-brand-ink/30 font-mono text-[10px]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold uppercase text-brand-ink/60 block mb-1">Raw Content Preview:</span>
                <pre className="p-3 bg-brand-paper border border-brand-ink/30 text-[11px] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto text-brand-ink/80">
                  {resumeUsed.rawText?.slice(0, 1500) || 'No text extracted.'}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-brand-ink/20">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsResumePreviewOpen(false)}
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
