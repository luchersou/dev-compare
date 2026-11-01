"use client"

import { Check, Copy } from "lucide-react"
import { useEffect, useState } from "react"

// A command chip with a working copy key.
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="command cut-s">
      <code>{command}</code>
      <button type="button" onClick={copy} aria-label={`Copy "${command}"`}>
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  )
}
