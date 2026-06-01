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
  FiCamera,
  FiVideo,
  FiType,
  FiMaximize,
  FiLayers,
  FiMessageSquare,
  FiCode,
  FiFolder,
  FiHelpCircle,
} from 'react-icons/fi'
import Link from 'next/link'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'

// ==========================================
// 1. MOCK DATA
// ==========================================
const CAROUSEL_DATA = {
  tools: [
    {
      id: 1,
      title: 'PerfectPixel',
      label: '01',
      icon: FiTarget,
      slug: 'perfect-pixel',
      description: 'Overlay graphic designs directly onto your coded webpage.',
    },
    {
      id: 2,
      title: 'Greenshot / Flameshot',
      label: '02',
      icon: FiCamera,
      slug: 'greenshot-flameshot',
      description: 'Advanced screenshots with annotations, arrows, and blurring.',
    },
    {
      id: 3,
      title: 'Loom / OBS Studio',
      label: '03',
      icon: FiVideo,
      slug: 'loom-obs-studio',
      description: 'Record your screen with voice comments for bug reporting.',
    },
    {
      id: 4,
      title: 'Handbrake',
      label: '04',
      icon: FiMonitor,
      slug: 'handbrake',
      description: 'Compress video recordings to fit GitHub or Jira file size limits.',
    },
    {
      id: 5,
      title: 'Expo Go / TestFlight',
      label: '05',
      icon: FiSmartphone,
      slug: 'expo-go-testflight',
      description: 'Test mobile and web apps directly on physical devices.',
    },
    {
      id: 6,
      title: 'Responsively App',
      label: '06',
      icon: FiMonitor,
      slug: 'responsively-app',
      description: 'Preview your project across multiple resolutions simultaneously.',
    },
    {
      id: 7,
      title: 'BrowserStack',
      label: '07',
      icon: FiSmartphone,
      slug: 'browserstack',
      description: 'Cross-browser testing on virtual mobile devices.',
    },
    {
      id: 8,
      title: 'Fonts Ninja',
      label: '08',
      icon: FiType,
      slug: 'fonts-ninja',
      description: 'Quickly identify, test, and download fonts used on any website.',
    },
    {
      id: 9,
      title: 'Window Resizer',
      label: '09',
      icon: FiMaximize,
      slug: 'window-resizer',
      description: 'Resize your browser window to test responsive web design (RWD).',
    },
    {
      id: 10,
      title: 'Wappalyzer',
      label: '10',
      icon: FiLayers,
      slug: 'wappalyzer',
      description: 'Check technologies, frameworks, and analytics tools used on a webpage.',
    },
  ],
  interviews: [
    {
      id: 1,
      title: 'Mastering Body Language',
      label: '01',
      icon: FiUser,
      slug: 'mastering-body-language',
      description: 'Non-verbal communication tips to look confident.',
    },
    {
      id: 2,
      title: 'Dress Code for Tech',
      label: '02',
      icon: FiBriefcase,
      slug: 'dress-code-for-tech',
      description: 'What to wear for success in modern tech interviews.',
    },
    {
      id: 3,
      title: 'Answering "Why You?"',
      label: '03',
      icon: FiTarget,
      slug: 'answering-why-you',
      description: 'Craft your perfect pitch and stand out from the crowd.',
    },
    {
      id: 4,
      title: 'Salary Negotiation',
      label: '04',
      icon: FiStar,
      slug: 'salary-negotiation',
      description: 'Strategies to get the compensation you actually deserve.',
    },
    {
      id: 5,
      title: 'Stress Management',
      label: '05',
      icon: FiSmile,
      slug: 'stress-management',
      description: 'Stay calm and focused under extreme pressure.',
    },
    {
      id: 6,
      title: 'Mock Interview Simulator',
      label: '06',
      icon: FiTerminal,
      slug: 'mock-interview-simulator',
      description: 'Practice makes perfect with realistic scenarios.',
    },
    {
      id: 7,
      title: 'The STAR Method',
      label: '07',
      icon: FiMessageSquare,
      slug: 'the-star-method',
      description: 'Structure your behavioral answers (Situation, Task, Action, Result).',
    },
    {
      id: 8,
      title: 'Live Coding Survival',
      label: '08',
      icon: FiCode,
      slug: 'live-coding-survival',
      description: 'How to think out loud and handle pressure during technical tasks.',
    },
    {
      id: 9,
      title: 'Portfolio Presentation',
      label: '09',
      icon: FiFolder,
      slug: 'portfolio-presentation',
      description: 'Showcase your projects and explain architectural decisions effectively.',
    },
    {
      id: 10,
      title: 'Questions for Them',
      label: '10',
      icon: FiHelpCircle,
      slug: 'questions-for-them',
      description: 'Smart questions to ask your interviewers to show real engagement.',
    },
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
      const cardWidth = scrollContainerRef.current.firstElementChild.clientWidth
      const scrollAmount = direction === 'left' ? -(cardWidth + 16) : cardWidth + 16

      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between px-4 lg:px-8">
        {/* H2 - tytuł sekcji karuzeli */}
        <h2 className="font-serif text-2xl font-bold tracking-wide">{title}</h2>
        <button className="text-foreground/50 hover:text-foreground text-sm font-bold tracking-widest uppercase transition-colors">
          View All
        </button>
      </div>

      <div className="relative w-full">
        <button
          onClick={() => scroll('left')}
          className={`bg-background/80 border-foreground/10 text-foreground absolute top-1/2 left-4 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 sm:left-8 lg:left-12 ${
            canScrollLeft ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <FiArrowLeft className="text-lg" />
        </button>

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
                  href={`/explore/${item.slug}`}
                  className="bg-background border-foreground/10 group relative flex h-52 w-full flex-col justify-between overflow-hidden border p-4 transition-all duration-300 ease-out hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:border-foreground/20 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.08)]"
                >
                  <Icon className="absolute -top-6 -right-6 text-8xl text-accent opacity-5 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-10 dark:opacity-[0.03] dark:group-hover:opacity-[0.08]" />

                  <div>
                    <span className="mb-2 block font-sans text-[10px] font-bold tracking-widest text-accent uppercase">
                      {item.label}
                    </span>
                    {/* H3 - tytuł konkretnej karty */}
                    <h3 className="font-serif text-lg leading-tight font-bold">{item.title}</h3>
                    <p className="text-foreground/60 mt-2 line-clamp-2 text-xs">
                      {item.description}
                    </p>
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
    <div className="relative flex w-full flex-1 flex-col justify-center gap-8 overflow-hidden py-8 lg:gap-12 lg:py-12">
      <AcademyBackgroundGrid />
      <h1 className="sr-only">Explore Collections</h1>

      <CarouselRow title="Useful tools" items={CAROUSEL_DATA.tools} />
      <CarouselRow title="Interviews & Growth" items={CAROUSEL_DATA.interviews} />
    </div>
  )
}
