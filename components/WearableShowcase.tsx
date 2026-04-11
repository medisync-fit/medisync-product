'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Zap, Heart, Wifi, Battery } from 'lucide-react'
import PreorderButton from '@/components/PreorderButton'

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 137.5) % 100,
  y: (i * 97.3) % 100,
  duration: 3 + (i % 5),
  delay: (i * 0.3) % 3,
}))

const SHOWCASE_FEATURES = [
  {
    icon: Zap,
    iconColor: 'text-brand',
    heading: 'Instant fall detection',
    body: 'The ESP32 C3 SuperMini with MPU6050 sensor detects falls in milliseconds and immediately alerts your entire care network.',
  },
  {
    icon: Heart,
    iconColor: 'text-red-400',
    heading: 'Continuous health monitoring',
    body: 'Real-time motion tracking runs 24/7, building a picture of daily activity and flagging anomalies before they become emergencies.',
  },
  {
    icon: Wifi,
    iconColor: 'text-accent-green',
    heading: 'Always connected',
    body: 'Wi-Fi enabled and cloud-synced. Every event is logged, timestamped, and instantly visible to caregivers in the family dashboard.',
  },
  {
    icon: Battery,
    iconColor: 'text-brand',
    heading: 'All-day battery life',
    body: 'Designed to last through the day on a single charge, so the people you care about are always protected.',
  },
]

const SPEC_PILLS = [
  'ESP32 C3 SuperMini',
  'MPU6050 Sensor',
  'Wi-Fi Enabled',
  'Fall Detection AI',
]

const IMAGE_TRANSFORMS = [
  'rotate(-2deg) translateY(-8px) scale(1.02)',
  'rotateY(8deg) translateX(-12px)',
  'rotate(2deg) translateY(4px) scale(0.98)',
  'rotateY(-8deg) translateX(12px)',
]

export default function WearableShowcase() {
  const featureRefs = useRef<(HTMLDivElement | null)[]>([])
  const [revealedSet, setRevealedSet] = useState<Set<number>>(() => new Set())
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  useEffect(() => {
    const els = featureRefs.current.filter(Boolean) as HTMLDivElement[]
    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.index)

          // Once intersecting, mark as revealed (never reset)
          if (entry.isIntersecting) {
            setRevealedSet((prev) => {
              if (prev.has(idx)) return prev
              const next = new Set(prev)
              next.add(idx)
              return next
            })
            setActiveIndex(idx)
          }
        })
      },
      { threshold: 0.4 },
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const imageTransform =
    activeIndex >= 0
      ? IMAGE_TRANSFORMS[activeIndex % IMAGE_TRANSFORMS.length]
      : 'none'

  return (
    <section className="relative bg-navy-900">
      {/* ── Background effects ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -60, 0] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand/20 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-blue-400/10 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 70, 0] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-brand-dark/15 blur-[120px]"
        />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            className="absolute w-1 h-1 rounded-full bg-brand/30"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          />
        ))}
      </div>

      {/* Scan line */}
      <motion.div
        animate={{ y: ['-100%', '200%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent pointer-events-none"
      />

      {/* ── Main content ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Top heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center pt-32 pb-16"
        >
          <h2 className="font-display text-4xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-white via-brand to-brand-dark bg-clip-text text-transparent">
              Meet the MediSync Band
            </span>
          </h2>
          <p className="text-text-secondary text-xl mt-4">
            Engineered for safety. Designed for life.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {SPEC_PILLS.map((spec) => (
              <span
                key={spec}
                className="bg-navy-700 border border-brand/10 rounded-full px-6 py-3 text-sm text-text-secondary"
              >
                {spec}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <PreorderButton variant="filled" size="lg">
              Preorder the MediSync Band
            </PreorderButton>
          </div>
        </motion.div>

        {/* ===== DESKTOP: sticky scroll with observer-driven reveals ===== */}
        <div className="hidden lg:flex gap-16 pb-32">
          {/* Left column — features revealed by IntersectionObserver */}
          <div className="w-1/2 flex flex-col gap-0">
            {SHOWCASE_FEATURES.map((feat, i) => {
              const Icon = feat.icon
              const isRevealed = revealedSet.has(i)
              return (
                <div
                  key={feat.heading}
                  ref={(el) => { featureRefs.current[i] = el }}
                  data-index={i}
                  className="min-h-[70vh] flex items-center"
                >
                  <div
                    className="flex gap-5"
                    style={{
                      opacity: isRevealed ? 1 : 0,
                      transform: isRevealed ? 'translateY(0)' : 'translateY(40px)',
                      transition: `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease`,
                      transitionDelay: `${i * 80}ms`,
                      willChange: 'transform, opacity',
                    }}
                  >
                    <div className="w-1 rounded-full bg-brand flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                          <Icon size={20} className={feat.iconColor} />
                        </div>
                        <h3 className="font-display font-semibold text-white text-2xl">
                          {feat.heading}
                        </h3>
                      </div>
                      <p className="text-text-secondary text-base leading-relaxed max-w-md">
                        {feat.body}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right column — sticky image with per-section 3D transforms */}
          <div className="w-1/2 self-start sticky top-[20vh]" style={{ perspective: '1200px' }}>
            <div
              className="flex justify-center"
              style={{
                transform: imageTransform,
                transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                willChange: 'transform',
              }}
            >
              <WatchDisplay />
            </div>
          </div>
        </div>

        {/* ===== MOBILE: stacked layout ===== */}
        <div className="lg:hidden py-20">
          <div className="flex justify-center mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <WatchDisplay compact />
            </motion.div>
          </div>

          <div className="flex flex-col gap-10">
            {SHOWCASE_FEATURES.map((feat) => {
              const Icon = feat.icon
              return (
                <motion.div
                  key={feat.heading}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex gap-4"
                >
                  <div className="w-1 rounded-full bg-brand flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={20} className={feat.iconColor} />
                      <h3 className="font-display font-semibold text-white text-lg">
                        {feat.heading}
                      </h3>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {feat.body}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Watch display (reused for desktop sticky + mobile) ── */
function WatchDisplay({ compact = false }: { compact?: boolean }) {
  const sizeClass = compact
    ? 'w-64 h-64 md:w-80 md:h-80'
    : 'w-[420px] h-[420px] xl:w-[480px] xl:h-[480px]'

  return (
    <div className={`relative ${sizeClass}`}>
      {/* Rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[-20px] rounded-full border border-dashed border-brand/20"
      >
        {[0, 90, 180, 270].map((deg) => (
          <span
            key={deg}
            className="absolute w-2 h-2 rounded-full bg-brand top-1/2 left-1/2"
            style={{
              transform: `rotate(${deg}deg) translateX(calc(50% + 10px)) translate(-50%, -50%)`,
              transformOrigin: '0 0',
            }}
          />
        ))}
      </motion.div>

      {/* Counter-rotating ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[-10px] rounded-full border border-brand/10"
      />

      {/* Glow halo */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow:
            '0 0 80px rgba(114,168,232,0.2), 0 0 160px rgba(114,168,232,0.1)',
        }}
      />

      {/* Watch image with float */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 60 }}
        whileInView={{ scale: 1, opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-full h-full"
        >
          <Image
            src="/wearable.png"
            alt="MediSync Band wearable device"
            fill
            priority
            quality={95}
            sizes="(max-width: 768px) 320px, (max-width: 1024px) 384px, 480px"
            className="object-contain drop-shadow-2xl relative z-10"
          />
          {/* Shine overlay */}
          <div
            className="absolute inset-0 z-20 pointer-events-none rounded-full"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(114,168,232,0.05) 100%)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Status badges */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
        className="absolute -top-4 -left-4 lg:-left-16 z-30 bg-navy-700/90 backdrop-blur-sm border border-brand/20 rounded-2xl px-4 py-3 flex items-center gap-3"
      >
        <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse-dot" />
        <div>
          <div className="text-white text-xs font-medium">Fall Detection</div>
          <div className="text-accent-green text-xs">Active</div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-1/4 -right-4 lg:-right-20 z-30 bg-navy-700/90 backdrop-blur-sm border border-brand/20 rounded-2xl px-4 py-3 flex items-center gap-3"
      >
        <Battery size={16} className="text-brand" />
        <div>
          <div className="text-white text-xs font-medium">Battery</div>
          <div className="text-brand text-xs font-bold">87%</div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-30 bg-navy-700/90 backdrop-blur-sm border border-brand/20 rounded-2xl px-4 py-3 flex items-center gap-3"
      >
        <Heart size={16} className="text-red-400" />
        <div>
          <div className="text-white text-xs font-medium">Heart Rate</div>
          <div className="text-red-400 text-xs font-bold">72 BPM</div>
        </div>
      </motion.div>
    </div>
  )
}
