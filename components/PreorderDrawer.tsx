'use client'

import {useCallback, useEffect, useState} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import {Building2, Check, ChevronDown, ChevronRight, User, X,} from 'lucide-react'
import {usePreorder} from '@/context/PreorderContext'
import Logo from '@/components/Logo'

/* ─── types ─── */
interface B2CForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
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

/* ─── helpers ─── */

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function PreorderDrawer() {
  const { isOpen, closeDrawer, defaultMode } = usePreorder()
  const [mode, setMode] = useState<'b2c' | 'b2b'>('b2c')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reference, setReference] = useState('')
  const [submitError, setSubmitError] = useState('')

  const [b2cForm, setB2cForm] = useState<B2CForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
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
  })
  const [b2bErrors, setB2bErrors] = useState<Errors<B2BForm>>({})

  // sync mode when drawer opens
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode)
      setSubmitted(false)
      setLoading(false)
      setSubmitError('')
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

  async function handleSubmit() {
    const valid = mode === 'b2c' ? validateB2CStep1() : validateB2BStep1()
    if (!valid) return
    setLoading(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/preorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({mode, form: mode === 'b2c' ? b2cForm : b2bForm}),
      })
      const data = await res.json()
      if (!res.ok || !data?.success) {
        setSubmitError(data?.error || 'Unable to submit preorder right now.')
        return
      }
      setReference(data.reference)
      setSubmitted(true)
    } catch (error) {
      setSubmitError('Unable to submit preorder right now.')
    } finally {
      setLoading(false)
    }
  }

  function clearForm() {
    setB2cForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
    })
    setB2bForm({
      contactName: '',
      jobTitle: '',
      email: '',
      phone: '',
      facilityName: '',
      facilityType: '',
      country: '',
      residentCount: '',
      plan: 'care_pro',
    })
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-lg bg-navy-900 border-l border-brand/20 flex flex-col overflow-hidden"
          >
            {/* ── Header ── */}
            <div
                className="flex items-center justify-between p-6 border-b border-brand/10 flex-shrink-0 cursor-default">
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
                reference={reference}
                onClose={()=>{
                  clearForm()
                  closeDrawer()
                }}
              />
            ) : (
              <>
                {/* ── Mode toggle ── */}
                <div className="p-4 pb-0 shrink-0 cursor-default">
                  <div className="bg-navy-800 rounded-xl p-1 flex gap-1">
                    {(['b2c', 'b2b'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setMode(t)}
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

                {/* ── Form area ── */}
                <div className="flex-1 overflow-y-auto p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                        key={mode}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {mode === 'b2c' ? (
                          <B2CStep1 form={b2cForm} errors={b2cErrors} update={updateB2C}/>
                      ) : (
                        <B2BStep1 form={b2bForm} errors={b2bErrors} update={updateB2B} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* ── Footer ── */}
                <div className="shrink-0 border-t border-brand/10 p-4">
                  <div className="flex gap-3">
                    <button
                        onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-brand text-navy-900 font-bold rounded-xl py-3.5 text-sm cursor-pointer hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin border-2 border-navy-700 border-t-brand rounded-full w-4 h-4" />
                          Processing...
                        </>
                      ) : (
                          <>
                            Submit Preorder <ChevronRight size={16}/>
                          </>
                      )}
                    </button>
                  </div>
                  {submitError && (
                      <p className="text-red-400 text-xs mt-2 text-center">{submitError}</p>
                  )}
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


/* ═══════════════════════════════════════
   SUCCESS VIEW
   ═══════════════════════════════════════ */
function SuccessView({
  mode,
  email,
  facilityName,
  reference,
  onClose,
}: {
  mode: 'b2c' | 'b2b'
  email: string
  facilityName: string
  reference: string
  onClose: () => void
}) {

  let message: string

  if (mode === 'b2c') {
    message = `Your preorder is confirmed. We've sent a confirmation to ${email}. You'll be among the first to receive MediSync when we launch.`
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
          transition={{type: 'tween', duration: 0.6}}
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
