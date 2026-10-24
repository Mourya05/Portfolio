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
} from "react-icons/fa6";

const inputBase = "w-full px-4 py-3 text-white transition-all focus:outline-none";
const inputStyle: React.CSSProperties = {
  background: "rgba(22,18,34,0.9)",
  border: "1px solid var(--border)",
  fontSize: "16px",
  color: "var(--text)",
};
const inputFocusStyle: React.CSSProperties = {
  borderColor: "rgba(139,92,246,0.65)",
  boxShadow: "0 0 0 2.5px rgba(139,92,246,0.22)",
};

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  function copyEmail() {
    navigator.clipboard.writeText("mourya.birru@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("https://formsubmit.co/ajax/mourya.birru@gmail.com", {
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
        throw new Error(data?.message || "Failed to submit. Please email directly.");
      }
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please email directly.");
    }
  }

  function fieldStyle(id: string): React.CSSProperties {
    return focusedField === id ? { ...inputStyle, ...inputFocusStyle } : inputStyle;
  }

  return (
    <section id="contact" className="py-28 lg:py-36">
      <div className="section-wrap">

        {/* Eyebrow */}
        <div className="w-full flex items-center gap-3 mb-3">
          <span className="w-2 h-2 shrink-0"
            style={{ background: "var(--violet)", clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)" }}
          />
          <span className="eyebrow">Contact</span>
          <div className="flex-1 h-px ml-2" style={{ background: "var(--border)" }} />
        </div>

        <h2
          className="section-heading tracking-tight font-semibold mb-14"
          style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)", lineHeight: 1.08, color: "white" }}
        >
          Get in Touch
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-14 lg:gap-20 items-start">

          {/* Left */}
          <div className="flex flex-col items-start">
            <p
              className="leading-relaxed mb-9"
              style={{ fontSize: "18px", color: "var(--muted)", maxWidth: "460px" }}
            >
              Open to AI/ML, data science and SDE roles and internships. If you&apos;re working on something in those areas, or want to discuss a project, feel free to drop a message or reach out directly.
            </p>

            {/* Email tile */}
            <div
              className="inline-flex flex-wrap items-center gap-3 sm:gap-4 mb-9 w-full sm:w-auto"
              style={{
                padding: "14px 20px",
                background: "rgba(139,92,246,0.09)",
                border: "1px solid rgba(139,92,246,0.28)",
              }}
            >
              <div className="flex items-center gap-3">
                <FaEnvelope size={16} style={{ color: "var(--violet)", flexShrink: 0 }} />
                <a
                  href="mailto:mourya.birru@gmail.com"
                  className="mono font-semibold transition-colors"
                  style={{ fontSize: "15px", textDecoration: "none", color: "white", letterSpacing: "0.03em" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--violet-hi)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "white"; }}
                >
                  mourya.birru@gmail.com
                </a>
              </div>

              {/* Copy — flashes red on click */}
              <button
                type="button"
                onClick={copyEmail}
                className="btn-secondary self-start sm:self-auto shrink-0"
                aria-label="Copy email address"
                style={copied ? { background: "rgba(239,68,68,0.3)", transition: "background 0.3s" } : {}}
              >
                <span className="btn-secondary-inner mono flex items-center gap-1.5"
                  style={{ fontSize: "12px", padding: "6px 14px" }}>
                  {copied ? (
                    <>
                      <FaCheck size={11} style={{ color: "var(--red)" }} />
                      <span style={{ color: "var(--violet-hi)" }}>Copied</span>
                    </>
                  ) : (
                    <>
                      <FaCopy size={11} style={{ color: "var(--muted)" }} />
                      <span>Copy</span>
                    </>
                  )}
                </span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a href="/Mourya_Resume.pdf" download="Mourya_Birru_Resume.pdf" className="btn-secondary">
                <span className="btn-secondary-inner"><FaDownload size={13} /><span>Resume</span></span>
              </a>
              <a href="https://github.com/mourya05" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <span className="btn-secondary-inner"><FaGithub size={14} /><span>GitHub</span></span>
              </a>
              <a href="https://linkedin.com/in/mourya-birru" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <span className="btn-secondary-inner"><FaLinkedin size={14} /><span>LinkedIn</span></span>
              </a>
            </div>
          </div>

          {/* Right: form in chamfer card */}
          <div className="chamfer-card w-full">
            <div className="chamfer-card-inner p-7 sm:p-9">
              <h3
                className="mono uppercase tracking-widest font-semibold mb-7"
                style={{ fontSize: "12px", color: "var(--violet-hi)", letterSpacing: "0.12em" }}
              >
                Send a Message
              </h3>

              {status === "success" ? (
                <div
                  className="p-6 flex flex-col gap-3"
                  style={{ border: "1px solid rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.08)" }}
                >
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <FaCheck style={{ color: "var(--violet)" }} />
                    <span>Message Delivered!</span>
                  </div>
                  <p className="leading-relaxed" style={{ fontSize: "15px", color: "var(--muted)" }}>
                    Thank you for reaching out. The details have been sent to my inbox and I will get back to you shortly.
                  </p>
                  <button type="button" onClick={() => setStatus("idle")} className="btn-secondary self-start mt-2">
                    <span className="btn-secondary-inner" style={{ fontSize: "13px" }}>Send another message</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="contact-name" className="mono uppercase tracking-wider"
                        style={{ fontSize: "12px", color: "var(--muted)", letterSpacing: "0.1em" }}>
                        Your Name *
                      </label>
                      <input
                        id="contact-name" type="text" required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Mourya"
                        className={inputBase}
                        style={fieldStyle("name")}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="contact-email" className="mono uppercase tracking-wider"
                        style={{ fontSize: "12px", color: "var(--muted)", letterSpacing: "0.1em" }}>
                        Your Email *
                      </label>
                      <input
                        id="contact-email" type="email" required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className={inputBase}
                        style={fieldStyle("email")}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-subject" className="mono uppercase tracking-wider"
                      style={{ fontSize: "12px", color: "var(--muted)", letterSpacing: "0.1em" }}>
                      Subject
                    </label>
                    <input
                      id="contact-subject" type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Opportunity / Collaboration / Query"
                      className={inputBase}
                      style={fieldStyle("subject")}
                      onFocus={() => setFocusedField("subject")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-message" className="mono uppercase tracking-wider"
                      style={{ fontSize: "12px", color: "var(--muted)", letterSpacing: "0.1em" }}>
                      Message *
                    </label>
                    <textarea
                      id="contact-message" rows={5} required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hi Mourya, I'd like to talk about..."
                      className={`${inputBase} resize-y min-h-[120px]`}
                      style={fieldStyle("message")}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>

                  {status === "error" && (
                    <div
                      className="p-3"
                      style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", fontSize: "13px", color: "#fca5a5" }}
                    >
                      {errorMessage}{" "}
                      <a
                        href={`mailto:mourya.birru@gmail.com?subject=${encodeURIComponent(formData.subject || "Portfolio Contact")}&body=${encodeURIComponent(formData.message)}`}
                        className="underline font-medium ml-1 text-white"
                      >
                        Click here to send via email client
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button type="submit" disabled={status === "submitting"} className="btn-primary">
                      <FaPaperPlane size={13} />
                      <span>{status === "submitting" ? "Sending..." : "Send Message"}</span>
                    </button>
                    <span className="mono" style={{ fontSize: "12px", color: "var(--muted)" }}>
                      Direct to inbox
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
