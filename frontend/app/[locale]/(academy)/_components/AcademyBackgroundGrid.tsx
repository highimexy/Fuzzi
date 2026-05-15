'use client'

interface BackgroundGridProps {
  color?: string
}

export function AcademyBackgroundGrid({ color }: BackgroundGridProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden">
      <style>{`
        :root {
          --grid-line-color: rgba(24, 24, 27, 0.08);
        }
        .dark {
          --grid-line-color: rgba(255, 255, 255, 0.07);
        }

        @keyframes grid-breathe {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
      `}</style>
      <div
        className="absolute inset-0 h-full w-full opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${color || 'var(--grid-line-color)'} 1px, transparent 1px),
            linear-gradient(to bottom, ${color || 'var(--grid-line-color)'} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)',
          animation: 'grid-breathe 4s ease-in-out infinite',
          transformOrigin: 'center center',
        }}
      />
    </div>
  )
}
