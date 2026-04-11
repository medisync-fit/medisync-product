'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'

const FALL_FEATURES = [
  'Wearable ESP32 C3 SuperMini with MPU6050 motion sensor',
  'Instant push notification to all connected family members',
  'Continuous vibration alert for caregivers until acknowledged',
  'One-tap confirmation stops the alert and logs the event',
]

export default function FallDetectionSpotlight() {
  return (
    <section id="family" className="bg-navy-800 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge>IoT Powered · ESP32 C3 + MPU6050</Badge>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mt-4">
              Real-time fall detection.
              <br />
              Peace of mind for every family.
            </h2>
            <div className="mt-8 space-y-4">
              {FALL_FEATURES.map((feat) => (
                <div key={feat} className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-accent-green flex-shrink-0 mt-0.5"
                  />
                  <span className="text-text-secondary text-sm">{feat}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right side — wearable illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative w-48 h-48 flex items-center justify-center bg-navy-700 rounded-3xl border border-brand/30">
              {/* Pulsing rings */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                className="absolute inset-0 rounded-3xl border border-brand/30"
              />
              <motion.div
                animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 rounded-3xl border border-brand/30"
              />

              {/* Inner screen */}
              <div className="w-28 h-16 bg-navy-900 rounded-xl relative z-10 flex items-center justify-center gap-1.5">
                <motion.div
                  animate={{ scaleY: [0.3, 1, 0.5, 0.8, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="w-1 h-8 bg-brand/60 rounded-full origin-bottom"
                />
                <motion.div
                  animate={{ scaleY: [0.5, 0.3, 1, 0.4, 0.5] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="w-1 h-8 bg-brand/60 rounded-full origin-bottom"
                />
                <motion.div
                  animate={{ scaleY: [0.8, 0.5, 0.3, 1, 0.8] }}
                  transition={{ duration: 1.1, repeat: Infinity }}
                  className="w-1 h-8 bg-brand/60 rounded-full origin-bottom"
                />
              </div>

              {/* Status dot */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.6, 1],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-3 right-3 z-20 w-3 h-3 rounded-full bg-accent-green"
              />
            </div>

            <span className="text-sm text-text-secondary font-medium">
              MediSync Band
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-green" />
              <span className="text-xs text-accent-green">
                Active · Monitoring
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
