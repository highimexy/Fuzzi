import Link from 'next/link'
import { type DiscussAuthor } from '@/lib/discussApi'

interface Props {
  author: DiscussAuthor
  className?: string
}

export function AuthorLink({ author, className = '' }: Props) {
  const display = author.name || author.email || 'Anonim'
  return (
    <Link
      href={`/profile/${author.id}`}
      className={`hover:text-accent transition-colors ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {display}
    </Link>
  )
}
