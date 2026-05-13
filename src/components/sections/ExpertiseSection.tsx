"use client";

import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
// @ts-expect-error - maath does not have complete typescript definitions for esm paths
import * as random from "maath/random/dist/maath-random.esm";
import { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { BashAnimation } from "./ProjectsSection";
import SkillLogOverlay, { type CapabilitySkillData } from "../SkillLogOverlay";

// ─── Per-capability skill registry data ───────────────────────────────────────
const skillRegistry: CapabilitySkillData[] = [
  {
    reg: "REG_01 // INDUSTRIAL",
    title: "INDUSTRIAL SOFTWARE ENGINEERING",
    accent: "#00E5FF",
    categories: [
      {
        label: "Languages",
        tag: "LANG",
        color: "#00E5FF",
        items: ["C", "C++", "Python", "Bash / Shell Script"],
      },
      {
        label: "Protocols & Comms",
        tag: "PROTO",
        color: "#39FF14",
        items: ["LoRa / LoRaWAN", "MQTT", "UART / SPI / I2C", "TCP/IP Sockets"],
      },
      {
        label: "Frameworks & Middleware",
        tag: "FW",
        color: "#A18AFF",
        items: ["FreeRTOS", "Linux IPC (pipes, shmem)", "Protobuf / MsgPack"],
      },
      {
        label: "Tools",
        tag: "TOOLS",
        color: "#94A3B8",
        items: ["GCC Toolchain", "Make / CMake", "Valgrind", "Wireshark", "Git"],
      },
      {
        label: "Concepts",
        tag: "CONCEPTS",
        color: "#FFD700",
        items: ["Systems Architecture", "Scalable Middleware", "Agri-tech IoT", "Signal Reliability"],
      },
    ],
  },
  {
    reg: "REG_02 // HARDWARE",
    title: "HARDWARE EMULATION & PHYSICS",
    accent: "#A18AFF",
    categories: [
      {
        label: "Languages",
        tag: "LANG",
        color: "#A18AFF",
        items: ["C", "Python", "VHDL (basic)", "Octave / MATLAB-like"],
      },
      {
        label: "Emulation & Simulation",
        tag: "SIM",
        color: "#00E5FF",
        items: ["QEMU", "Soft-cloning ADC/DAC logic", "Pulse-Height Analysis (PHA)", "MCA Emulation"],
      },
      {
        label: "Physics Domains",
        tag: "PHYS",
        color: "#39FF14",
        items: ["Nuclear Radiation Detection", "Signal Spectroscopy", "Geiger-Müller Counting", "Gamma Spectrum Analysis"],
      },
      {
        label: "Libraries & Tools",
        tag: "LIBS",
        color: "#94A3B8",
        items: ["NumPy / SciPy", "Matplotlib", "ROOT (CERN)", "Custom DSP Filters"],
      },
      {
        label: "Concepts",
        tag: "CONCEPTS",
        color: "#FFD700",
        items: ["Hardware-Software Co-design", "Latency Optimization", "Circuit Emulation", "Digital Signal Processing"],
      },
    ],
  },
  {
    reg: "REG_03 // KERNEL",
    title: "LOW-LEVEL OS DEVELOPMENT",
    accent: "#94A3B8",
    categories: [
      {
        label: "Languages",
        tag: "LANG",
        color: "#94A3B8",
        items: ["C (i686-elf-gcc)", "x86 Assembly (NASM)", "Linker Scripts (ld)"],
      },
      {
        label: "Kernel Subsystems",
        tag: "KERN",
        color: "#00E5FF",
        items: ["GDT / IDT / TSS", "Memory Paging (CR0, CR3)", "System Calls (int 0x80)", "Context Switching", "VGA Framebuffer"],
      },
      {
        label: "Toolchain",
        tag: "TOOL",
        color: "#39FF14",
        items: ["i686-elf-gcc Cross Compiler", "NASM Assembler", "GNU ld", "QEMU Emulator", "GDB Remote Debug"],
      },
      {
        label: "OS Concepts",
        tag: "OS",
        color: "#A18AFF",
        items: ["Protected Mode (Ring 0–3)", "Physical / Virtual Memory", "IRQ & PIC Remapping", "ELF Loading", "Multiboot"],
      },
      {
        label: "Security",
        tag: "SEC",
        color: "#FFD700",
        items: ["Memory Safety", "Stack Canaries", "Privilege Separation", "DPL Enforcement"],
      },
    ],
  },
  {
    reg: "REG_04 // SPECIALIZED",
    title: "AI & DATA SCIENCE",
    accent: "#00E5FF",
    categories: [
      {
        label: "Languages",
        tag: "LANG",
        color: "#00E5FF",
        items: ["Python", "SQL", "JavaScript (Node.js)"],
      },
      {
        label: "ML / AI Frameworks",
        tag: "AI",
        color: "#A18AFF",
        items: ["TensorFlow / Keras", "scikit-learn", "OpenCV", "SpaCy (NLP)", "LangChain / Agentic AI"],
      },
      {
        label: "Data Science",
        tag: "DATA",
        color: "#39FF14",
        items: ["NumPy / Pandas", "Matplotlib / Seaborn", "Feature Engineering", "Model Evaluation & Tuning"],
      },
      {
        label: "Deployment & Edge",
        tag: "EDGE",
        color: "#FFD700",
        items: ["TensorFlow Lite", "ONNX Runtime", "Raspberry Pi Inference", "Docker Containers"],
      },
      {
        label: "Concepts",
        tag: "CONCEPTS",
        color: "#94A3B8",
        items: ["Agentic AI Swarms", "Model Armor / AI Security", "Facial Recognition", "LLM Prompt Engineering", "Edge Compute Optimization"],
      },
    ],
  },
];

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
  const [activeSkill, setActiveSkill] = useState<number | null>(null);

  const capabilities = [
    {
      reg: "REG_01 // INDUSTRIAL",
      title: "INDUSTRIAL SOFTWARE ENGINEERING",
      description: "Architecting long-range communication signals to facilitate reliable data exchange in environments where traditional networking fails.",
      border: "border-l-teal",
      accent: "#00E5FF",
      visual: BashAnimation
    },
    {
      reg: "REG_02 // HARDWARE",
      title: "HARDWARE EMULATION & PHYSICS",
      description: "Developing 'soft clones' of complex radiation-identification circuits to enable sophisticated nuclear physics experiments.",
      border: "border-l-lavender",
      accent: "#A18AFF",
      visual: SignalWave
    },
    {
      reg: "REG_03 // KERNEL",
      title: "LOW-LEVEL OS DEVELOPMENT",
      description: "Building a custom 32-bit x86 operating system from scratch, driven by a 'metal-up' philosophy.",
      border: "border-l-ash",
      accent: "#94A3B8",
      visual: CircuitLogic
    },
    {
      reg: "REG_04 // SPECIALIZED",
      title: "AI & DATA SCIENCE",
      description: "Architecting Agentic AI swarms, securing machine learning modules, and leveraging data science for industrial insights.",
      border: "border-l-white/20",
      accent: "#00E5FF",
      visual: AgenticFace
    }
  ];

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
            onClick={() => setActiveSkill(idx)}
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

            <div className="mt-auto pt-6 flex items-center justify-between">
               <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                 <motion.div 
                   className="absolute top-0 left-0 h-full bg-teal shadow-[0_0_10px_rgba(0,229,255,1)]"
                   initial={{ x: "-100%" }}
                   animate={{ x: hoveredIndex === idx ? "0%" : "-100%" }}
                   transition={{ duration: 0.8, ease: "easeInOut" }}
                 />
               </div>

               {/* CTA label */}
               <motion.span
                 className="font-mono text-[9px] sm:text-[10px] ml-4 whitespace-nowrap uppercase tracking-widest select-none"
                 animate={hoveredIndex === idx
                   ? { color: cap.accent, textShadow: `0 0 14px ${cap.accent}` }
                   : { color: "rgba(148,163,184,0.4)", textShadow: "none" }
                 }
                 transition={{ duration: 0.3 }}
               >
                 {hoveredIndex === idx ? "▶ ACCESS_SKILL_LOG" : "TAP_TO_ENGAGE"}
               </motion.span>
            </div>

            {/* Visual element for the corner */}
            <div className="absolute -top-12 -right-12 sm:-top-8 sm:-right-8 w-48 h-48 sm:w-64 sm:h-64 opacity-20 sm:opacity-30 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none">
               <Canvas camera={{ position: [0, 0, 4] }}>
                 <cap.visual isHovered={hoveredIndex === idx} />
               </Canvas>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Skill Log Overlay */}
      <SkillLogOverlay
        data={activeSkill !== null ? skillRegistry[activeSkill] : null}
        onClose={() => setActiveSkill(null)}
      />

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
