'use client'

import dynamic from 'next/dynamic'
import { BsFillBasketFill } from 'react-icons/bs'
import { AcademyBackgroundGrid } from '../../_components/AcademyBackgroundGrid'
import { MerchDropdown } from '../../_components/MerchDropdown'
import { MorphRing } from '../../_components/MorphRing'

const TShirtScene = dynamic(
  () => import('./_components/TShirtScene').then((m) => m.TShirtScene),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center"><MorphRing size="lg" /></div> },
)

const KeychainScene = dynamic(
  () => import('./_components/KeychainScene').then((m) => m.KeychainScene),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center"><MorphRing size="lg" /></div> },
)

const MerchSize = [
  { label: 'XL', href: '' },
  { label: 'L', href: '' },
  { label: 'M', href: '' },
  { label: 'S', href: '' },
]

export default function MerchShopPage() {
  return (
    <div className="flex w-full flex-1 flex-col items-stretch justify-center font-sans lg:flex-row">
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      <h1 className="sr-only">Merch Shop</h1>

      {/* T-Shirt */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-8 lg:justify-center xl:max-w-2xl">
        <div className="h-72 w-full md:h-[650px]">
          <TShirtScene />
        </div>
        <div className="mt-4 mb-4 flex gap-2">
          <button className="flex items-center gap-2 border bg-accent/10 px-3 py-1.5 font-sans font-bold text-accent uppercase transition-colors hover:bg-accent/20">
            <BsFillBasketFill className="text-xl" />
            Add to Cart
          </button>
          <MerchDropdown label="Size" items={MerchSize} />
        </div>
      </div>

      <div className="border-foreground/10 relative hidden flex-1 border-r border-l lg:block">
        <AcademyBackgroundGrid />
      </div>

      {/* Keychain */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-8 lg:justify-center xl:max-w-2xl">
        <div className="h-72 w-full md:h-[650px]">
          <KeychainScene />
        </div>
        <div className="mt-4 mb-4 flex gap-2">
          <button className="flex items-center gap-2 border bg-accent/10 px-3 py-1.5 font-sans font-bold text-accent uppercase transition-colors hover:bg-accent/20">
            <BsFillBasketFill className="text-xl" />
            Add to Cart
          </button>
          <MerchDropdown label="Size" items={MerchSize} />
        </div>
      </div>

      <div className="border-foreground/10 relative hidden flex-1 border-r border-l lg:block">
        <AcademyBackgroundGrid />
        <BsFillBasketFill className="hover:text-foreground/80 absolute top-8 left-23 cursor-pointer text-4xl" />
        <div className="bg-background absolute top-4 left-24 flex h-7 w-7 items-center justify-center rounded-full border-2">
          <p className="font-sans">0</p>
        </div>
      </div>
    </div>
  )
}
