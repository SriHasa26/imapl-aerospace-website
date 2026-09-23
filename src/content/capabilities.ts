import { type ImageKey } from "./assets"
import {
  COMPANY_PROFILE_2026,
  LEGACY_INSPECTION,
  LEGACY_LOAD_TEST,
  LEGACY_MACHINING,
  LEGACY_PART_MARKING,
  LEGACY_PRECISION,
  LEGACY_TOOLING,
  isPublishable,
  type SourceMeta,
} from "./types"

export interface CapabilityRecord extends SourceMeta {
  id: string
  title: string
  description: string
  technicalDetails: string[]
  equipment: string[]
  materials: string[]
  image?: ImageKey
}

export const capabilities: CapabilityRecord[] = [
  {
    id: "cnc-machining",
    title: "CNC Machining",
    description: "3, 4 and 5-axis CNC machining of aerospace components, with CAD/CAM and process planning under one roof.",
    technicalDetails: ["3-axis", "4-axis", "5-axis", "CAD / CAM & process planning", "Product size 3 mm–1250 mm"],
    equipment: [],
    materials: ["Aluminium", "Titanium", "Steels", "Nickel-based superalloys", "Stainless steel"],
    image: "cncMachineImage",
    sourceType: "OWNER_DOCUMENT",
    sourceRef: COMPANY_PROFILE_2026,
    verificationStatus: "SOURCE_SUPPORTED",
    notes: "Axes and size summary from the precision page. Equipment list is stored separately and is not treated as current verified fleet.",
  },
  {
    id: "3-axis-machining",
    title: "3-axis machining",
    description: "Listed on the legacy precision summary as 3, 4, 5 axis CNC machining.",
    technicalDetails: ["3-axis"],
    equipment: [],
    materials: [],
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_PRECISION,
    verificationStatus: "SOURCE_SUPPORTED",
  },
  {
    id: "4-axis-machining",
    title: "4-axis machining",
    description: "4-axis machining of Aluminium, Inconel and Nimonic, product sizes 20 mm to 500 mm on the multi-axis section; also listed in the 3, 4, 5 axis summary.",
    technicalDetails: ["4-axis", "20 mm to 500 mm"],
    equipment: [],
    materials: ["Aluminium", "Inconel", "Nimonic"],
    image: "multiAxisComponents",
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_PRECISION,
    verificationStatus: "SOURCE_SUPPORTED",
  },
  {
    id: "5-axis-machining",
    title: "5-axis machining",
    description: "5-axis machining of aluminium, titanium, steels, and nickel-based superalloys. Component sizes 3 mm to 1250 mm.",
    technicalDetails: ["5-axis", "3 mm to 1250 mm"],
    equipment: [],
    materials: ["Aluminium", "Titanium", "Steels", "Nickel-based superalloys"],
    image: "cncMachineImage",
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_PRECISION,
    verificationStatus: "SOURCE_SUPPORTED",
    notes: "Do not attach prototype ±0.005 mm or DMU fleet values.",
  },
  {
    id: "turning",
    title: "Turning",
    description: "Turning machines and turning fixtures are named on the legacy machining and tooling pages.",
    technicalDetails: ["Turning fixtures"],
    equipment: ["Tsugami VA3", "Tsugami M08J", "Askar Spinner 22", "Hyundai Wia LV8508R"],
    materials: [],
    image: "cncTurningImage",
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_MACHINING,
    verificationStatus: "OWNER_VERIFICATION_REQUIRED",
    notes: "Named lathes are source-supported as published, not confirmed as the current floor list.",
  },
  {
    id: "fabrication",
    title: "Fabrication",
    description: "Machining & Fabrication page. TIG welding is mentioned. Materials listed: carbon steel, stainless steel, high alloy, aluminium.",
    technicalDetails: ["TIG welding"],
    equipment: [],
    materials: ["carbon steel", "stainless steel", "high alloy", "aluminium"],
    image: "tigWeldingImage",
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_MACHINING,
    verificationStatus: "OWNER_VERIFICATION_REQUIRED",
    notes: "AWS certified welders claim is HIGH_RISK and is not stored as a verified capability attribute.",
  },
  {
    id: "tooling",
    title: "Tooling",
    description: "Airframe and aero-engine tooling, including build, strip and maintenance tooling. Tool sizes from 10 mm to 4+ meters, with positional tolerances below 20 microns on diameters over 1 m.",
    technicalDetails: ["Tool sizes 10 mm to 4+ meters", "Positional tolerances below 20 microns on >1 m diameters"],
    equipment: [],
    materials: [],
    image: "productAeroEngineTooling",
    sourceType: "OWNER_DOCUMENT",
    sourceRef: COMPANY_PROFILE_2026,
    verificationStatus: "SOURCE_SUPPORTED",
  },
  {
    id: "jigs-fixtures",
    title: "Jigs & Fixtures",
    description: "Turning, milling, welding, EDM, and inspection fixtures designed for complex geometries and process stability.",
    technicalDetails: ["Milling", "Turning", "Welding", "Assembly", "CMM", "Heat treatment", "EDM", "Inspection"],
    equipment: [],
    materials: [],
    image: "mroTooling",
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_TOOLING,
    verificationStatus: "SOURCE_SUPPORTED",
  },
  {
    id: "assembly",
    title: "Assembly",
    description: "Precise assembly to meet functional and performance requirements, supported by dedicated assembly fixtures.",
    technicalDetails: ["Assembly fixtures", "Functional and performance requirements"],
    equipment: [],
    materials: [],
    image: "assemblyImage",
    sourceType: "OWNER_DOCUMENT",
    sourceRef: COMPANY_PROFILE_2026,
    verificationStatus: "SOURCE_SUPPORTED",
  },
  {
    id: "inspection",
    title: "Inspection",
    description: "In-process and final inspection, including dimensional and geometric verification, CMM programming, stage inspection, NDT, and pre-dispatch inspection.",
    technicalDetails: [
      "Dimensional measurement",
      "Geometric measurement",
      "CMM programming & stage inspection",
      "NDT",
      "Pre-dispatch inspection",
    ],
    equipment: [],
    materials: [],
    image: "inspectionEquipment",
    sourceType: "OWNER_DOCUMENT",
    sourceRef: COMPANY_PROFILE_2026,
    verificationStatus: "SOURCE_SUPPORTED",
  },
  {
    id: "cmm",
    title: "CMM",
    description: "MITUTOYO CMM CRYSTA-Apex S7106 is named on the legacy inspection page.",
    technicalDetails: ["1.7 μm class", "Temperature compensation system", "SP25M", "MCOSMOS"],
    equipment: ["MITUTOYO CMM CRYSTA-Apex S7106"],
    materials: [],
    image: "inspectionCmmCrysta",
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_INSPECTION,
    verificationStatus: "OWNER_VERIFICATION_REQUIRED",
    notes: "Do not substitute Zeiss Contura from the prototype.",
  },
  {
    id: "load-testing",
    title: "Load Testing",
    description: "Load testing of aerospace tools, fixtures, and structural assemblies per customer specification.",
    technicalDetails: ["Dead weight load test", "Load test with digital scale"],
    equipment: [],
    materials: [],
    image: "loadTestDigitalScale",
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_LOAD_TEST,
    verificationStatus: "SOURCE_SUPPORTED",
  },
  {
    id: "part-marking",
    title: "Part Marking",
    description: "Chemical etching, dot peening, laser marking, and screen printing as specified for the component.",
    technicalDetails: ["Chemical etching", "Dot peening", "Laser marking as per customer specification", "Screen printing"],
    equipment: [],
    materials: [],
    image: "partMarkingImage",
    sourceType: "OWNER_DOCUMENT",
    sourceRef: COMPANY_PROFILE_2026,
    verificationStatus: "SOURCE_SUPPORTED",
    notes: "GE P23TF3 is HIGH_RISK and is not stored as an authorized process here.",
  },
]

export const edmNote: SourceMeta = {
  sourceType: "OWNER_DOCUMENT",
  sourceRef: COMPANY_PROFILE_2026,
  verificationStatus: "SOURCE_SUPPORTED",
  notes: "2026 profile lists turning, grinding, EDM and welding in the manufacturing backbone. Named EDM machines are not published.",
}

export const heatTreatmentNote: SourceMeta = {
  sourceType: "LEGACY_WEBSITE",
  sourceRef: LEGACY_TOOLING,
  verificationStatus: "OWNER_VERIFICATION_REQUIRED",
  notes: "Heat-treatment fixtures are named. In-house heat treatment and NADCAP HT are not treated as verified.",
}

export const namedLegacyMachines: SourceMeta & { names: string[] } = {
  names: [
    "Cosmos CVM800 (3/4 axis)",
    "Mitsubishi 500×1000×600",
    "Hurco VM20i",
    "Hurco VM10i",
    "Philips PVM1050 5-axis (×2)",
    "Philips PVM1150 (×4)",
    "PDC2232 5-axis double column",
    "Tsugami VA3",
    "Tsugami M08J",
    "Askar Spinner 22",
    "Hyundai Wia LV8508R",
  ],
  sourceType: "LEGACY_WEBSITE",
  sourceRef: LEGACY_MACHINING,
  verificationStatus: "OWNER_VERIFICATION_REQUIRED",
  notes: "Published on the legacy machining page. Not automatically current.",
}

export const prototypeCapabilities: Array<SourceMeta & { id: string; title: string }> = [
  { id: "dmu-5-axis-fleet", title: "18 × DMU 85 / 125 monoBLOCK", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Capabilities.tsx", verificationStatus: "PROTOTYPE" },
  { id: "sheet-metal-hydroform", title: "6 kW fiber laser / hydroforming shop", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Capabilities.tsx", verificationStatus: "PROTOTYPE" },
  { id: "composites-autoclave", title: "4 m autoclave composite manufacturing", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Capabilities.tsx", verificationStatus: "PROTOTYPE" },
  { id: "nadcap-surface-treatment", title: "NADCAP-accredited surface treatment plant", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Capabilities.tsx", verificationStatus: "HIGH_RISK" },
  { id: "zeiss-ndt-lab", title: "Zeiss Contura CMM and NADCAP NDT lab", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Capabilities.tsx", verificationStatus: "HIGH_RISK" },
]

/**
 * Existing deep-link anchors. Footer and Navigation still point at these IDs.
 * Section copy is composed only from publishable CapabilityRecord rows.
 */
export interface CapabilityPageSection {
  id: "01" | "02" | "03" | "04" | "05" | "06"
  anchorId: "cap-01" | "cap-02" | "cap-03" | "cap-04" | "cap-05" | "cap-06"
  capabilityIds: string[]
}

export const capabilityPageSections: CapabilityPageSection[] = [
  { id: "01", anchorId: "cap-01", capabilityIds: ["5-axis-machining", "cnc-machining", "4-axis-machining", "3-axis-machining"] },
  { id: "02", anchorId: "cap-02", capabilityIds: ["tooling"] },
  { id: "03", anchorId: "cap-03", capabilityIds: ["jigs-fixtures"] },
  { id: "04", anchorId: "cap-04", capabilityIds: ["assembly"] },
  { id: "05", anchorId: "cap-05", capabilityIds: ["part-marking"] },
  { id: "06", anchorId: "cap-06", capabilityIds: ["inspection", "load-testing"] },
]

/** Labels for Navigation and Footer. Hashes stay on the existing cap-01…cap-06 anchors. */
export function publicCapabilityNavItems(): Array<{ label: string; sub: string; hash: string }> {
  const unique = (values: string[]) => [...new Set(values.filter(Boolean))]
  return capabilityPageSections.flatMap((section) => {
    const records = section.capabilityIds
      .map((id) => capabilities.find((capability) => capability.id === id))
      .filter((capability): capability is CapabilityRecord =>
        capability != null && isPublishable(capability.verificationStatus),
      )
    const primary = records[0]
    if (!primary) return []
    const details = unique(records.flatMap((record) => record.technicalDetails))
    return [{
      label: primary.title,
      sub: details.slice(0, 3).join(" · ") || primary.title,
      hash: `#${section.anchorId}`,
    }]
  })
}

export const prototypeCapabilitySections: Array<SourceMeta & {
  id: string
  title: string
  tagline: string
  desc: string
  specs: Array<[string, string]>
  items: string[]
}> = [
  {
    id: "01",
    title: "5-Axis CNC Machining",
    tagline: "Sub-micron precision on complex aerospace geometries",
    desc: "Our 5-axis machining center operates a fleet of 18 DMU-series machines capable of complete part machining in a single setup. We routinely produce complex aerospace geometries in titanium, Inconel, aluminium alloys, and stainless steel to tolerances of ±0.005mm.",
    specs: [["Machines", "18 × DMU 85 / 125 monoBLOCK"], ["Work Envelope", "Up to 1500 × 1000 × 700mm"], ["Spindle Speed", "Up to 18,000 RPM"], ["Positioning Accuracy", "±0.002mm"], ["Materials", "Ti-6Al-4V, Inconel 718, 7075-T6, 15-5PH"], ["Programming", "CATIA V5 / NX CAM"]],
    items: ["Complex multi-face machining in single setup", "In-process probing and auto-compensation", "DCC CMM verification post-machining", "Full 3D model-based definition (MBD) workflow"],
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Capabilities.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    id: "02",
    title: "Sheet Metal Fabrication",
    tagline: "Precision forming of aerostructure panels and assemblies",
    desc: "Our sheet metal shop combines high-power fiber laser cutting, CNC press brakes, and hydroforming to produce complex formed panels, brackets, skins, and enclosures to tight aerospace tolerances.",
    specs: [["Laser Cutting", "6kW fiber laser, 4000 × 2000mm"], ["Forming", "CNC press brake, 300T capacity"], ["Hydroforming", "Up to 10,000 psi fluid pressure"], ["Thickness Range", "0.4mm to 12mm"], ["Materials", "Al 2024, 7075, Ti sheet, CRES"], ["Welding", "TIG, MIG, plasma, resistance"]],
    items: ["Flat pattern development from CATIA models", "Matched-hole drilling and edge preparation", "Sealant application per AMS 2270", "Full dimensional report to drawing"],
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Capabilities.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    id: "03",
    title: "Composite Manufacturing",
    tagline: "CFRP and hybrid composite structures for primary aerostructures",
    desc: "Our composite shop is equipped with a 4-meter autoclave, out-of-autoclave (OOA) cure capability, and a temperature-controlled lay-up room. We manufacture primary and secondary composite structures from pre-preg and wet layup processes.",
    specs: [["Autoclave", "4m × 2m, 8 bar, 200°C"], ["OOA Capability", "LRTM, RTM, VARI processes"], ["Materials", "Toray, Hexcel, SGL CFRP pre-preg"], ["NDT Post-Cure", "Ultrasonic C-scan, radiography"], ["Cores", "Nomex, aluminium honeycomb, foam"], ["Surface Finish", "Class A to flight quality"]],
    items: ["Autoclave cure per OEM material specs", "Controlled lay-up room at 18°C, <50% RH", "Post-cure bond integrity by UT C-scan", "Co-cured and co-bonded assemblies"],
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Capabilities.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    id: "04",
    title: "Assembly & Integration",
    tagline: "Structural and systems assembly of complex multi-part assemblies",
    desc: "Our assembly bay handles structural assembly of large aerostructure kits and systems integration of complex multi-part assemblies. We work from engineering data packages, tooling concepts, and ICD documents to deliver complete assemblies ready for functional test.",
    specs: [["Bay Area", "3 × 1,200 sq m assembly bays"], ["Tooling", "Custom jigs, fixtures, drill templates"], ["Fastening", "Lockbolt, Hi-Lok, blind rivet, NAS"], ["Sealing", "PR-1776, EC-776, AMS 2270"], ["Interfaces", "Shim fitting, spot-facing, reaming"], ["Documentation", "Full IPC / traveler traceability"]],
    items: ["AS9102 First Article Inspection (FAI)", "Matched-drill assembly processes", "Interface fit verification and shimming", "Electrical bonding and continuity checks"],
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Capabilities.tsx",
    verificationStatus: "PROTOTYPE",
    notes: "AS9102 in the prototype items list is not treated as a verified certification claim.",
  },
  {
    id: "05",
    title: "Surface Treatment",
    tagline: "NADCAP-accredited coatings and surface finishing",
    desc: "Our NADCAP-accredited surface treatment plant provides a full range of aerospace-qualified coatings and finishing processes. Every process is controlled to MIL, AMS, and customer-specific specifications with full traceability.",
    specs: [["Anodizing", "Type I, II, III hard anodize"], ["Chemical Film", "Alodine 1200S, TCP process"], ["Thermal Spray", "HVOF, plasma spray WC-Co, Al2O3"], ["Primer", "Epoxy primer per MIL-PRF-23377"], ["Topcoat", "Polyurethane, MIL-PRF-85285"], ["Accreditation", "NADCAP Heat Treatment & NDT"]],
    items: ["Full process control documentation", "Test panels per every batch", "Thickness measurement and adhesion test", "Certificate of conformance with every order"],
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Capabilities.tsx",
    verificationStatus: "HIGH_RISK",
  },
  {
    id: "06",
    title: "NDT & CMM Inspection",
    tagline: "Zero-compromise dimensional verification and NDE",
    desc: "Our quality lab is equipped with a Zeiss Contura CMM, X-ray radiography, ultrasonic immersion testing, eddy current, and liquid penetrant inspection. All critical features are verified to part drawing and engineering specification.",
    specs: [["CMM", "Zeiss Contura G2 RDS, 700×700×600mm"], ["X-Ray", "Real-time digital radiography, 320kV"], ["UT Immersion", "Olympus Panametrics, 1–25 MHz"], ["Eddy Current", "Olympus OmniScan MX2"], ["Penetrant", "Level III PT/MT technicians"], ["Accreditation", "NADCAP NDT accreditation"]],
    items: ["First Article Inspection to AS9102", "In-process SPC statistical control", "GD&T measurement per ASME Y14.5", "100% dimensional verification on first articles"],
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Capabilities.tsx",
    verificationStatus: "HIGH_RISK",
  },
]
