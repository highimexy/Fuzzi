'use client'

import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'
import { FcGoogle } from 'react-icons/fc'

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full flex-1 flex-col items-stretch justify-center overflow-hidden font-sans lg:flex-row">
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      {/* Content */}
      <div className="flex w-full max-w-4xl flex-col items-center justify-center p-8 xl:max-w-2xl">
        {/* Texts - NAPRAWIONE */}
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
          <button className="flex w-72 items-center justify-center gap-2 border p-3 font-serif uppercase transition-colors hover:bg-black/5">
            <FcGoogle className="text-xl" /> Continue with Google
          </button>

          <p className="text-foreground/60 font-serif text-sm">or</p>

          <div className="flex flex-col gap-3">
            <input
              placeholder="Enter your email"
              className="border-foreground/20 focus:border-foreground/50 w-72 border p-3 font-sans outline-none"
            />
            <button className="w-72 border bg-yellow-500/10 p-3 font-sans font-bold text-yellow-500 uppercase transition-colors hover:bg-yellow-500/20">
              Continue with email
            </button>
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
