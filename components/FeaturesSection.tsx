'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import * as Icons from 'lucide-react'
import { FEATURES } from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import type { LucideIcon } from 'lucide-react'

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[number]
  index: number
}) {
  const Icon = Icons[feature.icon as keyof typeof Icons] as LucideIcon
  const cardRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
      className="group bg-navy-700 border border-brand/10 rounded-2xl p-6 hover:border-brand/40 transition-all duration-300"
    >
      <motion.div
        whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.4, type: 'spring' }}
        className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-5 group-hover:bg-brand/20 transition-colors"
      >
        <Icon size={22} className="text-brand" />
      </motion.div>
      <h3 className="font-display font-semibold text-white text-lg mb-2">
        {feature.title}
      </h3>
      <p className="text-text-secondary text-sm leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  )
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Badge>Core features</Badge>
          <h2 className="font-display text-3xl lg:text-4xl font-bold mt-4">
            <span className="bg-gradient-to-r from-white to-brand bg-clip-text text-transparent">
              Everything you need to stay safe
              <br />
              and on schedule
            </span>
          </h2>
          <p className="text-text-secondary text-lg mt-4 max-w-2xl mx-auto">
            A unified platform designed around how healthcare actually works.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
