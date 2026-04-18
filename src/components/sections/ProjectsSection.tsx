"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
// @ts-expect-error - maath does not have complete typescript definitions for esm paths
import * as random from "maath/random/dist/maath-random.esm";
import { useFrame } from "@react-three/fiber";

function DrawingAnimation() {
  const ref = useRef<any>(null);
  const count = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 20;
        pos[i * 3] = Math.cos(t * 0.5) * Math.sin(t * 0.3) * 1.2;
        pos[i * 3 + 1] = Math.sin(t * 0.5) * Math.cos(t * 0.2) * 1.2;
        pos[i * 3 + 2] = Math.sin(t * 0.1) * 0.5;
    }
    return pos;
  }, []);
  useFrame((state, delta) => {
    if (ref.current) {
        ref.current.rotation.z += delta * 0.5;
        ref.current.rotation.y += delta * 0.2;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00E5FF" size={0.02} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function FaceScanAnimation() {
  const ref = useRef<any>(null);
  const scanRef = useRef<any>(null);
  const count = 3000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = 0.8 * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = 1.1 * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = 0.8 * Math.cos(phi);
        if (pos[i * 3 + 1] > 0.4 && Math.abs(pos[i * 3]) < 0.3 && pos[i * 3 + 2] > 0.5) pos[i * 3 + 2] *= 0.7; // eye hollows
    }
    return pos;
  }, []);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y += 0.01;
    if (scanRef.current) {
        const scanY = Math.sin(state.clock.elapsedTime * 2) * 1.2;
        scanRef.current.position.y = scanY;
    }
  });
  return (
    <group>
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial transparent color="#A18AFF" size={0.02} sizeAttenuation={true} depthWrite={false} />
        </Points>
        <mesh ref={scanRef} position={[0, 0, 0]}>
            <boxGeometry args={[2, 0.02, 2]} />
            <meshBasicMaterial color="#00E5FF" transparent opacity={0.3} />
        </mesh>
    </group>
  );
}

function FoodScanAnimation() {
  const ref = useRef<any>(null);
  const count = 1500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const set = Math.floor(Math.random() * 3);
        const ox = (set - 1) * 0.8;
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.4;
        pos[i * 3] = ox + Math.cos(theta) * r;
        pos[i * 3 + 1] = Math.sin(theta) * r;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return pos;
  }, []);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.02;
    }
  });
  return (
    <group>
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial transparent color="#D1D1D1" size={0.04} sizeAttenuation={true} depthWrite={false} />
        </Points>
        <gridHelper args={[2, 10, "#00E5FF", "#333"]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.1]} />
    </group>
  );
}

function PaperRotateAnimation() {
  const ref = useRef<any>(null);
  const count = 800;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 1.5;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    return pos;
  }, []);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 1.5;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#94A3B8" size={0.05} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function BashAnimation() {
  const ref = useRef<any>(null);
  const count = 2500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 1.8;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    return pos;
  }, []);
  useFrame((state, delta) => {
    if (ref.current) {
        const posAttr = ref.current.geometry.attributes.position;
        for (let i = 0; i < count; i++) {
            let y = posAttr.getY(i);
            y -= delta * 3;
            if (y < -2) y = 2;
            posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00FF41" size={0.02} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function BitcoinRotateAnimation() {
  const ref = useRef<any>(null);
  const count = 4000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const r = 0.8 + Math.random() * 0.2;
        pos[i * 3] = Math.cos(theta) * r;
        pos[i * 3 + 1] = Math.sin(theta) * r;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
        
        // Add "B" logo points in center
        if (i < 1000) {
            pos[i * 3] = (Math.random() - 0.5) * 0.6;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 1.0;
            pos[i * 3 + 2] = 0.25;
        }
    }
    return pos;
  }, []);
  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 1.5;
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#F7931A" size={0.03} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function ChattingAnimation() {
  const ref = useRef<any>(null);
  const count = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const side = i < count / 2 ? -1 : 1;
        pos[i * 3] = (Math.random() - 0.5) * 0.8 + side * 0.6;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 0.6 + side * 0.3;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    return pos;
  }, []);
  useFrame((state) => {
    if (ref.current) {
        const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        ref.current.scale.set(s, s, s);
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00E5FF" size={0.04} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  );
}

function MoneyAnimation() {
  const ref = useRef<any>(null);
  const count = 2000;
  const [positions] = useState(() => random.inBox(new Float32Array(count * 3), { sides: [2, 4, 0.5] }) as Float32Array);
  useFrame((state, delta) => {
    if (ref.current) {
      const posAttr = ref.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        let y = posAttr.getY(i);
        y -= delta * 2;
        if (y < -2) y = 2;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
      ref.current.rotation.z += 0.005;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00FF41" size={0.04} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function BookAnimation() {
  const ref = useRef<any>(null);
  const count = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const side = i < count / 2 ? -1 : 1;
        const angle = side * 0.5;
        const r = Math.random() * 1.5;
        const h = (Math.random() - 0.5) * 2;
        pos[i * 3] = Math.cos(angle) * r;
        pos[i * 3 + 1] = h;
        pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, []);
  useFrame((state, delta) => {
    if (ref.current) {
        ref.current.rotation.y += delta * 0.5;
        ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#A18AFF" size={0.03} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

const projects = [
  {
    title: "Air Canvas | Motion Tracking",
    tags: ["Python", "OpenCV"],
    description: "Developed an interactive 'Air Canvas' application that allows users to draw on a digital screen by moving their hands in the air. Real-time processing and hand tracking mapped to virtual coordinates.",
    visual: DrawingAnimation,
    tag: "MOTION_NODE",
    repoUrl: "https://github.com/Mourya05/Air-Canvas"
  },
  {
    title: "Student Attendance System",
    tags: ["Python", "OpenCV", "Biometrics"],
    description: "Automated attendance system using Biometric Identification via facial recognition, replacing traditional manual methods and logging data to an SQL database.",
    visual: FaceScanAnimation,
    tag: "BIO_SCAN",
    repoUrl: "https://github.com/Mourya05/Student-Attendance-through-facial-recognition"
  },
  {
    title: "Eat-IQ | Nutrition Tracker",
    tags: ["React.js", "AI"],
    description: "Wellness application designed to help users make smarter dietary choices through data-driven insights. Built comprehensive dashboard for tracking caloric intake and hydration.",
    visual: FoodScanAnimation,
    tag: "DATA_HELIX",
    repoUrl: "https://github.com/Mourya05/Eat-IQ"
  },
  {
    title: "Career-Compass | Roadmaps",
    tags: ["React", "Node.js", "AI"],
    description: "Interactive platform bridging current skill sets and industry demands by providing customized career roadmaps, integrating a robust recommendation engine.",
    visual: PaperRotateAnimation,
    tag: "PATH_ARCH",
    repoUrl: "https://github.com/Mourya05/Career-Compass"
  },
  {
    title: "Custom Linux Shell",
    tags: ["C", "POSIX"],
    description: "Developed a functional Unix-like shell from scratch in C, implementing the core read-eval-print loop (REPL), process management via fork and exec, and memory safety.",
    visual: BashAnimation,
    tag: "ROOT_SHELL",
    repoUrl: "https://github.com/Mourya05/Built-Own-Shell"
  },
  {
    title: "Bitcoin-Predictor",
    tags: ["Machine Learning", "Python"],
    description: "Engineered a predictive model to forecast Bitcoin price movements using historical market data, leveraging extensive data cleaning, normalization, and feature engineering.",
    visual: BitcoinRotateAnimation,
    tag: "MARKET_SIG",
    repoUrl: "https://github.com/Mourya05/Bitcoin-Predictor"
  },
  {
    title: "ChatBot-in-Python | NLP",
    tags: ["Python", "NLP"],
    description: "Intelligent conversational agent using Python and NLP techniques (SpaCy) for text processing, tokenization, and intent recognition to simulate human-like interactions.",
    visual: ChattingAnimation,
    tag: "NEURAL_VOICE",
    repoUrl: "https://github.com/Mourya05/ChatBot-in-Python"
  },
  {
    title: "Banking System Management",
    tags: ["C"],
    description: "Beginner-level C program simulating an OOP-like banking system allowing account creation, deposits, and displaying transaction history, utilizing binary file storage.",
    visual: MoneyAnimation,
    tag: "LEDGER_LOCK",
    repoUrl: "https://github.com/Mourya05/banking_system_management"
  },
  {
    title: "Training Center Management",
    tags: ["C", "ERP"],
    description: "ERP system handling student data in a job training center. Allows addition, deletion, searching, and editing profiles and course catalogs.",
    visual: BookAnimation,
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
      className="glass-panel p-6 sm:p-8 lg:p-10 rounded-2xl flex flex-col md:flex-row gap-8 lg:gap-10 mt-16 max-w-5xl mx-auto w-full relative z-10 group"
    >
      {/* 3D Visual Left */}
      <div className="w-full md:w-[45%] h-[250px] sm:h-[350px] md:h-auto aspect-square md:aspect-auto rounded-xl bg-black/40 border border-white/5 relative overflow-hidden flex items-center justify-center shrink-0">
         <div className="absolute top-4 left-4 font-mono text-[9px] text-teal tracking-widest uppercase z-20 bg-obsidian/60 px-2 py-0.5 rounded">{tag}</div>
         <div className="w-full h-full">
           <Canvas camera={{ position: [0, 0, 3] }}>
             <Visual />
           </Canvas>
         </div>
      </div>

      {/* Content Right */}
      <div className="w-full md:w-[55%] flex flex-col justify-center">
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
          {tags.map((t: string) => (
            <span key={t} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-[9px] text-lavender tracking-wider uppercase">
              {t}
            </span>
          ))}
        </div>
        
        <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-6 uppercase group-hover:text-teal transition-colors">
          {title}
        </h3>
        
        <p className="font-sans text-ash/90 text-sm leading-relaxed mb-10 max-w-lg">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-4 mt-auto">
          <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
            <button className="w-full sm:w-auto bg-gradient-to-br from-lavender to-[#8d7fff] text-obsidian px-8 py-3 rounded-md font-mono text-[10px] uppercase tracking-widest font-bold hover-lift">
              Launch Probe
            </button>
          </a>
          <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
            <button className="w-full sm:w-auto bg-transparent border border-white/20 text-white px-8 py-3 rounded-md font-mono text-[10px] uppercase tracking-widest hover-lift">
              Read Logs
            </button>
          </a>
        </div>
      </div>

      {/* Background decorative index - hidden on small screens for better contrast */}
      <div className="absolute -bottom-4 -right-2 font-display font-black text-[6rem] lg:text-[10rem] text-white/[0.02] pointer-events-none italic select-none hidden sm:block">
        0{index}
      </div>
    </motion.div>
  );
};

export default function ProjectsSection() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section ref={containerRef} className="relative w-full py-24 sm:py-32 px-4 sm:px-6 flex flex-col items-center">
      
      {/* Section Header */}
      <div className="text-center mb-10 flex flex-col items-center w-full px-4">
        <div className="px-4 py-1.5 glass-panel rounded-full font-mono text-[9px] text-ash tracking-widest uppercase mb-8">
          SYSTEM PROJECTS / 009
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 leading-tight">
          Neural Systems<br className="hidden sm:block" /> Portfolio
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
