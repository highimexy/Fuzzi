'use client'

import { ThemeProvider } from 'next-themes'
import { ToastProvider } from './_components/toast/ToastProvider'
import { useEffect } from 'react'
import { useUserStore } from '@/store/userStore'

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
        <BootstrapSession />
        {children}
      </ToastProvider>
    </ThemeProvider>
  )
}
