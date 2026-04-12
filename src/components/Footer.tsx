"use client";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter, FaDribbble } from "react-icons/fa";

const links = [
  { name: "GITHUB", icon: FaGithub, url: "https://github.com/Mourya05" },
  { name: "LINKEDIN", icon: FaLinkedin, url: "https://www.linkedin.com/in/mourya-birru-8336342a7/" },
];

export default function Footer() {
  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-panel rounded-full px-6 py-3 z-50"
    >
      <div className="flex items-center gap-6 md:gap-12">
        {links.map((link) => (
          <a 
            key={link.name} 
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-1.5 text-ash hover:text-teal transition-colors"
          >
            <link.icon size={18} className="group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] transition-all" />
            <span className="font-mono text-[9px] tracking-widest uppercase">{link.name}</span>
          </a>
        ))}
      </div>
    </motion.div>
  );
}
