"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { name: "HOME", path: "/" },
  { name: "ABOUT", path: "/about" },
  { name: "EXPERTISE", path: "/expertise" },
  { name: "PROJECTS", path: "/projects" },
  { name: "CONTACT", path: "/contact" }
];

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 glass-panel rounded-full px-6 py-4 flex items-center justify-between"
      >
        <Link href="/" className="font-display font-bold text-lg md:text-xl tracking-wider text-white">
          Mourya&apos;s Domain
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "relative font-mono text-xs tracking-widest transition-colors duration-300",
                pathname === item.path ? "text-white" : "text-ash hover:text-white"
              )}
            >
              {item.name}
              {pathname === item.path && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute left-0 right-0 -bottom-2 h-[2px] bg-teal shadow-[0_0_8px_rgba(0,229,255,0.8)]"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/contact" className="hidden sm:block">
            <button className="bg-gradient-to-br from-lavender to-[#8d7fff] text-obsidian font-mono text-xs px-6 py-2.5 rounded-full hover-lift uppercase font-bold tracking-widest">
              INITIATE
            </button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-50"
          >
            <motion.span 
              animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
              className="w-6 h-0.5 bg-white rounded-full block" 
            />
            <motion.span 
              animate={{ opacity: isOpen ? 0 : 1 }}
              className="w-6 h-0.5 bg-white rounded-full block" 
            />
            <motion.span 
              animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
              className="w-6 h-0.5 bg-white rounded-full block" 
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-obsidian/95 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center"
          >
            <div className="flex flex-col gap-8 items-center">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "font-display text-4xl font-bold tracking-tighter transition-colors",
                      pathname === item.path ? "text-teal" : "text-white"
                    )}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              
              <Link href="/contact" onClick={() => setIsOpen(false)} className="mt-8">
                <button className="bg-gradient-to-br from-teal to-lavender text-obsidian font-mono text-sm px-10 py-4 rounded-full font-bold tracking-[0.2em]">
                  INITIATE_COMMS
                </button>
              </Link>
            </div>

            <div className="absolute bottom-10 font-mono text-[10px] text-ash tracking-widest opacity-40">
              -- SECURE_DOMAIN_V2.0 --
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
