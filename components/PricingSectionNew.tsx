'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

type PricingCard = {
  name: string
  price: string
  cadence: string
  description: string
  features: string[]
  highlighted?: boolean
}

const NEW_B2C_PRICING: PricingCard[] = [
  {
    name: 'Free Package',
    price: 'Rs.0',
    cadence: 'free',
    description: 'Mobile app for medication reminders without family sharing.',
    features: [
      'Medication reminders in mobile app',
      'No family sharing in free package',
      'Optional Fit Band one-time purchase (Rs.3500)',
    ],
    highlighted: true,
  },
  {
    name: 'Group & Pair Watch',
    price: 'Rs.1500',
    cadence: 'monthly',
    description: 'Pair watch and group access for connected monitoring.',
    features: [
      'Pair watch with account',
      'Group monitoring support',
      'Rs.1500 billed monthly',
    ],
  },
  {
    name: 'Fit Band (One-Time)',
    price: 'Rs.3500',
    cadence: 'one-time',
    description: 'One-time purchase for the MediSync fit band hardware.',
    features: [
      'Single upfront payment',
      'Works with medication reminder app',
      'No recurring hardware fee',
    ],
  },
  {
    name: 'Bulky Hardware Devices',
    price: 'Rs.3000 - Rs.3200',
    cadence: 'B2C range',
    description: 'Alternative B2C device options based on selected model.',
    features: [
      'B2C hardware device range',
      'Pricing depends on device model',
      'Great for larger physical form factors',
    ],
  },
]

export default function PricingSectionNew() {
  return (
    <section id="pricing" className="py-20 lg:py-32 px-10">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Badge>New Pricing</Badge>
          <h2 className="font-display text-3xl lg:text-4xl font-bold mt-4">
            <span className="bg-linear-to-r from-white to-brand bg-clip-text text-transparent">
              Unlock the Full Power of Your Health
            </span>
          </h2>
          <p className="text-text-secondary text-lg mt-4 max-w-3xl mx-auto">
            Same MediSync experience with updated packages for app, fit band, and
            watch pairing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-12">
          {NEW_B2C_PRICING.map((card, index) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
                delay: index * 0.12,
              }}
              className={`bg-navy-700 rounded-2xl p-8 relative ${
                card.highlighted ? 'border-2 border-brand' : 'border border-brand/10'
              }`}
            >
              {card.highlighted && (
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(114,168,232,0.1)',
                      '0 0 40px rgba(114,168,232,0.25)',
                      '0 0 20px rgba(114,168,232,0.1)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                />
              )}

              {card.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand text-navy-900 text-xs font-bold px-5 py-1 rounded-full whitespace-nowrap">
                  Most popular
                </div>
              )}

              <h3 className="font-display font-bold text-white text-xl mb-1">{card.name}</h3>
              <p className="text-text-secondary text-sm mb-6">{card.description}</p>

              <div className="h-20">
                <span className="text-3xl font-display font-bold text-white">{card.price}</span>
                <div className="text-text-secondary text-sm mt-1">{card.cadence}</div>
              </div>

              <div className="mt-6">
                <Button variant={card.highlighted ? 'filled' : 'outline'} className="w-full">
                  Choose {card.name}
                </Button>
              </div>

              <div className="border-t border-brand/10 my-6" />

              <FeatureList features={card.features} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <div className="space-y-3">
      {features.map((feature) => (
        <div key={feature} className="flex items-center gap-3">
          <CheckCircle2 size={16} className="text-accent-green shrink-0" />
          <span className="text-sm text-text-secondary">{feature}</span>
        </div>
      ))}
    </div>
  )
}
