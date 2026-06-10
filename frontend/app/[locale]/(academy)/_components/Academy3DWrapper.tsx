'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import Academy3DLayout from './Academy3DLayout'

export default function Academy3DWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const isLessonRoute = pathname?.match(/\/lesson\/[^/]+/)
  const isLibraryRoute = pathname?.match(/\/lessons$/) // books scene owns its own Canvas

  if (isLessonRoute) {
    return <div className="flex w-full flex-1 flex-col overflow-y-auto">{children}</div>
  }

  if (isLibraryRoute) {
    return <div className="relative flex w-full flex-1">{children}</div>
  }

  return <Academy3DLayout>{children}</Academy3DLayout>
}
