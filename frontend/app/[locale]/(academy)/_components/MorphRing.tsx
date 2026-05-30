/**
 * MorphRing — customowy spinner isLoading
 * Kolorystyka: Deadling Design System
 *
 * Użycie:
 *   <MorphRing />                  — domyślny (md)
 *   <MorphRing size="sm" />        — mały (24px)
 *   <MorphRing size="lg" />        — duży (56px)
 *   <MorphRing size="xl" />        — XL (72px)
 *   <MorphRing variant="accent" /> — żółty akcent
 *   <MorphRing label="Ładuję..." />— z etykietą pod spodem
 *   <MorphRing overlay />          — fullscreen overlay
 */

'use client'

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'
type SpinnerVariant = 'default' | 'accent' | 'muted'

interface MorphRingProps {
  size?: SpinnerSize
  variant?: SpinnerVariant
  label?: string
  overlay?: boolean
  className?: string
}

const sizeMap: Record<SpinnerSize, { width: number; inset: number; labelSize: string; marginTop: string }> = {
  sm: { width: 24,  inset: 4, labelSize: '11px', marginTop: '6px' },
  md: { width: 40,  inset: 5, labelSize: '13px', marginTop: '8px' },
  lg: { width: 56,  inset: 7, labelSize: '13px', marginTop: '10px' },
  xl: { width: 72,  inset: 9, labelSize: '15px', marginTop: '12px' },
}

const variantMap: Record<SpinnerVariant, { from: string; via: string }> = {
  default: { from: '#89937e', via: '#576966' },
  accent:  { from: '#b88a00', via: '#89937e' },
  muted:   { from: '#576966', via: 'transparent' },
}

export function MorphRing({
  size = 'md',
  variant = 'default',
  label,
  overlay = false,
  className = '',
}: MorphRingProps) {
  const { width, inset, labelSize, marginTop } = sizeMap[size]
  const { from, via } = variantMap[variant]

  const spinner = (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      className={className}
    >
      <div
        style={{
          position: 'relative',
          width,
          height: width,
          borderRadius: '50%',
          background: `conic-gradient(${from} 0%, ${via} 45%, transparent 65%)`,
          animation: 'morphRingSpin 1.1s cubic-bezier(0.6, 0.1, 0.4, 0.9) infinite',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset,
            borderRadius: '50%',
            background: 'var(--background)',
          }}
        />
      </div>

      {label && (
        <span
          style={{
            marginTop,
            fontSize: labelSize,
            color: 'var(--foreground)',
            opacity: 0.5,
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.03em',
          }}
        >
          {label}
        </span>
      )}

      <style>{`
        @keyframes morphRingSpin {
          0%   { transform: rotate(0deg)   scale(1);    border-radius: 50%; }
          25%  { transform: rotate(100deg) scale(1.07); border-radius: 38%; }
          50%  { transform: rotate(210deg) scale(0.95); border-radius: 50%; }
          75%  { transform: rotate(300deg) scale(1.05); border-radius: 40%; }
          100% { transform: rotate(360deg) scale(1);    border-radius: 50%; }
        }
      `}</style>
    </div>
  )

  if (overlay) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'color-mix(in srgb, var(--background) 70%, transparent)',
          backdropFilter: 'blur(4px)',
        }}
      >
        {spinner}
      </div>
    )
  }

  return spinner
}

export default MorphRing
