"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import myPhoto from "@/../public/myphoto.jpeg";

export default function AboutSection() {
  return (
    <section className="relative w-full min-h-screen pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-24 flex flex-col justify-start">
      <div className="mb-10">
        <p className="font-mono text-teal text-[10px] tracking-widest uppercase mb-4 opacity-80">
          About
        </p>
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white">
          Background{" "}
          <span className="text-ash italic opacity-60">// Profile</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">

        {/* Left Profile Panel */}
        <div className="flex flex-col gap-6 order-2 lg:order-1">
          <div className="glass-panel p-6 rounded-xl font-mono text-xs text-ash tracking-widest uppercase flex flex-col gap-6">
            <h4 className="text-[10px] opacity-50 mb-2">Profile</h4>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-6 lg:gap-6">
              <div>
                <div className="opacity-50 text-[9px]">Location</div>
                <div className="text-white text-[10px] sm:text-xs">Hyderabad, IN</div>
              </div>
              <div>
                <div className="opacity-50 text-[9px]">Status</div>
                <div className="text-white text-[10px] sm:text-xs">B.Tech CSE Student</div>
              </div>
              <div>
                <div className="opacity-50 text-[9px]">College</div>
                <div className="text-white text-[10px] sm:text-xs">Geethanjali College (GCET)</div>
              </div>
              <div>
                <div className="opacity-50 text-[9px]">Specialty</div>
                <div className="text-white text-[10px] sm:text-xs">Systems &amp; Embedded Eng.</div>
              </div>
              <div>
                <div className="opacity-50 text-[9px]">GPA</div>
                <div className="text-white text-[10px] sm:text-xs">8.22 / 10.0</div>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Photo */}
        <motion.div
          initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          viewport={{ once: true }}
          className="glass-panel p-2 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group hover-lift h-64 sm:h-96 lg:h-auto order-1 lg:order-2"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-indigo/20 to-obsidian/40 mix-blend-multiply z-10" />
          <div className="w-full h-full relative z-0">
            <Image
              src={myPhoto}
              alt="Mourya Birru — Systems & Embedded Engineer"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-top opacity-100 transition-opacity duration-500 filter hue-rotate-[260deg] saturate-[2.5] brightness-[1.5] contrast-[1.1]"
              priority
            />
            <div className="absolute inset-0 bg-lavender/15 mix-blend-hard-light pointer-events-none z-10" />
            <div className="absolute inset-0 bg-indigo/10 mix-blend-screen pointer-events-none z-10" />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 glass-panel rounded-md uppercase font-mono text-[9px] tracking-widest text-white border border-teal/30 shadow-[0_0_10px_rgba(0,229,255,0.2)]">
            Mourya Birru
          </div>
        </motion.div>

        {/* Right Bio Panel */}
        <div className="glass-panel p-6 rounded-xl flex flex-col font-mono text-xs order-3">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
            </div>
            <span className="text-[10px] text-ash/60 tracking-widest ml-4">about.txt</span>
          </div>

          <div className="mb-4 text-teal/80 text-[10px]">
            $ cat about.txt
          </div>

          <div className="text-ash/90 leading-relaxed text-[10px] sm:text-xs space-y-4">
            <p>
              I&apos;m a Computer Science engineer who works at the intersection of low-level systems, hardware-software integration, and industrial embedded applications.
            </p>
            <p>
              My primary focus is building the underlying logic that allows complex hardware to communicate with the digital world — whether that&apos;s writing a 32-bit OS kernel from scratch, implementing BLE data pipelines for radiation detectors, or building POSIX-compliant shells in C.
            </p>
            <p>
              Philosophy: I don&apos;t just write applications — I build the systems they run on.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {["Bare-Metal OS", "BLE Integration", "Linux/POSIX", "C / C++", "x86 Assembly"].map((tag) => (
              <span key={tag} className="bg-white/5 px-2 py-1 rounded text-[9px] text-ash/70 border border-white/10">
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Capability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 relative z-10">
        <motion.div
          whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
          className="glass-panel p-6 rounded-xl border-l-[3px] border-l-lavender"
        >
          <h4 className="font-display font-medium text-lg text-white mb-2">Systems &amp; Embedded</h4>
          <p className="text-xs font-sans text-ash/80 leading-relaxed">
            Bare-metal OS development, BLE hardware integration, POSIX shell implementation, and industrial IoT applications.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
          className="glass-panel p-6 rounded-xl border-l-[3px] border-l-teal"
        >
          <h4 className="font-display font-medium text-lg text-white mb-2">Software Engineering</h4>
          <p className="text-xs font-sans text-ash/80 leading-relaxed">
            Full-stack mobile and web applications — React Native, Node.js, REST APIs, SQLite — applied to real hardware problems.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ rotateX: 5, rotateY: 5, scale: 1.02 }}
          className="glass-panel p-6 rounded-xl border-l-[3px] border-l-white/20"
        >
          <h4 className="font-display font-medium text-lg text-white mb-2">Mathematical Reasoning</h4>
          <p className="text-xs font-sans text-ash/80 leading-relaxed">
            Probabilistic modelling, Bayesian inference, and statistical analysis — applied to recognition and classification problems.
          </p>
        </motion.div>
      </div>

      {/* Education */}
      <div className="mt-12 sm:mt-24 mb-16 relative z-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-[1px] flex-1 bg-white/10" />
          <h3 className="font-mono text-xs text-lavender tracking-[0.3em] uppercase opacity-80">
            Education
          </h3>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Geethanjali College of Engineering and Technology",
              period: "2023 – 2027",
              degree: "B.Tech in Computer Science and Engineering",
              grade: "8.22 / 10.0 GPA",
              border: "border-l-lavender"
            },
            {
              title: "Resonance Junior College / RGUKT Basar",
              period: "2021 – 2023",
              degree: "Intermediate (MPC) / Pre-University Course",
              grade: "84.9%",
              border: "border-l-teal"
            },
            {
              title: "Pallavi Model School",
              period: "2015 – 2021",
              degree: "CBSE — Class X",
              grade: "87.8%",
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
              <h4 className="font-display font-medium text-base text-white mb-1 leading-snug">
                {edu.title}
              </h4>
              <p className="text-xs font-sans text-ash/80 leading-relaxed mb-4">
                {edu.degree}
              </p>
              <div className="font-mono text-[10px] text-teal tracking-widest uppercase">
                {edu.grade}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
