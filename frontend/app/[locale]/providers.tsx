'use client'

import { ThemeProvider } from 'next-themes'
import { ToastProvider } from './_components/toast/ToastProvider'
import { useEffect } from 'react'
import { useUserStore } from '@/store/userStore'

function SuppressThreeJsDeprecations() {
  useEffect(() => {
    const _warn = console.warn
    console.warn = (...args) => {
      if (
        args.length > 0 &&
        typeof args[0] === 'string' &&
        args[0].includes('THREE.Clock:')
      )
        return
      _warn(...args)
    }
    return () => {
      console.warn = _warn
    }
  }, [])
  return null
}

function BootstrapSession() {
  useEffect(() => {
    useUserStore.getState().bootstrap()
  }, [])
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ToastProvider>
        <SuppressThreeJsDeprecations />
        <BootstrapSession />
        {children}
      </ToastProvider>
    </ThemeProvider>
  )
}
