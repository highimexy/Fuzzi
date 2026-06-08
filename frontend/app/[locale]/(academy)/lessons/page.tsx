import { TrackColumn } from './_components/TrackColumn'

const tracks = [
  {
    id: 'qa',
    title: 'Quality Assurance',
    subtitle: 'Ultimate QA Compendium',
    desc: 'Od pakietów sieciowych po mikrointerakcje każdego komponentu UI. Atomowy, kompletny przewodnik po testowaniu.',
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
    label: 'REALITY TRACK',
    index: '02',
    href: '/lessons/reality',
    stat: '100 lekcji',
  },
]

export default function LessonsPage() {
  return (
    <div className="flex h-full w-full flex-col lg:flex-row">
      {tracks.map((track, i) => (
        <TrackColumn key={track.id} track={track} isFirst={i === 0} />
      ))}
    </div>
  )
}
