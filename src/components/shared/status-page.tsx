import { Container } from "@/components/layout/container"

interface StatusPageProps {
  code: string
  title: string
  description: string
  children?: React.ReactNode
}

export function StatusPage({ code, title, description, children }: StatusPageProps) {
  return (
    <main id="main" className="status-page page-top">
      <Container className="status-page__inner">
        <p className="status-page__code mono" aria-hidden="true">{code}</p>
        <div className="status-page__text">
          <h1>{title}</h1>
          <p className="lead">{description}</p>
          {children && <div className="status-page__actions">{children}</div>}
        </div>
      </Container>
    </main>
  )
}
