/**
 * Web Speech API Recognition Service with Fallback & Real-time Metrics
 */

export const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'so', 'right', 'honestly', 'literally', 'i mean'];

export class SpeechRecognitionService {
  constructor() {
    const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    this.isSupported = !!SpeechRecognition;
    this.recognition = null;
    this.isListening = false;
    
    // Transcripts & Metrics
    this.transcript = '';
    this.interimTranscript = '';
    this.startTime = null;
    this.fillerWordCounts = {};
    
    // Callbacks
    this.onResultCallback = null;
    this.onErrorCallback = null;
    this.onEndCallback = null;
    this.onMetricUpdateCallback = null;

    if (this.isSupported) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => this.handleResult(event);
      this.recognition.onerror = (event) => this.handleError(event);
      this.recognition.onend = () => this.handleEnd();
    }
  }

  start(onResult, onMetricUpdate, onError, onEnd) {
    if (!this.isSupported) {
      if (onError) onError('Speech Recognition is not supported in this browser. You can type your response.');
      return false;
    }

    // Stop existing instance if already listening to avoid InvalidStateError
    if (this.isListening) {
      this.stop();
    }

    this.onResultCallback = onResult;
    this.onMetricUpdateCallback = onMetricUpdate;
    this.onErrorCallback = onError;
    this.onEndCallback = onEnd;

    this.transcript = '';
    this.interimTranscript = '';
    this.fillerWordCounts = {};
    this.startTime = Date.now();
    this.isListening = true;

    try {
      this.recognition.start();
      return true;
    } catch (err) {
      // If already started or browser state out of sync, reset state gracefully
      if (err.name === 'InvalidStateError') {
        try {
          this.recognition.stop();
          setTimeout(() => {
            try { this.recognition.start(); } catch(e) {}
          }, 100);
        } catch(e) {}
      }
      return false;
    }
  }

  stop() {
    if (this.recognition) {
      this.isListening = false;
      try {
        this.recognition.stop();
      } catch (err) {
        // Ignore stop errors if already stopped
      }
    }
  }

  handleResult(event) {
    let finalChunk = '';
    let interimChunk = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalChunk += event.results[i][0].transcript + ' ';
      } else {
        interimChunk += event.results[i][0].transcript;
      }
    }

    if (finalChunk) {
      this.transcript += finalChunk;
      this.analyzeMetrics(this.transcript);
    }
    this.interimTranscript = interimChunk;

    const fullCurrentText = (this.transcript + ' ' + interimChunk).trim();

    if (this.onResultCallback) {
      this.onResultCallback({
        finalTranscript: this.transcript.trim(),
        interimTranscript: this.interimTranscript,
        fullText: fullCurrentText
      });
    }
  }

  analyzeMetrics(text) {
    if (!text) return;
    const lowerText = text.toLowerCase();
    const words = lowerText.match(/\b[\w']+\b/g) || [];
    
    // Count fillers
    let totalFillers = 0;
    FILLER_WORDS.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = lowerText.match(regex);
      const count = matches ? matches.length : 0;
      this.fillerWordCounts[filler] = count;
      totalFillers += count;
    });

    // Calculate WPM
    const elapsedMinutes = Math.max((Date.now() - (this.startTime || Date.now())) / 60000, 0.1);
    const totalWordCount = words.length;
    const wpm = Math.round(totalWordCount / elapsedMinutes);

    if (this.onMetricUpdateCallback) {
      this.onMetricUpdateCallback({
        totalWords: totalWordCount,
        wpm: wpm,
        fillerWordCounts: { ...this.fillerWordCounts },
        totalFillers: totalFillers,
        durationSeconds: Math.round((Date.now() - (this.startTime || Date.now())) / 1000)
      });
    }
  }

  handleError(event) {
    if (event.error === 'no-speech' || event.error === 'aborted') {
      return; // Ignore transient no-speech or manual abort events
    }
    if (this.onErrorCallback) {
      this.onErrorCallback(event.error);
    }
  }

  handleEnd() {
    if (this.isListening) {
      try {
        this.recognition.start();
      } catch (e) {
        this.isListening = false;
        if (this.onEndCallback) this.onEndCallback();
      }
    } else {
      if (this.onEndCallback) this.onEndCallback();
    }
  }
}

export const speechRecognitionInstance = new SpeechRecognitionService();
