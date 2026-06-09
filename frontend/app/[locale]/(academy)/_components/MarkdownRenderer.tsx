'use client'

// Używamy shiki (VS Code look) do kolorowania kodu — idealne dla platformy o tematyce QA/dev.
// Mermaid i recharts ładowane dynamicznie (client-only), by nie blokować SSR.

import { useState, useEffect, useId, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FiCopy, FiCheck } from 'react-icons/fi'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// ── Shiki singleton ───────────────────────────────────────────────

type Highlighter = Awaited<ReturnType<typeof import('shiki').createHighlighter>>
let _highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter(): Promise<Highlighter> {
  if (!_highlighterPromise) {
    _highlighterPromise = import('shiki').then(({ createHighlighter }) =>
      createHighlighter({
        themes: ['github-dark'],
        langs: [
          'typescript', 'javascript', 'tsx', 'jsx',
          'bash', 'sh', 'json', 'yaml', 'python',
          'html', 'css', 'sql', 'go', 'markdown', 'text',
        ],
      }),
    )
  }
  return _highlighterPromise
}

// ── CodeBlock ─────────────────────────────────────────────────────

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [html, setHtml] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getHighlighter()
      .then((hl) => {
        try {
          const result = hl.codeToHtml(code, {
            lang: lang || 'text',
            theme: 'github-dark',
          })
          setHtml(result)
        } catch {
          // Language not bundled — fall back to plain pre
          setHtml('')
        }
      })
      .catch(() => setHtml(''))
  }, [code, lang])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="group relative my-4 overflow-hidden border border-foreground/10 bg-[#0d1117]">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 flex items-center gap-1 border border-foreground/20 bg-foreground/5 px-2 py-1 font-sans text-[9px] tracking-widest uppercase text-foreground/40 opacity-0 transition-all duration-200 hover:border-foreground/40 hover:text-foreground/70 group-hover:opacity-100"
        title="Kopiuj"
      >
        {copied ? (
          <>
            <FiCheck className="text-emerald-400" />
            <span className="text-emerald-400">Skopiowano</span>
          </>
        ) : (
          <>
            <FiCopy />
            <span>Kopiuj</span>
          </>
        )}
      </button>

      {html ? (
        <div
          className="overflow-x-auto text-sm [&>pre]:p-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 font-mono text-sm text-foreground/70">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}

// ── MermaidDiagram ────────────────────────────────────────────────

function MermaidDiagram({ code }: { code: string }) {
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState(false)
  const rawId = useId()
  // mermaid IDs must start with a letter and contain no colons
  const diagramId = `mermaid-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`

  useEffect(() => {
    import('mermaid')
      .then(({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          darkMode: true,
          fontFamily: 'var(--font-sans, sans-serif)',
        })
        return mermaid.render(diagramId, code)
      })
      .then(({ svg: rendered }) => setSvg(rendered))
      .catch(() => setError(true))
  }, [code, diagramId])

  if (error) {
    return (
      <div className="my-4 border border-rose-500/20 bg-rose-500/5 p-4">
        <p className="mb-2 font-sans text-[9px] tracking-widest uppercase text-rose-400">
          Błąd diagramu Mermaid
        </p>
        <pre className="font-mono text-xs text-foreground/50">{code}</pre>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="my-4 h-40 animate-pulse border border-foreground/10 bg-foreground/5" />
    )
  }

  return (
    <div
      className="my-6 flex justify-center overflow-x-auto [&>svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

// ── LessonChart ───────────────────────────────────────────────────

interface SeriesSpec {
  key: string
  name: string
  color?: string
}

interface ChartSpec {
  type: 'bar' | 'line'
  title?: string
  xKey: string
  series: SeriesSpec[]
  data: Record<string, any>[]
  yLabel?: string
}

const CHART_COLORS = [
  'var(--color-primary)',
  'var(--color-secondary)',
  'var(--color-accent)',
  '#60a5fa',
  '#34d399',
]

function LessonChart({ spec }: { spec: ChartSpec }) {
  if (!spec?.data?.length || !spec?.series?.length) {
    return (
      <div className="my-4 border border-foreground/10 p-4 font-sans text-xs text-foreground/30">
        [Brak danych wykresu]
      </div>
    )
  }

  const tickStyle = { fill: 'currentColor', fontSize: 11, opacity: 0.5 }
  const gridStroke = 'currentColor'

  const series = spec.series.map((s, i) => ({
    ...s,
    color: s.color ?? CHART_COLORS[i % CHART_COLORS.length],
  }))

  return (
    <div className="my-6">
      {spec.title && (
        <p className="mb-4 font-sans text-[9px] tracking-[0.3em] uppercase text-foreground/40">
          {spec.title}
        </p>
      )}
      <ResponsiveContainer width="100%" height={260}>
        {spec.type === 'line' ? (
          <LineChart data={spec.data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} strokeOpacity={0.08} />
            <XAxis dataKey={spec.xKey} tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              label={
                spec.yLabel
                  ? {
                      value: spec.yLabel,
                      angle: -90,
                      position: 'insideLeft',
                      style: { fontSize: 10, opacity: 0.4 },
                    }
                  : undefined
              }
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-background)',
                border: '1px solid color-mix(in srgb, currentColor 15%, transparent)',
                fontSize: 11,
              }}
            />
            {series.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                dot={{ fill: s.color, r: 3 }}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={spec.data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} strokeOpacity={0.08} />
            <XAxis dataKey={spec.xKey} tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              label={
                spec.yLabel
                  ? {
                      value: spec.yLabel,
                      angle: -90,
                      position: 'insideLeft',
                      style: { fontSize: 10, opacity: 0.4 },
                    }
                  : undefined
              }
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-background)',
                border: '1px solid color-mix(in srgb, currentColor 15%, transparent)',
                fontSize: 11,
              }}
            />
            {series.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
            {series.map((s) => (
              <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[2, 2, 0, 0]} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

function parseChartSpec(raw: string): ChartSpec | null {
  try {
    return JSON.parse(raw) as ChartSpec
  } catch {
    return null
  }
}

// ── MarkdownRenderer ──────────────────────────────────────────────

interface Props {
  children: string
  className?: string
}

export function MarkdownRenderer({ children, className }: Props) {
  return (
    <div className={className}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Strip outer <pre> — CodeBlock renders its own wrapper
        pre({ children: preChildren }) {
          return <>{preChildren}</>
        },
        code({ className: cls, children: codeChildren }) {
          const match = /language-(\w+)/.exec(cls || '')
          const lang = match?.[1] ?? ''
          const code = String(codeChildren).replace(/\n$/, '')

          // Inline code (no language class, single line)
          if (!lang && !code.includes('\n')) {
            return (
              <code className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-[0.85em] text-primary/80">
                {codeChildren}
              </code>
            )
          }

          if (lang === 'mermaid') return <MermaidDiagram code={code} />

          if (lang === 'chart') {
            const spec = parseChartSpec(code)
            if (!spec) {
              return (
                <div className="my-4 border border-rose-500/20 bg-rose-500/5 p-4">
                  <p className="mb-1 font-sans text-[9px] tracking-widest uppercase text-rose-400">
                    Błąd parsowania wykresu
                  </p>
                  <pre className="font-mono text-xs text-foreground/50">{code}</pre>
                </div>
              )
            }
            return <LessonChart spec={spec} />
          }

          return <CodeBlock code={code} lang={lang} />
        },
      }}
    >
      {children}
    </ReactMarkdown>
    </div>
  )
}
