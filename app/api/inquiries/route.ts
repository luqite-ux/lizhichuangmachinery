import { createSupabaseCaptchaContextFromEnv, verifyCaptchaSubmission } from "@/lib/inquiry-captcha"
import { createAdminClient } from "@/lib/supabase/server"
export const dynamic = "force-dynamic"
const headers = { "Cache-Control": "no-store, max-age=0" }
const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : ""
export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  if (!body) return Response.json({ errors: { form: "Invalid request body." } }, { status: 400, headers })
  const secret = process.env.CAPTCHA_SECRET?.trim(), siteScope = process.env.CAPTCHA_SITE_SCOPE?.trim()
  if (!secret || !siteScope) return Response.json({ errors: { captcha: "Verification service is temporarily unavailable." } }, { status: 503, headers })
  try {
    const captcha = await verifyCaptchaSubmission({ secret, ...createSupabaseCaptchaContextFromEnv(), siteScope, scope: text(body.captchaScope, 160), token: text(body.captchaToken, 4096), answer: text(body.captchaAnswer, 16) })
    if (!captcha.ok) return Response.json({ errors: { captcha: "The verification code is incorrect or expired. Please try again." } }, { status: 400, headers })
  } catch { return Response.json({ errors: { captcha: "Verification service is temporarily unavailable." } }, { status: 503, headers }) }
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim() || ""
  const name = text(body.name, 200), company = text(body.company, 200), email = text(body.email, 320), phone = text(body.phone, 80), country = text(body.country, 120), product = text(body.product, 200), targetOutput = text(body.targetOutput, 500), timeline = text(body.timeline, 500), workshop = text(body.workshop, 4000), buyerMessage = text(body.message, 6000)
  const errors: Record<string, string> = {}
  if (!name) errors.name = "Contact name is required."; if (!company) errors.company = "Company name is required."; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "A valid email is required."; if (!phone) errors.phone = "Phone or WhatsApp is required."; if (!country) errors.country = "Country or region is required."; if (!targetOutput) errors.targetOutput = "Target output or capacity is required."; if (buyerMessage.length < 20) errors.message = "Please provide at least 20 characters about the project."; if (!tenantId) errors.form = "Site configuration is incomplete."
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 400, headers })
  const message = [`Country / region: ${country}`, `Target equipment: ${product || "Not specified"}`, `Target output / capacity: ${targetOutput}`, timeline ? `Project timeline: ${timeline}` : "", workshop ? `Workshop information: ${workshop}` : "", `Project details: ${buyerMessage}`].filter(Boolean).join("\n\n")
  const { error } = await createAdminClient().from("inquiries").insert({ tenant_id: tenantId, name, company, email, phone, subject: product ? `Equipment RFQ: ${product}` : "Wet wipes equipment RFQ", message })
  if (error) return Response.json({ errors: { form: "Submission failed. Please try again." } }, { status: 503, headers })
  return Response.json({ ok: true }, { status: 201, headers })
}
