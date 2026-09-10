export type ProductCategory = {
  id: string
  slug: string
  name: string
  description: string
}

export type Product = {
  id: string
  slug: string
  model: string
  name: string
  shortName: string
  categorySlug: string
  categoryName: string
  summary: string
  overview: string
  images: string[]
  features: string[]
  processSteps: string[]
  applications: string[]
  specifications: Record<string, string>
  datasheetUrls: string[]
  equipmentLayoutUrls: string[]
  certificate: string
  updatedAt: string | null
}
