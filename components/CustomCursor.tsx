'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 })

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  useEffect(() => {
    if (!isDesktop) return

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [role="button"]')) {
        setIsHovering(true)
      }
    }

    const handleOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [role="button"]')) {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', moveCursor)
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)

    document.documentElement.style.cursor = 'none'

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
      document.documentElement.style.cursor = ''
    }
  }, [isDesktop, mouseX, mouseY])

  if (!isDesktop) return null

  return (
    <>
      {/* Dot — follows exactly */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-brand rounded-full pointer-events-none z-[100]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      {/* Ring — follows with spring lag */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[100] border"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          borderColor: isHovering
            ? 'rgba(114,168,232,1)'
            : 'rgba(114,168,232,0.5)',
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}
