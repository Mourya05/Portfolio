"use client";

import { motion } from "framer-motion";
import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// ─── Touch device detection hook ─────────────────────────────────────────────
// Uses pointer/hover hardware capability — not viewport width — so Chrome
// DevTools simulation still renders 3D, while real phones get the placeholder.
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

function DrawingAnimation({ isHovered }: { isHovered: boolean }) {
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
    const speed = isHovered ? 2 : 0.5;
    if (ref.current) {
      ref.current.rotation.z += delta * speed * 0.5;
      ref.current.rotation.y += delta * speed * 0.2;
      
      const time = state.clock.elapsedTime * speed;
      const progress = Math.floor(((Math.sin(time) * 0.5 + 0.5) * count * 0.8) + (count * 0.2));
      ref.current.geometry.setDrawRange(0, progress);
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00E5FF" size={isHovered ? 0.04 : 0.02} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

function FaceScanAnimation({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<any>(null);

  const profilePoints = useMemo(() => {
    const points = [];
    points.push(new THREE.Vector2(0.1, -1.0)); // Neck
    points.push(new THREE.Vector2(0.4, -0.8)); // Jaw
    points.push(new THREE.Vector2(0.45, -0.6)); // Chin
    points.push(new THREE.Vector2(0.4, -0.5)); // Mouth lower
    points.push(new THREE.Vector2(0.42, -0.4)); // Mouth upper
    points.push(new THREE.Vector2(0.35, -0.25)); // Under nose
    points.push(new THREE.Vector2(0.55, -0.1)); // Nose tip
    points.push(new THREE.Vector2(0.35, 0.1)); // Nose bridge
    points.push(new THREE.Vector2(0.4, 0.3)); // Brow
    points.push(new THREE.Vector2(0.45, 0.6)); // Forehead
    points.push(new THREE.Vector2(0.4, 0.9)); // Top head
    points.push(new THREE.Vector2(0.1, 1.0)); // Crown
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

function PaperRotateAnimation({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<any>(null);
  
  const docTex = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 384;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#08080C';
    ctx.fillRect(0, 0, 256, 384);
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 236, 364);
    
    ctx.fillStyle = '#A18AFF';
    ctx.fillRect(30, 40, 120, 20);
    
    ctx.fillStyle = '#00E5FF';
    for(let i=0; i<5; i++) {
      ctx.fillRect(30, 90 + i*40, 196, 10);
      ctx.fillRect(30, 110 + i*40, 140, 10);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isHovered ? 1.0 : 0.2);
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <planeGeometry args={[1.2, 1.8]} />
        {docTex && <meshBasicMaterial map={docTex} transparent opacity={0.8} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />}
      </mesh>
      <mesh position={[0, 0, -0.1]} rotation={[0, 0, 0.05]}>
        <planeGeometry args={[1.2, 1.8]} />
        <meshBasicMaterial color="#A18AFF" transparent opacity={0.2} wireframe />
      </mesh>
    </group>
  );
}

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
      ">_ "
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

function BitcoinRotateAnimation({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<any>(null);
  const ringRef = useRef<any>(null);
  
  const bTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#08080C';
    ctx.fillRect(0, 0, 256, 256);
    ctx.font = 'bold 160px sans-serif';
    ctx.fillStyle = '#00E5FF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('₿', 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    const speed = isHovered ? 4.0 : 1.0;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * speed * 0.5;
      ringRef.current.rotation.x += delta * speed * 0.2;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 2, 2]} color="#00E5FF" intensity={isHovered ? 2 : 1} />
      <pointLight position={[-2, -2, 2]} color="#A18AFF" intensity={isHovered ? 2 : 1} />
      
      <group ref={groupRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.1, 16]} />
          <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
        {bTexture && (
          <>
            <mesh position={[0, 0, 0.051]}>
              <circleGeometry args={[0.75, 32]} />
              <meshBasicMaterial map={bTexture} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh position={[0, 0, -0.051]} rotation={[0, Math.PI, 0]}>
              <circleGeometry args={[0.75, 32]} />
              <meshBasicMaterial map={bTexture} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
            </mesh>
          </>
        )}
      </group>
      
      <mesh ref={ringRef}>
        <torusGeometry args={[1.2, 0.02, 8, 40]} />
        <meshBasicMaterial color={isHovered ? "#FFFFFF" : "#00E5FF"} wireframe transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function ChattingAnimation({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<any>(null);
  
  const dot1Ref = useRef<any>(null);
  const dot2Ref = useRef<any>(null);
  const dot3Ref = useRef<any>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
    if (dot1Ref.current && dot2Ref.current && dot3Ref.current) {
      const t = state.clock.elapsedTime * 6;
      dot1Ref.current.position.y = Math.sin(t) * 0.05;
      dot2Ref.current.position.y = Math.sin(t + 1) * 0.05;
      dot3Ref.current.position.y = Math.sin(t + 2) * 0.05;
    }
  });

  const createBubbleTexture = (text: string, isRight: boolean) => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = isRight ? '#00E5FF' : '#333333';
    ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(0, 0, 256, 64, 16);
    else ctx.rect(0, 0, 256, 64);
    ctx.fill();
    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = isRight ? '#000000' : '#FFFFFF';
    ctx.fillText(text, 20, 40);
    return new THREE.CanvasTexture(canvas);
  };

  const b1 = useMemo(() => createBubbleTexture("Hello, AI!", true), []);
  const b2 = useMemo(() => createBubbleTexture("Processing...", false), []);
  const b3 = useMemo(() => createBubbleTexture("Data matched.", true), []);

  return (
    <group ref={groupRef}>
      {b1 && <mesh position={[0.4, 0.6, 0]}><planeGeometry args={[1.2, 0.3]} /><meshBasicMaterial map={b1} transparent /></mesh>}
      {b2 && <mesh position={[-0.4, 0.2, 0]}><planeGeometry args={[1.2, 0.3]} /><meshBasicMaterial map={b2} transparent /></mesh>}
      {b3 && <mesh position={[0.4, -0.2, 0]}><planeGeometry args={[1.2, 0.3]} /><meshBasicMaterial map={b3} transparent /></mesh>}
      
      <group position={[-0.6, -0.6, 0]} visible={isHovered}>
        <mesh ref={dot1Ref} position={[-0.15, 0, 0]}><circleGeometry args={[0.05, 16]} /><meshBasicMaterial color="#00E5FF" /></mesh>
        <mesh ref={dot2Ref} position={[0, 0, 0]}><circleGeometry args={[0.05, 16]} /><meshBasicMaterial color="#00E5FF" /></mesh>
        <mesh ref={dot3Ref} position={[0.15, 0, 0]}><circleGeometry args={[0.05, 16]} /><meshBasicMaterial color="#00E5FF" /></mesh>
      </group>
    </group>
  );
}

function MoneyAnimation({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<any>(null);
  const coinsRef = useRef<any[]>([]);
  const symbolsRef = useRef<any>(null);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const speed = isHovered ? 2.0 : 1.0;
    
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5 * speed;
      groupRef.current.position.y = Math.sin(time) * 0.1;
    }

    coinsRef.current.forEach((coin, i) => {
      if (coin) {
        coin.position.y = i * 0.15 + Math.sin(time * 2 + i) * (isHovered ? 0.08 : 0.02);
      }
    });

    if (symbolsRef.current) {
      symbolsRef.current.rotation.y -= delta * speed;
    }
  });

  const moneyTex = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#08080C';
    ctx.fillRect(0, 0, 128, 128);
    ctx.font = 'bold 80px sans-serif';
    ctx.fillStyle = '#00E5FF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const createSymbolTex = (sym: string) => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.font = 'bold 48px monospace';
    ctx.fillStyle = '#00E5FF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sym, 32, 32);
    return new THREE.CanvasTexture(canvas);
  };
  
  const symTex1 = useMemo(() => createSymbolTex('$'), []);
  const symTex2 = useMemo(() => createSymbolTex('€'), []);
  const symTex3 = useMemo(() => createSymbolTex('£'), []);
  const symbolsMap = [symTex1, symTex2, symTex3];

  return (
    <group>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 5, 2]} intensity={1.5} color="#00E5FF" />
      
      <group ref={groupRef} position={[0, -0.4, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} ref={(el) => (coinsRef.current[i] = el)} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 0.08, 16]} />
            <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.5} blending={THREE.AdditiveBlending} />
            {i === 5 && moneyTex && (
              <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.55, 32]} />
                <meshBasicMaterial map={moneyTex} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
              </mesh>
            )}
          </mesh>
        ))}
      </group>

      <group ref={symbolsRef}>
        {isHovered && [0, 1, 2].map((i) => {
          const angle = (i * Math.PI * 2) / 3;
          const x = Math.cos(angle) * 1.5;
          const z = Math.sin(angle) * 1.5;
          const tex = symbolsMap[i];
          return (
            <mesh key={i} position={[x, 0, z]}>
              <planeGeometry args={[0.4, 0.4]} />
              {tex && <meshBasicMaterial map={tex} transparent opacity={0.8} blending={THREE.AdditiveBlending} />}
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function BookAnimation({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<any>(null);
  const flipPageRef = useRef<any>(null);

  const pageTex = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 384;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#08080C';
    ctx.fillRect(0, 0, 256, 384);
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 4;
    for (let y = 40; y < 340; y += 30) {
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(20 + Math.random() * 150 + 50, y);
      ctx.stroke();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.rotation.x = Math.PI / 6 + Math.sin(state.clock.elapsedTime) * 0.05;
    }
    
    if (flipPageRef.current) {
      let t = (state.clock.elapsedTime * (isHovered ? 2.0 : 0.5)) % 2; 
      if (t > 1) t = 1; 
      flipPageRef.current.rotation.y = -(t * Math.PI);
    }
  });

  if (!pageTex) return null;

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <mesh position={[-0.6, 0, 0]} rotation={[0, 0.1, 0]}>
        <planeGeometry args={[1.2, 1.6, 4, 6]} />
        <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1.2, 1.6]} />
          <meshBasicMaterial map={pageTex} side={THREE.DoubleSide} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
        </mesh>
      </mesh>
      <mesh position={[0.6, 0, 0]} rotation={[0, -0.1, 0]}>
        <planeGeometry args={[1.2, 1.6, 4, 6]} />
        <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1.2, 1.6]} />
          <meshBasicMaterial map={pageTex} side={THREE.DoubleSide} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
        </mesh>
      </mesh>
      <group position={[0, 0, 0.02]} ref={flipPageRef}>
        <mesh position={[0.6, 0, 0]}>
          <planeGeometry args={[1.2, 1.6, 4, 6]} />
          <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.3} blending={THREE.AdditiveBlending} />
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[1.2, 1.6]} />
            <meshBasicMaterial map={pageTex} side={THREE.DoubleSide} transparent opacity={isHovered ? 0.9 : 0.4} blending={THREE.AdditiveBlending} />
          </mesh>
        </mesh>
      </group>
    </group>
  );
}

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

      // Scanline overlay
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

      // Cursor blink on last line
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
          // Loop restart
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
      {/* Dark terminal background */}
      <mesh>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial color="#050510" />
      </mesh>
      {/* Text texture plane */}
      {textTexture && (
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[2.5, 2.5]} />
          <meshBasicMaterial map={textTexture} transparent opacity={0.95} />
        </mesh>
      )}
      {/* Neon green scanline rim glow */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial color="#39FF14" transparent opacity={isHovered ? 0.06 : 0.02} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function BayesianRecognitionAnimation({ isHovered }: { isHovered: boolean }) {
  const [textTexture, setTextTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const pointsCount = 400;
  const pointsRef = useRef<any>(null);
  const laserRef = useRef<any>(null);

  // Characters we cycle through
  const chars = ["R", "B", "M", "O", "θ", "λ", "Ω"];
  
  // Store point positions for characters
  const charPointsCache = useRef<Record<string, Float32Array>>({});

  // Helper to extract character points on canvas
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

    // Scan for white pixels
    for (let y = 0; y < 64; y += 2) {
      for (let x = 0; x < 64; x += 2) {
        const idx = (y * 64 + x) * 4;
        if (data[idx] > 127) {
          // Normalize to range [-1.1, 1.1]
          const px = (x / 64) * 2.2 - 1.1;
          const py = -((y / 64) * 2.2 - 1.1); // Invert Y
          coords.push({ x: px, y: py });
        }
      }
    }

    const positions = new Float32Array(pointsCount * 3);
    if (coords.length === 0) {
      // Fallback: random circle
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

  // State values for Bayesian updating simulation
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

  // Initialize Canvas Texture for the background terminal
  useEffect(() => {
    if (typeof document === "undefined") return;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    canvasRef.current = canvas;
    const texture = new THREE.CanvasTexture(canvas);
    setTextTexture(texture);
  }, []);

  // Pre-cache characters
  useEffect(() => {
    if (typeof document === "undefined") return;
    chars.forEach(c => getPointsForChar(c));
  }, []);

  // Store the active positions and interpolation
  const currentPositions = useMemo(() => new Float32Array(pointsCount * 3), []);
  const targetPositions = useMemo(() => new Float32Array(pointsCount * 3), []);
  const prevPositions = useMemo(() => new Float32Array(pointsCount * 3), []);
  const noiseOffsets = useMemo(() => {
    const offsets = new Float32Array(pointsCount * 3);
    for (let i = 0; i < pointsCount * 3; i++) {
      offsets[i] = (Math.random() - 0.5) * 0.8; // Max noise amplitude
    }
    return offsets;
  }, []);

  // Set initial target positions
  useEffect(() => {
    if (typeof document === "undefined") return;
    const initialTarget = getPointsForChar("R");
    targetPositions.set(initialTarget);
    prevPositions.set(initialTarget);
    currentPositions.set(initialTarget);
  }, []);

  useFrame((state, delta) => {
    const clock = state.clock;
    const time = clock.getElapsedTime();
    const speed = isHovered ? 2.5 : 1.0;

    // Laser scan line animation
    if (laserRef.current) {
      laserRef.current.position.y = Math.sin(time * 2.5 * speed) * 1.25;
    }

    // Bayesian simulation cycle logic
    const stats = statsRef.current;
    stats.cycleTime += delta * speed;

    // Reset cycle every 4 seconds
    if (stats.cycleTime > 4.0) {
      stats.cycleTime = 0;
      stats.iteration = 0;
      stats.converged = false;
      stats.prevChar = stats.targetChar;
      
      // Select new character that is different from previous
      let newChar = stats.targetChar;
      while (newChar === stats.targetChar) {
        newChar = chars[Math.floor(Math.random() * chars.length)];
      }
      stats.targetChar = newChar;

      // Copy current target positions to previous positions
      prevPositions.set(targetPositions);
      
      // Set new target positions
      const newTarget = getPointsForChar(stats.targetChar);
      targetPositions.set(newTarget);

      // Re-initialize probability distribution with low priors
      chars.forEach(c => {
        stats.probabilities[c] = c === stats.prevChar ? 0.25 : (0.75 / (chars.length - 1));
      });
    }

    // Run sequential Bayesian updating steps
    const step = Math.floor(stats.cycleTime / 0.6);
    if (step > stats.iteration && !stats.converged) {
      stats.iteration = step;
      
      let sum = 0;
      chars.forEach(c => {
        const likelihood = c === stats.targetChar ? 0.9 : 0.1;
        stats.probabilities[c] = likelihood * stats.probabilities[c];
        sum += stats.probabilities[c];
      });
      // Normalize probabilities
      chars.forEach(c => {
        stats.probabilities[c] = stats.probabilities[c] / sum;
      });

      stats.confidence = stats.probabilities[stats.targetChar];
      if (stats.confidence >= 0.85) {
        stats.converged = true;
      }
    }

    // Calculate noise level and morph progress
    stats.noiseLevel = Math.max(0, 1.0 - stats.cycleTime / 2.5);
    const morphProgress = Math.min(1.0, stats.cycleTime / 2.0);

    // Calculate particle positions
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

    // Update Terminal Background Canvas Texture
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

function GMCounterAnimation({ isHovered }: { isHovered: boolean }) {
  const [textTexture, setTextTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<any>(null);
  const tubeRef = useRef<any>(null);
  const pulseGroupRef = useRef<any>(null);
  
  const particleCount = 80;
  
  // Keep track of particle positions, velocities, and lifetimes
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
        life: Math.random(), // initial random offset
        speed: 0.3 + Math.random() * 0.5
      });
    }
    return data;
  }, []);

  const currentPositions = useMemo(() => new Float32Array(particleCount * 3), []);

  // History for oscilloscope
  const scopeHistory = useRef<number[]>(Array(30).fill(20));

  // Pulse rings inside the GM tube
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
    
    // Rotate the GM Tube slightly
    if (tubeRef.current) {
      tubeRef.current.rotation.x = 0.2 + Math.sin(time * 0.5) * 0.1;
      tubeRef.current.rotation.y = -0.4 + Math.cos(time * 0.5) * 0.1;
    }

    // Animate the particles streaming from source to detector
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

    // Animate the detection pulse rings in the tube
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

    // Update the Canvas Dashboard Texture
    if (canvasRef.current && textTexture) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;
      
      ctx.fillStyle = '#050B0B';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Scanline overlay
      ctx.fillStyle = 'rgba(0, 229, 255, 0.02)';
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 2);
      }

      // Title
      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = '#00E5FF';
      ctx.fillText('NUCLEONIX GM-TAB v0.81', 30, 45);
      
      // Separator
      ctx.fillStyle = 'rgba(0, 229, 255, 0.15)';
      ctx.fillRect(30, 60, canvas.width - 60, 2);

      // Status info
      ctx.font = '13px monospace';
      ctx.fillStyle = '#39FF14';
      ctx.fillText('● BLE CONNECTED [nRF52810]', 30, 90);
      ctx.fillStyle = '#00E5FF';
      ctx.fillText('● SUPABASE LICENSED: OK', 270, 90);

      // Helipot delta-HV simulation
      const hvSteps = [600, 750, 900, 960, 1000, 1050, 1100, 1200];
      const stepIdx = Math.floor((time * 0.25) % hvSteps.length);
      const currentHV = hvSteps[stepIdx];

      ctx.fillStyle = '#A18AFF';
      ctx.fillText(`HV HELIPOT: ${currentHV}V / 1200V`, 30, 125);
      ctx.fillText(`STEPS: ITERATION ${stepIdx + 1}/${hvSteps.length} [d-HV +50V]`, 30, 145);

      // HV Progress bar
      ctx.strokeStyle = '#A18AFF';
      ctx.strokeRect(30, 160, 200, 12);
      ctx.fillStyle = 'rgba(161, 138, 255, 0.3)';
      ctx.fillRect(32, 162, Math.floor((currentHV / 1200) * 196), 8);

      // Labeling and Time
      const labels = ['SAMPLE_A', 'STANDARD_REF', 'BACKGROUND_BG'];
      const activeLabelIdx = Math.floor((time * 0.1) % labels.length);
      const activeLabel = labels[activeLabelIdx];

      ctx.fillStyle = '#00E5FF';
      ctx.fillText(`LABEL: ${activeLabel}`, 270, 125);
      ctx.fillText(`PRESET TIME: ${(time % 100).toFixed(1)}s / 100s`, 270, 145);

      // CPS & CPM
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

      // Oscilloscope box
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
      ctx.strokeRect(30, 290, canvas.width - 60, 180);
      ctx.fillStyle = 'rgba(0, 229, 255, 0.02)';
      ctx.fillRect(30, 290, canvas.width - 60, 180);

      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = 'rgba(0, 229, 255, 0.5)';
      ctx.fillText('REAL-TIME RAD-PULSE OSCILLOSCOPE', 40, 310);

      // Oscilloscope grid
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let ox = 30; ox < canvas.width - 30; ox += 40) {
        ctx.beginPath(); ctx.moveTo(ox, 290); ctx.lineTo(ox, 470); ctx.stroke();
      }
      for (let oy = 290; oy < 470; oy += 30) {
        ctx.beginPath(); ctx.moveTo(30, oy); ctx.lineTo(canvas.width - 30, oy); ctx.stroke();
      }

      // History update
      const updateInterval = 4;
      if (Math.floor(state.clock.elapsedTime * 60) % updateInterval === 0) {
        scopeHistory.current.push(currentCPS);
        if (scopeHistory.current.length > 50) {
          scopeHistory.current.shift();
        }
      }

      // Draw line
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

const projects = [
  {
    title: "Tab-Based GM Counting System",
    tags: ["React Native", "Node.js", "REST APIs", "Expo", "SQLite", "BLE", "Arduino", "Supabase"],
    description: "A professional, tablet-optimized radiation monitoring mobile application built for Nucleonix scintillation detectors. It retrieves the unique Android Device ID to authenticate access via Supabase-driven Device Based Access Control, acting as a hardware license gate. Once authorized, the app connects to an Arduino-based hardware detector via BLE using the Nordic UART Service (NUS) for real-time CPS/CPM data acquisition. Features an industrial dashboard with 0–1200V helipot stepping control, Sample/Standard/Background labeling, on-device SQLite storage, Node.js REST API backend integration, and SheetJS spreadsheet exports.",
    visual: GMCounterAnimation,
    tag: "GM_CORE",
    repoUrl: "https://github.com/NucleonixGCET/Tab-Based-GM-Counting-System.git"
  },
  {
    title: "Probabilistic Character Recognition Engine",
    tags: ["R", "Bayesian Stats", "MAP Estimation"],
    description: "Developed a probabilistic character recognition engine in R using recursive Bayesian updating to solve sequential classification problems. Engineered a stochastic smoothing function (0.9/0.1 likelihood) and MAP estimation to handle noisy, contradictory inputs in real time, optimizing convergence at a 0.85 confidence threshold with a scalable data ingestion pipeline.",
    visual: BayesianRecognitionAnimation,
    tag: "PROB_ENGINE",
    repoUrl: "https://github.com/Mourya05/Probabilistic-Character-Recognition-Engine.git"
  },
  {
    title: "Hobby-OS",
    tags: ["C", "x86 Assembly", "QEMU", "Makefile"],
    description: "A custom-built 32-bit x86 operating system kernel developed from scratch, featuring custom implementations of GDT, IDT, memory paging, and system calls.",
    visual: BootSequenceAnimation,
    tag: "KERN_BOOT",
    repoUrl: "https://github.com/Mourya05/Hobby-OS.git"
  },
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
      {/* Visual area — static placeholder on mobile, 3D Canvas on desktop */}
      <div className="w-full md:w-[45%] h-[200px] sm:h-[300px] md:h-auto md:aspect-square rounded-xl bg-black/40 border border-white/5 relative overflow-hidden flex items-center justify-center shrink-0">
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 font-mono text-[9px] text-teal tracking-widest uppercase z-20 bg-obsidian/60 px-2 py-0.5 rounded">{tag}</div>
        <div className="w-full h-full">
          {isMobile ? (
            // Lightweight static placeholder — zero WebGL on mobile
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
              <span className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">PROJECT ARCHIVE</span>
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

      <div className="absolute -bottom-4 -right-2 font-display font-black text-[6rem] lg:text-[10rem] text-white/[0.02] pointer-events-none italic select-none hidden sm:block">
        0{index}
      </div>
    </motion.div>
  );
};

export default function ProjectsSection() {
  return (
    <section className="relative w-full py-24 sm:py-32 px-4 sm:px-6 flex flex-col items-center">
      <div className="text-center mb-10 flex flex-col items-center w-full px-4">
        <div className="px-4 py-1.5 glass-panel rounded-full font-mono text-[9px] text-ash tracking-widest uppercase mb-8">
          SYSTEM PROJECTS / 010
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 leading-tight">
          Neural Systems<br className="hidden sm:block" /> Portfolio
        </h2>
        <p className="font-sans text-ash text-sm max-w-lg mx-auto text-center">
          Deep archival data of experimental synthetic consciousness frameworks and kernel architectures.
        </p>
      </div>

      <div className="w-full flex-col flex gap-16 sm:gap-24 lg:gap-32 pb-24 sm:pb-32">
        {projects.map((proj, idx) => (
          <ProjectCard key={proj.title} index={idx + 1} {...proj} />
        ))}
      </div>

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


    </section>
  );
}
