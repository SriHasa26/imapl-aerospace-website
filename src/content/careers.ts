import { LEGACY_CAREERS, isPublishable, type SourceMeta } from "./types"

export interface CareerRole extends SourceMeta {
  id: string
  role: string
  location?: string
  employmentType?: string
  description?: string
  requirements?: string[]
  dept?: string
  experience?: string
  skills?: string[]
  openingStatus: "NOT_CONFIRMED_CURRENT"
  positionsListed?: string
}

const legacyRole = (
  id: string,
  role: string,
  description: string,
  requirements: string[],
  positionsListed?: string,
): CareerRole => ({
  id,
  role,
  description,
  requirements,
  openingStatus: "NOT_CONFIRMED_CURRENT",
  positionsListed,
  sourceType: "LEGACY_WEBSITE",
  sourceRef: LEGACY_CAREERS,
  verificationStatus: "LEGACY",
  notes: "LEGACY / REQUIRES CURRENT VERIFICATION. Do not present as a current vacancy.",
})

export const legacyRoles: CareerRole[] = [
  legacyRole(
    "get",
    "Graduate Engineer Trainee (GET)",
    "GET programme for engineering graduates. Hands-on industry exposure, learning and development, mentorship.",
    ["BE/BTech Graduates", "Freshers / 0–1 Year"],
  ),
  legacyRole(
    "cmm-programmer",
    "CMM Programmer",
    "Develop and optimize CMM programs, perform dimensional inspections.",
    ["2–5 Years"],
    "02",
  ),
  legacyRole(
    "cnc-vmc-operator",
    "CNC / VMC Milling Operator",
    "Operate CNC and VMC milling machines and support precision manufacturing operations.",
    ["2–5 Years"],
    "10",
  ),
  legacyRole(
    "manufacturing-tooling-engineer",
    "Manufacturing / Tooling Engineer",
    "Plan manufacturing processes and develop tooling solutions.",
    ["5–10 Years"],
    "04",
  ),
  legacyRole(
    "design-engineer-solidworks",
    "Design Engineer (SolidWorks)",
    "Create 3D models, engineering drawings, and design solutions using SolidWorks.",
    ["3–9 Years"],
    "02",
  ),
  legacyRole(
    "technical-manager-tooling",
    "Technical Manager (Tooling)",
    "Lead engineering teams in the design and manufacturing of aero engine tooling and components.",
    ["10-15 Years"],
    "02",
  ),
]

export const prototypeRoles: CareerRole[] = [
  {
    id: "senior-structures-engineer",
    role: "Senior Aerospace Structures Engineer",
    location: "Hyderabad, India",
    employmentType: "Full-time",
    dept: "Engineering",
    experience: "6–12 years",
    skills: ["CATIA V5", "FEM/FEA", "AS9100D"],
    requirements: ["CATIA V5", "FEM/FEA", "AS9100D"],
    openingStatus: "NOT_CONFIRMED_CURRENT",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Careers.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    id: "cnc-machinist-senior",
    role: "5-Axis CNC Machinist (Senior)",
    location: "Hyderabad, India",
    employmentType: "Full-time",
    dept: "Manufacturing",
    experience: "5–10 years",
    skills: ["DMU 85", "CATIA CAM", "Ti/Inconel"],
    requirements: ["DMU 85", "CATIA CAM", "Ti/Inconel"],
    openingStatus: "NOT_CONFIRMED_CURRENT",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Careers.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    id: "quality-engineer-as9100",
    role: "Quality Engineer – AS9100D",
    location: "Hyderabad, India",
    employmentType: "Full-time",
    dept: "Quality",
    experience: "4–8 years",
    skills: ["AS9100D", "CMM", "NADCAP"],
    openingStatus: "NOT_CONFIRMED_CURRENT",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Careers.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    id: "composite-engineer",
    role: "Composite Design & Manufacturing Engineer",
    location: "Hyderabad, India",
    employmentType: "Full-time",
    dept: "Engineering",
    experience: "3–7 years",
    skills: ["CFRP Lay-up", "Autoclave", "CATIA"],
    openingStatus: "NOT_CONFIRMED_CURRENT",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Careers.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    id: "bd-manager-europe",
    role: "Aerospace Business Development Manager – Europe",
    location: "Remote / Hybrid",
    employmentType: "Full-time",
    dept: "Business Development",
    experience: "8–15 years",
    skills: ["OEM Relations", "RFQ Process", "Tier-1 Supply"],
    openingStatus: "NOT_CONFIRMED_CURRENT",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Careers.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    id: "sheet-metal-fabricator",
    role: "Sheet Metal Fabricator – Aerospace",
    location: "Hyderabad, India",
    employmentType: "Full-time",
    dept: "Manufacturing",
    experience: "3–6 years",
    skills: ["Laser Cut", "TIG Welding", "MIL-spec"],
    openingStatus: "NOT_CONFIRMED_CURRENT",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Careers.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    id: "ndt-level-iii",
    role: "NDT Level III Technician",
    location: "Hyderabad, India",
    employmentType: "Full-time",
    dept: "Quality",
    experience: "5–10 years",
    skills: ["UT", "RT", "NADCAP"],
    openingStatus: "NOT_CONFIRMED_CURRENT",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Careers.tsx",
    verificationStatus: "PROTOTYPE",
  },
  {
    id: "production-planning",
    role: "Production Planning & Scheduling Engineer",
    location: "Hyderabad, India",
    employmentType: "Full-time",
    dept: "Operations",
    experience: "3–6 years",
    skills: ["ERP/MRP", "Lean", "AS9100D"],
    openingStatus: "NOT_CONFIRMED_CURRENT",
    sourceType: "CURRENT_PROJECT",
    sourceRef: "src/pages/Careers.tsx",
    verificationStatus: "PROTOTYPE",
  },
]

export const careersPublicNote: SourceMeta = {
  sourceType: "CURRENT_PROJECT",
  sourceRef: "src/pages/Careers.tsx",
  verificationStatus: "OWNER_VERIFICATION_REQUIRED",
  notes: "The Careers page already states listings are not confirmed current vacancies. No role in this model is marked current.",
}

export const prototypeBenefits: Array<SourceMeta & { title: string; desc: string }> = [
  { title: "Competitive Compensation", desc: "Market-leading salary, performance bonus, and ESOP for senior roles.", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Careers.tsx", verificationStatus: "PROTOTYPE" },
  { title: "Aerospace Training", desc: "Sponsored certifications — AS9100D, CATIA, NADCAP, and professional engineering programs.", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Careers.tsx", verificationStatus: "HIGH_RISK" },
  { title: "Work on Cutting-Edge Programs", desc: "Direct exposure to active defense, space, and commercial aviation programs.", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Careers.tsx", verificationStatus: "HIGH_RISK" },
  { title: "Health & Wellness", desc: "Comprehensive family health insurance, annual health check, and wellness allowance.", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Careers.tsx", verificationStatus: "PROTOTYPE" },
  { title: "Flexible Work Policy", desc: "Hybrid working for engineering and business roles; flexible hours for production staff.", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Careers.tsx", verificationStatus: "PROTOTYPE" },
  { title: "Career Growth", desc: "Clear advancement tracks from Technician to Lead Engineer to Department Head.", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Careers.tsx", verificationStatus: "PROTOTYPE" },
]

export const prototypeCultureStats: Array<SourceMeta & { val: string; label: string }> = [
  { val: "40+", label: "Internal Promotions (2023)", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Careers.tsx", verificationStatus: "PROTOTYPE" },
  { val: "94%", label: "Employee Retention Rate", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Careers.tsx", verificationStatus: "PROTOTYPE" },
  { val: "₹2.5L+", label: "Avg. Training Budget / Person", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Careers.tsx", verificationStatus: "PROTOTYPE" },
  { val: "3.2 yrs", label: "Avg. Tenure", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Careers.tsx", verificationStatus: "PROTOTYPE" },
  { val: "28", label: "Open Roles", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Careers.tsx", verificationStatus: "PROTOTYPE" },
  { val: "12", label: "Departments", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Careers.tsx", verificationStatus: "PROTOTYPE" },
  { val: "4.6/5", label: "Glassdoor Rating", sourceType: "CURRENT_PROJECT", sourceRef: "src/pages/Careers.tsx", verificationStatus: "PROTOTYPE" },
]

export function isConfirmedOpening(role: CareerRole): boolean {
  return role.openingStatus !== "NOT_CONFIRMED_CURRENT" && isPublishable(role.verificationStatus)
}
