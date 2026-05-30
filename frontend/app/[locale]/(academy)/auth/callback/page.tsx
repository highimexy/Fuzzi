'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { MorphRing } from '../../_components/MorphRing'
import { useToast } from '@/app/[locale]/_components/toast/useToast'

export default function AuthCallbackPage() {
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
      toast({ variant: 'error', title: 'Nieprawidłowe dane logowania Google' })
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
      body: JSON.stringify({ code, code_verifier: codeVerifier, redirect_uri: redirectUri }),
    })
      .then((r) => r.json())
      .then(async (data) => {
        if (data.access_token) {
          await login(data.access_token)
          router.replace('/lessons')
        } else {
          toast({ variant: 'error', title: 'Nie udało się zalogować przez Google' })
          router.replace('/login')
        }
      })
      .catch(() => {
        toast({ variant: 'error', title: 'Błąd połączenia z serwerem' })
        router.replace('/login')
      })
  }, [login, router, toast])

  return (
    <div className="flex h-screen items-center justify-center font-sans">
      <MorphRing size="lg" label="Logging in..." />
    </div>
  )
}
