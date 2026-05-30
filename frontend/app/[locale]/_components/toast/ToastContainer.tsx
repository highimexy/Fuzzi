'use client'

import { useContext } from 'react'
import { ToastContext } from './ToastProvider'
import { Toast } from './Toast'

export function ToastContainer() {
  const ctx = useContext(ToastContext)
  if (!ctx || ctx.toasts.length === 0) return null

  return (
    <>
      <style>{`
        .toast-stack {
          position: fixed;
          right: 1.25rem;
          bottom: 1.25rem;
          z-index: 99;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          align-items: flex-end;
        }
        @media (max-width: 639px) {
          .toast-stack {
            left: 0.75rem;
            right: 0.75rem;
            align-items: stretch;
          }
          .toast-item {
            min-width: unset !important;
            max-width: unset !important;
          }
        }
      `}</style>
      <div className="toast-stack" aria-label="Powiadomienia" aria-live="polite">
        {ctx.toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={ctx.dismiss} />
        ))}
      </div>
    </>
  )
}
