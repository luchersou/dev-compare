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
const FPS = 30
const SPEED = 9 // cells per second, both streams flow inward
// Densest to lightest.
const RAMP = ["@", "%", "#", "*", "+", "=", "-", ":"]
const LENS_RADIUS = 120
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
    let visible = true
    let raf = 0
    let last = 0
    let acc = 0
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
      for (const lane of state) {
        for (const side of [lane.left, lane.right]) {
          // Arrivals per second follow the weight; each one lights the gate.
          const beat = Math.floor(time * (0.4 + side.w * 2.2))
          if (beat !== side.beat) {
            side.beat = beat
            side.flash = 0.25
          }
          side.flash = Math.max(0, side.flash - dt)
        }
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height)
      ctx!.textBaseline = "top"
      ctx!.font = `13px ${monoFamily}`

      // Buckets by colour keep fillStyle changes to a handful per frame.
      const buckets = new Map<string, Array<[string, number, number]>>()
      const put = (color: string, ch: string, cx: number, cy: number) => {
        let list = buckets.get(color)
        if (!list) buckets.set(color, (list = []))
        list.push([ch, cx * CELL_W, cy * CELL_H])
      }
      const lens = (cx: number, cy: number) => {
        if (!pointer) return 0
        const dx = cx * CELL_W + CELL_W / 2 - pointer.x
        const dy = cy * CELL_H + CELL_H / 2 - pointer.y
        const d = Math.sqrt(dx * dx + dy * dy)
        return d < LENS_RADIUS ? 1 - d / LENS_RADIUS : 0
      }

      let hovered = null as Lane | null
      state.forEach((lane, li) => {
        const g = gate(lane.row)
        const y = lane.row
        if (pointer && Math.abs(pointer.y - (y * CELL_H + CELL_H / 2)) < CELL_H * 1.5) hovered = lane

        const stream = (side: Side, sideId: number, span: number, toX: (d: number) => number) => {
          const density = 0.1 + side.w * 0.72
          for (let d = 0; d < span; d++) {
            const x = toX(d)
            const q = d / Math.max(1, span - 1) // 0 at the edge, 1 at the gate
            const k = Math.floor(d - time * SPEED)
            const bank = q > 0.82 ? ((q - 0.82) / 0.18) * (0.25 + side.w * 0.6) : 0
            const dens = Math.min(0.97, density * (0.6 + 0.4 * q) + bank)
            const h = hash(li + 1, sideId, k)
            const boost = lens(x, y)
            if (h < dens + boost * 0.3) {
              const i = Math.min(1, (dens - h) * 1.6 + q * 0.35 * side.w + boost * 0.4)
              const ch = RAMP[Math.min(RAMP.length - 1, Math.floor((1 - i) * RAMP.length))]
              const color =
                i > 0.82 && (side.leads || boost > 0.2)
                  ? palette.lead
                  : palette.tones[Math.min(palette.tones.length - 1, Math.floor(i * palette.tones.length))]
              put(color, ch, x, y)
            } else if (d % 2 === 0) {
              put(boost > 0 ? palette.tones[0] : palette.rail, "·", x, y)
            }
          }
        }

        stream(lane.left, 1, g.left, (d) => d)
        stream(lane.right, 2, cols - 1 - g.right, (d) => cols - 1 - d)

        // The gate posts, lit as each arrival lands.
        put(lane.left.flash > 0 ? palette.accent : palette.gate, "┤", g.left, y)
        put(lane.right.flash > 0 ? palette.accent : palette.gate, "├", g.right, y)
      })

      for (const [color, list] of buckets) {
        ctx!.fillStyle = color
        for (const [ch, px, py] of list) ctx!.fillText(ch, px, py)
      }

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
      const dt = Math.min(0.1, (now - (last || now)) / 1000)
      last = now
      acc += dt
      if (acc >= 1 / FPS) {
        step(acc)
        draw()
        acc = 0
      }
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
      if (reduceMotion || pausedRef.current) draw()
    }
    const onLeave = () => {
      pointer = null
      if (reduceMotion || pausedRef.current) draw()
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
