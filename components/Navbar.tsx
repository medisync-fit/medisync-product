'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'
import PreorderButton from '@/components/PreorderButton'
import Logo from '@/components/Logo'

export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    let lastY = 0
    const handleScroll = () => {
      const y = window.scrollY
      setHidden(y > lastY && y > 80)
      setScrolled(y > 50)
      lastY = y
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace('#', ''))
    const observers: IntersectionObserver[] = []

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(`#${id}`)
        },
        { rootMargin: '-40% 0px -55% 0px' },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault()
    setIsOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 z-50 w-full bg-navy-900/80 backdrop-blur-md border-b border-brand/10 ${
        scrolled ? 'shadow-lg shadow-navy-900/50' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with pulse on load */}
          <motion.a
            href="#"
            className="flex items-center gap-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'backOut' }}
          >
            <Logo />
          </motion.a>

          {/* Desktop links with staggered reveal + active highlight */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className={`relative text-sm transition-colors py-1 ${
                  activeSection === link.href
                    ? 'text-brand'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                {link.label}
                {activeSection === link.href && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -bottom-0.5 left-0 right-0 h-px bg-brand"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.a>
            ))}

          </div>
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="flex items-center gap-2"
          >
            {/*<span className="bg-accent-green/20 text-accent-green text-[10px] font-bold px-2 py-0.5 rounded-full">*/}
            {/*  EARLY ACCESS*/}
            {/*</span>*/}
            <PreorderButton variant="filled" size="sm">
              Preorder Now
            </PreorderButton>
          </motion.div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-text-secondary hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-navy-800 border-b border-brand/10"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-sm transition-colors py-2 ${
                    activeSection === link.href
                      ? 'text-brand'
                      : 'text-text-secondary hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <PreorderButton variant="filled" size="sm">
                Preorder Now
              </PreorderButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
