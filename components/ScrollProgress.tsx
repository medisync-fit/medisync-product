'use client'

import { motion, useScroll } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
      className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand to-brand-dark z-[60]"
    />
  )
}
