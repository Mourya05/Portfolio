"use client";

import TelemetryNumber from "@/components/TelemetryNumber";
import { motion } from "framer-motion";

/* ─── Telemetry data ─────────────────────────────────────────────────────── */
const channels = [
  {
    id: "ieeeXtreme",
    label: "IEEEXtreme",
    renderValue: () => (
      <span>
        Global Rank <TelemetryNumber value={542} duration={0.6} />
      </span>
    ),
    sub: "IEEEXtreme 18.0",
    href: "https://ieeextreme.org",
    dot: true,
  },
  {
    id: "leetcode",
    label: "LeetCode",
    renderValue: () => (
      <span>
        <TelemetryNumber value={2205} duration={0.6} /> Rating
      </span>
    ),
    sub: "Guardian · Top 0.9%",
    href: "https://leetcode.com/u/Mourya_birru/",
    dot: true,
  },
  {
    id: "github",
    label: "GitHub",
    renderValue: () => (
      <span>
        mourya05
      </span>
    ),
    sub: (
      <span>
        <TelemetryNumber value={14} suffix="+" duration={0.6} /> Repositories
      </span>
    ),
    href: "https://github.com/mourya05",
    dot: false,
  },
  {
    id: "smartInterviews",
    label: "Smart Interviews",
    renderValue: () => (
      <span>
        Rank <TelemetryNumber value={1} prefix="#" duration={0.6} />
      </span>
    ),
    sub: "GCET-2027-R Cohort",
    href: "https://www.smartinterviews.in/",
    dot: false,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    renderValue: () => <span>mourya-birru</span>,
    sub: "Open to Work",
    href: "https://linkedin.com/in/mourya-birru",
    dot: true,
  },
];

export default function TelemetryStrip() {
  return (
    <section
      id="telemetry"
      aria-label="Competitive coding telemetry"
      style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-elevated)",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}
    >
      {/* Channel header bar */}
      <div
        className="mono"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "5px 28px",
          borderBottom: "1px solid var(--border)",
          fontSize: 9,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--subtle)",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span style={{ color: "var(--amber)" }}>SYS · TELEMETRY</span>
        </div>
        <span>COMPETITIVE PROFILE READOUT</span>
        <span>CH {channels.length}</span>
      </div>

      {/* Channel strip */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          alignItems: "stretch",
          minWidth: 0,
        }}
      >
        {channels.map((ch, i) => (
          <a
            key={ch.id}
            href={ch.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#12161F]"
            style={{
              flex: "1 0 160px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: "12px 20px",
              borderRight: i < channels.length - 1 ? "1px solid var(--border)" : "none",
              textDecoration: "none",
              cursor: "pointer",
              minWidth: 0,
            }}
          >
            {/* Top border amber illumination on hover */}
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-[1.5px] bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            />

            {/* Channel label */}
            <span
              className="mono transition-colors duration-150 group-hover:text-amber-500/80"
              style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--subtle)", textTransform: "uppercase" }}
            >
              {ch.label}
            </span>

            {/* Value - slightly shifts right on cell hover */}
            <span
              className="mono flex items-center gap-1.5 text-white transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              {ch.dot && (
                <span
                  aria-hidden="true"
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "var(--amber)",
                    flexShrink: 0,
                    display: "inline-block",
                  }}
                />
              )}
              {ch.renderValue()}
            </span>

            {/* Sub-label */}
            <span
              className="mono transition-colors duration-150 group-hover:text-gray-300"
              style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.04em" }}
            >
              {ch.sub}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
