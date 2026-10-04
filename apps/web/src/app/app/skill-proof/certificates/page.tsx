'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ArrowLeft, ExternalLink, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SkillProofCertificatesPage() {
  const certs = [
    {
      title: 'JavaScript Algorithms and Data Structures Certification',
      issuer: 'freeCodeCamp',
      issuedDate: 'September 2024',
      credentialId: 'FCC-JS-90142',
      url: 'https://www.freecodecamp.org/certification/'
    },
    {
      title: 'Relational Database Queries & Aggregate Foundations',
      issuer: 'SQLBolt Interactive',
      issuedDate: 'August 2024',
      credentialId: 'SQLB-REL-4412',
      url: 'https://sqlbolt.com/'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.skillProof.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Proof Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Open Certifications</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Verified Open Course Certifications
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Certificates issued by freeCodeCamp, CS50, NPTEL, and accredited open institutions.
        </p>
      </div>

      <div className="space-y-3">
        {certs.map((c) => (
          <div key={c.credentialId} className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="yellow">{c.issuer}</Badge>
                <span className="text-xs text-brand-ink/60">{c.issuedDate}</span>
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                {c.title}
              </h3>
              <div className="text-xs text-brand-ink/70">ID: {c.credentialId}</div>
            </div>

            <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1">
              Verify Credential <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
