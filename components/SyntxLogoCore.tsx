"use client"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { onAttractorChange } from "@/lib/attractorSystem"

export default function SyntxLogoCore() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    ref.current?.appendChild(renderer.domElement)

    const loader = new THREE.TextureLoader()
    const texture = loader.load("/Logo1.png")
    const geo = new THREE.PlaneGeometry(3, 3)
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.9
    })
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)

    let a = { x: 0, y: 0, z: 0, energy: 0, phase: 0 }
    onAttractorChange(s => { a = s })

    function animate() {
      requestAnimationFrame(animate)
      mesh.rotation.z = a.x * 0.02
      mesh.scale.x = 1 + a.energy * 0.05
      mesh.scale.y = 1 + a.energy * 0.05
      mat.opacity = 0.85 + a.energy * 0.1
      renderer.render(scene, camera)
    }
    animate()
  }, [])

  return <div ref={ref} className="fixed inset-0 flex items-center justify-center pointer-events-none z-0" />
}
