'use client'

import { useToastContext, type ToastOptions } from './ToastProvider'

export function useToast() {
  const { addToast, dismiss } = useToastContext()
  return {
    toast: (opts: ToastOptions) => addToast(opts),
    dismiss,
  }
}
