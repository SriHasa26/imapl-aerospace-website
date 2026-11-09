import { type ImageKey } from "./assets"
import { offices } from "./contact"
import { namedLegacyMachines } from "./capabilities"
import {
  LEGACY_FACILITIES,
  type MaybeConflicting,
  type SourceMeta,
  type SourcedValue,
} from "./types"

export { namedLegacyMachines }

export interface FacilityLocation extends SourceMeta {
  id: string
  label: string
  lines: string[]
  image?: ImageKey
}

export const legacyLocations: FacilityLocation[] = offices.map((office) => ({
  id: office.id,
  label: office.label,
  lines: office.lines,
  sourceType: office.sourceType,
  sourceRef: office.sourceRef,
  verificationStatus: office.verificationStatus,
  notes: office.notes,
  image: office.id === "peenya-corporate" ? "facilityImage" : undefined,
}))

export const prototypeHyderabadCampus: FacilityLocation = {
  id: "hyderabad-tsiic-prototype",
  label: "TSIIC Aerospace Park, Hyderabad (prototype)",
  lines: [
    "Plot 42, TSIIC Aerospace Park",
    "Adibatla, Hyderabad — 501506",
    "Telangana, India",
  ],
  image: "facilityImage",
  sourceType: "CURRENT_PROJECT",
  sourceRef: "src/pages/Facilities.tsx",
  verificationStatus: "PROTOTYPE",
  notes: "CONFLICTING with legacy Bengaluru offices. Not selected as the headquarters.",
}

export const prototypeLocationNarrative: SourcedValue<string> = {
  value:
    "Located at TSIIC Aerospace Park in Adibatla, Hyderabad — India's designated aerospace manufacturing cluster under the National Civil Aviation Policy. The park provides dedicated infrastructure, uninterrupted power, and direct highway access for oversize cargo movements.",
  sourceType: "CURRENT_PROJECT",
  sourceRef: "src/pages/Facilities.tsx",
  verificationStatus: "PROTOTYPE",
  notes: "Hyderabad campus story. Conflicts with legacy Bengaluru + Ajman contact information. Not for public display.",
}

export const prototypeLocationFacts: Array<SourceMeta & { label: string; value: string }> = [
  {
    label: "Address",
    value: "Plot 42, TSIIC Aerospace Park, Adibatla, Hyderabad — 501506",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Facilities.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    label: "Nearest Airport",
    value: "Rajiv Gandhi International Airport, 22 km",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Facilities.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    label: "Road Access",
    value: "NH-44, 8 km from Outer Ring Road",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Facilities.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    label: "Power Supply",
    value: "3-phase, 1MW dedicated feeder",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Facilities.tsx",
    verificationStatus: "PROTOTYPE",
  },
]

export const facilityArea: MaybeConflicting<string> = {
  verificationStatus: "CONFLICTING",
  notes: "CONFLICTING — OWNER VERIFICATION REQUIRED. Legacy facilities page publishes no area. Prototype uses 45,000 sq ft and a 30,000 sq ft Phase 2 figure.",
  candidates: [
    {
      value: "Not published",
      sourceType: "LEGACY_WEBSITE",
      sourceRef: LEGACY_FACILITIES,
      verificationStatus: "MISSING",
    },
    {
      value: "45,000 sq ft",
      sourceType: "CURRENT_PROJECT",
      sourceRef: "src/pages/Facilities.tsx",
      verificationStatus: "PROTOTYPE",
    },
  ],
}

export const prototypeHeroStats: Array<SourceMeta & { val: string; unit: string; label: string }> = [
  { val: "45,000", unit: "Sq Ft", label: "Total Facility Area", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Facilities.tsx", verificationStatus: "PROTOTYPE", notes: "Same conflict as facilityArea." },
  { val: "38", unit: "Machines", label: "CNC & Fabrication", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Facilities.tsx", verificationStatus: "PROTOTYPE" },
  { val: "3", unit: "Autoclaves", label: "Composite Cure", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Facilities.tsx", verificationStatus: "PROTOTYPE" },
  { val: "TSIIC", unit: "Location", label: "Aerospace Park, Hyd", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Facilities.tsx", verificationStatus: "PROTOTYPE", notes: "Conflicts with Bengaluru + Ajman." },
]

export interface PrototypeBay extends SourceMeta {
  num: string
  name: string
  area: string
  machines: string
  detail: string
  image: ImageKey
}

export const prototypeBays: PrototypeBay[] = [
  {
    num: "01",
    name: "CNC Machining Bay",
    area: "12,000 sq ft",
    machines: "18 CNC machines",
    detail: "5-axis DMU-series machining centers, in-process Renishaw probing, swarf management, and climate-controlled environment for tight-tolerance work.",
    image: "cncMachineImage",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Facilities.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    num: "02",
    name: "Sheet Metal Shop",
    area: "6,000 sq ft",
    machines: "6 kW fiber laser, CNC press brake",
    detail: "Dedicated sheet metal fabrication area with laser cutting, press braking, hydroforming cell, and MIG/TIG welding stations.",
    image: "machiningImage",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Facilities.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    num: "03",
    name: "Composite Manufacturing",
    area: "4,500 sq ft",
    machines: "4m autoclave, OOA cure",
    detail: "Temperature-controlled lay-up room (18°C, <50% RH), 4-meter autoclave, vacuum bagging stations, and post-cure trimming area.",
    image: "manufacturingImage",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Facilities.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    num: "04",
    name: "Assembly Bays",
    area: "8,000 sq ft",
    machines: "3 × dedicated bays",
    detail: "Three 2,600 sq ft structural assembly bays with overhead gantry cranes, assembly jigs, drill templates, and sealant application stations.",
    image: "facilityImage",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Facilities.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    num: "05",
    name: "Surface Treatment Plant",
    area: "5,000 sq ft",
    machines: "NADCAP-accredited",
    detail: "NADCAP-accredited surface treatment facility including anodizing tanks (Type I, II, III), chemical conversion, HVOF thermal spray, and spray painting booth.",
    image: "facilityGalleryImage",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Facilities.tsx",
    verificationStatus: "HIGH_RISK",
  },
  {
    num: "06",
    name: "Quality & Metrology Lab",
    area: "2,500 sq ft",
    machines: "Zeiss CMM + NDT",
    detail: "Climate-controlled metrology laboratory with Zeiss Contura CMM, digital X-ray, phased array UT, eddy current, and liquid penetrant inspection stations.",
    image: "qualityImage",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Facilities.tsx",
    verificationStatus: "HIGH_RISK",
  },
]

export const prototypeExpansion: SourceMeta & {
  phaseLabel: string
  headline: string
  detail: string
  stats: Array<{ val: string; label: string }>
} = {
  phaseLabel: "Phase 3 — 2025/26",
  headline: "Expanding to 80,000 Sq Ft",
  detail:
    "Phase 3 expansion will add a dedicated defense manufacturing wing, a second autoclave, 10 additional CNC machining centers, and a Class 1000 cleanroom for satellite assembly.",
  stats: [
    { val: "80K", label: "Total Sq Ft Post Expansion" },
    { val: "+10", label: "New CNC Machines" },
    { val: "1 × 6m", label: "New Autoclave" },
    { val: "2026", label: "Target Completion" },
  ],
  sourceType: "CURRENT_PROJECT",
  sourceRef: "src/pages/Facilities.tsx",
  verificationStatus: "HIGH_RISK",
  notes: "Unverified expansion, defense wing, and satellite-assembly claims. Not for public display.",
}

export const facilityLocationConflict: MaybeConflicting<string> = {
  verificationStatus: "CONFLICTING",
  notes: "CONFLICTING — OWNER VERIFICATION REQUIRED. Do not merge Hyderabad and Bengaluru into one campus.",
  candidates: [
    {
      value: "Bengaluru Peenya + Thigalarapalya; Ajman UAE",
      sourceType: "LEGACY_WEBSITE",
      sourceRef: "https://imapl.co.in/contact-us",
      verificationStatus: "OWNER_VERIFICATION_REQUIRED",
    },
    {
      value: "TSIIC Aerospace Park, Adibatla, Hyderabad",
      sourceType: "CURRENT_PROJECT",
      sourceRef: "src/pages/Facilities.tsx",
      verificationStatus: "PROTOTYPE",
    },
  ],
}

/** Local IMAPL photographs for the Facilities page. Not a claim about bay count. */
export const facilityPhotoKeys: ImageKey[] = [
  "facilityImage",
  "facilitySecondaryImage",
  "facilityMroToolingImage",
  "loadTestDeadWeight",
  "cncMachineImage",
  "assemblyImage",
  "facilityGalleryImage",
  "workshopImage",
  "workshopSecondaryImage",
  "loadTestDigitalScale",
]

/**
 * Short copy for the public 01–10 photo tour.
 * Index 0 is omitted so Facilities keeps the existing Aero Engine Tooling description.
 * Names for later slides follow public work areas, then the existing "Manufacturing" fallback.
 */
export const facilityPhotoTourDetails: Array<string | undefined> = [
  undefined,
  "Precision-machined aerospace components manufactured to demanding dimensional and quality requirements.",
  "Reliable tooling solutions designed for aircraft maintenance, repair, overhaul, and servicing operations.",
  "Dead-weight load testing of aerospace tools, fixtures, and structural assemblies.",
  "Precision jigs and fixtures designed for accurate positioning, assembly, inspection, and repeatable production.",
  "Quality-focused manufacturing supported by controlled processes, inspection, and precision verification.",
  "Advanced manufacturing capabilities for precision aerospace components, tooling, and engineered assemblies.",
  "CNC machining, precision inspection systems, and process-driven manufacturing workflows.",
  "Process-controlled manufacturing for aerospace tooling, precision components, and sub-assemblies.",
  "Load testing with a digital crane scale for aerospace tools, fixtures, and assemblies.",
]

export const facilities = {
  locationConflict: facilityLocationConflict,
  legacyLocations,
  prototypeHyderabadCampus,
  prototypeLocationNarrative,
  prototypeLocationFacts,
  facilityArea,
  prototypeHeroStats,
  legacyEquipment: namedLegacyMachines,
  prototypeBays,
  prototypeExpansion,
  images: facilityPhotoKeys,
}
