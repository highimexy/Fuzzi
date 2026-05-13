'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'
import { FcGoogle } from 'react-icons/fc'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  // Odliczanie timera do ponownej wysyłki
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendTimer])

  // 1. WYSYŁKA KODU DO GO
  const handleSendOTP = async () => {
    if (!email) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/otp/start', {
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
    } catch (err) {
      console.error(err)
      setError('Network error. Check connection.')
    } finally {
      setLoading(false)
    }
  }

  // 2. WERYFIKACJA KODU I ODBIÓR TOKENA
  const handleVerifyOTP = async () => {
    if (!code) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('token', data.access_token)

        window.dispatchEvent(new Event('auth-change'))

        router.push('/lessons')
      } else {
        setError('Invalid or expired code!')
      }
    } catch (err) {
      console.error(err)
      setError('Network error. Check connection.')
    } finally {
      setLoading(false)
    }
  }

  // 3. GOOGLE LOGIN
  const handleGoogleLogin = () => {
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID
    const redirectUri = encodeURIComponent('http://localhost:3000/academy')
    window.location.href = `https://${domain}/authorize?response_type=token&client_id=${clientId}&connection=google-oauth2&redirect_uri=${redirectUri}`
  }

  // Cofanie z powrotem do wpisywania maila
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
          <h1 className="flex flex-col items-center justify-center leading-[0.99]">
            <span className="text-fluid-h2 font-serif uppercase">
              I want <span className="font-serif underline">you</span>
            </span>
            <span className="flex items-center justify-center">
              <span className="text-fluid-h3 mr-4 font-serif">for the</span>
              <span className="text-fluid-h2 font-serif text-amber-500 uppercase">Frontier</span>
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
                {error && <span className="text-sm text-red-500">{error}</span>}
                <button
                  onClick={handleSendOTP}
                  disabled={loading || !email}
                  className="w-full border bg-yellow-500/10 p-3 font-sans font-bold text-yellow-500 uppercase transition-colors hover:bg-yellow-500/20 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Continue with email'}
                </button>
              </>
            ) : (
              <>
                <p className="text-foreground/80 text-center font-sans text-sm">
                  Code sent to <strong>{email}</strong>
                </p>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={loading}
                  maxLength={6}
                  className="border-foreground/20 focus:border-foreground/50 w-full border p-3 text-center font-mono tracking-widest outline-none disabled:opacity-50"
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP()}
                />
                {error && <span className="text-center text-sm text-red-500">{error}</span>}
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || code.length < 6}
                  className="w-full border bg-yellow-500 p-3 font-sans font-bold text-black uppercase transition-colors hover:bg-yellow-400 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify & Enter'}
                </button>

                {/* Opcje nawigacji dla kroku OTP */}
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
