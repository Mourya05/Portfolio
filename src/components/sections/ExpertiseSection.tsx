"use client";

import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
// @ts-expect-error - maath does not have complete typescript definitions for esm paths
import * as random from "maath/random/dist/maath-random.esm";
import { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { BashAnimation } from "./ProjectsSection";

function EndlessCodeStream() {
  const ref = useRef<any>(null);
  const count = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Random lines with "indentation"
        pos[i * 3] = (Math.random() - 0.5) * 1.5;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
        const posAttr = ref.current.geometry.attributes.position;
        for (let i = 0; i < count; i++) {
            let y = posAttr.getY(i);
            y -= delta * 1.5; // Constant downward flow
            if (y < -2) y = 2; // Wrap around
            posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00E5FF" size={0.03} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  );
}

function SignalWave() {
  const ref = useRef<any>(null);
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        pos[i * 3] = (i - count / 2) * 0.02;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      const posAttr = ref.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const x = posAttr.getX(i);
        posAttr.setY(i, Math.sin(x * 5 + state.clock.elapsedTime * 5) * 0.6);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#A18AFF" size={0.06} sizeAttenuation={true} depthWrite={false} opacity={0.8} />
    </Points>
  );
}

function CircuitLogic() {
  const ref = useRef<any>(null);
  const count = 1000;
  const [positions] = useState(() => random.inBox(new Float32Array(count * 3), { sides: [2, 2, 2] }) as Float32Array);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2;
      const posAttr = ref.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        // Subtle pulsing of "circuit nodes"
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        const z = posAttr.getZ(i);
        const pulse = Math.sin(state.clock.elapsedTime * 2 + x + y) * 0.002;
        posAttr.setX(i, x + pulse);
        posAttr.setY(i, y + pulse);
        posAttr.setZ(i, z + pulse);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial transparent color="#94A3B8" size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.8} />
        </Points>
    </group>
  );
}

function AgenticFace() {
  const ref = useRef<any>(null);
  // Procedurally generate a head-like ellipsoid point cloud
  const count = 3000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        
        const r = 1.0;
        // Distort into a head shape
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 0.8;
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 1.1;
        pos[i * 3 + 2] = r * Math.cos(phi) * 0.9;
        
        // Add "eye" hollows
        if (Math.abs(pos[i * 3 + 1] - 0.3) < 0.2 && Math.abs(pos[i * 3]) > 0.2 && pos[i * 3 + 2] > 0) {
            pos[i * 3 + 2] *= 0.8;
        }
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5; // Constant rotation
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00E5FF" size={0.03} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  );
}

export default function ExpertiseSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const capabilities = [
    {
      reg: "REG_01 // INDUSTRIAL",
      title: "INDUSTRIAL SOFTWARE ENGINEERING",
      description: "Architecting long-range communication signals to facilitate reliable data exchange in environments where traditional networking fails.",
      details: "Building the underlying logic for agri-tech solutions, focusing on signal stability and scalable middleware for industrial hardware.",
      skills: ['SYSTEMS_ARCH', 'DATA_EXCHANGE', 'AGRI_TECH', 'ROBUST_COMMS'],
      border: "border-l-teal",
      accent: "#00E5FF",
      visual: BashAnimation
    },
    {
      reg: "REG_02 // HARDWARE",
      title: "HARDWARE EMULATION & PHYSICS",
      description: "Developing 'soft clones' of complex radiation-identification circuits to enable sophisticated nuclear physics experiments.",
      details: "Emulating hardware-level logic gates and physical signal processing in software to bridge digital analysis with physical sensors.",
      skills: ['SIGNAL_PROC', 'CIRCUIT_EMU', 'PHYSICS_LOGIC', 'LATENCY_OPT'],
      border: "border-l-lavender",
      accent: "#A18AFF",
      visual: SignalWave
    },
    {
      reg: "REG_03 // KERNEL",
      title: "LOW-LEVEL OS DEVELOPMENT",
      description: "Building a custom 32-bit x86 operating system from scratch, driven by a 'metal-up' philosophy.",
      details: "Implementing core kernel functionalities including paging, segmentation, and context switching using i686-elf-gcc and QEMU.",
      skills: ['KERNEL_ARCH', 'PAGING', 'X86_ASM', 'MEMORY_SAFETY'],
      border: "border-l-ash",
      accent: "#94A3B8",
      visual: CircuitLogic
    },
    {
      reg: "REG_04 // SPECIALIZED",
      title: "AI & DATA SCIENCE",
      description: "Architecting Agentic AI swarms, securing machine learning modules, and leveraging data science for industrial insights.",
      details: "Developing Model Armor for AI security and optimizing facial recognition systems for edge deployment on low-power hardware.",
      skills: ['AGENTIC_AI', 'MODEL_ARMOR', 'NLP', 'EDGE_COMPUTE'],
      border: "border-l-white/20",
      accent: "#00E5FF",
      visual: AgenticFace
    }
  ];

  const handleToggle = (idx: number) => {
    if (hoveredIndex === idx) setHoveredIndex(null);
    else setHoveredIndex(idx);
  };

  return (
    <section className="relative w-full min-h-screen py-24 sm:py-32 px-4 sm:px-6 lg:px-24 flex flex-col justify-center">
      {/* HUD Header */}
      <div className="mb-12 sm:mb-16">
        <p className="font-mono text-teal text-[10px] tracking-widest uppercase mb-4 opacity-80">
          -- EXECUTIVE // REGISTRY
        </p>
        <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white">
          CORE <span className="text-lavender italic opacity-90">// CAPABILITIES</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 z-10 relative">
        {capabilities.map((cap, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleToggle(idx)}
            className={`glass-panel p-6 sm:p-8 rounded-xl flex flex-col transition-all duration-500 overflow-hidden relative group cursor-crosshair ${cap.border} ${hoveredIndex === idx ? 'scale-[1.01] sm:scale-[1.02] shadow-[0_0_30px_rgba(0,229,255,0.15)] bg-white/[0.04]' : 'bg-white/[0.02]'}`}
            style={{ minHeight: '300px' }}
          >
            <div className="font-mono text-[9px] sm:text-[10px] text-ash tracking-widest uppercase mb-4 opacity-70">
              {cap.reg}
            </div>
            
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-4 transition-colors duration-300 group-hover:text-teal font-jetbrains">
              {cap.title}
            </h3>

            <p className="font-sans text-ash/80 text-xs sm:text-sm leading-relaxed mb-6">
              {cap.description}
            </p>

            <motion.div 
              initial={false}
              animate={{ height: hoveredIndex === idx ? "auto" : 0, opacity: hoveredIndex === idx ? 1 : 0 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-white/10 mt-2">
                <p className="font-mono text-white/50 text-[9px] sm:text-[10px] leading-relaxed mb-6 italic tracking-wider">
                   {">>"} DETAILED_FOCUS: {cap.details}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cap.skills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 sm:px-3 sm:py-1 bg-teal/5 border border-teal/20 rounded-md font-mono text-[7px] sm:text-[8px] text-teal tracking-widest uppercase">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="mt-auto pt-6 flex items-center justify-between">
               <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                 <motion.div 
                   className="absolute top-0 left-0 h-full bg-teal shadow-[0_0_10px_rgba(0,229,255,1)]"
                   initial={{ x: "-100%" }}
                   animate={{ x: hoveredIndex === idx ? "0%" : "-100%" }}
                   transition={{ duration: 0.8, ease: "easeInOut" }}
                 />
               </div>
               <span className="font-mono text-[9px] sm:text-[10px] text-ash/40 ml-4 group-hover:text-teal transition-colors whitespace-nowrap uppercase tracking-widest">
                 {hoveredIndex === idx ? 'SYSTEM_EXPANDED' : 'TAP_TO_ENGAGE'}
               </span>
            </div>

            {/* Visual element for the corner - adjusted for mobile */}
            <div className="absolute -top-12 -right-12 sm:-top-8 sm:-right-8 w-48 h-48 sm:w-64 sm:h-64 opacity-20 sm:opacity-30 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none">
               <Canvas camera={{ position: [0, 0, 4] }}>
                 <cap.visual isHovered={hoveredIndex === idx} />
               </Canvas>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Professional Log */}
      <div className="mt-32 relative z-10">
        <div className="mb-10">
          <p className="font-mono text-ash text-[9px] tracking-[0.2em] uppercase mb-2 opacity-50">
            [ LOG_TYPE: DEPLOYMENT_HISTORY ]
          </p>
          <h3 className="font-display font-bold text-3xl text-white">
            SERVICE <span className="text-teal italic opacity-80">// LOGS</span>
          </h3>
        </div>

        <div className="glass-panel rounded-xl overflow-hidden border border-white/5">
          <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/40" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
              <div className="w-2 h-2 rounded-full bg-green-500/40" />
            </div>
            <span className="font-mono text-[9px] text-ash/60 tracking-widest">DEPLOYMENT_ARCHIVE_V2.0</span>
          </div>
          
          <div className="p-6 font-mono text-xs flex flex-col gap-4 max-h-[500px] overflow-y-auto custom-scrollbar">
            {[
              { date: "APR 2026 - PRESENT", company: "AVASAN CHAKRA", role: "Software Engineer", skills: "Software Design, Systems Eng" },
              { date: "DEC 2024 - PRESENT", company: "GCET CODING CLUB", role: "PR Head", skills: "Leadership, Communication" },
              { date: "FEB 2024 - PRESENT", company: "ISTE", role: "Student Member", skills: "Technical Leadership" },
              { date: "AUG 2025 - DEC 2025", company: "IEEE EdSoc", role: "Webmaster", skills: "Python, SQL, JS" },
              { date: "JUL 2025 - DEC 2025", company: "GOOGLE", role: "Student Ambassador", skills: "Time Management, Leadership" },
              { date: "SEP 2024 - DEC 2025", company: "IEEE COMPUTER SOCIETY", role: "Student Member", skills: "C, Algorithms, Analytical" },
              { date: "MAY 2025 - AUG 2025", company: "SUPRAJA TECHNOLOGIES", role: "Cyber Security Intern", skills: "Ethical Hacking, Kali Linux" },
              { date: "APR 2025 - JUN 2025", company: "AGNIRVA.COM SPACE", role: "AI Intern", skills: "Generative AI, LLMs" }
            ].map((exp, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col md:flex-row gap-4 border-b border-white/5 pb-4 last:border-0 group"
              >
                <div className="text-teal opacity-60 w-44 shrink-0">
                  [{exp.date}]
                </div>
                <div className="flex-1">
                  <span className="text-white group-hover:text-lavender transition-colors uppercase font-bold">{exp.role}</span>
                  <span className="text-ash/40 mx-2">@</span>
                  <span className="text-ash tracking-tight font-semibold">{exp.company}</span>
                  <div className="mt-1 text-[10px] text-ash/60 italic">
                    &gt;&gt; INIT_TAGS: {exp.skills}
                  </div>
                </div>
                <div className="hidden md:block text-ash/20 select-none">
                  S_00{idx + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stack Registers Footer Ticker */}
      <div className="mt-24 border-t border-white/10 pt-6 overflow-hidden">
         <div className="flex items-center gap-12 font-mono text-xs text-ash tracking-[0.2em] uppercase whitespace-nowrap opacity-60">
            {/* simple repetition for ticker effect */}
            {['C/C++', 'PYTHON', 'OPENCV', 'MACH_LEARNING', 'REACT/NODE', 'LINUX_OS', 'SYSTEMS_ENG', 'POSIX'].map((tech, i) => (
              <span key={i} className="flex items-center gap-4">
                {tech} <span className="w-1.5 h-1.5 rounded-full bg-ash/30" />
              </span>
            ))}
         </div>
      </div>
    </section>
  );
}
