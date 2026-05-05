import Link from 'next/link'
import { FiFileText, FiVideo, FiActivity } from 'react-icons/fi'
import { ROADMAP_DATA } from './AcademyRoadMapData'

const IconMap = {
  article: FiFileText,
  video: FiVideo,
  feed: FiActivity,
}

export function TopicSidebarContent({ topicTitle }: { topicTitle: string }) {
  const content = ROADMAP_DATA[topicTitle]

  if (!content) {
    return <div className="mt-10 text-center text-sm opacity-50">Brak danych dla tego tematu.</div>
  }

  return (
    <div className="flex flex-col gap-8">
      {/* SEKCJE TEKSTOWE */}
      <div className="flex flex-col gap-6">
        {content.sections.map((sec, idx) => (
          <div key={idx}>
            <h4 className="text-foreground mb-2 font-serif text-lg font-bold">{sec.heading}</h4>
            <p className="text-foreground/70 font-sans text-sm leading-relaxed">{sec.text}</p>
          </div>
        ))}
      </div>

      {/* DARMOWE ZASOBY */}
      {content.resources.length > 0 && (
        <div className="border-foreground/10 border-t pt-6">
          <h4 className="mb-4 font-sans text-xs font-bold tracking-widest text-yellow-500 uppercase">
            Free Resources
          </h4>
          <div className="flex flex-col gap-3">
            {content.resources.map((res, idx) => {
              const Icon = IconMap[res.type]
              return (
                <Link
                  key={idx}
                  href={res.url}
                  className="group hover:bg-foreground/5 flex items-start gap-3 rounded-md p-2 transition-colors"
                  target="_blank"
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
