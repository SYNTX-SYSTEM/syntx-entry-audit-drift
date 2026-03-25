"use client"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { onAttractorChange } from "@/lib/attractorSystem"

export default function EventHorizonField() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    ref.current?.appendChild(renderer.domElement)

    const geo = new THREE.PlaneGeometry(2, 2)
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        u_energy: { value: 0 },
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      fragmentShader: `
        uniform float u_energy;
        uniform float u_time;
        uniform vec2 u_resolution;
        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution;
          float dist = distance(uv, vec2(0.5, 0.5));
          float ring = smoothstep(0.35, 0.36, dist);
          float pulse = sin(u_time * 2.0) * 0.02;
          float intensity = ring * u_energy * 0.15 + pulse * u_energy;
          gl_FragColor = vec4(0.0, 0.85, 1.0, intensity);
        }
      `
    })
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)

    let energy = 0
    onAttractorChange(s => energy = s.energy)

    function animate() {
      mat.uniforms.u_energy.value = energy
      mat.uniforms.u_time.value += 0.01
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  return <div ref={ref} className="fixed inset-0 -z-5 pointer-events-none" />
}
