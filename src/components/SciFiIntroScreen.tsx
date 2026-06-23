"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (
      args[0] &&
      typeof args[0] === "string" &&
      args[0].includes("Clock") &&
      args[0].includes("deprecated")
    ) {
      return;
    }
    originalWarn(...args);
  };
}

export default function SciFiIntroScreen() {
  const [status, setStatus] = useState<"scanning" | "target-found" | "hidden">("scanning");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [coords, setCoords] = useState({ lat: "17.3850° N", lng: "78.4867° E" });
  
  const logIntervalRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  // Run search sequence automatically on mount
  useEffect(() => {
    // 1. Progress Loader (0 to 100 over 4.5 seconds)
    const startTime = Date.now();
    const duration = 4400; // 4.4 seconds of scan
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      
      // Update coordinates randomly around GCET/Hyderabad area
      const randomOffsetLat = (Math.random() - 0.5) * 0.01;
      const randomOffsetLng = (Math.random() - 0.5) * 0.01;
      setCoords({
        lat: `${(17.3850 + randomOffsetLat).toFixed(4)}° N`,
        lng: `${(78.4867 + randomOffsetLng).toFixed(4)}° E`
      });

      if (pct >= 100) {
        clearInterval(progressIntervalRef.current);
      }
    }, 50);

    // 2. Cyber logs timeline
    const logsList = [
      "INIT COLD TARGET SCAN...",
      "OPENING SOCKET PIPELINES...",
      "SPAWNING AGENTIC SWARMS...",
      "SHIELDING LOCAL IP BOUNDS: 127.0.0.1",
      "QUERYING NUCLEONIX ALLOWLISTS...",
      "SUPABASE IDENTITY LICENSE: OK",
      "RETRIEVING HARDWARE SPECIFICATIONS...",
      "RUNNING BAYESIAN RECOGNITION MAP...",
      "RECONSTRUCTING TARGET MATRIX...",
      "BIOMETRIC INTERCEPT: 99.8% PROFILE MATCH",
      "UPDATING GEOLOCATION COORDINATES...",
      "LOCKING ON TARGET OBJECT..."
    ];

    let logIdx = 0;
    setLogs([logsList[0]]);
    logIntervalRef.current = setInterval(() => {
      logIdx++;
      if (logIdx < logsList.length) {
        setLogs(prev => [...prev, logsList[logIdx]]);
      } else {
        clearInterval(logIntervalRef.current);
      }
    }, 360);

    // 3. Trigger target found at 4.6 seconds
    const targetFoundTimeout = setTimeout(() => {
      clearInterval(progressIntervalRef.current);
      clearInterval(logIntervalRef.current);
      setProgress(100);
      setStatus("target-found");

      // Dispatch intro finished event for music fade in
      if (typeof window !== "undefined") {
        (window as any).__introFinished = true;
        window.dispatchEvent(new Event("intro-finished"));
      }

      // Hide loading screen after 1.8 seconds of target confirmation
      setTimeout(() => {
        setStatus("hidden");
      }, 1800);
    }, 4600);

    return () => {
      clearInterval(progressIntervalRef.current);
      clearInterval(logIntervalRef.current);
      clearTimeout(targetFoundTimeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {status !== "hidden" && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#020205] text-[#00E5FF] font-mono flex flex-col items-center justify-center p-4 selection:bg-transparent overflow-hidden"
        >
        {/* Hologram scanlines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none z-10 opacity-70" />

        {/* Outer border system */}
        <div className="absolute inset-6 border border-[#00E5FF]/20 rounded-lg pointer-events-none z-20 flex flex-col justify-between p-4">
          <div className="flex justify-between text-[9px] text-[#00E5FF]/40 tracking-[0.2em]">
            <span>SYSTEM_GATEWAY_V1.98</span>
            <span>RESTRICTED_ACCESS</span>
          </div>
          <div className="flex justify-between text-[9px] text-[#00E5FF]/40 tracking-[0.2em]">
            <span>SECURE_LINK // TRACE</span>
            <span>PORTFOLIO_ONLINE</span>
          </div>
        </div>

        {/* Radial screen vignette grid */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black pointer-events-none z-10" />

        <div className="w-full max-w-lg relative z-20 flex flex-col items-center">
          {status === "scanning" && (
            <div className="w-full flex flex-col items-center">
              {/* Spinning search radar HUD */}
              <div className="relative w-40 h-40 mb-10 flex items-center justify-center">
                {/* Concentric grid lines */}
                <div className="absolute inset-0 rounded-full border border-[#00E5FF]/10" />
                <div className="absolute inset-6 rounded-full border border-[#00E5FF]/20 border-dashed" />
                <div className="absolute inset-12 rounded-full border border-[#A18AFF]/30" />
                
                {/* Scanning Sweep line */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_60%,rgba(0,229,255,0.15)_95%,rgba(0,229,255,0.6)_100%)]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                />

                {/* Tracking reticle dots */}
                <div className="absolute top-8 left-10 w-2.5 h-2.5 rounded-full bg-[#39FF14] animate-ping" />
                <div className="absolute bottom-12 right-8 w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                
                {/* Horizontal & Vertical Crosshairs */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#00E5FF]/20" />
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#00E5FF]/20" />
              </div>

              {/* Title & Target searching display */}
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold tracking-[0.2em] text-white uppercase animate-pulse">
                  SEARCHING FOR TARGET...
                </h2>
                <div className="text-[#39FF14] text-[15px] font-bold tracking-[0.1em] mt-1">
                  MOURYA BIRRU
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white/5 border border-white/10 rounded-md p-0.5 mb-8">
                <div
                  className="h-3 bg-gradient-to-r from-[#00E5FF] to-[#A18AFF] rounded-sm transition-all duration-75 relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-scan-bar" />
                </div>
              </div>

              {/* Side diagnostics and coordinates */}
              <div className="w-full flex justify-between font-mono text-[10px] text-[#A18AFF] mb-8 border-b border-[#00E5FF]/10 pb-4">
                <div>
                  <span className="text-[#00E5FF]/50">LAT:</span> {coords.lat}
                </div>
                <div className="text-center font-bold text-white text-[12px]">
                  {progress}% INDEXED
                </div>
                <div>
                  <span className="text-[#00E5FF]/50">LON:</span> {coords.lng}
                </div>
              </div>

              {/* Scrolling terminal logs */}
              <div className="w-full h-32 bg-[#020205] border border-[#00E5FF]/10 rounded p-4 text-[10px] text-[#88A0A0] text-left overflow-y-auto flex flex-col gap-1 shadow-inner relative">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-[#00E5FF]/40">[{((idx * 0.36)).toFixed(2)}s]</span>
                    <span className={log.startsWith("[OK]") || log.includes("OK") ? "text-[#39FF14]" : log.startsWith("[WARN]") ? "text-[#FF4D4D]" : ""}>
                      {log}
                    </span>
                  </div>
                ))}
                <div className="text-[#00E5FF] animate-pulse mt-1">&gt;_ RUNNING PORTAL_QUERY...</div>
              </div>
            </div>
          )}

          {/* ── STATE: TARGET FOUND ── */}
          {status === "target-found" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full flex flex-col items-center p-6 border-2 border-[#39FF14] bg-[#020502]/90 rounded-xl shadow-[0_0_35px_rgba(57,255,20,0.25)] text-center relative overflow-hidden"
            >
              {/* Background scanning matrix grid */}
              <div className="absolute inset-0 bg-[#39FF14]/5 pointer-events-none" />

              {/* Success Lock Crosshair corner animations */}
              <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#39FF14]" />
              <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#39FF14]" />
              <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#39FF14]" />
              <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#39FF14]" />

              <div className="w-16 h-16 rounded-full border-2 border-[#39FF14] flex items-center justify-center mb-6 animate-pulse">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#39FF14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-[0.3em] text-[#39FF14] uppercase mb-4">
                TARGET FOUND
              </h2>

              <div className="border border-[#39FF14]/30 bg-[#39FF14]/5 rounded p-4 font-mono text-[12px] text-white text-left w-full flex flex-col gap-2">
                <div>
                  <span className="text-[#39FF14]/60 uppercase">IDENTITY:</span> MOURYA BIRRU
                </div>
                <div>
                  <span className="text-[#39FF14]/60 uppercase">ROLE:</span> AI ENGINEER / SDE
                </div>
                <div>
                  <span className="text-[#39FF14]/60 uppercase">LOCATED:</span> HYDERABAD, INDIA
                </div>
                <div>
                  <span className="text-[#39FF14]/60 uppercase">DECRYPT:</span> DEC_KEY_VAL_0x83F9
                </div>
                <div className="text-[#39FF14] font-bold text-center mt-3 tracking-[0.2em] animate-pulse">
                  ACCESS GRANTED // BOOTING PORTAL
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Global CSS animation definitions */}
        <style>{`
          @keyframes scan-bar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-scan-bar {
            animation: scan-bar 1.5s linear infinite;
          }
          .animate-spin-slow {
            animation: spin 8s linear infinite;
          }
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
