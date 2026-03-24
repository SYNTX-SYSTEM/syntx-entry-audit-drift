"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  drift: number;
  entropy: number;
  resonance: number;
};

export default function DriftScene({ drift, entropy, resonance }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<any>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      u_time: { value: 0 },
      u_drift: { value: drift },
      u_entropy: { value: entropy },
      u_resonance: { value: resonance },
      u_resolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight)
      }
    };

    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform float u_time;
        uniform float u_drift;
        uniform float u_entropy;
        uniform float u_resonance;
        uniform vec2 u_resolution;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);

          float a = hash(i);
          float b = hash(i + vec2(1.0,0.0));
          float c = hash(i + vec2(0.0,1.0));
          float d = hash(i + vec2(1.0,1.0));

          vec2 u = f*f*(3.0-2.0*f);

          return mix(a, b, u.x) +
                 (c - a)* u.y * (1.0 - u.x) +
                 (d - b) * u.x * u.y;
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          float t = u_time * 0.3;
          vec2 driftOffset = vec2(u_drift * 0.8, u_drift * 0.5);
          
          uv += u_entropy * 0.15 * vec2(
            sin(uv.y * 12.0 + t),
            cos(uv.x * 12.0 + t)
          );

          float n = noise(uv * (5.0 + u_drift * 8.0) + driftOffset + t);
          float pulse = sin(u_time * u_resonance * 3.0) * 0.6 + 0.7;
          float intensity = n * 0.8 * (0.5 + u_drift * 1.2) * pulse;

          vec3 baseColor = vec3(0.0, 0.85, 1.0);
          vec3 color = baseColor * intensity;

          gl_FragColor = vec4(color, intensity * 0.8);
        }
      `,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const startTime = performance.now();

    function animate() {
      const elapsed = (performance.now() - startTime) / 1000;
      uniforms.u_time.value = elapsed;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!uniformsRef.current) return;
    uniformsRef.current.u_drift.value = drift;
    uniformsRef.current.u_entropy.value = entropy;
    uniformsRef.current.u_resonance.value = resonance;
  }, [drift, entropy, resonance]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none"
      }}
    />
  );
}
