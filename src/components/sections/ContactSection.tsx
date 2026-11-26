"use client";

import { useState } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaDownload,
  FaCopy,
  FaCheck,
  FaEnvelope,
  FaPaperPlane,
  FaCode,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

const EMAIL = "mourya.birru@gmail.com";

const inputBase = "w-full px-4 py-3 text-white transition-all focus:outline-none mono";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  function copyEmail() {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("https://formsubmit.co/ajax/" + EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || "New Portfolio Inquiry",
          message: formData.message,
          _subject: `Portfolio Contact from ${formData.name}: ${formData.subject || "New Message"}`,
          _template: "table",
        }),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Submission failed — please email directly.");
      }
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please email directly.");
    }
  }

  function fieldStyle(id: string): React.CSSProperties {
    return {
      background: "var(--surface)",
      border: `1px solid ${focusedField === id ? "var(--amber)" : "var(--border)"}`,
      fontSize: 13,
      color: "var(--text)",
      fontFamily: "var(--font-mono)",
      transition: "border-color 0.15s ease",
    };
  }

  return (
    <section id="contact" className="py-24 lg:py-32">
      <div className="section-wrap">

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <span className="w-[1px] h-3.5 bg-amber-500" />
          <span className="eyebrow">Contact</span>
          <div className="flex-1 h-[1px] bg-[var(--border)] ml-2" />
        </div>

        <h2
          className="section-heading tracking-tight font-semibold text-white mb-14"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.08 }}
        >
          Get in Touch
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20 items-start">

          {/* Left — links + email */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex flex-col gap-6"
          >
            <p className="text-[15px] text-[var(--muted)] leading-relaxed max-w-[440px]">
              Open to AI/ML, Data Science and SDE roles. If you&apos;re working on something interesting, or want to collaborate, drop a line below or reach out directly.
            </p>

            {/* Email row with animated copy button */}
            <div
              className="inline-flex flex-wrap items-center gap-3 p-3 sm:px-4 sm:py-3 bg-[var(--bg-elevated)] border border-[var(--border)] group hover:border-amber-500/40 transition-colors"
            >
              <FaEnvelope size={13} className="text-amber-500 shrink-0" />
              <a
                href={`mailto:${EMAIL}`}
                className="mono text-[13px] text-white tracking-[0.03em] hover:text-amber-400 transition-colors"
              >
                {EMAIL}
              </a>

              {/* Copy button with AnimatePresence icon swap and instant amber COPIED flash badge */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={copyEmail}
                className="mono btn-ghost text-[11px] px-3 py-1.5 tracking-[0.08em] relative overflow-hidden"
                aria-label="Copy email address"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
                      className="flex items-center gap-1.5 text-amber-400 font-semibold"
                    >
                      <FaCheck size={10} className="text-amber-400" />
                      <span>COPIED</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
                      className="flex items-center gap-1.5"
                    >
                      <FaCopy size={10} />
                      <span>Copy</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* External links */}
            <div className="flex flex-wrap gap-2">
              {[
                { href: "/Mourya_Resume.pdf", download: "Mourya_Birru_Resume.pdf", icon: <FaDownload size={12} />, label: "Resume" },
                { href: "https://github.com/mourya05",          icon: <FaGithub size={12} />,   label: "GitHub"   },
                { href: "https://linkedin.com/in/mourya-birru", icon: <FaLinkedin size={12} />, label: "LinkedIn" },
                { href: "https://leetcode.com/u/Mourya_birru/", icon: <FaCode size={12} />,     label: "LeetCode" },
              ].map(link => (
                <motion.a
                  key={link.label}
                  whileTap={{ scale: 0.96 }}
                  href={link.href}
                  download={"download" in link ? link.download : undefined}
                  target={"download" in link ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right — contact form */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] as const }}
            className="corner-card overflow-hidden group hover:border-amber-500/40 transition-colors"
          >
            <div className="p-6 sm:p-7">
              <p className="mono text-[9px] tracking-[0.14em] uppercase text-amber-500 mb-5 font-semibold">
                Send a Message
              </p>

              {status === "success" ? (
                <div
                  className="p-5 border border-green-500/30 bg-green-500/5 flex flex-col gap-2.5"
                >
                  <div className="flex items-center gap-2 font-bold text-white">
                    <FaCheck className="text-green-400" />
                    <span>Message transmitted successfully.</span>
                  </div>
                  <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                    Details forwarded to inbox. Expect a reply within 24–48 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="btn-ghost self-start text-[11px] px-3.5 py-1.5"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: "name",  label: "Your Name *",  type: "text",  required: true,  placeholder: "Mourya" },
                      { id: "email", label: "Your Email *", type: "email", required: true,  placeholder: "you@domain.com" },
                    ].map(field => (
                      <div key={field.id} className="flex flex-col gap-1.5">
                        <label htmlFor={`cf-${field.id}`} className="mono text-[9px] tracking-[0.12em] uppercase text-[var(--muted)]">
                          {field.label}
                        </label>
                        <input
                          id={`cf-${field.id}`}
                          type={field.type}
                          required={field.required}
                          placeholder={field.placeholder}
                          value={formData[field.id as keyof typeof formData]}
                          onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                          className={inputBase}
                          style={fieldStyle(field.id)}
                          onFocus={() => setFocusedField(field.id)}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cf-subject" className="mono text-[9px] tracking-[0.12em] uppercase text-[var(--muted)]">
                      Subject
                    </label>
                    <input
                      id="cf-subject"
                      type="text"
                      placeholder="Opportunity / Collaboration / Query"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className={inputBase}
                      style={fieldStyle("subject")}
                      onFocus={() => setFocusedField("subject")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cf-message" className="mono text-[9px] tracking-[0.12em] uppercase text-[var(--muted)]">
                      Message *
                    </label>
                    <textarea
                      id="cf-message"
                      rows={5}
                      required
                      placeholder="Hi Mourya, I'd like to talk about..."
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className={`${inputBase} resize-y min-h-[110px]`}
                      style={fieldStyle("message")}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>

                  {status === "error" && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                      {errorMessage}{" "}
                      <a
                        href={`mailto:${EMAIL}?subject=${encodeURIComponent(formData.subject || "Portfolio Contact")}&body=${encodeURIComponent(formData.message)}`}
                        className="underline text-white ml-1 font-medium"
                      >
                        Send via email client
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      disabled={status === "submitting"}
                      className="btn-primary"
                    >
                      <FaPaperPlane size={11} />
                      <span>{status === "submitting" ? "Transmitting…" : "Send Message"}</span>
                    </motion.button>
                    <span className="mono text-[10px] text-[var(--subtle)] tracking-[0.06em]">
                      Directly to inbox
                    </span>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
