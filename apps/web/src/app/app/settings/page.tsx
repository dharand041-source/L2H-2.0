'use client';

import React from 'react';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Platform Settings
        </h1>
        <p className="text-base text-brand-ink/80 mt-1">
          Candidate privacy preferences, verified talent disclosures, and notification digests.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
          <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
            Privacy &amp; Zero-Scraping Preferences
          </h2>
          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-orange" />
              <span className="font-medium text-brand-ink">
                Allow verified employers to inspect my verified skill receipts and project rubric scorecards
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-orange" />
              <span className="font-medium text-brand-ink">
                Enable anti-repetition engine to record question attempts and prevent duplicate assessment items
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
