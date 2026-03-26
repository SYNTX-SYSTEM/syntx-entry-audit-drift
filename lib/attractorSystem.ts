type AttractorState = {
  x: number
  y: number
  z: number
  energy: number
  phase: number
  exampleAttractor: number
  exampleActive: boolean
}

type Listener = (s: AttractorState) => void

let state: AttractorState = {
  x: 0.1,
  y: 0,
  z: 0,
  energy: 0.2,
  phase: 0,
  exampleAttractor: 0,
  exampleActive: false
}

const listeners: Listener[] = []

export function perturb(amount: number) {
  state.energy += amount
}

export function singularity() {
  state.energy += 2
  state.phase += Math.PI
}

export function onAttractorChange(listener: Listener) {
  listeners.push(listener)
}

function step() {
  const dx = 10 * (state.y - state.x)
  const dy = state.x * (28 - state.z) - state.y
  const dz = state.x * state.y - (8 / 3) * state.z
  
  state.x += dx * 0.01
  state.y += dy * 0.01
  state.z += dz * 0.01
  
  state.energy *= 0.992
  state.phase += 0.005 + state.energy * 0.01
  
  // Example attractor evolution
  if (state.exampleActive) {
    state.exampleAttractor = Math.min(1, state.exampleAttractor + 0.02)
  } else {
    state.exampleAttractor = Math.max(0, state.exampleAttractor - 0.015)
  }
  
  listeners.forEach(l => l({ ...state }))
}

setInterval(step, 16)

export function modulate(updates: Partial<AttractorState>) {
  Object.assign(state, updates)
}

export function getFieldState() {
  return { ...state }
}
