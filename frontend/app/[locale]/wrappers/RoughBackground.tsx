import { type CSSProperties, type ReactNode } from 'react'

type RoughBackgroundProps = {
  color?: string
  grain?: number
  frequency?: number
  padding?: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

const NOISE_SVG = (opacity = 0.18, freq = 0.68) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${opacity} 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`

/**
 * RoughBackground
 *
 * Props:
 *   color       – kolor tła (domyślnie '#1e1f22')
 *   grain       – intensywność ziarna 0–1 (domyślnie 0.18)
 *   frequency   – częstotliwość szumu fraktalnego (domyślnie 0.68)
 *   radius      – border-radius (domyślnie '12px')
 *   padding     – padding (domyślnie '2rem 2.5rem')
 *   border      – kolor obramowania (domyślnie '#3a3b3e'), false = brak
 *   className   – dodatkowe klasy
 *   style       – dodatkowe style
 *   children    – zawartość
 */
export default function RoughBackground({
  color = '#1a202c',
  grain = 0.18,
  frequency = 0.68,
  padding = '2rem 2.5rem',
  className = '',
  style = {},
  children,
}: RoughBackgroundProps) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding,
        background: color,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* warstwa ziarna */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: NOISE_SVG(grain, frequency),
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px',
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          opacity: 1,
        }}
      />
      {/* zawartość ponad ziarem */}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}
