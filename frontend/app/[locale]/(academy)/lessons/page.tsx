import Link from 'next/link'
import { FiTerminal, FiTarget, FiArrowRight } from 'react-icons/fi'

const tracks = [
  {
    id: 'qa',
    title: 'Quality Assurance',
    subtitle: 'Ultimate QA Compendium',
    desc: 'Od pakietów sieciowych po mikrointerakcje każdego komponentu UI. Atomowy, kompletny przewodnik po testowaniu.',
    lessonCount: 100,
    icon: FiTerminal,
    label: 'QA TRACK',
    index: '01',
    href: '/lessons/qa',
    stat: '100 lekcji',
  },
  {
    id: 'reality',
    title: 'Reality Check',
    subtitle: '100 Hard Truths',
    desc: 'To czego nie powiedzą Ci na bootcampie. Przetrwanie w branży która nigdy nie śpi i nagradza odważnych.',
    lessonCount: 100,
    icon: FiTarget,
    label: 'REALITY TRACK',
    index: '02',
    href: '/lessons/reality',
    stat: '100 lekcji',
  },
]

export default function LessonsPage() {
  return (
    <div className="flex h-full w-full flex-col lg:flex-row">
      {tracks.map((track, i) => {
        const Icon = track.icon
        return (
          <Link
            key={track.id}
            href={track.href}
            className={`group hover:bg-foreground/2.5 relative flex min-h-[50vh] flex-1 flex-col justify-between overflow-hidden p-10 transition-colors duration-500 lg:min-h-0 lg:p-16 ${i === 0 ? 'border-foreground/10 border-b lg:border-r lg:border-b-0' : ''} `}
          >
            {/* Wielka ikona tło */}
            <Icon className="text-foreground pointer-events-none absolute right-4 bottom-4 text-[240px] opacity-[0.025] transition-all duration-700 group-hover:scale-105 group-hover:-rotate-3 group-hover:opacity-[0.06]" />

            {/* Górny row */}
            <div className="flex items-center justify-between">
              <span className="text-foreground/30 text-fluid-small font-sans tracking-[0.25em] uppercase">
                {track.label}
              </span>
              <span className="text-foreground/15 text-fluid-small font-sans tracking-widest">
                {track.index} / 02
              </span>
            </div>

            {/* Środek */}
            <div className="my-auto py-14">
              <p className="text-primary text-fluid-small mb-4 font-sans tracking-[0.3em] uppercase">
                {track.subtitle}
              </p>
              <h2 className="text-fluid-h2 mb-6 font-serif leading-[0.99] font-bold uppercase">
                {track.title}
              </h2>
              <p className="text-foreground/45 text-fluid-p max-w-md font-sans leading-relaxed">
                {track.desc}
              </p>
            </div>

            {/* Dolny row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/50 h-px w-6 transition-all duration-500 group-hover:w-12" />
                <span className="text-foreground/25 text-fluid-small font-sans tracking-widest uppercase">
                  {track.stat}
                </span>
              </div>
              <div className="text-foreground/25 group-hover:text-foreground/60 text-fluid-small flex items-center gap-2 font-sans font-bold tracking-[0.2em] uppercase transition-all duration-300 group-hover:gap-3">
                <span>Wejdź</span>
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
