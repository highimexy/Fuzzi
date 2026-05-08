'use client'

import { AcademyBackgroundGrid } from '../../_components/AcademyBackgroundGrid'

export default function MerchShopPage() {
  return (
    <div className="flex w-full flex-1 items-stretch justify-center font-sans">
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      <div className="lg-py-8 relative z-10 mt-4 mb-4 flex w-full max-w-4xl flex-col items-center justify-center px-4 xl:max-w-2xl"></div>
      <div className="border-foreground/10 relative hidden flex-1 border-r border-l lg:block">
        <AcademyBackgroundGrid />
      </div>
      <div className="lg-py-8 relative z-10 mt-4 mb-4 flex w-full max-w-4xl flex-col items-center justify-center px-4 xl:max-w-2xl"></div>

      <div className="border-foreground/10 relative hidden flex-1 border-r border-l lg:block">
        <AcademyBackgroundGrid />
      </div>
    </div>
  )
}
