"use client"
import { FormEvent, useId, useState } from "react"
import { CheckCircle2, Loader2, Send, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel, FieldSet, FieldLegend } from "@/components/ui/field"
import { InquiryCaptchaField } from "@/components/inquiry-captcha-field"

type Option = { slug: string; name: string; model: string }
type Status = "idle" | "loading" | "success" | "error"

export function RfqForm({ products, defaultProductSlug = "" }: { products: Option[]; defaultProductSlug?: string }) {
  const formId = useId().replace(/:/g, "")
  const [status, setStatus] = useState<Status>("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState("")
  const [captchaSeed, setCaptchaSeed] = useState(0)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget
    setStatus("loading"); setErrors({}); setFormError("")
    const payload = Object.fromEntries(new FormData(form).entries())
    try {
      const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) { setErrors(body.errors || {}); setFormError(body.errors?.form || "Please correct the highlighted fields and try again."); setStatus("error"); setCaptchaSeed((value) => value + 1); return }
      form.reset(); setStatus("success")
    } catch { setFormError("We couldn't reach the server. Please check your connection and try again."); setStatus("error"); setCaptchaSeed((value) => value + 1) }
  }
  if (status === "success") return <div role="status" className="flex flex-col items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-10 text-center"><CheckCircle2 className="size-10 text-primary" /><h2 className="text-xl font-bold text-foreground">Inquiry received</h2><p className="max-w-md text-sm leading-relaxed text-muted-foreground">Our team will review the equipment format, output, and workshop information you supplied, then follow up using your contact details.</p><Button variant="outline" onClick={() => { setStatus("idle"); setCaptchaSeed((value) => value + 1) }}>Submit another inquiry</Button></div>
  const disabled = status === "loading"; const field = (name: string) => errors[name] ? [{ message: errors[name] }] : undefined
  return <form onSubmit={submit} noValidate aria-busy={disabled}><FieldSet><FieldLegend variant="label" className="sr-only">Request for quotation</FieldLegend><FieldGroup>
    {formError ? <p role="alert" className="flex gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"><TriangleAlert className="size-4 shrink-0" />{formError}</p> : null}
    <div className="grid gap-6 sm:grid-cols-2">
      <Field data-invalid={Boolean(errors.company)}><FieldLabel htmlFor={`${formId}-company`}>Company name</FieldLabel><FieldContent><Input id={`${formId}-company`} name="company" required disabled={disabled} autoComplete="organization" /><FieldError errors={field("company")} /></FieldContent></Field>
      <Field data-invalid={Boolean(errors.name)}><FieldLabel htmlFor={`${formId}-name`}>Contact person</FieldLabel><FieldContent><Input id={`${formId}-name`} name="name" required disabled={disabled} autoComplete="name" /><FieldError errors={field("name")} /></FieldContent></Field>
      <Field data-invalid={Boolean(errors.email)}><FieldLabel htmlFor={`${formId}-email`}>Email</FieldLabel><FieldContent><Input id={`${formId}-email`} name="email" type="email" required disabled={disabled} autoComplete="email" /><FieldError errors={field("email")} /></FieldContent></Field>
      <Field data-invalid={Boolean(errors.phone)}><FieldLabel htmlFor={`${formId}-phone`}>Phone / WhatsApp</FieldLabel><FieldContent><Input id={`${formId}-phone`} name="phone" required disabled={disabled} autoComplete="tel" /><FieldError errors={field("phone")} /></FieldContent></Field>
      <Field data-invalid={Boolean(errors.country)}><FieldLabel htmlFor={`${formId}-country`}>Country / region</FieldLabel><FieldContent><Input id={`${formId}-country`} name="country" required disabled={disabled} autoComplete="country-name" /><FieldError errors={field("country")} /></FieldContent></Field>
      <Field><FieldLabel htmlFor={`${formId}-product`}>Target equipment</FieldLabel><FieldContent><select id={`${formId}-product`} name="product" defaultValue={defaultProductSlug} disabled={disabled} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"><option value="">Not sure yet</option>{products.map((product) => <option key={product.slug} value={product.slug}>{product.model} — {product.name}</option>)}</select></FieldContent></Field>
      <Field data-invalid={Boolean(errors.targetOutput)}><FieldLabel htmlFor={`${formId}-output`}>Target output / capacity</FieldLabel><FieldContent><Input id={`${formId}-output`} name="targetOutput" required disabled={disabled} placeholder="Pack format and expected output" /><FieldError errors={field("targetOutput")} /></FieldContent></Field>
      <Field><FieldLabel htmlFor={`${formId}-timeline`}>Project timeline</FieldLabel><FieldContent><Input id={`${formId}-timeline`} name="timeline" disabled={disabled} placeholder="Planned purchase or installation window" /></FieldContent></Field>
    </div>
    <Field><FieldLabel htmlFor={`${formId}-workshop`}>Workshop information</FieldLabel><FieldContent><Textarea id={`${formId}-workshop`} name="workshop" rows={3} disabled={disabled} placeholder="Available floor space, existing upstream/downstream equipment, utilities, or layout constraints." /></FieldContent></Field>
    <Field data-invalid={Boolean(errors.message)}><FieldLabel htmlFor={`${formId}-message`}>Project details</FieldLabel><FieldContent><Textarea id={`${formId}-message`} name="message" required minLength={20} rows={5} disabled={disabled} placeholder="Wipe format, sheet count, pack combination, materials, and any required line interfaces." /><FieldError errors={field("message")} /></FieldContent></Field>
    <InquiryCaptchaField refreshKey={captchaSeed} answerName={`${formId}-captcha-answer`} className="rounded-md border border-border bg-secondary/35 p-4" />{errors.captcha ? <p role="alert" className="text-sm text-destructive">{errors.captcha}</p> : null}
    <Button type="submit" size="lg" disabled={disabled} className="gap-2 sm:w-fit">{disabled ? <><Loader2 className="size-4 animate-spin" />Submitting</> : <>Submit Request<Send className="size-4" /></>}</Button>
  </FieldGroup></FieldSet></form>
}
