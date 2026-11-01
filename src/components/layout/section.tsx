import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const sectionVariants = cva("", {
  variants: {
    gap: {
      default: "section",
      small: "section section--s",
      large: "section section--l",
    },
  },
  defaultVariants: { gap: "default" },
})

type SectionProps = {
  children: React.ReactNode
  className?: string
  id?: string
  labelledBy?: string
} & VariantProps<typeof sectionVariants>

export function Section({ children, className, gap, id, labelledBy }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(sectionVariants({ gap }), className)}>
      {children}
    </section>
  )
}
