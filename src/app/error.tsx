"use client"

import Link from "next/link"
import { useEffect } from "react"

import { StatusPage } from "@/components/shared/status-page"
import { Button } from "@/components/ui/button"

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <StatusPage
      code="500"
      title="Something went wrong"
      description="One of the data sources failed to respond. This is usually temporary — try again in a moment."
    >
      <Button onClick={() => unstable_retry()}>Try again</Button>
      <Button variant="outline" asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </StatusPage>
  )
}
