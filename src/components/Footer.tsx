import { FaGithub, FaLinkedin } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t border-[var(--border)]"
      style={{
        background: "var(--bg)",
      }}
    >
      <div
        className="section-wrap flex flex-col sm:flex-row items-center justify-between gap-4 py-8"
      >
        <p className="mono text-xs text-[var(--muted)] text-center sm:text-left">
          © {currentYear} Mourya Birru. Final-year CS student at GCET, Hyderabad.
        </p>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/mourya05"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-white transition-colors mono"
            aria-label="GitHub profile"
          >
            <FaGithub size={14} />
            <span>GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/mourya-birru"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-white transition-colors mono"
            aria-label="LinkedIn profile"
          >
            <FaLinkedin size={14} />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
