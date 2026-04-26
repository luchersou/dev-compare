export function Footer() {
  return (
    <footer className="border-t border-border/40 px-10 py-5 flex items-center justify-between flex-wrap gap-4">
      <span className="text-sm font-semibold text-muted-foreground">
        DevCompare
      </span>

      <span className="text-xs text-muted-foreground/40">
        © {new Date().getFullYear()} DevCompare
      </span>
    </footer>
  )
}