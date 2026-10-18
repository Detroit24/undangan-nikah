/**
 * Romantic Wedding Audio Engine
 * Hybrid: Supports MP3/Audio file playback with fallback to Web Audio API Romantic Acoustic Synthesizer
 */

class WeddingAudioController {
  constructor() {
    this.isPlaying = false;
    this.audioContext = null;
    this.synthInterval = null;
    this.audioElement = null;
    this.mode = 'synth'; // 'audio' or 'synth'
    this.btn = document.getElementById('music-toggle-btn');
    this.disc = document.querySelector('.vinyl-disc');
    this.soundBars = document.querySelectorAll('.sound-bar');
    
    this.initAudio();
  }

  initAudio() {
    // Attempt standard wedding audio stream
    try {
      this.audioElement = new Audio('https://cdn.pixabay.com/download/audio/2022/05/16/audio_c89b70de56.mp3?filename=romantic-wedding-piano-111197.mp3');
      this.audioElement.loop = true;
      this.audioElement.volume = 0.55;
      
      this.audioElement.addEventListener('play', () => {
        this.setPlayState(true);
      });
      this.audioElement.addEventListener('pause', () => {
        this.setPlayState(false);
      });
      this.audioElement.addEventListener('error', () => {
        console.warn('Audio stream unavailable, falling back to Web Audio Romantic Synthesizer.');
        this.mode = 'synth';
      });
    } catch (e) {
      this.mode = 'synth';
    }

    if (this.btn) {
      this.btn.addEventListener('click', () => this.toggle());
    }
  }

  ensureAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  play() {
    this.ensureAudioContext();

    if (this.audioElement && this.mode === 'audio') {
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.setPlayState(true);
          })
          .catch((err) => {
            console.warn('Audio playback error, switching to Web Audio API synth:', err);
            this.mode = 'synth';
            this.playSynth();
          });
      }
    } else {
      this.playSynth();
    }
  }

  pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopSynth();
    this.setPlayState(false);
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setPlayState(playing) {
    this.isPlaying = playing;
    if (this.disc) {
      if (playing) {
        this.disc.classList.add('spin-music');
        this.disc.classList.remove('spin-paused');
      } else {
        this.disc.classList.add('spin-paused');
      }
    }
    if (this.soundBars) {
      this.soundBars.forEach(bar => {
        bar.style.animationPlayState = playing ? 'running' : 'paused';
      });
    }
  }

  // --- Acoustic Piano / Harp Web Audio Synthesizer (Canon in D Chords) ---
  playSynth() {
    if (!this.audioContext) return;
    this.setPlayState(true);

    // Canon in D chord progressions and delicate melody notes
    // D, A, Bm, F#m, G, D, G, A
    const chords = [
      [293.66, 369.99, 440.00, 587.33], // D Major (D4, F#4, A4, D5)
      [220.00, 329.63, 440.00, 554.37], // A Major (A3, E4, A4, C#5)
      [246.94, 293.66, 369.99, 493.88], // B Minor (B3, D4, F#4, B4)
      [185.00, 277.18, 369.99, 440.00], // F# Minor (F#3, C#4, F#4, A4)
      [196.00, 293.66, 392.00, 493.88], // G Major (G3, D4, G4, B4)
      [293.66, 369.99, 440.00, 587.33], // D Major (D4, F#4, A4, D5)
      [196.00, 246.94, 392.00, 493.88], // G Major (G3, B3, G4, B4)
      [220.00, 329.63, 440.00, 554.37]  // A Major (A3, E4, A4, C#5)
    ];

    let chordIdx = 0;
    let noteIdx = 0;

    const playArpeggioStep = () => {
      if (!this.isPlaying) return;
      const currentChord = chords[chordIdx];
      const freq = currentChord[noteIdx % currentChord.length];
      
      this.playAcousticTone(freq, 0.9);

      noteIdx++;
      if (noteIdx % 4 === 0) {
        chordIdx = (chordIdx + 1) % chords.length;
      }
    };

    // Play immediately then loop gentle arpeggio every 420ms
    playArpeggioStep();
    this.synthInterval = setInterval(playArpeggioStep, 450);
  }

  stopSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  playAcousticTone(frequency, duration) {
    if (!this.audioContext) return;
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Dual oscillator for rich romantic chime & warmth
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(frequency, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 2, now); // soft harmonic octave

    // Envelope: quick gentle attack, mellow decay
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Warm Low-pass filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }
}

window.weddingAudio = null;
document.addEventListener('DOMContentLoaded', () => {
  window.weddingAudio = new WeddingAudioController();
});
