import Link from 'next/link'
import { FiTerminal, FiLayout, FiBox, FiTarget, FiArrowRight } from 'react-icons/fi'

const learningPaths = [
  {
    id: 'qa',
    label: 'QA AUTOMATION',
    title: 'Quality Assurance',
    desc: 'Master E2E testing, Cypress, and robust API mocking strategies.',
    href: '/academy/qa',
    icon: FiTerminal,
    colorClass: 'text-green-500',
    borderHover: 'hover:border-green-500/30',
    bgHover: 'hover:bg-green-500/5',
  },

  {
    id: 'reality',
    label: 'ENGINEERING TRUTHS',
    title: 'Reality Check',
    desc: 'System design, career architecture, and surviving the tech industry.',
    href: '/academy/reality-check',
    icon: FiTarget,
    colorClass: 'text-purple-500',
    borderHover: 'hover:border-purple-500/30',
    bgHover: 'hover:bg-purple-500/5',
  },
]

export default function AcademyDashboard() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col p-6 lg:p-12">
      {/* HEADER */}
      <div className="border-foreground/10 mb-12 flex flex-col items-center border-b pb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tighter lg:text-5xl">
          Select Domain.
        </h1>
        <p className="mt-3 font-mono text-sm opacity-60">
          Choose your specialization path to begin the simulation.
        </p>
      </div>

      {/* GRID Z KARTAMI */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {learningPaths.map((path) => {
          const Icon = path.icon

          return (
            <Link
              key={path.id}
              href={path.href}
              className={`group border-foreground/10 bg-background relative flex flex-col justify-between overflow-hidden rounded-xl border p-8 transition-all duration-300 ${path.borderHover} ${path.bgHover}`}
            >
              <Icon
                className={`absolute -top-6 -right-6 text-9xl opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.08] ${path.colorClass}`}
              />

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`font-sans font-bold tracking-widest uppercase ${path.colorClass}`}
                  >
                    {path.label}
                  </span>
                  <Icon
                    className={`text-2xl opacity-50 transition-opacity group-hover:opacity-100 ${path.colorClass}`}
                  />
                </div>
                <h3 className="mb-3 font-serif font-bold tracking-tight">{path.title}</h3>
                <p className="font-sans text-sm leading-relaxed opacity-60">{path.desc}</p>
              </div>

              <div className="border-foreground/10 mt-10 flex items-center gap-3 border-t pt-4 font-serif text-xs font-bold uppercase opacity-50 transition-opacity group-hover:opacity-100">
                <span className="mt-2">Enter Path</span>
                <FiArrowRight className="mt-2 text-lg transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
