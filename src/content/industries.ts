import { type ImageKey } from "./assets"
import { LEGACY_TOOLING, type SourceMeta } from "./types"

/**
 * Industry is stored separately from program, customer, and OEM.
 * Prototype industry cards exist on the current site; legacy has no equivalent taxonomy.
 */

export interface IndustryRecord extends SourceMeta {
  id: string
  industry: string
  description: string
  image?: ImageKey
  workAreas?: string[]
}

export const industries: IndustryRecord[] = [
  {
    id: "aerospace-manufacturing",
    industry: "Aerospace manufacturing",
    description: "Aerospace manufacturing partner for aero-engine tooling, precision components, MRO tooling, and related ground support equipment.",
    workAreas: ["Aero Engine Tooling", "Precision Aerospace Components", "MRO Tooling"],
    image: "cncMachineImage",
    sourceType: "LEGACY_WEBSITE",
    sourceRef: "https://imapl.co.in/overview",
    verificationStatus: "SOURCE_SUPPORTED",
  },
  {
    id: "mro",
    industry: "MRO",
    description: "MRO tooling is listed on the legacy overview and tooling pages. Prototype MRO/aftermarket program claims are not included here.",
    workAreas: ["MRO Tooling"],
    image: "mroTooling",
    sourceType: "LEGACY_WEBSITE",
    sourceRef: "https://imapl.co.in/overview",
    verificationStatus: "SOURCE_SUPPORTED",
  },
  {
    id: "ground-support",
    industry: "Ground Support",
    description: "Aerospace ground support equipment categories listed on the legacy tooling page: On-Wing Support Equipment, Tripod Jacks, Axle Jacks, Tow Bars, Nacelle Tooling, and Aircraft Access Platforms.",
    workAreas: ["Ground Support Equipment", "Nacelle Tooling", "Aircraft Access Platforms"],
    image: "gse",
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_TOOLING,
    verificationStatus: "SOURCE_SUPPORTED",
  },
]

export const prototypeIndustries: IndustryRecord[] = [
  {
    id: "commercial-aviation",
    industry: "Commercial Aviation",
    description: "Prototype Industries page. Named airframes and OTD statistics are not copied into program entities as facts.",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Industries.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    id: "defense-military",
    industry: "Defense & Military",
    description: "Prototype Industries page. ITAR / classified / missile language is HIGH_RISK and is not promoted.",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Industries.tsx",
    verificationStatus: "HIGH_RISK",
  },
  {
    id: "space-satellites",
    industry: "Space & Satellites",
    description: "Prototype Industries page. ISRO / OneWeb program names are not stored as verified programs.",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Industries.tsx",
    verificationStatus: "HIGH_RISK",
  },
  {
    id: "helicopter-rotorcraft",
    industry: "Helicopter & Rotorcraft",
    description: "Prototype Industries page only.",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Industries.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    id: "uav-autonomous",
    industry: "UAV & Autonomous",
    description: "Prototype Industries page only.",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Industries.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    id: "mro-aftermarket-prototype",
    industry: "MRO & Aftermarket",
    description: "Prototype expands MRO into DGCA MOA and AOG claims. Those claims are HIGH_RISK.",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Industries.tsx",
    verificationStatus: "HIGH_RISK",
  },
]

export const prototypeIndustryCards: Array<SourceMeta & {
  id: string
  title: string
  sub: string
  unsplashId: string
  desc: string
  programs: string[]
  stats: Array<[string, string]>
}> = [
  {
    id: "01",
    title: "Commercial Aviation",
    sub: "Narrowbody & Widebody Programs",
    unsplashId: "photo-1674897537555",
    desc: "We supply certified airframe structures, interior structural components, and precision machined parts to Tier-1 suppliers of major commercial aircraft programs. Our AS9100D-controlled processes and proven delivery performance make us a reliable Tier-2 partner.",
    programs: ["A320neo family (CFM LEAP components)", "B737 MAX nacelle structures", "Regional jet (ATR, Embraer) brackets", "Business jet (Bombardier, Gulfstream) panels"],
    stats: [["Tier-1 Customers", "12+"], ["Parts On-Program", "480+"], ["On-Time Rate", "98.9%"]],
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Industries.tsx",
    verificationStatus: "HIGH_RISK",
  },
  {
    id: "02",
    title: "Defense & Military",
    sub: "Mission-Critical Aerospace Systems",
    unsplashId: "photo-1520870121499",
    desc: "Defense programs demand absolute precision and zero tolerance for failure. We are DGCA-approved and work within ITAR-compliant processes for defense-classified components. Our experience spans fighter aircraft, surveillance systems, and missile programs.",
    programs: ["LCA Tejas Mk1A structural components (HAL)", "MALE/HALE UAV airframe structures", "Short-range missile body sections", "Defense helicopter (ALH Dhruv) brackets"],
    stats: [["Defense Programs", "8 active"], ["Classified Parts", "ITAR Ready"], ["Defect Escapes", "Zero"]],
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Industries.tsx",
    verificationStatus: "HIGH_RISK",
  },
  {
    id: "03",
    title: "Space & Satellites",
    sub: "Launch Vehicles & Orbital Platforms",
    unsplashId: "photo-1469289759076",
    desc: "Space hardware operates in the harshest environment imaginable. Our ultra-clean assembly bays, CFRP composite capability, and high-precision machining make us a trusted supplier for small satellite structures, launch vehicle components, and ground support equipment.",
    programs: ["Small satellite (50–500kg class) primary structure", "ISRO PSLV secondary payload adapters", "OneWeb-class constellation panels", "Space debris mitigation hardware"],
    stats: [["Space Programs", "4 active"], ["Clean Class", "ISO 7 Cleanroom"], ["Mass Accuracy", "<0.5% target"]],
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Industries.tsx",
    verificationStatus: "HIGH_RISK",
  },
  {
    id: "04",
    title: "Helicopter & Rotorcraft",
    sub: "Structural & Dynamic Components",
    unsplashId: "photo-1540575861501",
    desc: "Rotorcraft require a unique combination of lightweight structures and high-fatigue-life components. We manufacture tail boom structures, airframe frames, composite rotor fairings, and precision machined dynamic components for civil and military helicopter programs.",
    programs: ["ALH Dhruv helicopter structural frames", "Light Utility Helicopter (LUH) components", "Civil helicopter (AW139, EC135) accessories", "Unmanned rotorcraft airframe structures"],
    stats: [["Helicopter OEMs", "6 customers"], ["Dynamic Parts", "Fatigue-tested"], ["Finish", "Epoxy primer + topcoat"]],
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Industries.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    id: "05",
    title: "UAV & Autonomous Systems",
    sub: "Fixed-Wing, VTOL & Multirotor Platforms",
    unsplashId: "photo-1514598800938",
    desc: "The UAV sector demands rapid development cycles, lightweight structures, and multi-material manufacturing. We design and manufacture complete airframe structures, integrate payloads, and deliver certified platforms for defense, surveillance, and commercial applications.",
    programs: ["MALE-class fixed-wing surveillance UAV", "VTOL cargo delivery platform", "Tactical mini-UAV strike airframe", "Agricultural spray multirotor structure"],
    stats: [["UAV Programs", "11 delivered"], ["Lightest Platform", "3.2 kg MTOW"], ["Max Wingspan", "5.8 m"]],
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Industries.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    id: "06",
    title: "MRO & Aftermarket",
    sub: "Repair, Overhaul & Spare Parts",
    unsplashId: "photo-1598621961279",
    desc: "Aircraft don't stop needing parts once they enter service. Our DGCA-approved maintenance organization provides certified repair, overhaul, and spare parts supply for structural components, machined parts, and composite panels across commercial and military fleets.",
    programs: ["Structural repair per SRM", "Composite repair (wet layup, prepreg)", "Machined spare parts on-demand", "AOG expedite capability"],
    stats: [["DGCA Approval", "MOA-2021-0042"], ["AOG Response", "<72 hrs"], ["Repair Programs", "35+ types"]],
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Industries.tsx",
    verificationStatus: "HIGH_RISK",
  },
]

export interface NamedEntity extends SourceMeta {
  kind: "oem" | "customer" | "program"
  name: string
  claim: string
}

export const namedEntities: NamedEntity[] = [
  {
    kind: "oem",
    name: "GE, Safran, Rolls-Royce, Boeing, Airbus, Dassault Aviation, Lockheed Martin",
    claim: "Legacy tooling page: official tooling vendor for licensees since 2017.",
    sourceType: "LEGACY_WEBSITE",
    sourceRef: "https://imapl.co.in/tooling-1",
    verificationStatus: "HIGH_RISK",
  },
  {
    kind: "program",
    name: "Boeing 737–787, CFM LEAP, GE NX, Rolls-Royce Trent",
    claim: "Named on the legacy tooling page as platforms for tooling.",
    sourceType: "LEGACY_WEBSITE",
    sourceRef: "https://imapl.co.in/tooling-1",
    verificationStatus: "HIGH_RISK",
  },
  {
    kind: "customer",
    name: "HAL / LCA Tejas",
    claim: "Prototype supplier / Tier-2 / 83-aircraft claims.",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Home.tsx",
    verificationStatus: "HIGH_RISK",
  },
  {
    kind: "customer",
    name: "ISRO / NSIL",
    claim: "Prototype satellite structural program claims.",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Products.tsx",
    verificationStatus: "HIGH_RISK",
  },
  {
    kind: "program",
    name: "A320neo",
    claim: "Prototype door-surround SKU and wing-kit case study.",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Products.tsx",
    verificationStatus: "HIGH_RISK",
  },
]
