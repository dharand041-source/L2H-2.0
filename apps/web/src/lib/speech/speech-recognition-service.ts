/**
 * LEARN-2-HIRE 2.0: REAL SPEECH RECOGNITION SERVICE
 * Encapsulates the Web Speech API (SpeechRecognition / webkitSpeechRecognition)
 * with robust state machine transitions, permission handling, and anti-duplication transcript streams.
 */

import {
  VoiceState,
  SpeechRecognitionErrorType,
  VoiceRecognitionConfig,
  SpeechRecognitionCallbacks,
  IWindowWithSpeech,
} from './speech-types';

export class SpeechRecognitionService {
  private recognitionInstance: any = null;
  private state: VoiceState = 'IDLE';
  private callbacks: Partial<SpeechRecognitionCallbacks> = {};
  private activeConfig: VoiceRecognitionConfig = {
    lang: 'en-US',
    continuous: true,
    interimResults: true,
  };
  private isIntentionalStop = false;

  constructor(callbacks?: Partial<SpeechRecognitionCallbacks>) {
    if (callbacks) {
      this.callbacks = callbacks;
    }
  }

  public setCallbacks(callbacks: Partial<SpeechRecognitionCallbacks>) {
    this.callbacks = callbacks;
  }

  /**
   * Safe feature detection for Web Speech API in client environments.
   */
  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as IWindowWithSpeech;
    return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  public getState(): VoiceState {
    return this.state;
  }

  private setState(nextState: VoiceState) {
    this.state = nextState;
    this.callbacks.onStateChange?.(nextState);
  }

  /**
   * Starts real microphone speech capture.
   */
  public async start(config?: VoiceRecognitionConfig): Promise<void> {
    if (!this.isSupported()) {
      this.setState('UNSUPPORTED');
      this.callbacks.onError?.(
        'not-supported',
        'Voice input is not supported in this browser. You can type your answer.'
      );
      return;
    }

    if (this.state === 'LISTENING' || this.state === 'REQUESTING_PERMISSION') {
      return; // Prevent duplicate instantiation
    }

    this.isIntentionalStop = false;
    this.setState('REQUESTING_PERMISSION');

    if (config) {
      this.activeConfig = { ...this.activeConfig, ...config };
    }

    // Verify microphone permission via getUserMedia when supported
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Close the probe stream immediately so recognition engine owns the device
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (permErr: any) {
      const errorName = permErr?.name || '';
      if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
        this.setState('ERROR');
        this.callbacks.onError?.(
          'not-allowed',
          'Microphone permission was denied. Allow microphone access and try again.'
        );
        return;
      } else if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
        this.setState('ERROR');
        this.callbacks.onError?.(
          'audio-capture',
          'No microphone was detected. You can type your answer instead.'
        );
        return;
      }
    }

    const win = window as IWindowWithSpeech;
    const SpeechRecognitionConstructor = win.SpeechRecognition || win.webkitSpeechRecognition;

    try {
      this.destroy(); // Tear down any prior dangling session

      const recognition = new SpeechRecognitionConstructor();
      recognition.lang = this.activeConfig.lang || 'en-US';
      recognition.continuous = this.activeConfig.continuous ?? true;
      recognition.interimResults = this.activeConfig.interimResults ?? true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        this.setState('LISTENING');
      };

      recognition.onresult = (event: any) => {
        let interimAccumulator = '';
        let finalAccumulator = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const text = item[0]?.transcript || '';
          if (item.isFinal) {
            finalAccumulator += text + ' ';
          } else {
            interimAccumulator += text;
          }
        }

        if (finalAccumulator.trim().length > 0) {
          this.callbacks.onFinalTranscript?.(finalAccumulator.trim());
          this.callbacks.onInterimTranscript?.('');
        } else if (interimAccumulator.length > 0) {
          this.callbacks.onInterimTranscript?.(interimAccumulator.trim());
        }
      };

      recognition.onerror = (event: any) => {
        const errType: string = event.error || 'unknown';

        if (errType === 'aborted' && this.isIntentionalStop) {
          this.setState('IDLE');
          return;
        }

        let friendly = 'Voice input failed. Please try again.';
        let mappedType: SpeechRecognitionErrorType = 'unknown';

        switch (errType) {
          case 'not-allowed':
          case 'service-not-allowed':
            mappedType = 'not-allowed';
            friendly = 'Microphone permission was denied. Allow microphone access and try again.';
            break;
          case 'audio-capture':
            mappedType = 'audio-capture';
            friendly = 'No microphone was detected. You can type your answer instead.';
            break;
          case 'no-speech':
            mappedType = 'no-speech';
            friendly = 'No speech detected. Try speaking again.';
            break;
          case 'network':
            mappedType = 'network';
            friendly = 'Speech recognition service is temporarily unavailable. Your typed answer is still available.';
            break;
          case 'language-not-supported':
            mappedType = 'language-not-supported';
            friendly = `Selected language (${this.activeConfig.lang}) is not supported for speech recognition.`;
            break;
          case 'aborted':
            mappedType = 'aborted';
            friendly = 'Voice input was cancelled.';
            break;
          default:
            mappedType = 'unknown';
            friendly = 'Voice input encountered an error. You can type your answer.';
        }

        this.setState('ERROR');
        this.callbacks.onError?.(mappedType, friendly);
      };

      recognition.onend = () => {
        this.recognitionInstance = null;
        if (this.state === 'LISTENING' || this.state === 'STOPPING' || this.state === 'PROCESSING') {
          this.setState('IDLE');
        }
        this.callbacks.onEnd?.();
      };

      this.recognitionInstance = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('SpeechRecognition initialization note:', err);
      this.setState('ERROR');
      this.callbacks.onError?.(
        'unknown',
        'Unable to initialize speech recognition. You can type your answer.'
      );
    }
  }

  /**
   * Gracefully stops speech recognition, allowing final audio in-flight to finish transcribing.
   */
  public stop(): void {
    if (!this.recognitionInstance) {
      this.setState('IDLE');
      return;
    }
    this.isIntentionalStop = true;
    this.setState('STOPPING');
    try {
      this.recognitionInstance.stop();
    } catch {
      this.setState('IDLE');
    }
  }

  /**
   * Aborts recognition immediately, discarding unfinalized interim speech.
   */
  public abort(): void {
    this.isIntentionalStop = true;
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.abort();
      } catch {
        // ignore
      }
      this.recognitionInstance = null;
    }
    this.callbacks.onInterimTranscript?.('');
    this.setState('IDLE');
  }

  /**
   * Full cleanup on component unmount or navigation.
   */
  public destroy(): void {
    this.abort();
    this.recognitionInstance = null;
  }
}
