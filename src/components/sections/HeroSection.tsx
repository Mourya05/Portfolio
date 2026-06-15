"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { motion } from "framer-motion";
import Link from "next/link";

import * as THREE from "three";
import { useMemo, useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";

// ─── Touch device detection hook ─────────────────────────────────────────────
// Detects ACTUAL touch hardware (hover: none + pointer: coarse) rather than
// viewport width — so Chrome DevTools still shows 3D, real phones get SVG.
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

// ─── Lightweight SVG Neural Net (2D mobile fallback) ─────────────────────────
function NeuralSVGFallback() {
  const nodes = [
    { cx: "50%", cy: "45%", r: 4, delay: "0s" },
    { cx: "30%", cy: "30%", r: 3, delay: "0.4s" },
    { cx: "70%", cy: "28%", r: 3, delay: "0.8s" },
    { cx: "20%", cy: "55%", r: 2.5, delay: "0.2s" },
    { cx: "80%", cy: "60%", r: 2.5, delay: "0.6s" },
    { cx: "40%", cy: "65%", r: 3, delay: "1.0s" },
    { cx: "60%", cy: "70%", r: 2.5, delay: "0.3s" },
    { cx: "15%", cy: "40%", r: 2, delay: "0.9s" },
    { cx: "85%", cy: "40%", r: 2, delay: "0.5s" },
    { cx: "50%", cy: "20%", r: 2, delay: "0.7s" },
    { cx: "35%", cy: "80%", r: 2, delay: "1.2s" },
    { cx: "65%", cy: "82%", r: 2, delay: "0.1s" },
  ];

  const edges = [
    ["50%", "45%", "30%", "30%"],
    ["50%", "45%", "70%", "28%"],
    ["50%", "45%", "40%", "65%"],
    ["50%", "45%", "60%", "70%"],
    ["30%", "30%", "20%", "55%"],
    ["30%", "30%", "15%", "40%"],
    ["70%", "28%", "85%", "40%"],
    ["70%", "28%", "80%", "60%"],
    ["80%", "60%", "65%", "82%"],
    ["20%", "55%", "35%", "80%"],
    ["40%", "65%", "35%", "80%"],
    ["60%", "70%", "65%", "82%"],
    ["50%", "20%", "30%", "30%"],
    ["50%", "20%", "70%", "28%"],
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-60"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <style>{`
          @keyframes node-pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.9; }
          }
          @keyframes edge-pulse {
            0%, 100% { stroke-opacity: 0.08; }
            50% { stroke-opacity: 0.35; }
          }
          .neural-node { animation: node-pulse 3s ease-in-out infinite; }
          .neural-edge { animation: edge-pulse 3s ease-in-out infinite; }
        `}</style>
        <filter id="svg-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {edges.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#00E5FF"
          strokeWidth="0.8"
          className="neural-edge"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
      {nodes.map((node, i) => (
        <circle
          key={i}
          cx={node.cx}
          cy={node.cy}
          r={node.r}
          fill="#00E5FF"
          filter="url(#svg-glow)"
          className="neural-node"
          style={{ animationDelay: node.delay }}
        />
      ))}
    </svg>
  );
}

// ─── 3D Neural Brain (desktop only) ──────────────────────────────────────────
function NeuralBrainVisual() {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { pointsGeometry, linesGeometry } = useMemo(() => {
    const pts = [];
    const numNodes = 1500;

    for (let i = 0; i < numNodes; i++) {
      const isLeft = Math.random() > 0.5;
      const xOff = isLeft ? -0.4 : 0.4;
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 1.3 + Math.random() * 0.5;
      const x = r * Math.sin(phi) * Math.cos(theta) * 0.8 + xOff;
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.85;
      const z = r * Math.cos(phi) * 1.1;
      pts.push(new THREE.Vector3(x, y, z));
    }

    const linePositions = [];
    const lineColors = [];

    for (let i = 0; i < pts.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < pts.length; j++) {
        const dist = pts[i].distanceTo(pts[j]);
        if (dist < 0.35 && connections < 4) {
          linePositions.push(pts[i].x, pts[i].y, pts[i].z);
          linePositions.push(pts[j].x, pts[j].y, pts[j].z);
          lineColors.push(0, 0.4, 0.8);
          lineColors.push(0, 0.4, 0.8);
          connections++;
        }
      }
    }

    const pGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    lGeo.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));

    return { pointsGeometry: pGeo, linesGeometry: lGeo };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.2;
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
    if (linesRef.current) {
      const colors = linesRef.current.geometry.attributes.color.array as Float32Array;
      for (let i = 0; i < colors.length; i += 6) {
        const intensity = 0.1 + 0.9 * Math.max(0, Math.sin(t * 8 + i * 0.05));
        colors[i] = 0;
        colors[i + 1] = 0.5 + 0.5 * intensity;
        colors[i + 2] = 0.5 + 0.5 * intensity;
        colors[i + 3] = 0;
        colors[i + 4] = 0.5 + 0.5 * intensity;
        colors[i + 5] = 0.5 + 0.5 * intensity;
      }
      linesRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1.5}>
      <group ref={groupRef}>
        <points geometry={pointsGeometry}>
          <pointsMaterial
            color="#00E5FF"
            size={0.02}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
        <lineSegments ref={linesRef} geometry={linesGeometry}>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      </group>
    </Float>
  );
}

export default function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Visual — lightweight SVG on mobile, 3D Canvas on desktop */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        {isMobile ? (
          <NeuralSVGFallback />
        ) : (
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <NeuralBrainVisual />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
              maxPolarAngle={Math.PI / 2 + 0.2}
              minPolarAngle={Math.PI / 2 - 0.2}
            />
          </Canvas>
        )}
      </div>

      {/* Typography Overlay */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pointer-events-none w-full h-full justify-center">
        {/* Dark radial gradient to improve contrast behind text */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.7)_0%,transparent_60%)] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="px-4"
        >
          <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-7xl lg:text-[5rem] leading-[1.1] tracking-[-0.02em] text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
            MOURYA BIRRU.<br />
            <span className="text-lavender neon-text-lavender">4TH YR CSE.</span><br />
            AI &amp; DATA SCIENCE.
          </h1>
        </motion.div>

        <motion.p
          className="font-mono text-gray-300 text-[10px] sm:text-xs md:text-md mt-6 sm:mt-8 max-w-lg tracking-[0.15em] sm:tracking-widest leading-relaxed uppercase font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          4th year CSE student at Geethanjali College of Engineering and Technology
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pointer-events-auto w-full max-w-[320px] sm:max-w-none px-6 mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link href="/projects" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-gradient-to-br from-lavender to-[#8d7fff] text-obsidian px-8 py-4 rounded-md font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold hover-lift min-h-[48px]">
              Explore Projects
            </button>
          </Link>
          <a href="/Mourya_Resume.pdf" download="Mourya_Resume.pdf" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-black/60 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-md font-mono text-[10px] sm:text-xs uppercase tracking-widest hover-lift shadow-2xl min-h-[48px]">
              Download Resume
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
