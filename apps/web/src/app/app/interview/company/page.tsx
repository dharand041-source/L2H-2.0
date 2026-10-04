'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, ArrowLeft, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CompanyInterviewPage() {
  const companies = [
    { company: 'Tata Consultancy Services', format: 'Digital & Ninja Technical Rounds', topics: 'DSA, Java/Node syntax, DBMS, System Foundations' },
    { company: 'Zoho Corporation', format: 'Advanced Developer Coding & System Design', topics: 'Algorithm optimization, Space complexity, Clean Code' },
    { company: 'Amazon Web Services', format: 'Behavioral & Leadership Principles (Bar Raiser)', topics: 'Customer Obsession, Ownership, Bias for Action, System Trade-offs' },
    { company: 'Infosys Limited', format: 'Specialist Programmer Technical Interview', topics: 'Microservices, Spring Boot/Node, Relational Databases' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.interview.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Interview Hub
        </Link>
        <span className="text-xs font-bold text-brand-rose uppercase">Reported Employer Patterns</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Company-Calibrated Interview Rounds
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Simulations modeled around authentic reported candidate interviews from premier global and enterprise employers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companies.map((c) => (
          <Card key={c.company} hoverable accentBorder="rose" className="space-y-3">
            <Badge variant="rose">{c.company}</Badge>
            <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
              {c.format}
            </h3>
            <p className="text-xs text-brand-ink/80 font-medium">
              Topics: {c.topics}
            </p>
            <Link href={ROUTES.app.interview.mock}>
              <Button variant="primary" size="sm">
                Launch Company Simulation →
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
