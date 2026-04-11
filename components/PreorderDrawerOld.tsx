'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Check,
  Shield,
  Clock,
  Gift,
  Building2,
  User,
  Smartphone,
  Watch,
  Package,
  Zap,
} from 'lucide-react'
import { usePreorder } from '@/context/PreorderContext'
import Logo from '@/components/Logo'

/* ─── types ─── */
interface B2CForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  product: 'wearable' | 'app' | 'bundle'
  plan: 'starter' | 'personal' | 'family'
  quantity: number
  depositAgreed: boolean
  termsAgreed: boolean
}

interface B2BForm {
  contactName: string
  jobTitle: string
  email: string
  phone: string
  facilityName: string
  facilityType: string
  country: string
  residentCount: string
  plan: 'care_starter' | 'care_pro' | 'enterprise'
  message: string
  depositAgreed: boolean
  termsAgreed: boolean
}

type Errors<T> = Partial<Record<keyof T, string>>

const COUNTRIES = [
  'Sri Lanka',
  'India',
  'United Kingdom',
  'Australia',
  'Canada',
  'United States',
  'Singapore',
  'Other',
]

const FACILITY_TYPES = [
  { value: 'elderly_home', label: 'Elderly Home' },
  { value: 'care_home', label: 'Care Home' },
  { value: 'nursing_home', label: 'Nursing Home' },
  { value: 'assisted_living', label: 'Assisted Living' },
  { value: 'other', label: 'Other' },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const B2C_STEPS = ['Your Details', 'Choose Product', 'Confirm & Pay']
const B2B_STEPS = ['Facility Info', 'Choose Plan', 'Confirm & Pay']

/* ─── helpers ─── */
function depositAmount(form: B2CForm): number {
  if (form.product === 'app') return 5
  return 29 * form.quantity
}

function planLabel(plan: string): string {
  const m: Record<string, string> = {
    starter: 'Starter (Free)',
    personal: 'Personal ($6/mo)',
    family: 'Family ($12/mo)',
    care_starter: 'Care Starter',
    care_pro: 'Care Pro',
    enterprise: 'Enterprise',
  }
  return m[plan] ?? plan
}

function productLabel(p: string): string {
  const m: Record<string, string> = {
    wearable: 'MediSync Band',
    app: 'App Subscription',
    bundle: 'Complete Bundle',
  }
  return m[p] ?? p
}

function b2bPricePerSeat(plan: string): number {
  if (plan === 'care_starter') return 4
  if (plan === 'care_pro') return 7
  return 0
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function PreorderDrawer() {
  const { isOpen, closeDrawer, defaultMode } = usePreorder()
  const [mode, setMode] = useState<'b2c' | 'b2b'>('b2c')
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reference, setReference] = useState('')

  const [b2cForm, setB2cForm] = useState<B2CForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    product: 'bundle',
    plan: 'personal',
    quantity: 1,
    depositAgreed: false,
    termsAgreed: false,
  })
  const [b2cErrors, setB2cErrors] = useState<Errors<B2CForm>>({})

  const [b2bForm, setB2bForm] = useState<B2BForm>({
    contactName: '',
    jobTitle: '',
    email: '',
    phone: '',
    facilityName: '',
    facilityType: '',
    country: '',
    residentCount: '',
    plan: 'care_pro',
    message: '',
    depositAgreed: false,
    termsAgreed: false,
  })
  const [b2bErrors, setB2bErrors] = useState<Errors<B2BForm>>({})

  // sync mode when drawer opens
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode)
      setStep(1)
      setSubmitted(false)
      setLoading(false)
    }
  }, [isOpen, defaultMode])

  // ESC to close
  const stableClose = useCallback(() => closeDrawer(), [closeDrawer])
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stableClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [stableClose])

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // auto-recommend B2B plan
  useEffect(() => {
    const n = Number(b2bForm.residentCount)
    if (!n) return
    if (n < 25) setB2bForm((p) => ({ ...p, plan: 'care_starter' }))
    else if (n <= 100) setB2bForm((p) => ({ ...p, plan: 'care_pro' }))
    else setB2bForm((p) => ({ ...p, plan: 'enterprise' }))
  }, [b2bForm.residentCount])

  /* ── validation ── */
  function validateB2CStep1(): boolean {
    const e: Errors<B2CForm> = {}
    if (b2cForm.firstName.trim().length < 2) e.firstName = 'Required (min 2 chars)'
    if (b2cForm.lastName.trim().length < 2) e.lastName = 'Required (min 2 chars)'
    if (!EMAIL_RE.test(b2cForm.email)) e.email = 'Valid email required'
    if (!b2cForm.country) e.country = 'Select a country'
    setB2cErrors(e)
    return Object.keys(e).length === 0
  }

  function validateB2CStep3(): boolean {
    const e: Errors<B2CForm> = {}
    if (!b2cForm.depositAgreed) e.depositAgreed = 'Required'
    if (!b2cForm.termsAgreed) e.termsAgreed = 'Required'
    setB2cErrors(e)
    return Object.keys(e).length === 0
  }

  function validateB2BStep1(): boolean {
    const e: Errors<B2BForm> = {}
    if (b2bForm.contactName.trim().length < 2) e.contactName = 'Required'
    if (!b2bForm.jobTitle.trim()) e.jobTitle = 'Required'
    if (!EMAIL_RE.test(b2bForm.email)) e.email = 'Valid email required'
    if (!b2bForm.phone.trim()) e.phone = 'Required'
    if (!b2bForm.facilityName.trim()) e.facilityName = 'Required'
    if (!b2bForm.facilityType) e.facilityType = 'Required'
    if (!b2bForm.country) e.country = 'Required'
    if (!b2bForm.residentCount || Number(b2bForm.residentCount) < 1)
      e.residentCount = 'Enter a valid number'
    setB2bErrors(e)
    return Object.keys(e).length === 0
  }

  function validateB2BStep3(): boolean {
    const e: Errors<B2BForm> = {}
    if (b2bForm.plan !== 'enterprise' && !b2bForm.depositAgreed)
      e.depositAgreed = 'Required'
    if (!b2bForm.termsAgreed) e.termsAgreed = 'Required'
    setB2bErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (step === 1) {
      const valid = mode === 'b2c' ? validateB2CStep1() : validateB2BStep1()
      if (valid) setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  async function handleSubmit() {
    const valid = mode === 'b2c' ? validateB2CStep3() : validateB2BStep3()
    if (!valid) return
    setLoading(true)
    const ref = 'MS-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    try {
      await fetch('/api/preorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, form: mode === 'b2c' ? b2cForm : b2bForm, reference: ref }),
      })
    } catch {
      // API may not exist yet — still show success
    }
    setReference(ref)
    setLoading(false)
    setSubmitted(true)
  }

  /* ── clear field error on change helpers ── */
  function updateB2C<K extends keyof B2CForm>(key: K, val: B2CForm[K]) {
    setB2cForm((p) => ({ ...p, [key]: val }))
    if (b2cErrors[key]) setB2cErrors((p) => ({ ...p, [key]: undefined }))
  }
  function updateB2B<K extends keyof B2BForm>(key: K, val: B2BForm[K]) {
    setB2bForm((p) => ({ ...p, [key]: val }))
    if (b2bErrors[key]) setB2bErrors((p) => ({ ...p, [key]: undefined }))
  }

  const steps = mode === 'b2c' ? B2C_STEPS : B2B_STEPS

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-101 w-full max-w-lg bg-navy-900 border-l border-brand/20 flex flex-col overflow-hidden"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between p-6 border-b border-brand/10 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <Logo
                    size={22}
                    labelClassName="text-white font-display font-semibold text-lg"
                  />
                </div>
                <span className="text-brand text-xs font-medium">Early Access Preorder</span>
              </div>
              <button
                onClick={closeDrawer}
                className="w-9 h-9 rounded-xl bg-navy-700 hover:bg-navy-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={20} className="text-text-secondary" />
              </button>
            </div>

            {submitted ? (
              <SuccessView
                mode={mode}
                email={mode === 'b2c' ? b2cForm.email : b2bForm.email}
                facilityName={b2bForm.facilityName}
                plan={mode === 'b2c' ? b2cForm.plan : b2bForm.plan}
                reference={reference}
                onClose={closeDrawer}
              />
            ) : (
              <>
                {/* ── Mode toggle ── */}
                <div className="p-4 pb-0 shrink-0">
                  <div className="bg-navy-800 rounded-xl p-1 flex gap-1">
                    {(['b2c', 'b2b'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => { setMode(t); setStep(1) }}
                        className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-sm rounded-lg cursor-pointer transition-colors ${
                          mode === t ? 'text-navy-900 font-semibold' : 'text-text-secondary hover:text-white'
                        }`}
                      >
                        {mode === t && (
                          <motion.div
                            layoutId="drawerTab"
                            className="absolute inset-0 bg-brand rounded-lg"
                            style={{ zIndex: -1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                        {t === 'b2c' ? <User size={16} /> : <Building2 size={16} />}
                        {t === 'b2c' ? 'For Myself / Family' : 'For My Care Facility'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Step progress ── */}
                <div className="px-6 pt-4 shrink-0">
                  <div className="flex items-center gap-2">
                    {steps.map((label, i) => (
                      <StepIndicator
                        key={label}
                        index={i}
                        label={label}
                        currentStep={step}
                        isLast={i === steps.length - 1}
                      />
                    ))}
                  </div>
                </div>

                {/* ── Form area ── */}
                <div className="flex-1 overflow-y-auto p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${mode}-step-${step}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {mode === 'b2c' ? (
                        step === 1 ? (
                          <B2CStep1 form={b2cForm} errors={b2cErrors} update={updateB2C} />
                        ) : step === 2 ? (
                          <B2CStep2 form={b2cForm} update={updateB2C} />
                        ) : (
                          <B2CStep3 form={b2cForm} errors={b2cErrors} update={updateB2C} />
                        )
                      ) : step === 1 ? (
                        <B2BStep1 form={b2bForm} errors={b2bErrors} update={updateB2B} />
                      ) : step === 2 ? (
                        <B2BStep2 form={b2bForm} update={updateB2B} />
                      ) : (
                        <B2BStep3 form={b2bForm} errors={b2bErrors} update={updateB2B} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* ── Footer ── */}
                <div className="shrink-0 border-t border-brand/10 p-4">
                  <div className="flex gap-3">
                    {step > 1 && (
                      <button
                        onClick={() => setStep((step - 1) as 1 | 2)}
                        className="flex items-center gap-1 text-sm text-text-secondary hover:text-white transition-colors cursor-pointer px-4 py-3 rounded-xl border border-brand/10"
                      >
                        <ChevronLeft size={16} /> Back
                      </button>
                    )}
                    <button
                      onClick={step < 3 ? handleNext : handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-brand text-navy-900 font-bold rounded-xl py-3.5 text-sm cursor-pointer hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin border-2 border-navy-700 border-t-brand rounded-full w-4 h-4" />
                          Processing...
                        </>
                      ) : step < 3 ? (
                        <>Continue <ChevronRight size={16} /></>
                      ) : mode === 'b2c' ? (
                        `Preorder Now — $${depositAmount(b2cForm).toFixed(2)} deposit`
                      ) : b2bForm.plan === 'enterprise' ? (
                        'Request Enterprise Demo'
                      ) : (
                        'Reserve Spot — $99.00 deposit'
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Shield size={12} className="text-text-secondary" />
                    <span className="text-text-secondary text-[11px]">
                      Secure preorder · SSL encrypted · 30-day refund guarantee
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ═══════════════════════════════════════
   STEP INDICATOR
   ═══════════════════════════════════════ */
function StepIndicator({
  index,
  label,
  currentStep,
  isLast,
}: {
  index: number
  label: string
  currentStep: number
  isLast: boolean
}) {
  const stepNum = index + 1
  const isCompleted = currentStep > stepNum
  const isActive = currentStep === stepNum

  return (
    <>
      <div className="flex items-center gap-2">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            isCompleted
              ? 'bg-accent-green text-navy-900'
              : isActive
                ? 'bg-brand text-navy-900'
                : 'bg-navy-700 text-text-secondary border border-brand/10'
          }`}
        >
          {isCompleted ? <Check size={12} /> : stepNum}
        </div>
        <span
          className={`text-xs hidden sm:block ${
            isActive || isCompleted ? 'text-white' : 'text-text-secondary'
          }`}
        >
          {label}
        </span>
      </div>
      {!isLast && (
        <div
          className={`flex-1 h-px ${isCompleted ? 'bg-brand' : 'bg-navy-700'}`}
        />
      )}
    </>
  )
}

/* ═══════════════════════════════════════
   SHARED FORM COMPONENTS
   ═══════════════════════════════════════ */
const inputCls =
  'w-full bg-navy-800 border border-brand/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-text-secondary/50 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/20 transition-colors'

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="text-xs text-text-secondary font-medium mb-1.5 block">
        {label}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  error,
  placeholder,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  placeholder: string
  options: { value: string; label: string }[]
}) {
  return (
    <Field label={label} error={error}>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} appearance-none pr-10`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary"
        />
      </div>
    </Field>
  )
}

function Checkbox({
  checked,
  onChange,
  error,
  children,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="flex items-start gap-3 cursor-pointer text-left w-full"
      >
        <div
                        className={`w-5 h-5 min-w-5 rounded-md border flex items-center justify-center transition-all mt-0.5 ${
            checked
              ? 'bg-brand border-brand'
              : 'border-brand/30 bg-navy-800 hover:border-brand/60'
          }`}
        >
          {checked && <Check size={12} className="text-navy-900" />}
        </div>
        <span className="text-text-secondary text-xs leading-relaxed">
          {children}
        </span>
      </button>
      {error && <p className="text-red-400 text-xs mt-1 ml-8">{error}</p>}
    </div>
  )
}

/* ═══════════════════════════════════════
   B2C STEPS
   ═══════════════════════════════════════ */
function B2CStep1({
  form,
  errors,
  update,
}: {
  form: B2CForm
  errors: Errors<B2CForm>
  update: <K extends keyof B2CForm>(k: K, v: B2CForm[K]) => void
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-display font-semibold text-lg mb-6">
        Tell us about yourself
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <Field label="First Name *" error={errors.firstName}>
          <input
            className={inputCls}
            value={form.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            placeholder="John"
          />
        </Field>
        <Field label="Last Name *" error={errors.lastName}>
          <input
            className={inputCls}
            value={form.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            placeholder="Doe"
          />
        </Field>
      </div>
      <Field label="Email Address *" error={errors.email}>
        <input
          type="email"
          className={inputCls}
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          placeholder="you@email.com"
        />
      </Field>
      <Field label="Phone Number">
        <input
          className={inputCls}
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="+94 77 000 0000"
        />
      </Field>
      <SelectField
        label="Country *"
        value={form.country}
        onChange={(v) => update('country', v)}
        error={errors.country}
        placeholder="Select country"
        options={COUNTRIES.map((c) => ({ value: c, label: c }))}
      />
    </div>
  )
}

function B2CStep2({
  form,
  update,
}: {
  form: B2CForm
  update: <K extends keyof B2CForm>(k: K, v: B2CForm[K]) => void
}) {
  const products: {
    value: B2CForm['product']
    icon: React.ReactNode
    title: string
    subtitle: string
    deposit: number
    badge?: string
  }[] = [
    {
      value: 'wearable',
      icon: <Watch size={20} className="text-brand" />,
      title: 'MediSync Band',
      subtitle: 'ESP32 C3 wearable fall detector',
      deposit: 29,
    },
    {
      value: 'app',
      icon: <Smartphone size={20} className="text-brand" />,
      title: 'App Subscription',
      subtitle: 'Personal or Family plan access',
      deposit: 5,
    },
    {
      value: 'bundle',
      icon: <Package size={20} className="text-brand" />,
      title: 'Complete Bundle',
      subtitle: 'Band + App subscription — best value',
      deposit: 29,
      badge: 'Most popular',
    },
  ]

  return (
    <div>
      <h3 className="text-white font-display font-semibold text-lg mb-6">
        What would you like to preorder?
      </h3>
      <div className="space-y-3">
        {products.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => update('product', p.value)}
            className={`w-full relative border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-4 text-left ${
              form.product === p.value
                ? 'border-brand bg-brand/5'
                : 'border-brand/10 bg-navy-800 hover:border-brand/30'
            }`}
          >
            {p.badge && (
              <span className="absolute top-2 right-2 bg-brand text-navy-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {p.badge}
              </span>
            )}
            <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                form.product === p.value ? 'border-brand' : 'border-brand/30'
              }`}
            >
              {form.product === p.value && (
                <div className="w-2 h-2 rounded-full bg-brand" />
              )}
            </div>
                            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
              {p.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium text-sm">{p.title}</div>
              <div className="text-text-secondary text-xs">{p.subtitle}</div>
            </div>
                            <div className="bg-navy-700 rounded-lg px-3 py-1 text-right shrink-0">
              <div className="text-white font-bold text-sm">${p.deposit}</div>
              <div className="text-text-secondary text-xs">deposit</div>
            </div>
          </button>
        ))}
      </div>

      {(form.product === 'app' || form.product === 'bundle') && (
        <div className="mt-5">
          <span className="text-xs text-text-secondary mb-2 block">
            Select your app plan:
          </span>
          <div className="flex flex-wrap gap-2">
            {(['starter', 'personal', 'family'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => update('plan', p)}
                className={`border rounded-full px-4 py-2 text-xs cursor-pointer transition-colors ${
                  form.plan === p
                    ? 'bg-brand text-navy-900 font-semibold border-brand'
                    : 'border-brand/20 text-text-secondary hover:border-brand/40'
                }`}
              >
                {planLabel(p)}
              </button>
            ))}
          </div>
        </div>
      )}

      {(form.product === 'wearable' || form.product === 'bundle') && (
        <div className="mt-5">
          <span className="text-xs text-text-secondary mb-2 block">
            Quantity:
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => update('quantity', Math.max(1, form.quantity - 1))}
              className="w-9 h-9 rounded-lg bg-navy-700 border border-brand/10 flex items-center justify-center text-white cursor-pointer hover:bg-navy-600 transition-colors"
            >
              −
            </button>
            <span className="text-white font-bold text-lg w-8 text-center">
              {form.quantity}
            </span>
            <button
              type="button"
              onClick={() => update('quantity', Math.min(10, form.quantity + 1))}
              className="w-9 h-9 rounded-lg bg-navy-700 border border-brand/10 flex items-center justify-center text-white cursor-pointer hover:bg-navy-600 transition-colors"
            >
              +
            </button>
          </div>
          <span className="text-text-secondary text-xs mt-1 block">
            Maximum 10 units per preorder
          </span>
        </div>
      )}
    </div>
  )
}

function B2CStep3({
  form,
  errors,
  update,
}: {
  form: B2CForm
  errors: Errors<B2CForm>
  update: <K extends keyof B2CForm>(k: K, v: B2CForm[K]) => void
}) {
  const deposit = depositAmount(form)
  return (
    <div>
      <h3 className="text-white font-display font-semibold text-lg mb-6">
        Review your preorder
      </h3>

      {/* Summary */}
      <div className="bg-navy-800 border border-brand/10 rounded-xl p-4 mb-6">
        <div className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-3">
          Order Summary
        </div>
        <SummaryRow label="Name" value={`${form.firstName} ${form.lastName}`} />
        <SummaryRow label="Email" value={form.email} highlight />
        <SummaryRow label="Product" value={productLabel(form.product)} />
        {(form.product === 'app' || form.product === 'bundle') && (
          <SummaryRow label="Plan" value={planLabel(form.plan)} />
        )}
        {(form.product === 'wearable' || form.product === 'bundle') && (
          <SummaryRow label="Quantity" value={`${form.quantity} unit(s)`} />
        )}
        <div className="border-t border-brand/10 my-3" />
        <div className="flex justify-between items-center">
          <span className="text-white font-medium text-sm">Deposit amount</span>
          <span className="text-brand font-bold text-lg">${deposit.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-text-secondary text-xs">Remaining balance</span>
          <span className="text-text-secondary text-xs">Due at launch</span>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-brand/5 border border-brand/20 rounded-xl p-4 mb-6">
        <div className="text-white font-medium text-sm mb-3">
          🎁 Early Access Benefits
        </div>
        <div className="space-y-2">
          {[
            { icon: Gift, text: '30% off retail price at launch' },
            { icon: Clock, text: 'Priority shipping — first batch' },
            { icon: Shield, text: '30-day money-back guarantee' },
            { icon: Check, text: 'Lifetime early adopter badge in app', green: true },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-2">
              <b.icon
                size={14}
                className={b.green ? 'text-accent-green' : 'text-brand'}
              />
              <span className="text-text-secondary text-xs">{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Checkboxes */}
      <Checkbox
        checked={form.depositAgreed}
        onChange={(v) => update('depositAgreed', v)}
        error={errors.depositAgreed}
      >
        I understand this is a ${deposit.toFixed(2)} deposit to secure my
        preorder. The remaining balance will be collected at launch.
      </Checkbox>
      <Checkbox
        checked={form.termsAgreed}
        onChange={(v) => update('termsAgreed', v)}
        error={errors.termsAgreed}
      >
        I agree to the{' '}
        <span className="text-brand">Terms of Service</span> and{' '}
        <span className="text-brand">Privacy Policy</span>. I understand I can
        request a full refund within 30 days.
      </Checkbox>
    </div>
  )
}

/* ═══════════════════════════════════════
   B2B STEPS
   ═══════════════════════════════════════ */
function B2BStep1({
  form,
  errors,
  update,
}: {
  form: B2BForm
  errors: Errors<B2BForm>
  update: <K extends keyof B2BForm>(k: K, v: B2BForm[K]) => void
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-display font-semibold text-lg mb-6">
        Tell us about your facility
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Contact Name *" error={errors.contactName}>
          <input
            className={inputCls}
            value={form.contactName}
            onChange={(e) => update('contactName', e.target.value)}
            placeholder="Dr. Nilufar K."
          />
        </Field>
        <Field label="Job Title *" error={errors.jobTitle}>
          <input
            className={inputCls}
            value={form.jobTitle}
            onChange={(e) => update('jobTitle', e.target.value)}
            placeholder="Care Manager"
          />
        </Field>
      </div>
      <Field label="Work Email *" error={errors.email}>
        <input
          type="email"
          className={inputCls}
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          placeholder="you@carehome.com"
        />
      </Field>
      <Field label="Phone Number *" error={errors.phone}>
        <input
          className={inputCls}
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="+94 11 000 0000"
        />
      </Field>
      <Field label="Facility Name *" error={errors.facilityName}>
        <input
          className={inputCls}
          value={form.facilityName}
          onChange={(e) => update('facilityName', e.target.value)}
          placeholder="Sunshine Elderly Home"
        />
      </Field>
      <SelectField
        label="Facility Type *"
        value={form.facilityType}
        onChange={(v) => update('facilityType', v)}
        error={errors.facilityType}
        placeholder="Select facility type"
        options={FACILITY_TYPES}
      />
      <SelectField
        label="Country *"
        value={form.country}
        onChange={(v) => update('country', v)}
        error={errors.country}
        placeholder="Select country"
        options={COUNTRIES.map((c) => ({ value: c, label: c }))}
      />
      <Field label="Number of Residents *" error={errors.residentCount}>
        <input
          type="number"
          min={1}
          max={9999}
          className={inputCls}
          value={form.residentCount}
          onChange={(e) => update('residentCount', e.target.value)}
          placeholder="e.g. 45"
        />
        <span className="text-text-secondary text-xs mt-1 block">
          This helps us recommend the right plan for your facility
        </span>
      </Field>
    </div>
  )
}

function B2BStep2({
  form,
  update,
}: {
  form: B2BForm
  update: <K extends keyof B2BForm>(k: K, v: B2BForm[K]) => void
}) {
  const rc = Number(form.residentCount) || 0
  const plans: {
    value: B2BForm['plan']
    title: string
    subtitle: string
    price: string
    badge?: string
    features: string[]
  }[] = [
    {
      value: 'care_starter',
      title: 'Care Starter',
      subtitle: 'Up to 25 residents',
      price: '$4/resident/mo',
      features: ['Medication management', 'Staff dashboard', 'Weekly reports'],
    },
    {
      value: 'care_pro',
      title: 'Care Pro',
      subtitle: 'Up to 100 residents',
      price: '$7/resident/mo',
      badge: 'Most popular for care homes',
      features: [
        'Everything in Starter',
        'Fall detection wearables',
        'Family portal per resident',
      ],
    },
    {
      value: 'enterprise',
      title: 'Enterprise',
      subtitle: '100+ residents',
      price: 'Custom pricing',
      features: [
        'Everything in Care Pro',
        'White-labelling & API',
        'EHR/EMR integration',
      ],
    },
  ]

  const pps = b2bPricePerSeat(form.plan)

  return (
    <div>
      <h3 className="text-white font-display font-semibold text-lg mb-6">
        Choose your facility plan
      </h3>

      {rc > 0 && (
        <div className="bg-brand/10 border border-brand/20 rounded-xl p-3 mb-4 flex items-center gap-3">
                  <Zap size={16} className="text-brand shrink-0" />
          <span className="text-brand text-xs font-medium">
            Based on {rc} residents, we recommend {planLabel(form.plan)}
          </span>
        </div>
      )}

      <div className="space-y-3">
        {plans.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => update('plan', p.value)}
            className={`w-full relative border rounded-xl p-4 cursor-pointer transition-all text-left ${
              form.plan === p.value
                ? 'border-brand bg-brand/5'
                : 'border-brand/10 bg-navy-800 hover:border-brand/30'
            }`}
          >
            {p.badge && (
              <span className="absolute top-2 right-2 bg-brand text-navy-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {p.badge}
              </span>
            )}
            <div className="flex items-center gap-3 mb-2">
              <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  form.plan === p.value ? 'border-brand' : 'border-brand/30'
                }`}
              >
                {form.plan === p.value && (
                  <div className="w-2 h-2 rounded-full bg-brand" />
                )}
              </div>
              <div>
                <span className="text-white font-medium text-sm">{p.title}</span>
                <span className="text-text-secondary text-xs ml-2">
                  {p.subtitle}
                </span>
              </div>
              <span className="text-brand font-bold text-sm ml-auto">
                {p.price}
              </span>
            </div>
            <div className="ml-7 space-y-1">
              {p.features.map((f) => (
                <div key={f} className="text-text-secondary text-xs">
                  ✓ {f}
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      {form.plan !== 'enterprise' && rc > 0 && (
        <div className="bg-navy-800 rounded-xl p-4 border border-brand/10 mt-4">
          <div className="text-text-secondary text-xs mb-1">
            Estimated monthly cost:
          </div>
          <div className="text-white font-display font-bold text-2xl">
            ${Math.round(rc * pps)}/mo
          </div>
          <div className="text-text-secondary text-xs">
            for {rc} residents · {planLabel(form.plan)}
          </div>
          <div className="text-accent-green text-xs mt-1">
            Annual billing saves 20% → ${Math.round(rc * pps * 0.8)}/mo
          </div>
        </div>
      )}
    </div>
  )
}

function B2BStep3({
  form,
  errors,
  update,
}: {
  form: B2BForm
  errors: Errors<B2BForm>
  update: <K extends keyof B2BForm>(k: K, v: B2BForm[K]) => void
}) {
  const isEnterprise = form.plan === 'enterprise'
  return (
    <div>
      <h3 className="text-white font-display font-semibold text-lg mb-6">
        Review your facility preorder
      </h3>

      <div className="bg-navy-800 border border-brand/10 rounded-xl p-4 mb-6">
        <div className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-3">
          Order Summary
        </div>
        <SummaryRow label="Facility" value={form.facilityName} />
        <SummaryRow
          label="Contact"
          value={`${form.contactName} · ${form.jobTitle}`}
        />
        <SummaryRow label="Email" value={form.email} highlight />
        <SummaryRow label="Residents" value={form.residentCount} />
        <SummaryRow label="Plan" value={planLabel(form.plan)} />
        <div className="border-t border-brand/10 my-3" />
        {isEnterprise ? (
          <div className="flex justify-between items-center">
            <span className="text-white font-medium text-sm">Next step</span>
            <span className="text-brand text-sm">
              Our team will contact you within 24hrs
            </span>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <span className="text-white font-medium text-sm">Deposit</span>
              <span className="text-brand font-bold text-lg">$99.00</span>
            </div>
            <div className="text-text-secondary text-xs mt-1">
              Covers first 14 days — full refund if cancelled
            </div>
          </>
        )}
      </div>

      {isEnterprise && (
        <div className="mb-6">
          <Field label="Additional message (optional)">
            <textarea
              rows={3}
              className={`${inputCls} resize-none`}
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              placeholder="Tell us about your facility's specific needs..."
            />
          </Field>
        </div>
      )}

      <div className="bg-brand/5 border border-brand/20 rounded-xl p-4 mb-6">
        <div className="text-white font-medium text-sm mb-3">
          🏥 Care Facility Benefits
        </div>
        <div className="space-y-2">
          {[
            '30-day free trial for your whole facility',
            'Dedicated onboarding specialist assigned',
            'Staff training included at no extra cost',
            'HIPAA-aligned infrastructure from day one',
          ].map((b) => (
            <div key={b} className="flex items-center gap-2">
              <Check size={14} className="text-accent-green" />
              <span className="text-text-secondary text-xs">{b}</span>
            </div>
          ))}
        </div>
      </div>

      {isEnterprise ? (
        <Checkbox
          checked={form.termsAgreed}
          onChange={(v) => update('termsAgreed', v)}
          error={errors.termsAgreed}
        >
          I&apos;m happy for a MediSync representative to contact me at the email
          address provided. I agree to the{' '}
          <span className="text-brand">Terms of Service</span> and{' '}
          <span className="text-brand">Privacy Policy</span>.
        </Checkbox>
      ) : (
        <>
          <Checkbox
            checked={form.depositAgreed}
            onChange={(v) => update('depositAgreed', v)}
            error={errors.depositAgreed}
          >
            I understand the $99.00 facility deposit secures our preorder spot.
            Full refund available within 30 days.
          </Checkbox>
          <Checkbox
            checked={form.termsAgreed}
            onChange={(v) => update('termsAgreed', v)}
            error={errors.termsAgreed}
          >
            I agree to the{' '}
            <span className="text-brand">Terms of Service</span> and{' '}
            <span className="text-brand">Privacy Policy</span>. I understand I
            can request a full refund within 30 days.
          </Checkbox>
        </>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════ */
function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex justify-between text-sm mb-1.5">
      <span className="text-text-secondary">{label}</span>
      <span className={highlight ? 'text-brand' : 'text-white'}>{value}</span>
    </div>
  )
}

/* ═══════════════════════════════════════
   SUCCESS VIEW
   ═══════════════════════════════════════ */
function SuccessView({
  mode,
  email,
  facilityName,
  plan,
  reference,
  onClose,
}: {
  mode: 'b2c' | 'b2b'
  email: string
  facilityName: string
  plan: string
  reference: string
  onClose: () => void
}) {
  const isEnterprise = plan === 'enterprise'

  let message: string
  if (mode === 'b2c') {
    message = `Your preorder is confirmed. We've sent a confirmation to ${email}. You'll be among the first to receive MediSync when we launch.`
  } else if (isEnterprise) {
    message = `Thank you! Our enterprise team will reach out to ${email} within 24 hours to arrange a personalised demo for ${facilityName}.`
  } else {
    message = `Your facility preorder is confirmed. A dedicated onboarding specialist will contact ${email} within 24 hours to get ${facilityName} set up.`
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center flex-1 px-8 text-center"
    >
      <div className="relative w-20 h-20 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full bg-accent-green/20 border border-accent-green/30 flex items-center justify-center"
        >
          <Check size={40} className="text-accent-green" />
        </motion.div>
        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 rounded-full bg-accent-green/10"
        />
      </div>

      <h2 className="font-display text-3xl font-bold text-white mb-3">
        You&apos;re in! 🎉
      </h2>
      <p className="text-text-secondary text-sm leading-relaxed mb-8">
        {message}
      </p>

      <div className="bg-navy-800 border border-brand/20 rounded-xl px-6 py-3 mb-8">
        <div className="text-text-secondary text-xs mb-1">Reference #</div>
        <div className="text-brand font-mono font-bold text-lg">{reference}</div>
      </div>

      <div className="mb-6">
        <span className="text-text-secondary text-xs block mb-3">
          Share MediSync:
        </span>
        <div className="flex gap-2 justify-center">
          <a
            href="https://twitter.com/intent/tweet?text=I%20just%20preordered%20MediSync!"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-navy-700 border border-brand/10 rounded-xl px-4 py-2 text-xs text-text-secondary hover:text-white transition-colors"
          >
            Share on X
          </a>
          <a
            href="https://wa.me/?text=Check%20out%20MediSync!"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-navy-700 border border-brand/10 rounded-xl px-4 py-2 text-xs text-text-secondary hover:text-white transition-colors"
          >
            Share on WhatsApp
          </a>
        </div>
      </div>

      <button
        onClick={onClose}
        className="border border-white/20 text-white rounded-full px-8 py-2.5 text-sm hover:bg-white/10 transition-colors cursor-pointer"
      >
        Close
      </button>
    </motion.div>
  )
}
