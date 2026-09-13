"use client";

import { motion } from "framer-motion";
import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// ─── Touch device detection hook ─────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

// ─── GM Counter Animation ─────────────────────────────────────────────────────
function GMCounterAnimation({ isHovered }: { isHovered: boolean }) {
  const [textTexture, setTextTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<any>(null);
  const tubeRef = useRef<any>(null);
  const pulseGroupRef = useRef<any>(null);

  const particleCount = 80;

  const particles = useMemo(() => {
    const data = [];
    const sourceX = -0.9;
    const sourceY = -0.5;
    const destX = 0.7;
    const destY = 0.4;

    for (let i = 0; i < particleCount; i++) {
      const spread = 0.25;
      data.push({
        x: sourceX,
        y: sourceY,
        z: 0,
        vx: (destX - sourceX) + (Math.random() - 0.5) * spread,
        vy: (destY - sourceY) + (Math.random() - 0.5) * spread,
        vz: (Math.random() - 0.5) * spread,
        life: Math.random(),
        speed: 0.3 + Math.random() * 0.5
      });
    }
    return data;
  }, []);

  const currentPositions = useMemo(() => new Float32Array(particleCount * 3), []);
  const scopeHistory = useRef<number[]>(Array(30).fill(20));
  const pulseRings = useRef<any[]>([]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    canvasRef.current = canvas;
    const texture = new THREE.CanvasTexture(canvas);
    setTextTexture(texture);
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const speedMultiplier = isHovered ? 3.0 : 1.0;

    if (tubeRef.current) {
      tubeRef.current.rotation.x = 0.2 + Math.sin(time * 0.5) * 0.1;
      tubeRef.current.rotation.y = -0.4 + Math.cos(time * 0.5) * 0.1;
    }

    const sourceX = -0.9;
    const sourceY = -0.5;
    const sourceZ = 0;
    const destX = 0.7;
    const destY = 0.4;

    if (pointsRef.current) {
      const positionAttr = pointsRef.current.geometry.attributes.position;
      const array = positionAttr.array as any;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.life += delta * p.speed * speedMultiplier;
        if (p.life > 1.0) {
          p.life = 0;
          const spread = 0.25;
          p.vx = (destX - sourceX) + (Math.random() - 0.5) * spread;
          p.vy = (destY - sourceY) + (Math.random() - 0.5) * spread;
          p.vz = (Math.random() - 0.5) * spread;
        }

        const t = p.life;
        const x = sourceX + p.vx * t;
        const y = sourceY + p.vy * t + Math.sin(t * Math.PI) * 0.08;
        const z = sourceZ + p.vz * t;

        const i3 = i * 3;
        array[i3] = x;
        array[i3 + 1] = y;
        array[i3 + 2] = z;
      }
      positionAttr.needsUpdate = true;
    }

    pulseRings.current.forEach((ring, idx) => {
      if (ring) {
        const scaleVal = 1.0 + ((time * 3 * speedMultiplier + idx * 0.5) % 1.5);
        ring.scale.set(scaleVal, scaleVal, scaleVal);
        const opacityVal = Math.max(0, 1.0 - (scaleVal - 1.0) / 1.5);
        if (ring.material) {
          ring.material.opacity = opacityVal * 0.6;
        }
      }
    });

    if (canvasRef.current && textTexture) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#050B0B';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(0, 229, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = '#00E5FF';
      ctx.fillText('NUCLEONIX GM-TAB v0.81', 30, 45);

      ctx.fillStyle = 'rgba(0, 229, 255, 0.15)';
      ctx.fillRect(30, 60, canvas.width - 60, 2);

      ctx.font = '13px monospace';
      ctx.fillStyle = '#39FF14';
      ctx.fillText('● BLE CONNECTED [nRF52810]', 30, 90);
      ctx.fillStyle = '#00E5FF';
      ctx.fillText('● SUPABASE LICENSED: OK', 270, 90);

      const hvSteps = [600, 750, 900, 960, 1000, 1050, 1100, 1200];
      const stepIdx = Math.floor((time * 0.25) % hvSteps.length);
      const currentHV = hvSteps[stepIdx];

      ctx.fillStyle = '#A18AFF';
      ctx.fillText(`HV HELIPOT: ${currentHV}V / 1200V`, 30, 125);
      ctx.fillText(`STEPS: ITERATION ${stepIdx + 1}/${hvSteps.length} [d-HV +50V]`, 30, 145);

      ctx.strokeStyle = '#A18AFF';
      ctx.strokeRect(30, 160, 200, 12);
      ctx.fillStyle = 'rgba(161, 138, 255, 0.3)';
      ctx.fillRect(32, 162, Math.floor((currentHV / 1200) * 196), 8);

      const labels = ['SAMPLE_A', 'STANDARD_REF', 'BACKGROUND_BG'];
      const activeLabelIdx = Math.floor((time * 0.1) % labels.length);
      const activeLabel = labels[activeLabelIdx];

      ctx.fillStyle = '#00E5FF';
      ctx.fillText(`LABEL: ${activeLabel}`, 270, 125);
      ctx.fillText(`PRESET TIME: ${(time % 100).toFixed(1)}s / 100s`, 270, 145);

      const baseCPS = isHovered ? 180 : 35;
      const noiseVal = Math.sin(time * 5) * 5 + (Math.random() - 0.5) * 8;
      const currentCPS = Math.max(0, Math.floor(baseCPS + noiseVal));
      const currentCPM = currentCPS * 60;

      ctx.font = 'bold 36px monospace';
      ctx.fillStyle = '#00E5FF';
      ctx.fillText(`${currentCPS}`, 30, 240);
      ctx.font = '14px monospace';
      ctx.fillStyle = '#88A0A0';
      ctx.fillText('CPS (COUNTS/SEC)', 30, 260);

      ctx.font = 'bold 36px monospace';
      ctx.fillStyle = '#39FF14';
      ctx.fillText(`${currentCPM.toLocaleString()}`, 270, 240);
      ctx.font = '14px monospace';
      ctx.fillStyle = '#88A0A0';
      ctx.fillText('CPM (COUNTS/MIN)', 270, 260);

      ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
      ctx.strokeRect(30, 290, canvas.width - 60, 180);
      ctx.fillStyle = 'rgba(0, 229, 255, 0.02)';
      ctx.fillRect(30, 290, canvas.width - 60, 180);

      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = 'rgba(0, 229, 255, 0.5)';
      ctx.fillText('REAL-TIME RAD-PULSE OSCILLOSCOPE', 40, 310);

      ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let ox = 30; ox < canvas.width - 30; ox += 40) {
        ctx.beginPath(); ctx.moveTo(ox, 290); ctx.lineTo(ox, 470); ctx.stroke();
      }
      for (let oy = 290; oy < 470; oy += 30) {
        ctx.beginPath(); ctx.moveTo(30, oy); ctx.lineTo(canvas.width - 30, oy); ctx.stroke();
      }

      const updateInterval = 4;
      if (Math.floor(state.clock.elapsedTime * 60) % updateInterval === 0) {
        scopeHistory.current.push(currentCPS);
        if (scopeHistory.current.length > 50) {
          scopeHistory.current.shift();
        }
      }

      ctx.strokeStyle = '#39FF14';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const width = canvas.width - 60;
      const stepX = width / (scopeHistory.current.length - 1);
      const startX = 30;
      const startY = 470;
      const height = 140;
      const maxVal = isHovered ? 250 : 60;

      scopeHistory.current.forEach((val, index) => {
        const xPos = startX + index * stepX;
        const normalized = Math.min(1.0, val / maxVal);
        const yPos = startY - normalized * height;
        if (index === 0) {
          ctx.moveTo(xPos, yPos);
        } else {
          ctx.lineTo(xPos, yPos);
        }
      });
      ctx.stroke();

      textTexture.needsUpdate = true;
    }
  });

  return (
    <group>
      <mesh position={[0, 0, -0.6]}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial color="#050B0B" />
      </mesh>
      {textTexture && (
        <mesh position={[0, 0, -0.59]}>
          <planeGeometry args={[2.6, 2.6]} />
          <meshBasicMaterial map={textTexture} transparent opacity={0.95} />
        </mesh>
      )}

      <gridHelper args={[2.6, 12, "#00E5FF", "#002b30"]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.58]} />

      {/* Radiation Source */}
      <group position={[-0.9, -0.5, 0]}>
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="#A18AFF" wireframe />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]} position={[0.05, 0.05, 0]}>
          <cylinderGeometry args={[0.15, 0.18, 0.25, 8]} />
          <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.4} />
        </mesh>
      </group>

      {/* GM Detector Tube */}
      <group ref={tubeRef} position={[0.7, 0.4, 0]} rotation={[0, 0, Math.PI / 6]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 1.0, 16, 4]} />
          <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.01, 1.1, 8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.31, 0.31, 0.05, 8]} />
          <meshBasicMaterial color="#A18AFF" wireframe />
        </mesh>
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.31, 0.31, 0.05, 8]} />
          <meshBasicMaterial color="#A18AFF" wireframe />
        </mesh>
        <group ref={pulseGroupRef}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} ref={(el) => { pulseRings.current[i] = el; }} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.25, 0.02, 8, 16]} />
              <meshBasicMaterial color="#39FF14" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
            </mesh>
          ))}
        </group>
      </group>

      <Points ref={pointsRef} positions={currentPositions} stride={3} frustumCulled={false} position={[0, 0, 0.05]}>
        <PointMaterial
          transparent
          color={isHovered ? "#39FF14" : "#A18AFF"}
          size={isHovered ? 0.06 : 0.045}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

// ─── Boot Sequence Animation (Hobby OS) ──────────────────────────────────────
function BootSequenceAnimation({ isHovered }: { isHovered: boolean }) {
  const [textTexture, setTextTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef(typeof document !== 'undefined' ? document.createElement('canvas') : null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const texture = new THREE.CanvasTexture(canvas);
    setTextTexture(texture);

    const bootLines = [
      "BIOS v2.0 — System Reset",
      "Detecting hardware...",
      "[ OK ] GDT Loaded @ 0x00100000",
      "[ OK ] IDT Configured — 256 entries",
      "[ OK ] Paging enabled — CR0=0x80000001",
      "Mapping kernel @ 0xC0000000...",
      "  0xC0000000 → 0x00100000  [RW]",
      "  0xC0400000 → 0x00500000  [RW]",
      "[ OK ] Heap init  0x00200000–0x00400000",
      "[ OK ] PIC remapped — IRQ 0x20–0x2F",
      "[ OK ] PIT  ch0 @ 1000 Hz",
      "[ OK ] Keyboard IRQ1 handler set",
      "Loading syscall gate — int 0x80 DPL=3",
      "[ OK ] TSS installed — ESP0=0xC03FF000",
      "[ OK ] Ring-3 task spawned",
      "Dump: 0xC0001000: DE AD BE EF 00 00 00 01",
      "Dump: 0xC0001008: FF FE FD FC 0A 0B 0C 0D",
      "[ OK ] VGA framebuf @ 0xB8000",
      "Kernel v0.1 — boot complete.",
      "_ "
    ];

    let lineIdx = 0;
    let charIdx = 0;
    let frame = 0;
    const visibleLines: string[] = [];
    const MAX_VISIBLE = 14;

    const draw = () => {
      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(0,229,255,0.025)';
      for (let y = 0; y < canvas.height; y += 4) ctx.fillRect(0, y, canvas.width, 2);

      ctx.font = '18px monospace';
      const startY = 36;
      const lineH = 30;

      visibleLines.forEach((line, i) => {
        const isMeta = line.startsWith('[ OK ]');
        const isDump = line.startsWith('Dump:');
        const isMap  = line.startsWith('  0x');
        ctx.fillStyle = isMeta ? '#39FF14'
          : isDump ? '#A18AFF'
          : isMap  ? '#00B0CC'
          : '#00E5FF';
        ctx.fillText(line, 16, startY + i * lineH);
      });

      const cursorVisible = frame % 16 < 8;
      if (cursorVisible && lineIdx < bootLines.length) {
        const partialLine = bootLines[lineIdx].substring(0, charIdx);
        const isMeta = partialLine.startsWith('[ OK ]');
        ctx.fillStyle = isMeta ? '#39FF14' : '#00E5FF';
        const textW = ctx.measureText(partialLine).width;
        ctx.fillRect(16 + textW, startY + visibleLines.length * lineH - 4, 10, 20);
      }

      texture.needsUpdate = true;
      frame++;
    };

    const interval = setInterval(() => {
      const currentLine = bootLines[lineIdx];
      const speed = isHovered ? 2 : 1;

      for (let s = 0; s < speed; s++) {
        if (lineIdx >= bootLines.length) {
          lineIdx = 0; charIdx = 0;
          visibleLines.length = 0;
          break;
        }
        if (charIdx < currentLine.length) {
          charIdx++;
        } else {
          const committed = currentLine;
          visibleLines.push(committed);
          if (visibleLines.length > MAX_VISIBLE) visibleLines.shift();
          lineIdx++;
          charIdx = 0;
        }
      }
      draw();
    }, isHovered ? 22 : 55);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <group>
      <mesh>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial color="#050510" />
      </mesh>
      {textTexture && (
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[2.5, 2.5]} />
          <meshBasicMaterial map={textTexture} transparent opacity={0.95} />
        </mesh>
      )}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial color="#39FF14" transparent opacity={isHovered ? 0.06 : 0.02} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// ─── Bayesian Recognition Animation ──────────────────────────────────────────
function BayesianRecognitionAnimation({ isHovered }: { isHovered: boolean }) {
  const [textTexture, setTextTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const pointsCount = 400;
  const pointsRef = useRef<any>(null);
  const laserRef = useRef<any>(null);

  const chars = ["R", "B", "M", "O", "θ", "λ", "Ω"];

  const charPointsCache = useRef<Record<string, Float32Array>>({});

  const getPointsForChar = (char: string): Float32Array => {
    if (charPointsCache.current[char]) {
      return charPointsCache.current[char];
    }

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 64;
    tempCanvas.height = 64;
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.fillStyle = "#000000";
    tempCtx.fillRect(0, 0, 64, 64);
    tempCtx.fillStyle = "#ffffff";
    tempCtx.font = "bold 44px sans-serif";
    tempCtx.textAlign = "center";
    tempCtx.textBaseline = "middle";
    tempCtx.fillText(char, 32, 32);

    const imgData = tempCtx.getImageData(0, 0, 64, 64);
    const data = imgData.data;
    const coords: { x: number; y: number }[] = [];

    for (let y = 0; y < 64; y += 2) {
      for (let x = 0; x < 64; x += 2) {
        const idx = (y * 64 + x) * 4;
        if (data[idx] > 127) {
          const px = (x / 64) * 2.2 - 1.1;
          const py = -((y / 64) * 2.2 - 1.1);
          coords.push({ x: px, y: py });
        }
      }
    }

    const positions = new Float32Array(pointsCount * 3);
    if (coords.length === 0) {
      for (let i = 0; i < pointsCount; i++) {
        const angle = (i / pointsCount) * Math.PI * 2;
        positions[i * 3] = Math.cos(angle) * 0.8;
        positions[i * 3 + 1] = Math.sin(angle) * 0.8;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
      }
    } else {
      for (let i = 0; i < pointsCount; i++) {
        const pt = coords[i % coords.length];
        positions[i * 3] = pt.x;
        positions[i * 3 + 1] = pt.y;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
      }
    }

    charPointsCache.current[char] = positions;
    return positions;
  };

  const statsRef = useRef({
    targetChar: "R",
    prevChar: "Ω",
    iteration: 0,
    probabilities: { R: 0.14, B: 0.14, M: 0.14, O: 0.14, θ: 0.14, λ: 0.14, Ω: 0.16 } as Record<string, number>,
    noiseLevel: 1.0,
    converged: false,
    confidence: 0.14,
    cycleTime: 0
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    canvasRef.current = canvas;
    const texture = new THREE.CanvasTexture(canvas);
    setTextTexture(texture);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    chars.forEach(c => getPointsForChar(c));
  }, []);

  const currentPositions = useMemo(() => new Float32Array(pointsCount * 3), []);
  const targetPositions = useMemo(() => new Float32Array(pointsCount * 3), []);
  const prevPositions = useMemo(() => new Float32Array(pointsCount * 3), []);
  const noiseOffsets = useMemo(() => {
    const offsets = new Float32Array(pointsCount * 3);
    for (let i = 0; i < pointsCount * 3; i++) {
      offsets[i] = (Math.random() - 0.5) * 0.8;
    }
    return offsets;
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const initialTarget = getPointsForChar("R");
    targetPositions.set(initialTarget);
    prevPositions.set(initialTarget);
    currentPositions.set(initialTarget);
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const speed = isHovered ? 2.5 : 1.0;

    if (laserRef.current) {
      laserRef.current.position.y = Math.sin(time * 2.5 * speed) * 1.25;
    }

    const stats = statsRef.current;
    stats.cycleTime += delta * speed;

    if (stats.cycleTime > 4.0) {
      stats.cycleTime = 0;
      stats.iteration = 0;
      stats.converged = false;
      stats.prevChar = stats.targetChar;

      let newChar = stats.targetChar;
      while (newChar === stats.targetChar) {
        newChar = chars[Math.floor(Math.random() * chars.length)];
      }
      stats.targetChar = newChar;

      prevPositions.set(targetPositions);

      const newTarget = getPointsForChar(stats.targetChar);
      targetPositions.set(newTarget);

      chars.forEach(c => {
        stats.probabilities[c] = c === stats.prevChar ? 0.25 : (0.75 / (chars.length - 1));
      });
    }

    const step = Math.floor(stats.cycleTime / 0.6);
    if (step > stats.iteration && !stats.converged) {
      stats.iteration = step;

      let sum = 0;
      chars.forEach(c => {
        const likelihood = c === stats.targetChar ? 0.9 : 0.1;
        stats.probabilities[c] = likelihood * stats.probabilities[c];
        sum += stats.probabilities[c];
      });
      chars.forEach(c => {
        stats.probabilities[c] = stats.probabilities[c] / sum;
      });

      stats.confidence = stats.probabilities[stats.targetChar];
      if (stats.confidence >= 0.85) {
        stats.converged = true;
      }
    }

    stats.noiseLevel = Math.max(0, 1.0 - stats.cycleTime / 2.5);
    const morphProgress = Math.min(1.0, stats.cycleTime / 2.0);

    if (pointsRef.current) {
      const positionAttr = pointsRef.current.geometry.attributes.position;
      const array = positionAttr.array;

      for (let i = 0; i < pointsCount; i++) {
        const i3 = i * 3;

        const bx = prevPositions[i3] + (targetPositions[i3] - prevPositions[i3]) * morphProgress;
        const by = prevPositions[i3 + 1] + (targetPositions[i3 + 1] - prevPositions[i3 + 1]) * morphProgress;
        const bz = prevPositions[i3 + 2] + (targetPositions[i3 + 2] - prevPositions[i3 + 2]) * morphProgress;

        const waveX = Math.sin(time * 15 + i) * 0.08 * stats.noiseLevel;
        const waveY = Math.cos(time * 13 + i) * 0.08 * stats.noiseLevel;

        array[i3] = bx + noiseOffsets[i3] * stats.noiseLevel + waveX;
        array[i3 + 1] = by + noiseOffsets[i3 + 1] * stats.noiseLevel + waveY;
        array[i3 + 2] = bz + noiseOffsets[i3 + 2] * stats.noiseLevel * 0.5;
      }
      positionAttr.needsUpdate = true;
    }

    if (canvasRef.current && textTexture) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;

      ctx.fillStyle = "#04040A";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(0, 229, 255, 0.015)";
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 6) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.font = "bold 20px monospace";
      ctx.fillStyle = "#00E5FF";
      ctx.fillText("PROB_REC_ENGINE // v0.90", 25, 45);

      ctx.fillStyle = "rgba(0, 229, 255, 0.2)";
      ctx.fillRect(25, 60, canvas.width - 50, 2);

      ctx.font = "15px monospace";
      ctx.fillStyle = "#A18AFF";
      ctx.fillText(`MODEL: RECURSIVE BAYESIAN UPDATING`, 25, 95);
      ctx.fillText(`LIKELIHOOD RATIO: 0.90 / 0.10`, 25, 120);
      ctx.fillText(`CONVERGENCE THRESHOLD: 0.85`, 25, 145);

      ctx.fillStyle = "#00E5FF";
      ctx.fillText(`ITERATION SEQUENCE: ${stats.iteration} / 4`, 25, 185);
      ctx.fillText(`NOISE DECAY (SMOOTH): ${(stats.noiseLevel * 100).toFixed(1)}%`, 25, 210);

      ctx.fillText("POSTERIOR PROBABILITY VECTOR:", 25, 250);
      ctx.fillStyle = "rgba(0, 229, 255, 0.1)";
      ctx.fillRect(25, 260, canvas.width - 50, 1);

      let yPos = 295;
      chars.forEach(c => {
        const prob = stats.probabilities[c] || 0;
        const isTarget = c === stats.targetChar;

        ctx.font = isTarget ? "bold 16px monospace" : "15px monospace";
        ctx.fillStyle = isTarget ? "#39FF14" : "#A18AFF";

        const label = `P('${c}' | X_seq)`;
        ctx.fillText(label, 25, yPos);

        const barWidth = Math.floor(prob * 180);
        ctx.fillStyle = isTarget ? "rgba(57, 255, 20, 0.3)" : "rgba(161, 138, 255, 0.15)";
        ctx.fillRect(180, yPos - 12, barWidth, 14);
        ctx.strokeStyle = isTarget ? "#39FF14" : "#A18AFF";
        ctx.strokeRect(180, yPos - 12, 180, 14);

        ctx.fillStyle = isTarget ? "#39FF14" : "#A18AFF";
        ctx.fillText(prob.toFixed(4), 380, yPos);

        yPos += 28;
      });

      ctx.fillStyle = "rgba(0, 229, 255, 0.2)";
      ctx.fillRect(25, 480, canvas.width - 50, 2);

      ctx.font = "bold 16px monospace";
      if (stats.converged) {
        ctx.fillStyle = "#39FF14";
        ctx.fillText(`MAP ESTIMATE: '${stats.targetChar}' [CONVERGED P = ${stats.confidence.toFixed(4)}]`, 25, 502);
      } else {
        ctx.fillStyle = "#00E5FF";
        ctx.fillText(`ESTIMATING... BEST ESTIMATE: '${stats.targetChar}' [P = ${stats.confidence.toFixed(4)}]`, 25, 502);
      }

      textTexture.needsUpdate = true;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.4} />

      <mesh position={[0, 0, -0.6]}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial color="#04040A" />
      </mesh>
      {textTexture && (
        <mesh position={[0, 0, -0.59]}>
          <planeGeometry args={[2.6, 2.6]} />
          <meshBasicMaterial map={textTexture} transparent opacity={0.9} />
        </mesh>
      )}

      <Points ref={pointsRef} positions={currentPositions} stride={3} frustumCulled={false} position={[0, 0, 0.1]}>
        <PointMaterial
          transparent
          color={isHovered ? "#39FF14" : "#00E5FF"}
          size={isHovered ? 0.055 : 0.04}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      <mesh ref={laserRef} position={[0, 0, 0.15]}>
        <planeGeometry args={[2.0, 0.03]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.7} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>

      <gridHelper args={[2.6, 12, "#A18AFF", "#221155"]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.58]} />
    </group>
  );
}

// ─── Bash Shell Animation ─────────────────────────────────────────────────────
export function BashAnimation({ isHovered }: { isHovered: boolean }) {
  const [textTexture, setTextTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef(typeof document !== 'undefined' ? document.createElement('canvas') : null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const texture = new THREE.CanvasTexture(canvas);
    setTextTexture(texture);

    let frame = 0;
    const commands = [
      "user@system:~$ ./launch",
      "Initializing core modules...",
      "[OK] Kernel loaded",
      "user@system:~$ ./compile_shell.sh",
      "Compiling built-in commands...",
      "gcc -o shell shell.c",
      "[OK] Build successful",
      "user@system:~$ ./shell",
      "Custom Linux Shell v1.0",
      "> _ "
    ];
    let charIndex = 0;
    let lineIndex = 0;

    const interval = setInterval(() => {
      if (lineIndex >= commands.length) {
        lineIndex = 0;
        charIndex = 0;
      }

      const currentLine = commands[lineIndex];
      if (charIndex < currentLine.length) {
        charIndex++;
      } else {
        lineIndex++;
        charIndex = 0;
        if (lineIndex < commands.length && (commands[lineIndex].startsWith("[") || commands[lineIndex].startsWith("gcc") || commands[lineIndex].startsWith("Init") || commands[lineIndex].startsWith("Comp"))) {
           charIndex = commands[lineIndex].length;
        }
      }

      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '22px monospace';
      ctx.fillStyle = '#00E5FF';

      let y = 40;
      for (let i = 0; i < lineIndex; i++) {
        ctx.fillText(commands[i], 20, y);
        y += 30;
      }
      if (lineIndex < commands.length) {
        ctx.fillText(commands[lineIndex].substring(0, charIndex) + (frame % 2 === 0 ? "█" : ""), 20, y);
      }

      texture.needsUpdate = true;
      frame++;
    }, isHovered ? 20 : 60);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <group>
      <mesh>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial color="#0A0A0A" />
      </mesh>
      {textTexture && (
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[2.5, 2.5]} />
          <meshBasicMaterial map={textTexture} transparent opacity={0.9} />
        </mesh>
      )}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// ─── Face Scan Animation (Student Attendance) ─────────────────────────────────
function FaceScanAnimation({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<any>(null);

  const profilePoints = useMemo(() => {
    const points = [];
    points.push(new THREE.Vector2(0.1, -1.0));
    points.push(new THREE.Vector2(0.4, -0.8));
    points.push(new THREE.Vector2(0.45, -0.6));
    points.push(new THREE.Vector2(0.4, -0.5));
    points.push(new THREE.Vector2(0.42, -0.4));
    points.push(new THREE.Vector2(0.35, -0.25));
    points.push(new THREE.Vector2(0.55, -0.1));
    points.push(new THREE.Vector2(0.35, 0.1));
    points.push(new THREE.Vector2(0.4, 0.3));
    points.push(new THREE.Vector2(0.45, 0.6));
    points.push(new THREE.Vector2(0.4, 0.9));
    points.push(new THREE.Vector2(0.1, 1.0));
    return points;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isHovered ? 1.0 : 0.2);
    }
  });

  return (
    <group>
      <ambientLight intensity={0.2} />
      <pointLight position={[2, 0, 2]} color="#00E5FF" intensity={isHovered ? 4 : 2} />
      <pointLight position={[-2, 0, -2]} color="#A18AFF" intensity={isHovered ? 4 : 2} />

      <group ref={groupRef}>
        <mesh>
          <latheGeometry args={[profilePoints, 24]} />
          <meshStandardMaterial color="#00E5FF" transparent opacity={0.3} wireframe blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh position={[0.22, 0.2, 0.38]} rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.08, 0.02, 16, 32]} />
          <meshBasicMaterial color="#00E5FF" />
        </mesh>
        <mesh position={[-0.22, 0.2, 0.38]} rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.08, 0.02, 16, 32]} />
          <meshBasicMaterial color="#00E5FF" />
        </mesh>
      </group>
    </group>
  );
}

// ─── Food Scan Animation (Eat-IQ) ────────────────────────────────────────────
function FoodScanAnimation({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<any>(null);
  const scanRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * (isHovered ? 1.5 : 0.5);
    if (scanRef.current) {
      scanRef.current.position.x = Math.sin(state.clock.elapsedTime * (isHovered ? 3.0 : 1.0)) * 0.8;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh scale={[1, 0.85, 1]} position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.6, 16, 12]} />
        <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 0.45, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.02, 0.04, 0.3]} />
        <meshBasicMaterial color="#A18AFF" />
      </mesh>
      <mesh ref={scanRef} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.6, 1.6]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// ─── NeuralMesh GNN Graph Animation ──────────────────────────────────────────
function NeuralMeshAnimation({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<any>(null);
  const [textTexture, setTextTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fixed node layout — deterministic, no re-randomization
  const nodes = useMemo(() => [
    { pos: new THREE.Vector3(-1.0,  0.6, 0.0), type: "account",  id: "0xA1",      risk: 0.12 },
    { pos: new THREE.Vector3( 1.1,  0.7, 0.1), type: "account",  id: "0xB2",      risk: 0.08 },
    { pos: new THREE.Vector3(-0.9, -0.7, 0.2), type: "account",  id: "0xC3",      risk: 0.71 },
    { pos: new THREE.Vector3( 0.2,  1.1, 0.0), type: "account",  id: "0xD4",      risk: 0.19 },
    { pos: new THREE.Vector3( 0.8, -0.8, 0.1), type: "account",  id: "0xE5",      risk: 0.89 },
    { pos: new THREE.Vector3( 0.0,  0.0, 0.0), type: "contract", id: "DEX_ROUTER",risk: 0.43 },
    { pos: new THREE.Vector3(-0.4, -0.3, 0.2), type: "contract", id: "SANDWICH",  risk: 0.95 },
    { pos: new THREE.Vector3( 0.6,  0.3, 0.1), type: "contract", id: "FLASHLOAN", risk: 0.62 },
  ], []);

  const edges = useMemo(() => [
    { from: 0, to: 5 }, { from: 1, to: 5 }, { from: 2, to: 6 },
    { from: 3, to: 5 }, { from: 4, to: 6 }, { from: 5, to: 7 },
    { from: 6, to: 5 }, { from: 2, to: 7 }, { from: 4, to: 7 },
    { from: 7, to: 5 },
  ], []);

  const nodeMeshRefs  = useRef<any[]>([]);
  const particleRefs  = useRef<any[]>([]);
  const edgeParticles = useMemo(() => edges.map(() => ({ t: Math.random() })), [edges]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const canvas = document.createElement('canvas');
    canvas.width  = 512;
    canvas.height = 200;
    canvasRef.current = canvas;
    setTextTexture(new THREE.CanvasTexture(canvas));
  }, []);

  const riskColor = (risk: number) =>
    risk > 0.7 ? '#FF4444' : risk > 0.4 ? '#FFD700' : '#00E5FF';

  useFrame((state, delta) => {
    const time  = state.clock.elapsedTime;
    const speed = isHovered ? 2.2 : 0.7;

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.35;
      groupRef.current.rotation.x = Math.sin(time * 0.15) * 0.12;
    }

    nodeMeshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const node  = nodes[i];
      const pulse = 1.0 + Math.sin(time * (1.5 + i * 0.3) * speed) * 0.18 * node.risk;
      mesh.scale.setScalar(pulse);
    });

    edgeParticles.forEach((p, i) => {
      p.t += delta * speed * (0.35 + i * 0.04);
      if (p.t > 1.0) p.t = 0;
      const m = particleRefs.current[i];
      if (!m) return;
      m.position.lerpVectors(nodes[edges[i].from].pos, nodes[edges[i].to].pos, p.t);
    });

    if (canvasRef.current && textTexture) {
      const ctx = canvasRef.current.getContext('2d')!;
      ctx.clearRect(0, 0, 512, 200);

      ctx.font = 'bold 15px monospace';
      ctx.fillStyle = '#FF4444';
      ctx.fillText('\u26a0  MEV THREAT DETECTED', 12, 26);

      ctx.font = '12px monospace';
      ctx.fillStyle = '#A18AFF';
      ctx.fillText('ANOMALY : SANDWICH CONTRACT', 12, 50);
      ctx.fillStyle = '#FF4444';
      ctx.fillText('RISK SCORE : 95.0%', 12, 70);
      ctx.fillStyle = '#00E5FF';
      ctx.fillText('PATTERN : CYCLICAL SANDWICH ATTACK', 12, 92);
      ctx.fillText('GAT HEADS : 8   HOP DEPTH : 3', 12, 112);

      const barW = Math.floor(0.95 * 220);
      ctx.fillStyle = 'rgba(255,68,68,0.2)';
      ctx.fillRect(12, 128, 220, 10);
      ctx.fillStyle = '#FF4444';
      ctx.fillRect(12, 128, barW, 10);

      ctx.font = '10px monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillText(`INFERENCE: <40ms  |  NODES: ${nodes.length}  EDGES: ${edges.length}`, 12, 162);
      ctx.fillText('STREAM: ALCHEMY WS  |  CACHE: REDIS', 12, 178);

      textTexture.needsUpdate = true;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.15} />
      <pointLight position={[0,  2,  2]} color="#FF4444" intensity={isHovered ? 3.0 : 1.5} />
      <pointLight position={[-2,-1,  1]} color="#A18AFF" intensity={isHovered ? 2.0 : 1.0} />
      <pointLight position={[2,  0, -1]} color="#00E5FF" intensity={isHovered ? 2.0 : 1.0} />

      {textTexture && (
        <mesh position={[0, -1.2, 0.1]}>
          <planeGeometry args={[2.6, 1.0]} />
          <meshBasicMaterial map={textTexture} transparent opacity={0.9} depthWrite={false} />
        </mesh>
      )}

      <group ref={groupRef}>
        {/* Edges */}
        {edges.map((edge, i) => {
          const from = nodes[edge.from].pos;
          const to   = nodes[edge.to].pos;
          const mid  = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
          const dir  = new THREE.Vector3().subVectors(to, from);
          const len  = dir.length();
          const highRisk = nodes[edge.to].risk > 0.7 || nodes[edge.from].risk > 0.7;
          return (
            <mesh
              key={i}
              position={mid}
              rotation={[
                Math.atan2(dir.y, Math.sqrt(dir.x ** 2 + dir.z ** 2)),
                Math.atan2(dir.x, dir.z),
                0,
              ]}
            >
              <cylinderGeometry args={[0.008, 0.008, len, 4]} />
              <meshBasicMaterial
                color={highRisk ? '#FF4444' : '#334466'}
                transparent
                opacity={highRisk ? 0.65 : 0.22}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        })}

        {/* Edge flow particles */}
        {edges.map((_, i) => (
          <mesh key={`p${i}`} ref={(el) => { particleRefs.current[i] = el; }}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshBasicMaterial
              color={nodes[edges[i].to].risk > 0.7 ? '#FF4444' : '#00E5FF'}
              transparent
              opacity={0.9}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <group key={i} position={node.pos}>
            <mesh ref={(el) => { nodeMeshRefs.current[i] = el; }}>
              {node.type === 'contract'
                ? <boxGeometry args={[0.18, 0.18, 0.18]} />
                : <sphereGeometry args={[0.12, 12, 12]} />}
              <meshStandardMaterial
                color={riskColor(node.risk)}
                transparent
                opacity={node.risk > 0.7 ? 0.9 : 0.6}
                emissive={riskColor(node.risk)}
                emissiveIntensity={node.risk * (isHovered ? 1.2 : 0.7)}
              />
            </mesh>
            {node.type === 'contract' && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.22, 0.012, 8, 24]} />
                <meshBasicMaterial
                  color={riskColor(node.risk)}
                  transparent
                  opacity={0.5}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            )}
          </group>
        ))}
      </group>
    </group>
  );
}

// ─── Project Data ─────────────────────────────────────────────────────────────
const projects = [
  {
    title: "NeuralMesh | Mempool Threat Topology & GNN Anomaly Engine",
    tags: ["PyTorch Geometric", "Graph Attention Networks", "FastAPI", "WebSockets", "Redis", "WebGL / Three.js"],
    description: "Ethereum mempools are adversarial, low-latency environments where frontrunning, sandwich attacks, and toxic MEV exploits occur before block confirmation — rule-based heuristics fail to capture non-linear transaction paths at wire speed.\n\nModeled pending transactions as dynamic directed bipartite graphs (accounts and smart contracts as nodes; state-changing interactions and token transfers as edges). Implemented a multi-head Graph Attention Network (GAT) in PyTorch Geometric with dynamic attention weighting across multi-hop paths, isolating toxic MEV signatures with sub-40ms inference latency. Streamed live pending mempool hashes via Alchemy WebSockets into an async buffer queue for continuous real-time inference. Built an interactive WebGL/Three.js topological visualizer rendering live cluster risk scores and attack vectors in-browser.\n\nArchitecture: Alchemy WS → Async Buffer → FastAPI → GAT Model → Redis Cache → WebGL Renderer.",
    visual: NeuralMeshAnimation,
    tag: "GNN_MEV",
    repoUrl: "https://github.com/Mourya05/NeuralMesh.git",
    demoUrl: "https://github.com/Mourya05/NeuralMesh.git",
  },
  {
    title: "Tab-Based GM Counting System",
    tags: ["React Native", "Node.js", "REST APIs", "Expo", "SQLite", "BLE", "Arduino", "Supabase"],
    description: "A professional, tablet-optimized radiation monitoring mobile application built for Nucleonix Systems. Authenticates via Supabase Device-Based Access Control using the unique Android Device ID as a hardware license gate. Connects to an Arduino-based Geiger-Müller detector over BLE using the Nordic UART Service (NUS) for real-time CPS/CPM data acquisition. Features an industrial dashboard with 0–1200V helipot stepping, Sample/Standard/Background measurement labeling, on-device SQLite persistence, Node.js REST API integration, and SheetJS spreadsheet export.\n\nArchitecture: Hardware (GM Detector) → BLE/NUS → React Native → SQLite (local) → Node.js REST API → Supabase (auth).",
    visual: GMCounterAnimation,
    tag: "GM_CORE",
    repoUrl: "https://github.com/NucleonixGCET/Tab-Based-GM-Counting-System.git"
  },
  {
    title: "Hobby-OS — 32-bit x86 Kernel",
    tags: ["C", "x86 Assembly", "NASM", "QEMU", "Makefile", "Linker Script"],
    description: "A custom-built 32-bit x86 operating system kernel written from scratch in C and NASM Assembly. Implements a complete boot sequence: BIOS → bootloader → protected mode → kernel entry. Includes a custom Global Descriptor Table (GDT), Interrupt Descriptor Table (IDT) with 256 entries, hardware interrupt remapping via 8259 PIC, Programmable Interval Timer (PIT), paging with identity mapping and higher-half kernel layout, heap allocator, VGA framebuffer text output, keyboard IRQ handler, and system calls via int 0x80 with ring-3 privilege separation. Built and emulated with QEMU.",
    visual: BootSequenceAnimation,
    tag: "KERN_BOOT",
    repoUrl: "https://github.com/Mourya05/Hobby-OS.git"
  },
  {
    title: "Probabilistic Character Recognition Engine",
    tags: ["R", "Bayesian Statistics", "MAP Estimation", "Statistical Inference"],
    description: "A probabilistic character recognition engine built in R using recursive Bayesian updating to solve sequential classification problems. Implements a stochastic smoothing function with a 0.9/0.1 likelihood ratio, MAP estimation for noise-corrupted inputs, and convergence detection at a 0.85 posterior probability threshold. Designed to handle contradictory sequential observations in real time — demonstrating how Bayesian inference outperforms deterministic matching under noisy conditions.",
    visual: BayesianRecognitionAnimation,
    tag: "PROB_ENGINE",
    repoUrl: "https://github.com/Mourya05/Probabilistic-Character-Recognition-Engine.git"
  },
  {
    title: "Custom Linux Shell",
    tags: ["C", "POSIX", "fork/exec", "Pipes", "Signals", "Redirection"],
    description: "A functional Unix-like shell implemented from scratch in C, closely following POSIX semantics. Implements the full read-eval-print loop (REPL), process creation via fork()/exec(), piping between commands using pipe() and dup2() for stdin/stdout redirection, signal handling for Ctrl-C and Ctrl-Z, background job execution with &, and built-in commands (cd, exit, history). Demonstrates direct use of low-level POSIX system calls without library abstractions.",
    visual: BashAnimation,
    tag: "ROOT_SHELL",
    repoUrl: "https://github.com/Mourya05/Built-Own-Shell"
  },
  {
    title: "Student Attendance System",
    tags: ["Python", "OpenCV", "Biometric Recognition", "SQL"],
    description: "Automated student attendance system using facial biometric identification. Captures real-time video, detects faces using OpenCV, matches against enrolled student profiles using recognition algorithms, and logs attendance records to an SQL database. Eliminates manual roll-call with a fully automated biometric pipeline.",
    visual: FaceScanAnimation,
    tag: "BIO_SCAN",
    repoUrl: "https://github.com/Mourya05/Student-Attendance-through-facial-recognition"
  },
  {
    title: "Eat-IQ | Nutrition Tracker",
    tags: ["React.js", "Vision AI API", "Dashboard"],
    description: "A web application for tracking dietary intake and nutritional goals. The core food recognition feature uses a third-party Vision AI API; my contribution was the React.js frontend, data visualization dashboard for caloric and hydration tracking, and the application architecture and state management.",
    visual: FoodScanAnimation,
    tag: "DATA_HELIX",
    repoUrl: "https://github.com/Mourya05/Eat-IQ"
  },
];

// ─── Project Card ─────────────────────────────────────────────────────────────
const ProjectCard = ({ index, title, tags, description, visual: Visual, tag, repoUrl, demoUrl }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="glass-panel p-5 sm:p-8 lg:p-10 rounded-2xl flex flex-col md:flex-row gap-6 sm:gap-8 lg:gap-10 mt-0 max-w-5xl mx-auto w-full relative z-10 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual area */}
      <div className="w-full md:w-[45%] h-[200px] sm:h-[300px] md:h-auto md:aspect-square rounded-xl bg-black/40 border border-white/5 relative overflow-hidden flex items-center justify-center shrink-0">
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 font-mono text-[9px] text-teal tracking-widest uppercase z-20 bg-obsidian/60 px-2 py-0.5 rounded">{tag}</div>
        <div className="w-full h-full">
          {isMobile ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#08080C] via-[#04040A] to-[#000000]">
              <span
                className="font-mono font-bold text-4xl tracking-widest"
                style={{
                  color: "#00E5FF",
                  textShadow: "0 0 30px rgba(0,229,255,0.7), 0 0 60px rgba(0,229,255,0.3)",
                }}
              >
                {tag}
              </span>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-teal/60 to-transparent" />
              <span className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">Project</span>
            </div>
          ) : (
            <Canvas camera={{ position: [0, 0, 3] }}>
              <Visual isHovered={isHovered} />
            </Canvas>
          )}
        </div>
      </div>

      <div className="w-full md:w-[55%] flex flex-col justify-center">
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
          {tags.map((t: string) => (
            <span key={t} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-[9px] text-lavender tracking-wider uppercase">
              {t}
            </span>
          ))}
        </div>

        <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-6 group-hover:text-teal transition-colors leading-tight">
          {title}
        </h3>

        <p className="font-sans text-ash/90 text-sm leading-relaxed mb-10 max-w-lg whitespace-pre-line">
          {description}
        </p>

        <div className="flex flex-wrap gap-4 mt-auto">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none"
            aria-label={`View GitHub source for ${title}`}
          >
            <button className="w-full sm:w-auto bg-gradient-to-br from-lavender to-[#8d7fff] text-obsidian px-8 py-3 rounded-md font-mono text-[10px] uppercase tracking-widest font-bold hover-lift">
              GitHub Source
            </button>
          </a>
          <a
            href={demoUrl || repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none"
            aria-label={`View live demo or repository for ${title}`}
          >
            <button className="w-full sm:w-auto bg-transparent border border-white/20 text-white px-8 py-3 rounded-md font-mono text-[10px] uppercase tracking-widest hover-lift">
              {demoUrl ? "Architecture & Demo" : "View GitHub"}
            </button>
          </a>
        </div>
      </div>

      <div className="absolute -bottom-4 -right-2 font-display font-black text-[6rem] lg:text-[10rem] text-white/[0.02] pointer-events-none italic select-none hidden sm:block">
        0{index}
      </div>
    </motion.div>
  );
};

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function ProjectsSection() {
  return (
    <section className="relative w-full py-24 sm:py-32 px-4 sm:px-6 flex flex-col items-center">
      <div className="text-center mb-10 flex flex-col items-center w-full px-4">
        <div className="px-4 py-1.5 glass-panel rounded-full font-mono text-[9px] text-ash tracking-widest uppercase mb-8">
          Engineering Projects
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 leading-tight">
          Selected<br className="hidden sm:block" /> Work
        </h2>
        <p className="font-sans text-ash text-sm max-w-lg mx-auto text-center">
          A selection of systems, embedded, and software engineering projects — each with real engineering depth.
        </p>
      </div>

      <div className="w-full flex-col flex gap-16 sm:gap-24 lg:gap-32 pb-24 sm:pb-32">
        {projects.map((proj, idx) => (
          <ProjectCard key={proj.title} index={idx + 1} {...proj} />
        ))}
      </div>
    </section>
  );
}
