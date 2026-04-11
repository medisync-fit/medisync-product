'use client'

import { useEffect, useRef } from 'react'
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  animate,
} from 'framer-motion'
import { Pill, Clock } from 'lucide-react'
import { TRUST_STATS } from '@/lib/constants'
import Button from '@/components/ui/Button'
import PreorderButton from '@/components/PreorderButton'

const WORDS = ['Your', 'health,', 'always', 'on', 'time.']

function AnimatedCounter({
  target,
  suffix,
  decimals = 0,
}: {
  target: number
  suffix: string
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const value = useMotionValue(0)
  const springVal = useSpring(value, { stiffness: 50, damping: 20 })

  useEffect(() => {
    if (isInView) {
      animate(value, target, { duration: 2, ease: 'easeOut' })
    }
  }, [isInView, target, value])

  useEffect(() => {
    const unsubscribe = springVal.on('change', (latest) => {
      if (ref.current) {
        if (decimals > 0) {
          ref.current.textContent = latest.toFixed(decimals) + suffix
        } else {
          ref.current.textContent =
            Math.round(latest).toLocaleString() + suffix
        }
      }
    })
    return unsubscribe
  }, [springVal, suffix, decimals])

  return <span ref={ref}>0{suffix}</span>
}

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
      {/* Background layers */}
      <div className="absolute inset-0 bg-navy-900 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(114,168,232,0.18) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(rgba(114,168,232,0.15) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Aurora blobs */}
      <motion.div
        animate={{ x: [0, 200, 0], y: [0, 100, 0] }}
        transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-brand/10 blur-[150px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -180, 0], y: [0, 120, 0] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/[0.08] blur-[150px] pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse-dot" />
              <span className="text-sm text-text-secondary">
                Now available on iOS &amp; Android
              </span>
            </div>

            {/* H1 with staggered word reveal + shimmer */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] relative">
              <span className="bg-gradient-to-r from-white to-brand bg-clip-text text-transparent">
                {WORDS.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: 'easeOut' }}
                    className="inline-block mr-[0.25em]"
                  >
                    {word === 'health,' ? (
                      <>
                        {word}
                        <br className="hidden lg:block" />
                      </>
                    ) : (
                      word
                    )}
                  </motion.span>
                ))}
              </span>
              {/* Shimmer overlay */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-clip-text pointer-events-none"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
                style={{ backgroundSize: '50% 100%' }}
                aria-hidden
              />
            </h1>

            {/* Subheading */}
            <p className="text-text-secondary text-lg max-w-md mt-6">
              Intelligent medication reminders and real-time fall detection,
              unified in one app built for you and your family.
            </p>

            {/* CTA row */}
            <div className="flex gap-4 mt-8 flex-wrap">
              <Button variant="filled" size="lg" href="#download">
                Download the App
              </Button>
              <Button variant="ghost" size="lg" href="#how-it-works">
                See how it works
              </Button>
              <PreorderButton variant="outline" size="lg">
                Preorder &amp; Save 30%
              </PreorderButton>
            </div>
            <p className="text-accent-green text-xs mt-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse-dot" />
              Limited early-bird pricing — only 200 spots left
            </p>

            {/* Trust stats with counter animation */}
            {/*<div className="flex gap-6 mt-10 flex-wrap items-center">*/}
            {/*  {TRUST_STATS.map((stat, i) => {*/}
            {/*    let counterEl: React.ReactNode*/}
            {/*    if (stat.value === '50,000+') {*/}
            {/*      counterEl = <AnimatedCounter target={50000} suffix="+" />*/}
            {/*    } else if (stat.value === '99.2%') {*/}
            {/*      counterEl = <AnimatedCounter target={99.2} suffix="%" decimals={1} />*/}
            {/*    } else if (stat.value === '4.8★') {*/}
            {/*      counterEl = <AnimatedCounter target={4.8} suffix="★" decimals={1} />*/}
            {/*    } else {*/}
            {/*      counterEl = stat.value*/}
            {/*    }*/}

            {/*    return (*/}
            {/*      <div key={stat.label} className="flex items-center gap-6">*/}
            {/*        <div className="flex flex-col">*/}
            {/*          <span className="text-brand font-display font-bold text-xl">*/}
            {/*            {counterEl}*/}
            {/*          </span>*/}
            {/*          <span className="text-text-secondary text-xs">*/}
            {/*            {stat.label}*/}
            {/*          </span>*/}
            {/*        </div>*/}
            {/*        {i < TRUST_STATS.length - 1 && (*/}
            {/*          <div className="hidden sm:block w-px h-8 bg-brand/20" />*/}
            {/*        )}*/}
            {/*      </div>*/}
            {/*    )*/}
            {/*  })}*/}
            {/*</div>*/}
          </motion.div>

          {/* Right column — phone mockup */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-56 h-[440px] md:w-64 md:h-[500px] mx-auto relative bg-navy-700 rounded-[2.5rem] border border-brand/20 shadow-[0_0_60px_rgba(114,168,232,0.1)]">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-navy-900 rounded-b-2xl" />

              {/* Screen */}
              <div className="absolute inset-2 rounded-[2rem] bg-navy-900 overflow-hidden p-4 pt-8">
                {/* Status bar */}
                <div className="flex justify-between text-[10px] text-text-secondary mb-4">
                  <span>9:41 AM</span>
                  <span>●●●●</span>
                </div>

                {/* Medication card */}
                <div className="bg-navy-700 rounded-2xl p-4 border border-brand/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center text-brand">
                      <Pill size={16} />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">
                        Metformin 500mg
                      </div>
                      <div className="text-text-secondary text-xs">
                        Before breakfast
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Clock size={12} className="text-brand" />
                    <span className="text-xs text-text-secondary">8:00 AM</span>
                    <span className="bg-accent-green/20 text-accent-green text-[10px] px-2 py-0.5 rounded-full">
                      In 5 min
                    </span>
                  </div>

                  <div className="mt-4 w-full bg-brand text-navy-900 text-xs font-semibold py-2.5 rounded-xl text-center">
                    ✓ Confirm Taken
                  </div>
                </div>

                {/* Second card (peeking) */}
                <div className="bg-navy-600/50 rounded-2xl p-3 mt-3 border border-white/5">
                  <span className="text-xs text-text-secondary">
                    Lisinopril 10mg · 12:00 PM
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
