'use client'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  withBorders?: boolean
}

export function Container({ children, className = '', withBorders = true }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-[calc(100%-2rem)] max-w-360 md:w-[calc(100%-4rem)] lg:w-[calc(100%-8rem)] ${
        withBorders ? 'border-foreground/10 border-x' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
