"use client"

import { Pause, Play } from "lucide-react"
import { type RefObject, useEffect, useRef, useState } from "react"

import { formatDownloads } from "@/lib/utils"

export interface FieldLane {
  a: string
  b: string
  aDownloads: number | null
  bDownloads: number | null
}

interface HeroFieldProps {
  lanes: FieldLane[]
  /** Elements the field keeps clear of: the text block and the caption. */
  calmRefs: Array<RefObject<HTMLElement | null>>
}

// The Cobalt cell: every glyph sits on an 8 by 16 grid.
const CELL_W = 8
const CELL_H = 16
const SPEED = 2.4 // cells per second, both streams flow inward
// The hover distortion: glyphs within WARP_RADIUS are pushed away from the
// pointer by up to WARP_PUSH pixels, like a lens bulging the field.
const WARP_RADIUS = 160
const WARP_PUSH = 14
// Densest to lightest.
const RAMP = ["@", "%", "#", "*", "+", "=", "-", ":"]
const LENS_RADIUS = 120
const FLASH = 0.6 // seconds a gate post takes to fade back after an arrival
const NARROW = 960

interface Side {
  name: string
  downloads: number | null
  w: number // 0..1, from weekly downloads
  leads: boolean
  flash: number // seconds left on the gate flash
  beat: number // arrivals so far, drives the flash
}

interface Lane {
  row: number
  left: Side
  right: Side
}

interface Rows {
  top: number
  bottom: number
  left: number
  right: number
}

interface Palette {
  rail: string
  tones: string[] // light to dense
  lead: string
  accent: string
  label: string
  labelStrong: string
  gate: string
}

// Weekly downloads span five orders of magnitude, so the field follows the
// log, scaled to the busiest package on screen.
function weight(downloads: number | null, max: number) {
  if (!downloads || downloads <= 0 || max <= 0) return 0
  const floor = 4 // 10k a week reads as a trickle
  return Math.min(1, Math.max(0, (Math.log10(downloads) - floor) / (Math.log10(max) - floor)))
}

// A stable pseudo-random value per lane, side and moving cell.
function hash(a: number, b: number, c: number) {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement)
  const v = (name: string) => css.getPropertyValue(name).trim()
  return {
    rail: v("--color-glyph-1"),
    tones: [v("--color-glyph-2"), v("--color-glyph-3"), v("--color-glyph-4")],
    lead: v("--color-accent-deep"),
    accent: v("--color-accent"),
    label: v("--color-muted"),
    labelStrong: v("--color-ink"),
    gate: v("--color-glyph-3"),
  }
}

export function HeroField({ lanes, calmRefs }: HeroFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || lanes.length === 0) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const monoFamily =
      getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains").trim() ||
      "ui-monospace, monospace"
    const busiest = Math.max(1, ...lanes.flatMap((l) => [l.aDownloads ?? 0, l.bDownloads ?? 0]))

    let palette = readPalette()
    let width = 0
    let height = 0
    let cols = 0
    let text: Rows = { top: -1, bottom: -1, left: 0, right: 0 }
    let state: Lane[] = []
    let pointer: { x: number; y: number } | null = null
    // The lens trails the pointer and fades in and out, so the warp feels soft.
    let lensAt: { x: number; y: number } | null = null
    let warp = 0
    let visible = true
    let raf = 0
    let last = 0
    // Start mid-flow so the first paint already shows both sides arriving.
    let time = 12

    function measure(el: HTMLElement | null, rect: DOMRect, padX: number, padY: number): Rows | null {
      if (!el) return null
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return null
      return {
        left: Math.floor((r.left - rect.left) / CELL_W) - padX,
        right: Math.ceil((r.right - rect.left) / CELL_W) + padX,
        top: Math.floor((r.top - rect.top) / CELL_H) - padY,
        bottom: Math.ceil((r.bottom - rect.top) / CELL_H) + padY,
      }
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
      const rows = Math.floor(height / CELL_H)
      const narrow = width < NARROW

      const [textEl, ...others] = calmRefs.map((r) => r.current)
      text = measure(textEl, rect, 6, 2) ?? text
      const blocked = others
        .map((el) => measure(el, rect, 0, 1))
        .filter((r): r is Rows => r !== null)

      // A lane and its label (the row above) must stay clear of the caption
      // everywhere, and of the text too on a narrow screen.
      const clear = (row: number) => {
        const hits = (r: Rows) => row >= r.top && row - 1 <= r.bottom
        if (blocked.some(hits)) return false
        if (narrow && hits(text)) return false
        return true
      }

      const firstRow = 7
      const candidates: number[] = []
      for (let row = firstRow; row < rows - 2; row += 4) if (clear(row)) candidates.push(row)

      state = candidates.slice(0, lanes.length).map((row, i) => {
        const lane = lanes[i]
        const wa = weight(lane.aDownloads, busiest)
        const wb = weight(lane.bDownloads, busiest)
        return {
          row,
          left: { name: lane.a, downloads: lane.aDownloads, w: wa, leads: wa > wb, flash: 0, beat: 0 },
          right: { name: lane.b, downloads: lane.bDownloads, w: wb, leads: wb > wa, flash: 0, beat: 0 },
        }
      })
    }

    // Where a lane's two streams stop: either side of the text, or the centre.
    function gate(row: number) {
      if (row >= text.top && row <= text.bottom) return { left: text.left, right: text.right }
      const mid = Math.floor(cols / 2)
      return { left: mid - 3, right: mid + 3 }
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
      for (const lane of state) {
        for (const side of [lane.left, lane.right]) {
          // Arrivals per second follow the weight; each one lights the gate.
          const beat = Math.floor(time * (0.15 + side.w * 0.7))
          if (beat !== side.beat) {
            side.beat = beat
            side.flash = FLASH
          }
          side.flash = Math.max(0, side.flash - dt)
        }
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height)
      ctx!.textBaseline = "top"
      ctx!.font = `13px ${monoFamily}`

      // Buckets by colour and opacity keep canvas state changes to a handful
      // per frame. Opacity is quantised to tenths.
      const buckets = new Map<string, Array<[string, number, number]>>()
      const put = (color: string, ch: string, cx: number, cy: number, alpha = 1) => {
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
          if (d > 0.5 && d < WARP_RADIUS) {
            const f = (1 - d / WARP_RADIUS) ** 2 * WARP_PUSH * warp
            px += (dx / d) * f
            py += (dy / d) * f * 0.8
          }
        }
        list.push([ch, px, py])
      }
      const lens = (cx: number, cy: number) => {
        if (!lensAt || warp <= 0.01) return 0
        const dx = cx * CELL_W + CELL_W / 2 - lensAt.x
        const dy = cy * CELL_H + CELL_H / 2 - lensAt.y
        const d = Math.sqrt(dx * dx + dy * dy)
        return d < LENS_RADIUS ? (1 - d / LENS_RADIUS) * warp : 0
      }
      const smooth = (a: number, b: number, x: number) => {
        const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
        return t * t * (3 - 2 * t)
      }

      let hovered = null as Lane | null
      state.forEach((lane, li) => {
        const g = gate(lane.row)
        const y = lane.row
        if (pointer && Math.abs(pointer.y - (y * CELL_H + CELL_H / 2)) < CELL_H * 1.5) hovered = lane

        // Each glyph is a fixed cell of the stream (index k) sliding inward at
        // SPEED, so it keeps its character and tone from the edge to the gate;
        // only its position and opacity change, and both change smoothly.
        const stream = (side: Side, sideId: number, span: number, toX: (pos: number) => number) => {
          if (span < 2) return
          const density = 0.12 + side.w * 0.62
          const offset = time * SPEED
          const base = Math.floor(offset)
          const frac = offset - base
          const near = new Float32Array(span + 2) // how much a glyph covers each cell

          for (let j = -1; j <= span; j++) {
            const pos = j + frac // cells from the edge
            if (pos < 0 || pos > span - 1) continue
            const k = j - base
            const h = hash(li + 1, sideId, k)
            // Near the gate the stream banks up: a second, denser set fades in.
            const q = pos / (span - 1)
            const banked = h < density ? 1 : h < density + 0.3 * side.w ? smooth(0.7, 1, q) : 0
            if (banked <= 0) continue

            const fade = smooth(0, 3, pos) * (1 - smooth(span - 3, span - 1, pos))
            const alpha = banked * fade
            const cell = Math.floor(pos)
            near[cell] = Math.max(near[cell], alpha * (1 - (pos - cell)))
            near[cell + 1] = Math.max(near[cell + 1], alpha * (pos - cell))

            const t = hash(sideId, li + 7, k) // the glyph's own intensity
            const i = Math.min(1, 0.25 + t * 0.55 + side.w * 0.25)
            const ch = RAMP[Math.min(RAMP.length - 1, Math.floor((1 - i) * RAMP.length))]
            const tone = palette.tones[Math.min(palette.tones.length - 1, Math.floor(i * palette.tones.length))]
            const x = toX(pos)
            // The leading side turns cobalt as it reaches the gate; the lens
            // lights whatever it passes over. Both cross-fade.
            const glow = Math.max(side.leads ? smooth(0.72, 1, q) * i : 0, lens(x, y))
            put(tone, ch, x, y, alpha * (1 - glow))
            put(palette.lead, ch, x, y, alpha * glow)
          }

          // The rail: fixed dots that dim under a passing glyph.
          for (let d = 0; d < span; d += 2) {
            const a = 1 - Math.min(1, near[d] * 1.5)
            put(palette.rail, "·", toX(d), y, a)
          }
        }

        stream(lane.left, 1, g.left, (pos) => pos)
        stream(lane.right, 2, cols - 1 - g.right, (pos) => cols - 1 - pos)

        // The gate posts, lit as each arrival lands and fading back.
        for (const [side, x, ch] of [[lane.left, g.left, "┤"], [lane.right, g.right, "├"]] as const) {
          const lit = Math.min(1, side.flash / FLASH)
          put(palette.gate, ch, x, y, 1 - lit)
          put(palette.accent, ch, x, y, lit)
        }
      })

      for (const [key, list] of buckets) {
        const bar = key.indexOf("|")
        ctx!.globalAlpha = Number(key.slice(0, bar))
        ctx!.fillStyle = key.slice(bar + 1)
        for (const [ch, px, py] of list) ctx!.fillText(ch, px, py)
      }
      ctx!.globalAlpha = 1

      // Lane labels at the outer edges; the hovered lane shows its numbers.
      ctx!.font = `12px ${monoFamily}`
      for (const lane of state) {
        const py = lane.row * CELL_H - CELL_H + 2
        const isHot = lane === hovered
        ctx!.fillStyle = isHot ? palette.labelStrong : palette.label
        const left = isHot && lane.left.downloads != null
          ? `${lane.left.name}  ${formatDownloads(lane.left.downloads)}/wk`
          : lane.left.name
        const right = isHot && lane.right.downloads != null
          ? `${formatDownloads(lane.right.downloads)}/wk  ${lane.right.name}`
          : lane.right.name
        ctx!.textAlign = "left"
        ctx!.fillText(left, CELL_W * 2, py)
        ctx!.textAlign = "right"
        ctx!.fillText(right, width - CELL_W * 2, py)
      }
      ctx!.textAlign = "left"
    }

    function frame(now: number) {
      raf = 0
      if (!visible || pausedRef.current || document.hidden) {
        last = now
        schedule()
        return
      }
      // Every animation frame: requestAnimationFrame already follows the
      // display, and skipping frames is what makes slow motion stutter.
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

    // Re-read the palette when the theme class on <html> changes.
    const themeWatch = new MutationObserver(() => {
      palette = readPalette()
      draw()
    })
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    const hero = canvas.parentElement
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      if (reduceMotion || pausedRef.current) {
        // No loop is running: jump the lens straight to the pointer.
        lensAt = { ...pointer }
        warp = 1
        draw()
      }
    }
    const onLeave = () => {
      pointer = null
      if (reduceMotion || pausedRef.current) {
        warp = 0
        draw()
      }
    }
    hero?.addEventListener("pointermove", onMove)
    hero?.addEventListener("pointerleave", onLeave)

    return () => {
      cancelAnimationFrame(raf)
      resize.disconnect()
      io.disconnect()
      themeWatch.disconnect()
      hero?.removeEventListener("pointermove", onMove)
      hero?.removeEventListener("pointerleave", onLeave)
    }
  }, [lanes, calmRefs])

  return (
    <>
      <canvas ref={canvasRef} className="field" aria-hidden="true" />
      <button
        type="button"
        className="field__toggle"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
      >
        {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        {paused ? "Play field" : "Pause field"}
      </button>
    </>
  )
}
