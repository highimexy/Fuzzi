'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { FiX } from 'react-icons/fi'
import { useUserStore } from '@/store/userStore'
import { createPost, updatePost, DISCUSS_CATEGORIES, type DiscussPost } from '@/lib/discussApi'
import { MorphRing } from './MorphRing'
import { useToast } from '@/app/[locale]/_components/toast/useToast'

type Props = {
  onClose: () => void
  onCreated?: (post: DiscussPost) => void
  mode?: 'create' | 'edit'
  initialPost?: DiscussPost
  onUpdated?: (post: DiscussPost) => void
}

export function AcademyDiscussCreateModal({
  onClose,
  onCreated,
  mode = 'create',
  initialPost,
  onUpdated,
}: Props) {
  const token = useUserStore((s) => s.token)
  const { toast } = useToast()
  const [title, setTitle] = useState(initialPost?.title ?? '')
  const [body, setBody] = useState(initialPost?.body ?? '')
  const [category, setCategory] = useState(initialPost?.category ?? '')
  const [tags, setTags] = useState<string[]>(initialPost?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const addTag = (value: string) => {
    const tag = value.trim().toLowerCase()
    if (!tag || tags.includes(tag) || tags.length >= 5) return
    setTags([...tags, tag])
    setTagInput('')
  }

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags(tags.slice(0, -1))
    }
  }

  const handleSubmit = async () => {
    if (!token) {
      toast({ variant: 'error', title: 'Musisz być zalogowany, żeby dodać post.' })
      return
    }
    setLoading(true)
    try {
      if (mode === 'edit' && initialPost) {
        const updated = await updatePost(token, initialPost.id, { title, body, category, tags })
        onUpdated?.(updated)
        onClose()
        toast({ variant: 'success', title: 'Post zaktualizowany!' })
      } else {
        const post = await createPost(token, { title, body, tags, category })
        onCreated?.(post)
        onClose()
        toast({ variant: 'success', title: 'Post opublikowany!' })
      }
    } catch (err) {
      toast({ variant: 'error', title: err instanceof Error ? err.message : 'Błąd serwera' })
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = title.trim() !== '' && body.length >= 20 && category !== ''

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose()
      }}
    >
      <div className="bg-background border-foreground/10 relative flex w-full max-w-2xl flex-col border">
        {/* Header */}
        <div className="border-foreground/10 flex items-center justify-between border-b px-6 py-4">
          <span className="font-serif text-lg font-bold">
            {mode === 'edit' ? 'Edytuj post' : 'Nowy post'}
          </span>
          <button
            onClick={onClose}
            className="hover:text-foreground text-foreground/60 cursor-pointer transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-6 py-5">
          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-foreground/60 text-xs uppercase tracking-wide">
              Kategoria <span className="text-red-400">*</span>
            </label>
            <select
              className="border-foreground/20 bg-background focus:border-foreground/50 w-full border px-3 py-2 text-sm outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Wybierz kategorię...</option>
              {DISCUSS_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-foreground/60 text-xs uppercase tracking-wide">Tytuł</label>
              <span className="text-foreground/40 text-xs">{title.length}/200</span>
            </div>
            <input
              className="border-foreground/20 bg-background focus:border-foreground/50 w-full border px-3 py-2 text-sm outline-none"
              placeholder="O czym chcesz porozmawiać?"
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Body */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-foreground/60 text-xs uppercase tracking-wide">Treść</label>
              <span
                className={`text-xs ${body.length < 20 && body.length > 0 ? 'text-red-400' : 'text-foreground/40'}`}
              >
                {body.length < 20 ? `min. 20 znaków (${body.length})` : body.length}
              </span>
            </div>
            <textarea
              className="border-foreground/20 bg-background focus:border-foreground/50 w-full resize-none border px-3 py-2 text-sm outline-none"
              placeholder="Opisz swój temat..."
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1">
            <label className="text-foreground/60 text-xs uppercase tracking-wide">
              Tagi <span className="normal-case">({tags.length}/5)</span>
            </label>
            <div className="border-foreground/20 focus-within:border-foreground/50 flex flex-wrap gap-1.5 border px-3 py-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-accent/10 text-accent flex items-center gap-1 px-2 py-0.5 text-xs"
                >
                  {tag}
                  <button
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="hover:text-accent/70 cursor-pointer"
                  >
                    <FiX className="text-xs" />
                  </button>
                </span>
              ))}
              {tags.length < 5 && (
                <input
                  className="bg-background min-w-24 flex-1 text-sm outline-none"
                  placeholder={tags.length === 0 ? 'Enter lub , aby dodać tag' : ''}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => addTag(tagInput)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-foreground/10 flex items-center justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="text-foreground/60 hover:text-foreground cursor-pointer text-sm transition-colors"
          >
            Anuluj
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !canSubmit}
            className="bg-accent text-background cursor-pointer px-5 py-2 text-sm font-bold transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <MorphRing size="sm" /> {mode === 'edit' ? 'Zapisywanie...' : 'Wysyłanie...'}
              </span>
            ) : mode === 'edit' ? (
              'Zapisz'
            ) : (
              'Opublikuj'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
