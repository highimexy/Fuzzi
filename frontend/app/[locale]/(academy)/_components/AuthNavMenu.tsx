'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiUser } from 'react-icons/fi'

export function AuthNavMenu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null) // Nowy ref, by śledzić kliknięcia wewnątrz portalu
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)

    const checkAuth = () => {
      const token = localStorage.getItem('token')
      setIsLoggedIn(!!token)
    }

    checkAuth()

    window.addEventListener('auth-change', checkAuth)

    return () => {
      window.removeEventListener('auth-change', checkAuth)
    }
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

  // Zamykanie dropdownu kliknięciem poza przycisk I poza portal
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

    // Dodajemy nasłuchiwanie tylko jak menu jest otwarte (optymalizacja)
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setIsOpen(false)
    router.push('/')
  }

  if (!isMounted) return <div className="h-9 w-9" />

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
        className={`border-foreground/20 bg-background hover:bg-foreground/5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-colors ${
          isOpen ? 'border-foreground/50' : ''
        }`}
      >
        <FiUser className="text-foreground text-lg" />
      </button>

      {/* PORTAL: Leci bezpośrednio do body, z-index 9999 chroni przed zablokowaniem */}
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-9999 w-48 -translate-x-1/2"
            style={{ top: position.top, left: position.left }}
          >
            <div className="border-foreground/10 bg-background border">
              <div role="menu" className="flex flex-col">
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-foreground/5 hover:text-foreground block p-4 text-left font-sans text-sm uppercase transition-colors"
                  role="menuitem"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:bg-foreground/5 block w-full p-4 text-left font-sans text-sm text-red-500 uppercase transition-colors"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
