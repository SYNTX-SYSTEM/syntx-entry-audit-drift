"use client"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { onAttractorChange } from "@/lib/attractorSystem"

export default function LensingOverlay() {
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
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(uv, center);
          float lens = smoothstep(0.1, 0.4, dist + (u_energy * 0.1));
          float strength = u_energy * 0.05;
          gl_FragColor = vec4(0.0, 0.85, 1.0, strength * (1.0 - lens));
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

  return <div ref={ref} className="fixed inset-0 -z-1 pointer-events-none" />
}
