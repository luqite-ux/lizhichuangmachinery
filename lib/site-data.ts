import type { LucideIcon } from "lucide-react"
import { ClipboardList, Factory, Gauge, LifeBuoy, Ruler, Truck, Users } from "lucide-react"

export const company = {
  legalNameEn: "Zhengzhou Lizhichuang Machinery Equipment Co., Ltd.",
  shortNameEn: "Lizhichuang Machinery",
  tagline: "Wet Wipes Production & Packaging Equipment, Engineered End to End",
  locationLine: "Xinzheng City, Zhengzhou, Henan Province, China",
  address: "300 meters west of the intersection of Zijing Shan South Road and Qinggong Road, heading north, Guodian Town, Xinzheng City, Zhengzhou, Henan Province, China",
  phone: "+86 185 5981 2218",
  email: "info@lzcglobal.com",
}

export const mainNav = [
  { label: "Home", href: "/" }, { label: "Products", href: "/products" },
  { label: "Solutions", href: "/solutions" }, { label: "About", href: "/about" },
  { label: "News", href: "/news" }, { label: "Contact", href: "/contact" },
]

export const productNav = [
  { slug: "lzc-wftg60b-cube-pack-line", label: "LZC-WFTG60B Cube Pack Line" },
  { slug: "lzc-lpdt20-super-mini-line", label: "LZC-LPDT20 Super Mini Line" },
  { slug: "lzc-lpdt60-super-mini-line", label: "LZC-LPDT60 Robotic Packing Line" },
  { slug: "lzc-lpm100-portable-wipes-line", label: "LZC-LPM100 Portable Wipes Line" },
  { slug: "lzc-lpms20-portable-ten-pack-line", label: "LZC-LPMS20 Ten-Pack Line" },
]

export const solutionPillars = [
  { title: "Project Planning", icon: ClipboardList, description: "We work through target formats, expected output, workshop constraints, and equipment selection before layout and manufacturing begin." },
  { title: "Workshop Layout", icon: Ruler, description: "We propose a line arrangement that connects material handling, production, primary packing, and grouped packing into a coherent flow." },
  { title: "Production-Supporting Information", icon: Users, description: "We share line sequencing, format-change, installation, and operating information to support each confirmed project configuration." },
]

export const processRail: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Requirements & Planning", description: "Confirm wipe format, target output, pack combination, and workshop constraints.", icon: ClipboardList },
  { title: "Engineering & Layout", description: "Define the line configuration, interfaces, and proposed equipment layout.", icon: Ruler },
  { title: "Manufacturing & Assembly", description: "Produce and assemble the equipment against the confirmed configuration.", icon: Factory },
  { title: "Factory Testing", description: "Test the equipment and key process interfaces before shipment.", icon: Gauge },
  { title: "Installation Support", description: "Support installation and integration at the customer's workshop.", icon: Truck },
  { title: "Training & Handover", description: "Guide the operating team through line use and routine procedures.", icon: Users },
  { title: "Service Support", description: "Remain available for technical service after handover.", icon: LifeBuoy },
]

export const outputSamples = [
  { src: "/images/output-sample-penguin.jpg", alt: "Compact individual wet wipes packs" },
  { src: "/images/output-sample-swan.jpg", alt: "Multi-sheet portable wet wipes packs" },
  { src: "/images/output-sample-rose.jpg", alt: "Folded soft-pack wet wipes output" },
]

export const heroSlides = [
  { id: "line", image: "/images/hero-machine-line.jpg", alt: "Wet wipes production line supplied by Lizhichuang Machinery", eyebrow: "Production Line", heading: "One Line, From Web to Wipe", body: "Coordinate material feeding, wetting, folding, cutting, and packing around the confirmed product format.", objectPosition: "38% center" },
  { id: "stack", image: "/images/hero-wipes-stack.jpg", alt: "Finished wet wipes formats supported by Lizhichuang equipment", eyebrow: "Packing Formats", heading: "Configure Every Pack Around the Market", body: "Plan individual sachets, portable multi-sheet packs, cube packs, grouped packs, and canister rolls.", objectPosition: "36% center" },
  { id: "clouds", image: "/images/hero-wipes-clouds.jpg", alt: "Wet wipes product presentation", eyebrow: "Project Engineering", heading: "Designed, Built, and Commissioned by One Team", body: "Move from equipment selection and workshop layout to factory testing, installation support, and handover.", objectPosition: "40% center" },
]
