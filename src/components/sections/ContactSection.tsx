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

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
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
      const msg = err instanceof Error ? err.message : "Something went wrong. Please email directly.";
      setErrorMessage(msg);
    }
  }

  return (
    <section id="contact" className="py-24 lg:py-32">
      <div className="section-wrap">
        
        {/* Eyebrow: Chamfered square + Label + Hairline */}
        <div className="w-full flex items-center gap-3 mb-3">
          <span
            className="w-2 h-2 shrink-0 bg-[var(--accent)]"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            }}
          />
          <span className="mono text-xs uppercase tracking-widest text-[var(--muted)]">
            Contact
          </span>
          <div className="flex-1 h-[1px] bg-[var(--border)] ml-2" />
        </div>

        <h2
          className="tracking-tight text-white font-semibold mb-12"
          style={{
            fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
            lineHeight: 1.1,
          }}
        >
          Get in Touch
        </h2>

        {/* 2-Column Layout: Direct Details on Left, Interactive Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Context, Email Highlight & Social Buttons */}
          <div className="flex flex-col items-start">
            <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-8">
              Open to AI/ML, data science and SDE roles and internships. If you&apos;re working on something in those areas, or want to discuss a project, feel free to drop a message or reach out directly.
            </p>

            {/* Email highlighted with violet background & copy button */}
            <div
              className="inline-flex flex-wrap items-center gap-3 sm:gap-4 p-3.5 sm:px-5 sm:py-3 rounded mb-8 transition-colors w-full sm:w-auto"
              style={{
                backgroundColor: "rgba(167, 139, 250, 0.09)",
                border: "1px solid rgba(167, 139, 250, 0.28)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <FaEnvelope size={15} className="text-[var(--accent)] shrink-0" />
                <a
                  href="mailto:mourya.birru@gmail.com"
                  className="text-sm sm:text-base font-semibold text-white hover:text-[var(--accent)] transition-colors mono tracking-wide"
                  style={{ textDecoration: "none" }}
                >
                  mourya.birru@gmail.com
                </a>
              </div>

              {/* Chamfered "Copy email" button */}
              <button
                type="button"
                onClick={copyEmail}
                className="btn-secondary self-start sm:self-auto shrink-0 text-xs py-1 px-2.5"
                aria-label="Copy email address"
              >
                <span className="btn-secondary-inner mono text-xs py-1 px-2.5 flex items-center gap-1.5">
                  {copied ? (
                    <>
                      <FaCheck size={11} className="text-[var(--accent)]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <FaCopy size={11} className="text-[var(--muted)]" />
                      <span>Copy</span>
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Resume, GitHub, LinkedIn */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/Mourya_Resume.pdf"
                download="Mourya_Birru_Resume.pdf"
                className="btn-secondary"
              >
                <span className="btn-secondary-inner">
                  <FaDownload size={13} />
                  <span>Resume</span>
                </span>
              </a>

              <a
                href="https://github.com/mourya05"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <span className="btn-secondary-inner">
                  <FaGithub size={14} />
                  <span>GitHub</span>
                </span>
              </a>

              <a
                href="https://linkedin.com/in/mourya-birru"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <span className="btn-secondary-inner">
                  <FaLinkedin size={14} />
                  <span>LinkedIn</span>
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Chamfered Contact Form */}
          <div className="chamfer-card w-full">
            <div className="chamfer-card-inner p-6 sm:p-8">
              <h3 className="mono text-xs uppercase tracking-widest text-[var(--accent)] mb-6 font-semibold">
                Send a Message
              </h3>

              {status === "success" ? (
                <div className="p-6 border border-[rgba(167,139,250,0.3)] bg-[rgba(167,139,250,0.08)] rounded flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <FaCheck className="text-[var(--accent)]" />
                    <span>Message Delivered!</span>
                  </div>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">
                    Thank you for reaching out. The details have been sent to my inbox and I will get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="btn-secondary self-start mt-2"
                  >
                    <span className="btn-secondary-inner text-xs">
                      Send another message
                    </span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="mono text-xs text-[var(--muted)] uppercase tracking-wider">
                        Your Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Mourya"
                        className="w-full bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2.5 text-sm text-white placeholder:text-[var(--muted)]/50 focus:border-[var(--accent)] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="mono text-xs text-[var(--muted)] uppercase tracking-wider">
                        Your Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2.5 text-sm text-white placeholder:text-[var(--muted)]/50 focus:border-[var(--accent)] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="mono text-xs text-[var(--muted)] uppercase tracking-wider">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Opportunity / Collaboration / Query"
                      className="w-full bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2.5 text-sm text-white placeholder:text-[var(--muted)]/50 focus:border-[var(--accent)] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="mono text-xs text-[var(--muted)] uppercase tracking-wider">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hi Mourya, I'd like to talk about..."
                      className="w-full bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2.5 text-sm text-white placeholder:text-[var(--muted)]/50 focus:border-[var(--accent)] focus:outline-none transition-colors resize-y min-h-[110px]"
                    />
                  </div>

                  {status === "error" && (
                    <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-200 text-xs">
                      {errorMessage}{" "}
                      <a
                        href={`mailto:mourya.birru@gmail.com?subject=${encodeURIComponent(formData.subject || "Portfolio Contact")}&body=${encodeURIComponent(formData.message)}`}
                        className="underline text-white font-medium ml-1"
                      >
                        Click here to send via email client
                      </a>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="btn-primary"
                    >
                      <FaPaperPlane size={12} />
                      <span>{status === "submitting" ? "Sending..." : "Send Message"}</span>
                    </button>
                    <span className="mono text-[11px] text-[var(--muted)]">
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
