'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FiMail, FiShield, FiBell, FiMessageSquare } from 'react-icons/fi'
import { useTranslations } from 'next-intl'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'
import { MyDiscussPosts } from './_components/MyDiscussPosts'
import { useUserStore } from '@/store/userStore'
import { fetchMyProfile, updateMyProfile, deleteMyAccount } from '@/lib/profileApi'
import { useToast } from '@/app/[locale]/_components/toast/useToast'

export default function SettingsPage() {
  const t = useTranslations('Settings')
  const token = useUserStore((s) => s.token)
  const logout = useUserStore((s) => s.logout)
  const router = useRouter()
  const { toast } = useToast()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [savingName, setSavingName] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)

  const isMounted = useRef(true)
  useEffect(() => {
    isMounted.current = true
    return () => { isMounted.current = false }
  }, [])

  useEffect(() => {
    if (!token) return
    setLoadingProfile(true)
    fetchMyProfile(token)
      .then((p) => {
        if (!isMounted.current) return
        setDisplayName(p.user.name ?? '')
        setEmail(p.user.email ?? '')
      })
      .catch(() => {})
      .finally(() => { if (isMounted.current) setLoadingProfile(false) })
  }, [token])

  async function handleUpdateIdentity() {
    if (!token) return
    setSavingName(true)
    try {
      await updateMyProfile(token, { name: displayName })
      useUserStore.setState((s) => ({
        user: s.user ? { ...s.user, name: displayName } : s.user,
      }))
      toast({ title: t('identity.updateButton'), variant: 'success' })
    } catch (e: unknown) {
      toast({ title: t('identity.updateButton'), description: e instanceof Error ? e.message : undefined, variant: 'error' })
    } finally {
      setSavingName(false)
    }
  }

  async function handleDeleteAccount() {
    if (!token || deleteConfirm !== 'DELETE') return
    setDeleting(true)
    try {
      await deleteMyAccount(token)
      logout()
      router.push('/')
    } catch {
      toast({ title: t('dangerZone.button'), variant: 'error' })
      setDeleting(false)
    }
  }

  return (
    <div className="relative flex h-full items-center overflow-hidden py-10">
      <AcademyBackgroundGrid />

      <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* ACCOUNT IDENTITY */}
          <section className="border-foreground/10 bg-background border p-8">
            <h2 className="border-foreground/5 mb-6 flex items-center gap-2 border-b pb-4 font-serif text-xl font-bold uppercase">
              <FiMail className="text-foreground/50" /> {t('identity.title')}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-foreground/60 mb-2 block font-sans text-[10px] font-bold tracking-widest uppercase">
                  {t('identity.displayName')}
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={loadingProfile}
                  maxLength={60}
                  className="border-foreground/20 focus:border-foreground/50 w-full border bg-transparent p-3 font-sans outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-foreground/60 mb-2 block font-sans text-[10px] font-bold tracking-widest uppercase">
                  {t('identity.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="border-foreground/10 bg-foreground/5 text-foreground/50 w-full border p-3 font-sans outline-none"
                />
                <p className="text-foreground/40 mt-2 text-xs">{t('identity.emailNote')}</p>
              </div>
            </div>
            <button
              onClick={handleUpdateIdentity}
              disabled={savingName || loadingProfile}
              className="border-foreground/20 hover:bg-foreground/5 mt-6 border px-6 py-2 font-sans text-sm uppercase transition-colors disabled:opacity-50"
            >
              {savingName ? t('identity.saving') : t('identity.updateButton')}
            </button>
          </section>

          {/* NOTIFICATIONS */}
          <section className="border-foreground/10 bg-background border p-8">
            <h2 className="border-foreground/5 mb-6 flex items-center gap-2 border-b pb-4 font-serif text-xl font-bold uppercase">
              <FiBell className="text-foreground/50" /> {t('notifications.title')}
            </h2>
            <div className="space-y-4">
              <label className="border-foreground/5 flex cursor-not-allowed items-center justify-between border p-4 opacity-40">
                <div>
                  <p className="font-serif text-lg font-bold uppercase">{t('notifications.weeklyTitle')}</p>
                  <p className="text-foreground/50 font-sans text-xs">{t('notifications.weeklyDesc')}</p>
                </div>
                <input type="checkbox" disabled className="h-5 w-5 accent-yellow-500" />
              </label>
              <label className="border-foreground/5 flex cursor-not-allowed items-center justify-between border p-4 opacity-40">
                <div>
                  <p className="font-serif text-lg font-bold uppercase">{t('notifications.repliesTitle')}</p>
                  <p className="text-foreground/50 font-sans text-xs">{t('notifications.repliesDesc')}</p>
                </div>
                <input type="checkbox" disabled className="h-5 w-5 accent-yellow-500" />
              </label>
              <p className="text-foreground/30 font-sans text-xs">{t('notifications.comingSoon')}</p>
            </div>
          </section>

          {/* MY DISCUSS POSTS */}
          <section className="border-foreground/10 bg-background border p-8">
            <h2 className="border-foreground/5 mb-6 flex items-center gap-2 border-b pb-4 font-serif text-xl font-bold uppercase">
              <FiMessageSquare className="text-foreground/50" /> {t('myPosts.title')}
            </h2>
            <MyDiscussPosts />
          </section>

          {/* DANGER ZONE */}
          <section className="border border-error/20 bg-error/5 p-8">
            <h2 className="mb-6 flex items-center gap-2 border-b border-error/20 pb-4 font-serif text-xl font-bold text-error uppercase">
              <FiShield /> {t('dangerZone.title')}
            </h2>
            <p className="text-foreground/70 mb-4 font-sans text-sm">
              {t('dangerZone.description')}
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="border border-error bg-error/10 px-6 py-2 font-sans text-sm font-bold text-error uppercase transition-colors hover:bg-error hover:text-white"
            >
              {t('dangerZone.button')}
            </button>
          </section>
        </div>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-background border border-error/30 p-8 max-w-sm w-full mx-4">
            <h3 className="font-serif text-xl font-bold text-error uppercase mb-4">
              {t('dangerZone.modal.title')}
            </h3>
            <p className="text-foreground/70 font-sans text-sm mb-4">
              {t('dangerZone.modal.description')}
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={t('dangerZone.modal.placeholder')}
              className="border-foreground/20 focus:border-error w-full border bg-transparent p-3 font-sans outline-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE' || deleting}
                className="flex-1 border border-error bg-error/10 px-4 py-2 font-sans text-sm font-bold text-error uppercase transition-colors hover:bg-error hover:text-white disabled:opacity-40"
              >
                {deleting ? t('dangerZone.modal.deleting') : t('dangerZone.modal.confirm')}
              </button>
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm('') }}
                className="border-foreground/20 hover:bg-foreground/5 border px-4 py-2 font-sans text-sm uppercase transition-colors"
              >
                {t('dangerZone.modal.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
