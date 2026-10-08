'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Globe,
  Bell,
  Eye,
  Sliders,
  Sparkles,
  RefreshCw,
  LogOut,
  Download,
  AlertTriangle,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import {
  SettingsStore,
  PlatformSettings,
  DEFAULT_PLATFORM_SETTINGS
} from '@/lib/settings';

export default function SettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_PLATFORM_SETTINGS);
  const [activeTab, setActiveTab] = useState<'PRIVACY' | 'CAREER' | 'ASSESSMENT' | 'NOTIFICATIONS' | 'ACCOUNT'>('PRIVACY');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSettings(SettingsStore.getSettings());
  }, []);

  const handleToggle = (key: keyof PlatformSettings) => {
    const updated = SettingsStore.saveSettings({ [key]: !settings[key] });
    setSettings(updated);
    showSavedBadge();
  };

  const handleSelectChange = (key: keyof PlatformSettings, val: any) => {
    const updated = SettingsStore.saveSettings({ [key]: val });
    setSettings(updated);
    showSavedBadge();
  };

  const showSavedBadge = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const tabs = [
    { label: 'Privacy & Disclosures', value: 'PRIVACY' as const },
    { label: 'Career & Work Preferences', value: 'CAREER' as const },
    { label: 'Assessment & Anti-Repetition', value: 'ASSESSMENT' as const },
    { label: 'Notification Alerts', value: 'NOTIFICATIONS' as const },
    { label: 'Account & Security', value: 'ACCOUNT' as const },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="editorial-badge bg-brand-yellow text-brand-ink">
              System Control
            </span>
            <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
              Platform &amp; Privacy Preferences
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
            Platform Settings
          </h1>
          <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
            Configure employer inspection rights, localized job alerts, assessment integrity guards, and authentication controls.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-2.5 bg-brand-yellow border border-brand-ink text-xs font-bold text-brand-ink flex items-center gap-1.5 shadow-editorial-sm shrink-0">
            <CheckCircle2 className="w-4 h-4 text-brand-ink" /> Preference Saved
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-brand-ink/20">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-all shadow-editorial-sm ${
              activeTab === tab.value
                ? 'bg-brand-ink text-white border-brand-ink'
                : 'bg-brand-paper text-brand-ink border-brand-ink hover:bg-brand-orange hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Panels */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
        {/* 1. PRIVACY & EMPLOYER DISCLOSURE */}
        {activeTab === 'PRIVACY' && (
          <div className="space-y-6">
            <div className="border-b border-brand-ink/15 pb-3">
              <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
                Employer Transparency &amp; Inspection
              </h2>
              <p className="text-xs text-brand-ink/70 mt-0.5">
                Learn-2-Hire strictly prohibits unauthorized background scraping. You retain full control over which auditable credentials verified enterprise partners may review.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 p-3.5 bg-brand-cream border border-brand-ink/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowEmployerSkillReceipts}
                  onChange={() => handleToggle('allowEmployerSkillReceipts')}
                  className="mt-0.5 w-4 h-4 accent-brand-orange"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold uppercase text-brand-ink block">
                    Disclose Verified Skill Evidence Receipts
                  </span>
                  <p className="text-[11px] text-brand-ink/75">
                    Permits verified hiring managers to inspect cryptographic baseline test receipts and diagnostic scorecards.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-brand-cream border border-brand-ink/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowEmployerProjectScorecards}
                  onChange={() => handleToggle('allowEmployerProjectScorecards')}
                  className="mt-0.5 w-4 h-4 accent-brand-orange"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold uppercase text-brand-ink block">
                    Disclose Capstone Project Deliverables &amp; Code Rubrics
                  </span>
                  <p className="text-[11px] text-brand-ink/75">
                    Allows employers to view verified repository milestone submissions and automated test coverage percentages.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-brand-cream border border-brand-ink/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowEmployerResumeInspection}
                  onChange={() => handleToggle('allowEmployerResumeInspection')}
                  className="mt-0.5 w-4 h-4 accent-brand-orange"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold uppercase text-brand-ink block">
                    Allow Direct Resume Inspection on Matched Job Posts
                  </span>
                  <p className="text-[11px] text-brand-ink/75">
                    Enables verified partner recruiters to inspect your active primary resume document when you submit direct applications.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* 2. CAREER & WORK PREFERENCES */}
        {activeTab === 'CAREER' && (
          <div className="space-y-6">
            <div className="border-b border-brand-ink/15 pb-3">
              <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
                Career Goals &amp; Matching Preferences
              </h2>
              <p className="text-xs text-brand-ink/70 mt-0.5">
                Calibrates Opportunity Engine recommendation algorithms and alert filters.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-extrabold uppercase text-brand-ink/70 block mb-1">
                  Preferred Work Mode:
                </label>
                <select
                  value={settings.workModePreference}
                  onChange={(e) => handleSelectChange('workModePreference', e.target.value)}
                  className="w-full p-2.5 text-xs font-bold bg-brand-cream border border-brand-ink text-brand-ink focus:outline-none"
                >
                  <option value="ANY">Any Work Mode (Remote, Hybrid, On-site)</option>
                  <option value="REMOTE">Remote Only</option>
                  <option value="HYBRID">Hybrid (Office + Remote)</option>
                  <option value="ONSITE">On-Site Only</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase text-brand-ink/70 block mb-1">
                  Opportunity Type Focus:
                </label>
                <select
                  value={settings.employmentTypePreference}
                  onChange={(e) => handleSelectChange('employmentTypePreference', e.target.value)}
                  className="w-full p-2.5 text-xs font-bold bg-brand-cream border border-brand-ink text-brand-ink focus:outline-none"
                >
                  <option value="ANY">All Opportunities (Jobs, Internships, Startups)</option>
                  <option value="FULL_TIME">Full-Time Industry Roles</option>
                  <option value="INTERNSHIP">Internships &amp; Graduate Trainee</option>
                  <option value="STARTUP">Early-Stage Startup Founding Tracks</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase text-brand-ink/70 block mb-1">
                  Minimum Match Compatibility Threshold:
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={settings.matchThresholdPercent}
                    onChange={(e) => handleSelectChange('matchThresholdPercent', parseInt(e.target.value, 10))}
                    className="w-full accent-brand-orange"
                  />
                  <span className="font-display text-xl font-bold text-brand-ink shrink-0">
                    {settings.matchThresholdPercent}%
                  </span>
                </div>
                <p className="text-[11px] text-brand-ink/60 mt-1">
                  Only alert on verified listings with at least {settings.matchThresholdPercent}% core competency compatibility.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. ASSESSMENT & ANTI-REPETITION */}
        {activeTab === 'ASSESSMENT' && (
          <div className="space-y-6">
            <div className="border-b border-brand-ink/15 pb-3">
              <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
                Assessment Calibration &amp; Integrity Guards
              </h2>
              <p className="text-xs text-brand-ink/70 mt-0.5">
                Configure diagnostic difficulty transitions and anti-repetition engine behaviors.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 p-3.5 bg-brand-cream border border-brand-ink/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.antiRepetitionActive}
                  onChange={() => handleToggle('antiRepetitionActive')}
                  className="mt-0.5 w-4 h-4 accent-brand-orange"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold uppercase text-brand-ink block">
                    Strict Anti-Repetition Engine (SHA Normalized Hashes)
                  </span>
                  <p className="text-[11px] text-brand-ink/75">
                    Permanently tracks solved question fingerprints to prevent repeating previously answered problems.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-brand-cream border border-brand-ink/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.adaptiveDifficultyActive}
                  onChange={() => handleToggle('adaptiveDifficultyActive')}
                  className="mt-0.5 w-4 h-4 accent-brand-orange"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold uppercase text-brand-ink block">
                    Adaptive Diagnostic Scaling (Beginner &rarr; Professional)
                  </span>
                  <p className="text-[11px] text-brand-ink/75">
                    Dynamically steps question difficulty up or down according to consecutive question accuracy.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-brand-cream border border-brand-ink/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showAnswerExplanations}
                  onChange={() => handleToggle('showAnswerExplanations')}
                  className="mt-0.5 w-4 h-4 accent-brand-orange"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold uppercase text-brand-ink block">
                    Display In-Depth Concept Explanations Post-Submission
                  </span>
                  <p className="text-[11px] text-brand-ink/75">
                    Provides pedagogical explanations and distractor rationale immediately after submitting diagnostic turns.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* 4. NOTIFICATION ALERTS */}
        {activeTab === 'NOTIFICATIONS' && (
          <div className="space-y-6">
            <div className="border-b border-brand-ink/15 pb-3">
              <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
                Notification Feed Preferences
              </h2>
              <p className="text-xs text-brand-ink/70 mt-0.5">
                Control which operational events trigger items in your Notification Action Center.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3.5 bg-brand-cream border border-brand-ink/20 cursor-pointer">
                <div>
                  <span className="text-xs font-bold uppercase text-brand-ink block">
                    Verified Job &amp; Internship Match Alerts
                  </span>
                  <span className="text-[11px] text-brand-ink/70">
                    Receive alerts when new verified listings exceed your match threshold.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyJobMatches}
                  onChange={() => handleToggle('notifyJobMatches')}
                  className="w-4 h-4 accent-brand-orange"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-brand-cream border border-brand-ink/20 cursor-pointer">
                <div>
                  <span className="text-xs font-bold uppercase text-brand-ink block">
                    Roadmap Milestone Progress &amp; Curricula
                  </span>
                  <span className="text-[11px] text-brand-ink/70">
                    Alerts on freshly unlocked phases and verified learning resources.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyRoadmapMilestones}
                  onChange={() => handleToggle('notifyRoadmapMilestones')}
                  className="w-4 h-4 accent-brand-orange"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-brand-cream border border-brand-ink/20 cursor-pointer">
                <div>
                  <span className="text-xs font-bold uppercase text-brand-ink block">
                    Application Pipeline Status Updates
                  </span>
                  <span className="text-[11px] text-brand-ink/70">
                    Notifies upon interview scheduled, review outcome, or retraining recommendations.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyApplicationUpdates}
                  onChange={() => handleToggle('notifyApplicationUpdates')}
                  className="w-4 h-4 accent-brand-orange"
                />
              </label>
            </div>
          </div>
        )}

        {/* 5. ACCOUNT & SECURITY */}
        {activeTab === 'ACCOUNT' && (
          <div className="space-y-6">
            <div className="border-b border-brand-ink/15 pb-3">
              <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
                Security &amp; Account Identity
              </h2>
              <p className="text-xs text-brand-ink/70 mt-0.5">
                Canonical identity authenticated via Supabase session encryption.
              </p>
            </div>

            <div className="p-4 bg-brand-cream border border-brand-ink/30 space-y-3">
              <div className="text-xs font-semibold text-brand-ink">
                Identity Status: <strong className="text-green-700">Authenticated Session (Active)</strong>
              </div>
              <p className="text-[11px] text-brand-ink/70 leading-relaxed">
                All personal assessment records, private resume iterations, and application tracker items are protected by database Row-Level Security (RLS) bound strictly to your authenticated UID.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link href={ROUTES.app.profile}>
                <Button variant="outline" size="sm">
                  Edit Professional Profile →
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
