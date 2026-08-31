import { images, type ImageKey } from "./assets"
import {
  LEGACY_PRECISION,
  LEGACY_TOOLING,
  isPublishable,
  type SourceMeta,
  type VerificationStatus,
} from "./types"

export type ProductFilterCategory = "Airframe" | "Engine" | "UAV Systems" | "Defense" | "Space" | "GSE"

export const productFilterCategories = ["All", "Airframe", "Engine", "UAV Systems", "Defense", "Space", "GSE"] as const

/** Existing product URL hashes. Do not rename — Navigation and direct links depend on these. */
export const productFilterHashes: Record<string, ProductFilterCategory> = {
  airframe: "Airframe",
  engine: "Engine",
  "uav-systems": "UAV Systems",
  gse: "GSE",
  defense: "Defense",
  space: "Space",
}

const productNavHash: Record<ProductFilterCategory, string> = {
  Airframe: "#airframe",
  Engine: "#engine",
  "UAV Systems": "#uav-systems",
  GSE: "#gse",
  Defense: "#defense",
  Space: "#space",
}

const productNavOrder: ProductFilterCategory[] = [
  "Airframe",
  "Engine",
  "GSE",
  "UAV Systems",
  "Defense",
  "Space",
]

/** Filter-category links that currently have publishable families. Empty hashes remain valid on Products. */
export function publicProductNavItems(): Array<{ label: string; sub: string; hash: string }> {
  const publicFamilies = productFamilies.filter((family) => isPublishable(family.verificationStatus))
  return productNavOrder.flatMap((category) => {
    const families = publicFamilies.filter((family) => family.filterCategory === category)
    if (families.length === 0) return []
    return [{
      label: category,
      sub: families.slice(0, 3).map((family) => family.name).join(", "),
      hash: productNavHash[category],
    }]
  })
}

export function publicProductFilterTabs(activeCategory?: string): Array<"All" | ProductFilterCategory> {
  const publicCategories = new Set(
    productFamilies
      .filter((family) => isPublishable(family.verificationStatus))
      .map((family) => family.filterCategory),
  )
  const tabs: Array<"All" | ProductFilterCategory> = ["All"]
  for (const category of productNavOrder) {
    if (publicCategories.has(category) || activeCategory === category) {
      tabs.push(category)
    }
  }
  return tabs
}

export interface ProductSpec {
  label: string
  value: string
}

export interface ProductFamily extends SourceMeta {
  id: string
  name: string
  category: string
  slug: string
  filterCategory: ProductFilterCategory
  shortDescription: string
  description: string
  materials: string[]
  dimensions?: string
  partNumber?: string
  weight?: string
  tolerance?: string
  applications: string[]
  specifications: ProductSpec[]
  image?: ImageKey
  currentlyOffered: "UNKNOWN"
}

const familyMeta = (
  sourceRef: string,
  verificationStatus: VerificationStatus,
  notes?: string,
): SourceMeta => ({
  sourceType: "LEGACY_WEBSITE",
  sourceRef,
  verificationStatus,
  notes,
})

export const productFamilies: ProductFamily[] = [
  {
    id: "precision-components",
    name: "Precision Components",
    category: "Precision Components",
    slug: "precision-components",
    filterCategory: "Airframe",
    shortDescription: "Precision aerospace component machining.",
    description:
      "Legacy precision page summary: product size 4 mm–1200 mm; CNC machining 3, 4, 5 axis; materials Aluminium, Nimonic, copper and more.",
    materials: ["Aluminium", "Nimonic", "copper"],
    dimensions: "4 mm–1200 mm",
    applications: ["Aerospace components"],
    specifications: [
      { label: "Product size", value: "4 mm–1200 mm" },
      { label: "CNC machining", value: "3, 4, 5 axis" },
      { label: "Materials", value: "Aluminium, Nimonic, copper & more" },
    ],
    image: "precisionComponents",
    currentlyOffered: "UNKNOWN",
    ...familyMeta(LEGACY_PRECISION, "SOURCE_SUPPORTED", "Summary tiles on the legacy precision page. Confirm currency."),
  },
  {
    id: "structural-components",
    name: "Structural Components",
    category: "Precision Components",
    slug: "structural-components",
    filterCategory: "Airframe",
    shortDescription: "Thin-walled aluminium aero structural parts.",
    description:
      "Igniting Minds Aerospace expertise in machining thin-walled Aluminum Aero Structural parts with product sizes varying from 30 mm to 1200 mm.",
    materials: ["Aluminium"],
    dimensions: "30 mm to 1200 mm",
    applications: ["Aero structural parts"],
    specifications: [{ label: "Product sizes", value: "30 mm to 1200 mm" }],
    image: "structuralComponent",
    currentlyOffered: "UNKNOWN",
    ...familyMeta(LEGACY_PRECISION, "SOURCE_SUPPORTED"),
  },
  {
    id: "aero-engine-components",
    name: "Aero-Engine Components",
    category: "Precision Components",
    slug: "aero-engine-components",
    filterCategory: "Engine",
    shortDescription: "Complex aerospace parts in listed exotic metals.",
    description:
      "Complex Aerospace parts involving exotic metals (Inconel, Nimonic, Titanium, PH17-4, PH15-5 and SS304). Outside processes are mentioned as a managed supply chain. No part numbers, weights, or tolerances were published.",
    materials: ["Inconel", "Nimonic", "Titanium", "PH17-4", "PH15-5", "SS304"],
    applications: ["Aerospace engine parts"],
    specifications: [
      { label: "Materials", value: "Inconel, Nimonic, Titanium, PH17-4, PH15-5, SS304" },
    ],
    image: "aeroEngineComponents",
    currentlyOffered: "UNKNOWN",
    ...familyMeta(LEGACY_PRECISION, "SOURCE_SUPPORTED", "Do not add Inconel 718 or 625 unless sourced."),
  },
  {
    id: "multi-axis-components",
    name: "Multi-Axis Components",
    category: "Precision Components",
    slug: "multi-axis-components",
    filterCategory: "Engine",
    shortDescription: "4- and 5-axis machined components.",
    description:
      "Expertise in machining 4 & 5 axis components from Aluminum, Inconel and Nimonic materials with product sizes varying from 20 mm to 500 mm.",
    materials: ["Aluminium", "Inconel", "Nimonic"],
    dimensions: "20 mm to 500 mm",
    applications: ["4-axis and 5-axis aerospace components"],
    specifications: [
      { label: "Axes", value: "4-axis / 5-axis" },
      { label: "Product sizes", value: "20 mm to 500 mm" },
    ],
    image: "multiAxisComponents",
    currentlyOffered: "UNKNOWN",
    ...familyMeta(LEGACY_PRECISION, "SOURCE_SUPPORTED"),
  },
  {
    id: "aero-engine-tooling",
    name: "Aero-Engine Tooling",
    category: "Tooling",
    slug: "aero-engine-tooling",
    filterCategory: "Engine",
    shortDescription: "Airframe and aero-engine tooling family.",
    description:
      "Legacy tooling page lists airframe and aero-engine tooling, including MRO tooling and module assembly tools. OEM licensee-vendor wording is stored separately as HIGH_RISK and is not treated as a verified relationship.",
    materials: [],
    applications: ["Maintenance, Repair & Overhaul tooling", "Module assembly tools"],
    specifications: [],
    image: "aeroEngineTooling",
    currentlyOffered: "UNKNOWN",
    ...familyMeta(LEGACY_TOOLING, "OWNER_VERIFICATION_REQUIRED"),
  },
  {
    id: "mro-tooling",
    name: "MRO Tooling",
    category: "Tooling",
    slug: "mro-tooling",
    filterCategory: "Engine",
    shortDescription: "MRO tooling solutions.",
    description: "Listed on the legacy overview and tooling pages as MRO tooling. No technical specifications were published.",
    materials: [],
    applications: ["MRO"],
    specifications: [],
    image: "mroTooling",
    currentlyOffered: "UNKNOWN",
    ...familyMeta(LEGACY_TOOLING, "SOURCE_SUPPORTED"),
  },
  {
    id: "gse",
    name: "Ground Support Equipment",
    category: "Tooling",
    slug: "gse",
    filterCategory: "GSE",
    shortDescription: "Aerospace ground support equipment categories listed on the legacy tooling page.",
    description:
      "On-Wing Support Equipment, Tripod Jacks, Axle Jacks, Tow Bars, Nacelle Tooling, and Aircraft Access Platforms. No part numbers or dimensions were published.",
    materials: [],
    applications: ["Aircraft maintenance operations"],
    specifications: [
      { label: "Examples", value: "On-Wing Support Equipment, Tripod Jacks, Axle Jacks, Tow Bars, Nacelle Tooling, Aircraft Access Platforms" },
    ],
    image: "gse",
    currentlyOffered: "UNKNOWN",
    ...familyMeta(LEGACY_TOOLING, "SOURCE_SUPPORTED"),
  },
  {
    id: "movement-trolleys",
    name: "Movement Trolleys",
    category: "Aero Engine Tooling",
    slug: "movement-trolleys",
    filterCategory: "Engine",
    shortDescription: "Movement trolleys listed under aero-engine tooling.",
    description: "Named on the legacy tooling page. No dimensions, part numbers, or materials were published.",
    materials: [],
    applications: ["Aero engine tooling"],
    specifications: [],
    image: "mroTooling",
    currentlyOffered: "UNKNOWN",
    ...familyMeta(
      LEGACY_TOOLING,
      "SOURCE_SUPPORTED",
      "images.structuralComponent / movement-trolley.png is a structural part photo, not confirmed as a trolley. mroTooling is used only as a temporary related asset key.",
    ),
  },
  {
    id: "jigs-fixtures",
    name: "Jigs & Fixtures",
    category: "Tooling",
    slug: "jigs-fixtures",
    filterCategory: "GSE",
    shortDescription: "Jigs and fixtures for listed manufacturing and inspection operations.",
    description:
      "High-precision jigs and fixtures for turning, milling, welding, EDM, and inspection applications. Fixture types named: milling, turning, welding, assembly, CMM, heat treatment.",
    materials: [],
    applications: ["Turning", "Milling", "Welding", "EDM", "Inspection", "Assembly", "CMM", "Heat treatment"],
    specifications: [
      { label: "Fixture types", value: "Milling, turning, welding, assembly, CMM, heat treatment, EDM, inspection" },
    ],
    image: "jigsFixtures",
    currentlyOffered: "UNKNOWN",
    ...familyMeta(LEGACY_TOOLING, "SOURCE_SUPPORTED"),
  },
  {
    id: "pedestals",
    name: "Pedestals",
    category: "Aero Engine Tooling",
    slug: "pedestals",
    filterCategory: "Engine",
    shortDescription: "Pedestals listed under aero-engine tooling.",
    description: "Named on the legacy tooling page. No specifications were published.",
    materials: [],
    applications: ["Aero engine tooling"],
    specifications: [],
    currentlyOffered: "UNKNOWN",
    ...familyMeta(LEGACY_TOOLING, "SOURCE_SUPPORTED"),
  },
  {
    id: "lifting-tools",
    name: "Lifting Tools",
    category: "Aero Engine Tooling",
    slug: "lifting-tools",
    filterCategory: "Engine",
    shortDescription: "Lifting tools listed under aero-engine tooling.",
    description: "Named on the legacy tooling page. No specifications were published.",
    materials: [],
    applications: ["Aero engine tooling"],
    specifications: [],
    currentlyOffered: "UNKNOWN",
    ...familyMeta(LEGACY_TOOLING, "SOURCE_SUPPORTED"),
  },
  {
    id: "brackets",
    name: "Brackets",
    category: "Aero Engine Tooling",
    slug: "brackets",
    filterCategory: "Engine",
    shortDescription: "Brackets listed under aero-engine tooling.",
    description: "Named on the legacy tooling page. No specifications were published.",
    materials: [],
    applications: ["Aero engine tooling"],
    specifications: [],
    currentlyOffered: "UNKNOWN",
    ...familyMeta(LEGACY_TOOLING, "SOURCE_SUPPORTED"),
  },
  {
    id: "indexing-tools",
    name: "Indexing Tools",
    category: "Aero Engine Tooling",
    slug: "indexing-tools",
    filterCategory: "Engine",
    shortDescription: "Indexing tools listed under aero-engine tooling.",
    description: "Named on the legacy tooling page. No specifications were published.",
    materials: [],
    applications: ["Aero engine tooling"],
    specifications: [],
    currentlyOffered: "UNKNOWN",
    ...familyMeta(LEGACY_TOOLING, "SOURCE_SUPPORTED"),
  },
  {
    id: "torquing-tools",
    name: "Torquing Tools",
    category: "Aero Engine Tooling",
    slug: "torquing-tools",
    filterCategory: "Engine",
    shortDescription: "Torquing tools listed under aero-engine tooling.",
    description: "Named on the legacy tooling page. No specifications were published.",
    materials: [],
    applications: ["Aero engine tooling"],
    specifications: [],
    currentlyOffered: "UNKNOWN",
    ...familyMeta(LEGACY_TOOLING, "SOURCE_SUPPORTED"),
  },
]

export interface PrototypeSku extends SourceMeta {
  id: string
  name: string
  currentPage: string
}

export const prototypeSkus: PrototypeSku[] = [
  { id: "lca-tejas-wing-rib", name: "LCA Tejas Wing Rib Assembly", currentPage: "Home, Products", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Products.tsx", verificationStatus: "HIGH_RISK", notes: "Not found on the legacy site. Do not treat as a real SKU." },
  { id: "gt-compressor-casing", name: "Gas Turbine Compressor Casing", currentPage: "Home, Products", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Products.tsx", verificationStatus: "PROTOTYPE" },
  { id: "surveillance-uav", name: "Long-Range Surveillance UAV", currentPage: "Home, Products", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Products.tsx", verificationStatus: "PROTOTYPE" },
  { id: "a320neo-door-surround", name: "A320neo Door Surround Frame", currentPage: "Products", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Products.tsx", verificationStatus: "HIGH_RISK" },
  { id: "missile-airframe", name: "Missile Airframe Body Section", currentPage: "Products", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Products.tsx", verificationStatus: "HIGH_RISK", notes: "ITAR / classified prototype claim." },
  { id: "isro-satellite-panel", name: "Satellite Structural Panel Assembly", currentPage: "Products", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Products.tsx", verificationStatus: "HIGH_RISK" },
  { id: "wing-assembly-jig", name: "Wing Assembly Jig & Fixture", currentPage: "Products", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Products.tsx", verificationStatus: "PROTOTYPE" },
  { id: "turbine-exhaust-duct", name: "Turbine Exhaust Duct", currentPage: "Products", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Products.tsx", verificationStatus: "PROTOTYPE" },
]

export const prototypeProductCards: Array<SourceMeta & {
  title: string
  filterCategory: ProductFilterCategory
  description: string
  specs: ProductSpec[]
  program: string
}> = [
  { title: "LCA Tejas Wing Rib Assembly", filterCategory: "Airframe", description: "Machined Ti-6Al-4V wing rib assembly — 200-part build kit, matched-drill fastener locations.", specs: [{ label: "Material", value: "Ti-6Al-4V" }, { label: "Tolerance", value: "±0.01mm" }, { label: "Qty / Set", value: "200 pcs" }, { label: "Lead Time", value: "8 weeks" }], program: "HAL LCA Tejas Mk1A", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Products.tsx", verificationStatus: "HIGH_RISK" },
  { title: "Gas Turbine Compressor Casing", filterCategory: "Engine", description: "Multi-axis machined Inconel 718 compressor casing with precision bore and complex internal geometry.", specs: [{ label: "Material", value: "Inconel 718" }, { label: "Tolerance", value: "±0.005mm" }, { label: "Weight", value: "34 kg" }, { label: "Lead Time", value: "12 weeks" }], program: "Turbofan Engine Program", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Products.tsx", verificationStatus: "PROTOTYPE" },
  { title: "Long-Range Surveillance UAV", filterCategory: "UAV Systems", description: "CFRP composite fixed-wing airframe for 25kg MTOW MALE-class surveillance platform.", specs: [{ label: "MTOW", value: "25 kg" }, { label: "Wingspan", value: "4.2 m" }, { label: "Endurance", value: "12 hrs" }, { label: "Payload", value: "5 kg" }], program: "Defense Reconnaissance", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Products.tsx", verificationStatus: "PROTOTYPE" },
  { title: "A320neo Door Surround Frame", filterCategory: "Airframe", description: "Machined aluminium 7075-T651 door surround frame for narrow-body passenger aircraft.", specs: [{ label: "Material", value: "Al 7075-T651" }, { label: "Tolerance", value: "±0.02mm" }, { label: "Surface", value: "Anodize Type III" }, { label: "Lead Time", value: "6 weeks" }], program: "A320neo Program", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Products.tsx", verificationStatus: "HIGH_RISK" },
  { title: "Missile Airframe Body Section", filterCategory: "Defense", description: "Precision-machined aluminium airframe body section for short-range surface-to-air missile.", specs: [{ label: "Material", value: "Al 2024-T351" }, { label: "Circularity", value: "<0.01mm" }, { label: "Finish", value: "Hard anodize" }, { label: "Classification", value: "ITAR Controlled" }], program: "Defense Program (Classified)", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Products.tsx", verificationStatus: "HIGH_RISK", notes: "ITAR / classified / missile prototype claim." },
  { title: "Satellite Structural Panel Assembly", filterCategory: "Space", description: "Aluminium honeycomb structural panel assembly for small satellite primary structure.", specs: [{ label: "Material", value: "Al Honeycomb" }, { label: "Mass", value: "2.1 kg" }, { label: "Flatness", value: "<0.1mm" }, { label: "Environment", value: "Vac, -150 to +120°C" }], program: "ISRO NewSpace Program", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Products.tsx", verificationStatus: "HIGH_RISK" },
  { title: "Wing Assembly Jig & Fixture", filterCategory: "GSE", description: "Precision aircraft assembly jig for wing-fuselage interface alignment, modular steel construction.", specs: [{ label: "Accuracy", value: "±0.05mm" }, { label: "Material", value: "Structural steel" }, { label: "Coverage", value: "Full wing span" }, { label: "Type", value: "Hard tooling" }], program: "Regional Jet Program", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Products.tsx", verificationStatus: "PROTOTYPE" },
  { title: "Turbine Exhaust Duct", filterCategory: "Engine", description: "Sheet metal + weld Inconel 625 exhaust duct assembly with integrated heat-shield provisions.", specs: [{ label: "Material", value: "Inconel 625" }, { label: "Temp Rating", value: "980°C" }, { label: "Wall Thickness", value: "0.9mm" }, { label: "Lead Time", value: "10 weeks" }], program: "Auxiliary Power Unit", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Products.tsx", verificationStatus: "PROTOTYPE" },
]

export const oemToolingClaim: SourceMeta = {
  sourceType: "LEGACY_WEBSITE",
  sourceRef: LEGACY_TOOLING,
  verificationStatus: "HIGH_RISK",
  notes:
    "Legacy wording: official tooling vendor for licensees of GE, Safran, Rolls-Royce, Boeing, Airbus, Dassault Aviation, and Lockheed Martin since 2017. Also names Boeing 737–787, CFM LEAP, GE NX, Rolls-Royce Trent. Not stored as a verified product attribute.",
}

export function productImageSrc(key: ImageKey | undefined): string | undefined {
  return key ? images[key] : undefined
}

export function publicProductSpecs(family: ProductFamily): ProductSpec[] {
  const specs = [...family.specifications]
  if (family.materials.length > 0 && !specs.some((spec) => /material/i.test(spec.label))) {
    specs.push({ label: "Materials", value: family.materials.join(", ") })
  }
  if (family.dimensions && !specs.some((spec) => /size|dimension/i.test(spec.label))) {
    specs.push({ label: "Product sizes", value: family.dimensions })
  }
  return specs.slice(0, 4)
}
