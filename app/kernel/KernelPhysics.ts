import { FieldVector } from "@/app/system/MotionClock";

type KernelState = {
  mass: number;
  velocity: number;
  compression: number;
};

export class KernelPhysics {
  private state: KernelState = {
    mass: 1,
    velocity: 0,
    compression: 0
  };

  private stiffness = 0.08;
  private damping = 0.85;

  update(field: FieldVector) {
    // Statt linear:
    const rawIntensity = field.baseIntensity + field.interactionWeight + field.absorptionSpike;
    
    // Nicht-linear (sigmoid):
    const intensity = 1 / (1 + Math.exp(-rawIntensity * 4));
    
    const targetMass = 1 + intensity * 0.6;

    const force = (targetMass - this.state.mass) * this.stiffness;

    this.state.velocity += force;
    this.state.velocity *= this.damping;
    this.state.mass += this.state.velocity;

    this.state.compression = field.thresholdCompression;

    return this.state;
  }
}
