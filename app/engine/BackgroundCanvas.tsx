"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFieldClock } from "@/app/system/FieldProvider";

export default function BackgroundCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const clock = useFieldClock();

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const uniforms = {
      u_phase: { value: 0 },
      u_intensity: { value: 0.3 }
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_phase;
        uniform float u_intensity;

        void main() {
          vec2 uv = gl_FragCoord.xy / vec2(1920.0, 1080.0);
          
          float wave = sin(u_phase * 2.0 + uv.x * 8.0) * 0.05;
          
          vec3 base = vec3(0.05, 0.07, 0.12);
          vec3 cyan = vec3(0.0, 0.6, 0.9) * u_intensity * wave;
          
          gl_FragColor = vec4(base + cyan, 1.0);
        }
      `
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    clock.subscribe((field) => {
      uniforms.u_phase.value = field.phase;
      uniforms.u_intensity.value = 0.3 + field.baseIntensity + field.interactionWeight;
      renderer.render(scene, camera);
    });

    return () => {
      renderer.dispose();
    };
  }, [clock]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -10
      }}
    />
  );
}
