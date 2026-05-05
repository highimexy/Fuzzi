'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiFileText, FiVideo, FiActivity, FiCopy, FiCheck } from 'react-icons/fi'
import { ROADMAP_DATA } from './AcademyRoadMapData'

const IconMap = {
  article: FiFileText,
  video: FiVideo,
  feed: FiActivity,
  prompt: FiCopy,
}

export function TopicSidebarContent({ topicTitle }: { topicTitle: string }) {
  const content = ROADMAP_DATA[topicTitle]
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  if (!content) {
    return <div className="mt-10 text-center text-sm opacity-50">Brak danych.</div>
  }

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* SEKCJE TEKSTOWE */}
      <div className="flex flex-col gap-6">
        {content.sections.map((sec, idx) => (
          <div key={idx}>
            <h4 className="text-foreground mb-2 font-serif text-lg font-bold">{sec.heading}</h4>
            <p className="text-foreground/80 font-sans text-sm leading-relaxed whitespace-pre-wrap">
              {sec.text}
            </p>
          </div>
        ))}
      </div>

      {/* DARMOWE ZASOBY & PROMPTY */}
      {content.resources.length > 0 && (
        <div className="border-foreground/10 border-t pt-6">
          <h4 className="mb-4 font-sans text-xs font-bold tracking-widest text-yellow-500 uppercase">
            Free Resources & Prompts
          </h4>
          <div className="flex flex-col gap-3">
            {content.resources.map((res, idx) => {
              const isCopied = copiedIndex === idx
              const Icon = isCopied ? FiCheck : IconMap[res.type]

              if (res.type === 'prompt') {
                return (
                  <button
                    key={idx}
                    onClick={() => handleCopy(res.payload || '', idx)}
                    className="group hover:bg-foreground/5 flex w-full items-start gap-3 rounded-md p-2 text-left transition-colors"
                  >
                    <Icon
                      className={`mt-0.5 transition-colors ${isCopied ? 'text-green-500' : 'text-foreground/50 group-hover:text-yellow-500'}`}
                    />
                    <span className="text-foreground/80 group-hover:text-foreground font-sans text-sm font-semibold transition-colors">
                      {isCopied ? 'Copied to clipboard!' : res.title}
                    </span>
                  </button>
                )
              }

              return (
                <Link
                  key={idx}
                  href={res.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group hover:bg-foreground/5 flex items-start gap-3 rounded-md p-2 transition-colors"
                >
                  <Icon className="text-foreground/50 mt-0.5 transition-colors group-hover:text-yellow-500" />
                  <span className="text-foreground/80 group-hover:text-foreground font-sans text-sm font-semibold transition-colors">
                    {res.title}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
