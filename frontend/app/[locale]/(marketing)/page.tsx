'use client'

import dynamic from 'next/dynamic'
import { HomeHeader } from './home/HomeHeader'
import { SectionDivider } from './_components/SectionDivider'
import { SupportersTicker } from './home/SupportersTicker'
import { ProblemSection } from './home/ProblemSection'
import { EducationSection } from './home/EducationSection'
import { TrustSection } from './home/TrustSection'
import { LastSection } from './home/LastSection'
import { BrokenUISection } from './home/BrokenUiSection'
const GlobeSection = dynamic(
  () => import('./home/GlobeSection').then((m) => m.GlobeSection),
  { ssr: false, loading: () => <div style={{ minHeight: 560 }} /> }
)

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

        {/* 4. GLOBAL: Globalny zasięg AI Testing */}
        <GlobeSection />
        <SectionDivider />

        {/* 5. EDUKACJA: Dwa Wektory */}
        <EducationSection />
        <SectionDivider />

        {/* 6. BROKEN UI: */}
        <BrokenUISection />
        <SectionDivider />

        {/* 7. ZAUFANIE: Referencje i liczby przed ostateczną decyzją */}
        <TrustSection />
        <SectionDivider />

        <LastSection />
        <SectionDivider />
      </main>
    </div>
  )
}
