import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MotionController } from "@/components/motion-controller"
import { absoluteUrl, siteConfig } from "@/lib/site-config"
import "./globals.css"
import { getRequestLocale } from '@/lib/request-locale'
import { localizeMetadata } from '@/lib/localized-metadata'
import { translateText } from '@/lib/localization'
import { LocaleProvider } from '@/components/locale-provider'

const baseMetadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: { default: "Lizhichuang Machinery | Wet Wipes Production & Packaging Equipment", template: "%s | Lizhichuang Machinery" },
  description: "Zhengzhou Lizhichuang Machinery Equipment Co., Ltd. designs, develops, produces, commissions, sells, and services wet wipes production and packaging equipment.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: { type: "website", url: absoluteUrl("/"), title: "Lizhichuang Machinery | Wet Wipes Production & Packaging Equipment", description: "Explore customer-documented wet wipes production, grouped packing, and rewinding equipment.", images: [{ url: "/images/hero-machine-line.jpg" }] },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/images/logo.png", shortcut: "/images/logo.png", apple: "/images/logo.png" },
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#2f4f8f" }

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const metadata = localizeMetadata(baseMetadata, locale)
  if (locale === 'zh') metadata.title = { default: '利之创机械 | 湿巾生产与包装设备', template: '%s | 利之创机械' }
  return metadata
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getRequestLocale()
  const organization = {
    "@context": "https://schema.org", "@type": "Organization", "@id": `${absoluteUrl("/")}#organization`,
    name: translateText(siteConfig.legalName, locale), alternateName: siteConfig.name, url: absoluteUrl("/"),
    logo: absoluteUrl(siteConfig.logo), telephone: siteConfig.phone,
    address: { "@type": "PostalAddress", streetAddress: translateText(siteConfig.address, locale), addressRegion: locale === 'zh' ? '河南省' : 'Henan', addressCountry: "CN" },
  }
  const website = { "@context": "https://schema.org", "@type": "WebSite", "@id": `${absoluteUrl("/")}#website`, url: absoluteUrl("/"), name: translateText(siteConfig.name, locale), publisher: { "@id": `${absoluteUrl("/")}#organization` }, inLanguage: ['en', 'zh-CN'] }
  return <html lang={locale === 'zh' ? 'zh-CN' : 'en'} className="bg-background"><body className="flex min-h-screen flex-col font-sans antialiased"><LocaleProvider locale={locale}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website).replace(/</g, "\\u003c") }} />
    <SiteHeader /><main className="flex-1">{children}</main><SiteFooter /><MotionController />{process.env.VERCEL === "1" && <Analytics />}
  <script async src="https://admin.globle-trade.com/api/public/analytics.js?tenantId=6c1aa2e0-a38c-47a3-9f83-7ba87a52f203" />
      </LocaleProvider></body></html>
}
