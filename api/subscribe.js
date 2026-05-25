/**
 * Vercel serverless function — POST /api/subscribe
 * Accepts { email } and sends notifications via Resend.
 * Env vars required: RESEND_API_KEY
 */

const NOTIFY_EMAIL = "kwessman@gmail.com"

// Use the verified Resend shared domain until princeofmulberry.com is verified
// in your Resend workspace (Settings → Domains → Add Domain).
// Once verified, swap this back to: "Prince of Mulberry <noreply@princeofmulberry.com>"
const FROM_ADDRESS = "Prince of Mulberry <onboarding@resend.dev>"

export default async function handler(req, res) {
  // CORS — allow requests from princeofmulberry.com and local dev
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  let email
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body
    email = (body?.email ?? "").trim().toLowerCase()
  } catch {
    return res.status(400).json({ error: "Invalid request body" })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email address" })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Dev fallback — succeed silently so the form works without keys locally
    console.log(`[pmp/subscribe] DEV — would subscribe: ${email}`)
    return res.status(200).json({ ok: true })
  }

  try {
    // 1. Confirmation to subscriber
    await sendEmail(apiKey, {
      from: FROM_ADDRESS,
      to: email,
      subject: "You'll hear from us — Prince of Mulberry Productions",
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 480px; margin: 0 auto;
                    background: #000; color: #e6dfd4; padding: 48px 32px;">
          <p style="font-size: 13px; letter-spacing: 0.25em; text-transform: uppercase;
                    color: #c5a46a; margin-bottom: 32px;">
            Prince of Mulberry Productions
          </p>
          <p style="font-size: 20px; font-weight: 300; line-height: 1.6; margin-bottom: 20px;">
            Thank you for your interest.
          </p>
          <p style="font-size: 14px; color: rgba(230,223,212,0.6); line-height: 1.8; margin-bottom: 32px;">
            We're still in the making. When we're ready to share what we've been
            building, you'll be the first to know.
          </p>
          <p style="font-size: 12px; color: rgba(230,223,212,0.3);">
            — Prince of Mulberry Productions, MMXXVI
          </p>
        </div>
      `,
    })

    // 2. Internal alert
    await sendEmail(apiKey, {
      from: FROM_ADDRESS,
      to: NOTIFY_EMAIL,
      subject: `New PMP subscriber: ${email}`,
      html: `<p style="font-family:sans-serif;">New subscriber on princeofmulberry.com: <strong>${email}</strong></p>`,
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error("[pmp/subscribe] Resend error:", err)
    return res.status(500).json({ error: "Failed to subscribe. Please try again." })
  }
}

async function sendEmail(apiKey, { from, to, subject, html }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Resend ${response.status}: ${text}`)
  }
  return response.json()
}
