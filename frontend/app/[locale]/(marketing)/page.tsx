'use client'

import { HomeHeader } from './home/HomeHeader'
import { SectionDivider } from './_components/SectionDivider'
import { SupportersTicker } from './home/SupportersTicker'
import { ProblemSection } from './home/ProblemSection'
import { EducationSection } from './home/EducationSection'
import { TrustSection } from './home/TrustSection'
import { ConversionSection } from './home/ConversionSection'
import { LastSection } from './home/LastSection'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <main className="flex-1 pb-1">
        {/* 1. HOOK: Hero Section */}
        <HomeHeader />
        <SectionDivider />

        {/* 2. SOCIAL PROOF: Szybki dowód słuszności od razu po wejściu */}
        <SupportersTicker />
        <SectionDivider />

        {/* 3. PROBLEM: Agitacja bólu klienta */}
        <ProblemSection />
        <SectionDivider />

        {/* 4. EDUKACJA: Dwa Wektory */}
        <EducationSection />
        <SectionDivider />

        {/* 5. ZAUFANIE: Referencje i liczby przed ostateczną decyzją */}
        <TrustSection />
        <SectionDivider />

        {/* 6. SPRZEDAŻ: Ostateczna konwersja / Pricing */}
        <ConversionSection />
        <SectionDivider />

        <LastSection />
        <SectionDivider />
      </main>
    </div>
  )
}
