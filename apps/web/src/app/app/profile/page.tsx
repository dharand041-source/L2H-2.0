'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Upload, Trash2, CheckCircle2, User } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { state, updateState } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  const [name, setName] = useState(state.user.name);
  const [headline, setHeadline] = useState(state.user.headline);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(state.user.avatarUrl);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if candidate state updates externally
  useEffect(() => {
    setName(state.user.name);
    setHeadline(state.user.headline);
    setAvatarUrl(state.user.avatarUrl);
  }, [state.user.name, state.user.headline, state.user.avatarUrl]);

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
        // Resize to maximum 256x256 for optimal performance and crisp display
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

          // Immediately persist to candidate state
          updateState({
            user: {
              ...state.user,
              avatarUrl: dataUrl,
            },
          });
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset input so user can re-select same file if needed
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
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSave = async () => {
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
              avatar_url: avatarUrl || null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );
      }
    } catch (err) {
      console.warn('Profile persistence error:', err);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        aria-label="Upload profile image"
      />

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Candidate Profile
        </h1>
        <p className="text-base text-brand-ink/80 mt-1">
          Candidate identity, authentication credentials, and primary career targets.
        </p>
      </div>

      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
        {/* Profile Avatar Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-brand-ink/20">
          <div className="flex items-center gap-5">
            {/* Interactive Avatar with Click-to-Upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer shrink-0"
              title="Click to upload profile photo"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name || 'User Profile'}
                  className="w-20 h-20 rounded-full object-cover border-2 border-brand-ink shadow-editorial-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-brand-orange border-2 border-brand-ink text-white font-display text-3xl flex items-center justify-center shadow-editorial-sm">
                  {name ? name.charAt(0) : 'U'}
                </div>
              )}

              {/* Camera Hover Overlay */}
              <div className="absolute inset-0 rounded-full bg-brand-ink/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white backdrop-blur-[1px]">
                <Camera className="w-6 h-6 mb-0.5 text-brand-yellow" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Change</span>
              </div>
            </div>

            {/* Profile Identity Details */}
            <div>
              <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
                {name || 'Candidate'}
              </h2>
              <div className="text-xs text-brand-ink/70 font-semibold">{state.user.email}</div>
              <div className="text-xs text-brand-orange font-bold mt-1">
                Target: {currentRole?.title || state.targetCareerSlug}
              </div>
            </div>
          </div>

          {/* Quick Photo Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-cream hover:bg-brand-yellow/20 border border-brand-ink text-xs font-bold uppercase tracking-wider text-brand-ink transition-colors shadow-editorial-sm cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-brand-orange" />
              <span>{avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
            </button>

            {avatarUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="inline-flex items-center gap-1 px-2.5 py-2 bg-brand-paper hover:bg-red-50 hover:text-brand-rose border border-brand-ink text-xs font-bold uppercase tracking-wider text-brand-ink/80 transition-colors shadow-editorial-sm cursor-pointer"
                title="Remove photo and use initials"
              >
                <Trash2 className="w-3.5 h-3.5 text-brand-rose" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Edit Form */}
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
