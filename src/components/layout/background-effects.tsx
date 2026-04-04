interface BackgroundEffectsProps {
  glow?: boolean
}

export function BackgroundEffects({ glow = false }: BackgroundEffectsProps) {
  return (
    <>
      <div className="bg-grid-overlay" />
      <div className="bg-noise-overlay" />
      {glow && <div className="bg-glow-overlay" />}
    </>
  )
}