/**
 * LEARN-2-HIRE 2.0: REAL SPEECH RECOGNITION & VOICE INTERVIEW TEST SUITE
 * Validates state transitions, anti-duplication transcript accumulation,
 * permission error mapping, and difficulty-modulated interview generation.
 */

import { SpeechRecognitionService } from '../apps/web/src/lib/speech/speech-recognition-service';
import { VoiceState, SpeechRecognitionErrorType } from '../apps/web/src/lib/speech/speech-types';
import { getInitialInterviewQuestions, evaluateInterviewResponse } from '../apps/web/src/lib/assessment';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✓ PASSED: ${msg}`);
    passed++;
  } else {
    console.error(`  ✗ FAILED: ${msg}`);
    failed++;
    throw new Error(msg);
  }
}

console.log('============================================================');
console.log('TEST SUITE: REAL VOICE INPUT & INTERVIEW SIMULATION PIPELINE');
console.log('============================================================\n');

// -----------------------------------------------------------------------
// TEST 1: Service Feature Detection in Node environment
// -----------------------------------------------------------------------
console.log('--- TEST 1: SPEECH RECOGNITION FEATURE DETECTION ---');
const service = new SpeechRecognitionService();
// In Node (non-browser), isSupported() must be false without crashing
assert(!service.isSupported(), 'isSupported() cleanly returns false in SSR/Node without throwing');
assert(service.getState() === 'IDLE', 'Initial voice state is IDLE');

// -----------------------------------------------------------------------
// TEST 2: State Machine & Callback Lifecycle
// -----------------------------------------------------------------------
console.log('\n--- TEST 2: STATE MACHINE TRANSITIONS & ERROR HANDLING ---');
let recordedState: VoiceState = 'IDLE';
let recordedError: { type: SpeechRecognitionErrorType; msg: string } | null = null;

service.setCallbacks({
  onStateChange: (state) => {
    recordedState = state;
  },
  onError: (type, msg) => {
    recordedError = { type, msg };
  },
});

// Calling start in unsupported environment must transition to UNSUPPORTED and trigger mapped error
service.start();
assert(recordedState === 'UNSUPPORTED', 'State transitions to UNSUPPORTED when Web Speech API is absent');
assert(recordedError !== null && recordedError.type === 'not-supported', 'Error callback triggered with not-supported');
assert(recordedError!.msg.includes('not supported in this browser'), 'Human-friendly unsupported message provided');

// -----------------------------------------------------------------------
// TEST 3: Mock Web Speech API in Browser Environment
// -----------------------------------------------------------------------
console.log('\n--- TEST 3: WEB SPEECH API EVENT EMISSION & ANTI-DUPLICATION ---');

// Mock browser window and SpeechRecognition constructor
class MockSpeechRecognition {
  public lang = 'en-US';
  public continuous = true;
  public interimResults = true;
  public onstart: (() => void) | null = null;
  public onresult: ((event: any) => void) | null = null;
  public onerror: ((event: any) => void) | null = null;
  public onend: (() => void) | null = null;

  start() {
    setTimeout(() => {
      this.onstart?.();
    }, 10);
  }

  stop() {
    setTimeout(() => {
      this.onend?.();
    }, 10);
  }

  abort() {
    setTimeout(() => {
      this.onend?.();
    }, 10);
  }
}

(global as any).window = {
  SpeechRecognition: MockSpeechRecognition,
};

const browserService = new SpeechRecognitionService();
assert(browserService.isSupported() === true, 'Service detects SpeechRecognition in mock browser window');

let interimTranscript = '';
let finalChunks: string[] = [];
let statesVisited: VoiceState[] = [];

browserService.setCallbacks({
  onStateChange: (st) => {
    statesVisited.push(st);
  },
  onInterimTranscript: (interim) => {
    interimTranscript = interim;
  },
  onFinalTranscript: (finalChunk) => {
    finalChunks.push(finalChunk);
  },
});

// Start recognition
browserService.start({ lang: 'en-US' });
assert(
  statesVisited.includes('REQUESTING_PERMISSION'),
  'State visited REQUESTING_PERMISSION before LISTENING'
);

// Simulate recognition onstart
(browserService as any).recognitionInstance.onstart();
assert(browserService.getState() === 'LISTENING', 'State transitioned to LISTENING on recognition start');

// Simulate interim speech results: "In a production machine"
const interimEvent1 = {
  resultIndex: 0,
  results: [
    {
      isFinal: false,
      0: { transcript: 'In a production machine' },
    },
  ],
};
(browserService as any).recognitionInstance.onresult(interimEvent1);
assert(interimTranscript === 'In a production machine', 'Interim transcript streamed live');
assert(finalChunks.length === 0, 'No final chunk emitted during interim speech');

// Simulate further interim speech: "In a production machine learning system"
const interimEvent2 = {
  resultIndex: 0,
  results: [
    {
      isFinal: false,
      0: { transcript: 'In a production machine learning system' },
    },
  ],
};
(browserService as any).recognitionInstance.onresult(interimEvent2);
assert(interimTranscript === 'In a production machine learning system', 'Interim transcript updated without duplication');

// Simulate finalization of sentence
const finalEvent = {
  resultIndex: 0,
  results: [
    {
      isFinal: true,
      0: { transcript: 'In a production machine learning system, I would monitor model latency and data drift.' },
    },
  ],
};
(browserService as any).recognitionInstance.onresult(finalEvent);
assert(
  finalChunks[0] === 'In a production machine learning system, I would monitor model latency and data drift.',
  'Finalized transcript captured cleanly'
);
assert(interimTranscript === '', 'Interim transcript cleared upon speech finalization');

// Stop recognition
browserService.stop();
assert(browserService.getState() === 'STOPPING', 'State transitioned to STOPPING on stop()');

// -----------------------------------------------------------------------
// TEST 4: Mixed Input (Existing Typed Text + Speech Appending)
// -----------------------------------------------------------------------
console.log('\n--- TEST 4: MIXED INPUT (TYPED TEXT + SPEECH APPENDING) ---');
let draftAnswer = 'Regarding our architecture,';
const speechChunk1 = 'we partition stateful nodes behind an event-driven queue.';

// Smart append logic
function appendSpeech(existing: string, chunk: string): string {
  const trimmed = existing.trim();
  if (trimmed.length === 0) return chunk;
  if (!trimmed.endsWith(chunk)) {
    return `${trimmed} ${chunk}`;
  }
  return trimmed;
}

draftAnswer = appendSpeech(draftAnswer, speechChunk1);
assert(
  draftAnswer === 'Regarding our architecture, we partition stateful nodes behind an event-driven queue.',
  'Speech appends to existing typed text with single spacing'
);

// User continues speaking: second speech chunk appends without duplicate text
const speechChunk2 = 'We also implement dead-letter queues for unprocessable messages.';
draftAnswer = appendSpeech(draftAnswer, speechChunk2);
assert(
  draftAnswer === 'Regarding our architecture, we partition stateful nodes behind an event-driven queue. We also implement dead-letter queues for unprocessable messages.',
  'Second speech segment appends sequentially without overwriting'
);

// -----------------------------------------------------------------------
// TEST 5: Difficulty-Modulated Interview Question Generation
// -----------------------------------------------------------------------
console.log('\n--- TEST 5: DIFFICULTY-MODULATED QUESTION GENERATION ---');
const begQuestions = getInitialInterviewQuestions('full-stack-developer', 'BEGINNER');
const intQuestions = getInitialInterviewQuestions('full-stack-developer', 'INTERMEDIATE');
const expQuestions = getInitialInterviewQuestions('full-stack-developer', 'EXPERT');

assert(begQuestions.length === 3, 'Beginner interview has 3 questions');
assert(intQuestions.length === 3, 'Intermediate interview has 3 questions');
assert(expQuestions.length === 3, 'Expert interview has 3 questions');

assert(
  begQuestions[0].questionText.toLowerCase().includes('foundational') ||
  begQuestions[0].questionText.toLowerCase().includes('core concepts') ||
  begQuestions[0].questionText.toLowerCase().includes('junior'),
  'Beginner question is calibrated to foundational principles'
);

assert(
  expQuestions[0].questionText.toLowerCase().includes('principal') ||
  expQuestions[0].questionText.toLowerCase().includes('governance') ||
  expQuestions[0].questionText.toLowerCase().includes('scale'),
  'Expert question is calibrated to principal architecture and governance'
);

assert(
  begQuestions[0].questionText !== expQuestions[0].questionText,
  'Beginner and Expert questions are distinctly differentiated'
);

// -----------------------------------------------------------------------
// TEST 6: AI Interview Evaluation of Voice Transcript
// -----------------------------------------------------------------------
console.log('\n--- TEST 6: REAL TRANSCRIPT EVALUATION SCORING ---');
const evalResult = evaluateInterviewResponse(intQuestions[0], draftAnswer);
assert(evalResult.technicalCorrectness >= 70, `Evaluated technical correctness: ${evalResult.technicalCorrectness}%`);
assert(evalResult.communication >= 70, `Evaluated communication score: ${evalResult.communication}%`);
assert(evalResult.strengths.length > 0, `Evaluated strengths: "${evalResult.strengths[0]}"`);
assert(!!evalResult.detailedReport, 'Synthesized comprehensive feedback report');

console.log('\n============================================================');
console.log(`TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
console.log('REAL VOICE INPUT & SPEECH RECOGNITION PIPELINE VERIFIED!');
console.log('============================================================\n');
