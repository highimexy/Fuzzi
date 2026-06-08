'use client'

import { useCallback } from 'react'
import { useToastContext, type ToastOptions } from './ToastProvider'

export function useToast() {
  const { addToast, dismiss } = useToastContext()
  const toast = useCallback((opts: ToastOptions) => addToast(opts), [addToast])
  return { toast, dismiss }
}
