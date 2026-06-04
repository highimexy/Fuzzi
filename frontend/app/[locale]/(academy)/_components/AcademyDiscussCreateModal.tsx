'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { FiX } from 'react-icons/fi'
import { useUserStore } from '@/store/userStore'
import { createPost, updatePost, DISCUSS_CATEGORIES, type DiscussPost } from '@/lib/discussApi'
import { MorphRing } from './MorphRing'
import { RichTextEditor } from './RichTextEditor'
import { useToast } from '@/app/[locale]/_components/toast/useToast'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('Discuss')
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
      toast({ variant: 'error', title: t('modal.mustLogin') })
      return
    }
    setLoading(true)
    try {
      if (mode === 'edit' && initialPost) {
        const updated = await updatePost(token, initialPost.id, { title, body, category, tags })
        onUpdated?.(updated)
        onClose()
        toast({ variant: 'success', title: t('modal.postUpdated') })
      } else {
        const post = await createPost(token, { title, body, tags, category })
        onCreated?.(post)
        onClose()
        toast({ variant: 'success', title: t('modal.postPublished') })
      }
    } catch (err) {
      toast({ variant: 'error', title: err instanceof Error ? err.message : t('serverError') })
    } finally {
      setLoading(false)
    }
  }

  const bodyText = body.replace(/<[^>]+>/g, '').trim()
  const canSubmit = title.trim() !== '' && bodyText.length >= 20 && category !== ''

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
            {mode === 'edit' ? t('modal.editTitle') : t('modal.newTitle')}
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
              {t('modal.category')} <span className="text-red-400">*</span>
            </label>
            <select
              className="border-foreground/20 bg-background focus:border-foreground/50 w-full border px-3 py-2 text-sm outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">{t('modal.categoryPlaceholder')}</option>
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
              <label className="text-foreground/60 text-xs uppercase tracking-wide">{t('modal.titleLabel')}</label>
              <span className="text-foreground/40 text-xs">{title.length}/200</span>
            </div>
            <input
              className="border-foreground/20 bg-background focus:border-foreground/50 w-full border px-3 py-2 text-sm outline-none"
              placeholder={t('modal.titlePlaceholder')}
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Body */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-foreground/60 text-xs uppercase tracking-wide">{t('modal.bodyLabel')}</label>
              {bodyText.length > 0 && bodyText.length < 20 && (
                <span className="text-xs text-red-400">
                  {t('modal.bodyMinChars', { n: bodyText.length })}
                </span>
              )}
            </div>
            <RichTextEditor
              content={body}
              onChange={setBody}
              placeholder={t('modal.bodyPlaceholder')}
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1">
            <label className="text-foreground/60 text-xs uppercase tracking-wide">
              {t('modal.tagsLabel')} <span className="normal-case">({tags.length}/5)</span>
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
                  placeholder={tags.length === 0 ? t('modal.tagsPlaceholder') : ''}
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
            {t('modal.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !canSubmit}
            className="bg-accent text-background cursor-pointer px-5 py-2 text-sm font-bold transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <MorphRing size="sm" /> {mode === 'edit' ? t('modal.saving') : t('modal.sending')}
              </span>
            ) : mode === 'edit' ? (
              t('modal.save')
            ) : (
              t('modal.publish')
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
