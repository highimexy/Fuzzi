'use client'

import { useMemo } from 'react'
import DOMPurify from 'dompurify'

interface Props {
  html: string
  className?: string
}

function isHtml(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str)
}

export function RichContent({ html, className = '' }: Props) {
  const clean = useMemo(() => {
    if (!html) return ''
    const content = isHtml(html)
      ? html
      : html.replace(/\n/g, '<br/>')
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p','br','strong','em','u','s','h2','h3','ul','ol','li','blockquote','code','pre','a','hr'],
      ALLOWED_ATTR: ['href','rel','target'],
    })
  }, [html])

  return (
    <div
      className={`rte-content ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}
