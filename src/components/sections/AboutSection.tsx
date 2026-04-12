"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import myPhoto from "@/../public/myphoto.jpg";

const typewriterText = `Initializing background process...
I am a Computer Science engineer who operates at the intersection of low-level systems, hardware-software integration, and scalable industrial solutions.

My work focuses on building the underlying logic that allows complex hardware to communicate with the digital world.

My philosophy: I don't just write applications; I build the systems they run on. Whether it's writing a kernel, emulating a radiation detector, or engineering long-range signals for agri-tech, I specialize in solving the "hard problems".`;

export default function AboutSection() {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(typewriterText.slice(0, index));
      index++;
      if (index > typewriterText.length) clearInterval(interval);
    }, 20); // typing speed
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen pt-24 pb-16 px-6 lg:px-24 flex flex-col justify-start">
      <div className="mb-10">
        <p className="font-mono text-teal text-[10px] tracking-widest uppercase mb-4 opacity-80">
          NEURAL IDENTITY
        </p>
        <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white">
          SYSTEM_PROFILE <span className="text-ash italic opacity-60">// BIO</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Registry Panel */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-xl font-mono text-xs text-ash tracking-widest uppercase flex flex-col gap-6">
            <h4 className="text-[10px] opacity-50 mb-2">METADATA_FIELDS</h4>
            <div>
              <div className="opacity-50 text-[9px]">LOCATION</div>
              <div className="text-white">HYDERABAD, IN</div>
            </div>
            <div>
              <div className="opacity-50 text-[9px]">UPTIME</div>
              <div className="text-white">20_YEARS</div>
            </div>
            <div>
              <div className="opacity-50 text-[9px]">BORN</div>
              <div className="text-white">30_08_2005</div>
            </div>
            <div>
              <div className="opacity-50 text-[9px]">STATUS</div>
              <div className="text-white">B.TECH_CSE_STUDENT</div>
            </div>
            <div>
              <div className="opacity-50 text-[9px]">EDUCATION</div>
              <div className="text-white">GEETHANJALI_COLLEGE</div>
            </div>
            <div>
              <div className="opacity-50 text-[9px]">PRIMARY_INPUT</div>
              <div className="text-white">AI_ENGINEER_&_DATA_SCIENTIST</div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl flex flex-col gap-4">
             <div className="font-mono text-xs text-teal tracking-widest uppercase">INTEGRITY_CHECK</div>
             <div className="w-full h-1 bg-white/10 mt-2 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-lavender shadow-[0_0_8px_rgba(161,138,255,0.8)]"
                initial={{ width: "0%" }}
                whileInView={{ width: "92%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between font-mono text-[9px] text-ash tracking-widest uppercase">
              <span>COGNITIVE LOAD</span>
              <span>[92%]</span>
            </div>
          </div>
        </div>

        {/* Center: Biometric ID */}
        <div className="glass-panel p-2 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group hover-lift aspect-[3/4] lg:aspect-auto">
           {/* Fallback pattern / image */}
           <div className="absolute inset-0 bg-gradient-to-b from-indigo/50 to-obsidian/80 mix-blend-multiply z-10" />
           <div className="w-full h-full relative z-0">
             <Image 
               src={myPhoto} 
               alt="Mourya Birru Biometric Scan" 
               fill 
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 animate-glitch filter hue-rotate-[260deg] saturate-[2.5] brightness-[1.2] contrast-[1.2]"
               priority
             />
             <div className="absolute inset-0 bg-lavender/30 mix-blend-hard-light pointer-events-none z-10" />
             <div className="absolute inset-0 bg-indigo/20 mix-blend-screen pointer-events-none z-10" />
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
           </div>
           
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 glass-panel rounded-md uppercase font-mono text-[9px] tracking-widest text-white border border-teal/30 shadow-[0_0_10px_rgba(0,229,255,0.2)] animate-pulse">
             ENTITY: MRY_BIRRU.EXT
           </div>
        </div>

        {/* Right Code Panel */}
        <div className="glass-panel p-6 rounded-xl flex flex-col font-mono text-xs">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
            </div>
            <span className="text-[10px] text-ash/60 tracking-widest ml-4">BIO_SOURCE_RAW.SH</span>
          </div>

          <div className="mb-6 text-teal opacity-90">
            $ cat user_intent.txt
          </div>
          
          <div className="text-ash/90 leading-relaxed whitespace-pre-wrap min-h-[200px]">
             {typedText}
             <span className="animate-pulse">_</span>
          </div>

          <div className="mt-8 flex gap-3 text-teal">
            $ <span className="text-ash/60 text-[10px] uppercase gap-2 flex flex-wrap">
              <span className="bg-white/5 px-2 py-1 rounded">Neural_Arch</span>
              <span className="bg-white/5 px-2 py-1 rounded">Glassmorphism_Expert</span>
              <span className="bg-white/5 px-2 py-1 rounded">Ethical_AI</span>
            </span>
          </div>
        </div>

      </div>

      {/* Lower Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 relative z-10">
         <motion.div whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }} className="glass-panel p-6 rounded-xl border-l-[3px] border-l-lavender">
           <h4 className="font-display font-medium text-lg text-white mb-2">Systems Engineering</h4>
           <p className="text-xs font-sans text-ash/80 leading-relaxed">Developing low-level OS components, memory-safe kernels, and bridging hardware with software.</p>
         </motion.div>

         <motion.div whileHover={{ rotateX: 5, rotateY: 5, scale: 1.02 }} className="glass-panel p-6 rounded-xl border-l-[3px] border-l-teal">
           <h4 className="font-display font-medium text-lg text-white mb-2">Industrial Integration</h4>
           <p className="text-xs font-sans text-ash/80 leading-relaxed">Architecting robust connectivity and data exchange systems for large-scale, complex environments.</p>
         </motion.div>

         <Link href="/expertise" className="block w-full">
           <motion.div whileHover={{ rotateX: -5, rotateY: 5, scale: 1.02 }} className="glass-panel p-6 rounded-xl flex items-center justify-between group cursor-pointer border-l-[3px] border-l-white/20">
             <div>
               <h4 className="font-display font-medium text-lg text-white mb-1 uppercase">System Architecture</h4>
               <p className="font-mono text-[9px] text-teal tracking-widest uppercase">Initiate_Protocol_Sync</p>
             </div>
             <div className="text-ash group-hover:text-teal transition-colors">→</div>
           </motion.div>
         </Link>
      </div>

      {/* Education Registry */}
      <div className="mt-24 mb-16 relative z-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-[1px] flex-1 bg-white/10" />
          <h3 className="font-mono text-xs text-lavender tracking-[0.3em] uppercase opacity-80">
            ACADEMIC_REGISTRY
          </h3>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "GCET (HYDERABAD)",
              period: "SEP 2023 – JAN 2027",
              degree: "B.Tech in CSE",
              grade: "8.25 GPA",
              border: "border-l-lavender"
            },
            {
              title: "RESONANCE EDU",
              period: "SEP 2022 – MAR 2023",
              degree: "Intermediate, MPC",
              grade: "84.9%",
              border: "border-l-teal"
            },
            {
              title: "RGUKT BASARA",
              period: "MAY 2021 – AUG 2022",
              degree: "PUC, MPC",
              grade: "N/A",
              border: "border-l-ash"
            },
            {
              title: "PALLAVI MODEL",
              period: "2015 – 2021",
              degree: "Schooling",
              grade: "88.7%",
              border: "border-l-white/20"
            }
          ].map((edu, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`glass-panel p-6 rounded-xl border-l-[3px] ${edu.border} hover-lift`}
            >
              <div className="font-mono text-[9px] text-ash tracking-widest uppercase mb-2 opacity-60">
                {edu.period}
              </div>
              <h4 className="font-display font-medium text-lg text-white mb-1 uppercase tracking-tight">
                {edu.title}
              </h4>
              <p className="text-xs font-sans text-ash/80 leading-relaxed mb-4">
                {edu.degree}
              </p>
              <div className="font-mono text-[10px] text-teal tracking-widest uppercase">
                STATUS: {edu.grade}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
