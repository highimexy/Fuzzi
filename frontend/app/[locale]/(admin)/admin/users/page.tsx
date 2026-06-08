'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { apiFetch } from '@/lib/apiFetch'
import { RiSearchLine, RiShieldLine, RiUserLine, RiDeleteBinLine } from 'react-icons/ri'

interface AdminUser {
  id: number
  email: string
  name: string
  role: string
  karma: number
  created_at: string
}

export default function AdminUsersPage() {
  const t = useTranslations('Admin')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (query) params.set('search', query)
    apiFetch(`/api/v1/admin/users?${params}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setUsers(d.users ?? [])
        setTotal(d.total ?? 0)
      })
      .catch(() => setError(t('error')))
      .finally(() => setLoading(false))
  }, [page, query, t])

  useEffect(() => {
    load()
  }, [load])

  const applySearch = () => {
    setPage(1)
    setQuery(search)
  }

  const changeRole = async (user: AdminUser) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    const res = await apiFetch(`/api/v1/admin/users/${user.id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      setError(d.error ?? t('users.lastAdminError'))
    } else {
      load()
    }
  }

  const deleteUser = async (user: AdminUser) => {
    if (!confirm(t('users.confirmDelete'))) return
    const res = await apiFetch(`/api/v1/admin/users/${user.id}`, { method: 'DELETE' })
    if (res.ok || res.status === 204) load()
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground/35">
            {total.toLocaleString()} {t('users.total')}
          </p>
          <h1 className="mt-1 font-serif text-2xl font-bold">{t('users.title')}</h1>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <RiSearchLine className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/30" />
          <input
            type="text"
            placeholder={t('users.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applySearch()}
            className="w-full border border-foreground/15 bg-transparent py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-foreground/40"
          />
        </div>
        <button
          onClick={applySearch}
          className="border border-foreground/15 px-4 py-2 text-sm uppercase tracking-wide transition-colors hover:border-foreground/30 hover:bg-foreground/5"
        >
          {t('users.searchBtn')}
        </button>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto rounded border border-foreground/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-foreground/10">
              {['ID', t('users.email'), t('users.name'), t('users.role'), t('users.karma'), t('users.createdAt'), ''].map(
                (h, i) => (
                  <th
                    key={i}
                    className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-foreground/35"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-foreground/35">
                  {t('loading')}
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-foreground/35">
                  {t('users.empty')}
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-foreground/5 transition-colors last:border-0 hover:bg-foreground/3"
              >
                <td className="px-4 py-3 font-mono text-xs text-foreground/40">{u.id}</td>
                <td className="px-4 py-3">
                  <span className="font-medium">{u.email}</span>
                </td>
                <td className="px-4 py-3 text-foreground/60">{u.name || '—'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium uppercase ${
                      u.role === 'admin'
                        ? 'bg-accent/15 text-accent'
                        : 'bg-foreground/5 text-foreground/50'
                    }`}
                  >
                    {u.role === 'admin' ? (
                      <RiShieldLine className="h-3 w-3" />
                    ) : (
                      <RiUserLine className="h-3 w-3" />
                    )}
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 tabular-nums text-foreground/60">{u.karma}</td>
                <td className="px-4 py-3 text-xs text-foreground/40">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => changeRole(u)}
                      title={u.role === 'admin' ? t('users.makeUser') : t('users.makeAdmin')}
                      className="rounded border border-foreground/15 px-2.5 py-1 text-xs uppercase transition-colors hover:border-foreground/30 hover:bg-foreground/5"
                    >
                      {u.role === 'admin' ? t('users.makeUser') : t('users.makeAdmin')}
                    </button>
                    <button
                      onClick={() => deleteUser(u)}
                      title={t('users.delete')}
                      className="rounded border border-error/30 p-1.5 text-error/60 transition-colors hover:bg-error/5 hover:text-error"
                    >
                      <RiDeleteBinLine className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-xs text-foreground/35">
            {t('pagination.page', { page })} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border border-foreground/15 px-3 py-1.5 text-xs uppercase transition-colors hover:border-foreground/30 disabled:opacity-30"
            >
              {t('pagination.prev')}
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border border-foreground/15 px-3 py-1.5 text-xs uppercase transition-colors hover:border-foreground/30 disabled:opacity-30"
            >
              {t('pagination.next')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
