'use client'
import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { FiChevronDown } from 'react-icons/fi'

export function MerchDropdown({ label, items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({ top: rect.top, left: rect.left + rect.width / 2 })
    }
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    updatePosition()
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
  }

  return (
    <div
      ref={buttonRef}
      className="border-foreground/20 relative z-20 flex h-10 items-center border px-2 text-center font-bold"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => {
          updatePosition()
          setIsOpen(!isOpen)
        }}
        className={`flex h-full cursor-pointer items-center gap-1 font-sans uppercase transition-all hover:opacity-80 ${
          isOpen ? 'text-foreground border-foreground/30' : 'border-transparent'
        }`}
      >
        {label}
        <FiChevronDown className={`text-xl transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Portal — poza navbarem, bezpośrednio w body */}
      {isOpen &&
        createPortal(
          <div
            className="fixed z-9999 w-18 -translate-x-1/2 -translate-y-full text-center"
            style={{ top: position.top, left: position.left }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="border-foreground/10 bg-background border">
              <div role="menu">
                {items.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="hover:bg-foreground/5 hover:text-foreground block p-4 font-sans uppercase transition-colors"
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
