'use client'

import { FiBookmark, FiArrowRight, FiClock } from 'react-icons/fi'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'

const bookmarks = [
  {
    id: 1,
    title: 'Advanced React Patterns',
    category: 'Frontend',
    date: 'May 14, 2026',
    time: '12 min read',
  },
  {
    id: 2,
    title: 'Go Routines & Concurrency',
    category: 'Backend',
    date: 'May 10, 2026',
    time: '25 min read',
  },
  {
    id: 3,
    title: 'Automated QA Testing Setup',
    category: 'QA',
    date: 'Apr 28, 2026',
    time: '18 min read',
  },
]

export default function BookmarksPage() {
  return (
    <div className="relative flex h-full items-center overflow-hidden py-10">
      <AcademyBackgroundGrid />

      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="border-foreground/10 flex items-center justify-end pb-4">
          <div className="border-foreground/10 bg-background flex h-12 w-12 items-center justify-center border">
            <FiBookmark className="text-xl text-accent" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              className="group border-foreground/10 bg-background hover:border-foreground/30 flex flex-col justify-between border p-6 transition-colors sm:flex-row sm:items-center"
            >
              <div className="mb-4 sm:mb-0">
                <span className="mb-2 block font-sans text-[10px] font-bold tracking-widest text-accent uppercase">
                  {bm.category}
                </span>
                <h3 className="font-serif text-xl font-bold uppercase">{bm.title}</h3>
                <div className="text-foreground/50 mt-2 flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <FiClock /> {bm.time}
                  </span>
                  <span>Saved on {bm.date}</span>
                </div>
              </div>
              <button className="border-foreground/20 hover:bg-foreground/5 flex items-center justify-center gap-2 border bg-transparent px-6 py-3 font-sans text-sm font-bold uppercase transition-colors">
                Review <FiArrowRight />
              </button>
            </div>
          ))}
          {bookmarks.length === 0 && (
            <div className="border-foreground/20 border border-dashed py-20 text-center">
              <p className="text-foreground/50 font-sans tracking-widest uppercase">
                No intelligence gathered yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
