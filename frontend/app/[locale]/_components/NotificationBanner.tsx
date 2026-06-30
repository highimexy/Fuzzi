'use client'

import { useState, type ReactNode } from 'react'
import { Link } from 'next-view-transitions'
import { FiX } from 'react-icons/fi'

type Variant = 'info' | 'success' | 'warning' | 'accent'

const VARIANTS: Record<Variant, { bg: string; text: string }> = {
  info:    { bg: 'var(--secondary)', text: 'var(--background)' },
  success: { bg: 'var(--primary)',   text: 'var(--background)' },
  warning: { bg: 'var(--error)',     text: '#ffffff' },
  accent:  { bg: 'var(--accent)',    text: 'var(--background)' },
}

interface NotificationBannerProps {
  variant?: Variant
  message?: string
  children?: ReactNode
  dismissible?: boolean
  icon?: ReactNode
  cta?: { label: string; href: string }
  sticky?: boolean
  className?: string
}

export function NotificationBanner({
  variant = 'info',
  message,
  children,
  dismissible = true,
  icon,
  cta,
  sticky = false,
  className = '',
}: NotificationBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const { bg, text } = VARIANTS[variant]

  return (
    <div
      role="banner"
      style={{
        background: bg,
        color: text,
        ...(sticky ? { position: 'sticky', top: 0, zIndex: 60 } : {}),
      }}
      className={`flex items-center justify-center px-6 py-2.5 ${className}`}
    >
      <div className="flex flex-1 items-center justify-center gap-2">
        {icon && <span className="shrink-0">{icon}</span>}
        <span
          className="font-sans font-bold uppercase"
          style={{ fontSize: '11px', letterSpacing: '0.15em' }}
        >
          {message ?? children}
        </span>
        {cta && (
          <Link
            href={cta.href}
            style={{
              color: text,
              fontSize: '11px',
              letterSpacing: '0.15em',
              borderBottom: `1px solid currentColor`,
              opacity: 0.85,
            }}
            className="ml-1 font-bold uppercase transition-opacity hover:opacity-100"
          >
            {cta.label}
          </Link>
        )}
      </div>

      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          aria-label="Zamknij powiadomienie"
          style={{ color: text }}
          className="ml-4 shrink-0 cursor-pointer opacity-70 transition-opacity hover:opacity-100"
        >
          <FiX className="text-base" />
        </button>
      )}
    </div>
  )
}
