"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
// @ts-expect-error - maath does not have complete typescript definitions for esm paths
import * as random from "maath/random/dist/maath-random.esm";
import { useFrame } from "@react-three/fiber";

function BrushVisual() {
  const ref = useRef<any>(null);
  const [positions] = useState(() => random.inSphere(new Float32Array(3000), { radius: 1.5 }) as Float32Array);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
      ref.current.rotation.z += delta * 0.2;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00E5FF" size={0.02} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function ScanVisual() {
  const ref = useRef<any>(null);
  const [positions] = useState(() => random.inBox(new Float32Array(3000), { sides: [2, 2, 2] }) as Float32Array);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#A18AFF" size={0.03} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function HelixVisual() {
  const ref = useRef<any>(null);
  const points = useMemo(() => {
    const p = new Float32Array(3000);
    for (let i = 0; i < 1000; i++) {
        const t = (i / 1000) * Math.PI * 8;
        p[i * 3] = Math.cos(t) * 0.8;
        p[i * 3 + 1] = (i / 1000) * 4 - 2;
        p[i * 3 + 2] = Math.sin(t) * 0.8;
    }
    return p;
  }, []);
  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta;
  });
  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00FF41" size={0.04} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function FlowVisual() {
  const ref = useRef<any>(null);
  const [positions] = useState(() => random.inSphere(new Float32Array(1500), { radius: 1.2 }) as Float32Array);
  useFrame((state) => {
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#D1D1D1" size={0.05} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function KernelRain() {
  const ref = useRef<any>(null);
  const [positions] = useState(() => random.inBox(new Float32Array(3000), { sides: [2, 2, 2] }) as Float32Array);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.y -= delta * 2;
      if (ref.current.position.y < -2) ref.current.position.y = 2;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00E5FF" size={0.02} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function PriceChart() {
  const ref = useRef<any>(null);
  const points = useMemo(() => {
    const p = new Float32Array(6000);
    for (let i = 0; i < 2000; i++) {
        p[i * 3] = (i / 2000) * 4 - 2;
        p[i * 3 + 1] = Math.sin(i * 0.05) * 0.5 + Math.random() * 0.2;
        p[i * 3 + 2] = 0;
    }
    return p;
  }, []);
  useFrame((state) => {
    if (ref.current) {
        ref.current.position.x = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });
  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#A18AFF" size={0.03} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function SignalBurst() {
  const ref = useRef<any>(null);
  const [positions] = useState(() => random.inSphere(new Float32Array(3000), { radius: 1.0 }) as Float32Array);
  useFrame((state) => {
    if (ref.current) {
        const s = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
        ref.current.scale.set(s, s, s);
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00E5FF" size={0.04} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  );
}

function SecurityGrid() {
  const ref = useRef<any>(null);
  const [positions] = useState(() => random.inBox(new Float32Array(1500), { sides: [1.5, 1.5, 1.5] }) as Float32Array);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.3;
      ref.current.rotation.y += delta * 0.3;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#94A3B8" size={0.06} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function NetworkTree() {
  const ref = useRef<any>(null);
  const [positions] = useState(() => random.inSphere(new Float32Array(1200), { radius: 1.3 }) as Float32Array);
  useFrame((state) => {
    if (ref.current) {
        ref.current.rotation.y += 0.005;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#c7bfff" size={0.03} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

const projects = [
  {
    title: "Air Canvas | Motion Tracking",
    tags: ["Python", "OpenCV"],
    description: "Developed an interactive 'Air Canvas' application that allows users to draw on a digital screen by moving their hands in the air. Real-time processing and hand tracking mapped to virtual coordinates.",
    visual: BrushVisual,
    tag: "MOTION_NODE",
    repoUrl: "https://github.com/Mourya05/Air-Canvas"
  },
  {
    title: "Student Attendance System",
    tags: ["Python", "OpenCV", "Biometrics"],
    description: "Automated attendance system using Biometric Identification via facial recognition, replacing traditional manual methods and logging data to an SQL database.",
    visual: ScanVisual,
    tag: "BIO_SCAN",
    repoUrl: "https://github.com/Mourya05/Student-Attendance-through-facial-recognition"
  },
  {
    title: "Eat-IQ | Nutrition Tracker",
    tags: ["React.js", "AI"],
    description: "Wellness application designed to help users make smarter dietary choices through data-driven insights. Built comprehensive dashboard for tracking caloric intake and hydration.",
    visual: HelixVisual,
    tag: "DATA_HELIX",
    repoUrl: "https://github.com/Mourya05/Eat-IQ"
  },
  {
    title: "Career-Compass | Roadmaps",
    tags: ["React", "Node.js", "AI"],
    description: "Interactive platform bridging current skill sets and industry demands by providing customized career roadmaps, integrating a robust recommendation engine.",
    visual: FlowVisual,
    tag: "PATH_ARCH",
    repoUrl: "https://github.com/Mourya05/Career-Compass"
  },
  {
    title: "Custom Linux Shell",
    tags: ["C", "POSIX"],
    description: "Developed a functional Unix-like shell from scratch in C, implementing the core read-eval-print loop (REPL), process management via fork and exec, and memory safety.",
    visual: KernelRain,
    tag: "ROOT_SHELL",
    repoUrl: "https://github.com/Mourya05/Built-Own-Shell"
  },
  {
    title: "Bitcoin-Predictor",
    tags: ["Machine Learning", "Python"],
    description: "Engineered a predictive model to forecast Bitcoin price movements using historical market data, leveraging extensive data cleaning, normalization, and feature engineering.",
    visual: PriceChart,
    tag: "MARKET_SIG",
    repoUrl: "https://github.com/Mourya05/Bitcoin-Predictor"
  },
  {
    title: "ChatBot-in-Python | NLP",
    tags: ["Python", "NLP"],
    description: "Intelligent conversational agent using Python and NLP techniques (SpaCy) for text processing, tokenization, and intent recognition to simulate human-like interactions.",
    visual: SignalBurst,
    tag: "NEURAL_VOICE",
    repoUrl: "https://github.com/Mourya05/ChatBot-in-Python"
  },
  {
    title: "Banking System Management",
    tags: ["C"],
    description: "Beginner-level C program simulating an OOP-like banking system allowing account creation, deposits, and displaying transaction history, utilizing binary file storage.",
    visual: SecurityGrid,
    tag: "LEDGER_LOCK",
    repoUrl: "https://github.com/Mourya05/banking_system_management"
  },
  {
    title: "Training Center Management",
    tags: ["C", "ERP"],
    description: "ERP system handling student data in a job training center. Allows addition, deletion, searching, and editing profiles and course catalogs.",
    visual: NetworkTree,
    tag: "NODE_REG",
    repoUrl: "https://github.com/Mourya05/training_center_management"
  }
];

const ProjectCard = ({ index, title, tags, description, visual: Visual, tag, repoUrl }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="glass-panel p-6 lg:p-10 rounded-2xl flex flex-col md:flex-row gap-10 mt-16 max-w-5xl mx-auto w-full relative z-10 group"
    >
      {/* 3D Visual Left */}
      <div className="w-full md:w-[40%] aspect-square rounded-xl bg-black/40 border border-white/5 relative overflow-hidden flex items-center justify-center">
         <div className="absolute top-4 left-4 font-mono text-[9px] text-teal tracking-widest uppercase z-20">{tag}</div>
         <div className="w-full h-full">
           <Canvas camera={{ position: [0, 0, 3] }}>
             <Visual />
           </Canvas>
         </div>
      </div>

      {/* Content Right */}
      <div className="w-full md:w-[60%] flex flex-col justify-center">
        <div className="flex gap-3 mb-6">
          {tags.map((t: string) => (
            <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-[9px] text-lavender tracking-wider uppercase">
              {t}
            </span>
          ))}
        </div>
        
        <h3 className="font-display font-bold text-3xl md:text-4xl text-white mb-6 uppercase group-hover:text-teal transition-colors">
          {title}
        </h3>
        
        <p className="font-sans text-ash/90 text-sm leading-relaxed mb-10 max-w-lg">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-4 mt-auto">
          <a href={repoUrl} target="_blank" rel="noopener noreferrer">
            <button className="bg-gradient-to-br from-lavender to-[#8d7fff] text-obsidian px-8 py-3 rounded-md font-mono text-[10px] uppercase tracking-widest font-bold hover-lift">
              Launch Probe
            </button>
          </a>
          <a href={repoUrl} target="_blank" rel="noopener noreferrer">
            <button className="bg-transparent border border-white/20 text-white px-8 py-3 rounded-md font-mono text-[10px] uppercase tracking-widest hover-lift">
              Read Logs
            </button>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default function ProjectsSection() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section ref={containerRef} className="relative w-full py-32 px-6 flex flex-col items-center">
      
      {/* Section Header */}
      <div className="text-center mb-10 flex flex-col items-center">
        <div className="px-4 py-1.5 glass-panel rounded-full font-mono text-[9px] text-ash tracking-widest uppercase mb-8">
          SYSTEM PROJECTS / 009
        </div>
        <h2 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-white mb-4">
          Neural Systems<br />Portfolio
        </h2>
        <p className="font-sans text-ash text-sm max-w-lg mx-auto text-center">
          Deep archival data of experimental synthetic consciousness frameworks and kernel architectures.
        </p>
      </div>

      {/* Projects Focus Area */}
      <div className="w-full flex-col flex gap-32 pb-32">
        {projects.map((proj, idx) => (
          <ProjectCard 
            key={proj.title}
            index={idx + 1}
            {...proj}
          />
        ))}
      </div>

      {/* Data Footer Ticker */}
      <div className="w-full max-w-6xl mx-auto border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center font-mono text-[10px] text-ash tracking-widest uppercase opacity-70 gap-4 mt-10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-teal shadow-[0_0_8px_#00E5FF]"></div>
          ARCHIVE_LINK_ESTABLISHED
        </div>
        <div className="hidden md:block">PROTOCOL 7.4.1</div>
        <div className="flex gap-8">
          <span>LATENCY: 14ms</span>
          <span>THROUGHPUT: 1.2 TB/s</span>
        </div>
        <div className="w-4 h-4 rounded-full border border-ash flex items-center justify-center text-[8px]">?</div>
      </div>

      {/* Depth Controls */}
      <div className="flex flex-col items-center mt-20 gap-4">
         <div className="flex gap-12">
            <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-teal transition-colors">
              ↑
            </button>
            <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-teal transition-colors">
              ↓
            </button>
         </div>
         <div className="font-mono text-[9px] text-ash tracking-[0.2em] uppercase mt-2">
           SCROLL TO DEPTH
         </div>
      </div>

    </section>
  );
}
