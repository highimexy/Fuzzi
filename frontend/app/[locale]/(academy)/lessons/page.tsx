import { getTranslations } from 'next-intl/server'
import { TrackColumn } from './_components/TrackColumn'

const tracks = [
  { id: 'qa' as const, index: '01', href: '/lessons/qa' },
  { id: 'reality' as const, index: '02', href: '/lessons/reality' },
]

export default async function LessonsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Academy.lessons' })

  return (
    <div className="flex h-full w-full flex-col">
      <div className="shrink-0 px-4 py-8 lg:px-8 lg:py-10">
        <h1 className="font-serif text-3xl font-black uppercase tracking-tight lg:text-4xl">
          {t('title')}
        </h1>
        <p className="text-foreground/45 mt-2 font-sans text-sm">{t('subtitle')}</p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {tracks.map((track, i) => (
          <TrackColumn key={track.id} track={track} isFirst={i === 0} />
        ))}
      </div>
    </div>
  )
}
