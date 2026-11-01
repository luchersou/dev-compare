"use client"

import { Pause, Play, SkipForward } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { formatDownloads } from "@/lib/utils"

export interface ArenaPair {
  a: string
  b: string
  aDownloads: number | null
  bDownloads: number | null
}

interface HeroArenaProps {
  pairs: ArenaPair[]
  onPairChange?: (index: number) => void
}

// The Cobalt cell: every glyph sits on an 8 by 16 grid.
const CELL_W = 8
const CELL_H = 16
const SPEED = 3.2 // cells per second, both streams flow toward the middle
const CYCLE = 7 // seconds per pair
const RAMP = ["@", "%", "#", "*", "+", "=", "-", ":"]
const LENS_RADIUS = 150
const WARP_PUSH = 20

interface Palette {
  rail: string
  tones: string[]
  word: string
  glow: string
}

function hash(a: number, b: number, c: number) {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement)
  const v = (name: string) => css.getPropertyValue(name).trim()
  return {
    rail: v("--color-glyph-1"),
    tones: [v("--color-glyph-2"), v("--color-glyph-3"), v("--color-glyph-4")],
    word: v("--color-accent-deep"),
    glow: v("--color-accent"),
  }
}

function weight(downloads: number | null, max: number) {
  if (!downloads || downloads <= 0 || max <= 0) return 0
  return Math.min(1, Math.max(0, (Math.log10(downloads) - 4) / (Math.log10(max) - 4)))
}

export function winnerOf(pair: ArenaPair): "a" | "b" | "tie" {
  const a = pair.aDownloads ?? 0
  const b = pair.bDownloads ?? 0
  return a > b ? "a" : b > a ? "b" : "tie"
}

export function HeroArena({ pairs, onPairChange }: HeroArenaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)
  const hoverRef = useRef(false)
  const skipRef = useRef(false)
  const onPairRef = useRef(onPairChange)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    onPairRef.current = onPairChange
  }, [onPairChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || pairs.length === 0) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const rootStyle = getComputedStyle(document.documentElement)
    const monoFamily = rootStyle.getPropertyValue("--font-jetbrains").trim() || "ui-monospace, monospace"
    const displayFamily = rootStyle.getPropertyValue("--font-familjen").trim() || "system-ui, sans-serif"

    let palette = readPalette()
    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let mask = new Float32Array(0)
    let maskFor = -1
    let pair = 0
    let pairTime = reduceMotion ? 3 : 1.6 // start with the word already forming
    let time = 10
    let pointer: { x: number; y: number } | null = null
    let lensAt: { x: number; y: number } | null = null
    let warp = 0
    let visible = true
    let raf = 0
    let last = 0

    // The leading package's name, rasterised once per pair onto the cell grid.
    function buildMask() {
      const p = pairs[pair]
      const win = winnerOf(p)
      const word = win === "a" ? p.a : win === "b" ? p.b : "tie"
      const off = document.createElement("canvas")
      off.width = cols
      off.height = rows
      const o = off.getContext("2d")!
      // Draw in screen pixels, scaled down so one canvas pixel is one cell.
      o.setTransform(1 / CELL_W, 0, 0, 1 / CELL_H, 0, 0)
      let size = height * 0.78
      o.font = `600 ${size}px ${displayFamily}`
      const w = o.measureText(word).width
      if (w > width * 0.92) size *= (width * 0.92) / w
      o.font = `600 ${size}px ${displayFamily}`
      o.textAlign = "center"
      o.textBaseline = "middle"
      o.fillStyle = palette.word
      o.fillText(word, width / 2, height / 2)
      const data = o.getImageData(0, 0, cols, rows).data
      mask = new Float32Array(cols * rows)
      for (let i = 0; i < cols * rows; i++) mask[i] = data[i * 4 + 3] / 255
      maskFor = pair
    }

    function layout() {
      const rect = canvas!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.floor(width / CELL_W)
      rows = Math.floor(height / CELL_H)
      buildMask()
    }

    function advance(to: number) {
      pair = (to + pairs.length) % pairs.length
      pairTime = 0
      buildMask()
      setIndex(pair)
      onPairRef.current?.(pair)
    }

    function step(dt: number) {
      time += dt
      warp += ((pointer ? 1 : 0) - warp) * Math.min(1, dt * 6)
      if (pointer) {
        const t = Math.min(1, dt * 10)
        lensAt = lensAt
          ? { x: lensAt.x + (pointer.x - lensAt.x) * t, y: lensAt.y + (pointer.y - lensAt.y) * t }
          : { ...pointer }
      }
      // The cycle holds while the visitor hovers the arena or pauses it.
      if (!hoverRef.current && !pausedRef.current) pairTime += dt
      if (skipRef.current) {
        skipRef.current = false
        advance(pair + 1)
      } else if (pairTime >= CYCLE) {
        advance(pair + 1)
      }
    }

    function draw() {
      if (maskFor !== pair) buildMask()
      ctx!.clearRect(0, 0, width, height)
      ctx!.textBaseline = "top"
      ctx!.font = `13px ${monoFamily}`

      const buckets = new Map<string, Array<[string, number, number]>>()
      const put = (color: string, ch: string, cx: number, cy: number, alpha: number) => {
        const a = Math.round(Math.min(1, alpha) * 10) / 10
        if (a <= 0) return
        const key = `${a}|${color}`
        let list = buckets.get(key)
        if (!list) buckets.set(key, (list = []))
        let px = cx * CELL_W
        let py = cy * CELL_H
        if (!reduceMotion && lensAt && warp > 0.01) {
          const dx = px + CELL_W / 2 - lensAt.x
          const dy = py + CELL_H / 2 - lensAt.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d > 0.5 && d < LENS_RADIUS) {
            const f = (1 - d / LENS_RADIUS) ** 2 * WARP_PUSH * warp
            px += (dx / d) * f
            py += (dy / d) * f * 0.8
          }
        }
        list.push([ch, px, py])
      }
      const lensGlow = (cx: number, cy: number) => {
        if (!lensAt || warp <= 0.01) return 0
        const dx = cx * CELL_W + CELL_W / 2 - lensAt.x
        const dy = cy * CELL_H + CELL_H / 2 - lensAt.y
        const d = Math.sqrt(dx * dx + dy * dy)
        return d < LENS_RADIUS ? (1 - d / LENS_RADIUS) * warp * 0.8 : 0
      }

      const p = pairs[pair]
      const busiest = Math.max(1, p.aDownloads ?? 0, p.bDownloads ?? 0)
      const sides = [
        { w: weight(p.aDownloads, busiest), id: 1, dir: 1 },
        { w: weight(p.bDownloads, busiest), id: 2, dir: -1 },
      ]
      // While the word holds, the streams step back so it reads.
      const hold = smooth(0.8, 2.2, pairTime) * (1 - smooth(CYCLE - 2, CYCLE - 0.6, pairTime))
      const half = cols / 2

      // Streams: every row carries both packages toward the middle, where
      // they meet and thin out. Density follows weekly downloads.
      for (let r = 1; r < rows - 1; r++) {
        for (const side of sides) {
          const density = 0.03 + side.w * 0.24
          const offset = time * SPEED * (0.8 + hash(r, side.id, 0) * 0.4)
          const base = Math.floor(offset)
          const frac = offset - base
          for (let j = -1; j <= half; j++) {
            const pos = j + frac
            if (pos < 0 || pos > half) continue
            const k = j - base
            const h = hash(r + 1, side.id, k)
            if (h >= density) continue
            const x = side.dir === 1 ? pos : cols - 1 - pos
            const meet = 1 - smooth(half - 8, half, pos) // collide and fade at the middle
            const fade = smooth(0, 3, pos) * meet
            const t = hash(side.id, r + 7, k)
            const i = Math.min(1, 0.2 + t * 0.5 + side.w * 0.3)
            const ch = RAMP[Math.min(RAMP.length - 1, Math.floor((1 - i) * RAMP.length))]
            const tone = palette.tones[Math.min(palette.tones.length - 1, Math.floor(i * palette.tones.length))]
            const inWord = mask[r * cols + Math.round(x)] ?? 0
            // While the name holds, the streams thin to a whisper around it.
            const alpha = fade * (1 - hold * (0.75 + inWord * 0.25))
            const glow = lensGlow(x, r)
            put(tone, ch, x, r, alpha * (1 - glow))
            put(palette.glow, ch, x, r, alpha * glow)
          }
        }
      }

      // The word: each cell condenses in after its own short delay, flying in
      // from the side of its package, then dissolves before the next pair.
      const win = winnerOf(p)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const m = mask[r * cols + c]
          if (m < 0.35) continue
          const delay = hash(c + 3, r + 5, pair) * 0.9
          const shown =
            smooth(0.6 + delay, 1.6 + delay, pairTime) *
            (1 - smooth(CYCLE - 2.2 + delay, CYCLE - 1.2 + delay, pairTime))
          if (shown <= 0) continue
          const from = win === "b" ? 1 : win === "a" ? -1 : c < cols / 2 ? -1 : 1
          const x = c + from * (1 - shown) * 10
          // Only the dense end of the ramp, so the letters read as solid.
          const ch = RAMP[Math.min(2, Math.floor(hash(c, r, pair + 11) * 3 * (1.2 - m)))]
          put(palette.word, ch, x, r, shown * m)
        }
      }

      for (const [key, list] of buckets) {
        const bar = key.indexOf("|")
        ctx!.globalAlpha = Number(key.slice(0, bar))
        ctx!.fillStyle = key.slice(bar + 1)
        for (const [ch, px, py] of list) ctx!.fillText(ch, px, py)
      }
      ctx!.globalAlpha = 1
    }

    function frame(now: number) {
      raf = 0
      if (!visible || document.hidden) {
        last = now
        schedule()
        return
      }
      const dt = Math.min(0.1, (now - (last || now)) / 1000)
      last = now
      step(dt)
      draw()
      schedule()
    }

    function schedule() {
      if (!raf && !reduceMotion) raf = requestAnimationFrame(frame)
    }

    layout()
    draw()
    canvas.dataset.ready = "true"
    schedule()

    const resize = new ResizeObserver(() => {
      layout()
      draw()
    })
    resize.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(canvas)
    const themeWatch = new MutationObserver(() => {
      palette = readPalette()
      draw()
    })
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      hoverRef.current = true
    }
    const onLeave = () => {
      pointer = null
      hoverRef.current = false
    }
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerleave", onLeave)

    // Under reduced motion there is no loop: the next key redraws by hand.
    const onSkip = () => {
      if (reduceMotion) {
        advance(pair + 1)
        pairTime = 3
        draw()
      }
    }
    canvas.addEventListener("arena:skip", onSkip)

    return () => {
      cancelAnimationFrame(raf)
      resize.disconnect()
      io.disconnect()
      themeWatch.disconnect()
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerleave", onLeave)
      canvas.removeEventListener("arena:skip", onSkip)
    }
  }, [pairs])

  const current = pairs[index] ?? pairs[0]
  if (!current) return null
  const win = winnerOf(current)

  return (
    <figure className="arena">
      <div className="arena__sides">
        <p className={win === "a" ? "arena__side arena__side--lead" : "arena__side"}>
          <span className="mono">{current.a}</span>
          <span className="num">{formatDownloads(current.aDownloads)}/wk</span>
        </p>
        <p className={win === "b" ? "arena__side arena__side--lead arena__side--b" : "arena__side arena__side--b"}>
          <span className="mono">{current.b}</span>
          <span className="num">{formatDownloads(current.bDownloads)}/wk</span>
        </p>
      </div>

      <canvas ref={canvasRef} className="arena__canvas" aria-hidden="true" />

      <figcaption className="arena__foot">
        <span>
          {win === "tie"
            ? "Level on weekly downloads"
            : `${win === "a" ? current.a : current.b} leads on weekly downloads`}
        </span>
        <span className="arena__controls">
          <button
            type="button"
            className="arena__btn"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
          >
            {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
            {paused ? "Play" : "Pause"}
          </button>
          <button
            type="button"
            className="arena__btn"
            onClick={() => {
              skipRef.current = true
              canvasRef.current?.dispatchEvent(new Event("arena:skip"))
            }}
          >
            <SkipForward aria-hidden="true" />
            Next pair
          </button>
        </span>
      </figcaption>
    </figure>
  )
}
