import { LEGACY_SUPPLIERS, isPublishable, type SourceMeta, type VerificationStatus } from "./types"

export type ResourceType =
  | "News"
  | "Case Study"
  | "Brochure"
  | "Certification"
  | "Technical Document"
  | "Supplier Document"

export interface ResourceRecord extends SourceMeta {
  id: string
  type: ResourceType
  title: string
  href?: string
  fileExists: boolean
}

const missing = (
  id: string,
  type: ResourceType,
  title: string,
  sourceRef: string,
  verificationStatus: VerificationStatus = "MISSING",
): ResourceRecord => ({
  id,
  type,
  title,
  fileExists: false,
  sourceType: "CURRENT_PROJECT",
  sourceRef,
  verificationStatus,
  notes: "MISSING / OWNER DOCUMENT REQUIRED. No file in this repository. Do not link a fake download.",
})

export const resources: ResourceRecord[] = [
  missing("capability-statement", "Brochure", "Company Capability Statement", "src/pages/Resources.tsx"),
  missing("as9100d-pdf", "Certification", "AS9100D Certificate of Registration", "src/pages/Resources.tsx", "HIGH_RISK"),
  missing("nadcap-pdf", "Certification", "NADCAP Accreditation Certificate", "src/pages/Resources.tsx", "HIGH_RISK"),
  missing("dgca-pdf", "Certification", "DGCA Maintenance Organization Approval", "src/pages/Resources.tsx", "HIGH_RISK"),
  missing("rfq-template", "Technical Document", "RFQ Submission Template", "src/pages/Resources.tsx"),
  missing("sqr", "Technical Document", "Supplier Quality Requirements (SQR)", "src/pages/Resources.tsx"),
  missing("nadcap-news", "News", "NADCAP Heat Treatment Accreditation news item", "src/pages/Resources.tsx", "PROTOTYPE"),
  missing("phase2-news", "News", "Phase 2 Facility Expansion news item", "src/pages/Resources.tsx", "PROTOTYPE"),
  missing("a320-case", "Case Study", "A320neo Wing Panel Kit case study", "src/pages/Resources.tsx", "HIGH_RISK"),
  missing("lca-case", "Case Study", "LCA Tejas Mk1A case study", "src/pages/Resources.tsx", "HIGH_RISK"),
  missing("titanium-white-paper", "Technical Document", "Titanium Machining white paper", "src/pages/Resources.tsx", "PROTOTYPE"),
  missing("isro-news", "News", "ISRO NewSpace news item", "src/pages/Resources.tsx", "HIGH_RISK"),
  {
    id: "legacy-supplier-terms",
    type: "Supplier Document",
    title: "Supplier Terms and Conditions",
    fileExists: false,
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_SUPPLIERS,
    verificationStatus: "OWNER_VERIFICATION_REQUIRED",
    notes:
      "A PDF is linked on the legacy For Suppliers page (GoDaddy CDN). It is not stored in this repository and is not exposed as a site download.",
  },
]

export const prototypeResourceArticles: Array<SourceMeta & {
  type: string
  date: string
  title: string
  excerpt: string
  unsplashId: string
  readTime: string
}> = [
  {
    type: "News",
    date: "NOV 15, 2024",
    title: "Igniting Minds Achieves NADCAP Heat Treatment Accreditation",
    excerpt: "Strengthening our special process credentials, the NADCAP accreditation for heat treatment further cements our position as a Tier-1 ready aerospace supplier capable of full in-house processing.",
    unsplashId: "photo-1581091212991",
    readTime: "3 min read",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Resources.tsx",
    verificationStatus: "HIGH_RISK",
  },
  {
    type: "Case Study",
    date: "OCT 28, 2024",
    title: "A320neo Wing Panel Kit: 480 Parts, 98.9% On-Time Over 18 Months",
    excerpt: "How Igniting Minds Aerospace delivered a complex 480-part wing panel kit supply program for a European Tier-1 customer with zero customer escapes and an industry-leading delivery performance.",
    unsplashId: "photo-1674897537555",
    readTime: "8 min read",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Resources.tsx",
    verificationStatus: "HIGH_RISK",
  },
  {
    type: "News",
    date: "OCT 10, 2024",
    title: "Phase 2 Facility Expansion Complete: 30,000 Sq Ft of New Manufacturing Space",
    excerpt: "Our Hyderabad campus expansion is complete. Phase 2 brings a dedicated composite manufacturing wing, a new 4-meter autoclave, cleanroom assembly bay, and expanded Zeiss CMM metrology lab.",
    unsplashId: "photo-1740209475472",
    readTime: "4 min read",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Resources.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    type: "Case Study",
    date: "SEP 20, 2024",
    title: "LCA Tejas Mk1A: Structural Airframe Components for India's Fighter Program",
    excerpt: "Selected as a Tier-2 supplier to HAL for the 83-aircraft Tejas Mk1A program, we manufacture precision-machined titanium airframe frames with zero defect delivery since program inception.",
    unsplashId: "photo-1469289759076",
    readTime: "6 min read",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Resources.tsx",
    verificationStatus: "HIGH_RISK",
  },
  {
    type: "White Paper",
    date: "AUG 2024",
    title: "Titanium Machining for Aerospace: A Practical Guide to High-Performance 5-Axis Strategies",
    excerpt: "A technical white paper on optimized machining strategies for titanium aerospace components — covering tool selection, coolant management, vibration damping, and surface integrity verification.",
    unsplashId: "photo-1666618090858",
    readTime: "12 min read",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Resources.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    type: "News",
    date: "JUL 2024",
    title: "Igniting Minds Selected for ISRO NewSpace Satellite Structural Program",
    excerpt: "Awarded a contract for satellite primary structural panels under ISRO's NewSpace India Limited (NSIL) program, marking our entry into the orbital space hardware market.",
    unsplashId: "photo-1520870121499",
    readTime: "3 min read",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Resources.tsx",
    verificationStatus: "HIGH_RISK",
  },
]

export const prototypeDownloads: Array<SourceMeta & { name: string; size: string; tag: string }> = [
  { name: "Company Capability Statement", size: "PDF · 2.4 MB", tag: "Company Profile", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Resources.tsx", verificationStatus: "MISSING" },
  { name: "AS9100D Certificate of Registration", size: "PDF · 340 KB", tag: "Quality", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Resources.tsx", verificationStatus: "HIGH_RISK" },
  { name: "NADCAP Accreditation Certificate", size: "PDF · 280 KB", tag: "Quality", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Resources.tsx", verificationStatus: "HIGH_RISK" },
  { name: "DGCA Maintenance Organization Approval", size: "PDF · 510 KB", tag: "Approvals", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Resources.tsx", verificationStatus: "HIGH_RISK" },
  { name: "RFQ Submission Template", size: "XLSX · 180 KB", tag: "Forms", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Resources.tsx", verificationStatus: "MISSING" },
  { name: "Supplier Quality Requirements (SQR)", size: "PDF · 1.1 MB", tag: "Quality", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Resources.tsx", verificationStatus: "MISSING" },
]

export function isPublicDownload(resource: ResourceRecord): boolean {
  return resource.fileExists === true && isPublishable(resource.verificationStatus) && Boolean(resource.href)
}

export function isPublicArticle(resource: ResourceRecord): boolean {
  return isPublishable(resource.verificationStatus) && (resource.type === "News" || resource.type === "Case Study")
}

/** Missing brochure/technical files that may be listed as unpublished — not as downloads. */
export function isUnpublishedCatalogItem(resource: ResourceRecord): boolean {
  if (resource.fileExists) return false
  if (resource.type === "Certification" || resource.type === "News" || resource.type === "Case Study") return false
  if (resource.verificationStatus === "HIGH_RISK" || resource.verificationStatus === "PROTOTYPE") return false
  return resource.type === "Brochure" || resource.type === "Technical Document" || resource.type === "Supplier Document"
}
