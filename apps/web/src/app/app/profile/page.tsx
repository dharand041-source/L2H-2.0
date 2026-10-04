'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Target, Award, CheckCircle2 } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const { state, updateState } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  const [name, setName] = useState(state.user.name);
  const [headline, setHeadline] = useState(state.user.headline);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateState({
      user: {
        ...state.user,
        name,
        headline,
      }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Candidate Profile
        </h1>
        <p className="text-base text-brand-ink/80 mt-1">
          Candidate identity, authentication credentials, and primary career targets.
        </p>
      </div>

      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-brand-ink/20">
          <div className="w-16 h-16 rounded-full bg-brand-orange border border-brand-ink text-white font-display text-2xl flex items-center justify-center shrink-0">
            {name.charAt(0)}
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">{name}</h2>
            <div className="text-xs text-brand-ink/70 font-semibold">{state.user.email}</div>
            <div className="text-xs text-brand-orange font-bold mt-1">Target: {currentRole?.title}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-brand-cream border border-brand-ink text-xs font-bold text-brand-ink focus:outline-none"
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
              className="w-full p-3 bg-brand-cream border border-brand-ink text-xs font-bold text-brand-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
              Registered Email (Primary Identity)
            </label>
            <input
              type="email"
              disabled
              value={state.user.email}
              className="w-full p-3 bg-brand-cream border border-brand-ink/40 text-xs font-mono text-brand-ink/60 cursor-not-allowed"
            />
          </div>

          <div className="pt-4 border-t border-brand-ink/20 flex items-center justify-between">
            <Button variant="primary" size="md" onClick={handleSave}>
              Save Profile Changes
            </Button>
            {saved && (
              <span className="text-xs font-bold text-brand-orange flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Profile Updated!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
