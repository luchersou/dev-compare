"use client"

import Link from "next/link"
import { useEffect } from "react"

import { StatusPage } from "@/components/shared/status-page"

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
      description="One of the data sources failed to respond. This is usually temporary, so try again in a moment."
    >
      <button type="button" className="key key--primary" onClick={() => unstable_retry()}>
        Try again
      </button>
      <Link href="/" className="key">
        Back to home
      </Link>
    </StatusPage>
  )
}
