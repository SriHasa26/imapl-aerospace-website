import { type ImageKey } from "./assets"
import {
  COMPANY_PROFILE_2026,
  LEGACY_INSPECTION,
  LEGACY_LOAD_TEST,
  LEGACY_PART_MARKING,
  type SourceMeta,
  type VerificationStatus,
} from "./types"

export interface CertificationRecord {
  id: string
  certificationName: string
  issuingBody?: string
  certificateNumber?: string
  validFrom?: string
  validUntil?: string
  document?: string
  mentionedOn: string[]
  verificationStatus: VerificationStatus
  sourceType: SourceMeta["sourceType"]
  sourceRef?: string
  notes?: string
}

export const certifications: CertificationRecord[] = [
  {
    id: "as9100",
    certificationName: "AS9100",
    mentionedOn: ["https://imapl.co.in/leadership", "src/pages/Home.tsx", "src/pages/Quality.tsx", "src/components/Footer.tsx"],
    verificationStatus: "SOURCE_SUPPORTED",
    sourceType: "OWNER_DOCUMENT",
    sourceRef: COMPANY_PROFILE_2026,
    notes:
      "2026 company profile: AS9100 Rev D certified processes. Issuing body, certificate number, and dates were not published. Do not add Bureau Veritas or invented dates.",
  },
  {
    id: "iso-9001",
    certificationName: "ISO 9001",
    mentionedOn: ["src/pages/Home.tsx", "src/pages/Quality.tsx", "src/components/Footer.tsx"],
    verificationStatus: "SOURCE_SUPPORTED",
    sourceType: "OWNER_DOCUMENT",
    sourceRef: COMPANY_PROFILE_2026,
    notes: "2026 company profile: ISO 9001 certified processes. Issuing body and dates were not published.",
  },
  {
    id: "nadcap",
    certificationName: "NADCAP",
    mentionedOn: ["src/pages/Quality.tsx", "src/pages/Facilities.tsx", "src/pages/Capabilities.tsx", "src/components/Footer.tsx"],
    verificationStatus: "HIGH_RISK",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Quality.tsx",
    notes: "Not found on reviewed legacy pages. No document in the repository.",
  },
  {
    id: "dgca",
    certificationName: "DGCA",
    mentionedOn: ["src/pages/Home.tsx", "src/pages/Quality.tsx", "src/pages/Industries.tsx", "src/components/Footer.tsx"],
    verificationStatus: "HIGH_RISK",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Quality.tsx",
    notes: "Prototype includes invented MOA-2021-0042 and dates. Those values are not stored.",
  },
]

export interface InspectionEquipment extends SourceMeta {
  name: string
  details: string[]
  image?: ImageKey
}

export const publishedCertifications: Array<SourceMeta & {
  code: string
  name: string
  details: Array<readonly [string, string]>
}> = [
  {
    code: "AS9100 Rev D",
    name: "Aerospace quality management processes",
    details: [["Coverage", "Certified processes as published in the 2026 company profile"]],
    sourceType: "OWNER_DOCUMENT",
    sourceRef: COMPANY_PROFILE_2026,
    verificationStatus: "SOURCE_SUPPORTED",
  },
  {
    code: "ISO 9001",
    name: "Quality management processes",
    details: [["Coverage", "Certified processes as published in the 2026 company profile"]],
    sourceType: "OWNER_DOCUMENT",
    sourceRef: COMPANY_PROFILE_2026,
    verificationStatus: "SOURCE_SUPPORTED",
  },
]

export const inspectionEquipment: InspectionEquipment[] = [
  {
    name: "MITUTOYO CMM CRYSTA-Apex S7106",
    details: ["High accuracy in the 1.7 μm class", "Temperature compensation system", "SP25M (compact high-accuracy scanning probe)", "MCOSMOS"],
    image: "inspectionCmmCrysta",
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_INSPECTION,
    verificationStatus: "OWNER_VERIFICATION_REQUIRED",
  },
  {
    name: "TRIMOS VT1000MA",
    details: ["Measuring range : MM (IN) ;1016 (40)", "Measuring range with extension mm (in) ;1278 (50)", "Measuring in 2D mode"],
    image: "qualityGaugeImage",
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_INSPECTION,
    verificationStatus: "OWNER_VERIFICATION_REQUIRED",
  },
  {
    name: "MITUTOYO Contracer CV-2100",
    details: ["X-axis measuring range - 0-100mm", "Z1-axis measuring range - 0-50mm", "Z2-axis vertical travel – 350mm", "Stylus traceable angle - Ascent 77°, Descent 87°"],
    image: "inspectionContracer",
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_INSPECTION,
    verificationStatus: "OWNER_VERIFICATION_REQUIRED",
  },
  {
    name: "ACCURATE Model VPP 2515 MAZ",
    details: ["Motorized Tele centric Zoom Lens 20x-140x", "1/2\" Sony CCD Camera High Resolution"],
    image: "inspectionVpp",
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_INSPECTION,
    verificationStatus: "OWNER_VERIFICATION_REQUIRED",
  },
]

export const loadTesting: SourceMeta & { methods: string[] } = {
  methods: ["Dead Weight Load Test", "Load Test with Digital Scale"],
  sourceType: "LEGACY_WEBSITE",
  sourceRef: LEGACY_LOAD_TEST,
  verificationStatus: "SOURCE_SUPPORTED",
}

export const partMarking: SourceMeta & { methods: string[] } = {
  methods: ["Chemical Etching", "Dot Peening", "Laser Marking", "Screen Printing"],
  sourceType: "OWNER_DOCUMENT",
  sourceRef: COMPANY_PROFILE_2026,
  verificationStatus: "SOURCE_SUPPORTED",
  notes: "Screen printing appears on precision-component examples in the 2026 profile. GE P23TF3 on etch/peen remains HIGH_RISK.",
}

export const geP23tf3: SourceMeta = {
  sourceType: "LEGACY_WEBSITE",
  sourceRef: LEGACY_PART_MARKING,
  verificationStatus: "HIGH_RISK",
  notes: "Legacy part-marking page: chemical etching and dot peening “per GE P23TF3 standard”.",
}

export const qualityMetricsPrototype: SourceMeta & { items: string[] } = {
  items: ["<0.1% rejection rate", "0 customer escapes", "100% FAI", "0.005mm finest tolerance"],
  sourceType: "CURRENT_PROJECT",
  sourceRef: "src/pages/Quality.tsx",
  verificationStatus: "PROTOTYPE",
}

export const inspectionProcesses: SourceMeta & { methods: string[] } = {
  methods: [
    "Dimensional measurement",
    "Geometric measurement",
    "CMM programming & stage inspection",
    "NDT",
    "Pre-dispatch inspection",
  ],
  sourceType: "OWNER_DOCUMENT",
  sourceRef: COMPANY_PROFILE_2026,
  verificationStatus: "SOURCE_SUPPORTED",
  notes: "Legacy inspection page process list. Named instruments are stored separately and are not treated as the current fleet.",
}

export const prototypeQualityPolicy: SourceMeta & { statement: string; attribution: string } = {
  statement:
    "Igniting Minds Aerospace is committed to delivering aerospace components that meet or exceed customer, statutory, and regulatory requirements — on time, every time, through continuous improvement of our Quality Management System.",
  attribution: "Vikram Reddy, CEO, Igniting Minds Aerospace",
  sourceType: "CURRENT_PROJECT",
  sourceRef: "src/pages/Quality.tsx",
  verificationStatus: "PROTOTYPE",
  notes: "Attribution uses the prototype leadership team. Not for public display as a confirmed policy signatory.",
}

export const prototypeCertificationCards: Array<SourceMeta & {
  code: string
  name: string
  body: string
  scope: string
  year: string
  renewal: string
}> = [
  { code: "AS9100D", name: "Aerospace Quality Management System", body: "Bureau Veritas Certification", scope: "Design, manufacture and supply of precision aerospace components", year: "2019", renewal: "2025", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Quality.tsx", verificationStatus: "HIGH_RISK", notes: "Invented issuing body, dates, and AS9100D revision. AS9100 is mentioned on the legacy leadership page without these fields." },
  { code: "ISO 9001:2015", name: "Quality Management Systems", body: "TÜV Rheinland India", scope: "Manufacturing of precision machined, fabricated and composite components", year: "2020", renewal: "2026", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Quality.tsx", verificationStatus: "OWNER_VERIFICATION_REQUIRED" },
  { code: "NADCAP", name: "Special Process Accreditation", body: "Performance Review Institute (PRI)", scope: "Heat Treatment, Non-Destructive Testing (UT, RT, PT, MT)", year: "2021", renewal: "Rolling 18-month", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Quality.tsx", verificationStatus: "HIGH_RISK" },
  { code: "DGCA MOA", name: "Maintenance Organization Approval", body: "Directorate General of Civil Aviation", scope: "Structural repair and component overhaul for CAR 145 operations", year: "2021", renewal: "2027", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Quality.tsx", verificationStatus: "HIGH_RISK", notes: "Includes invented MOA details." },
]

export const prototypeQualityProcesses: Array<SourceMeta & { step: string; title: string; desc: string }> = [
  { step: "01", title: "Contract Review & DFM", desc: "Every new part number goes through Design for Manufacturability review, drawing interpretation, and FMEA before a single chip is cut.", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Quality.tsx", verificationStatus: "PROTOTYPE" },
  { step: "02", title: "Incoming Material Inspection", desc: "All raw materials verified to mill certificate, chemical composition, and mechanical properties before release to production.", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Quality.tsx", verificationStatus: "PROTOTYPE" },
  { step: "03", title: "In-Process Control (SPC)", desc: "Statistical Process Control applied to critical characteristics with real-time monitoring and automatic hold triggers.", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Quality.tsx", verificationStatus: "PROTOTYPE" },
  { step: "04", title: "First Article Inspection", desc: "AS9102 FAI completed on every new part and after any significant process change. Full ballooned drawing and measurement record.", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Quality.tsx", verificationStatus: "HIGH_RISK", notes: "AS9102 is not treated as a verified requirement." },
  { step: "05", title: "CMM & NDT Verification", desc: "Zeiss CMM dimensional verification and NADCAP-accredited NDT (UT, RT, PT, MT) before any delivery.", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Quality.tsx", verificationStatus: "HIGH_RISK" },
  { step: "06", title: "Certificate of Conformance", desc: "Every shipment is accompanied by a CoC, material certifications, test reports, and full traceability to serial number or lot.", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Quality.tsx", verificationStatus: "PROTOTYPE" },
]

export const prototypeMetrologyEquipment: Array<SourceMeta & { name: string; spec: string }> = [
  { name: "Zeiss Contura G2 RDS CMM", spec: "700 × 700 × 600mm, ±0.001mm accuracy", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Quality.tsx", verificationStatus: "PROTOTYPE" },
  { name: "Olympus OmniScan MX2", spec: "Phased array UT, eddy current", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Quality.tsx", verificationStatus: "HIGH_RISK" },
  { name: "GE Inspection X-Ray", spec: "320kV digital radiography", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Quality.tsx", verificationStatus: "HIGH_RISK" },
  { name: "Faro Quantum Arm", spec: "Portable CMM, 1.2m reach, ±0.025mm", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Quality.tsx", verificationStatus: "PROTOTYPE" },
  { name: "Vision Measuring System", spec: "Video metrology, 2D profiles", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Quality.tsx", verificationStatus: "PROTOTYPE" },
  { name: "Surface Roughness Tester", spec: "Mitutoyo SJ-210, Ra to 0.005μm", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Quality.tsx", verificationStatus: "PROTOTYPE" },
]
