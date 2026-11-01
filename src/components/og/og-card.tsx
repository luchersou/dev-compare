import { OG_COLORS } from "@/config/brand-colors"

// Rendered by next/og (Satori): inline styles only, and every element with
// more than one child needs display: flex.

export const OG_SIZE = { width: 1200, height: 630 }

const colors = {
  background: OG_COLORS.background,
  foreground: OG_COLORS.foreground,
  muted: OG_COLORS.muted,
  accent: OG_COLORS.accent,
  border: OG_COLORS.rule,
}

interface OgCardProps {
  eyebrow: string
  title: string
  subtitle?: string
}

export function OgCard({ eyebrow, title, subtitle }: OgCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: colors.background,
        color: colors.foreground,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 32 }}>
        {/* Same arrows as app/icon.tsx; a text glyph would make next/og fetch a font at runtime. */}
        <svg width="44" height="44" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <line x1="2" y1="7" x2="20" y2="7" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
          <polyline points="15,3 20,7 15,11" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <line x1="20" y1="15" x2="2" y2="15" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
          <polyline points="7,11 2,15 7,19" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <span style={{ fontWeight: 700 }}>DevCompare</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <span style={{ fontSize: 28, color: colors.muted, textTransform: "uppercase", letterSpacing: 4 }}>
          {eyebrow}
        </span>
        <span
          style={{
            fontSize: title.length > 32 ? 64 : 88,
            fontWeight: 700,
            lineHeight: 1.05,
            fontFamily: "monospace",
          }}
        >
          {title}
        </span>
        {subtitle && (
          <span style={{ fontSize: 32, color: colors.muted, lineHeight: 1.4 }}>{subtitle}</span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          borderTop: `2px solid ${colors.border}`,
          paddingTop: 28,
          fontSize: 26,
          color: colors.muted,
        }}
      >
        Downloads / Bundle size / GitHub stats
      </div>
    </div>
  )
}
