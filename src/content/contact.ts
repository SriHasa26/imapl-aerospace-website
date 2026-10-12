import {
  COMPANY_PROFILE_2026,
  LEGACY_CONTACT,
  type SourceMeta,
  type SourcedValue,
  type VerificationStatus,
} from "./types"

export interface OfficeRecord extends SourceMeta {
  id: string
  label: string
  role: string
  lines: string[]
}

export const contactMeta: SourceMeta = {
  sourceType: "LEGACY_WEBSITE",
  sourceRef: LEGACY_CONTACT,
  verificationStatus: "OWNER_VERIFICATION_REQUIRED",
  notes: "Published on the legacy contact page. Confirm before production. No Source A document in the repo.",
}

export const phone: SourcedValue<string> = {
  value: "+91 9742239191",
  sourceType: "OWNER_DOCUMENT",
  sourceRef: COMPANY_PROFILE_2026,
  verificationStatus: "SOURCE_SUPPORTED",
}

export const email: SourcedValue<string> = {
  value: "info@imapl.co.in",
  sourceType: "OWNER_DOCUMENT",
  sourceRef: COMPANY_PROFILE_2026,
  verificationStatus: "SOURCE_SUPPORTED",
}

export const website: SourcedValue<string> = {
  value: "https://imapl.co.in/",
  sourceType: "LEGACY_WEBSITE",
  sourceRef: LEGACY_CONTACT,
  verificationStatus: "OWNER_VERIFICATION_REQUIRED",
}

export const hours: SourcedValue<string> = {
  value: "Monday–Saturday, 9:00 AM to 5:00 PM (IST). Sunday closed.",
  sourceType: "LEGACY_WEBSITE",
  sourceRef: LEGACY_CONTACT,
  verificationStatus: "OWNER_VERIFICATION_REQUIRED",
}

export const offices: OfficeRecord[] = [
  {
    id: "peenya-corporate",
    label: "Corporate office",
    role: "Business Operations and Administrations",
    lines: [
      "#73, 6th Main, 3rd Phase",
      "Peenya Industrial Area",
      "Bengaluru, Karnataka 560058",
      "India",
    ],
    sourceType: "OWNER_DOCUMENT",
    sourceRef: COMPANY_PROFILE_2026,
    verificationStatus: "SOURCE_SUPPORTED",
  },
  {
    id: "thigalarapalya-welding",
    label: "Welding & Special Process Operations",
    role: "Registered / operations address as published",
    lines: [
      "46/47/48/49, Sri Raghavendra Industrial Estate",
      "Thigalarapalya Main Road",
      "Bengaluru, Karnataka 560058",
      "India",
    ],
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_CONTACT,
    verificationStatus: "OWNER_VERIFICATION_REQUIRED",
  },
  {
    id: "ajman-uae",
    label: "UAE Office",
    role: "Business Operations",
    lines: ["Ajman, United Arab Emirates"],
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_CONTACT,
    verificationStatus: "OWNER_VERIFICATION_REQUIRED",
    notes: "City only. No street address was published.",
  },
]

export const whatsapp: SourcedValue<string> = {
  value: "https://wa.me/919742239191",
  sourceType: "LEGACY_WEBSITE",
  sourceRef: LEGACY_CONTACT,
  verificationStatus: "OWNER_VERIFICATION_REQUIRED",
  notes: "Present on the legacy contact page. Not added as a public widget in P0.5.",
}

export const aogContact: SourcedValue<null> = {
  value: null,
  sourceType: "UNKNOWN",
  verificationStatus: "MISSING",
  notes: "No dedicated AOG number was found on the legacy site. Prototype Industries copy is not used here.",
}

export const mapLink: SourcedValue<null> = {
  value: null,
  sourceType: "UNKNOWN",
  verificationStatus: "MISSING",
  notes: "No verified public map URL is stored.",
}

export const socialLinks: Array<SourcedValue<{ network: string; url: string }>> = [
  {
    value: { network: "Facebook", url: "https://www.facebook.com/105929730815433" },
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_CONTACT,
    verificationStatus: "OWNER_VERIFICATION_REQUIRED",
  },
  {
    value: { network: "Instagram", url: "https://www.instagram.com/ignitingmindsaerospace" },
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_CONTACT,
    verificationStatus: "OWNER_VERIFICATION_REQUIRED",
  },
  {
    value: { network: "X", url: "https://www.x.com/AerospaceM80368" },
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_CONTACT,
    verificationStatus: "OWNER_VERIFICATION_REQUIRED",
  },
  {
    value: { network: "YouTube", url: "https://www.youtube.com/@ignitingmindsaerospace" },
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_CONTACT,
    verificationStatus: "OWNER_VERIFICATION_REQUIRED",
  },
  {
    value: { network: "LinkedIn", url: "https://www.linkedin.com/feed/" },
    sourceType: "LEGACY_WEBSITE",
    sourceRef: LEGACY_CONTACT,
    verificationStatus: "OWNER_VERIFICATION_REQUIRED",
    notes: "Legacy footer points at a generic feed URL, not a company page.",
  },
]

/**
 * Compatibility object consumed by Contact.tsx and Footer.tsx.
 * Runtime values are unchanged from P0.5.
 */
export const companyContact = {
  verification: "OWNER VERIFICATION REQUIRED" as const,
  legalName: "Igniting Minds Aerospace Pvt Ltd",
  source: LEGACY_CONTACT,
  phone: phone.value,
  phoneHref: "tel:+919742239191",
  email: email.value,
  emailHref: "mailto:info@imapl.co.in",
  website: website.value,
  hours: hours.value,
  offices: offices.map((office) => ({
    label: office.label,
    role: office.role,
    lines: office.lines,
  })),
}

export const contactVerificationStatus: VerificationStatus = "OWNER_VERIFICATION_REQUIRED"
