/**
 * §3.2.7 THE ENGINE — the sound layer.
 *
 * "Sound is off by default with a persistent, beautiful toggle... Scroll
 * velocity modulates wind volume. Do not autoplay audio. The opt-in *is* the
 * ritual."
 *
 * Web Audio rather than <audio> elements, for reasons the brief forces:
 *
 * - GAPLESS LOOPS. An <audio> loop replays the MP3 container including its
 *   encoder padding, which puts an audible tick in the engine bed every 8
 *   seconds. An AudioBufferSourceNode loops on sample boundaries, and
 *   loopStart/loopEnd let the padding be trimmed out entirely.
 * - PER-LAYER GAIN. Wind has to respond to scroll velocity independently of
 *   the engine.
 * - EXACT SCHEDULING. The bell is on a 47-second interval, "deliberately not
 *   synced to anything". setInterval drifts; AudioContext time does not.
 *
 * Nothing here is constructed until the viewer asks for it. The AudioContext
 * is created inside the toggle's click handler, which is also the only way
 * browsers will allow it to start.
 */

const SOURCES = {
  engine: "/audio/engine.mp3",
  wind: "/audio/wind.mp3",
  bell: "/audio/bell.mp3",
} as const;

/** §3.2.7 — "one distant bell that rings on a 47-second interval". */
const BELL_INTERVAL_S = 47;

/** MP3 decode can leave a few ms of silence at each end. Loop inside it. */
const LOOP_TRIM_S = 0.02;

type Layer = { source: AudioBufferSourceNode; gain: GainNode };

export class Engine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private engine: Layer | null = null;
  private wind: Layer | null = null;
  private bellBuffer: AudioBuffer | null = null;
  private bellTimer = 0;
  private running = false;

  get isRunning(): boolean {
    return this.running;
  }

  async start(): Promise<void> {
    if (this.running) return;

    const ctx = new AudioContext();
    this.ctx = ctx;

    const master = ctx.createGain();
    // Fade up over --dur-base. The engine turns over; it does not snap on.
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.9);
    master.connect(ctx.destination);
    this.master = master;

    const [engineBuf, windBuf, bellBuf] = await Promise.all([
      this.load(SOURCES.engine),
      this.load(SOURCES.wind),
      this.load(SOURCES.bell),
    ]);
    this.bellBuffer = bellBuf;

    this.engine = this.loop(engineBuf, 0.55);
    this.wind = this.loop(windBuf, 0.16);

    // First bell one interval in, not immediately — it should arrive after
    // you have stopped expecting anything.
    this.scheduleBell(BELL_INTERVAL_S);

    this.running = true;
  }

  stop(): void {
    if (!this.ctx || !this.master) return;
    const { ctx, master } = this;

    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);

    window.clearTimeout(this.bellTimer);
    const closing = ctx;
    window.setTimeout(() => void closing.close(), 700);

    this.ctx = null;
    this.master = null;
    this.engine = null;
    this.wind = null;
    this.running = false;
  }

  /**
   * §3.2.7 — "Scroll velocity modulates wind volume." Given 0..1, where 1 is
   * a hard flick. Ramped rather than set, so the wind rises and falls instead
   * of stepping with each scroll event.
   */
  setScrollVelocity(v: number): void {
    if (!this.ctx || !this.wind) return;
    const target = 0.12 + Math.min(1, Math.max(0, v)) * 0.4;
    this.wind.gain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.25);
  }

  private async load(url: string): Promise<AudioBuffer> {
    const res = await fetch(url);
    return this.ctx!.decodeAudioData(await res.arrayBuffer());
  }

  private loop(buffer: AudioBuffer, volume: number): Layer {
    const ctx = this.ctx!;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.loopStart = LOOP_TRIM_S;
    source.loopEnd = buffer.duration - LOOP_TRIM_S;

    const gain = ctx.createGain();
    gain.gain.value = volume;

    source.connect(gain).connect(this.master!);
    source.start(0, LOOP_TRIM_S);

    return { source, gain };
  }

  private scheduleBell(delaySeconds: number): void {
    this.bellTimer = window.setTimeout(() => {
      if (!this.ctx || !this.bellBuffer || !this.master) return;

      const source = this.ctx.createBufferSource();
      source.buffer = this.bellBuffer;
      const gain = this.ctx.createGain();
      // Distant. It is coming from outside the site.
      gain.gain.value = 0.22;
      source.connect(gain).connect(this.master);
      source.start();

      this.scheduleBell(BELL_INTERVAL_S);
    }, delaySeconds * 1000);
  }
}
