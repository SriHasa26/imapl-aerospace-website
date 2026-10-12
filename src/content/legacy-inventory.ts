/**
 * INTERNAL DEVELOPMENT REFERENCE — not a public website route.
 * Do not import this module from App or page components.
 *
 * Legacy source: https://imapl.co.in/
 * Audited for P0.5. High-risk claims are flagged and must not be treated as verified facts.
 */

export type VerificationStatus =
  | 'SOURCE-SUPPORTED'
  | 'OWNER VERIFICATION REQUIRED'
  | 'HIGH-RISK CLAIM'
  | 'TEMPORARY / LEGACY'
  | 'LEGACY / REQUIRES CURRENT VERIFICATION'

export interface InventoryRow {
  category: string
  sourcePage: string
  content: string
  destination: string
  verification: VerificationStatus
  action: string
}

export const legacyPagesReviewed = [
  'https://imapl.co.in/',
  'https://imapl.co.in/overview',
  'https://imapl.co.in/leadership',
  'https://imapl.co.in/our-values',
  'https://imapl.co.in/manufacturing-facilities',
  'https://imapl.co.in/tooling-1',
  'https://imapl.co.in/precision-components',
  'https://imapl.co.in/machining-&-fabrication',
  'https://imapl.co.in/inspection-1',
  'https://imapl.co.in/load-test',
  'https://imapl.co.in/part-marking',
  'https://imapl.co.in/careers',
  'https://imapl.co.in/gallery',
  'https://imapl.co.in/contact-us',
  'https://imapl.co.in/for-suppliers',
] as const

export const inventory: InventoryRow[] = [
  {
    category: 'Company',
    sourcePage: 'https://imapl.co.in/overview',
    content: 'Founded in 2017. Legal name Igniting Minds Aerospace Private Limited. Headquartered in India. Positioning: aero engine tooling, precision aerospace components, and MRO tooling.',
    destination: 'About, Home overview, content inventory',
    verification: 'SOURCE-SUPPORTED',
    action: 'Keep founding year 2017 as source-supported. Prototype copy still says 2018 / Hyderabad — do not treat prototype HQ story as verified. Do not strengthen to “global OEM preferred supplier”.',
  },
  {
    category: 'Company',
    sourcePage: 'https://imapl.co.in/overview',
    content: 'Core expertise listed: Aero Engine Tooling; Precision Aerospace Components; MRO Tooling Solutions; Integrated Engineering & Manufacturing; Support for Global OEMs & Aerospace Supply Chains; Quality-Driven Manufacturing.',
    destination: 'About, Capabilities, Products',
    verification: 'OWNER VERIFICATION REQUIRED',
    action: 'Use as positioning themes only. “Support for Global OEMs” is not proof of named customer relationships.',
  },
  {
    category: 'Company',
    sourcePage: 'https://imapl.co.in/leadership',
    content: 'Leadership names published: Chakrapani M / Chakrapani Muppala, Managing Director; Beerappa K, Director - Finance (18 years manufacturing finance); Manjunatha S, Director - Projects (27 years aerospace and automotive).',
    destination: 'About #leadership (not rewritten in P0.5)',
    verification: 'OWNER VERIFICATION REQUIRED',
    action: 'Do not publish as confirmed current officers until owner confirms. High-risk if treated as verified biography.',
  },
  {
    category: 'Company',
    sourcePage: 'https://imapl.co.in/our-values',
    content: 'Values: Integrity; Mutual Respect; Accountability; Pursuit of Excellence; Learning Mindset.',
    destination: 'About',
    verification: 'SOURCE-SUPPORTED',
    action: 'Safe to use as culture language. Not used to rewrite About in P0.5 to avoid a visual/content redesign.',
  },
  {
    category: 'Company',
    sourcePage: 'https://imapl.co.in/leadership',
    content: 'Published highlights: 9+ years of experience; 120+ skilled professionals; AS9100 quality standards; global aerospace customers.',
    destination: 'Home/About stats (prototype currently uses different invented figures)',
    verification: 'HIGH-RISK CLAIM',
    action: 'Do not auto-publish 120+ staff, 9+, or AS9100 as verified. Owner must confirm current figures and certificate status.',
  },
  {
    category: 'Products',
    sourcePage: 'https://imapl.co.in/precision-components',
    content: 'Structural Components: thin-walled Aluminium aero structural parts, product sizes 30 mm to 1200 mm. CNC machining facilities described qualitatively (productivity, quality, lead time). No part numbers, tolerances, weights, or finishes published.',
    destination: 'Products / Airframe / Precision Components',
    verification: 'SOURCE-SUPPORTED',
    action: 'Preserve size range exactly. Do not invent missing specifications. Prototype LCA Tejas SKU remains unverified and is not a legacy product.',
  },
  {
    category: 'Products',
    sourcePage: 'https://imapl.co.in/precision-components',
    content: 'Aero Engine Components: complex aerospace parts in Inconel, Nimonic, Titanium, PH17-4, PH15-5, and SS304. Mentions outside-process supply chain. No part numbers or dimensional specs.',
    destination: 'Products / Engine',
    verification: 'SOURCE-SUPPORTED',
    action: 'Use materials list as published. Do not add Inconel 718 / 625 grades unless sourced.',
  },
  {
    category: 'Products',
    sourcePage: 'https://imapl.co.in/precision-components',
    content: 'Multi Axis Components: 4 & 5 axis machining from Aluminium, Inconel and Nimonic, product sizes 20 mm to 500 mm.',
    destination: 'Products / Capabilities',
    verification: 'SOURCE-SUPPORTED',
    action: 'Preserve 20–500 mm and 4/5 axis wording. Do not invent machine counts here.',
  },
  {
    category: 'Products',
    sourcePage: 'https://imapl.co.in/precision-components',
    content: 'Summary tiles: product size 4 mm–1200 mm; CNC machining 3, 4, 5 axis; materials Aluminium, Nimonic, copper & more.',
    destination: 'Products, Capabilities',
    verification: 'SOURCE-SUPPORTED',
    action: 'Use ranges as published. Copper is listed only on this summary tile.',
  },
  {
    category: 'Products',
    sourcePage: 'https://imapl.co.in/tooling-1',
    content: 'Product families: Airframe and Aero Engine Tooling; Ground Support Equipment; Jigs & Fixtures; Movement Trolleys; Pedestals; Lifting Tools; Brackets; Indexing Tools; Torquing Tools; MRO tooling. GSE examples: On-Wing Support Equipment, Tripod Jacks, Axle Jacks, Tow Bars, Nacelle Tooling, Aircraft Access Platforms. Fixture types: milling, turning, welding, assembly, CMM, heat treatment, EDM, inspection.',
    destination: 'Products / GSE / Tooling',
    verification: 'SOURCE-SUPPORTED',
    action: 'Use category names. No part numbers, dimensions, weights, or tolerances were published for these items.',
  },
  {
    category: 'Products',
    sourcePage: 'https://imapl.co.in/tooling-1',
    content: '“Official tooling vendor for licensees of GE, Safran, Rolls-Royce, Boeing, Airbus, Dassault Aviation, and Lockheed Martin since 2017.” Also names Boeing 737–787, CFM LEAP, GE NX, Rolls-Royce Trent.',
    destination: 'Do not publish as verified on Products/Home',
    verification: 'HIGH-RISK CLAIM',
    action: 'Owner verification required. Do not treat licensee-vendor wording as a current certified OEM relationship.',
  },
  {
    category: 'Technical specifications',
    sourcePage: 'https://imapl.co.in/machining-&-fabrication',
    content: 'Named machines published on the legacy machining page include Cosmos CVM800 (3/4 axis), Mitsubishi 500×1000×600, Hurco VM20i / VM10i, Philips PVM1050 5-axis (×2), PVM1150 (×4), PDC2232 5-axis double column, Tsugami VA3, Tsugami M08J, Askar Spinner 22, Hyundai Wia LV8508R. TIG welding mentioned. Materials: carbon steel, stainless steel, high alloy, aluminium.',
    destination: 'Capabilities inventory only (prototype Capabilities page still uses unverified DMU / composite / NADCAP specs)',
    verification: 'OWNER VERIFICATION REQUIRED',
    action: 'Do not add machine models to the live Capabilities cards unless owner confirms they remain current. AWS certified welders claim is high-risk.',
  },
  {
    category: 'Quality',
    sourcePage: 'https://imapl.co.in/inspection-1',
    content: 'Inspection themes: in-process and final inspection; dimensional, geometric, and surface-finish verification; pre-dispatch inspection. Equipment named: MITUTOYO CMM CRYSTA-Apex S7106 (1.7 μm class, temperature compensation, SP25M, MCOSMOS); TRIMOS VT1000MA (measuring range 1016 mm / 40 in; extension 1278 mm / 50 in); MITUTOYO Contracer CV-2100; ACCURATE Model VPP 2515 MAZ.',
    destination: 'Quality',
    verification: 'OWNER VERIFICATION REQUIRED',
    action: 'Preserve published instrument names/ranges exactly. Do not add Zeiss Contura or NADCAP NDT from the prototype as if sourced from the legacy site.',
  },
  {
    category: 'Quality',
    sourcePage: 'https://imapl.co.in/load-test',
    content: 'Load testing of aerospace tools, fixtures, and structural assemblies. Methods: dead weight load test; load test with digital scale. Purpose described as validating strength, stability, and performance per customer specification.',
    destination: 'Quality / Capabilities',
    verification: 'SOURCE-SUPPORTED',
    action: 'Use as capability language. No load capacities or standards published.',
  },
  {
    category: 'Quality',
    sourcePage: 'https://imapl.co.in/part-marking',
    content: 'Part marking methods: Chemical etching; Dot peening; Laser marking. Chemical etching and dot peening described as marking per GE P23TF3 standard. Laser marking “as per customer specification”.',
    destination: 'Quality / Capabilities',
    verification: 'HIGH-RISK CLAIM',
    action: 'GE P23TF3 is a customer/OEM process reference. Do not publish as a current authorization without owner confirmation.',
  },
  {
    category: 'Facilities',
    sourcePage: 'https://imapl.co.in/manufacturing-facilities',
    content: 'Facility described as equipped with advanced CNC machining centers, precision inspection systems, and process-driven workflows. Themes: precision inspection, modern CNC machines, process-controlled manufacturing, quality assurance. No facility area, employee count, or machine count published on this page.',
    destination: 'Facilities',
    verification: 'SOURCE-SUPPORTED',
    action: 'Prototype 45,000 sq ft / 18 CNC / autoclave / NADCAP plant figures are not from this page. Flag those as high-risk invented prototype claims.',
  },
  {
    category: 'Contact',
    sourcePage: 'https://imapl.co.in/contact-us',
    content: 'Phone +91 9742239191; email info@imapl.co.in; hours Mon–Sat 9:00–17:00 IST. Welding & Special Process: 46/47/48/49 Sri Raghavendra Industrial Estate, Thigalarapalya Main Road, Bengaluru 560058. Corporate: #73, 6th Main, 3rd Phase, Peenya Industrial Area, Bengaluru 560058. UAE: Ajman (no street). WhatsApp wa.me/919742239191.',
    destination: 'Contact, Footer, Privacy, Terms',
    verification: 'OWNER VERIFICATION REQUIRED',
    action: 'Mapped into the new site as published legacy details. Prototype Hyderabad / ignitingminds.aero / +91 40 numbers were not found on the legacy site and were removed from Contact/Footer.',
  },
  {
    category: 'Careers',
    sourcePage: 'https://imapl.co.in/careers',
    content: 'GET programme for BE/BTech graduates, 0–1 year. Legacy listings: CMM Programmer (2, 2–5 yrs); CNC/VMC Milling Operator (10, 2–5 yrs); Manufacturing / Tooling Engineer (4, 5–10 yrs); Design Engineer SolidWorks (2, 3–9 yrs); Technical Manager Tooling (2, 10–15 yrs). Apply via info@imapl.co.in.',
    destination: 'Careers inventory only',
    verification: 'LEGACY / REQUIRES CURRENT VERIFICATION',
    action: 'Do not publish as confirmed current vacancies. Prototype Hyderabad openings are also unverified and remain labeled as requiring confirmation.',
  },
  {
    category: 'Contact',
    sourcePage: 'https://imapl.co.in/ (footer social)',
    content: 'Social URLs published: Facebook 105929730815433; Instagram ignitingmindsaerospace; X AerospaceM80368; YouTube @ignitingmindsaerospace. LinkedIn points to a generic /feed/ URL.',
    destination: 'Footer (not linked in P0.5)',
    verification: 'OWNER VERIFICATION REQUIRED',
    action: 'Do not add live social links until owner confirms the official accounts. LinkedIn URL is not a company page.',
  },
]

export const highRiskClaims: Array<{
  claim: string
  source: string
  currentPage: string
  verificationRequired: boolean
  recommendedAction: string
}> = [
  {
    claim: 'AS9100 / AS9100D certification',
    source: 'Legacy leadership page (“AS9100 Quality Standards”); prototype Footer/Home/Quality',
    currentPage: 'Home, Quality, Footer',
    verificationRequired: true,
    recommendedAction: 'Do not treat as verified. Confirm certificate, number, scope, and expiry before production.',
  },
  {
    claim: 'ISO 9001:2015',
    source: 'Prototype only (not found as a standalone claim on reviewed legacy pages)',
    currentPage: 'Home, Footer',
    verificationRequired: true,
    recommendedAction: 'Owner confirmation required. Do not invent certificate numbers.',
  },
  {
    claim: 'NADCAP accreditation (surface treatment / NDT / heat treatment)',
    source: 'Prototype Facilities/Capabilities/Quality only',
    currentPage: 'Facilities, Capabilities, Quality, Footer',
    verificationRequired: true,
    recommendedAction: 'Not found on reviewed legacy pages. Remove or confirm before production.',
  },
  {
    claim: 'DGCA approved',
    source: 'Prototype Footer/Home only',
    currentPage: 'Home, Footer',
    verificationRequired: true,
    recommendedAction: 'Not found on reviewed legacy pages.',
  },
  {
    claim: 'ITAR-controlled missile airframe / classified defense program',
    source: 'Prototype Products page only',
    currentPage: 'Products',
    verificationRequired: true,
    recommendedAction: 'Not on the legacy site. Do not publish as a company capability.',
  },
  {
    claim: 'Official tooling vendor for licensees of GE, Safran, Rolls-Royce, Boeing, Airbus, Dassault, Lockheed Martin since 2017',
    source: 'https://imapl.co.in/tooling-1',
    currentPage: 'Not copied onto the new site as a verified statement',
    verificationRequired: true,
    recommendedAction: 'High-risk OEM relationship. Confirm current vendor status before any public use.',
  },
  {
    claim: 'Boeing 737–787, CFM LEAP, GE NX, Rolls-Royce Trent tooling programs',
    source: 'https://imapl.co.in/tooling-1',
    currentPage: 'Not copied as verified program claims',
    verificationRequired: true,
    recommendedAction: 'Confirm whether these are current programs or marketing examples.',
  },
  {
    claim: 'HAL / LCA Tejas supplier relationship and 83-aircraft program metrics',
    source: 'Prototype Home case study and Products SKU',
    currentPage: 'Home, Products',
    verificationRequired: true,
    recommendedAction: 'Not found on reviewed legacy pages. Do not treat as verified.',
  },
  {
    claim: 'ISRO / NewSpace satellite structural panel',
    source: 'Prototype Products',
    currentPage: 'Products',
    verificationRequired: true,
    recommendedAction: 'Not found on the legacy site.',
  },
  {
    claim: 'Airbus A320neo door surround / wing panel kit supply',
    source: 'Prototype Products and Home case study',
    currentPage: 'Home, Products',
    verificationRequired: true,
    recommendedAction: 'Not found on the legacy site.',
  },
  {
    claim: 'GE P23TF3 part-marking authorization',
    source: 'https://imapl.co.in/part-marking',
    currentPage: 'Not added as a verified Quality claim',
    verificationRequired: true,
    recommendedAction: 'Confirm whether this process remains authorized.',
  },
  {
    claim: '120+ skilled professionals; 9+ years; 500+ staff; 45,000 sq ft; 18 CNC machines; 28 open roles',
    source: 'Legacy leadership (120+ / 9+); remainder is prototype-only',
    currentPage: 'Home, About, Facilities, Careers',
    verificationRequired: true,
    recommendedAction: 'Do not use statistics in production without current owner figures.',
  },
  {
    claim: 'AWS certified welders',
    source: 'Legacy machining page (from prior audit notes)',
    currentPage: 'Not added as verified',
    verificationRequired: true,
    recommendedAction: 'Confirm certification scope and currency.',
  },
  {
    claim: 'Hyderabad / TSIIC Aerospace Park headquarters and ignitingminds.aero emails',
    source: 'Prototype only; conflicts with legacy Bengaluru / info@imapl.co.in',
    currentPage: 'Home, About, Facilities, Careers, Resources (narrative left in place); Contact/Footer updated to legacy',
    verificationRequired: true,
    recommendedAction: 'Owner must confirm the current registered office and public email.',
  },
]

export const unsplashAudit: Array<{
  page: string
  component: string
  currentImage: string
  source: string
  replacementStatus: string
}> = [
  { page: 'Home', component: 'Hero overlay', currentImage: 'Unsplash photo-1674897537555-dd6fbf72b4eb', source: 'Unsplash', replacementStatus: 'REPLACED with local IMAPL facility.png (temporary/legacy shop-floor photo).' },
  { page: 'Home', component: 'Company overview image', currentImage: 'Unsplash photo-1581091212991-8891c7d4bd9b', source: 'Unsplash', replacementStatus: 'REPLACED with local manufacturing.png (IMAPL shop-floor team).' },
  { page: 'Home', component: 'Quality image', currentImage: 'Unsplash photo-1666634157070-6fd830fb5672', source: 'Unsplash', replacementStatus: 'REPLACED with local quality-inspection.png (Trimos gauge from legacy inspection assets).' },
  { page: 'Home', component: 'Facility banner', currentImage: 'Unsplash photo-1740209475472-aa7d280f7452', source: 'Unsplash', replacementStatus: 'REPLACED with local facility.png.' },
  { page: 'Home', component: 'Featured products Airframe / Engine', currentImage: 'Unsplash aircraft/stock', source: 'Unsplash', replacementStatus: 'REPLACED with local precision and aero-engine component photos.' },
  { page: 'Home', component: 'Featured product UAV + industry mosaic + case studies', currentImage: 'Unsplash industry/aircraft IDs', source: 'Unsplash', replacementStatus: 'LEFT IN PLACE — no appropriate IMAPL aircraft/UAV/program photograph.' },
  { page: 'About', component: 'Hero + heritage', currentImage: 'Unsplash team / architecture', source: 'Unsplash', replacementStatus: 'REPLACED with local manufacturing.png and facility.png.' },
  { page: 'Capabilities', component: 'Cap 01 machining', currentImage: 'Unsplash photo-1740209475472', source: 'Unsplash', replacementStatus: 'REPLACED with local machining.png (Tsugami M08J from legacy machining page).' },
  { page: 'Capabilities', component: 'Cap 06 inspection', currentImage: 'Unsplash photo-1581091212991', source: 'Unsplash', replacementStatus: 'REPLACED with local quality-inspection.png.' },
  { page: 'Capabilities', component: 'Caps 02–05', currentImage: 'Unsplash sheet metal / composite / assembly / coating', source: 'Unsplash', replacementStatus: 'LEFT IN PLACE — no matching IMAPL photographs for those specific processes.' },
  { page: 'Products', component: 'Airframe / Engine / GSE cards', currentImage: 'Unsplash stock', source: 'Unsplash', replacementStatus: 'REPLACED with local IMAPL component/tooling photographs. Card copy is still unverified prototype SKUs.' },
  { page: 'Products', component: 'UAV / Defense / Space / exhaust duct', currentImage: 'Unsplash stock', source: 'Unsplash', replacementStatus: 'LEFT IN PLACE — no appropriate IMAPL photograph for those prototype SKUs.' },
  { page: 'Industries', component: 'All industry cards', currentImage: 'Unsplash aircraft/space/rotorcraft', source: 'Unsplash', replacementStatus: 'LEFT IN PLACE — no IMAPL industry-scene photographs.' },
  { page: 'Quality', component: 'Hero + CMM image', currentImage: 'Unsplash inspection', source: 'Unsplash', replacementStatus: 'REPLACED with local quality-inspection.png and facility-2.jpg (inspection team).' },
  { page: 'Facilities', component: 'Hero + CNC bay', currentImage: 'Unsplash factory', source: 'Unsplash', replacementStatus: 'REPLACED with local facility.png / cnc-machine.png.' },
  { page: 'Facilities', component: 'Bays 02–06', currentImage: 'Unsplash factory/lab', source: 'Unsplash', replacementStatus: 'LEFT IN PLACE — no IMAPL photos of sheet metal, composites, surface treatment, or a Zeiss lab.' },
  { page: 'Resources', component: 'All cards', currentImage: 'Unsplash', source: 'Unsplash', replacementStatus: 'LEFT IN PLACE — news/case-study imagery is not replaceable with a random product photo.' },
  { page: 'Careers', component: 'Hero + culture', currentImage: 'Unsplash team', source: 'Unsplash', replacementStatus: 'REPLACED with local careers.jpg and workshop.jpg.' },
]
