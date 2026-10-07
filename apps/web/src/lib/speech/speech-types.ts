/**
 * LEARN-2-HIRE 2.0: SPEECH RECOGNITION TYPES & STATE MACHINE
 */

export type VoiceState =
  | 'IDLE'
  | 'REQUESTING_PERMISSION'
  | 'LISTENING'
  | 'PROCESSING'
  | 'STOPPING'
  | 'ERROR'
  | 'UNSUPPORTED';

export type SpeechRecognitionErrorType =
  | 'not-allowed'
  | 'audio-capture'
  | 'no-speech'
  | 'network'
  | 'not-supported'
  | 'aborted'
  | 'language-not-supported'
  | 'unknown';

export interface VoiceRecognitionConfig {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export interface SpeechRecognitionCallbacks {
  onStateChange: (state: VoiceState) => void;
  onInterimTranscript: (interim: string) => void;
  onFinalTranscript: (finalChunk: string) => void;
  onError: (errorType: SpeechRecognitionErrorType, friendlyMessage: string) => void;
  onEnd: () => void;
}

// Browser API Window typing for Web Speech API
export interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}
