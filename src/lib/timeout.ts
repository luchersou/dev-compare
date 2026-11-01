// Bundlephobia builds unseen packages on demand and can take a long time.
export const OPTIONAL_SOURCE_TIMEOUT = 8000

// Resolves with `fallback` if `promise` takes longer than `ms`. Used for
// optional data sources so a slow third-party API can't stall the page.
// The request itself keeps running (an AbortSignal would opt the fetch out
// of Next.js request memoization).
export function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T, label?: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined

  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      if (label) console.warn(`[timeout] ${label} took longer than ${ms}ms`)
      resolve(fallback)
    }, ms)
  })

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}
