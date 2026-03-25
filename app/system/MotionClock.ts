type Subscriber = (field: FieldVector) => void;

export type FieldVector = {
  phase: number;
  noiseDrift: number;
  baseIntensity: number;
  interactionWeight: number;
  absorptionSpike: number;
  thresholdCompression: number;
};

export class MotionClock {
  private rawTime = 0;
  private subscribers: Subscriber[] = [];
  private field: FieldVector;
  private running = false;

  constructor(initialField: FieldVector) {
    this.field = initialField;
  }

  subscribe(cb: Subscriber) {
    this.subscribers.push(cb);
  }

  modulate(patch: Partial<FieldVector>) {
    this.field = { ...this.field, ...patch };
  }

  start() {
    if (this.running) return;
    this.running = true;

    const loop = () => {
      this.rawTime += 0.016;

      const drift = Math.sin(this.rawTime * 0.08) * 0.3;
      const micro = Math.sin(this.rawTime * 0.6) * 0.05;

      this.field.phase = this.rawTime * 0.05 + drift;
      this.field.noiseDrift = drift + micro;

      for (const sub of this.subscribers) {
        sub(this.field);
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
  }
}
