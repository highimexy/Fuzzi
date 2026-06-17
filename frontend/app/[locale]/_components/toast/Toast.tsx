'use client'

import { FiX } from 'react-icons/fi'
import type { ToastData } from './ToastProvider'

const VARIANTS: Record<
  ToastData['variant'],
  { color: string; label: string }
> = {
  default:     { color: 'var(--secondary)', label: '' },
  success:     { color: 'var(--correct)',   label: '✓ Success' },
  warning:     { color: 'var(--accent)',    label: '⚠ Warning' },
  error:       { color: 'var(--wrong)',     label: '✗ Error' },
  achievement: { color: 'var(--accent)',    label: '🏆 Achievement' },
}

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface ToastProps {
  toast: ToastData
  onDismiss: (id: string) => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const { color, label } = VARIANTS[toast.variant]

  const hiddenStyle = reduced
    ? { opacity: 0 }
    : { opacity: 0, transform: 'translateX(calc(100% + 1.25rem))' }

  const visibleStyle = reduced
    ? { opacity: 1 }
    : { opacity: 1, transform: 'translateX(0)' }

  return (
    <div
      role="alert"
      aria-live="polite"
      className="toast-item relative px-4 py-3.5"
      style={{
        background: 'var(--background)',
        border: `1px solid ${color}`,
        minWidth: 240,
        maxWidth: 340,
        transition: 'transform 0.25s ease, opacity 0.25s ease',
        ...(toast.visible ? visibleStyle : hiddenStyle),
      }}
    >
      {/* Variant label */}
      {(label || toast.icon) && (
        <div
          className="mb-1 font-sans font-bold uppercase"
          style={{ color, fontSize: '9px', letterSpacing: '0.2em' }}
        >
          {toast.icon && <span className="mr-1">{toast.icon}</span>}
          {label}
        </div>
      )}

      <p className="font-serif text-base leading-snug">{toast.title}</p>

      {toast.description && (
        <p className="mt-1 font-sans text-xs opacity-60">{toast.description}</p>
      )}

      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Zamknij"
        className="absolute right-2.5 top-2.5 cursor-pointer opacity-40 transition-opacity hover:opacity-80"
        style={{ color: 'var(--foreground)' }}
      >
        <FiX style={{ fontSize: 13 }} />
      </button>
    </div>
  )
}
