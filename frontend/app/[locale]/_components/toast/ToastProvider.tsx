'use client'

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react'
import { ToastContainer } from './ToastContainer'

export type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'achievement'

export interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
  icon?: ReactNode
}

export interface ToastData extends Required<Pick<ToastOptions, 'variant' | 'duration'>> {
  id: string
  title: string
  description?: string
  icon?: ReactNode
  visible: boolean
}

interface ToastContextValue {
  toasts: ToastData[]
  addToast: (opts: ToastOptions) => string
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToastContext() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const MAX = 4
const EXIT_DURATION = 280

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)))
    const exitTimer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
      timers.current.delete(id)
    }, EXIT_DURATION)
    timers.current.set(`exit_${id}`, exitTimer)
  }, [])

  const addToast = useCallback(
    (opts: ToastOptions) => {
      const id = crypto.randomUUID()
      const duration = opts.duration ?? 3500
      const toast: ToastData = {
        id,
        title: opts.title,
        description: opts.description,
        icon: opts.icon,
        variant: opts.variant ?? 'default',
        duration,
        visible: false,
      }

      setToasts((prev) => {
        const next = [...prev, toast]
        // Enforce max — drop oldest entries immediately
        return next.length > MAX ? next.slice(next.length - MAX) : next
      })

      // Two rAF frames to ensure the DOM is painted before the enter transition fires
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: true } : t)))
        })
      })

      if (duration > 0) {
        const autoTimer = setTimeout(() => dismiss(id), duration)
        timers.current.set(id, autoTimer)
      }

      return id
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismiss }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}
