'use client'

import { AcademyBackgroundGrid } from '../../_components/AcademyBackgroundGrid'
import { FiClock, FiStar, FiShoppingBag } from 'react-icons/fi'

const CARDS = [
  {
    id: 1,
    icon: FiClock,
    label: 'TRIAL',
    title: 'Premium 3 Days',
    description: 'Unlock full premium access for 72 hours.',
  },
  {
    id: 2,
    icon: FiStar,
    label: 'PRO',
    title: 'Premium Month',
    description: 'Gain full access to all materials for 30 days.',
  },
  {
    id: 3,
    icon: FiShoppingBag,
    label: 'SHOP',
    title: 'Merch',
    description: 'Claim exclusive physical merchandise and apparel.',
  },
]

export default function RedeemPage() {
  return (
    <div className="flex w-full flex-1 flex-col items-stretch justify-center font-sans lg:flex-row">
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      {/* Content */}
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-4 py-8 xl:max-w-5xl">
        <div className="flex items-center justify-center">
          <h1 className="text-fluid-h1 mb-16 font-serif text-4xl font-bold">Redeem</h1>
        </div>
        <div>
          <p className="text-foreground/80 mb-2 text-center font-sans">
            Enter your redeem code below to redeem your premium access.
          </p>
        </div>
        <div className="mb-12 flex">
          <input
            placeholder="Enter Redeem Code"
            className="border-foreground/20 focus:border-foreground/50 w-56 border p-3 font-sans outline-none lg:w-72"
          />
          <button className="w-32 border bg-accent/10 p-3 font-sans font-bold text-accent uppercase transition-colors hover:bg-accent/20">
            Redeem
          </button>
        </div>

        {/* Cards */}
        <div className="flex w-full flex-wrap justify-center gap-4 px-4 py-4">
          {CARDS.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.id} className="border-foreground/10 max-w-70 min-w-70 border">
                <div className="bg-background border-foreground/10 group relative flex h-52 w-full flex-col justify-between overflow-hidden border p-4 transition-all duration-300 ease-out hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:border-foreground/30 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.08)]">
                  <Icon className="absolute -top-6 -right-6 text-8xl text-accent opacity-5 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-10 dark:opacity-[0.03] dark:group-hover:opacity-[0.08]" />

                  <div>
                    <span className="mb-2 block font-sans text-[10px] font-bold tracking-widest text-accent uppercase">
                      {item.label}
                    </span>
                    {/* ZMIENIONO H4 NA H2 */}
                    <h2 className="font-serif text-lg leading-tight font-bold">{item.title}</h2>
                    <p className="text-foreground/60 mt-2 line-clamp-2 text-xs">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="border-foreground/10 relative hidden flex-1 border-r border-l lg:block">
        <AcademyBackgroundGrid />
      </div>
    </div>
  )
}
