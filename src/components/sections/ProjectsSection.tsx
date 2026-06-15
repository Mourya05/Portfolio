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

const projects = [
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
