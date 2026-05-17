'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import { Container } from '../../wrappers/Container'
import { FuzziMark } from '../../global-components/logo/page'
import {
  SiNextdotjs,
  SiGo,
  SiThreedotjs,
  SiGreensock,
  SiTailwindcss,
  SiTypescript,
  SiPostgresql,
  SiDocker,
} from 'react-icons/si'

// ─────────────────────────────────────────────
// Typy
// ─────────────────────────────────────────────
type SlotItem = {
  icon: React.ReactNode
  label: string
}

type LogEntry = {
  id: string
  role: string
  status: string
  text: string
  featured: boolean
  avatar: string | React.ReactNode // ZMIANA: Pozwala na przekazanie komponentu React
}

// ─────────────────────────────────────────────
// Dane slotów
// ─────────────────────────────────────────────
const SLOT_PAIRS: [SlotItem, SlotItem][] = [
  [
    { icon: <SiNextdotjs />, label: 'Next.js' },
    { icon: <SiTailwindcss />, label: 'Tailwind' },
  ],
  [
    { icon: <SiGo />, label: 'Golang' },
    { icon: <SiTypescript />, label: 'TypeScript' },
  ],
  [
    { icon: <SiThreedotjs />, label: 'Three.js' },
    { icon: <SiPostgresql />, label: 'PostgreSQL' },
  ],
  [
    { icon: <SiGreensock />, label: 'GSAP' },
    { icon: <SiDocker />, label: 'Docker' },
  ],
]

// ─────────────────────────────────────────────
// 1. Pojedynczy slot — własny stan + animacja
// ─────────────────────────────────────────────
function Slot({ pair, delay }: { pair: [SlotItem, SlotItem]; delay: number }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current

    const tl = gsap.timeline({ repeat: -1, delay, repeatDelay: 4 })

    tl.to(el, {
      rotateX: -90,
      filter: 'blur(3px)',
      duration: 0.18,
      ease: 'power2.in',
      transformOrigin: '50% 100%',
    })
      .call(() => {
        setCurrentIdx((prev) => (prev === 0 ? 1 : 0))
        gsap.set(el, { rotateX: 90 })
      })
      .to(el, {
        rotateX: 0,
        filter: 'blur(0px)',
        duration: 0.18,
        ease: 'power2.out',
        transformOrigin: '50% 0%',
      })

    return () => {
      tl.kill()
    }
  }, [delay])

  const item = pair[currentIdx]!

  return (
    <div
      ref={ref}
      className="flex max-w-40 min-w-40 items-center gap-2 px-4 py-1.5"
      style={{ perspective: '600px', backfaceVisibility: 'hidden' }}
    >
      <span className="text-foreground/50 text-base">{item.icon}</span>
      <span className="text-foreground/70 font-sans font-bold tracking-widest uppercase">
        {item.label}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────
// 2. Pasek ze slotami
// ─────────────────────────────────────────────
function PoweredBySlotMachine() {
  return (
    <div className="mt-10 w-full select-none">
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 lg:flex lg:flex-wrap lg:items-center lg:justify-center">
        {SLOT_PAIRS.map((pair, i) => (
          <div key={i} className="flex items-center">
            <Slot pair={pair} delay={1.5 + i * 0.22} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// 3. Komponent główny
// ─────────────────────────────────────────────
export function TrustSection() {
  const betaLogs: LogEntry[] = [
    {
      id: 'OP-473',
      role: 'Junior QA Engineer',
      status: 'BETA FEEDBACK',
      text: 'Czuć, że za tym projektem stoją ludzie, którzy zjedli zęby na testowaniu. Zero lania wody. Po kilku lekcjach w końcu zrozumiałem, na czym polega prawdziwy mindset inżyniera jakości, a nie tylko bezmyślne klikanie w UI.',
      featured: false,
      avatar: '/1.jpg',
    },
    {
      id: 'OP-112',
      role: 'Manual → Auto QA',
      status: 'BETA FEEDBACK',
      text: 'Anatomia UI otworzyła mi oczy. Pokazuje jak frontendowcy budują komponenty pod spodem i gdzie najczęściej popełniają błędy. Od razu wdrożyłem to w pracy.',
      featured: false,
      avatar: '/2.jpg',
    },
    {
      id: 'FUZZI CORE',
      role: 'Creators & Community',
      status: 'SYSTEM STATUS',
      text: "Zbudowaliśmy to narzędzie z czystej pasji do inżynierii i frustracji rynkiem przepełnionym teoretycznymi bootcampami. Chcieliśmy stworzyć miejsce, w którym sami chcielibyśmy się uczyć lata temu. Środowisko pozbawione lania wody, pełne rynkowych realiów i brutalnych edge-case'ów.\n\nNie musisz nam wierzyć na słowo. Wejdź do środka, sprawdź anatomię systemu i przetestuj nas sam. Fuzzi czeka na nowych operatorów.",
      featured: true,
      avatar: <FuzziMark size={90} />,
    },
    {
      id: 'OP-891',
      role: 'Mid QA Engineer',
      status: 'BETA FEEDBACK',
      text: "Zaskoczyło mnie, jak głęboko wchodzimy tu w edge-case'y. Widać ogrom rynkowego doświadczenia twórców. Fuzzi łagodnie prowadzi za rękę przez trudne koncepty. Warto dać szansę, nawet jak masz już solidnego expa.",
      featured: false,
      avatar: '/3.jpg',
    },
    {
      id: 'OP-204',
      role: 'Frontend Developer',
      status: 'BETA FEEDBACK',
      text: 'Świetnie zrobiona platforma od strony technicznej. Czysty, bardzo responsywny interfejs bez marketingowego bełkotu. Włożono w to mnóstwo serca i to po prostu widać.',
      featured: false,
      avatar: '/4.jpg',
    },
  ]

  return (
    <section className="bg-background border-foreground/10 relative w-full overflow-hidden border-t">
      <Container className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center text-center">
            <span className="text-accent flex items-center gap-2 font-sans text-[10px] font-bold tracking-widest uppercase opacity-80">
              <span className="bg-accent h-2 w-2 animate-pulse rounded-full" />
              Od inżynierów dla inżynierów
            </span>
            <h2 className="text-fluid-h3 mt-4 max-w-2xl font-serif leading-[0.9] tracking-tighter uppercase">
              Stworzone z pasją. <br />
              <span className="text-foreground/60 italic opacity-60">Sprawdzone w akcji.</span>
            </h2>
          </div>

          <PoweredBySlotMachine />

          <div className="border-foreground/10 mt-8 grid grid-cols-1 border lg:grid-cols-3">
            <div className="border-foreground/10 flex flex-col border-b lg:border-r lg:border-b-0">
              <div className="border-foreground/10 flex-1 border-b">
                <LogCard log={betaLogs[0]!} />
              </div>
              <div className="flex-1">
                <LogCard log={betaLogs[1]!} />
              </div>
            </div>

            <div className="border-foreground/10 border-b lg:border-r lg:border-b-0">
              <LogCard log={betaLogs[2]!} />
            </div>

            <div className="flex flex-col">
              <div className="border-foreground/10 flex-1 border-b">
                <LogCard log={betaLogs[3]!} />
              </div>
              <div className="flex-1">
                <LogCard log={betaLogs[4]!} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

// ─────────────────────────────────────────────
// 4. Karta logu
// ─────────────────────────────────────────────
function LogCard({ log }: { log: LogEntry }) {
  return (
    <div
      className={`group flex h-full flex-col p-8 text-left transition-all duration-300 ${
        log.featured
          ? 'border-accent shadow-accent/20 bg-background ring-accent/30 hover:bg-accent/2 cursor-pointer justify-center border shadow-2xl ring-1'
          : 'hover:bg-foreground/2 justify-between'
      }`}
    >
      <div className={log.featured ? 'flex flex-col items-center text-center' : ''}>
        {/* NAGŁÓWEK */}
        <div
          className={`border-foreground/10 mb-6 flex flex-wrap items-center gap-4 ${
            log.featured
              ? 'flex-col justify-center border-none pb-0'
              : 'justify-between border-b pb-4'
          }`}
        >
          <div className={`flex items-center gap-4 ${log.featured ? 'flex-col' : ''}`}>
            {/* AVATAR - Obsługa zdjęć ORAZ komponentów */}
            <div
              className={`relative flex shrink-0 items-center justify-center overflow-hidden border ${
                log.featured
                  ? 'border-accent/40 bg-accent/10 h-16 w-16'
                  : 'border-foreground/20 bg-foreground/5 h-10 w-10'
              }`}
            >
              {typeof log.avatar === 'string' ? (
                <Image
                  src={log.avatar}
                  alt={log.id}
                  fill
                  className="object-cover opacity-70 transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-2.5">
                  {log.avatar}
                </div>
              )}
            </div>

            {/* ID + rola */}
            <div className={`flex flex-col gap-0.5 ${log.featured ? 'mt-2 items-center' : ''}`}>
              <span
                className={`font-serif text-[10px] font-bold tracking-widest uppercase ${
                  log.featured ? 'text-accent text-xs' : 'text-foreground/80'
                }`}
              >
                {log.id}
              </span>
              <span
                className={`font-sans text-[8px] tracking-widest uppercase ${
                  log.featured ? 'text-accent/80' : 'text-foreground/40'
                }`}
              >
                {log.role}
              </span>
            </div>
          </div>

          {/* Status badge */}
          {!log.featured && (
            <span className="text-foreground/30 font-serif text-[8px] font-bold tracking-widest uppercase">
              {log.status}
            </span>
          )}
        </div>

        {/* TREŚĆ */}
        <p
          className={`font-sans text-sm leading-relaxed whitespace-pre-wrap ${
            log.featured
              ? 'text-foreground mt-6 font-bold opacity-100'
              : 'text-foreground opacity-70'
          }`}
        >
          {!log.featured && <>&ldquo;</>}
          {log.text}
          {!log.featured && <>&rdquo;</>}
        </p>
      </div>
    </div>
  )
}
