import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="w-full"
      style={{ borderTop: "1px solid var(--border)", marginTop: "96px" }}
    >
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8"
        style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "32px 24px" }}
      >
        <p className="mono text-xs" style={{ color: "var(--muted)" }}>
          © 2024 Mourya Birru. Final-year CS student at GCET, Hyderabad.
        </p>

        <div className="flex items-center gap-6">
          <Link
            href="https://github.com/Mourya05"
            target="_blank"
            rel="noopener noreferrer"
            className="hover-accent flex items-center gap-2 text-sm transition-colors"
            style={{ color: "var(--muted)", textDecoration: "none" }}
            aria-label="GitHub profile"
          >
            <FaGithub size={16} />
            <span className="mono text-xs">GitHub</span>
          </Link>
          <Link
            href="https://www.linkedin.com/in/mourya-birru-8336342a7/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover-accent flex items-center gap-2 text-sm transition-colors"
            style={{ color: "var(--muted)", textDecoration: "none" }}
            aria-label="LinkedIn profile"
          >
            <FaLinkedin size={16} />
            <span className="mono text-xs">LinkedIn</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
