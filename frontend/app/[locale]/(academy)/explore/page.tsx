'use client'

import {
  FiArrowRight,
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
// 1. MOCK DATA (Zastąp to danymi z API/CMS)
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
// 2. KOMPONENT KARUZELI (Jeden wiersz)
// ==========================================
function CarouselRow({ title, items }: { title: string; items: any[] }) {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Tytuł sekcji */}
      <div className="flex items-center justify-between px-4 lg:px-8">
        <h3 className="font-serif text-2xl font-bold tracking-wide">{title}</h3>
        <button className="text-foreground/50 hover:text-foreground text-sm font-bold tracking-widest uppercase transition-colors">
          View All
        </button>
      </div>

      {/* Kontener scrollowany poziomo z ukrytym paskiem */}
      <div className="hide-scrollbar mx-4 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto py-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-8 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.id} className="border-foreground/10 min-w-60 shrink-0 snap-start border">
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
    </div>
  )
}

// ==========================================
// 3. GŁÓWNA STRONA EXPLORE
// ==========================================
export default function ExplorePage() {
  return (
    <div className="flex h-full w-full flex-1 flex-col justify-center py-8 lg:py-12">
      {/* Wiersze (Karuzeli) */}
      <div className="flex flex-col gap-4">
        <CarouselRow title="Useful tools" items={CAROUSEL_DATA.tools} />
        <CarouselRow title="Interviews" items={CAROUSEL_DATA.interviews} />
      </div>
    </div>
  )
}
