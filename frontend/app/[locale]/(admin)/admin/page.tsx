'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { apiFetch } from '@/lib/apiFetch'
import {
  RiUserLine,
  RiUserAddLine,
  RiChat1Line,
  RiFlashlightLine,
  RiCheckboxCircleLine,
  RiSwordLine,
} from 'react-icons/ri'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Stats {
  user_count: number
  new_users_7d: number
  post_count: number
  total_xp: number
  attempt_count: number
}

interface DayCount {
  day: string
  count: number
}

interface DayAttempt {
  day: string
  count: number
  xp: number
}

interface TrackCount {
  track: string
  count: number
}

interface Charts {
  users_by_day: DayCount[]
  attempts_by_day: DayAttempt[]
  correct_count: number
  top_tracks: TrackCount[]
}

// ── Chart helpers ─────────────────────────────────────────────────────────────

function fillDays<T extends { day: string }>(
  data: T[],
  days: number,
  zero: Omit<T, 'day'>,
): T[] {
  const map = new Map(data.map((d) => [d.day, d]))
  const result: T[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    result.push(map.get(key) ?? ({ day: key, ...zero } as T))
  }
  return result
}

// ── Chart Summary ─────────────────────────────────────────────────────────────

function ChartSummary({
  total,
  peak,
  totalLabel,
  peakLabel,
}: {
  total: number
  peak: number
  totalLabel: string
  peakLabel: string
}) {
  return (
    <div className="mb-3 flex gap-6">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-foreground/35">{totalLabel}</p>
        <p className="font-serif text-xl font-bold tabular-nums">{total.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-foreground/35">{peakLabel}</p>
        <p className="font-serif text-xl font-bold tabular-nums">{peak.toLocaleString()}</p>
      </div>
    </div>
  )
}

// ── SVG Area Chart ────────────────────────────────────────────────────────────

function AreaChart({
  data,
  gradId,
  color = 'var(--accent)',
}: {
  data: number[]
  gradId: string
  color?: string
}) {
  const W = 300
  const H = 64
  const PX = 32  // left padding for Y-axis labels
  const PY = 4
  if (data.length < 2) return <div className="h-20 w-full" />
  const max = Math.max(...data, 1)
  const mid = Math.round(max / 2)

  const toPoint = (v: number, i: number) => ({
    x: PX + (i / (data.length - 1)) * (W - PX),
    y: PY + (1 - v / max) * (H - 2 * PY),
  })

  const pts = data.map((v, i) => toPoint(v, i))
  const first = pts[0]!
  const last = pts[pts.length - 1]!
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L${last.x.toFixed(1)},${H} L${first.x.toFixed(1)},${H} Z`

  const gridY = (v: number) => (PY + (1 - v / max) * (H - 2 * PY)).toFixed(1)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-20 w-full">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[max, mid, 0].map((v) => (
        <line
          key={v}
          x1={PX} y1={gridY(v)} x2={W} y2={gridY(v)}
          stroke="currentColor" strokeOpacity="0.06" strokeWidth="1"
        />
      ))}

      {/* Y-axis labels */}
      <text x={PX - 4} y={gridY(max)} textAnchor="end" dominantBaseline="middle"
        fill="currentColor" fillOpacity="0.35" fontSize="7">{max}</text>
      <text x={PX - 4} y={gridY(mid)} textAnchor="end" dominantBaseline="middle"
        fill="currentColor" fillOpacity="0.25" fontSize="7">{mid}</text>
      <text x={PX - 4} y={gridY(0)} textAnchor="end" dominantBaseline="middle"
        fill="currentColor" fillOpacity="0.25" fontSize="7">0</text>

      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Horizontal Bar Chart ──────────────────────────────────────────────────────

function HBarChart({ data }: { data: TrackCount[] }) {
  const max = Math.max(...data.map((d) => d.count), 1)
  return (
    <div className="space-y-3">
      {data.map(({ track, count }) => (
        <div key={track} className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-right font-mono text-xs uppercase text-foreground/50">
            {track}
          </span>
          <div className="flex-1 overflow-hidden rounded-full bg-foreground/8">
            <div
              className="h-2 rounded-full bg-accent transition-all duration-500"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
          <span className="w-8 text-right text-xs tabular-nums text-foreground/50">{count}</span>
        </div>
      ))}
    </div>
  )
}

// ── Ring Progress ─────────────────────────────────────────────────────────────

function RingProgress({ value }: { value: number }) {
  const r = 38
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(value, 100) / 100) * circ

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" className="mx-auto -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="10" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="transition-all duration-700"
      />
    </svg>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  sub?: string
}) {
  return (
    <div className="flex flex-col gap-3 rounded border border-foreground/10 bg-background p-5 transition-colors hover:border-foreground/20">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/40">
          {label}
        </span>
        <Icon className="h-4 w-4 text-foreground/25" />
      </div>
      <div>
        <p className="font-serif text-3xl font-bold tabular-nums">{value}</p>
        {sub && <p className="mt-1 text-xs text-foreground/40">{sub}</p>}
      </div>
    </div>
  )
}

// ── Chart Card wrapper ────────────────────────────────────────────────────────

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border border-foreground/10 p-5">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-foreground/40">
        {title}
      </p>
      {children}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const t = useTranslations('Admin')
  const [stats, setStats] = useState<Stats | null>(null)
  const [charts, setCharts] = useState<Charts | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    Promise.all([
      apiFetch('/api/v1/admin/stats').then((r) => (r.ok ? r.json() : Promise.reject())),
      apiFetch('/api/v1/admin/charts').then((r) => (r.ok ? r.json() : Promise.reject())),
    ])
      .then(([s, c]) => {
        setStats(s)
        setCharts(c)
      })
      .catch(() => setError(true))
  }, [])

  const usersByDay = charts ? fillDays(charts.users_by_day, 30, { count: 0 } as Omit<DayCount, 'day'>) : []
  const attemptsByDay = charts
    ? fillDays(charts.attempts_by_day, 30, { count: 0, xp: 0 } as Omit<DayAttempt, 'day'>)
    : []

  const correctRate =
    stats && charts && stats.attempt_count > 0
      ? Math.round((charts.correct_count / stats.attempt_count) * 100)
      : 0

  const xpByDay = attemptsByDay.map((d) => d.xp)
  const today = new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground/35">
          {today}
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold">{t('stats.title')}</h1>
      </div>

      {error && (
        <p className="text-sm text-error">{t('error')}</p>
      )}

      {!stats && !error && (
        <div className="flex items-center gap-2 text-sm text-foreground/40">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-accent" />
          {t('loading')}
        </div>
      )}

      {/* Stat cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          <StatCard
            label={t('stats.users')}
            value={stats.user_count.toLocaleString()}
            icon={RiUserLine}
          />
          <StatCard
            label={t('stats.newUsers')}
            value={`+${stats.new_users_7d}`}
            icon={RiUserAddLine}
            sub={t('stats.last7d')}
          />
          <StatCard
            label={t('stats.posts')}
            value={stats.post_count.toLocaleString()}
            icon={RiChat1Line}
          />
          <StatCard
            label={t('stats.attempts')}
            value={stats.attempt_count.toLocaleString()}
            icon={RiSwordLine}
          />
          <StatCard
            label={t('stats.successRate')}
            value={`${correctRate}%`}
            icon={RiCheckboxCircleLine}
          />
          <StatCard
            label={t('stats.totalXp')}
            value={stats.total_xp >= 1000 ? `${(stats.total_xp / 1000).toFixed(1)}k` : stats.total_xp}
            icon={RiFlashlightLine}
          />
        </div>
      )}

      {/* Charts row 1 */}
      {charts && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartCard title={t('charts.registrations')}>
              <ChartSummary
                total={usersByDay.reduce((s, d) => s + d.count, 0)}
                peak={Math.max(...usersByDay.map((d) => d.count), 0)}
                totalLabel={t('charts.totalNew')}
                peakLabel={t('charts.peak')}
              />
              <AreaChart
                data={usersByDay.map((d) => d.count)}
                gradId="grad-users"
              />
              <div className="mt-1 flex justify-between text-[10px] text-foreground/30">
                <span>{usersByDay[0]?.day.slice(5)}</span>
                <span>{usersByDay[usersByDay.length - 1]?.day.slice(5)}</span>
              </div>
            </ChartCard>
          </div>

          <ChartCard title={t('charts.successRate')}>
            <RingProgress value={correctRate} />
            <div className="mt-3 text-center">
              <p className="text-2xl font-bold tabular-nums">{correctRate}%</p>
              <p className="text-xs text-foreground/40">
                {charts.correct_count.toLocaleString()} / {stats?.attempt_count.toLocaleString()}
              </p>
            </div>
          </ChartCard>
        </div>
      )}

      {/* Charts row 2 */}
      {charts && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartCard title={t('charts.xpEarned')}>
              <ChartSummary
                total={xpByDay.reduce((s, v) => s + v, 0)}
                peak={Math.max(...xpByDay, 0)}
                totalLabel={t('charts.totalXpPeriod')}
                peakLabel={t('charts.peak')}
              />
              <AreaChart
                data={xpByDay}
                gradId="grad-xp"
                color="var(--primary)"
              />
              <div className="mt-1 flex justify-between text-[10px] text-foreground/30">
                <span>{attemptsByDay[0]?.day.slice(5)}</span>
                <span>{attemptsByDay[attemptsByDay.length - 1]?.day.slice(5)}</span>
              </div>
            </ChartCard>
          </div>

          <ChartCard title={t('charts.topTracks')}>
            {charts.top_tracks.length === 0 ? (
              <p className="text-sm text-foreground/35">{t('charts.noData')}</p>
            ) : (
              <HBarChart data={charts.top_tracks} />
            )}
          </ChartCard>
        </div>
      )}
    </div>
  )
}
