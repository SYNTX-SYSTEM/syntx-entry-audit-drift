"use client"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { onAttractorChange } from "@/lib/attractorSystem"

export default function FieldBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    ref.current?.appendChild(renderer.domElement)

    const geometry = new THREE.IcosahedronGeometry(3.5, 3)
    const material = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      wireframe: true,
      transparent: true,
      opacity: 0.02
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    let ns = { x: 0, y: 0, z: 0, energy: 0, phase: 0 }
    onAttractorChange((s) => { ns = s })

    function animate() {
      requestAnimationFrame(animate)
      mesh.rotation.x = ns.x * 0.02
      mesh.rotation.y = ns.y * 0.02
      mesh.scale.x = 1 + ns.z * 0.01
      mesh.scale.y = 1 + ns.x * 0.01
      mesh.material.opacity = 0.02 + ns.energy * 0.05 + Math.sin(ns.phase) * 0.01
      mesh.scale.x += Math.sin(Date.now() * 0.0003) * 0.005
      mesh.scale.y += Math.sin(Date.now() * 0.0004) * 0.005
      renderer.render(scene, camera)
    }
    animate()
  }, [])

  return <div ref={ref} className="fixed inset-0 -z-10 opacity-40" />
}
