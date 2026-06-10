import { Suspense } from 'react'
import NotebookLibrary, { type TrackData, type LessonItem } from './_components/NotebookLibrary'

interface LessonGroup {
  id: string
  order: number
  title_en: string
  title_pl: string
  sub_lesson_count: number
}

async function getGroups(track: string): Promise<LessonGroup[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tracks/${track}/groups`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

function groupsToLessons(groups: LessonGroup[]): LessonItem[] {
  return groups.map(g => ({
    id: g.id,
    order: g.order,
    title_en: g.title_en,
    title_pl: g.title_pl,
    sub_lesson_count: g.sub_lesson_count,
  }))
}

export default async function LessonsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const [qaGroups, realityGroups] = await Promise.all([
    getGroups('qa'),
    getGroups('reality'),
  ])

  const tracks: TrackData[] = [
    {
      id: 'qa',
      title: 'Quality Assurance',
      desc: 'From bits to UI',
      bottom: 'Fuzzi | QA TRACK',
      quote: locale === 'pl'
        ? '„Jakość nie jest aktem. Jest nawykiem zapisanym w setkach małych decyzji, których nikt nie widzi."'
        : '"Quality is not an act. It is a habit written in hundreds of small decisions that no one sees."',
      by: locale === 'pl' ? '— z notatek autora' : '— from the author\'s notes',
      lessons: groupsToLessons(qaGroups),
    },
    {
      id: 'reality',
      title: 'Reality Check',
      desc: "What they won't tell you",
      bottom: 'Fuzzi | Reality Track',
      quote: locale === 'pl'
        ? '„Kariera to nie drabina. To notes pełen błędów, z których kilka opłaciło się bardziej niż wszystkie sukcesy razem."'
        : '"A career is not a ladder. It\'s a notebook full of mistakes, a few of which paid off more than all the successes combined."',
      by: locale === 'pl' ? '— z notatek autora' : '— from the author\'s notes',
      lessons: groupsToLessons(realityGroups),
    },
  ]

  return (
    <Suspense>
      <NotebookLibrary tracks={tracks} locale={locale} />
    </Suspense>
  )
}
