'use client'

interface BackgroundGridProps {
  color?: string
}

export function BackgroundGrid({ color }: BackgroundGridProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden">
      <style>{`
        :root {
          --academy-grid-color: rgba(161, 161, 170, 0.25);
        }

        .dark {
          --academy-grid-color: rgba(255, 255, 255, 0.07);
        }

        @keyframes grid-breathe {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
      `}</style>
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${color || 'var(--academy-grid-color)'} 1px, transparent 1px),
            linear-gradient(to bottom, ${color || 'var(--academy-grid-color)'} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          animation: 'grid-breathe 4s ease-in-out infinite',
          transformOrigin: 'center center',
        }}
      />
    </div>
  )
}
