import { useState, useEffect } from 'react';

// Safe wrapper for AudioContext to support all browsers and respect user interaction requirements.
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

export function useSound() {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('n_console_muted') === 'true';
    }
    return false;
  });

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newValue = !prev;
      localStorage.setItem('n_console_muted', String(newValue));
      return newValue;
    });
    // Trigger tiny test sound immediately if unmuting
    setTimeout(() => {
      playSound('tick');
    }, 50);
  };

  const playSound = (type: 'tick' | 'select' | 'powerup' | 'error' | 'back' | 'save') => {
    if (isMuted) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    try {
      const playTone = (frequency: number, duration: number, waveType: OscillatorType = 'square', delay = 0) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = waveType;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
        
        gain.gain.setValueAtTime(0.08, ctx.currentTime + delay); // keep volume very gentle
        // Exponential decay
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      };

      if (type === 'tick') {
        playTone(600, 0.08, 'triangle');
      } else if (type === 'select') {
        playTone(523.25, 0.08, 'square'); // C5
        playTone(659.25, 0.12, 'square', 0.06); // E5
      } else if (type === 'powerup') {
        const noteFrequencies = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C, E, G, C, E, G, C
        noteFrequencies.forEach((freq, idx) => {
          playTone(freq, 0.15, 'sine', idx * 0.07);
        });
      } else if (type === 'error') {
        playTone(150, 0.25, 'sawtooth');
        playTone(110, 0.25, 'sawtooth', 0.08);
      } else if (type === 'back') {
        playTone(440, 0.08, 'square');
        playTone(349.23, 0.12, 'square', 0.06);
      } else if (type === 'save') {
        playTone(587.33, 0.08, 'sine'); // D5
        playTone(783.99, 0.08, 'sine', 0.05); // G5
        playTone(1174.66, 0.16, 'sine', 0.1); // D6
      }
    } catch (e) {
      console.warn('Audio Context failed to play sound:', e);
    }
  };

  return {
    isMuted,
    toggleMute,
    playSound,
  };
}
