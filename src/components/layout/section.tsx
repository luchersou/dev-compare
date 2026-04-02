type SectionProps = {
  children: React.ReactNode
  className?: string
  divider?: boolean
  dots?: boolean
}

export function Section({ children, className, divider = true }: SectionProps) {
  return (
    <section
      className={`relative py-16 md:py-24 ${className ?? ""}
        ${divider ? `
          before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2
          before:h-px before:w-2/3 md:before:w-1/2
          before:bg-gradient-to-r before:from-transparent before:via-border/40 before:to-transparent
        ` : ""}
      `}
    >
      <div className="relative z-10">
        {children}
      </div>
    </section>
  )
}