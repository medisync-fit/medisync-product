import fs from 'node:fs'
import path from 'node:path'

type EmailTemplateInput = {
  mode: 'b2c' | 'b2b'
  reference: string
  form: Record<string, unknown>
}

let cachedLogoSvg = ''

function getInlineLogoSvg(): string {
  if (cachedLogoSvg) return cachedLogoSvg

  const logoPath = path.join(process.cwd(), 'public', 'logo.svg')
  const rawSvg = fs.readFileSync(logoPath, 'utf8')

  // Strip XML declaration/comments because inline HTML email content doesn't need them.
  cachedLogoSvg = rawSvg
    .replace(/<\?xml[^>]*>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim()

  return cachedLogoSvg
}

function formatDetails(form: Record<string, unknown>): string {
  return Object.entries(form)
    .map(([key, value]) => {
      const displayKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim()
      return `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${displayKey}</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${String(value ?? '—')}</td></tr>`
    })
    .join('')
}

export function getTeamEmailTemplate({ mode, reference, form }: EmailTemplateInput): string {
  const details = formatDetails(form)
  const modeName = mode === 'b2c' ? 'Individual/Family' : 'Care Facility'
  const logoSvg = getInlineLogoSvg()

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; }
    .header { background: linear-gradient(135deg, #1a2e4a 0%, #2d4563 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .logo-wrap { width: 46px; margin: 0 auto 14px; }
    .logo-wrap svg { width: 46px; height: auto; display: block; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
    .badge { display: inline-block; background: #72a8e8; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 20px; }
    .section { margin-bottom: 25px; }
    .section h2 { font-size: 16px; color: #1a2e4a; margin-top: 0; margin-bottom: 12px; border-bottom: 2px solid #72a8e8; padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px; border-bottom: 1px solid #eee; }
    .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; margin-top: 20px; }
    .reference { background: #f0f5ff; padding: 12px; border-left: 4px solid #72a8e8; font-family: monospace; margin-bottom: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-wrap">${logoSvg}</div>
      <h1>New Preorder Received</h1>
    </div>
    <div class="content">
      <div class="badge">${modeName}</div>
      
      <div class="section">
        <h2>Preorder Details</h2>
        <div class="reference">
          <strong>Reference #:</strong> ${reference}
        </div>
      </div>

      <div class="section">
        <h2>Customer Information</h2>
        <table>
          ${details}
        </table>
      </div>

      <div class="section">
        <p style="color: #666; font-size: 14px;">
          A new preorder has been submitted via the MediSync website. Please review the details above and follow up with the customer accordingly.
        </p>
      </div>
    </div>
    <div class="footer">
      <p>MediSync Early Access Platform | ${new Date().toLocaleDateString()}</p>
    </div>
  </div>
</body>
</html>
  `
}

export function getCustomerEmailTemplate({ mode, reference, form }: EmailTemplateInput): string {
  const customerName = mode === 'b2c'
    ? `${form.firstName || ''} ${form.lastName || ''}`.trim()
    : form.facilityName || 'Valued Customer'
  const logoSvg = getInlineLogoSvg()

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; }
    .header { background: linear-gradient(135deg, #1a2e4a 0%, #2d4563 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .logo-wrap { width: 54px; margin: 0 auto 18px; }
    .logo-wrap svg { width: 54px; height: auto; display: block; }
    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
    .header p { color: #72a8e8; margin: 8px 0 0 0; }
    .content { background: white; padding: 40px 30px; border-radius: 0 0 8px 8px; }
    .greeting { font-size: 16px; margin-bottom: 20px; }
    .reference-box { background: linear-gradient(135deg, #f0f5ff 0%, #e8f0ff 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #72a8e8; margin: 25px 0; }
    .reference-box .label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
    .reference-box .number { font-size: 24px; font-weight: bold; color: #1a2e4a; font-family: monospace; margin-top: 8px; }
    .benefits { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0; }
    .benefits h3 { color: #1a2e4a; font-size: 14px; margin-top: 0; }
    .benefits ul { list-style: none; padding: 0; margin: 0; }
    .benefits li { padding: 8px 0; padding-left: 28px; position: relative; font-size: 14px; }
    .benefits li:before { content: "✓"; position: absolute; left: 0; color: #72a8e8; font-weight: bold; }
    .divider { border-top: 1px solid #eee; margin: 25px 0; }
    .next-steps { background: #f9f9f9; padding: 20px; border-radius: 8px; }
    .next-steps h3 { color: #1a2e4a; font-size: 14px; margin-top: 0; }
    .next-steps p { font-size: 14px; color: #666; margin: 10px 0; }
    .cta-button { display: inline-block; background: #72a8e8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px; }
    .footer { background: #f9f9f9; padding: 30px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; margin-top: 20px; }
    .footer p { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-wrap">${logoSvg}</div>
      <h1>You're In! 🎉</h1>
      <p>Your preorder is confirmed</p>
    </div>
    <div class="content">
      <div class="greeting">
        <p>Hi ${customerName},</p>
        <p>Thank you for your preorder! We're thrilled to have you join the MediSync early access program. Your spot is reserved, and we can't wait to bring you a revolutionary health monitoring experience.</p>
      </div>

      <div class="reference-box">
        <div class="label">Your Reference Number</div>
        <div class="number">${reference}</div>
      </div>

      <div class="divider"></div>

      <div class="next-steps">
        <h3>What's Next?</h3>
        <p>Our team will reach out to you shortly with:</p>
        <ul style="list-style: none; padding: 0; margin: 10px 0;">
          <li style="padding: 8px 0;">✓ Confirmation of your details</li>
          <li style="padding: 8px 0;">✓ Details about your preorder and expected delivery</li>
          <li style="padding: 8px 0;">✓ Exclusive early access resources and guides</li>
        </ul>
        <p style="color: #666; font-size: 13px; margin-top: 15px;">We typically respond within 24 hours. Keep an eye on your inbox!</p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="font-size: 14px; color: #666;">Have questions? Reply to this email or visit our website.</p>
      </div>
    </div>
    <div class="footer">
      <div class="logo-wrap" style="width: 36px; margin-bottom: 10px;">${logoSvg}</div>
      <p><strong>MediSync</strong> | Early Access Platform</p>
      <p>Revolutionizing Health Monitoring for Everyone</p>
      <p style="margin-top: 15px; color: #ccc;">© ${new Date().getFullYear()} MediSync. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `
}

