import { useEffect } from 'react'

type Props = {
  open: boolean
  title: string
  body?: string
  primaryLabel: string
  secondaryLabel: string
  onPrimary: () => void
  onSecondary: () => void
  onDismiss: () => void
}

export function ConfirmModal({
  open,
  title,
  body,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  onDismiss,
}: Props) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onDismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onDismiss])

  if (!open) return null

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={onDismiss}
    >
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="modal-title">
          {title}
        </h2>
        {body && <p className="modal-body">{body}</p>}
        <div className="modal-actions">
          <button type="button" className="btn-primary" onClick={onPrimary}>
            {primaryLabel}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={onSecondary}
          >
            {secondaryLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
