"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";

/* ─── Mobile Detection ────────────────────────────────────────────────────── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return isMobile;
}

/* ─── Skill Data ──────────────────────────────────────────────────────────── */
const CATEGORIES = [
  {
    id: "lang", label: "Programming Languages", tag: "LANG",
    accent: "#00E5FF", rgb: "0,229,255", pct: 92,
    items: ["C", "C++", "Python", "Java", "JavaScript", "TypeScript", "R", "Golang"],
  },
  {
    id: "ai", label: "AI & Data Science", tag: "AI",
    accent: "#FF6BFF", rgb: "255,107,255", pct: 90,
    items: ["NumPy", "Pandas", "TensorFlow", "OpenCV", "Hugging Face", "LangChain", "LangGraph", "GNN", "CNN", "RNN", "OpenAI API"],
  },
  {
    id: "frontend", label: "Frontend", tag: "FE",
    accent: "#39FF14", rgb: "57,255,20", pct: 85,
    items: ["HTML5", "CSS3", "TailwindCSS", "React.js", "React Native", "AngularJS", "Next.js"],
  },
  {
    id: "backend", label: "Backend & APIs", tag: "BE",
    accent: "#FFD700", rgb: "255,215,0", pct: 83,
    items: ["Flask", "Node.js", "Express.js", "FastAPI", "Streamlit"],
  },
  {
    id: "core", label: "Core Concepts", tag: "CORE",
    accent: "#A18AFF", rgb: "161,138,255", pct: 88,
    items: ["DSA", "OOP", "DBMS", "Software Engineering", "Network Engineering", "Mathematics"],
  },
  {
    id: "cyber", label: "Cybersecurity", tag: "SEC",
    accent: "#FF4444", rgb: "255,68,68", pct: 78,
    items: ["Kali Linux", "Metasploit", "ZenMap", "Nmap", "Wireshark"],
  },
  {
    id: "db", label: "Databases", tag: "DB",
    accent: "#00FFB3", rgb: "0,255,179", pct: 80,
    items: ["MySQL", "PostgreSQL", "MongoDB"],
  },
  {
    id: "tools", label: "Tools & Cloud", tag: "TOOLS",
    accent: "#FFA500", rgb: "255,165,0", pct: 87,
    items: ["Git", "GitHub", "Google Cloud", "VS Code", "n8n", "Power BI", "Linux", "GNU Make"],
  },
  {
    id: "soft", label: "Professional", tag: "SOFT",
    accent: "#94A3B8", rgb: "148,163,184", pct: 95,
    items: ["Problem Solving", "Logical Reasoning", "Critical Thinking", "Leadership", "Communication"],
  },
];

const NODE_CONFIGS = CATEGORIES.map((cat, i) => ({
  ...cat,
  baseAngle:   (i / CATEGORIES.length) * Math.PI * 2,
  orbitRadius: i % 2 === 0 ? 2.0 : 2.55,
  inclination: [0.28, -0.22, 0.48, -0.28, 0.18, -0.42, 0.33, -0.14, 0.38][i],
  orbitSpeed:  0.055 + i * 0.004,
}));

/* ─── Camera Controller ───────────────────────────────────────────────────── */
function CameraController({
  activeWorldPos,
  hasActive,
}: {
  activeWorldPos: React.MutableRefObject<THREE.Vector3>;
  hasActive: boolean;
}) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0, 5.5));

  useFrame((state, delta) => {
    if (hasActive) {
      const p = activeWorldPos.current;
      targetRef.current.set(
        p.x * 0.32,
        p.y * 0.32,
        Math.min(p.z + 3.4, 4.9),
      );
    } else {
      targetRef.current.set(
        state.mouse.x * 0.28,
        state.mouse.y * 0.18,
        5.5,
      );
    }
    camera.position.lerp(targetRef.current, delta * 2.2);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ─── Neural Core ─────────────────────────────────────────────────────────── */
function NeuralCore({ accentHex }: { accentHex: string }) {
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const col      = useMemo(() => new THREE.Color(accentHex), [accentHex]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (innerRef.current) {
      innerRef.current.rotation.y += delta * 0.14;
      innerRef.current.rotation.x  = Math.sin(t * 0.28) * 0.07;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y -= delta * 0.08;
      outerRef.current.rotation.z += delta * 0.055;
    }
    if (pulseRef.current) {
      pulseRef.current.scale.setScalar(1.36 + Math.sin(t * 1.65) * 0.055);
    }
  });

  return (
    <group>
      {/* Solid core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.65, 1]} />
        <meshPhysicalMaterial
          color="#020210"
          emissive={col}
          emissiveIntensity={0.32}
          metalness={0.92}
          roughness={0.06}
        />
      </mesh>

      {/* Wireframe shell */}
      <mesh ref={outerRef} scale={1.14}>
        <icosahedronGeometry args={[0.65, 1]} />
        <meshBasicMaterial
          color={accentHex}
          wireframe
          transparent
          opacity={0.11}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Pulsing glow sphere */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.65, 16, 16]} />
        <meshBasicMaterial
          color={accentHex}
          transparent
          opacity={0.045}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <pointLight color={accentHex} intensity={0.9} distance={3.5} decay={2} />
    </group>
  );
}

/* ─── Ambient Particles ───────────────────────────────────────────────────── */
function AmbientParticles() {
  const ref = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const g   = new THREE.BufferGeometry();
    const pos = new Float32Array(480 * 3);
    for (let i = 0; i < 480; i++) {
      const r  = 3.2 + Math.random() * 3.5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.019;
      ref.current.rotation.x = state.clock.elapsedTime * 0.009;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#00E5FF"
        size={0.011}
        transparent
        opacity={0.32}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Background Plane (deselect target) ──────────────────────────────────── */
function BackgroundPlane({ onDeselect }: { onDeselect: () => void }) {
  return (
    <mesh position={[0, 0, -9]} scale={[50, 50, 1]} onClick={onDeselect}>
      <planeGeometry />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

/* ─── Domain Node ─────────────────────────────────────────────────────────── */
function DomainNode({
  config,
  activeId,
  hoveredId,
  onActivate,
  onHover,
  activeWorldPos,
}: {
  config:          (typeof NODE_CONFIGS)[number];
  activeId:        string | null;
  hoveredId:       string | null;
  onActivate:      (id: string | null) => void;
  onHover:         (id: string | null) => void;
  activeWorldPos:  React.MutableRefObject<THREE.Vector3>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef  = useRef<THREE.Mesh>(null);
  const isActive  = activeId   === config.id;
  const isHovered = hoveredId  === config.id;

  /* ── Initial position so nodes don't all start at origin ── */
  useEffect(() => {
    if (!groupRef.current) return;
    const x = Math.cos(config.baseAngle) * config.orbitRadius;
    const z = Math.sin(config.baseAngle) * config.orbitRadius;
    groupRef.current.position.set(x, 0, z);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state) => {
    if (!groupRef.current) return;
    if (isActive) {
      // Frozen — keep updating shared position ref
      activeWorldPos.current.copy(groupRef.current.position);
      return;
    }
    const t     = state.clock.elapsedTime;
    const angle = config.baseAngle + t * config.orbitSpeed;
    const x     = Math.cos(angle) * config.orbitRadius;
    const y     = Math.sin(config.inclination) * Math.sin(angle) * 0.52;
    const z     = Math.sin(angle) * config.orbitRadius * Math.cos(config.inclination * 0.5);
    const drift = Math.sin(t * 0.72 + config.baseAngle * 5) * 0.038;
    groupRef.current.position.set(x, y + drift, z);

    if (ringRef.current) {
      ringRef.current.rotation.y += 0.012;
      ringRef.current.rotation.x += 0.008;
    }
  });

  /* Card fan positions around the node */
  const cardCount = Math.min(config.items.length, 10);
  const cardPositions = useMemo<[number, number, number][]>(
    () =>
      config.items.slice(0, cardCount).map((_, i) => {
        const a = (i / cardCount) * Math.PI * 2;
        const r = 1.55;
        return [Math.cos(a) * r, Math.sin(a) * r * 0.35, 0.3 + i * 0.02];
      }),
    [config.items, cardCount],
  );

  return (
    <group ref={groupRef}>
      {/* Sphere */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onActivate(isActive ? null : config.id);
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          onHover(config.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          onHover(null);
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[isActive ? 0.145 : 0.1, 20, 20]} />
        <meshStandardMaterial
          color={config.accent}
          emissive={config.accent}
          emissiveIntensity={isHovered || isActive ? 3.2 : 0.75}
        />
      </mesh>

      {/* Spinning torus ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.19, 0.004, 8, 40]} />
        <meshBasicMaterial
          color={config.accent}
          transparent
          opacity={isHovered || isActive ? 0.9 : 0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Glow light */}
      {(isHovered || isActive) && (
        <pointLight
          color={config.accent}
          intensity={isActive ? 3.5 : 1.6}
          distance={2.5}
          decay={2}
        />
      )}

      {/* HTML tag label */}
      <Html center distanceFactor={14} style={{ pointerEvents: "none" }}>
        <div
          style={{
            color:          isActive || isHovered ? config.accent : "rgba(255,255,255,0.38)",
            fontFamily:     "JetBrains Mono, Courier New, monospace",
            fontSize:       "8px",
            letterSpacing:  "0.22em",
            textTransform:  "uppercase",
            textShadow:     isActive || isHovered ? `0 0 14px ${config.accent}` : "none",
            whiteSpace:     "nowrap",
            userSelect:     "none",
            marginTop:      "22px",
            transition:     "all 0.35s ease",
          }}
        >
          {config.tag}
        </div>
      </Html>

      {/* Floating skill cards when active */}
      <AnimatePresence>
        {isActive &&
          config.items.slice(0, cardCount).map((skill, i) => (
            <Html
              key={skill}
              position={cardPositions[i]}
              center
              style={{ pointerEvents: "none" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.2 }}
                transition={{ delay: i * 0.045, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background:     "rgba(0,0,0,0.82)",
                  border:         `1px solid rgba(${config.rgb},0.55)`,
                  borderRadius:   "5px",
                  padding:        "3px 11px",
                  fontFamily:     "JetBrains Mono, Courier New, monospace",
                  fontSize:       "9px",
                  color:          config.accent,
                  whiteSpace:     "nowrap",
                  backdropFilter: "blur(12px)",
                  letterSpacing:  "0.07em",
                  boxShadow:      `0 0 16px rgba(${config.rgb},0.35), inset 0 0 10px rgba(${config.rgb},0.07)`,
                  /* Chromatic aberration via text-shadow */
                  textShadow:     `-1.5px 0 rgba(255,0,80,0.45), 1.5px 0 rgba(0,80,255,0.45), 0 0 10px rgba(${config.rgb},0.9)`,
                }}
              >
                {skill}
              </motion.div>
            </Html>
          ))}
      </AnimatePresence>
    </group>
  );
}

/* ─── Three.js Scene ──────────────────────────────────────────────────────── */
function SkillScene({
  activeId,
  hoveredId,
  onActivate,
  onHover,
}: {
  activeId:   string | null;
  hoveredId:  string | null;
  onActivate: (id: string | null) => void;
  onHover:    (id: string | null) => void;
}) {
  const activeWorldPos = useRef(new THREE.Vector3());

  const accentHex = useMemo(() => {
    const a = NODE_CONFIGS.find((c) => c.id === activeId);
    const h = NODE_CONFIGS.find((c) => c.id === hoveredId);
    return a?.accent ?? h?.accent ?? "#00E5FF";
  }, [activeId, hoveredId]);

  return (
    <>
      <CameraController activeWorldPos={activeWorldPos} hasActive={!!activeId} />
      <ambientLight intensity={0.05} />
      <fog attach="fog" args={["#000008", 7, 15]} />

      <NeuralCore accentHex={accentHex} />
      <AmbientParticles />
      <BackgroundPlane onDeselect={() => onActivate(null)} />

      {NODE_CONFIGS.map((config) => (
        <DomainNode
          key={config.id}
          config={config}
          activeId={activeId}
          hoveredId={hoveredId}
          onActivate={onActivate}
          onHover={onHover}
          activeWorldPos={activeWorldPos}
        />
      ))}
    </>
  );
}

/* ─── Mobile Accordion Fallback ───────────────────────────────────────────── */
function MobileFallback() {
  const [expanded, setExpanded] = useState<string | null>("lang");
  return (
    <div className="w-full py-6 px-4 flex flex-col gap-3">
      {CATEGORIES.map((cat) => (
        <div
          key={cat.id}
          onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
          className="rounded-xl cursor-pointer"
          style={{
            border:     `1px solid rgba(${cat.rgb},${expanded === cat.id ? 0.4 : 0.18})`,
            background: `rgba(${cat.rgb},0.03)`,
          }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <span
              style={{
                color:         cat.accent,
                fontFamily:    "monospace",
                fontSize:      "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {cat.tag} — {cat.label}
            </span>
            <span style={{ color: cat.accent, fontSize: "14px" }}>
              {expanded === cat.id ? "−" : "+"}
            </span>
          </div>
          {expanded === cat.id && (
            <div className="px-4 pb-4 flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <span
                  key={item}
                  style={{
                    border:        `1px solid rgba(${cat.rgb},0.35)`,
                    color:         cat.accent,
                    fontSize:      "9px",
                    fontFamily:    "monospace",
                    padding:       "3px 9px",
                    borderRadius:  "4px",
                    letterSpacing: "0.06em",
                    background:    `rgba(${cat.rgb},0.07)`,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Section ────────────────────────────────────────────────────────── */
export default function ExpertiseSection() {
  const isMobile  = useIsMobile();
  const [activeId,  setActiveId]  = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeCat   = CATEGORIES.find((c) => c.id === activeId);
  const totalSkills = CATEGORIES.reduce((s, c) => s + c.items.length, 0);

  /* Clean up cursor on unmount */
  useEffect(() => () => { document.body.style.cursor = "default"; }, []);

  return (
    <section
      className="relative w-full"
      style={{ background: "#000008" }}
    >
      {/* ── Header ── */}
      <div className="relative z-20 px-6 sm:px-10 lg:px-20 pt-24 sm:pt-32 pb-4 pointer-events-none">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#00E5FF]" />
          <span
            className="font-mono text-[9px] tracking-[0.35em] uppercase"
            style={{ color: "rgba(0,229,255,0.6)" }}
          >
            SKILL_MATRIX // NEURAL_CORE :: v3.0
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-5">
          <div>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-none tracking-tight text-white">
              SKILL{" "}
              <span
                style={{
                  background:            "linear-gradient(135deg,#00E5FF,#A18AFF)",
                  WebkitBackgroundClip:  "text",
                  WebkitTextFillColor:   "transparent",
                  filter:                "drop-shadow(0 0 24px rgba(0,229,255,0.5))",
                }}
              >
                MATRIX
              </span>
            </h2>
            <p className="font-sans text-white/35 text-sm mt-2 max-w-xs leading-relaxed">
              {isMobile
                ? "Tap a module to expand."
                : "Click a domain node to drill into the skill tree."}
            </p>
          </div>

          <div className="flex gap-6 shrink-0">
            <div>
              <div className="font-mono font-black text-2xl text-white">
                {totalSkills}
              </div>
              <div className="font-mono text-[8px] tracking-widest text-white/25 uppercase">
                Total Skills
              </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <div
                className="font-mono font-black text-2xl"
                style={{ color: "#00E5FF" }}
              >
                {CATEGORIES.length}
              </div>
              <div className="font-mono text-[8px] tracking-widest text-white/25 uppercase">
                Domains
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Canvas / Mobile fallback ── */}
      <div className="relative" style={{ height: "72vh", minHeight: 520 }}>
        {isMobile ? (
          <MobileFallback />
        ) : (
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 5.5], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              background: "transparent",
            }}
          >
            <SkillScene
              activeId={activeId}
              hoveredId={hoveredId}
              onActivate={setActiveId}
              onHover={setHoveredId}
            />
          </Canvas>
        )}

        {/* ── Active domain info panel ── */}
        <AnimatePresence>
          {activeCat && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.32 }}
              className="absolute top-4 right-4 sm:right-8 z-20 rounded-xl p-5 w-[230px] pointer-events-auto"
              style={{
                background:     "rgba(0,0,0,0.9)",
                border:         `1px solid rgba(${activeCat.rgb},0.42)`,
                backdropFilter: "blur(24px)",
                boxShadow:      `0 0 40px rgba(${activeCat.rgb},0.2)`,
              }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="font-mono text-[8px] tracking-[0.22em] uppercase"
                  style={{ color: activeCat.accent }}
                >
                  {activeCat.tag} · MODULE
                </span>
                <button
                  onClick={() => setActiveId(null)}
                  className="font-mono text-xs text-white/30 hover:text-white/70 transition-colors"
                >
                  ✕
                </button>
              </div>

              <h3 className="font-display font-bold text-sm text-white mb-2">
                {activeCat.label}
              </h3>

              {/* Accent line */}
              <div
                className="h-px w-full mb-3"
                style={{
                  background: `linear-gradient(to right,${activeCat.accent}70,transparent)`,
                }}
              />

              <div className="font-mono text-[7px] tracking-[0.2em] text-white/25 mb-3">
                {activeCat.pct}% PROFICIENCY · {activeCat.items.length} SKILLS
              </div>

              <div className="flex flex-wrap gap-1.5">
                {activeCat.items.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-[8px] px-2 py-0.5 rounded"
                    style={{
                      color:      activeCat.accent,
                      background: `rgba(${activeCat.rgb},0.1)`,
                      border:     `1px solid rgba(${activeCat.rgb},0.28)`,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint */}
        {!activeId && !isMobile && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/15 animate-pulse">
              ◈ CLICK A NODE TO EXPLORE THE SKILL TREE
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
