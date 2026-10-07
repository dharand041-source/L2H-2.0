'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SpeechRecognitionService } from './speech-recognition-service';
import {
  VoiceState,
  SpeechRecognitionErrorType,
  VoiceRecognitionConfig,
} from './speech-types';

export interface UseVoiceRecognitionOptions {
  lang?: string;
  onFinalTranscript?: (finalChunk: string) => void;
  onInterimTranscript?: (interim: string) => void;
  onError?: (errorType: SpeechRecognitionErrorType, message: string) => void;
}

export function useVoiceRecognition(options?: UseVoiceRecognitionOptions) {
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  const serviceRef = useRef<SpeechRecognitionService | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const service = new SpeechRecognitionService({
      onStateChange: (nextState) => {
        setVoiceState(nextState);
        if (nextState === 'LISTENING') {
          setErrorMessage(null);
        }
      },
      onInterimTranscript: (interim) => {
        setInterimTranscript(interim);
        optionsRef.current?.onInterimTranscript?.(interim);
      },
      onFinalTranscript: (finalChunk) => {
        optionsRef.current?.onFinalTranscript?.(finalChunk);
      },
      onError: (errType, message) => {
        setErrorMessage(message);
        optionsRef.current?.onError?.(errType, message);
      },
      onEnd: () => {
        setInterimTranscript('');
      },
    });

    serviceRef.current = service;
    setIsSupported(service.isSupported());

    // Stop recognition if tab becomes hidden to protect privacy
    const handleVisibilityChange = () => {
      if (document.hidden && serviceRef.current?.getState() === 'LISTENING') {
        serviceRef.current.stop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      service.destroy();
    };
  }, []);

  const startVoiceInput = useCallback(
    async (overrideConfig?: VoiceRecognitionConfig) => {
      if (!serviceRef.current) return;
      setErrorMessage(null);
      await serviceRef.current.start({
        lang: overrideConfig?.lang || optionsRef.current?.lang || 'en-US',
        ...overrideConfig,
      });
    },
    []
  );

  const stopVoiceInput = useCallback(() => {
    serviceRef.current?.stop();
  }, []);

  const cancelVoiceInput = useCallback(() => {
    serviceRef.current?.abort();
    setInterimTranscript('');
    setErrorMessage(null);
  }, []);

  const resetVoiceInput = useCallback(() => {
    serviceRef.current?.abort();
    setInterimTranscript('');
    setErrorMessage(null);
    setVoiceState('IDLE');
  }, []);

  return {
    voiceState,
    isListening: voiceState === 'LISTENING',
    isSupported,
    interimTranscript,
    errorMessage,
    startVoiceInput,
    stopVoiceInput,
    cancelVoiceInput,
    resetVoiceInput,
  };
}
