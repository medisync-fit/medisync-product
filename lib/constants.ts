export type NavLink = { label: string; href: string }

export const NAV_LINKS: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Family', href: '#family' },
  { label: 'Download', href: '#download' },
]

export type Feature = { icon: string; title: string; description: string }

export const FEATURES: Feature[] = [
  {
    icon: 'ClipboardList',
    title: 'Smart Medication Plans',
    description: 'Group medicines by condition, just like your doctor prescribes.',
  },
  {
    icon: 'Bell',
    title: 'Multi-Stage Reminders',
    description: 'Alerts 15 minutes before, on time, and again if unconfirmed.',
  },
  {
    icon: 'Zap',
    title: 'Real-Time Fall Detection',
    description:
      'Wearable ESP32 sensor detects falls instantly and alerts your family.',
  },
  {
    icon: 'Users',
    title: 'Family Sharing Groups',
    description:
      'Invite caregivers to monitor adherence and receive live fall alerts.',
  },
  {
    icon: 'FileText',
    title: 'Prescription Uploads',
    description:
      'Photograph or upload prescriptions directly linked to each plan.',
  },
  {
    icon: 'BarChart2',
    title: 'Health Dashboard',
    description:
      'Track adherence history, missed doses, and fall events in one place.',
  },
]

export type Plan = {
  name: string
  description: string
  monthlyPrice: number
  features: string[]
  notIncluded: string[]
  cta: string
  highlighted: boolean
}

export const PLANS: Plan[] = [
  {
    name: 'Starter',
    description: 'For individuals getting started',
    monthlyPrice: 0,
    features: ['Up to 3 medications', 'Basic reminders', 'Adherence tracking'],
    notIncluded: ['Family sharing', 'Fall detection', 'Wearable pairing'],
    cta: 'Get started free',
    highlighted: false,
  },
  {
    name: 'Personal',
    description: 'For complete health management',
    monthlyPrice: 6,
    features: [
      'Unlimited medications',
      'Multi-stage reminders',
      'Prescription uploads',
      'Fall detection alerts',
      '1 wearable device',
    ],
    notIncluded: ['Family group sharing'],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Family',
    description: 'For the whole family',
    monthlyPrice: 12,
    features: [
      'Everything in Personal',
      'Up to 6 family members',
      'Shared family dashboard',
      'Caregiver notifications',
      '3 wearable devices',
      'Priority support',
    ],
    notIncluded: [],
    cta: 'Start free trial',
    highlighted: false,
  },
]

export type B2BPlan = {
  name: string
  tagline: string
  monthlyPricePerSeat: number
  minSeats: number
  description: string
  features: string[]
  notIncluded: string[]
  cta: string
  highlighted: boolean
  badge?: string
}

export const B2B_PLANS: B2BPlan[] = [
  {
    name: 'Care Starter',
    tagline: 'Small care homes',
    monthlyPricePerSeat: 4,
    minSeats: 10,
    description:
      'For small elderly homes getting started with digital health management.',
    features: [
      'Up to 25 residents',
      'Medication plan management per resident',
      'Multi-stage reminders per resident',
      'Staff caregiver dashboard',
      'Adherence reports (weekly)',
      'Email support',
      'Onboarding assistance',
    ],
    notIncluded: [
      'Fall detection wearables',
      'Family sharing portal',
      'Custom branding',
      'API access',
    ],
    cta: 'Start 30-day trial',
    highlighted: false,
  },
  {
    name: 'Care Pro',
    tagline: 'Medium care facilities',
    monthlyPricePerSeat: 7,
    minSeats: 25,
    description:
      'Full medication management and fall detection for growing care homes.',
    features: [
      'Up to 100 residents',
      'Everything in Care Starter',
      'Fall detection per resident (wearable)',
      'Family sharing portal per resident',
      'Real-time fall alerts to staff',
      'Adherence reports (daily)',
      'Dedicated account manager',
      'Staff role management (admin/nurse/carer)',
      'Priority support (24/7)',
    ],
    notIncluded: ['Custom branding', 'API access'],
    cta: 'Start 30-day trial',
    highlighted: true,
    badge: 'Most popular',
  },
  {
    name: 'Enterprise',
    tagline: 'Large facilities & chains',
    monthlyPricePerSeat: 0,
    minSeats: 100,
    description:
      'Custom solution for large care networks, hospital groups, and multi-site facilities.',
    features: [
      'Unlimited residents',
      'Everything in Care Pro',
      'Custom branding & white-labelling',
      'REST API & webhook access',
      'EHR / EMR system integration',
      'Multi-site management dashboard',
      'SLA guarantee (99.9% uptime)',
      'On-site training & setup',
      'Dedicated infrastructure',
      'Custom contract & invoicing',
    ],
    notIncluded: [],
    cta: 'Contact sales',
    highlighted: false,
    badge: 'Custom pricing',
  },
]

export const B2B_TRUST_POINTS: string[] = [
  'HIPAA-aligned data handling',
  'ISO 27001 ready infrastructure',
  'Staff role-based access control',
  'Dedicated onboarding for care teams',
  'Volume discounts for 50+ residents',
  '30-day free trial, no credit card',
]

export type B2BFaq = { question: string; answer: string }

export const B2B_FAQS: B2BFaq[] = [
  {
    question: 'How does per-seat pricing work?',
    answer:
      'Each "seat" is one resident in your facility. You pay monthly based on the number of active residents enrolled in MediSync. You can add or remove residents at any time.',
  },
  {
    question: 'Is there a minimum commitment?',
    answer:
      'Care Starter requires a minimum of 10 residents. Care Pro requires 25. Enterprise is fully custom. All plans start with a 30-day free trial.',
  },
  {
    question: 'Can family members access the system?',
    answer:
      'Yes — on Care Pro and Enterprise, each resident has a family sharing portal where relatives can view medication schedules, adherence history, and fall alerts.',
  },
  {
    question: 'Do you support existing care management software?',
    answer:
      'Enterprise plan includes EHR/EMR integration. We currently support HL7 FHIR standard. Contact our sales team to discuss your specific system.',
  },
]

export type Testimonial = {
  quote: string
  name: string
  role: string
  initials: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'MediSync saved my father from missing his heart medication three times last week. The family alerts are a game changer.',
    name: 'Amara S.',
    role: 'Daughter & Caregiver',
    initials: 'AS',
  },
  {
    quote:
      'The fall detection gave our whole family peace of mind. Setup took less than 10 minutes.',
    name: 'Rohan P.',
    role: 'Family Plan user',
    initials: 'RP',
  },
  {
    quote:
      'Finally an app that treats medication management the way doctors actually think about it.',
    name: 'Dr. Nilufar K.',
    role: 'General Practitioner',
    initials: 'NK',
  },
]

export type TrustStat = { value: string; label: string }

export const TRUST_STATS: TrustStat[] = [
  { value: '50,000+', label: 'doses tracked' },
  { value: '99.2%', label: 'reminder delivery' },
  { value: '4.8★', label: 'App Store rating' },
]

export type HowItWorksStep = {
  step: number
  title: string
  description: string
}

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    step: 1,
    title: 'Create your profile',
    description:
      'Sign up in seconds, add your health information and personal preferences.',
  },
  {
    step: 2,
    title: 'Build your medication plans',
    description:
      'Add prescriptions, set schedules, and configure your reminders.',
  },
  {
    step: 3,
    title: 'Stay connected',
    description:
      'Share with family, pair your wearable device, and track everything in real time.',
  },
]
