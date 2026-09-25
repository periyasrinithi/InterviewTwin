/**
 * Web Speech API Text-to-Speech (TTS) Engine with Visualizer Frequency Emulation
 */

export class SpeechSynthesisService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.selectedVoice = null;

    if (this.synth) {
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return [];
    this.voices = this.synth.getVoices().filter(v => v.lang.startsWith('en'));
    // Default to natural English voice if available
    if (this.voices.length > 0 && !this.selectedVoice) {
      this.selectedVoice = this.voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel')) || this.voices[0];
    }
    return this.voices;
  }

  getVoices() {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices;
  }

  setVoiceByName(name) {
    const found = this.voices.find(v => v.name === name);
    if (found) this.selectedVoice = found;
  }

  speak(text, options = {}) {
    return new Promise((resolve) => {
      const {
        rate = 1.0,
        pitch = 1.0,
        volume = 1.0,
        onStart = () => {},
        onEnd = () => {},
        onBoundary = () => {}
      } = options;

      this.cancel(); // Stop any active speech
      this.isCancelled = false;

      if (!this.synth) {
        // Fallback simulation if TTS not supported
        onStart();
        const duration = Math.min(Math.max(text.length * 50, 1500), 8000);
        this.fallbackTimer = setTimeout(() => {
          if (!this.isCancelled) {
            onEnd();
            resolve();
          }
        }, duration);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      utterance.onstart = () => {
        if (!this.isCancelled) {
          this.isSpeaking = true;
          onStart();
        }
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        if (!this.isCancelled) {
          onEnd();
        }
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('TTS error:', e);
        this.isSpeaking = false;
        this.currentUtterance = null;
        if (!this.isCancelled) {
          onEnd();
        }
        resolve();
      };

      utterance.onboundary = (e) => {
        if (!this.isCancelled) onBoundary(e);
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  cancel() {
    this.isCancelled = true;
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if (this.synth && this.isSpeaking) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }
}

export const speechSynthesisInstance = new SpeechSynthesisService();
