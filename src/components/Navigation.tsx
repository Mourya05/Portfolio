"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "HOME", path: "/" },
  { name: "ABOUT", path: "/about" },
  { name: "EXPERTISE", path: "/expertise" },
  { name: "PROJECTS", path: "/projects" },
  { name: "CONTACT", path: "/contact" }
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 glass-panel rounded-full px-8 py-4 flex items-center justify-between"
    >
      <div className="font-display font-bold text-xl tracking-wider text-white">
        Mourya&apos;s Domain
      </div>
      
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

      <Link href="/contact">
        <button className="bg-gradient-to-br from-lavender to-[#8d7fff] text-obsidian font-mono text-xs px-6 py-2.5 rounded-full hover-lift uppercase font-bold tracking-widest">
          INITIATE
        </button>
      </Link>
    </motion.nav>
  );
}
