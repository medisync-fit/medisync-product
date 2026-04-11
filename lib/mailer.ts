const nodemailer = require('nodemailer')
import { getTeamEmailTemplate, getCustomerEmailTemplate } from './emailTemplates'

type SendPreorderEmailInput = {
  mode: 'b2c' | 'b2b'
  reference: string
  form: Record<string, unknown>
}

function getTransport() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error('SMTP credentials are missing')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function sendPreorderEmails({ mode, reference, form }: SendPreorderEmailInput) {
  const transport = getTransport()
  const from = 'medisyncfit@gmail.com'
  const notifyTo = 'medisyncfit@gmail.com'
  const customerEmail = String(form.email || '')

  if (!from || !notifyTo || !customerEmail) {
    throw new Error('Email sender/receiver details are missing')
  }

  await transport.sendMail({
    from,
    to: notifyTo,
    subject: `[MediSync] New ${mode === 'b2c' ? 'Individual' : 'Facility'} Preorder – ${reference}`,
    html: getTeamEmailTemplate({ mode, reference, form }),
  })

  await transport.sendMail({
    from,
    to: customerEmail,
    subject: `Your MediSync preorder is confirmed (${reference})`,
    html: getCustomerEmailTemplate({ mode, reference, form }),
  })
}

