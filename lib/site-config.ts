export const siteConfig = {
  name: "LIZHICHUANG MACHINERY",
  legalName: "Zhengzhou Lizhichuang Machinery Equipment Co., Ltd.",
  domain: (process.env.NEXT_PUBLIC_SITE_URL || "https://lzcglobal.com").replace(/^https?:\/\//, "").replace(/\/$/, ""),
  locale: "en",
  phone: "+86 185 5981 2218",
  address: "300 meters west of the intersection of Zijing Shan South Road and Qinggong Road, heading north, Guodian Town, Xinzheng City, Zhengzhou, Henan Province, China",
  logo: "/images/logo.png",
} as const

export const absoluteUrl = (path = "/") => `https://${siteConfig.domain}${path.startsWith("/") ? path : `/${path}`}`
