'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

type Mode = 'b2c' | 'b2b'

interface PreorderContextValue {
  isOpen: boolean
  defaultMode: Mode
  openDrawer: (mode?: Mode) => void
  closeDrawer: () => void
}

const PreorderContext = createContext<PreorderContextValue | null>(null)

export function PreorderProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [defaultMode, setDefaultMode] = useState<Mode>('b2c')

  const openDrawer = (mode: Mode = 'b2c') => {
    setDefaultMode(mode)
    setIsOpen(true)
  }

  const closeDrawer = () => setIsOpen(false)

  return (
    <PreorderContext value={{ isOpen, defaultMode, openDrawer, closeDrawer }}>
      {children}
    </PreorderContext>
  )
}

export function usePreorder() {
  const ctx = useContext(PreorderContext)
  if (!ctx) throw new Error('usePreorder must be used inside PreorderProvider')
  return ctx
}
