'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, MessageSquare } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { EditorialNav } from '@/components/layout/editorial-nav';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink flex flex-col bg-grid-subtle">
      <EditorialNav />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="border-b-[1.5px] border-brand-ink pb-8 space-y-3">
            <span className="editorial-badge bg-brand-yellow text-brand-ink text-xs">
              Communication Channel
            </span>
            <h1 className="font-display-hero text-brand-ink tracking-tight">
              CONTACT &amp; <br />
              <span className="text-brand-orange">PARTNERSHIPS.</span>
            </h1>
            <p className="text-lg text-brand-ink/80 leading-relaxed font-medium">
              Inquire about academic integrations, institutional curriculum partnerships, or verified employer direct feed integrations.
            </p>
          </div>

          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial space-y-6">
            {submitted ? (
              <div className="p-6 bg-brand-cream border border-brand-orange text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-brand-orange mx-auto" />
                <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
                  Inquiry Dispatched
                </h3>
                <p className="text-xs text-brand-ink/80 max-w-md mx-auto">
                  Thank you. Our partnership &amp; trust team will respond within 1 business day.
                </p>
                <Link href={ROUTES.public.home}>
                  <Button variant="outline" size="sm" className="mt-2">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="w-full p-3 bg-brand-cream border border-brand-ink text-xs font-semibold text-brand-ink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@university.edu"
                    className="w-full p-3 bg-brand-cream border border-brand-ink text-xs font-semibold text-brand-ink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
                    Inquiry Type
                  </label>
                  <select className="w-full p-3 bg-brand-cream border border-brand-ink text-xs font-semibold text-brand-ink focus:outline-none">
                    <option>University / Academic Curriculum Integration</option>
                    <option>Employer Direct Job Feed Partnership</option>
                    <option>Candidate Assessment Calibration Inquiry</option>
                    <option>Press / Media Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your inquiry..."
                    className="w-full p-3 bg-brand-cream border border-brand-ink text-xs font-medium text-brand-ink focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <Button variant="primary" size="md" fullWidth type="submit">
                    Send Inquiry →
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-brand-cream border-t-[1.5px] border-brand-ink py-8 px-4 text-center text-xs font-semibold text-brand-ink/70">
        Learn-2-Hire 2.0 &bull; Institutional Inquiries
      </footer>
    </div>
  );
}
