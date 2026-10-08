'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Camera,
  Upload,
  Trash2,
  CheckCircle2,
  User,
  Target,
  Briefcase,
  GraduationCap,
  Layers,
  FileText,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Award,
  Sparkles,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResumeStore, ResumeVersion } from '@/lib/resume';

export default function CandidateProfilePage() {
  const { state, updateState, setTargetRole } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  const [name, setName] = useState(state.user.name);
  const [headline, setHeadline] = useState(state.user.headline);
  const [about, setAbout] = useState(
    'Software engineer focused on scalable web architectures, verifiable code quality, and hands-on system deliverable milestones.'
  );
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(state.user.avatarUrl);
  const [activeResume, setActiveResume] = useState<ResumeVersion | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if candidate state updates externally & fetch active real resume
  useEffect(() => {
    setName(state.user.name);
    setHeadline(state.user.headline);
    setAvatarUrl(state.user.avatarUrl);
    setActiveResume(ResumeStore.getActiveVersion());
  }, [state.user.name, state.user.headline, state.user.avatarUrl]);

  // Profile completion calculator (Phase 32)
  const calculateCompletion = () => {
    let score = 0;
    if (name && name.trim().length > 0) score += 15;
    if (avatarUrl) score += 10;
    if (headline && headline.trim().length > 0) score += 15;
    if (about && about.trim().length > 10) score += 10;
    if (state.targetCareerSlug) score += 15;
    if (activeResume) score += 20;
    if (state.skills.some((s) => s.currentLevel !== 'L0')) score += 15;
    return Math.min(100, score);
  };

  const completionPct = calculateCompletion();

  // Handle image upload and resize client-side
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setAvatarUrl(dataUrl);

          updateState({
            user: {
              ...state.user,
              avatarUrl: dataUrl,
            },
          });
          triggerSaveIndicator();
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(undefined);
    updateState({
      user: {
        ...state.user,
        avatarUrl: undefined,
      },
    });
    triggerSaveIndicator();
  };

  const triggerSaveIndicator = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    updateState({
      user: {
        ...state.user,
        name,
        headline,
        avatarUrl: avatarUrl || undefined,
      },
    });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .upsert(
            {
              id: user.id,
              full_name: name,
              headline: headline,
              bio: about,
              avatar_url: avatarUrl || null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );
      }
    } catch (err) {
      console.warn('Profile persistence warning:', err);
    }

    setIsSaving(false);
    triggerSaveIndicator();
  };

  const verifiedSkills = state.skills.filter((s) => s.currentLevel !== 'L0');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        aria-label="Upload profile image"
      />

      {/* Top Banner Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="editorial-badge bg-brand-orange text-white">
              Professional Identity
            </span>
            <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
              Career Passport &bull; Auditable Credential Summary
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
            Candidate Career Profile
          </h1>
          <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
            Single canonical record of your verified competencies, active target career, authentic resume versions, and employer visibility preferences.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="primary" size="md" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
          </Button>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-brand-yellow border border-brand-ink text-xs font-bold text-brand-ink flex items-center justify-between shadow-editorial-sm">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-ink" /> Profile updated and persisted successfully!
          </span>
          <span className="uppercase text-[10px] font-mono">Status: Synced</span>
        </div>
      )}

      {/* Hero Overview Grid */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Avatar and Identity */}
          <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer shrink-0"
              title="Click to upload profile photo"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name || 'User Profile'}
                  className="w-24 h-24 rounded-full object-cover border-2 border-brand-ink shadow-editorial-sm bg-brand-paper"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-brand-orange border-2 border-brand-ink text-white font-display text-4xl flex items-center justify-center shadow-editorial-sm">
                  {name ? name.charAt(0).toUpperCase() : 'C'}
                </div>
              )}

              <div className="absolute inset-0 rounded-full bg-brand-ink/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white backdrop-blur-[1px]">
                <Camera className="w-6 h-6 mb-0.5 text-brand-yellow" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Change</span>
              </div>
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="yellow">{currentRole?.title || 'Target Role'}</Badge>
                <span className="text-xs font-mono text-brand-ink/60">{state.user.email}</span>
              </div>
              <h2 className="font-display text-3xl font-bold uppercase text-brand-ink truncate">
                {name || 'Candidate Name'}
              </h2>
              <p className="text-xs font-bold text-brand-orange uppercase">
                {headline || 'Professional Headline'}
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-[11px] font-bold uppercase bg-brand-cream border border-brand-ink hover:bg-brand-paper"
                >
                  Change Photo
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-2.5 py-1 text-[11px] font-bold uppercase bg-brand-paper text-brand-rose border border-brand-ink hover:bg-brand-cream"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Completion Gauge */}
          <div className="lg:col-span-4 p-5 bg-brand-cream border border-brand-ink/30 space-y-3 text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60 block">
              Profile Completeness
            </span>
            <div className="font-display text-4xl font-bold text-brand-ink">
              {completionPct}%
            </div>
            <div className="w-full bg-brand-paper h-2 border border-brand-ink overflow-hidden">
              <div
                className="bg-brand-orange h-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <p className="text-[10px] text-brand-ink/70 font-medium">
              Readiness Status: <strong className="text-brand-ink">{state.assessmentScore !== undefined ? `${state.readinessScore}% Calibrated` : 'NOT ASSESSED'}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Profile Detail Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Details & Summary */}
        <div className="lg:col-span-8 space-y-6">
          {/* Editable Details Card */}
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
            <h3 className="font-display text-xl font-bold uppercase text-brand-ink border-b border-brand-ink/15 pb-2">
              Identity &amp; Professional Summary
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-brand-cream border border-brand-ink text-xs font-bold text-brand-ink focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
                Professional Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-2.5 bg-brand-cream border border-brand-ink text-xs font-bold text-brand-ink focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
                About Me (Career Objective &amp; Background)
              </label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
                className="w-full p-2.5 bg-brand-cream border border-brand-ink text-xs font-medium text-brand-ink focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Verified Skills Snapshot */}
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
            <div className="flex items-center justify-between border-b border-brand-ink/15 pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-orange" />
                <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                  Verified Skills Passport ({verifiedSkills.length})
                </h3>
              </div>
              <Link href={ROUTES.app.skills.analysis}>
                <span className="text-xs font-bold text-brand-orange uppercase hover:underline">
                  Skill Analyzer →
                </span>
              </Link>
            </div>

            {verifiedSkills.length === 0 ? (
              <div className="p-4 bg-brand-cream border border-brand-ink/20 text-center space-y-2">
                <p className="text-xs text-brand-ink/70 font-medium">
                  No verified skills calibrated yet. Complete your baseline assessment to earn skill receipts.
                </p>
                <Link href={ROUTES.app.assessments.baseline}>
                  <Button variant="outline" size="sm">
                    Start Baseline Assessment →
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {verifiedSkills.map((sk) => (
                  <span
                    key={sk.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-cream border border-brand-ink/30 text-xs font-bold text-brand-ink"
                  >
                    <span>{sk.name}</span>
                    <Badge variant="yellow" className="text-[10px] py-0 px-1.5">
                      {sk.currentLevel}
                    </Badge>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Documents & Preferences */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Resume Card */}
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
            <div className="flex items-center justify-between border-b border-brand-ink/15 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-orange" />
                <h4 className="font-display text-base font-bold uppercase text-brand-ink">
                  Active Resume
                </h4>
              </div>
              <Link href={ROUTES.app.resume.home}>
                <span className="text-[11px] font-bold uppercase text-brand-orange hover:underline">
                  Manage →
                </span>
              </Link>
            </div>

            {activeResume ? (
              <div className="p-3.5 bg-brand-cream border border-brand-ink/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-ink uppercase truncate">
                    {activeResume.title}
                  </span>
                  <Badge variant="yellow">V{activeResume.versionNumber}</Badge>
                </div>
                <div className="text-[10px] text-brand-ink/70 font-mono">
                  {activeResume.fileName} &bull; {new Date(activeResume.createdAt).toLocaleDateString()}
                </div>
                <div className="pt-1 flex gap-2">
                  <Link href={ROUTES.app.resume.analyzer} className="w-full">
                    <Button variant="outline" size="sm" fullWidth className="text-xs">
                      ATS Scan →
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-brand-cream border border-brand-ink/20 text-center space-y-2">
                <p className="text-xs text-brand-ink/70">No resume uploaded yet.</p>
                <Link href={ROUTES.app.resume.home}>
                  <Button variant="primary" size="sm" fullWidth className="text-xs">
                    Upload Resume →
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Preferences Overview */}
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-3">
            <div className="flex items-center justify-between border-b border-brand-ink/15 pb-2">
              <h4 className="font-display text-base font-bold uppercase text-brand-ink">
                Career Preferences
              </h4>
              <Link href={ROUTES.app.settings}>
                <span className="text-[11px] font-bold uppercase text-brand-orange hover:underline">
                  Settings →
                </span>
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-brand-ink/10">
                <span className="text-brand-ink/70">Target Role:</span>
                <strong className="text-brand-ink">{currentRole?.title || 'Selected'}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-ink/10">
                <span className="text-brand-ink/70">Work Mode:</span>
                <strong className="text-brand-ink">Remote / Hybrid Permitted</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-brand-ink/70">Location Focus:</span>
                <strong className="text-brand-ink">Tamil Nadu / India</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
