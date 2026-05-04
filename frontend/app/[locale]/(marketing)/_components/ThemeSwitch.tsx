'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { FiSun, FiMoon } from 'react-icons/fi'

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-6 w-6 opacity-0" />
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex cursor-pointer items-center justify-center transition-opacity hover:opacity-70 focus:outline-none"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <FiSun className="text-foreground text-lg" />
      ) : (
        <FiMoon className="text-foreground text-lg" />
      )}
    </button>
  )
}
