'use client'

// TODO: docelowo użyje @codesandbox/sandpack-react do uruchamiania testów Playwright/JS w przeglądarce.
// Na razie szkielet — nie instaluj Sandpack dopóki nie będzie pełnej implementacji.

interface TaskProps {
  lessonId: string
  payload: any
  nextHref?: string
  isLast?: boolean
  onComplete?: (completed: boolean, xp: number) => void
}

export default function CodePlaygroundTask({ payload }: TaskProps) {
  return (
    <div className="border-foreground/10 flex flex-1 items-center justify-center border border-dashed font-sans text-xs opacity-30">
      [CODE PLAYGROUND] — wkrótce
      {payload?.title && `: ${payload.title}`}
    </div>
  )
}
