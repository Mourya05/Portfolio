"use client";

import { useEffect, useRef } from "react";

// ─── Tuning constants ─────────────────────────────────────────────────────────
const DESKTOP_COUNT    = 72;   // particles on screens ≥ 768 px
const MOBILE_COUNT     = 36;   // particles on smaller screens
const LINK_DIST        = 130;  // px — particle ↔ particle connection threshold
const CURSOR_LINK_DIST = 190;  // px — particle ↔ cursor connection threshold
const REPEL_RADIUS     = 85;   // px — cursor pushes particles away inside this
const ATTRACT_RADIUS   = 170;  // px — outer ring: gentle pull toward cursor
const REPEL_STRENGTH   = 1.1;  // force magnitude for push
const ATTRACT_STRENGTH = 0.10; // force magnitude for pull
const DAMPING          = 0.91; // velocity decay per frame (keeps speeds bounded)
const BASE_SPEED       = 0.32; // natural drift speed cap (restores after interaction)
const GRID_SIZE        = 42;   // px — blueprint grid cell
const BG_COLOR         = "#050508";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  bvx: number;    // base (natural) velocity x — used for gentle return
  bvy: number;    // base (natural) velocity y
  r: number;      // base radius
  base: number;   // base opacity
  pulse: number;  // breathing phase offset
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef    = useRef<number>(0);
  const pausedRef = useRef(false);
  const frameRef  = useRef(0);

  useEffect(() => {
    const _canvas = canvasRef.current;
    if (!_canvas) return;
    // alpha:false skips compositing — solid fill every frame is faster
    const _ctx = _canvas.getContext("2d", { alpha: false });
    if (!_ctx) return;

    // Re-declare as explicit non-null types so TypeScript propagates the
    // narrowing into all nested function closures (function declarations
    // don't inherit control-flow narrowing from the outer scope).
    const canvas: HTMLCanvasElement         = _canvas;
    const ctx:    CanvasRenderingContext2D  = _ctx;

    let W = 0;
    let H = 0;
    let dpr = 1;

    // ── Spawn a single particle anywhere on screen ───────────────────────────
    function spawn(): Particle {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.06 + Math.random() * BASE_SPEED;
      const bvx   = Math.cos(angle) * speed;
      const bvy   = Math.sin(angle) * speed;
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: bvx, vy: bvy,
        bvx, bvy,
        r:     0.8 + Math.random() * 1.5,
        base:  0.35 + Math.random() * 0.45,
        pulse: Math.random() * Math.PI * 2,
      };
    }

    function initParticles() {
      const count = W < 768 ? MOBILE_COUNT : DESKTOP_COUNT;
      particlesRef.current = Array.from({ length: count }, spawn);
    }

    // ── Canvas resize (resets transform) ────────────────────────────────────
    function resize() {
      dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      W   = window.innerWidth;
      H   = window.innerHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);
      initParticles();
    }

    // ── Blueprint grid — batched path to minimise draw calls ─────────────────
    function drawGrid() {
      ctx.beginPath();
      for (let x = 0; x <= W; x += GRID_SIZE) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
      }
      for (let y = 0; y <= H; y += GRID_SIZE) {
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.027)";
      ctx.lineWidth   = 0.5;
      ctx.stroke();
    }

    // ── Cursor node — glowing pulsing orb at mouse position ─────────────────
    function drawCursorNode(mx: number, my: number, t: number) {
      const pulse = 0.7 + 0.3 * Math.sin(t * 2.5);
      const outerR = 5 + 2 * pulse;

      // Outer glow
      const glow = ctx.createRadialGradient(mx, my, 0, mx, my, outerR * 6);
      glow.addColorStop(0,   `rgba(161,138,255,${0.25 * pulse})`);
      glow.addColorStop(0.4, `rgba(161,138,255,${0.10 * pulse})`);
      glow.addColorStop(1,   "rgba(161,138,255,0)");
      ctx.beginPath();
      ctx.arc(mx, my, outerR * 6, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Expanding ring (second pulse phase)
      const ringPulse = 0.5 + 0.5 * Math.sin(t * 2.5 + Math.PI);
      ctx.beginPath();
      ctx.arc(mx, my, 10 + 8 * ringPulse, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(161,138,255,${0.18 * (1 - ringPulse)})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Core bright dot
      ctx.beginPath();
      ctx.arc(mx, my, outerR * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(161,138,255,${0.9 * pulse})`;
      ctx.fill();

      // Inner white flash
      ctx.beginPath();
      ctx.arc(mx, my, outerR * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.7 * pulse})`;
      ctx.fill();
    }

    // ── Draw a particle node with proximity boost ────────────────────────────
    function drawNode(p: Particle, alpha: number, boost: number) {
      const r     = p.r * (1 + boost * 0.7);   // grow when near cursor
      const a     = Math.min(1, alpha * (1 + boost * 0.8));

      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,229,255,${a})`;
      ctx.fill();

      // Halo (only for larger or heated nodes to keep cost down)
      if (r > 1.2 || boost > 0.2) {
        const haloR = r * (4 + boost * 3);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR);
        g.addColorStop(0, `rgba(0,229,255,${a * 0.5})`);
        g.addColorStop(1, "rgba(0,229,255,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
    }

    // ── Main loop ────────────────────────────────────────────────────────────
    function tick() {
      rafRef.current = requestAnimationFrame(tick);
      if (pausedRef.current) return;

      const frame = ++frameRef.current;
      const t     = frame * 0.013;

      const ps = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hasMouse = mouseRef.current.active;

      const ld2  = LINK_DIST        * LINK_DIST;
      const cd2  = CURSOR_LINK_DIST * CURSOR_LINK_DIST;
      const rd2  = REPEL_RADIUS     * REPEL_RADIUS;
      const ad2  = ATTRACT_RADIUS   * ATTRACT_RADIUS;

      // ── Background + grid ────────────────────────────────────────────────
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, W, H);
      drawGrid();

      // ── Physics: cursor forces + natural drift + damping ─────────────────
      for (let i = 0; i < ps.length; i++) {
        const p  = ps[i];
        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;

        if (hasMouse && d2 < ad2) {
          const dist = Math.sqrt(d2);
          const nx   = dx / dist; // unit vector pointing away from cursor
          const ny   = dy / dist;

          if (d2 < rd2) {
            // REPEL — strong push outward
            const t2 = 1 - dist / REPEL_RADIUS;
            p.vx += nx * REPEL_STRENGTH * t2;
            p.vy += ny * REPEL_STRENGTH * t2;
          } else {
            // ATTRACT — gentle pull toward cursor in the outer ring
            const t2 = 1 - (dist - REPEL_RADIUS) / (ATTRACT_RADIUS - REPEL_RADIUS);
            p.vx -= nx * ATTRACT_STRENGTH * t2;
            p.vy -= ny * ATTRACT_STRENGTH * t2;
          }
        }

        // Damping (brings velocity back toward base drift over time)
        p.vx = p.vx * DAMPING + p.bvx * (1 - DAMPING);
        p.vy = p.vy * DAMPING + p.bvy * (1 - DAMPING);

        // Hard speed clamp so repulsion spikes don't fly off screen
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxV  = hasMouse ? 3.5 : BASE_SPEED * 1.1;
        if (speed > maxV) {
          const s = maxV / speed;
          p.vx *= s;
          p.vy *= s;
        }

        // Move + edge wrap
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -15) p.x = W + 15;
        else if (p.x > W + 15) p.x = -15;
        if (p.y < -15) p.y = H + 15;
        else if (p.y > H + 15) p.y = -15;
      }

      // ── Particle ↔ particle edges ─────────────────────────────────────────
      // Batch all edges in one path set per color for fewer state changes
      ctx.lineWidth = 0.6;
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        for (let j = i + 1; j < ps.length; j++) {
          const q  = ps[j];
          const dx = q.x - p.x;
          const dy = q.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= ld2) continue;

          const ratio = 1 - d2 / ld2;
          // Extra brightness if both particles are near the cursor
          let extra = 0;
          if (hasMouse) {
            const dpx = p.x - mx, dpy = p.y - my;
            const dqx = q.x - mx, dqy = q.y - my;
            const dpd2 = dpx * dpx + dpy * dpy;
            const dqd2 = dqx * dqx + dqy * dqy;
            if (dpd2 < cd2 && dqd2 < cd2) {
              extra = (1 - dpd2 / cd2) * (1 - dqd2 / cd2) * 0.35;
            }
          }
          const alpha = ratio * 0.13 + extra;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
          ctx.stroke();
        }
      }

      // ── Particle ↔ cursor edges ───────────────────────────────────────────
      if (hasMouse) {
        for (let i = 0; i < ps.length; i++) {
          const p  = ps[i];
          const dx = mx - p.x;
          const dy = my - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= cd2) continue;

          const ratio = 1 - d2 / cd2;
          // Thicker + brighter the closer the particle
          ctx.lineWidth   = 0.5 + ratio * 1.2;
          ctx.strokeStyle = `rgba(161,138,255,${ratio * ratio * 0.55})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }
        ctx.lineWidth = 0.6; // reset
      }

      // ── Cursor node ───────────────────────────────────────────────────────
      if (hasMouse) {
        drawCursorNode(mx, my, t);
      }

      // ── Particle nodes (on top of all edges) ─────────────────────────────
      for (let i = 0; i < ps.length; i++) {
        const p     = ps[i];
        const breathe = 0.55 + 0.45 * Math.sin(t + p.pulse);

        // Compute proximity boost for this node
        let boost = 0;
        if (hasMouse) {
          const dx = p.x - mx, dy = p.y - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < cd2) boost = 1 - d2 / cd2;
        }

        drawNode(p, p.base * breathe, boost);
      }
    }

    // ── Event handlers ───────────────────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    }
    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999, active: false };
    }
    function onVisibility() {
      pausedRef.current = document.hidden;
    }

    // ── Boot ─────────────────────────────────────────────────────────────────
    resize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    }

    window.addEventListener("resize",           onResize);
    window.addEventListener("mousemove",        onMouseMove,  { passive: true });
    window.addEventListener("mouseleave",       onMouseLeave);
    document.addEventListener("visibilitychange", onVisibility);

    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize",           onResize);
      window.removeEventListener("mousemove",        onMouseMove);
      window.removeEventListener("mouseleave",       onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        width:         "100vw",
        height:        "100vh",
        zIndex:        2,
        pointerEvents: "none",
        display:       "block",
        willChange:    "transform",
      }}
    />
  );
}
