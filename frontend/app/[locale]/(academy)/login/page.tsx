'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'
import { MorphRing } from '../_components/MorphRing'
import { FcGoogle } from 'react-icons/fc'
import { useUserStore } from '@/store/userStore'

function generateCodeVerifier(): string {
  const arr = new Uint8Array(32)
  crypto.getRandomValues(arr)
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export default function LoginPage() {
  const router = useRouter()
  const login = useUserStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendTimer])

  const handleSendOTP = async () => {
    if (!email) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/auth/otp/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStep('otp')
        setResendTimer(30)
        setCode('')
      } else {
        setError('Failed to send code. Please try again.')
      }
    } catch {
      setError('Network error. Check connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!code) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      if (res.ok) {
        const data = await res.json()
        await login(data.access_token)
        router.push('/lessons')
      } else {
        setError('Invalid or expired code!')
      }
    } catch {
      setError('Network error. Check connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID
    const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE
    if (!domain || !clientId || !audience) return

    const locale = window.location.pathname.split('/')[1] || 'en'
    const redirectUri = `${window.location.origin}/${locale}/auth/callback`

    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)
    const state = generateCodeVerifier()

    sessionStorage.setItem('pkce_code_verifier', codeVerifier)
    sessionStorage.setItem('pkce_state', state)

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'openid profile email',
      audience,
      connection: 'google-oauth2',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state,
    })

    window.location.href = `https://${domain}/authorize?${params}`
  }

  const handleBackToEmail = () => {
    setStep('email')
    setCode('')
    setError('')
  }

  return (
    <div className="flex h-screen w-full flex-1 flex-col items-stretch justify-center overflow-hidden font-sans lg:flex-row">
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      {/* Content */}
      <div className="flex w-full max-w-4xl flex-col items-center justify-center p-8 xl:max-w-2xl">
        {/* Texts */}
        <div className="mb-16 flex flex-col">
          <h1 className="flex flex-col items-center justify-center leading-tight">
            <span className="text-fluid-h2 font-serif uppercase">
              I want <span className="font-serif underline">you</span>
            </span>
            <span className="flex items-center justify-center">
              <span className="text-fluid-h3 mr-4 font-serif">for the</span>
              <span className="text-fluid-h2 font-serif text-accent uppercase">Frontier</span>
            </span>
            <span className="text-fluid-h2 font-serif uppercase">Enlist Now</span>
          </h1>
        </div>

        {/* Buttons & Inputs */}
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            onClick={handleGoogleLogin}
            className="flex w-72 items-center justify-center gap-2 border p-3 font-serif uppercase transition-colors hover:bg-black/5"
          >
            <FcGoogle className="text-xl" /> Continue with Google
          </button>

          <p className="text-foreground/60 font-serif text-sm">or</p>

          <div className="flex w-72 flex-col gap-3">
            {step === 'email' ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="border-foreground/20 focus:border-foreground/50 w-full border p-3 font-sans outline-none disabled:opacity-50"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                />
                {error && <span className="text-sm text-error">{error}</span>}
                <button
                  onClick={handleSendOTP}
                  disabled={loading || !email}
                  className="w-full border bg-accent/10 p-3 font-sans font-bold text-accent uppercase transition-colors hover:bg-accent/20 disabled:opacity-50"
                >
                  {loading ? <span className="flex items-center justify-center gap-2"><MorphRing size="sm" /> Sending...</span> : 'Continue with email'}
                </button>
              </>
            ) : (
              <>
                <p className="text-foreground/80 text-center font-sans text-sm">
                  Code sent to <strong>{email}</strong>
                </p>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  disabled={loading}
                  maxLength={6}
                  className="border-foreground/20 focus:border-foreground/50 w-full border p-3 text-center font-sans tracking-widest outline-none disabled:opacity-50"
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP()}
                />
                {error && <span className="text-center text-sm text-error">{error}</span>}
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || code.length < 6}
                  className="w-full border bg-accent p-3 font-sans font-bold text-black uppercase transition-colors hover:bg-accent disabled:opacity-50"
                >
                  {loading ? <span className="flex items-center justify-center gap-2"><MorphRing size="sm" /> Verifying...</span> : 'Verify & Enter'}
                </button>

                <div className="text-foreground/60 mt-2 flex items-center justify-between font-sans text-sm">
                  <button
                    onClick={handleBackToEmail}
                    className="hover:text-foreground underline transition-colors"
                  >
                    Change email
                  </button>
                  <button
                    onClick={handleSendOTP}
                    disabled={resendTimer > 0 || loading}
                    className="hover:text-foreground underline transition-colors disabled:no-underline disabled:opacity-50"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-foreground/70 mt-8">
          <p className="text-center font-sans text-sm">
            By continuing, you agree to <span className="font-serif uppercase">Frontier's</span>
            <a href="#" className="hover:text-foreground ml-1 underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      <div className="border-foreground/10 relative hidden flex-1 border-l lg:block">
        <AcademyBackgroundGrid />
      </div>
    </div>
  )
}
