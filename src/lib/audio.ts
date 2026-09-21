class CyberAudioEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public ambientEnabled: boolean = false;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  // Tactile Mechanical Relay Click for Buttons
  playClick(pitch: number = 900) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.025);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.025);
    } catch {}
  }

  // Ambient Sci-Fi Cyber Drone
  toggleAmbient(active?: boolean) {
    const ctx = this.getContext();
    if (!ctx) return;

    const targetState = active !== undefined ? active : !this.ambientEnabled;
    this.ambientEnabled = targetState;

    if (!targetState) {
      if (this.ambientGain) {
        try {
          this.ambientGain.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
          setTimeout(() => {
            this.ambientOsc1?.stop();
            this.ambientOsc2?.stop();
            this.ambientOsc1 = null;
            this.ambientOsc2 = null;
            this.ambientGain = null;
          }, 600);
        } catch {}
      }
      return;
    }

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, now); // A1 note

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55.6, now); // Detuned for subtle phasing

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(240, now);
      filter.Q.setValueAtTime(3, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.04, now + 1.5);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);

      this.ambientOsc1 = osc1;
      this.ambientOsc2 = osc2;
      this.ambientGain = gain;
    } catch {}
  }

  // 808 Sub-bass Punch + Quantum Laser Chirp
  playBreachStart() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // 808 Sub-bass impact
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(160, now);
      sub.frequency.exponentialRampToValueAtTime(36, now + 0.45);

      subGain.gain.setValueAtTime(0.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 0.45);

      // Cyber Laser Sweep
      const laser = ctx.createOscillator();
      const laserGain = ctx.createGain();
      laser.type = 'sawtooth';
      laser.frequency.setValueAtTime(1800, now);
      laser.frequency.exponentialRampToValueAtTime(400, now + 0.2);

      laserGain.gain.setValueAtTime(0.12, now);
      laserGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      laser.connect(laserGain);
      laserGain.connect(ctx.destination);
      laser.start(now);
      laser.stop(now + 0.2);
    } catch {}
  }

  // High-Speed Decryption Stream Blips
  playDecryptTick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      const freq = 600 + Math.random() * 800;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch {}
  }

  // Polyphonic Victorious Arcade Fanfare
  playSuccess(multiplier: number) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Multi-tier fanfare: Minor to Major depending on multiplier
      const chord =
        multiplier >= 10
          ? [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98] // C5 Major Full Blast
          : multiplier >= 4
            ? [440.0, 554.37, 659.25, 880.0] // A4 Major
            : [392.0, 493.88, 587.33]; // G4

      const noteDuration = 0.08;
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = multiplier >= 10 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * noteDuration);

        gain.gain.setValueAtTime(0.18, now + idx * noteDuration);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * noteDuration + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * noteDuration);
        osc.stop(now + idx * noteDuration + 0.45);
      });

      // Sub-bass lift on jackpot
      if (multiplier >= 10) {
        const sub = ctx.createOscillator();
        const subGain = ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(65.41, now); // C2
        subGain.gain.setValueAtTime(0.35, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        sub.connect(subGain);
        subGain.connect(ctx.destination);
        sub.start(now);
        sub.stop(now + 1.2);
      }
    } catch {}
  }

  // Dreadful ICE Lockdown Alarm (Tritone Dissonance)
  playAlarm() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(320, now);
      osc1.frequency.exponentialRampToValueAtTime(160, now + 0.35);

      osc2.type = 'sawtooth';
      // Tritone dissonance for pure tension
      osc2.frequency.setValueAtTime(320 * 1.414, now);
      osc2.frequency.exponentialRampToValueAtTime(160 * 1.414, now + 0.35);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } catch {}
  }

  // Rare Darknet Loot Shimmer
  playLootFound() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const chimeNotes = [1046.5, 1318.5, 1567.98, 2093.0];
      chimeNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.12, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.6);
      });
    } catch {}
  }
}

export const soundFx = new CyberAudioEngine();
