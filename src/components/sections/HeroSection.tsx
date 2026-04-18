"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float, Sphere, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import Link from "next/link";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

function NeuralBrainVisual() {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generate nodes and edges
  const { pointsGeometry, linesGeometry } = useMemo(() => {
    const pts = [];
    const numNodes = 1500;
    
    for (let i = 0; i < numNodes; i++) {
       // Two hemispheres logic
       const isLeft = Math.random() > 0.5;
       const xOff = isLeft ? -0.4 : 0.4;
       
       // Random position within a sphere
       const u = Math.random();
       const v = Math.random();
       const theta = 2 * Math.PI * u;
       const phi = Math.acos(2 * v - 1);
       
       const r = 1.3 + Math.random() * 0.5; // Brain volume radius
       // Shape deformation to look more like a brain
       const x = r * Math.sin(phi) * Math.cos(theta) * 0.8 + xOff;
       const y = r * Math.sin(phi) * Math.sin(theta) * 0.85;
       const z = r * Math.cos(phi) * 1.1;
       
       pts.push(new THREE.Vector3(x, y, z));
    }
    
    // Create Nerves (edges) connecting nearby points
    const linePositions = [];
    const lineColors = [];
    
    for (let i = 0; i < pts.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < pts.length; j++) {
        const dist = pts[i].distanceTo(pts[j]);
        if (dist < 0.35 && connections < 4) {
          linePositions.push(pts[i].x, pts[i].y, pts[i].z);
          linePositions.push(pts[j].x, pts[j].y, pts[j].z);
          // Dark cyan initial baseline format
          lineColors.push(0, 0.4, 0.8);
          lineColors.push(0, 0.4, 0.8);
          connections++;
        }
      }
    }
    
    const pGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    return { pointsGeometry: pGeo, linesGeometry: lGeo };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Rotate brain slowly
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.2;
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
    
    // Simulate electrical signals firing through the nerves
    if (linesRef.current) {
      const colors = linesRef.current.geometry.attributes.color.array as Float32Array;
      for (let i = 0; i < colors.length; i += 6) { 
        // Signal pulse phase based on node index and time
        const intensity = 0.1 + 0.9 * Math.max(0, Math.sin(t * 8 + (i * 0.05)));
        
        // Firing color mapping (Neon teal / cyan)
        colors[i] = 0; 
        colors[i+1] = 0.5 + (0.5 * intensity); 
        colors[i+2] = 0.5 + (0.5 * intensity);
        
        colors[i+3] = 0; 
        colors[i+4] = 0.5 + (0.5 * intensity); 
        colors[i+5] = 0.5 + (0.5 * intensity);
      }
      linesRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1.5}>
      <group ref={groupRef}>
        <points geometry={pointsGeometry}>
          <pointsMaterial color="#00E5FF" size={0.02} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
        <lineSegments ref={linesRef} geometry={linesGeometry}>
          <lineBasicMaterial vertexColors transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
        </lineSegments>
      </group>
    </Float>
  );
}

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* 3D Neural Brain Background */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
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
            <span className="text-lavender neon-text-lavender">3RD YR CSE.</span><br />
            AI & DATA SCIENCE.
          </h1>
        </motion.div>

        <motion.p 
          className="font-mono text-gray-300 text-[10px] sm:text-xs md:text-md mt-6 sm:mt-8 max-w-lg tracking-[0.15em] sm:tracking-widest leading-relaxed uppercase font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          3rd year CSE student at Geethanjali College of Engineering and Technology
        </motion.p>

        {/* Buttons */}
        <motion.div 
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pointer-events-auto w-full max-w-[280px] sm:max-w-none px-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link href="/projects" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-gradient-to-br from-lavender to-[#8d7fff] text-obsidian px-8 py-3.5 sm:py-4 rounded-md font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold hover-lift">
              Explore Projects
            </button>
          </Link>
          <a href="/Mourya_Resume.pdf" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-black/60 backdrop-blur-xl border border-white/20 text-white px-8 py-3.5 sm:py-4 rounded-md font-mono text-[10px] sm:text-xs uppercase tracking-widest hover-lift shadow-2xl">
              View Resume
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
