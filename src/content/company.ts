/**
 * Company identity model.
 * Conflicting fields keep both source values. No winner is selected.
 */

import {
  LEGACY_LEADERSHIP,
  LEGACY_OVERVIEW,
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

export const foundingYear: MaybeConflicting<string> = {
  verificationStatus: "CONFLICTING",
  notes: "CONFLICTING — OWNER VERIFICATION REQUIRED. Do not choose 2017 or 2018.",
  candidates: [
    {
      value: "2017",
      sourceType: "LEGACY_WEBSITE",
      sourceRef: LEGACY_OVERVIEW,
      verificationStatus: "SOURCE_SUPPORTED",
    },
    {
      value: "2018",
      sourceType: "CURRENT_PROJECT",
      sourceRef: "src/pages/About.tsx",
      verificationStatus: "PROTOTYPE",
    },
  ],
}

export const headquarters: MaybeConflicting<string> = {
  verificationStatus: "CONFLICTING",
  notes: "CONFLICTING — OWNER VERIFICATION REQUIRED. Bengaluru offices vs Hyderabad TSIIC campus story.",
  candidates: [
    {
      value: "India (offices published in Bengaluru; Ajman UAE also listed)",
      sourceType: "LEGACY_WEBSITE",
      sourceRef: "https://imapl.co.in/contact-us",
      verificationStatus: "OWNER_VERIFICATION_REQUIRED",
    },
    {
      value: "TSIIC Aerospace Park, Plot 42, Adibatla, Hyderabad — 501506",
      sourceType: "CURRENT_PROJECT",
      sourceRef: "src/pages/Facilities.tsx",
      verificationStatus: "PROTOTYPE",
    },
  ],
}

export const description: SourcedValue<string> = {
  value:
    "Aerospace engineering and manufacturing company providing aero engine tooling, precision aerospace components, and MRO tooling.",
  sourceType: "LEGACY_WEBSITE",
  sourceRef: LEGACY_OVERVIEW,
  verificationStatus: "SOURCE_SUPPORTED",
  notes: "Compressed from legacy overview. Do not strengthen to named OEM supplier.",
}

export const coreExpertise: SourcedValue<string[]> = {
  value: [
    "Aero Engine Tooling",
    "Precision Aerospace Components",
    "MRO Tooling Solutions",
    "Integrated Engineering & Manufacturing",
    "Support for Global OEMs & Aerospace Supply Chains",
    "Quality-Driven Manufacturing",
  ],
  sourceType: "LEGACY_WEBSITE",
  sourceRef: LEGACY_OVERVIEW,
  verificationStatus: "OWNER_VERIFICATION_REQUIRED",
  notes: "“Support for Global OEMs” is not proof of named customer relationships.",
}

/** Legacy overview work areas, excluding OEM-relationship wording. For public pages only. */
export const publicWorkAreas = coreExpertise.value.filter((item) => !/oem/i.test(item))

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
    "To enable the world's most critical aerospace programs through precision manufacturing, engineering partnership, and an uncompromising commitment to quality and delivery.",
  sourceType: "CURRENT_PROJECT",
  sourceRef: "src/pages/About.tsx",
  verificationStatus: "PROTOTYPE",
  notes: "Not found on reviewed legacy pages. Not for public promotion as verified.",
}

export const vision: SourcedValue<string> = {
  value:
    "To be recognized as Asia's most trusted aerospace manufacturing partner — synonymous with engineering precision, innovation, and zero-defect delivery.",
  sourceType: "CURRENT_PROJECT",
  sourceRef: "src/pages/About.tsx",
  verificationStatus: "PROTOTYPE",
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
  sourceType: SourcedValue<string>["sourceType"]
  sourceRef?: string
  verificationStatus: VerificationStatus
}

export const leadership = {
  verificationStatus: "CONFLICTING" as const,
  notes:
    "CONFLICTING — OWNER VERIFICATION REQUIRED. Two different teams. Do not choose a public leadership set.",
  legacyTeam: [
    {
      name: "Chakrapani M / Chakrapani Muppala",
      title: "Founder and Managing Director",
      summary: "Published on the legacy leadership page as leading strategic growth in tooling and component manufacturing.",
      sourceType: "LEGACY_WEBSITE" as const,
      sourceRef: LEGACY_LEADERSHIP,
      verificationStatus: "OWNER_VERIFICATION_REQUIRED" as const,
    },
    {
      name: "Beerappa K",
      title: "Director - Finance",
      summary: "Legacy page states over 18 years of experience in manufacturing-industry finance.",
      sourceType: "LEGACY_WEBSITE" as const,
      sourceRef: LEGACY_LEADERSHIP,
      verificationStatus: "OWNER_VERIFICATION_REQUIRED" as const,
    },
    {
      name: "Manjunatha S",
      title: "Director - Projects",
      summary: "Legacy page states over 27 years of experience in aerospace and automotive.",
      sourceType: "LEGACY_WEBSITE" as const,
      sourceRef: LEGACY_LEADERSHIP,
      verificationStatus: "OWNER_VERIFICATION_REQUIRED" as const,
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
