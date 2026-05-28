type Props = {
  active: boolean
  onReveal: () => void
}

export function HiddenOverlay({ active, onReveal }: Props) {
  if (!active) return null
  return (
    <button
      type="button"
      className="hidden-overlay"
      onClick={onReveal}
      aria-label="Reveal screen"
    >
      <span className="hidden-overlay-hint">Tap to reveal</span>
    </button>
  )
}
