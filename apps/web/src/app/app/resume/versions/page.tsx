'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Upload,
  Layers,
  History,
  Calendar,
  Sparkles
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResumeStore, ResumeVersion } from '@/lib/resume';

export default function ResumeVersionsPage() {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);

  useEffect(() => {
    const list = ResumeStore.getVersions();
    setVersions(list);
    const active = ResumeStore.getActiveVersion();
    if (active) setActiveVersionId(active.id);
  }, []);

  const handleSetActive = (id: string) => {
    ResumeStore.setActiveVersion(id);
    setActiveVersionId(id);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.resume.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Resume Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Multi-Version Document Vault</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="editorial-badge bg-brand-yellow text-brand-ink">
            Phase 22 &amp; 35
          </span>
          <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
            Zero Overwrite Integrity &bull; Version Progression
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Resume Version History
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Every uploaded document or iteration is preserved as an independent version. Compare document enhancements across revisions without losing historical evidence.
        </p>
      </div>

      {versions.length === 0 ? (
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial text-center space-y-4">
          <FileText className="w-10 h-10 text-brand-ink/60 mx-auto" />
          <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
            No Resume Versions Stored
          </h2>
          <p className="text-xs text-brand-ink/75 max-w-md mx-auto">
            Upload your initial resume document in the Resume Hub to begin tracking revision progression.
          </p>
          <Link href={ROUTES.app.resume.home}>
            <Button variant="primary" size="md">
              Upload Resume V1 →
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {versions.map((v) => {
            const isActive = v.id === activeVersionId;
            return (
              <div
                key={v.id}
                className={`bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                  isActive ? 'border-brand-orange bg-brand-cream/30' : ''
                }`}
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="editorial-badge bg-brand-paper text-brand-ink text-[10px]">
                      Version {v.versionNumber}
                    </span>
                    <Badge variant={isActive ? 'yellow' : 'default'}>
                      {isActive ? 'ACTIVE PRIMARY' : 'STORED REVISION'}
                    </Badge>
                    <span className="text-xs text-brand-ink/60 font-mono">
                      {v.fileType} &bull; {new Date(v.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
                    {v.title}
                  </h3>

                  <div className="text-xs text-brand-ink/75 font-medium flex flex-wrap gap-4">
                    <span>Skills: <strong>{v.parsedData.extractedSkills.length}</strong></span>
                    <span>Projects: <strong>{v.parsedData.projects.length}</strong></span>
                    <span>Experience: <strong>~{v.parsedData.totalYearsExperience} yrs</strong></span>
                    <span className="font-mono text-[10px] text-brand-ink/60">Checksum: {v.checksum.slice(0, 8)}...</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {!isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetActive(v.id)}
                    >
                      Set As Active Primary
                    </Button>
                  )}
                  <Link href={ROUTES.app.resume.analyzer}>
                    <Button variant="primary" size="sm">
                      Scan ATS →
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
