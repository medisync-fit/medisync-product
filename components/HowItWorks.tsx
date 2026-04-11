'use client'

import { motion } from 'framer-motion'
import { HOW_IT_WORKS } from '@/lib/constants'
import Badge from '@/components/ui/Badge'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Badge>How it works</Badge>
          <h2 className="font-display text-3xl lg:text-4xl font-bold mt-4">
            <span className="bg-gradient-to-r from-white to-brand bg-clip-text text-transparent">
              Up and running in minutes
            </span>
          </h2>
          <p className="text-text-secondary text-lg mt-4 max-w-2xl mx-auto">
            Three simple steps to better health management.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Dashed connector line (desktop only) */}
          <div className="absolute hidden md:block top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px border-t-2 border-dashed border-brand/20" />

          {HOW_IT_WORKS.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center md:text-left relative"
            >
              <span
                className="font-display text-7xl font-bold leading-none block mb-4"
                style={{
                  WebkitTextStroke: '1px rgba(114,168,232,0.4)',
                  color: 'transparent',
                }}
              >
                {item.step}
              </span>
              <h3 className="font-display font-semibold text-white text-xl mb-3">
                {item.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
