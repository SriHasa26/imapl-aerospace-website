/**
 * Company identity model.
 * Conflicting fields keep both source values. No winner is selected.
 */

import { type ImageKey } from "./assets"
import {
  COMPANY_PROFILE_2026,
  LEGACY_LEADERSHIP,
  LEGACY_SITE,
  LEGACY_VALUES,
  type MaybeConflicting,
  type SourceMeta,
  type SourcedValue,
  type VerificationStatus,
} from "./types"

export { companyContact } from "./contact"

export const officialName: SourcedValue<string> = {
  value: "Igniting Minds Aerospace Pvt Ltd",
  sourceType: "LEGACY_WEBSITE",
  sourceRef: LEGACY_SITE,
  verificationStatus: "SOURCE_SUPPORTED",
  notes: "Also published as Igniting Minds Aerospace Private Limited. Confirm the exact legal string.",
}

export const shortName: SourcedValue<string> = {
  value: "IMAPL",
  sourceType: "LEGACY_WEBSITE",
  sourceRef: LEGACY_SITE,
  verificationStatus: "SOURCE_SUPPORTED",
}

export const foundingYear: SourcedValue<string> = {
  value: "2017",
  sourceType: "OWNER_DOCUMENT",
  sourceRef: COMPANY_PROFILE_2026,
  verificationStatus: "SOURCE_SUPPORTED",
  notes: "2026 company profile: founded in 2017, headquartered in Bengaluru. Prototype About copy that said 2018 is not used.",
}

export const headquarters: SourcedValue<string> = {
  value: "Phase 3, Peenya, Bengaluru, Karnataka, India 560058",
  sourceType: "OWNER_DOCUMENT",
  sourceRef: COMPANY_PROFILE_2026,
  verificationStatus: "SOURCE_SUPPORTED",
  notes: "2026 company profile cover and contact page. Hyderabad TSIIC campus remains prototype-only and is not selected as headquarters.",
}

export const description: SourcedValue<string> = {
  value:
    "Integrated aerospace engineering and manufacturing company specialising in complex tooling, precision components, and sub-assemblies.",
  sourceType: "OWNER_DOCUMENT",
  sourceRef: COMPANY_PROFILE_2026,
  verificationStatus: "SOURCE_SUPPORTED",
  notes: "Compressed from the 2026 company profile About Us page. Do not add named OEM customers.",
}

export const coreExpertise: SourcedValue<string[]> = {
  value: [
    "Aero Engine Tooling",
    "Precision Aerospace Components",
    "MRO Tooling Solutions",
    "Integrated Engineering & Manufacturing",
    "Jigs & Fixtures",
    "Quality-Driven Manufacturing",
  ],
  sourceType: "OWNER_DOCUMENT",
  sourceRef: COMPANY_PROFILE_2026,
  verificationStatus: "SOURCE_SUPPORTED",
  notes: "Public work areas from the 2026 profile. OEM/Tier-1 relationship wording is stored separately and is not used as a work-area tile.",
}

/** Legacy overview work areas, excluding OEM-relationship wording. For public pages only. */
export const publicWorkAreas = coreExpertise.value.filter((item) => !/oem/i.test(item))

export const workAreaImages: Record<string, ImageKey> = {
  "Aero Engine Tooling": "productAeroEngineTooling",
  "Precision Aerospace Components": "precisionComponents",
  "MRO Tooling Solutions": "mroTooling",
  "Integrated Engineering & Manufacturing": "assemblyImage",
  "Jigs & Fixtures": "jigsFixtures",
  "Quality-Driven Manufacturing": "qualityImage",
}

export const workAreaDescriptions: Record<string, string> = {
  "Aero Engine Tooling": "Airframe and aero-engine tooling family.",
  "Precision Aerospace Components":
    "Precision-machined aerospace components manufactured to demanding dimensional and quality requirements.",
  "MRO Tooling Solutions":
    "MRO tooling solutions designed to support aircraft maintenance, repair, overhaul, and servicing operations.",
  "Integrated Engineering & Manufacturing":
    "Integrated engineering and manufacturing capabilities supporting aerospace tooling, components, and assemblies.",
  "Jigs & Fixtures":
    "Jigs and fixtures developed for accurate positioning, assembly, inspection, and repeatable manufacturing operations.",
  "Quality-Driven Manufacturing":
    "Quality-focused manufacturing supported by inspection, verification, and controlled production processes.",
}

export const values: MaybeConflicting<string[]> = {
  verificationStatus: "CONFLICTING",
  notes: "Two different value sets. Do not merge them.",
  candidates: [
    {
      value: [
        "Integrity",
        "Mutual Respect",
        "Accountability",
        "Pursuit of Excellence",
        "Learning Mindset",
      ],
      sourceType: "LEGACY_WEBSITE",
      sourceRef: LEGACY_VALUES,
      verificationStatus: "SOURCE_SUPPORTED",
    },
    {
      value: [
        "Engineering Integrity",
        "Customer-First Delivery",
        "Continuous Innovation",
        "Safety Without Exception",
        "Global Standards, Local Agility",
      ],
      sourceType: "CURRENT_PROJECT",
      sourceRef: "src/pages/About.tsx",
      verificationStatus: "PROTOTYPE",
    },
  ],
}

export const mission: SourcedValue<string> = {
  value:
    "To deliver exceptional manufacturing solutions through integrity, innovation, and continuous improvement, consistently exceeding customer expectations and enabling their success.",
  sourceType: "OWNER_DOCUMENT",
  sourceRef: COMPANY_PROFILE_2026,
  verificationStatus: "SOURCE_SUPPORTED",
}

export const vision: SourcedValue<string> = {
  value:
    "To achieve manufacturing excellence that drives customer success and satisfaction.",
  sourceType: "OWNER_DOCUMENT",
  sourceRef: COMPANY_PROFILE_2026,
  verificationStatus: "SOURCE_SUPPORTED",
}

export const staffCount: MaybeConflicting<string> = {
  verificationStatus: "CONFLICTING",
  notes: "CONFLICTING — OWNER VERIFICATION REQUIRED. Do not choose 120+ or 500+.",
  candidates: [
    {
      value: "120+",
      sourceType: "LEGACY_WEBSITE",
      sourceRef: LEGACY_LEADERSHIP,
      verificationStatus: "HIGH_RISK",
      notes: "Published as “skilled professionals” on the legacy leadership page.",
    },
    {
      value: "500+",
      sourceType: "CURRENT_PROJECT",
      sourceRef: "src/pages/Home.tsx",
      verificationStatus: "PROTOTYPE",
    },
  ],
}

export const yearsOfExperience: MaybeConflicting<string> = {
  verificationStatus: "CONFLICTING",
  notes: "Tied to the founding-year conflict.",
  candidates: [
    {
      value: "9+",
      sourceType: "LEGACY_WEBSITE",
      sourceRef: LEGACY_LEADERSHIP,
      verificationStatus: "HIGH_RISK",
    },
    {
      value: "6",
      sourceType: "CURRENT_PROJECT",
      sourceRef: "src/pages/About.tsx",
      verificationStatus: "PROTOTYPE",
    },
  ],
}

export interface LeadershipPerson {
  name: string
  title: string
  summary?: string
  photo?: ImageKey
  sourceType: SourcedValue<string>["sourceType"]
  sourceRef?: string
  verificationStatus: VerificationStatus
}

export const leadership = {
  verificationStatus: "CONFLICTING" as const,
  notes:
    "2026 company profile confirms the three directors below. Prototype names are retained in the model and are not published.",
  legacyTeam: [
    {
      name: "Chakrapani M",
      title: "Founder & Managing Director",
      summary:
        "Leads strategic growth with a focus on aerospace tooling and component manufacturing, built on collaboration and transparency.",
      photo: "leadershipChakrapani" as const,
      sourceType: "OWNER_DOCUMENT" as const,
      sourceRef: COMPANY_PROFILE_2026,
      verificationStatus: "SOURCE_SUPPORTED" as const,
    },
    {
      name: "Manjunatha S",
      title: "Director - Projects",
      summary:
        "More than 27 years in aerospace and automotive project management, planning, scheduling, and customer programmes.",
      photo: "leadershipManjunatha" as const,
      sourceType: "OWNER_DOCUMENT" as const,
      sourceRef: COMPANY_PROFILE_2026,
      verificationStatus: "SOURCE_SUPPORTED" as const,
    },
    {
      name: "Beerappa K",
      title: "Director - Finance",
      summary:
        "More than 18 years in manufacturing-industry finance, including budgeting and forecasting.",
      photo: "leadershipBeerappa" as const,
      sourceType: "OWNER_DOCUMENT" as const,
      sourceRef: COMPANY_PROFILE_2026,
      verificationStatus: "SOURCE_SUPPORTED" as const,
    },
  ] satisfies LeadershipPerson[],
  prototypeTeam: [
    {
      name: "Vikram Reddy",
      title: "Chief Executive Officer",
      summary: "Prototype About page; also used as Quality Policy signatory.",
      sourceType: "CURRENT_PROJECT" as const,
      sourceRef: "src/pages/About.tsx",
      verificationStatus: "PROTOTYPE" as const,
    },
    {
      name: "Shalini Nair",
      title: "Chief Operating Officer",
      summary: "Prototype claim: Ex-HAL, IIT Madras.",
      sourceType: "CURRENT_PROJECT" as const,
      sourceRef: "src/pages/About.tsx",
      verificationStatus: "PROTOTYPE" as const,
    },
    {
      name: "Dr. Rajan Pillai",
      title: "VP Engineering & Technology",
      summary: "Prototype claim: PhD Aerospace Engg, IISc.",
      sourceType: "CURRENT_PROJECT" as const,
      sourceRef: "src/pages/About.tsx",
      verificationStatus: "PROTOTYPE" as const,
    },
    {
      name: "Meera Krishnan",
      title: "VP Quality & Compliance",
      summary: "Prototype claim: AS9100 Lead Auditor.",
      sourceType: "CURRENT_PROJECT" as const,
      sourceRef: "src/pages/About.tsx",
      verificationStatus: "PROTOTYPE" as const,
    },
    {
      name: "Aditya Sharma",
      title: "VP Manufacturing Operations",
      summary: "Prototype claim: 18 years CNC & composites.",
      sourceType: "CURRENT_PROJECT" as const,
      sourceRef: "src/pages/About.tsx",
      verificationStatus: "PROTOTYPE" as const,
    },
    {
      name: "Priya Venkatesh",
      title: "VP Business Development",
      summary: "Prototype claim: Global OEM partnerships.",
      sourceType: "CURRENT_PROJECT" as const,
      sourceRef: "src/pages/About.tsx",
      verificationStatus: "PROTOTYPE" as const,
    },
  ] satisfies LeadershipPerson[],
}

export const prototypeHeroTagline: SourcedValue<string> = {
  value:
    "Built by aerospace engineers, for aerospace programs. Igniting Minds Aerospace is India's fastest-growing precision aerospace manufacturer, trusted by global OEMs and defense organizations.",
  sourceType: "CURRENT_PROJECT",
  sourceRef: "src/pages/About.tsx",
  verificationStatus: "HIGH_RISK",
  notes: "Superlative plus unnamed OEM/defense trust claims. Not for public display.",
}

export const prototypeStory: SourcedValue<string[]> = {
  value: [
    "Igniting Minds Aerospace was founded in 2018 by a team of seasoned aerospace engineers with a shared conviction: India could — and should — manufacture world-class aerospace components for global programs.",
    "Starting with a 5,000 sq ft facility and 3 CNC machines, we won our first contract with HAL within our first year of operations. The engineering discipline, quality rigor, and delivery reliability we demonstrated on that program set the standard for everything that followed.",
    "Today, we operate a 45,000 sq ft integrated manufacturing campus with over 500 engineers and technicians, AS9100D certification, NADCAP accreditation, and supply relationships with Tier-1 suppliers across Europe, North America, and the Asia-Pacific region.",
  ],
  sourceType: "CURRENT_PROJECT",
  sourceRef: "src/pages/About.tsx",
  verificationStatus: "HIGH_RISK",
  notes:
    "Contains conflicting founding year and location, unverified facility/staff figures, HAL, AS9100D, NADCAP, and unnamed Tier-1 relationships. Retained in the model; not for public display.",
}

export interface PrototypeMilestone {
  year: string
  event: string
  detail: string
  sourceType: SourcedValue<string>["sourceType"]
  sourceRef: string
  verificationStatus: VerificationStatus
  notes?: string
}

export const prototypeMilestones: PrototypeMilestone[] = [
  {
    year: "2018",
    event: "Company Founded",
    detail: "Incorporated in Hyderabad as a precision engineering startup focused on aerospace.",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/About.tsx",
    verificationStatus: "HIGH_RISK",
    notes: "Founding year conflicts with legacy 2017. Hyderabad location conflicts with Bengaluru contact source.",
  },
  {
    year: "2019",
    event: "First AS9100D Certification",
    detail: "Achieved AS9100D Rev D certification within 14 months of operations.",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/About.tsx",
    verificationStatus: "HIGH_RISK",
  },
  {
    year: "2020",
    event: "HAL Approval",
    detail: "Approved as a supplier to Hindustan Aeronautics Limited for the LCA Tejas program.",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/About.tsx",
    verificationStatus: "HIGH_RISK",
  },
  {
    year: "2021",
    event: "NADCAP Accreditation",
    detail: "Special process NADCAP accreditation for heat treatment and non-destructive testing.",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/About.tsx",
    verificationStatus: "HIGH_RISK",
  },
  {
    year: "2022",
    event: "Phase 2 Expansion",
    detail: "Doubled facility to 45,000 sq ft; added composite autoclave and cleanroom assembly.",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/About.tsx",
    verificationStatus: "HIGH_RISK",
  },
  {
    year: "2023",
    event: "Export Program Launch",
    detail: "First export deliveries to European Tier-1 supplier; ISO 9001:2015 recertification.",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/About.tsx",
    verificationStatus: "HIGH_RISK",
  },
  {
    year: "2024",
    event: "Space Program Entry",
    detail: "Awarded contract for satellite structural components under ISRO's NewSpace program.",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/About.tsx",
    verificationStatus: "HIGH_RISK",
  },
]

export const company = {
  officialName,
  shortName,
  foundingYear,
  headquarters,
  description,
  coreExpertise,
  publicWorkAreas,
  values,
  mission,
  vision,
  staffCount,
  yearsOfExperience,
  leadership,
  prototypeHeroTagline,
  prototypeStory,
  prototypeMilestones,
}

export const prototypeHomeHeroStats: Array<SourceMeta & { val: string; label: string; sub: string }> = [
  { val: "2,400+", label: "Components Delivered", sub: "Annually", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Home.tsx", verificationStatus: "PROTOTYPE" },
  { val: "98.7%", label: "On-Time Delivery", sub: "2023 Performance", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Home.tsx", verificationStatus: "PROTOTYPE" },
  { val: "25+", label: "Countries Served", sub: "Global Reach", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Home.tsx", verificationStatus: "HIGH_RISK" },
  { val: "4", label: "Certifications", sub: "AS9100D · ISO · NADCAP", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Home.tsx", verificationStatus: "HIGH_RISK" },
]
