'use client'

import { Container } from '../../wrappers/Container'
import { BackgroundGrid } from '../_components/BackgroundGrid'

interface SubpageHeaderProps {
  title: string
  accentColor: string
}

export function SimpleHeader({ title, accentColor }: SubpageHeaderProps) {
  return (
    <header className="w-full">
      <Container className="relative overflow-hidden">
        <BackgroundGrid />
        <div className="relative z-10 flex flex-col px-6 py-20 text-center">
          <h1 className="text-fluid-h2 font-serif leading-none tracking-tighter uppercase">
            <span className={`${accentColor} italic opacity-90`}>{title}</span>
          </h1>
        </div>
      </Container>
    </header>
  )
}
