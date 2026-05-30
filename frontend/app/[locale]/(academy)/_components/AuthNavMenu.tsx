'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiUser } from 'react-icons/fi'
import { ExperienceBar } from './ExperienceBar'
import { MorphRing } from './MorphRing'
import { useUserStore } from '@/store/userStore'

interface NavMenuItem {
  label: string
  href: string
}

interface AuthNavMenuProps {
  items: NavMenuItem[]
}

export function AuthNavMenu({ items }: AuthNavMenuProps) {
  const isLoggedIn = useUserStore((s) => s.isLoggedIn)
  const logout = useUserStore((s) => s.logout)
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 12,
        left: rect.left + rect.width / 2,
      })
    }
  }

  const toggleMenu = () => {
    if (!isOpen) updatePosition()
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    router.push('/')
  }

  if (!isMounted) return <div className="flex h-9 w-9 items-center justify-center"><MorphRing size="sm" /></div>

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="font-sans font-bold uppercase transition-opacity hover:opacity-80"
      >
        Sign In
      </Link>
    )
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className={`border-foreground/20 bg-background hover:bg-foreground/5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors ${
          isOpen ? 'border-foreground/50' : ''
        }`}
      >
        <FiUser className="text-foreground text-lg" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-9999 w-48 -translate-x-1/2"
            style={{ top: position.top, left: position.left }}
          >
            <div className="border-foreground/10 bg-background border shadow-xl">
              <div role="menu" className="flex flex-col">
                {/* Tutaj używamy przekazanych items */}
                {items.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-foreground/5 block w-full p-4 text-left font-sans text-sm uppercase transition-colors"
                    role="menuitem"
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="hover:bg-foreground/5 border-foreground/5 block w-full border-t p-4 text-left font-sans text-sm text-error uppercase transition-colors"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      <ExperienceBar />
    </>
  )
}
