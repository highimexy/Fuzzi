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

      {/* UKRYTY GŁÓWNY NAGŁÓWEK DLA STRONY */}
      <h1 className="sr-only">Merch Shop</h1>

      {/* Kolumna 1 */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-8 xl:max-w-2xl">
        <div className="flex flex-1 items-center justify-center">
          {/* ZMIENIONO H1 NA H2 */}
          <h2 className="font-sans text-2xl font-bold">3D Model</h2>
        </div>
        <div className="mt-auto mb-4 flex gap-2">
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

      {/* Kolumna 2 */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-8 xl:max-w-2xl">
        <div className="flex flex-1 items-center justify-center">
          {/* ZMIENIONO H1 NA H2 */}
          <h2 className="font-sans text-2xl font-bold">3D Model</h2>
        </div>
        <button className="mt-auto mb-4 flex gap-2 border bg-accent/10 px-3 py-1.75 font-sans font-bold text-accent uppercase transition-colors hover:bg-accent/20">
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
