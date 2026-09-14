import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MotionController } from "@/components/motion-controller"
import { absoluteUrl, siteConfig } from "@/lib/site-config"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: { default: "Lizhichuang Machinery | Wet Wipes Production & Packaging Equipment", template: "%s | Lizhichuang Machinery" },
  description: "Zhengzhou Lizhichuang Machinery Equipment Co., Ltd. designs, develops, produces, commissions, sells, and services wet wipes production and packaging equipment.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: { type: "website", url: absoluteUrl("/"), title: "Lizhichuang Machinery | Wet Wipes Production & Packaging Equipment", description: "Explore customer-documented wet wipes production, grouped packing, and rewinding equipment.", images: [{ url: "/images/hero-machine-line.jpg" }] },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/images/logo.png", shortcut: "/images/logo.png", apple: "/images/logo.png" },
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#2f4f8f" }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@context": "https://schema.org", "@type": "Organization", "@id": `${absoluteUrl("/")}#organization`,
    name: siteConfig.legalName, alternateName: siteConfig.name, url: absoluteUrl("/"),
    logo: absoluteUrl(siteConfig.logo), telephone: siteConfig.phone,
    address: { "@type": "PostalAddress", streetAddress: siteConfig.address, addressRegion: "Henan", addressCountry: "CN" },
  }
  const website = { "@context": "https://schema.org", "@type": "WebSite", "@id": `${absoluteUrl("/")}#website`, url: absoluteUrl("/"), name: siteConfig.name, publisher: { "@id": `${absoluteUrl("/")}#organization` }, inLanguage: "en" }
  return <html lang="en" className="bg-background"><body className="flex min-h-screen flex-col font-sans antialiased">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website).replace(/</g, "\\u003c") }} />
    <SiteHeader /><main className="flex-1">{children}</main><SiteFooter /><MotionController />{process.env.VERCEL === "1" && <Analytics />}
  </body></html>
}
