'use client'

import { BsFillBasketFill } from 'react-icons/bs'
import { AcademyBackgroundGrid } from '../../_components/AcademyBackgroundGrid'
import { MerchDropdown } from '../../_components/MerchDropdown'

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

      {/* Kolumna 1 */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-4 py-8 xl:max-w-2xl">
        <div className="flex flex-1 items-center justify-center">
          <h1 className="font-sans">3D Model</h1>
        </div>
        <div className="mt-auto mb-4 flex gap-2">
          <button className="flex items-center gap-2 border bg-yellow-500/10 px-3 py-1.5 font-sans font-bold text-yellow-500 uppercase transition-colors hover:bg-yellow-500/20">
            <BsFillBasketFill className="text-xl" />
            Add to Cart
          </button>
          <MerchDropdown label="Size" items={MerchSize} />
        </div>
      </div>

      <div className="border-foreground/10 relative hidden flex-1 border-r border-l lg:block">
        <AcademyBackgroundGrid />
      </div>

      {/* Kolumna 2 */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-4 py-8 xl:max-w-2xl">
        <div className="flex flex-1 items-center justify-center">
          <h1 className="font-sans">3D Model</h1>
        </div>
        <button className="mt-auto mb-4 flex gap-2 border bg-yellow-500/10 px-3 py-1.75 font-sans font-bold text-yellow-500 uppercase transition-colors hover:bg-yellow-500/20">
          <BsFillBasketFill className="text-xl" />
          Add to Cart
        </button>
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
