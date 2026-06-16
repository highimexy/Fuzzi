'use client'

import { MarkdownRenderer } from '../../_components/MarkdownRenderer'
import type { Section } from './useLessonContent'

/* ════════════════════════════════════════════════════════════════════════
   NotebookPage — jedna (prawa) strona notesu jako żywy DOM w <Html>.
   Nagłówek (back + eyebrow + tytuł) + scrollowalna sekcja markdown.
   Padding-left zaczyna się za czerwonym marginesem tekstury (§3.1).
   ════════════════════════════════════════════════════════════════════════ */

const INK = '#20262f'
const INK_MUTED = 'rgba(32,38,47,0.55)'
const LINES_BG = 'repeating-linear-gradient(transparent 0 27px, rgba(32,38,47,0.07) 27px 28px)'

// Typografia + scrollbar dostrojone do kremowego papieru notesu.
const NP_STYLE = `
  .fz-np-prose { font-size: 13px; line-height: 1.62; }
  .fz-np-prose h1 { font-size: 19px; font-weight: 700; text-transform: uppercase; margin: 0 0 10px; letter-spacing: 0.01em; }
  .fz-np-prose h2 { font-size: 15px; font-weight: 700; margin: 16px 0 7px; }
  .fz-np-prose h3 { font-size: 13.5px; font-weight: 700; margin: 12px 0 5px; }
  .fz-np-prose p { margin: 0 0 9px; }
  .fz-np-prose ul, .fz-np-prose ol { margin: 0 0 9px; padding-left: 18px; }
  .fz-np-prose li { margin: 2px 0; }
  .fz-np-prose a { color: #3a5f3a; text-decoration: underline; }
  .fz-np-prose strong { font-weight: 700; }
  .fz-np-prose blockquote { border-left: 3px solid rgba(32,38,47,0.28); margin: 9px 0; padding-left: 11px; font-style: italic; opacity: 0.85; }
  .fz-np-prose table { font-size: 12px; border-collapse: collapse; margin: 9px 0; }
  .fz-np-prose th, .fz-np-prose td { border: 1px solid rgba(32,38,47,0.2); padding: 4px 8px; }
  .fz-np-scroll::-webkit-scrollbar { width: 6px; }
  .fz-np-scroll::-webkit-scrollbar-thumb { background: rgba(32,38,47,0.25); border-radius: 3px; }
  .fz-np-scroll::-webkit-scrollbar-track { background: transparent; }
`

const eyebrowStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans, sans-serif)',
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: INK_MUTED,
}

const backBtnStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans, sans-serif)',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.13em',
  textTransform: 'uppercase',
  padding: '5px 9px',
  border: '1px solid rgba(32,38,47,0.28)',
  background: 'rgba(32,38,47,0.04)',
  color: INK,
  cursor: 'pointer',
}

const startBtnStyle: React.CSSProperties = {
  alignSelf: 'flex-start',
  marginTop: 12,
  background: INK,
  color: '#f7f6f1',
  border: 'none',
  fontFamily: 'var(--font-sans, sans-serif)',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  padding: '10px 18px',
  cursor: 'pointer',
}

interface Props {
  locale: string
  trackLabel: string
  lessonTitle: string
  section: Section | null
  sectionIdx: number
  sectionTotal: number
  loading: boolean
  onBack: () => void
  onStart: () => void
}

export default function NotebookPage({
  locale,
  trackLabel,
  lessonTitle,
  section,
  sectionIdx,
  sectionTotal,
  loading,
  onBack,
  onStart,
}: Props) {
  const sectionWord = locale === 'pl' ? 'SEKCJA' : 'SECTION'
  return (
    <div
      style={{
        width: 340,
        height: 430,
        padding: '20px 18px 18px 30px',
        boxSizing: 'border-box',
        color: INK,
        fontFamily: 'var(--font-serif, Georgia, serif)',
        display: 'flex',
        flexDirection: 'column',
        background: LINES_BG,
      }}
    >
      <style>{NP_STYLE}</style>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
          marginBottom: 8,
        }}
      >
        <button onClick={onBack} style={backBtnStyle}>
          {locale === 'pl' ? '‹ spis' : '‹ index'}
        </button>
        <span style={eyebrowStyle}>
          {trackLabel} · {sectionWord} {sectionIdx + 1}/{Math.max(sectionTotal, 1)}
        </span>
      </div>

      {lessonTitle && (
        <div
          style={{
            fontWeight: 700,
            fontSize: 20,
            lineHeight: 1.1,
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          {lessonTitle}
        </div>
      )}

      <div
        className="fz-np-scroll fz-np-prose"
        style={{ overflowY: 'auto', flex: 1, paddingRight: 6, userSelect: 'text' }}
      >
        {loading ? (
          <div style={{ opacity: 0.4, fontSize: 13 }}>
            {locale === 'pl' ? 'Wczytywanie…' : 'Loading…'}
          </div>
        ) : section ? (
          <MarkdownRenderer>{section.body}</MarkdownRenderer>
        ) : (
          <div style={{ opacity: 0.4, fontSize: 13 }}>
            {locale === 'pl' ? 'Brak treści.' : 'No content.'}
          </div>
        )}
      </div>

      <button onClick={onStart} style={startBtnStyle}>
        {locale === 'pl' ? 'tryb zadań →' : 'task mode →'}
      </button>
    </div>
  )
}
