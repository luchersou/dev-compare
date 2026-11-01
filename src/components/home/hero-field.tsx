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
  /** The hero's text block: no glyph is drawn under it. */
  calmRef: RefObject<HTMLElement | null>
}

// The Cobalt cell: every glyph sits on an 8 by 16 grid.
const CELL_W = 8
const CELL_H = 16
const FPS = 30
// Densest to lightest; a packet's head is dense and its tail thins out.
const RAMP = ["@", "%", "#", "*", "+", "=", "-", ":", "."]
const LENS_RADIUS = 120

interface Packet {
  x: number // cells travelled from the outer edge
  len: number
  speed: number // cells per second
}

interface Side {
  name: string
  downloads: number | null
  rate: number // packets per second
  len: number
  packets: Packet[]
  clock: number
  flash: number // seconds left on the gate flash
}

interface Lane {
  row: number
  left: Side
  right: Side
}

interface Palette {
  rail: string
  glyph: string[]
  accent: string
  label: string
  labelStrong: string
  gate: string
}

// Weekly downloads span five orders of magnitude, so the field follows the
// log, scaled to the busiest package on screen: the side that leads is denser.
function weight(downloads: number | null, max: number) {
  if (!downloads || downloads <= 0 || max <= 0) return 0
  const floor = 4 // 10k a week reads as a trickle
  return Math.min(1, Math.max(0, (Math.log10(downloads) - floor) / (Math.log10(max) - floor)))
}

function makeSide(name: string, downloads: number | null, max: number): Side {
  const w = weight(downloads, max) ** 2
  return {
    name,
    downloads,
    rate: 0.12 + w * 1.1,
    len: 2 + Math.round(w * 9),
    packets: [],
    clock: Math.random(),
    flash: 0,
  }
}

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement)
  const v = (name: string) => css.getPropertyValue(name).trim()
  return {
    rail: v("--color-glyph-1"),
    glyph: [v("--color-accent-deep"), v("--color-glyph-4"), v("--color-glyph-3"), v("--color-glyph-2")],
    accent: v("--color-accent"),
    label: v("--color-muted"),
    labelStrong: v("--color-ink"),
    gate: v("--color-glyph-2"),
  }
}

export function HeroField({ lanes, calmRef }: HeroFieldProps) {
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
    let rows = 0
    let calm = { top: 0, bottom: 0, left: 0, right: 0 }
    let state: Lane[] = []
    let pointer: { x: number; y: number } | null = null
    let visible = true
    let raf = 0
    let last = 0
    let acc = 0

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

      const text = calmRef.current?.getBoundingClientRect()
      if (text) {
        const pad = 3
        calm = {
          left: Math.floor((text.left - rect.left) / CELL_W) - pad * 2,
          right: Math.ceil((text.right - rect.left) / CELL_W) + pad * 2,
          top: Math.floor((text.top - rect.top) / CELL_H) - pad,
          bottom: Math.ceil((text.bottom - rect.top) / CELL_H) + pad,
        }
      }

      // Lanes spread over the hero, clear of the nav at the top.
      const firstRow = 7
      const lastRow = rows - 7
      const count = Math.min(lanes.length, Math.max(3, Math.floor((lastRow - firstRow) / 3)))
      const step = (lastRow - firstRow) / Math.max(1, count - 1)
      const previous = state
      state = lanes.slice(0, count).map((lane, i) => ({
        row: Math.round(firstRow + i * step),
        left: previous[i]?.left ?? makeSide(lane.a, lane.aDownloads, busiest),
        right: previous[i]?.right ?? makeSide(lane.b, lane.bDownloads, busiest),
      }))
    }

    // Where a lane's two streams stop: either side of the text, or the centre.
    function gate(row: number) {
      const crossesText = row >= calm.top && row <= calm.bottom
      if (crossesText) return { left: calm.left, right: calm.right }
      const mid = Math.floor(cols / 2)
      return { left: mid - 2, right: mid + 2 }
    }

    function step(dt: number) {
      for (const lane of state) {
        const g = gate(lane.row)
        const reach = { left: g.left, right: cols - g.right }
        for (const [side, span] of [[lane.left, reach.left], [lane.right, reach.right]] as const) {
          side.clock += dt * side.rate
          while (side.clock >= 1) {
            side.clock -= 1
            side.packets.push({ x: -side.len, len: side.len, speed: 7 + Math.random() * 5 })
          }
          for (const p of side.packets) p.x += p.speed * dt
          const arrived = side.packets.filter((p) => p.x >= span)
          if (arrived.length) side.flash = 0.35
          side.packets = side.packets.filter((p) => p.x < span)
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
      const inLens = (cx: number, cy: number) => {
        if (!pointer) return false
        const dx = cx * CELL_W + CELL_W / 2 - pointer.x
        const dy = cy * CELL_H + CELL_H / 2 - pointer.y
        return dx * dx + dy * dy < LENS_RADIUS * LENS_RADIUS
      }

      let hovered: Lane | null = null
      for (const lane of state) {
        const g = gate(lane.row)
        const y = lane.row
        if (pointer && Math.abs(pointer.y - (y * CELL_H + CELL_H / 2)) < CELL_H * 1.5) hovered = lane

        // The rails: one hairline of dots per side, from the edge to the gate.
        for (let x = 0; x < g.left; x += 2) put(inLens(x, y) ? palette.gate : palette.rail, "·", x, y)
        for (let x = g.right + 1; x < cols; x += 2) put(inLens(x, y) ? palette.gate : palette.rail, "·", x, y)

        // The gate posts, lit for a moment when a packet arrives.
        put(lane.left.flash > 0 ? palette.accent : palette.gate, "┤", g.left, y)
        put(lane.right.flash > 0 ? palette.accent : palette.gate, "├", g.right, y)

        // Packets: dense heads leading inward, tails thinning toward the edge.
        const paint = (side: Side, toX: (d: number) => number, limit: (x: number) => boolean) => {
          for (const p of side.packets) {
            for (let k = 0; k < p.len; k++) {
              const d = Math.floor(p.x) - k
              if (d < 0) continue
              const x = toX(d)
              if (!limit(x)) continue
              const t = k / p.len
              const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(t * RAMP.length))]
              const tone = inLens(x, y) ? 0 : Math.min(palette.glyph.length - 1, Math.floor(t * palette.glyph.length))
              put(palette.glyph[tone], ch, x, y)
            }
          }
        }
        paint(lane.left, (d) => d, (x) => x < g.left)
        paint(lane.right, (d) => cols - 1 - d, (x) => x > g.right)
      }

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

    // One composed still: run the field for a while, then draw once.
    function still() {
      for (let i = 0; i < 6 * FPS; i++) step(1 / FPS)
      draw()
    }

    layout()
    still()
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
  }, [lanes, calmRef])

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
