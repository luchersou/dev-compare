import Link from "next/link"

import { Wordmark } from "@/components/shared/wordmark"

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__statement">
          Two packages, four public sources, one verdict.
        </p>

        <div className="footer__links">
          <Link href="/" className="wordmark" aria-label="DevCompare home">
            <Wordmark />
            <span>DevCompare</span>
          </Link>
          <a
            className="link"
            href="https://github.com/luchersou/dev-compare"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source on GitHub
          </a>
          <small>© {new Date().getFullYear()} DevCompare</small>
        </div>
      </div>
    </footer>
  )
}
