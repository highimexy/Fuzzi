'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { MorphRing } from '../../_components/MorphRing'
import { useToast } from '@/app/[locale]/_components/toast/useToast'
import { useTranslations } from 'next-intl'

export default function AuthCallbackPage() {
  const t = useTranslations('Login')
  const router = useRouter()
  const login = useUserStore((s) => s.login)
  const { toast } = useToast()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const returnedState = params.get('state')
    const storedState = sessionStorage.getItem('pkce_state')
    const codeVerifier = sessionStorage.getItem('pkce_code_verifier')

    if (!code || !codeVerifier || returnedState !== storedState) {
      toast({ variant: 'error', title: t('googleInvalidData') })
      router.replace('/login')
      return
    }

    sessionStorage.removeItem('pkce_code_verifier')
    sessionStorage.removeItem('pkce_state')

    const locale = window.location.pathname.split('/')[1] || 'en'
    const redirectUri = `${window.location.origin}/${locale}/auth/callback`
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

    fetch(`${api}/api/v1/auth/google/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code, code_verifier: codeVerifier, redirect_uri: redirectUri }),
    })
      .then((r) => r.json())
      .then(async (data) => {
        if (data.access_token) {
          await login(data.access_token, data.expires_in)
          router.replace('/lessons')
        } else {
          toast({ variant: 'error', title: t('googleLoginFailed') })
          router.replace('/login')
        }
      })
      .catch(() => {
        toast({ variant: 'error', title: t('serverConnectionError') })
        router.replace('/login')
      })
  }, [login, router, toast])

  return (
    <div className="flex h-screen items-center justify-center font-sans">
      <MorphRing size="lg" label={t('callbackLoading')} />
    </div>
  )
}
