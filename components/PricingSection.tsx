'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, ChevronDown, Building2 } from 'lucide-react'
import {
  PLANS,
  B2B_PLANS,
  B2B_TRUST_POINTS,
  B2B_FAQS,
} from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import PreorderButton from '@/components/PreorderButton'

/* ── Billing toggle (shared between B2C and B2B) ── */
function BillingToggle({
  isAnnual,
  onToggle,
  label,
}: {
  isAnnual: boolean
  onToggle: () => void
  label?: string
}) {
  return (
    <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
      <span
        className={`text-sm ${!isAnnual ? 'text-white font-semibold' : 'text-text-secondary'}`}
      >
        Monthly
      </span>
      <button
        onClick={onToggle}
        className="w-14 h-7 bg-navy-600 rounded-full relative border border-brand/20 cursor-pointer"
        aria-label="Toggle billing period"
      >
        <motion.div
          className="w-5 h-5 rounded-full bg-brand absolute top-1"
          animate={{ x: isAnnual ? 28 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      <span
        className={`text-sm ${isAnnual ? 'text-white font-semibold' : 'text-text-secondary'}`}
      >
        Annual
      </span>
      <span className="bg-accent-green/20 text-accent-green text-xs px-2 py-0.5 rounded-full">
        Save 20%
      </span>
      {label && isAnnual && (
        <span className="text-text-secondary text-xs w-full text-center mt-1">
          {label}
        </span>
      )}
    </div>
  )
}

export default function PricingSection() {
  const [activeTab, setActiveTab] = useState<'b2c' | 'b2b'>('b2c')
  const [isAnnual, setIsAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [residents, setResidents] = useState(25)

  return (
    <section id="pricing" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── 1. Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Badge>Pricing</Badge>
          <h2 className="font-display text-3xl lg:text-4xl font-bold mt-4">
            <span className="bg-gradient-to-r from-white to-brand bg-clip-text text-transparent">
              Simple, honest pricing
            </span>
          </h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-text-secondary text-lg mt-4 max-w-2xl mx-auto"
            >
              {activeTab === 'b2c'
                ? 'For individuals and families managing health at home.'
                : 'For care homes and elderly facilities managing resident health at scale.'}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* ── 2. B2C / B2B Tab Toggle ── */}
        <div className="flex justify-center mt-8">
          <div className="bg-navy-700 border border-brand/10 rounded-full p-1 inline-flex gap-1 relative">
            {(['b2c', 'b2b'] as const).map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative z-10 rounded-full px-6 py-2.5 text-sm cursor-pointer transition-colors ${
                    isActive
                      ? 'text-navy-900 font-semibold'
                      : 'text-text-secondary hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-brand rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                  {tab === 'b2c' ? (
                    'For Individuals'
                  ) : (
                    <span className="flex items-center gap-2">
                      For Care Homes
                      <span className="bg-navy-900/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        B2B
                      </span>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── 3/4. Tab Content ── */}
        <AnimatePresence mode="wait">
          {activeTab === 'b2c' ? (
            <motion.div
              key="b2c"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <B2CContent isAnnual={isAnnual} onToggle={() => setIsAnnual(!isAnnual)} />
            </motion.div>
          ) : (
            <motion.div
              key="b2b"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <B2BContent
                isAnnual={isAnnual}
                onToggle={() => setIsAnnual(!isAnnual)}
                residents={residents}
                setResidents={setResidents}
                openFaq={openFaq}
                setOpenFaq={setOpenFaq}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════
   B2C CONTENT (existing logic, extracted)
   ═══════════════════════════════════════ */
function B2CContent({
  isAnnual,
  onToggle,
}: {
  isAnnual: boolean
  onToggle: () => void
}) {
  return (
    <>
      <BillingToggle isAnnual={isAnnual} onToggle={onToggle} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {PLANS.map((plan, index) => {
          const annualPrice = (plan.monthlyPrice * 0.8).toFixed(2)
          return (
            <motion.div
              key={plan.name}
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
                plan.highlighted
                  ? 'border-2 border-brand'
                  : 'border border-brand/10'
              }`}
            >
              {plan.highlighted && (
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
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand text-navy-900 text-xs font-bold px-5 py-1 rounded-full">
                  Most popular
                </div>
              )}

              <h3 className="font-display font-bold text-white text-xl mb-1">
                {plan.name}
              </h3>
              <p className="text-text-secondary text-sm mb-6">
                {plan.description}
              </p>

              <div className="h-20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isAnnual ? 'annual' : 'monthly'}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    {plan.monthlyPrice === 0 ? (
                      <span className="text-4xl font-display font-bold text-white">
                        Free
                      </span>
                    ) : (
                      <div className="flex flex-col">
                        {isAnnual && (
                          <span className="text-text-secondary text-sm line-through">
                            ${plan.monthlyPrice}/mo
                          </span>
                        )}
                        <div>
                          <span className="text-4xl font-display font-bold text-white">
                            ${isAnnual ? annualPrice : plan.monthlyPrice}
                          </span>
                          <span className="text-text-secondary text-sm font-normal">
                            /mo
                          </span>
                        </div>
                        {isAnnual && (
                          <span className="text-xs text-text-secondary">
                            billed annually
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-6">
                <Button
                  variant={plan.highlighted ? 'filled' : 'outline'}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>

              <div className="border-t border-brand/10 my-6" />

              <FeatureList features={plan.features} notIncluded={plan.notIncluded} />
            </motion.div>
          )
        })}
      </div>

      <p className="text-center mt-8 text-text-secondary text-sm">
        14-day free trial · No credit card required · Cancel anytime
      </p>
    </>
  )
}

/* ═══════════════════════════════════════
   B2B CONTENT
   ═══════════════════════════════════════ */
function B2BContent({
  isAnnual,
  onToggle,
  residents,
  setResidents,
  openFaq,
  setOpenFaq,
}: {
  isAnnual: boolean
  onToggle: () => void
  residents: number
  setResidents: (v: number) => void
  openFaq: number | null
  setOpenFaq: (v: number | null) => void
}) {
  return (
    <>
      <BillingToggle
        isAnnual={isAnnual}
        onToggle={onToggle}
        label="Billed annually per resident"
      />

      {/* ── Resident Calculator ── */}
      <div className="bg-navy-700/50 border border-brand/10 rounded-2xl p-6 mt-10 mb-10">
        <h3 className="font-display font-semibold text-white mb-4">
          Estimate your monthly cost
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-text-secondary text-sm whitespace-nowrap">
            Number of residents:
          </span>
          <input
            type="range"
            min={10}
            max={500}
            step={5}
            value={residents}
            onChange={(e) => setResidents(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: '#72A8E8' }}
          />
          <span className="text-brand font-display font-bold text-2xl whitespace-nowrap">
            {residents} residents
          </span>
        </div>

        {/* Cost estimate mini-cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {/* Care Starter */}
          <div
            className={`bg-navy-800 rounded-xl p-4 text-center border ${
              residents <= 25
                ? 'border-brand/10'
                : 'border-brand/5 opacity-40'
            }`}
          >
            <div className="text-xs text-text-secondary mb-1">Care Starter</div>
            <div className="text-white font-bold text-xl">
              {residents <= 25
                ? `$${Math.round(residents * 4 * (isAnnual ? 0.8 : 1))}/mo`
                : 'Max 25'}
            </div>
            {residents <= 25 && (
              <div className="text-text-secondary text-xs mt-1">
                {residents} × {isAnnual ? '$3.20' : '$4.00'}/resident
              </div>
            )}
          </div>

          {/* Care Pro */}
          <div className="bg-navy-800 rounded-xl p-4 text-center border-2 border-brand">
            <div className="text-xs text-text-secondary mb-1">Care Pro</div>
            <div className="text-white font-bold text-xl">
              ${Math.round(residents * 7 * (isAnnual ? 0.8 : 1))}/mo
            </div>
            <div className="text-text-secondary text-xs mt-1">
              {residents} × {isAnnual ? '$5.60' : '$7.00'}/resident
            </div>
          </div>

          {/* Enterprise */}
          <div className="bg-navy-800 rounded-xl p-4 text-center border border-brand/10">
            <div className="text-xs text-text-secondary mb-1">Enterprise</div>
            <div className="text-brand font-bold text-xl">Custom</div>
            <div className="text-text-secondary text-xs mt-1">
              Contact us for 100+ residents
            </div>
          </div>
        </div>

        <p className="text-text-secondary text-xs text-center mt-3">
          Volume discounts available for 50+ residents. Annual billing saves 20%
          across all plans.
        </p>
      </div>

      {/* ── B2B Plan Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {B2B_PLANS.map((plan, index) => {
          const seatPrice = plan.monthlyPricePerSeat
          const annualSeatPrice = (seatPrice * 0.8).toFixed(2)
          const isEnterprise = seatPrice === 0
          const totalMonthly = isEnterprise
            ? 0
            : Math.round(residents * seatPrice * (isAnnual ? 0.8 : 1))

          return (
            <motion.div
              key={plan.name}
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
                plan.highlighted
                  ? 'border-2 border-brand'
                  : 'border border-brand/10'
              }`}
            >
              {/* Glow pulse on highlighted */}
              {plan.highlighted && (
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

              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand text-navy-900 text-xs font-bold px-5 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              {/* Header */}
              <div className="text-brand text-xs font-medium uppercase tracking-wider mb-1">
                {plan.tagline}
              </div>
              <h3 className="font-display font-bold text-white text-xl">
                {plan.name}
              </h3>
              <p className="text-text-secondary text-sm mb-6 mt-1">
                {plan.description}
              </p>

              {/* Price */}
              <div className="h-28">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isAnnual ? 'annual' : 'monthly'}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    {isEnterprise ? (
                      <div>
                        <span className="text-4xl font-display font-bold text-white">
                          Custom
                        </span>
                        <span className="text-text-secondary text-lg ml-1">
                          pricing
                        </span>
                        <div className="text-xs text-text-secondary mt-1">
                          Starting from {plan.minSeats} residents
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {isAnnual && (
                          <span className="text-text-secondary text-sm line-through">
                            ${seatPrice}/resident/mo
                          </span>
                        )}
                        <div>
                          <span className="text-4xl font-display font-bold text-white">
                            ${isAnnual ? annualSeatPrice : seatPrice}
                          </span>
                          <span className="text-text-secondary text-sm font-normal">
                            /resident/mo
                          </span>
                        </div>
                        <div className="text-xs text-text-secondary mt-1">
                          Minimum {plan.minSeats} residents
                        </div>
                        <div className="bg-brand/10 rounded-lg px-3 py-1.5 mt-3 inline-block">
                          <span className="text-brand text-xs font-medium">
                            ~${totalMonthly}/mo for {residents} residents
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* CTA */}
              <div className="mt-6">
                {isEnterprise ? (
                  <Button
                    variant="ghost"
                    className="w-full"
                    href="mailto:sales@medisync.app?subject=Enterprise Enquiry"
                  >
                    Contact sales →
                  </Button>
                ) : (
                  <Button
                    variant={plan.highlighted ? 'filled' : 'outline'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                )}
              </div>

              <div className="border-t border-brand/10 my-6" />

              <FeatureList features={plan.features} notIncluded={plan.notIncluded} />
            </motion.div>
          )
        })}
      </div>

      {/* ── B2B Trust Bar ── */}
      <div className="bg-navy-800/50 border border-brand/10 rounded-2xl p-6 mt-8">
        <h4 className="text-white font-medium text-sm mb-4">
          Built for professional care environments
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {B2B_TRUST_POINTS.map((point) => (
            <div key={point} className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-accent-green flex-shrink-0" />
              <span className="text-text-secondary text-sm">{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── B2B FAQ Accordion ── */}
      <div className="mt-10">
        <h3 className="font-display font-semibold text-white text-xl mb-6">
          Common questions from care teams
        </h3>
        <div>
          {B2B_FAQS.map((faq, i) => {
            const isOpen = openFaq === i
            return (
              <div key={i} className="border-b border-brand/10 py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="flex justify-between items-center w-full text-left cursor-pointer"
                >
                  <span className="text-white text-sm font-medium pr-4">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown size={18} className="text-text-secondary" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-text-secondary text-sm leading-relaxed pt-3">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Enterprise Contact Callout ── */}
      <div className="bg-gradient-to-r from-navy-700 to-navy-600 border border-brand/20 rounded-2xl p-8 mt-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Building2 size={32} className="text-brand mb-3" />
            <h3 className="font-display font-bold text-white text-xl">
              Managing a large facility or care network?
            </h3>
            <p className="text-text-secondary text-sm mt-2 max-w-lg">
              Get a custom demo, tailored pricing, and dedicated onboarding
              support.
            </p>
            <p className="text-text-secondary text-xs mt-3">
              Trusted by care facilities across:{' '}
              <span className="text-brand">Sri Lanka</span>
              {' · '}
              <span className="text-brand">United Kingdom</span>
              {' · '}
              <span className="text-brand">Australia</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Button
              variant="filled"
              href="mailto:demo@medisync.app?subject=Demo Request"
            >
              Book a demo
            </Button>
            <PreorderButton mode="b2b" variant="outline">
              Preorder for facility
            </PreorderButton>
          </div>
        </div>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════
   Shared feature/not-included list
   ═══════════════════════════════════════ */
function FeatureList({
  features,
  notIncluded,
}: {
  features: string[]
  notIncluded: string[]
}) {
  return (
    <div className="space-y-3">
      {features.map((feat) => (
        <div key={feat} className="flex items-center gap-3">
          <CheckCircle2 size={16} className="text-accent-green flex-shrink-0" />
          <span className="text-sm text-text-secondary">{feat}</span>
        </div>
      ))}
      {notIncluded.map((feat) => (
        <div key={feat} className="flex items-center gap-3">
          <XCircle size={16} className="text-text-secondary/30 flex-shrink-0" />
          <span className="text-sm text-text-secondary/40">{feat}</span>
        </div>
      ))}
    </div>
  )
}
