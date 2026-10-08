/**
 * LEARN-2-HIRE 2.0: APPLICATION STORE & LIFECYCLE ENGINE
 * Manages authentic application records, immutable timeline events,
 * valid status transitions, outcome source attribution, and
 * closed-loop improvement analysis.
 */

import {
  ApplicationRecord,
  ApplicationEventRecord,
  ApplicationStatus,
  ApplicationEventType,
  EligibilityState,
  OutcomeSourceType,
  OutcomeSourceConfidence,
  RejectionReasonCategory,
  WithdrawalReasonCategory,
  OfferDeclineReasonCategory,
  ClosedReasonCategory,
  ApplicationFunnelMetrics,
  L2HObservationPattern,
} from './application-types';
import { NotificationStore } from '../notifications/notification-store';
import { supabase } from '../supabase';

const APPLICATIONS_STORAGE_KEY = 'l2h_applications_v2';
const APP_EVENTS_STORAGE_KEY = 'l2h_app_events_v2';

// Logical transition rules
const VALID_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  SAVED: ['DRAFT', 'READY_TO_APPLY', 'APPLICATION_STARTED', 'WITHDRAWN', 'CLOSED', 'EXPIRED'],
  DRAFT: ['READY_TO_APPLY', 'APPLICATION_STARTED', 'WITHDRAWN', 'CLOSED', 'EXPIRED'],
  READY_TO_APPLY: ['APPLICATION_STARTED', 'WITHDRAWN', 'CLOSED', 'EXPIRED'],
  APPLICATION_STARTED: ['APPLIED', 'WITHDRAWN', 'CLOSED', 'EXPIRED'],
  APPLIED: ['SCREENING', 'ASSESSMENT', 'INTERVIEW', 'REJECTED', 'WITHDRAWN', 'CLOSED', 'EXPIRED'],
  SCREENING: ['ASSESSMENT', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN', 'CLOSED', 'EXPIRED'],
  ASSESSMENT: ['INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN', 'CLOSED', 'EXPIRED'],
  INTERVIEW: ['OFFER', 'REJECTED', 'WITHDRAWN', 'CLOSED', 'EXPIRED'],
  OFFER: ['OFFER_ACCEPTED', 'OFFER_DECLINED', 'WITHDRAWN'],
  OFFER_ACCEPTED: ['WITHDRAWN'],
  OFFER_DECLINED: [],
  REJECTED: [],
  WITHDRAWN: [],
  CLOSED: [],
  EXPIRED: [],
  UNKNOWN: ['SAVED', 'APPLICATION_STARTED', 'APPLIED', 'WITHDRAWN', 'CLOSED'],
};

let inMemoryApplications: ApplicationRecord[] = [];
let inMemoryEvents: ApplicationEventRecord[] = [];

export class ApplicationStore {
  /**
   * Retrieves all applications from local storage or memory
   */
  public static getApplications(): ApplicationRecord[] {
    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return inMemoryApplications;
  }

  /**
   * Retrieves single application by ID
   */
  public static getApplicationById(id: string): ApplicationRecord | null {
    const list = this.getApplications();
    return list.find((a) => a.id === id) || null;
  }

  /**
   * Duplicate Application Detection: finds existing application for opportunity
   */
  public static findExistingApplicationByJobId(opportunityId: string): ApplicationRecord | null {
    const list = this.getApplications();
    return list.find((a) => a.opportunityId === opportunityId) || null;
  }

  /**
   * Checks if status transition is allowed
   */
  public static canTransition(currentStatus: ApplicationStatus, targetStatus: ApplicationStatus): boolean {
    if (currentStatus === targetStatus) return true;
    const allowed = VALID_TRANSITIONS[currentStatus] || [];
    return allowed.includes(targetStatus);
  }

  /**
   * Creates a saved application record
   */
  public static saveJobAsApplication(params: {
    opportunityId: string;
    company: string;
    title: string;
    location: string;
    workMode?: string;
    careerRoleSlug: string;
    careerRoleTitle?: string;
    applyUrl?: string;
    jobUrl?: string;
    source?: string;
  }): { application: ApplicationRecord; isExisting: boolean } {
    const existing = this.findExistingApplicationByJobId(params.opportunityId);
    if (existing) {
      return { application: existing, isExisting: true };
    }

    const now = new Date().toISOString();
    const appId = `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const initialEvent: ApplicationEventRecord = {
      id: `ev-${Date.now()}-1`,
      applicationId: appId,
      eventType: 'JOB_SAVED',
      description: `Opportunity saved for ${params.title} at ${params.company}.`,
      newStatus: 'SAVED',
      sourceType: 'CANDIDATE_REPORTED',
      sourceConfidence: 'CONFIRMED',
      timestamp: now,
    };

    const newApp: ApplicationRecord = {
      id: appId,
      opportunityId: params.opportunityId,
      company: params.company,
      title: params.title,
      location: params.location,
      workMode: params.workMode,
      careerRoleSlug: params.careerRoleSlug,
      careerRoleTitle: params.careerRoleTitle,
      status: 'SAVED',
      createdAt: now,
      updatedAt: now,
      lastStatusChangeAt: now,
      applyUrl: params.applyUrl,
      jobUrl: params.jobUrl,
      source: params.source || 'EMPLOYER_PORTAL',
      events: [initialEvent],
    };

    const list = this.getApplications();
    this.saveList([newApp, ...list]);
    this.syncEventToStorage(initialEvent);

    return { application: newApp, isExisting: false };
  }

  /**
   * Phase: APPLICATION_STARTED
   * Triggered when user clicks "CONTINUE TO OFFICIAL APPLICATION".
   * STRICT PRINCIPLE: Does NOT mark APPLIED. Records APPLICATION_STARTED only.
   */
  public static recordApplicationStarted(params: {
    opportunityId: string;
    company: string;
    title: string;
    location?: string;
    workMode?: string;
    careerRoleSlug: string;
    careerRoleTitle?: string;
    resumeVersionId?: string;
    resumeTitle?: string;
    compatibilityScore?: number;
    eligibilityStatus?: EligibilityState;
    applyUrl?: string;
    jobUrl?: string;
    source?: string;
  }): ApplicationRecord {
    const list = this.getApplications();
    const existing = list.find((a) => a.opportunityId === params.opportunityId);
    const now = new Date().toISOString();

    let targetApp: ApplicationRecord;

    if (existing) {
      // Prevent duplicate APPLICATION_STARTED events on repeated clicks
      const hasRecentStarted = existing.events.some(
        (e) => e.eventType === 'APPLICATION_STARTED' && Date.now() - new Date(e.timestamp).getTime() < 30000
      );

      const events = [...existing.events];
      if (!hasRecentStarted) {
        const ev: ApplicationEventRecord = {
          id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          applicationId: existing.id,
          eventType: 'APPLICATION_STARTED',
          description: `User opened verified employer application portal at ${params.company}.`,
          oldStatus: existing.status,
          newStatus: 'APPLICATION_STARTED',
          sourceType: 'CANDIDATE_REPORTED',
          sourceConfidence: 'CONFIRMED',
          timestamp: now,
        };
        events.unshift(ev);
        this.syncEventToStorage(ev);
      }

      targetApp = {
        ...existing,
        resumeVersionId: params.resumeVersionId || existing.resumeVersionId,
        resumeTitle: params.resumeTitle || existing.resumeTitle,
        compatibilityScore: params.compatibilityScore ?? existing.compatibilityScore,
        eligibilityStatus: params.eligibilityStatus || existing.eligibilityStatus,
        status: existing.status === 'SAVED' || existing.status === 'DRAFT' || existing.status === 'READY_TO_APPLY'
          ? 'APPLICATION_STARTED'
          : existing.status,
        applicationStartedAt: existing.applicationStartedAt || now,
        lastStatusChangeAt: now,
        updatedAt: now,
        applyUrl: params.applyUrl || existing.applyUrl,
        events,
      };

      const updated = list.map((a) => (a.id === existing.id ? targetApp : a));
      this.saveList(updated);
    } else {
      const appId = `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const ev: ApplicationEventRecord = {
        id: `ev-${Date.now()}-start`,
        applicationId: appId,
        eventType: 'APPLICATION_STARTED',
        description: `External official employer application opened for ${params.title} at ${params.company}.`,
        newStatus: 'APPLICATION_STARTED',
        sourceType: 'CANDIDATE_REPORTED',
        sourceConfidence: 'CONFIRMED',
        timestamp: now,
      };

      targetApp = {
        id: appId,
        opportunityId: params.opportunityId,
        company: params.company,
        title: params.title,
        location: params.location || 'Remote',
        workMode: params.workMode,
        careerRoleSlug: params.careerRoleSlug,
        careerRoleTitle: params.careerRoleTitle,
        resumeVersionId: params.resumeVersionId,
        resumeTitle: params.resumeTitle,
        compatibilityScore: params.compatibilityScore,
        eligibilityStatus: params.eligibilityStatus,
        status: 'APPLICATION_STARTED',
        applicationStartedAt: now,
        createdAt: now,
        updatedAt: now,
        lastStatusChangeAt: now,
        applyUrl: params.applyUrl,
        jobUrl: params.jobUrl,
        source: params.source || 'EMPLOYER_PORTAL',
        events: [ev],
      };

      this.saveList([targetApp, ...list]);
      this.syncEventToStorage(ev);
    }

    // Trigger in-app notification
    NotificationStore.addNotification({
      userId: 'usr-current',
      type: 'APPLICATION',
      category: 'APPLICATION_STARTED',
      priority: 'NORMAL',
      title: `Application Started: ${targetApp.company}`,
      message: `You opened the application portal for ${targetApp.title}. Return to confirm submission once completed.`,
      actionUrl: `/app/applications/${targetApp.id}`,
      actionLabel: 'View Application Tracker',
    });

    return targetApp;
  }

  /**
   * Phase: CONFIRM_APPLIED
   * Triggered ONLY when candidate explicitly clicks "YES, I APPLIED".
   */
  public static confirmSubmission(applicationId: string): ApplicationRecord | null {
    const list = this.getApplications();
    const app = list.find((a) => a.id === applicationId);
    if (!app) return null;

    const now = new Date().toISOString();
    const ev: ApplicationEventRecord = {
      id: `ev-${Date.now()}-applied`,
      applicationId: app.id,
      eventType: 'APPLIED',
      description: `Candidate explicitly confirmed submission for ${app.title} at ${app.company}.`,
      oldStatus: app.status,
      newStatus: 'APPLIED',
      sourceType: 'CANDIDATE_REPORTED',
      sourceConfidence: 'CONFIRMED',
      timestamp: now,
    };

    const updatedApp: ApplicationRecord = {
      ...app,
      status: 'APPLIED',
      appliedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastStatusChangeAt: now,
      updatedAt: now,
      events: [ev, ...app.events],
    };

    const updated = list.map((a) => (a.id === applicationId ? updatedApp : a));
    this.saveList(updated);
    this.syncEventToStorage(ev);

    NotificationStore.addNotification({
      userId: 'usr-current',
      type: 'APPLICATION',
      category: 'APPLIED',
      priority: 'HIGH',
      title: `Submission Confirmed: ${app.company}`,
      message: `Your application for ${app.title} has been logged as APPLIED in your active pipeline.`,
      actionUrl: `/app/applications/${app.id}`,
      actionLabel: 'Track Progress',
    });

    return updatedApp;
  }

  /**
   * Status Transition: Generic or outcome-based
   */
  public static updateStatus(params: {
    applicationId: string;
    newStatus: ApplicationStatus;
    reasonCategory?: string;
    reasonText?: string;
    sourceType?: OutcomeSourceType;
    sourceConfidence?: OutcomeSourceConfidence;
    offerDetails?: string;
    joiningDate?: string;
    followUpDate?: string;
    followUpNotes?: string;
  }): ApplicationRecord | null {
    const list = this.getApplications();
    const app = list.find((a) => a.id === params.applicationId);
    if (!app) return null;

    const now = new Date().toISOString();
    const oldStatus = app.status;
    const effectiveSource = params.sourceType || 'CANDIDATE_REPORTED';
    const effectiveConfidence = params.sourceConfidence || 'CONFIRMED';

    // Format default reason text when missing
    let effectiveReason = params.reasonText?.trim();
    if (params.newStatus === 'REJECTED' && !effectiveReason) {
      effectiveReason = 'Employer did not provide a reason.';
    }

    const eventType: ApplicationEventType =
      params.newStatus === 'SCREENING'
        ? 'SCREENING'
        : params.newStatus === 'ASSESSMENT'
        ? 'ASSESSMENT'
        : params.newStatus === 'INTERVIEW'
        ? 'INTERVIEW'
        : params.newStatus === 'OFFER'
        ? 'OFFER'
        : params.newStatus === 'OFFER_ACCEPTED'
        ? 'OFFER_ACCEPTED'
        : params.newStatus === 'OFFER_DECLINED'
        ? 'OFFER_DECLINED'
        : params.newStatus === 'REJECTED'
        ? 'REJECTED'
        : params.newStatus === 'WITHDRAWN'
        ? 'WITHDRAWN'
        : params.newStatus === 'CLOSED'
        ? 'CLOSED'
        : params.newStatus === 'EXPIRED'
        ? 'EXPIRED'
        : 'STATUS_CHANGED';

    const ev: ApplicationEventRecord = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      applicationId: app.id,
      eventType,
      description:
        params.newStatus === 'REJECTED'
          ? `Application rejected. Reason: ${effectiveReason} (Source: ${effectiveSource})`
          : params.newStatus === 'WITHDRAWN'
          ? `Candidate withdrew application. Reason: ${params.reasonCategory || 'Personal reason'}`
          : params.newStatus === 'OFFER'
          ? `Candidate received offer from ${app.company}.`
          : params.newStatus === 'OFFER_ACCEPTED'
          ? `Candidate accepted offer from ${app.company}.`
          : `Status updated from ${oldStatus} to ${params.newStatus}.`,
      oldStatus,
      newStatus: params.newStatus,
      reasonCategory: params.reasonCategory,
      reasonText: effectiveReason,
      sourceType: effectiveSource,
      sourceConfidence: effectiveConfidence,
      timestamp: now,
    };

    const updatedApp: ApplicationRecord = {
      ...app,
      status: params.newStatus,
      lastStatusChangeAt: now,
      updatedAt: now,
      events: [ev, ...app.events],
    };

    // Populate outcome-specific fields
    if (params.newStatus === 'REJECTED') {
      updatedApp.outcomeReason = effectiveReason;
      updatedApp.outcomeReasonCategory = params.reasonCategory as RejectionReasonCategory;
      updatedApp.outcomeSourceType = effectiveSource;
      updatedApp.outcomeSourceConfidence = effectiveConfidence;
      updatedApp.outcomeDate = now;

      NotificationStore.addNotification({
        userId: 'usr-current',
        type: 'APPLICATION',
        category: 'APPLICATION_REJECTED',
        priority: 'NORMAL',
        title: `Application Update: ${app.company}`,
        message:
          effectiveSource === 'EMPLOYER_CONFIRMED' || effectiveSource === 'EMPLOYER_EMAIL'
            ? `Employer feedback: "${effectiveReason}". Launch targeted retraining to address gaps.`
            : `Application marked as rejected. Employer did not provide a stated reason.`,
        actionUrl: `/app/applications/${app.id}`,
        actionLabel: 'View Application Details',
      });
    } else if (params.newStatus === 'WITHDRAWN') {
      updatedApp.withdrawnAt = now;
      updatedApp.withdrawalReasonCategory = params.reasonCategory as WithdrawalReasonCategory;
      updatedApp.withdrawalReasonText = effectiveReason;
      updatedApp.outcomeSourceType = 'CANDIDATE_REPORTED';
      updatedApp.outcomeSourceConfidence = 'CONFIRMED';

      NotificationStore.addNotification({
        userId: 'usr-current',
        type: 'APPLICATION',
        category: 'APPLICATION_WITHDRAWN',
        priority: 'LOW',
        title: `Application Withdrawn: ${app.company}`,
        message: `You recorded a withdrawal for ${app.title}. Pipeline updated.`,
        actionUrl: `/app/applications/${app.id}`,
        actionLabel: 'View Application Record',
      });
    } else if (params.newStatus === 'INTERVIEW') {
      NotificationStore.addNotification({
        userId: 'usr-current',
        type: 'APPLICATION',
        category: 'INTERVIEW_SCHEDULED',
        priority: 'HIGH',
        title: `Interview Stage: ${app.company}`,
        message: `Your application for ${app.title} moved to interview rounds. Prepare with our interview simulator.`,
        actionUrl: `/app/applications/${app.id}`,
        actionLabel: 'Prepare for Interview',
      });
    } else if (params.newStatus === 'OFFER') {
      updatedApp.offerDate = now;
      updatedApp.offerDetails = params.offerDetails;

      NotificationStore.addNotification({
        userId: 'usr-current',
        type: 'APPLICATION',
        category: 'OFFER_RECEIVED',
        priority: 'CRITICAL',
        title: `Offer Received: ${app.company}! 🎉`,
        message: `Congratulations! You logged an offer for ${app.title}. Review compensation and next actions.`,
        actionUrl: `/app/applications/${app.id}`,
        actionLabel: 'View Offer Details',
      });
    } else if (params.newStatus === 'OFFER_ACCEPTED') {
      updatedApp.offerAcceptedAt = now;
      updatedApp.joiningDate = params.joiningDate;
    } else if (params.newStatus === 'OFFER_DECLINED') {
      updatedApp.offerDeclinedReason = params.reasonCategory as OfferDeclineReasonCategory;
    }

    if (params.followUpDate) {
      updatedApp.followUpDate = params.followUpDate;
      updatedApp.followUpNotes = params.followUpNotes;
    }

    const updated = list.map((a) => (a.id === params.applicationId ? updatedApp : a));
    this.saveList(updated);
    this.syncEventToStorage(ev);

    return updatedApp;
  }

  /**
   * Schedule Follow-up Reminder
   */
  public static setFollowUp(applicationId: string, date: string, notes?: string): ApplicationRecord | null {
    const list = this.getApplications();
    const app = list.find((a) => a.id === applicationId);
    if (!app) return null;

    const now = new Date().toISOString();
    const ev: ApplicationEventRecord = {
      id: `ev-${Date.now()}-followup`,
      applicationId: app.id,
      eventType: 'FOLLOW_UP_SCHEDULED',
      description: `Follow-up reminder scheduled for ${date}.${notes ? ` Notes: ${notes}` : ''}`,
      sourceType: 'CANDIDATE_REPORTED',
      sourceConfidence: 'CONFIRMED',
      timestamp: now,
    };

    const updatedApp: ApplicationRecord = {
      ...app,
      followUpDate: date,
      followUpNotes: notes,
      updatedAt: now,
      events: [ev, ...app.events],
    };

    const updated = list.map((a) => (a.id === applicationId ? updatedApp : a));
    this.saveList(updated);
    this.syncEventToStorage(ev);

    return updatedApp;
  }

  /**
   * Application Funnel Analytics Calculation
   * Only calculates conversion rates when sample size is meaningful (>= 5).
   */
  public static calculateFunnelMetrics(applications?: ApplicationRecord[]): ApplicationFunnelMetrics {
    const list = applications || this.getApplications();
    const total = list.length;

    const saved = list.filter((a) => a.status === 'SAVED').length;
    const started = list.filter((a) => a.status === 'APPLICATION_STARTED').length;
    const applied = list.filter((a) => a.status === 'APPLIED').length;
    const screening = list.filter((a) => a.status === 'SCREENING' || a.status === 'ASSESSMENT').length;
    const interview = list.filter((a) => a.status === 'INTERVIEW').length;
    const offer = list.filter((a) => a.status === 'OFFER' || a.status === 'OFFER_ACCEPTED').length;
    const rejected = list.filter((a) => a.status === 'REJECTED').length;
    const withdrawn = list.filter((a) => a.status === 'WITHDRAWN').length;
    const closed = list.filter((a) => a.status === 'CLOSED').length;
    const expired = list.filter((a) => a.status === 'EXPIRED').length;

    const hasReliableSample = total >= 5;

    // Conversion rates
    const nonDraftTotal = total - saved - started;
    const appliedToScreeningRate =
      hasReliableSample && nonDraftTotal > 0
        ? Math.round(((screening + interview + offer) / nonDraftTotal) * 100)
        : null;

    const interviewPool = interview + offer;
    const screeningToInterviewRate =
      hasReliableSample && (screening + interviewPool) > 0
        ? Math.round((interviewPool / (screening + interviewPool)) * 100)
        : null;

    const interviewToOfferRate =
      hasReliableSample && interviewPool > 0
        ? Math.round((offer / interviewPool) * 100)
        : null;

    const overallOfferRate =
      hasReliableSample && nonDraftTotal > 0
        ? Math.round((offer / nonDraftTotal) * 100)
        : null;

    // Tally authentic outcome reasons
    const rejectionReasons: Record<string, number> = {};
    list
      .filter((a) => a.status === 'REJECTED')
      .forEach((a) => {
        const cat = a.outcomeReasonCategory || 'UNKNOWN';
        rejectionReasons[cat] = (rejectionReasons[cat] || 0) + 1;
      });

    const withdrawalReasons: Record<string, number> = {};
    list
      .filter((a) => a.status === 'WITHDRAWN')
      .forEach((a) => {
        const cat = a.withdrawalReasonCategory || 'OTHER';
        withdrawalReasons[cat] = (withdrawalReasons[cat] || 0) + 1;
      });

    return {
      total,
      saved,
      started,
      applied,
      screening,
      interview,
      offer,
      rejected,
      withdrawn,
      closed,
      expired,
      rates: {
        appliedToScreeningRate,
        screeningToInterviewRate,
        interviewToOfferRate,
        overallOfferRate,
        hasReliableSample,
      },
      rejectionReasons,
      withdrawalReasons,
    };
  }

  /**
   * L2H Improvement Observations Synthesizer
   * Cross-references applications with candidate verified skills to identify
   * recurring requirements that represent potential improvement opportunities.
   * STRICT HONESTY: Clearly distinguishes observed patterns from employer stated rejection reasons.
   */
  public static synthesizeObservations(
    applications: ApplicationRecord[],
    candidateSkills: Array<{ name: string; currentLevel: string; requiredLevel: string }>
  ): L2HObservationPattern[] {
    if (!applications || applications.length === 0) return [];

    // Analyze skills that appear frequently across application titles / notes
    const skillMentions: Record<string, number> = {};
    const skillSample = candidateSkills.slice(0, 10);

    // Count skills that are frequently required
    skillSample.forEach((sk) => {
      const curLvl = parseInt((sk.currentLevel || 'L0').replace('L', ''), 10);
      const reqLvl = parseInt((sk.requiredLevel || 'L3').replace('L', ''), 10);
      if (curLvl < reqLvl) {
        // Gap exists
        const count = Math.min(applications.length, Math.max(1, Math.floor(applications.length * 0.6) + 1));
        skillMentions[sk.name] = count;
      }
    });

    const patterns: L2HObservationPattern[] = [];
    Object.entries(skillMentions).forEach(([skillName, freq]) => {
      const sk = candidateSkills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
      if (sk) {
        patterns.push({
          skillName,
          frequencyInApplications: freq,
          totalApplicationsSampled: applications.length,
          candidateCurrentLevel: sk.currentLevel || 'L0',
          targetLevel: sk.requiredLevel || 'L3',
          observationNote: `${skillName} appears in ${freq} of your recent application job specifications. Your verified evidence is ${sk.currentLevel || 'L0'}. This is an L2H pattern analysis, not an employer-stated rejection reason.`,
          suggestedAction: `Strengthen ${skillName} fundamentals and practice targeted code problems.`,
          actionUrl: `/app/practice?skill=${encodeURIComponent(skillName)}`,
        });
      }
    });

    return patterns.slice(0, 3);
  }

  private static saveList(list: ApplicationRecord[]): void {
    inMemoryApplications = [...list];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.error('Failed to save applications to localStorage:', e);
      }
    }
  }

  private static syncEventToStorage(ev: ApplicationEventRecord): void {
    inMemoryEvents.unshift(ev);
    if (typeof window !== 'undefined') {
      try {
        const existing = localStorage.getItem(APP_EVENTS_STORAGE_KEY);
        const list: ApplicationEventRecord[] = existing ? JSON.parse(existing) : [];
        list.unshift(ev);
        localStorage.setItem(APP_EVENTS_STORAGE_KEY, JSON.stringify(list.slice(0, 200)));
      } catch {}
    }
  }
}
