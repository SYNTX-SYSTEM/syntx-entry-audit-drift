type AttractorState = {
  x: number
  y: number
  z: number
  energy: number
  phase: number
}

type Listener = (s: AttractorState) => void

let state: AttractorState = {
  x: 0.1,
  y: 0,
  z: 0,
  energy: 0.2,
  phase: 0
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
  const sigma = 10
  const rho = 28 + state.energy * 5
  const beta = 8 / 3
  const dt = 0.01

  const dx = sigma * (state.y - state.x)
  const dy = state.x * (rho - state.z) - state.y
  const dz = state.x * state.y - beta * state.z

  state.x += dx * dt
  state.y += dy * dt
  state.z += dz * dt

  state.energy *= 0.992
  state.phase += 0.005 + state.energy * 0.01

  listeners.forEach(l => l({ ...state }))
}

setInterval(step, 16)
