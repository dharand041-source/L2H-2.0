'use client';

import React from 'react';
import { Mic, MicOff, Loader2, X, AlertTriangle, Radio } from 'lucide-react';
import { useVoiceRecognition } from '@/lib/speech';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface InterviewVoiceInputProps {
  currentText: string;
  onTranscriptChange: (updatedText: string) => void;
  onVoiceStateChange?: (isListening: boolean) => void;
  disabled?: boolean;
  lang?: string;
}

export const InterviewVoiceInput: React.FC<InterviewVoiceInputProps> = ({
  currentText,
  onTranscriptChange,
  onVoiceStateChange,
  disabled = false,
  lang = 'en-US',
}) => {
  const {
    voiceState,
    isListening,
    isSupported,
    interimTranscript,
    errorMessage,
    startVoiceInput,
    stopVoiceInput,
    cancelVoiceInput,
    resetVoiceInput,
  } = useVoiceRecognition({
    lang,
    onFinalTranscript: (finalChunk) => {
      const cleanChunk = finalChunk.trim();
      if (!cleanChunk) return;

      // Smart append without duplicating whitespace or words
      const trimmedExisting = currentText.trim();
      if (trimmedExisting.length === 0) {
        onTranscriptChange(cleanChunk);
      } else {
        // Prevent accidental duplication if chunk is already at the end
        if (!trimmedExisting.endsWith(cleanChunk)) {
          onTranscriptChange(`${trimmedExisting} ${cleanChunk}`);
        }
      }
    },
  });

  // Notify parent component of listening state
  React.useEffect(() => {
    onVoiceStateChange?.(isListening);
  }, [isListening, onVoiceStateChange]);

  const handleStart = async () => {
    if (disabled || isListening) return;
    await startVoiceInput({ lang });
  };

  const handleStop = () => {
    stopVoiceInput();
  };

  const handleCancel = () => {
    cancelVoiceInput();
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/70">
            Voice Articulation:
          </span>

          {isListening && (
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-brand-rose/10 border border-brand-rose text-[10px] font-bold text-brand-rose uppercase tracking-wider animate-pulse"
              aria-live="polite"
            >
              <Radio className="w-3 h-3 text-brand-rose animate-ping" />
              Listening to microphone...
            </span>
          )}

          {voiceState === 'REQUESTING_PERMISSION' && (
            <span className="text-[10px] font-semibold text-brand-orange uppercase animate-pulse">
              Requesting mic permission...
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Cancel button while listening */}
          {isListening && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-2.5 py-1 text-xs font-bold uppercase border border-brand-ink/40 bg-brand-cream text-brand-ink hover:bg-brand-paper flex items-center gap-1"
              title="Discard current speech"
              aria-label="Cancel speech input"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          )}

          {/* Primary Voice Control Button */}
          {!isSupported ? (
            <div
              className="px-3 py-1 text-xs font-bold uppercase border border-brand-ink/30 bg-brand-cream text-brand-ink/50 cursor-not-allowed"
              title="Web Speech API not supported in this browser. Use keyboard typing instead."
            >
              Voice Unavailable
            </div>
          ) : voiceState === 'IDLE' ? (
            <button
              type="button"
              onClick={handleStart}
              disabled={disabled}
              className="px-3 py-1 text-xs font-bold uppercase border border-brand-ink bg-brand-cream text-brand-ink hover:bg-brand-paper hover:text-brand-orange flex items-center gap-1.5 transition-all shadow-editorial-sm cursor-pointer disabled:opacity-50"
              aria-label="Start voice input"
            >
              <Mic className="w-3.5 h-3.5 text-brand-orange" />
              Start Voice Input
            </button>
          ) : voiceState === 'REQUESTING_PERMISSION' ? (
            <button
              type="button"
              disabled
              className="px-3 py-1 text-xs font-bold uppercase border border-brand-ink bg-brand-cream text-brand-ink flex items-center gap-1.5 opacity-70 cursor-wait"
              aria-label="Requesting microphone permission"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-orange" />
              Requesting Mic...
            </button>
          ) : isListening ? (
            <button
              type="button"
              onClick={handleStop}
              className="px-3 py-1 text-xs font-bold uppercase border border-brand-ink bg-brand-rose text-white flex items-center gap-1.5 transition-all shadow-editorial-sm cursor-pointer animate-pulse"
              aria-label="Stop voice input"
            >
              <MicOff className="w-3.5 h-3.5" />
              Stop Voice Input
            </button>
          ) : voiceState === 'STOPPING' || voiceState === 'PROCESSING' ? (
            <button
              type="button"
              disabled
              className="px-3 py-1 text-xs font-bold uppercase border border-brand-ink bg-brand-cream text-brand-ink flex items-center gap-1.5 opacity-70 cursor-wait"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Processing Speech...
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStart}
              disabled={disabled}
              className="px-3 py-1 text-xs font-bold uppercase border border-brand-rose bg-brand-rose/10 text-brand-rose hover:bg-brand-rose hover:text-white flex items-center gap-1.5 transition-all"
              aria-label="Retry voice input"
            >
              <Mic className="w-3.5 h-3.5" />
              Retry Voice Input
            </button>
          )}
        </div>
      </div>

      {/* Live Interim Transcript Display */}
      {isListening && interimTranscript && (
        <div
          className="p-2.5 bg-brand-yellow/15 border border-brand-yellow text-xs font-medium text-brand-ink flex items-start gap-2 animate-in fade-in"
          aria-live="polite"
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-ink/60 shrink-0 mt-0.5">
            Speaking:
          </span>
          <span className="italic leading-relaxed text-brand-ink">
            &ldquo;{interimTranscript}&rdquo;
          </span>
        </div>
      )}

      {/* Friendly Error Banner */}
      {errorMessage && (
        <div className="p-2.5 bg-brand-rose/10 border border-brand-rose text-xs text-brand-ink flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-brand-rose shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={resetVoiceInput}
            className="text-[11px] font-bold text-brand-rose uppercase hover:underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
