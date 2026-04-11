'use client'

import { motion } from 'framer-motion'
import { TESTIMONIALS } from '@/lib/constants'
import Badge from '@/components/ui/Badge'

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Badge>Testimonials</Badge>
          <h2 className="font-display text-3xl lg:text-4xl font-bold mt-4">
            <span className="bg-gradient-to-r from-white to-brand bg-clip-text text-transparent">
              What families are saying
            </span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-navy-700 border border-brand/10 rounded-2xl p-6"
            >
              <span className="font-display text-5xl text-brand/30 leading-none block mb-2">
                &ldquo;
              </span>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand text-sm font-semibold">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">
                    {testimonial.name}
                  </div>
                  <div className="text-text-secondary text-xs">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
