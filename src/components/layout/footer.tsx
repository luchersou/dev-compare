import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 px-10 py-5 flex items-center justify-between flex-wrap gap-4">
      <span className="text-sm font-semibold text-muted-foreground">
        DevCompare
      </span>

      <nav className="flex items-center gap-6">
        <Link href="/packages" className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors">
          Packages
        </Link>
        <div className="w-px h-3 bg-border" />
        <Link href="/compare" className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors">
          Compare
        </Link>
        <div className="w-px h-3 bg-border" />
        <a
          href="https://github.com/luchersou/npm-comparator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors"
        >
          GitHub
        </a>
      </nav>

      <span className="text-xs text-muted-foreground/40">
        © {new Date().getFullYear()} DevCompare
      </span>
    </footer>
  )
}