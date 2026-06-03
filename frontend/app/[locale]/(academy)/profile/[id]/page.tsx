'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiUser, FiArrowUp, FiEye, FiMessageSquare } from 'react-icons/fi'
import { AcademyBackgroundGrid } from '../../_components/AcademyBackgroundGrid'
import {
  fetchPublicProfile,
  fetchPosts,
  getCategoryLabel,
  type PublicProfile,
  type DiscussPost,
} from '@/lib/discussApi'

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

export default function PublicProfilePage() {
  const params = useParams()
  const id = params.id as string

  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [posts, setPosts] = useState<DiscussPost[]>([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetchPublicProfile(id)
      .then(setProfile)
      .catch(() => setNotFound(true))
  }, [id])

  // Fetch posts by this user — reuse ListHandler with a future user_id filter.
  // For now load recent posts and filter client-side by auth0_id.
  useEffect(() => {
    if (!profile) return
    fetchPosts('newest', 1, undefined, undefined)
      .then((data) => {
        const userPosts = data.posts.filter((p) => p.author?.auth0_id === profile.auth0_id)
        setPosts(userPosts)
      })
      .catch(() => {})
  }, [profile])

  if (notFound) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <p className="text-foreground/40 text-sm">Profil nie istnieje.</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <p className="text-foreground/30 text-sm">Ładowanie...</p>
      </div>
    )
  }

  const displayName = profile.name || 'Anonim'

  return (
    <div className="flex w-full flex-1 items-stretch justify-center font-sans">
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      <div className="relative z-10 flex w-full max-w-4xl flex-col p-8 xl:max-w-5xl">
        <Link
          href="/discuss"
          className="text-foreground/40 hover:text-foreground mb-6 flex items-center gap-1.5 text-xs uppercase tracking-widest transition-colors"
        >
          <FiArrowLeft /> Discuss
        </Link>

        {/* Profile card */}
        <div className="border-foreground/10 mb-8 flex items-center gap-5 border-b pb-6">
          <div className="border-foreground/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border">
            <FiUser className="text-foreground/30 text-2xl" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold">{displayName}</h1>
            <div className="text-foreground/40 mt-1 flex items-center gap-4 text-xs">
              <span>Dołączył/a {formatDate(profile.created_at)}</span>
              <span>{profile.post_count} postów</span>
            </div>
          </div>
        </div>

        {/* Posts by this user */}
        <h2 className="text-foreground/50 mb-4 text-xs font-bold uppercase tracking-widest">
          Posty użytkownika
        </h2>

        {posts.length === 0 ? (
          <p className="text-foreground/30 text-sm">Brak postów.</p>
        ) : (
          <div className="flex flex-col">
            {posts.map((post) => (
              <div key={post.id} className="border-foreground/10 flex flex-col gap-1.5 border-b py-4">
                <div className="text-foreground/40 flex items-center gap-2 text-xs">
                  <span className="bg-foreground/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
                    {getCategoryLabel(post.category)}
                  </span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <Link
                  href={`/discuss/${post.id}`}
                  className="font-serif font-bold hover:underline underline-offset-2"
                >
                  {post.title}
                </Link>
                <div className="text-foreground/30 flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <FiArrowUp /> {post.upvotes}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiEye /> {formatViews(post.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMessageSquare /> {post.comment_count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-foreground/10 relative hidden flex-1 border-l lg:block">
        <AcademyBackgroundGrid />
      </div>
    </div>
  )
}
