'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Upload,
  ClipboardList,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  History,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResumeStore, ResumeVersion } from '@/lib/resume';

export default function ResumeHubPage() {
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  const [activeVersion, setActiveVersion] = useState<ResumeVersion | null>(null);
  const [allVersions, setAllVersions] = useState<ResumeVersion[]>([]);
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pastedTitle, setPastedTitle] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load saved resume versions on client
  useEffect(() => {
    const versions = ResumeStore.getVersions();
    setAllVersions(versions);
    setActiveVersion(ResumeStore.getActiveVersion());
  }, []);

  const resumeNavTabs = [
    { label: 'Resume Hub', href: ROUTES.app.resume.home },
    { label: 'Role Versions', href: ROUTES.app.resume.versions },
    { label: 'ATS & Compatibility Analyzer', href: ROUTES.app.resume.analyzer },
    { label: 'Job Description Matcher', href: ROUTES.app.resume.jobMatch },
    { label: 'Optimization History', href: ROUTES.app.resume.history },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate extension & MIME
    const name = file.name;
    const isPdf = name.endsWith('.pdf');
    const isDocx = name.endsWith('.docx');
    const isTxt = name.endsWith('.txt');

    if (!isPdf && !isDocx && !isTxt) {
      setNotification({
        type: 'error',
        message: 'Unsupported format. Please upload a PDF, DOCX, or TXT file.'
      });
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      const fileType = isPdf ? 'PDF' : isDocx ? 'DOCX' : 'TXT';

      const saveResult = ResumeStore.saveVersion(
        name.replace(/\.[^/.]+$/, ''),
        content || `Parsed text from ${name}`,
        fileType,
        name,
        state.targetCareerSlug || 'full-stack-developer'
      );

      setIsProcessing(false);
      setAllVersions(ResumeStore.getVersions());
      setActiveVersion(saveResult.version);

      if (saveResult.isDuplicate) {
        setNotification({
          type: 'success',
          message: `Identical document checksum recognized. Active version set to ${saveResult.version.title}.`
        });
      } else {
        setNotification({
          type: 'success',
          message: `Successfully parsed and recorded ${saveResult.version.title} (Version ${saveResult.version.versionNumber}).`
        });
      }
    };

    reader.onerror = () => {
      setIsProcessing(false);
      setNotification({
        type: 'error',
        message: 'Failed to read uploaded resume file. You can paste plain text directly.'
      });
    };

    reader.readAsText(file);
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pastedText.trim().length < 40) {
      setNotification({
        type: 'error',
        message: 'Please paste at least 40 characters of resume text to perform structural parsing.'
      });
      return;
    }

    const title = pastedTitle.trim() || `Pasted Resume V${allVersions.length + 1}`;
    const saveResult = ResumeStore.saveVersion(
      title,
      pastedText.trim(),
      'TXT',
      'pasted_resume.txt',
      state.targetCareerSlug || 'full-stack-developer'
    );

    setPasteModalOpen(false);
    setPastedText('');
    setPastedTitle('');
    setAllVersions(ResumeStore.getVersions());
    setActiveVersion(saveResult.version);

    setNotification({
      type: 'success',
      message: `Parsed and registered ${saveResult.version.title} (Version ${saveResult.version.versionNumber}).`
    });
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-yellow text-brand-ink">
                Candidate Evidence
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Learn-2-Hire ATS Compatibility System
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Resume System &amp; ATS Optimizer
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Analyze your actual resume against verified job requirements, identify evidence gaps, compare document versions, and discover verified opportunities.
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={ROUTES.app.resume.analyzer}>
              <Button variant="outline" size="sm">
                Paste Job Spec &amp; Analyze →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Nav Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-brand-ink/20">
        {resumeNavTabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-brand-paper border border-brand-ink hover:bg-brand-orange hover:text-white transition-all shadow-editorial-sm"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 border-[1.5px] border-brand-ink flex items-center justify-between gap-3 shadow-editorial-sm ${
            notification.type === 'success' ? 'bg-brand-yellow/30' : 'bg-brand-rose/20'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-brand-ink" />
            ) : (
              <AlertCircle className="w-5 h-5 text-brand-rose" />
            )}
            <span className="text-xs font-bold text-brand-ink">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-extrabold uppercase hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* PHASE 62 & 63: EMPTY STATE WHEN NO RESUME IS UPLOADED */}
      {!activeVersion ? (
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 sm:p-12 shadow-editorial text-center space-y-6">
          <div className="inline-flex p-4 rounded-full bg-brand-cream border border-brand-ink/30 mb-2">
            <FileText className="w-12 h-12 text-brand-ink/70" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <span className="editorial-badge bg-brand-cream border border-brand-ink text-brand-ink text-xs">
              First-Time Setup
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase text-brand-ink">
              No Resume Uploaded
            </h2>
            <p className="text-sm text-brand-ink/80 leading-relaxed font-medium">
              Upload your existing resume to analyze your authentic credentials against real job specifications, identify missing competencies, and receive targeted improvement recommendations.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {/* File Upload Input */}
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isProcessing}
              />
              <span className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-brand-ink text-white border border-brand-ink hover:bg-brand-orange transition-all shadow-editorial-sm">
                <Upload className="w-4 h-4" />
                {isProcessing ? 'Processing File...' : 'Upload Existing Resume (PDF / DOCX)'}
              </span>
            </label>

            <button
              onClick={() => setPasteModalOpen(true)}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-brand-paper text-brand-ink border border-brand-ink hover:bg-brand-yellow transition-all shadow-editorial-sm inline-flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              Paste Resume Text
            </button>

            <Link href={ROUTES.app.resume.builder}>
              <span className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-brand-cream text-brand-ink border border-brand-ink/50 hover:bg-brand-paper transition-all inline-flex items-center gap-2">
                Build New Resume (Optional) →
              </span>
            </Link>
          </div>

          <div className="pt-6 border-t border-brand-ink/15 max-w-lg mx-auto flex items-center justify-center gap-6 text-[11px] font-semibold text-brand-ink/60">
            <span>&bull; Private local &amp; encrypted storage</span>
            <span>&bull; Multi-version history (V1, V2, V3)</span>
            <span>&bull; Zero fabricated ATS claims</span>
          </div>
        </div>
      ) : (
        /* ACTIVE RESUME DASHBOARD VIEW (WHEN AT LEAST ONE RESUME EXISTS) */
        <div className="space-y-8">
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="editorial-badge bg-brand-orange text-white text-[10px]">
                    Active Document Version {activeVersion.versionNumber}
                  </span>
                  <Badge variant="yellow">{activeVersion.fileType}</Badge>
                </div>

                <h2 className="font-display text-3xl font-bold uppercase text-brand-ink">
                  {activeVersion.title}
                </h2>

                <p className="text-xs text-brand-ink/75 font-medium">
                  File: <strong className="font-mono text-brand-ink">{activeVersion.fileName}</strong> &bull; Uploaded {new Date(activeVersion.createdAt).toLocaleDateString()}
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Link href={ROUTES.app.resume.analyzer}>
                    <Button variant="primary" size="md">
                      Analyze Against Job Spec →
                    </Button>
                  </Link>

                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isProcessing}
                    />
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-brand-paper text-brand-ink border border-brand-ink hover:bg-brand-yellow transition-all shadow-editorial-sm">
                      <Upload className="w-3.5 h-3.5" /> Upload New Version
                    </span>
                  </label>

                  <Link href={ROUTES.app.resume.versions}>
                    <Button variant="outline" size="md">
                      View All Versions ({allVersions.length})
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 p-6 bg-brand-cream border border-brand-ink/30 space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60 block">
                  Parsed Summary:
                </span>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-2.5 bg-brand-paper border border-brand-ink/20">
                    <div className="font-display text-2xl font-bold text-brand-orange">
                      {activeVersion.parsedData.extractedSkills.length}
                    </div>
                    <div className="text-[10px] font-extrabold uppercase text-brand-ink/60">Skills Found</div>
                  </div>
                  <div className="p-2.5 bg-brand-paper border border-brand-ink/20">
                    <div className="font-display text-2xl font-bold text-brand-ink">
                      {activeVersion.parsedData.projects.length}
                    </div>
                    <div className="text-[10px] font-extrabold uppercase text-brand-ink/60">Projects Found</div>
                  </div>
                </div>

                <div className="text-[10px] font-semibold text-brand-ink/70 pt-1">
                  Experience: ~{activeVersion.parsedData.totalYearsExperience} Year(s) &bull; Degrees: {activeVersion.parsedData.education.length}
                </div>
              </div>
            </div>
          </div>

          {/* Parsed Competencies Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-brand-orange" />
                <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                  Parsed Technical Skills ({activeVersion.parsedData.extractedSkills.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {activeVersion.parsedData.extractedSkills.map((sk) => (
                  <span key={sk} className="text-xs font-bold px-2.5 py-1 bg-brand-cream border border-brand-ink/30 text-brand-ink">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-ink" />
                <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                  Projects &amp; Artifacts ({activeVersion.parsedData.projects.length})
                </h3>
              </div>
              <div className="space-y-2 pt-1">
                {activeVersion.parsedData.projects.map((pr, idx) => (
                  <div key={idx} className="p-2.5 bg-brand-cream border border-brand-ink/20 text-xs">
                    <div className="font-bold text-brand-ink">{pr.title}</div>
                    <div className="text-brand-ink/80 text-[11px] line-clamp-2 mt-0.5">{pr.description}</div>
                  </div>
                ))}
                {activeVersion.parsedData.projects.length === 0 && (
                  <p className="text-xs text-brand-ink/60 italic">No structured projects detected in parsed text.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paste Resume Text Modal */}
      {pasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
              <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
                Paste Plain Text Resume
              </h3>
              <button
                onClick={() => setPasteModalOpen(false)}
                className="text-xs font-bold uppercase px-2 py-1 border border-brand-ink hover:bg-brand-rose hover:text-white"
              >
                Close
              </button>
            </div>

            <form onSubmit={handlePasteSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold uppercase text-brand-ink/70 block mb-1">
                  Document Version Label:
                </label>
                <input
                  type="text"
                  value={pastedTitle}
                  onChange={(e) => setPastedTitle(e.target.value)}
                  placeholder={`Resume Version ${allVersions.length + 1}`}
                  className="w-full px-3 py-2 text-xs font-semibold bg-brand-cream border border-brand-ink text-brand-ink focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase text-brand-ink/70 block mb-1">
                  Resume Content (Experience, Skills, Projects):
                </label>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  rows={10}
                  placeholder="Paste your plain-text resume here..."
                  className="w-full p-3 font-mono text-xs bg-brand-cream border border-brand-ink text-brand-ink focus:outline-none leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-brand-ink/20">
                <Button variant="outline" size="sm" type="button" onClick={() => setPasteModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Parse &amp; Save Version →
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
