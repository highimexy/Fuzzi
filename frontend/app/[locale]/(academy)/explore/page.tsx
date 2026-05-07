'use client'

import { useRef, useState, useEffect } from 'react'
import {
  FiArrowRight,
  FiArrowLeft,
  FiTerminal,
  FiTarget,
  FiStar,
  FiSmartphone,
  FiMonitor,
  FiUser,
  FiBriefcase,
  FiSmile,
} from 'react-icons/fi'
import Link from 'next/link'

// ==========================================
// 1. MOCK DATA
// ==========================================
const CAROUSEL_DATA = {
  tools: [
    { id: 1, title: 'WAVE Evaluation Tool', label: '01', icon: FiMonitor },
    { id: 2, title: 'PerfectPixel', label: '02', icon: FiTarget },
    { id: 3, title: 'Color Contrast Analyzer', label: '03', icon: FiSmartphone },
    { id: 4, title: 'Lighthouse DevTools', label: '04', icon: FiTerminal },
    { id: 5, title: 'Axe Accessibility', label: '05', icon: FiStar },
    { id: 6, title: 'Postman API Client', label: '06', icon: FiTerminal },
    { id: 7, title: 'Charles Proxy', label: '07', icon: FiMonitor },
  ],
  interviews: [
    { id: 1, title: 'Mastering Body Language', label: '01', icon: FiUser },
    { id: 2, title: 'Dress Code for Tech', label: '02', icon: FiBriefcase },
    { id: 3, title: 'Answering "Why You?"', label: '03', icon: FiTarget },
    { id: 4, title: 'Salary Negotiation', label: '04', icon: FiStar },
    { id: 5, title: 'Stress Management', label: '05', icon: FiSmile },
    { id: 6, title: 'Mock Interview Simulator', label: '06', icon: FiTerminal },
  ],
}

// ==========================================
// 2. KOMPONENT KARUZELI
// ==========================================
function CarouselRow({ title, items }: { title: string; items: any[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 16)
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) <= scrollWidth - 16)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current && scrollContainerRef.current.firstElementChild) {
      // Pobieramy faktyczną szerokość pierwszej karty i dodajemy gap (16px)
      const cardWidth = scrollContainerRef.current.firstElementChild.clientWidth
      const scrollAmount = direction === 'left' ? -(cardWidth + 16) : cardWidth + 16

      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Tytuł sekcji */}
      <div className="flex items-center justify-between px-4 lg:px-8">
        <h3 className="font-serif text-2xl font-bold tracking-wide">{title}</h3>
        <button className="text-foreground/50 hover:text-foreground text-sm font-bold tracking-widest uppercase transition-colors">
          View All
        </button>
      </div>

      {/* WRAPPER KARUZELI I PRZYCISKÓW */}
      <div className="relative w-full">
        {/* Przycisk LEWO */}
        <button
          onClick={() => scroll('left')}
          className={`bg-background/80 border-foreground/10 text-foreground absolute top-1/2 left-4 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 sm:left-8 lg:left-12 ${
            canScrollLeft ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <FiArrowLeft className="text-lg" />
        </button>

        {/* Kontener scrollowany */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="hide-scrollbar flex w-full snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:scroll-pl-8 lg:px-8 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="border-foreground/10 max-w-70 min-w-70 shrink-0 snap-start border sm:max-w-[320px] sm:min-w-[320px]"
              >
                <Link
                  href="#"
                  className="bg-background border-foreground/10 group relative flex h-48 w-full flex-col justify-between overflow-hidden border p-4 transition-all duration-300 ease-out hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:border-zinc-500/30 hover:shadow-[0_10px_20px_-10px_rgba(161,161,170,0.15)]"
                >
                  <Icon className="absolute -top-6 -right-6 text-8xl text-yellow-500 opacity-5 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-10 dark:opacity-[0.03] dark:group-hover:opacity-[0.08]" />

                  <div>
                    <span className="mb-2 block font-sans text-[10px] font-bold tracking-widest text-yellow-500 uppercase">
                      {item.label}
                    </span>
                    <h4 className="font-serif text-lg leading-tight font-bold">{item.title}</h4>
                  </div>

                  <div className="flex items-center gap-2 font-sans text-xs font-bold tracking-wider uppercase opacity-50 transition-opacity group-hover:opacity-100">
                    <span>Explore</span>
                    <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Przycisk PRAWO */}
        <button
          onClick={() => scroll('right')}
          className={`bg-background/80 border-foreground/10 text-foreground absolute top-1/2 right-4 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 sm:right-8 lg:right-12 ${
            canScrollRight ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <FiArrowRight className="text-lg" />
        </button>
      </div>
    </div>
  )
}

// ==========================================
// 3. GŁÓWNA STRONA EXPLORE
// ==========================================
export default function ExplorePage() {
  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-8 overflow-hidden py-8 lg:gap-12 lg:py-12">
      <CarouselRow title="Useful tools" items={CAROUSEL_DATA.tools} />
      <CarouselRow title="Interviews & Growth" items={CAROUSEL_DATA.interviews} />
    </div>
  )
}
