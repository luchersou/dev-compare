import { Container } from "@/components/layout/container"

interface StatusPageProps {
  code: string
  title: string
  description: string
  children?: React.ReactNode
}

export function StatusPage({ code, title, description, children }: StatusPageProps) {
  return (
    <main className="relative flex flex-1 items-center py-24 md:py-32">
      <Container className="flex flex-col items-center gap-4 text-center">
        <span className="font-mono text-sm text-muted-foreground">{code}</span>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        <p className="max-w-md text-muted-foreground">{description}</p>
        {children && <div className="mt-4 flex items-center gap-3">{children}</div>}
      </Container>
    </main>
  )
}
