'use client'

const palette = {
  armor: '#7a8a6e',
  armorDark: '#5a6654',
  armorLight: '#9aaa8e',
  visor: '#f5e642',
  visorGlow: '#ffe100',
  outline: '#3a4235',
  accent: '#b8ff4e',
}

// Każda noga: 2 segmenty z lekką krzywizną (Q = quadratic bezier)
// root → (ctrl1) → knee → (ctrl2) → tip
// Segment 1: grubszy, Segment 2: węższy i zakrzywiony do przodu
const LEGS = [
  // ── LEWA STRONA ──
  //       root         ctrl1       knee        ctrl2       tip           i  delay
  { r: [24, 44], c1: [6, 32], k: [-4, 38], c2: [-16, 42], t: [-20, 58], i: 0 },
  { r: [22, 57], c1: [2, 50], k: [-8, 54], c2: [-20, 58], t: [-22, 74], i: 1 },
  { r: [22, 68], c1: [0, 70], k: [-6, 78], c2: [-14, 84], t: [-8, 100], i: 2 },
  { r: [26, 78], c1: [6, 84], k: [4, 92], c2: [2, 100], t: [6, 112], i: 3 },
  // ── PRAWA STRONA (lustrzane) ──
  { r: [76, 44], c1: [94, 32], k: [104, 38], c2: [116, 42], t: [120, 58], i: 0 },
  { r: [78, 57], c1: [98, 50], k: [108, 54], c2: [120, 58], t: [122, 74], i: 1 },
  { r: [78, 68], c1: [100, 70], k: [106, 78], c2: [114, 84], t: [108, 100], i: 2 },
  { r: [74, 78], c1: [94, 84], k: [96, 92], c2: [98, 100], t: [94, 112], i: 3 },
]

export function FuzziMark({ size = 40, className = '' }) {
  return (
    <>
      <style>{`
        @keyframes fuzzi-leg {
          0%   { transform: rotate(0deg);  }
          50%  { transform: rotate(3.5deg); }
          100% { transform: rotate(-2deg); }
        }
        @keyframes fuzzi-led {
          0%, 100% { opacity: 1;    }
          45%, 55% { opacity: 0.08; }
        }
        @keyframes fuzzi-visor-pulse {
          0%, 100% { opacity: 1;    }
          50%       { opacity: 0.78; }
        }
      `}</style>

      <svg
        viewBox="-26 0 152 118"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ overflow: 'visible', display: 'block' }}
        aria-label="Fuzzi"
      >
        <defs>
          <radialGradient id="fm-visor" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#fffaaa" />
            <stop offset="100%" stopColor={palette.visor} />
          </radialGradient>
          <radialGradient id="fm-armor" cx="36%" cy="26%" r="72%">
            <stop offset="0%" stopColor={palette.armorLight} />
            <stop offset="100%" stopColor={palette.armorDark} />
          </radialGradient>
          <filter id="fm-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="fm-led" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ══ 8 NÓG Z KRZYWIZNĄ ══ */}
        {LEGS.map((leg, idx) => {
          const origin = `${leg.r[0]}px ${leg.r[1]}px`
          const dir = leg.i % 2 === 0 ? 'normal' : 'reverse'
          const delay = `${leg.i * 0.2}s`
          const style = {
            transformOrigin: origin,
            animation: `fuzzi-leg 1.9s ease-in-out ${delay} infinite ${dir}`,
          }

          // Ścieżki segmentów jako bezier
          const seg1 = `M ${leg.r[0]} ${leg.r[1]} Q ${leg.c1[0]} ${leg.c1[1]} ${leg.k[0]} ${leg.k[1]}`
          const seg2 = `M ${leg.k[0]} ${leg.k[1]} Q ${leg.c2[0]} ${leg.c2[1]} ${leg.t[0]} ${leg.t[1]}`

          return (
            <g key={idx} style={style}>
              {/* ── Segment 1: tułów → kolano (grubszy) ── */}
              <path
                d={seg1}
                stroke={palette.outline}
                strokeWidth="5.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d={seg1}
                stroke={palette.armorDark}
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
              />

              {/* ── Segment 2: kolano → szpon (węższy, jaśniejszy) ── */}
              <path
                d={seg2}
                stroke={palette.outline}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d={seg2}
                stroke={palette.armor}
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />

              {/* Staw kolanowy — okrągły bolec z obramowaniem */}
              <circle
                cx={leg.k[0]}
                cy={leg.k[1]}
                r="4.2"
                fill={palette.armorDark}
                stroke={palette.outline}
                strokeWidth="2"
              />
              {/* Mały punkt centralny stawu */}
              <circle cx={leg.k[0]} cy={leg.k[1]} r="1.4" fill={palette.armorLight} opacity="0.7" />

              {/* Szpon — cienki, spiczasty trójkąt */}
              {(() => {
                const [tx, ty] = leg.t as [number, number]
                const [kx, ky] = leg.k as [number, number]
                // kierunek ostatniego segmentu
                const dx = tx - kx,
                  dy = ty - ky
                const len = Math.sqrt(dx * dx + dy * dy)
                const nx = -dy / len,
                  ny = dx / len // prostopadły
                return (
                  <path
                    d={`M ${tx + nx * 3.5} ${ty + ny * 3.5} L ${tx + (dx / len) * 7} ${ty + (dy / len) * 7} L ${tx - nx * 3.5} ${ty - ny * 3.5} Z`}
                    fill={palette.outline}
                  />
                )
              })()}
            </g>
          )
        })}

        {/* ══ SZCZĘKI / CHELICERY — wyrastają z boków ust ══ */}
        {/* Lewa chelicera: wyrasta z lewej krawędzi portu (~42,75),
            wygina się na zewnątrz i w dół, kończy ostrym hakiem */}
        <path
          d="M 44 76
             C 38 76, 30 78, 26 86
             C 22 94, 26 103, 30 106
             C 28 99, 30 93, 34 90
             C 38 96, 36 104, 34 108
             C 40 102, 42 93, 40 86
             C 44 84, 46 80, 44 76 Z"
          fill={palette.armor}
          stroke={palette.outline}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Prawa chelicera: lustrzana */}
        <path
          d="M 56 76
             C 62 76, 70 78, 74 86
             C 78 94, 74 103, 70 106
             C 72 99, 70 93, 66 90
             C 62 96, 64 104, 66 108
             C 60 102, 58 93, 60 86
             C 56 84, 54 80, 56 76 Z"
          fill={palette.armor}
          stroke={palette.outline}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* ══ GŁÓWNY PANCERZ ══ */}
        <path
          d="M 28 12 Q 50 5 72 12 L 90 28 L 97 50 L 90 72 L 76 82 L 50 86 L 24 82 L 10 72 L 3 50 L 10 28 Z"
          fill="url(#fm-armor)"
          stroke={palette.outline}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Górna płyta czołowa */}
        <path
          d="M 30 12 Q 50 21 70 12"
          fill="none"
          stroke={palette.armorDark}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Boczne płyty policzkowe */}
        <path
          d="M 10 72 L 22 70 L 28 80"
          fill="none"
          stroke={palette.armorDark}
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M 90 72 L 78 70 L 72 80"
          fill="none"
          stroke={palette.armorDark}
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Port serwisowy */}
        <path
          d="M 42 82 L 42 75 L 58 75 L 58 82"
          fill="none"
          stroke={palette.armorDark}
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* ══ WIZJERY GŁÓWNE ══ */}
        {/* Blask zewnętrzny */}
        <circle
          cx="34"
          cy="52"
          r="15"
          fill={palette.visorGlow}
          opacity="0.2"
          filter="url(#fm-glow)"
        />
        <circle
          cx="66"
          cy="52"
          r="15"
          fill={palette.visorGlow}
          opacity="0.2"
          filter="url(#fm-glow)"
        />
        {/* Wizjery */}
        <circle
          cx="34"
          cy="52"
          r="11.5"
          fill="url(#fm-visor)"
          stroke={palette.outline}
          strokeWidth="3"
          style={{ animation: 'fuzzi-visor-pulse 3.2s ease-in-out infinite' }}
        />
        <circle
          cx="66"
          cy="52"
          r="11.5"
          fill="url(#fm-visor)"
          stroke={palette.outline}
          strokeWidth="3"
          style={{ animation: 'fuzzi-visor-pulse 3.2s ease-in-out 0.5s infinite' }}
        />
        {/* Odbicia światła */}
        <circle cx="30" cy="47.5" r="3.2" fill="white" opacity="0.52" />
        <circle cx="62" cy="47.5" r="3.2" fill="white" opacity="0.52" />

        {/* ══ SENSORY GÓRNE (4 szt.) ══ */}
        <circle
          cx="23"
          cy="36"
          r="3.5"
          fill={palette.visor}
          stroke={palette.outline}
          strokeWidth="2.2"
          filter="url(#fm-glow)"
        />
        <circle
          cx="38"
          cy="31"
          r="4.5"
          fill={palette.visor}
          stroke={palette.outline}
          strokeWidth="2.2"
          filter="url(#fm-glow)"
        />
        <circle
          cx="62"
          cy="31"
          r="4.5"
          fill={palette.visor}
          stroke={palette.outline}
          strokeWidth="2.2"
          filter="url(#fm-glow)"
        />
        <circle
          cx="77"
          cy="36"
          r="3.5"
          fill={palette.visor}
          stroke={palette.outline}
          strokeWidth="2.2"
          filter="url(#fm-glow)"
        />

        {/* ══ LED DIAGNOSTYCZNY ══ */}
        <circle
          cx="17"
          cy="50"
          r="2.2"
          fill={palette.accent}
          filter="url(#fm-led)"
          style={{ animation: 'fuzzi-led 2.4s ease-in-out infinite' }}
        />
      </svg>
    </>
  )
}
