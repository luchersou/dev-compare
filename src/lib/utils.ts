import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateIconColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 65%, 45%)`
}

export function formatDownloads(n: number | null): string {
  if (n === null) return "—"
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

export function formatSize(bytes: number | null): string {
  if (bytes === null) return "—"
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)}kb`
  return `${bytes}b`
}

export function formatStars(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

function formatBytes(bytes: number | null): string {
  if (bytes === null) return "—"
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)}kb`
  return `${bytes}b`
}