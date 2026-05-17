'use client'

export function SectionDivider() {
  return (
    <div className="border-foreground/10 relative w-full border-y">
      {/* Kratka na całą szerokość */}
      <div className="relative h-4 w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg,  var(--color-primary) 0px, var(--color-primary) 1px, transparent 1px, transparent 5px),
              repeating-linear-gradient(90deg, var(--color-primary) 0px, var(--color-primary) 1px, transparent 1px, transparent 5px)
            `,
            opacity: 0.12,
          }}
        />
      </div>

      {/* Diamenciki - ten wrapper wymusza identyczną szerokość co Container */}
      <div className="pointer-events-none absolute inset-0 mx-auto w-[calc(100%-2rem)] max-w-360 md:w-[calc(100%-4rem)] lg:w-[calc(100%-8rem)]">
        {/* Górne */}
        <div className="bg-accent absolute top-0 left-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45" />
        <div className="bg-accent absolute top-0 right-0 h-1.5 w-1.5 translate-x-1/2 -translate-y-1/2 rotate-45" />
        {/* Dolne */}
        <div className="bg-accent absolute bottom-0 left-0 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rotate-45" />
        <div className="bg-accent absolute right-0 bottom-0 h-1.5 w-1.5 translate-x-1/2 translate-y-1/2 rotate-45" />
      </div>
    </div>
  )
}
