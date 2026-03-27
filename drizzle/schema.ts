import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Projects table — one row per project (e.g. "Lexus of Henderson", "Raiders Tour")
 * slug must match the URL slug used in the frontend router.
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  heroImageUrl: text("heroImageUrl"),
  heroImageKey: text("heroImageKey"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Gallery images table — ordered list of images per project.
 * sortOrder controls display sequence (lower = first).
 */
export const galleryImages = mysqlTable("gallery_images", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  url: text("url").notNull(),
  fileKey: text("fileKey").notNull(),
  altText: varchar("altText", { length: 256 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = typeof galleryImages.$inferInsert;

/**
 * Project videos table — Vimeo/YouTube embed URLs per project.
 */
export const projectVideos = mysqlTable("project_videos", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  label: varchar("label", { length: 128 }),
  embedUrl: text("embedUrl").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectVideo = typeof projectVideos.$inferSelect;
export type InsertProjectVideo = typeof projectVideos.$inferInsert;
// ─────────────────────────────────────────────────────────────────────────────
// ENTERPRISE CRM SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dealers — automotive dealership clients managed through the Dealer Portal.
 * Each dealer gets a unique invite token for their onboarding link.
 */
export const dealers = mysqlTable("dealers", {
  id: int("id").autoincrement().primaryKey(),
  /** Unique token used in the dealer's onboarding invite link */
  token: varchar("token", { length: 128 }).notNull().unique(),
  /** Onboarding status lifecycle */
  status: mysqlEnum("status", [
    "invited", "in_progress", "submitted", "under_review",
    "approved", "active", "paused", "rejected", "archived", "cancelled"
  ]).default("invited").notNull(),
  // Step 1: Dealer Basics
  legalName: varchar("legalName", { length: 256 }),
  storeName: varchar("storeName", { length: 256 }),
  slogan: varchar("slogan", { length: 512 }),
  address: text("address"),
  city: varchar("city", { length: 128 }),
  state: varchar("state", { length: 64 }),
  zip: varchar("zip", { length: 20 }),
  phone: varchar("phone", { length: 32 }),
  timezone: varchar("timezone", { length: 64 }),
  businessHours: text("businessHours"),
  dealershipStructure: varchar("dealershipStructure", { length: 128 }),
  // Completion tracking
  completionScore: int("completionScore").default(0).notNull(),
  submittedAt: timestamp("submittedAt"),
  approvedAt: timestamp("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Dealer = typeof dealers.$inferSelect;
export type InsertDealer = typeof dealers.$inferInsert;

/**
 * Dealer contacts — multiple contacts per dealership (GM, Marketing, etc.)
 */
export const dealerContacts = mysqlTable("dealer_contacts", {
  id: int("id").autoincrement().primaryKey(),
  dealerId: int("dealerId").notNull(),
  contactType: varchar("contactType", { length: 64 }),
  name: varchar("name", { length: 256 }),
  title: varchar("title", { length: 128 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 32 }),
  preferredMethod: varchar("preferredMethod", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DealerContact = typeof dealerContacts.$inferSelect;

/**
 * Dealer monthly inputs — promotions, specials, campaigns, events
 */
export const dealerMonthlyInputs = mysqlTable("dealer_monthly_inputs", {
  id: int("id").autoincrement().primaryKey(),
  dealerId: int("dealerId").notNull(),
  inputType: mysqlEnum("inputType", ["special", "campaign", "promotion", "event"]).notNull(),
  title: varchar("title", { length: 256 }),
  description: text("description"),
  startDate: varchar("startDate", { length: 32 }),
  endDate: varchar("endDate", { length: 32 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DealerMonthlyInput = typeof dealerMonthlyInputs.$inferSelect;

/**
 * Dealer platform access — social media, Google, CRM credentials
 */
export const dealerPlatformAccess = mysqlTable("dealer_platform_access", {
  id: int("id").autoincrement().primaryKey(),
  dealerId: int("dealerId").notNull(),
  platform: varchar("platform", { length: 128 }),
  username: varchar("username", { length: 256 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DealerPlatformAccess = typeof dealerPlatformAccess.$inferSelect;

/**
 * Dealer compliance — OEM rules, brand guidelines, restrictions
 */
export const dealerCompliance = mysqlTable("dealer_compliance", {
  id: int("id").autoincrement().primaryKey(),
  dealerId: int("dealerId").notNull(),
  oemRestrictions: text("oemRestrictions"),
  brandGuidelines: text("brandGuidelines"),
  additionalRestrictions: text("additionalRestrictions"),
  acknowledgedDeliverables: int("acknowledgedDeliverables").default(0),
  acknowledgedPolicies: int("acknowledgedPolicies").default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DealerCompliance = typeof dealerCompliance.$inferSelect;

/**
 * Dealer files — uploaded documents (brand guides, contracts, etc.)
 */
export const dealerFiles = mysqlTable("dealer_files", {
  id: int("id").autoincrement().primaryKey(),
  dealerId: int("dealerId").notNull(),
  filename: varchar("filename", { length: 512 }),
  fileKey: text("fileKey").notNull(),
  url: text("url").notNull(),
  mimeType: varchar("mimeType", { length: 128 }),
  sizeBytes: int("sizeBytes"),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type DealerFile = typeof dealerFiles.$inferSelect;

/**
 * Dealer comments — admin comments and dealer replies on onboarding submissions
 */
export const dealerComments = mysqlTable("dealer_comments", {
  id: int("id").autoincrement().primaryKey(),
  dealerId: int("dealerId").notNull(),
  authorName: varchar("authorName", { length: 256 }),
  authorRole: varchar("authorRole", { length: 64 }),
  content: text("content").notNull(),
  isAdminComment: int("isAdminComment").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DealerComment = typeof dealerComments.$inferSelect;

/**
 * Vendors — photographers, videographers, editors, and other contractors
 */
export const vendors = mysqlTable("vendors", {
  id: int("id").autoincrement().primaryKey(),
  /** Unique invite token for vendor portal access */
  token: varchar("token", { length: 128 }).notNull().unique(),
  status: mysqlEnum("status", [
    "invited", "active", "inactive", "suspended"
  ]).default("invited").notNull(),
  name: varchar("name", { length: 256 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 32 }),
  role: mysqlEnum("role", [
    "photographer", "videographer", "editor", "drone_operator",
    "social_media", "graphic_designer", "other"
  ]).default("photographer").notNull(),
  bio: text("bio"),
  location: varchar("location", { length: 256 }),
  portfolioUrl: text("portfolioUrl"),
  ratePerDay: int("ratePerDay"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = typeof vendors.$inferInsert;

/**
 * Vendor jobs — assignments linking vendors to projects/events
 */
export const vendorJobs = mysqlTable("vendor_jobs", {
  id: int("id").autoincrement().primaryKey(),
  vendorId: int("vendorId").notNull(),
  projectId: int("projectId"),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  eventDate: varchar("eventDate", { length: 32 }),
  eventCity: varchar("eventCity", { length: 128 }),
  status: mysqlEnum("status", [
    "pending", "confirmed", "in_progress", "completed", "cancelled"
  ]).default("pending").notNull(),
  deliverablesDue: varchar("deliverablesDue", { length: 32 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VendorJob = typeof vendorJobs.$inferSelect;

/**
 * Contracts — both contractor agreements (expense) and client contracts (revenue)
 */
/**
 * Contractor agreements — when Loomelic hires vendors/contractors.
 * These do NOT count as revenue.
 * Token-based access: contractor receives /vendor/sign/:token link.
 */
export const contracts = mysqlTable("contracts", {
  id: int("id").autoincrement().primaryKey(),
  contractorName: varchar("contractorName", { length: 255 }).notNull(),
  contractorEmail: varchar("contractorEmail", { length: 320 }).notNull(),
  contractorRole: varchar("contractorRole", { length: 100 }),
  projectName: varchar("projectName", { length: 255 }),
  projectLocation: varchar("projectLocation", { length: 255 }),
  totalFee: varchar("totalFee", { length: 20 }),
  deposit: varchar("deposit", { length: 20 }),
  finalPayment: varchar("finalPayment", { length: 20 }),
  paymentMethod: varchar("paymentMethod", { length: 100 }),
  checkinDate: varchar("checkinDate", { length: 50 }),
  checkoutDate: varchar("checkoutDate", { length: 50 }),
  airbnbAddress: text("airbnbAddress"),
  eventCity: varchar("eventCity", { length: 255 }),
  equipment: text("equipment"), // JSON string
  contractorSignature: text("contractorSignature"),
  companySignature: text("companySignature"),
  ndaSignature: text("ndaSignature"),
  pdfData: text("pdfData"), // Base64 PDF
  w9FormId: int("w9FormId"),
  insuranceCertificateUrl: text("insuranceCertificateUrl"),
  insuranceCertificateFileName: varchar("insuranceCertificateFileName", { length: 255 }),
  insuranceUploadedAt: timestamp("insuranceUploadedAt"),
  token: varchar("token", { length: 64 }).notNull().unique(), // Signing token
  status: mysqlEnum("status", ["draft", "sent", "signed"]).default("draft"),
  sentAt: timestamp("sentAt"),
  signedAt: timestamp("signedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

/**
 * W-9 tax forms — one per contractor per tax year.
 */
export const w9Forms = mysqlTable("w9_forms", {
  id: int("id").autoincrement().primaryKey(),
  contractorEmail: varchar("contractorEmail", { length: 320 }).notNull(),
  taxYear: int("taxYear").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  businessName: varchar("businessName", { length: 255 }),
  taxClassification: mysqlEnum("taxClassification", [
    "individual", "c_corp", "s_corp", "partnership", "trust_estate", "llc", "other"
  ]).notNull(),
  llcTaxClassification: varchar("llcTaxClassification", { length: 50 }),
  otherTaxClassification: varchar("otherTaxClassification", { length: 100 }),
  exemptPayeeCode: varchar("exemptPayeeCode", { length: 10 }),
  exemptFATCACode: varchar("exemptFATCACode", { length: 10 }),
  address: text("address").notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  zipCode: varchar("zipCode", { length: 10 }).notNull(),
  accountNumbers: text("accountNumbers"),
  ssn: varchar("ssn", { length: 11 }),
  ein: varchar("ein", { length: 10 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type W9Form = typeof w9Forms.$inferSelect;
export type InsertW9Form = typeof w9Forms.$inferInsert;

/**
 * Contract templates — reusable presets for common contractor types.
 */
export const contractTemplates = mysqlTable("contract_templates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  contractorRole: varchar("contractorRole", { length: 100 }),
  projectName: varchar("projectName", { length: 255 }),
  projectLocation: varchar("projectLocation", { length: 255 }),
  totalFee: varchar("totalFee", { length: 20 }),
  deposit: varchar("deposit", { length: 20 }),
  finalPayment: varchar("finalPayment", { length: 20 }),
  paymentMethod: varchar("paymentMethod", { length: 100 }),
  equipment: text("equipment"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContractTemplate = typeof contractTemplates.$inferSelect;
export type InsertContractTemplate = typeof contractTemplates.$inferInsert;

/**
 * Client contracts — when clients hire Loomelic Media.
 * These COUNT as revenue.
 */
export const clientContracts = mysqlTable("client_contracts", {
  id: int("id").autoincrement().primaryKey(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientCompany: varchar("clientCompany", { length: 255 }),
  clientEmail: varchar("clientEmail", { length: 320 }).notNull(),
  clientPhone: varchar("clientPhone", { length: 20 }),
  projectName: varchar("projectName", { length: 255 }).notNull(),
  projectType: varchar("projectType", { length: 100 }),
  projectLocation: varchar("projectLocation", { length: 255 }),
  projectStartDate: varchar("projectStartDate", { length: 50 }),
  projectEndDate: varchar("projectEndDate", { length: 50 }),
  projectDescription: text("projectDescription"),
  deliverables: text("deliverables"), // JSON string
  totalValue: varchar("totalValue", { length: 20 }),
  depositAmount: varchar("depositAmount", { length: 20 }),
  depositDueDate: varchar("depositDueDate", { length: 50 }),
  finalPaymentAmount: varchar("finalPaymentAmount", { length: 20 }),
  finalPaymentDueDate: varchar("finalPaymentDueDate", { length: 50 }),
  paymentTerms: text("paymentTerms"),
  token: varchar("token", { length: 64 }).notNull().unique(),
  status: mysqlEnum("status", ["draft", "sent", "signed"]).default("draft"),
  clientSignature: text("clientSignature"),
  companySignature: text("companySignature"),
  pdfData: text("pdfData"),
  sentAt: timestamp("sentAt"),
  signedAt: timestamp("signedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientContract = typeof clientContracts.$inferSelect;
export type InsertClientContract = typeof clientContracts.$inferInsert;

/**
 * CRM contacts — general contacts not tied to dealer or vendor onboarding
 */
export const crmContacts = mysqlTable("crm_contacts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 32 }),
  company: varchar("company", { length: 256 }),
  title: varchar("title", { length: 128 }),
  contactType: mysqlEnum("contactType", ["lead", "client", "partner", "vendor", "other"]).default("lead").notNull(),
  status: mysqlEnum("status", ["prospect", "active", "inactive", "churned"]).default("prospect"),
  leadTemp: mysqlEnum("leadTemp", ["hot", "warm", "cold"]).default("warm"),
  quickNotes: text("quickNotes"),
  lastContactedAt: timestamp("lastContactedAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type CrmContact = typeof crmContacts.$inferSelect;

/**
 * CRM deals — sales pipeline tracking
 */
export const crmDeals = mysqlTable("crm_deals", {
  id: int("id").autoincrement().primaryKey(),
  contactId: int("contactId"),
  dealerId: int("dealerId"),
  title: varchar("title", { length: 256 }).notNull(),
  stage: mysqlEnum("stage", [
    "lead", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"
  ]).default("lead").notNull(),
  value: int("value"),
  probability: int("probability").default(50),
  notes: text("notes"),
  expectedCloseDate: varchar("expectedCloseDate", { length: 32 }),
  closedAt: timestamp("closedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type CrmDeal = typeof crmDeals.$inferSelect;

/**
 * CRM tasks — internal task assignment and tracking
 */
export const crmTasks = mysqlTable("crm_tasks", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  assignedTo: varchar("assignedTo", { length: 256 }),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "completed", "cancelled"]).default("open").notNull(),
  dueDate: varchar("dueDate", { length: 32 }),
  dealerId: int("dealerId"),
  vendorId: int("vendorId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CrmTask = typeof crmTasks.$inferSelect;

/**
 * CRM incidents — issue tracking and escalation management
 */
export const crmIncidents = mysqlTable("crm_incidents", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  status: mysqlEnum("status", ["open", "investigating", "resolved", "closed"]).default("open").notNull(),
  reportedBy: varchar("reportedBy", { length: 256 }),
  dealerId: int("dealerId"),
  vendorId: int("vendorId"),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CrmIncident = typeof crmIncidents.$inferSelect;

/**
 * CRM interactions — call/email/meeting/note log per contact
 * Tracks every touchpoint with a contact across the sales lifecycle.
 */
export const crmInteractions = mysqlTable("crm_interactions", {
  id: int("id").autoincrement().primaryKey(),
  contactId: int("contactId").notNull(),
  dealId: int("dealId"),
  type: mysqlEnum("type", ["call", "email", "meeting", "note", "demo", "follow_up"]).default("note").notNull(),
  direction: mysqlEnum("direction", ["inbound", "outbound"]).default("outbound"),
  subject: varchar("subject", { length: 256 }).notNull(),
  body: text("body"),
  outcome: mysqlEnum("outcome", ["positive", "neutral", "negative", "no_answer"]).default("neutral"),
  durationMinutes: int("durationMinutes"),
  loggedBy: varchar("loggedBy", { length: 256 }),
  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CrmInteraction = typeof crmInteractions.$inferSelect;
export type InsertCrmInteraction = typeof crmInteractions.$inferInsert;


/**
 * CRM proposals — generated proposals sent to dealer contacts
 */
export const crmProposals = mysqlTable("crm_proposals", {
  id: int("id").autoincrement().primaryKey(),
  contactId: int("contactId"),
  dealId: int("dealId"),
  title: varchar("title", { length: 256 }).notNull(),
  services: text("services"),
  totalValue: int("totalValue"),
  status: mysqlEnum("status", ["draft", "sent", "viewed", "accepted", "declined", "expired"]).default("draft").notNull(),
  validUntil: varchar("validUntil", { length: 32 }),
  sentAt: timestamp("sentAt"),
  viewedAt: timestamp("viewedAt"),
  signedAt: timestamp("signedAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type CrmProposal = typeof crmProposals.$inferSelect;
export type InsertCrmProposal = typeof crmProposals.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// DEALER GROWTH CRM TABLES (from external CRM integration)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dealerships — core CRM record for each dealer target.
 * Used by the Dealer Growth Command System for acquisition tracking.
 */
export const dealerships = mysqlTable("dealerships", {
  id: int("id").autoincrement().primaryKey(),
  dealershipName: varchar("dealershipName", { length: 255 }).notNull(),
  franchiseBrands: json("franchiseBrands").$type<string[]>(),
  primaryBrand: varchar("primaryBrand", { length: 100 }),
  brandOverride: varchar("brandOverride", { length: 100 }),
  logoUrlColor: text("logoUrlColor"),
  logoUrlMono: text("logoUrlMono"),
  logoSelectedUrl: text("logoSelectedUrl"),
  logoGenerationPrompt: text("logoGenerationPrompt"),
  logoGeneratedDatetime: timestamp("logoGeneratedDatetime"),
  logoLocked: boolean("logoLocked").default(false),
  dealerWebsiteUrl: varchar("dealerWebsiteUrl", { length: 500 }),
  addressStreet: varchar("addressStreet", { length: 255 }),
  addressCity: varchar("addressCity", { length: 100 }),
  addressState: varchar("addressState", { length: 50 }),
  addressZip: varchar("addressZip", { length: 20 }),
  mainPhone: varchar("mainPhone", { length: 30 }),
  hoursOfOperation: text("hoursOfOperation"),
  areaBucket: varchar("areaBucket", { length: 100 }),
  dayPlan: varchar("dayPlan", { length: 20 }),
  priority: varchar("priority", { length: 20 }).default("High"),
  visitOrder: int("visitOrder").default(0),
  visitStatus: varchar("visitStatus", { length: 50 }).default("Not Started"),
  lastVisitDatetime: timestamp("lastVisitDatetime"),
  nextFollowUpDate: timestamp("nextFollowUpDate"),
  tags: json("tags").$type<string[]>(),
  leadTemp: varchar("leadTemp", { length: 20 }).default("none"),
  quickNote: varchar("quickNote", { length: 280 }),
  socialInstagramUrl: varchar("socialInstagramUrl", { length: 500 }),
  socialFacebookUrl: varchar("socialFacebookUrl", { length: 500 }),
  socialTiktokUrl: varchar("socialTiktokUrl", { length: 500 }),
  socialYoutubeUrl: varchar("socialYoutubeUrl", { length: 500 }),
  auditLastRunDatetime: timestamp("auditLastRunDatetime"),
  auditSummaryWorking: text("auditSummaryWorking"),
  auditSummaryMissing: text("auditSummaryMissing"),
  auditStaffPagePresent: boolean("auditStaffPagePresent"),
  auditStaffPhotosPresent: boolean("auditStaffPhotosPresent"),
  auditStaffNotes: text("auditStaffNotes"),
  auditOpportunityNotes: text("auditOpportunityNotes"),
  proposalSlug: varchar("proposalSlug", { length: 100 }).unique(),
  proposalPublicUrl: varchar("proposalPublicUrl", { length: 500 }),
  proposalLastGeneratedDatetime: timestamp("proposalLastGeneratedDatetime"),
  headshotAddon: boolean("headshotAddon").default(false),
  groupId: int("groupId"),
  totalViews: int("totalViews").default(0),
  uniqueViews: int("uniqueViews").default(0),
  ctaClicks: int("ctaClicks").default(0),
  createdById: int("createdById"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Dealership = typeof dealerships.$inferSelect;
export type InsertDealership = typeof dealerships.$inferInsert;

/**
 * Dealership contacts — people at each dealership.
 */
export const dealershipContacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  dealershipId: int("dealershipId").notNull(),
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  title: varchar("title", { length: 100 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 30 }),
  preferredContactMethod: varchar("preferredContactMethod", { length: 20 }).default("Email"),
  bestTimeToReach: varchar("bestTimeToReach", { length: 100 }),
  notes: text("notes"),
  lastContactedDatetime: timestamp("lastContactedDatetime"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DealershipContact = typeof dealershipContacts.$inferSelect;
export type InsertDealershipContact = typeof dealershipContacts.$inferInsert;

/**
 * Visit logs — on-site visit history for dealerships.
 */
export const visitLogs = mysqlTable("visitLogs", {
  id: int("id").autoincrement().primaryKey(),
  dealershipId: int("dealershipId").notNull(),
  contactId: int("contactId"),
  datetime: timestamp("datetime").defaultNow().notNull(),
  outcome: varchar("outcome", { length: 50 }),
  nextStep: varchar("nextStep", { length: 20 }),
  notes: text("notes"),
  attachmentUrl: varchar("attachmentUrl", { length: 500 }),
  createdById: int("createdById"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VisitLog = typeof visitLogs.$inferSelect;
export type InsertVisitLog = typeof visitLogs.$inferInsert;

/**
 * Proposal instances — generated proposal records.
 */
export const proposalInstances = mysqlTable("proposalInstances", {
  id: int("id").autoincrement().primaryKey(),
  dealershipId: int("dealershipId").notNull(),
  contactId: int("contactId"),
  createdDatetime: timestamp("createdDatetime").defaultNow().notNull(),
  publicUrl: varchar("publicUrl", { length: 500 }),
  generatedPdfUrl: varchar("generatedPdfUrl", { length: 500 }),
  emailSubject: varchar("emailSubject", { length: 500 }),
  emailBody: text("emailBody"),
  sentDatetime: timestamp("sentDatetime"),
  status: varchar("status", { length: 20 }).default("Draft"),
  emailProviderMessageId: varchar("emailProviderMessageId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProposalInstance = typeof proposalInstances.$inferSelect;
export type InsertProposalInstance = typeof proposalInstances.$inferInsert;

/**
 * Follow-ups — scheduled follow-up tasks.
 */
export const followUps = mysqlTable("followUps", {
  id: int("id").autoincrement().primaryKey(),
  dealershipId: int("dealershipId").notNull(),
  contactId: int("contactId"),
  proposalInstanceId: int("proposalInstanceId"),
  followUpNumber: int("followUpNumber").notNull(),
  dueDate: timestamp("dueDate").notNull(),
  status: varchar("status", { length: 20 }).default("Pending"),
  sentDatetime: timestamp("sentDatetime"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FollowUp = typeof followUps.$inferSelect;
export type InsertFollowUp = typeof followUps.$inferInsert;

/**
 * Dealership groups — multi-rooftop group groupings.
 */
export const dealershipGroups = mysqlTable("dealershipGroups", {
  id: int("id").autoincrement().primaryKey(),
  groupName: varchar("groupName", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DealershipGroup = typeof dealershipGroups.$inferSelect;

/**
 * Brand assets — OEM logo CDN references.
 */
export const brandAssets = mysqlTable("brandAssets", {
  id: int("id").autoincrement().primaryKey(),
  brand: varchar("brand", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  driveFileId: varchar("driveFileId", { length: 255 }),
  filename: varchar("filename", { length: 255 }),
  tags: json("tags").$type<string[]>(),
  cdnUrl: varchar("cdnUrl", { length: 500 }).notNull(),
  lastSynced: timestamp("lastSynced"),
  isPrimary: boolean("isPrimary").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BrandAsset = typeof brandAssets.$inferSelect;
export type InsertBrandAsset = typeof brandAssets.$inferInsert;

/**
 * App settings — key-value configuration storage.
 */
export const appSettings = mysqlTable("appSettings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 100 }).notNull().unique(),
  settingValue: text("settingValue"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AppSetting = typeof appSettings.$inferSelect;

/**
 * View tracking — proposal microsite view analytics.
 */
export const viewTracking = mysqlTable("viewTracking", {
  id: int("id").autoincrement().primaryKey(),
  dealershipId: int("dealershipId").notNull(),
  proposalSlug: varchar("proposalSlug", { length: 100 }),
  visitorIp: varchar("visitorIp", { length: 45 }),
  userAgent: text("userAgent"),
  eventType: varchar("eventType", { length: 30 }).default("view"),
  timeOnPageSeconds: int("timeOnPageSeconds"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ViewTrack = typeof viewTracking.$inferSelect;

/**
 * Dealership social links — protected, auditable social media links.
 */
export const dealershipSocialLinks = mysqlTable("dealershipSocialLinks", {
  id: int("id").autoincrement().primaryKey(),
  dealershipId: int("dealershipId").notNull(),
  platform: varchar("platform", { length: 32 }).notNull(),
  url: text("url").notNull(),
  normalizedUrl: text("normalizedUrl"),
  status: varchar("status", { length: 32 }).default("unverified"),
  source: varchar("source", { length: 64 }).default("manual_entry"),
  confidenceScore: varchar("confidenceScore", { length: 10 }).default("0.50"),
  discoveredAt: timestamp("discoveredAt").defaultNow(),
  lastVerifiedAt: timestamp("lastVerifiedAt"),
  isPrimary: boolean("isPrimary").default(false),
  isLocked: boolean("isLocked").default(false),
  isGroupLevel: boolean("isGroupLevel").default(false),
  isDeleted: boolean("isDeleted").default(false),
  deletedAt: timestamp("deletedAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DealershipSocialLink = typeof dealershipSocialLinks.$inferSelect;
export type InsertDealershipSocialLink = typeof dealershipSocialLinks.$inferInsert;

/**
 * Social link events — append-only audit log.
 */
export const socialLinkEvents = mysqlTable("socialLinkEvents", {
  id: int("id").autoincrement().primaryKey(),
  dealershipId: int("dealershipId").notNull(),
  socialLinkId: int("socialLinkId"),
  platform: varchar("platform", { length: 32 }),
  action: varchar("action", { length: 32 }).notNull(),
  oldUrl: text("oldUrl"),
  newUrl: text("newUrl"),
  reason: text("reason"),
  userId: int("userId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SocialLinkEvent = typeof socialLinkEvents.$inferSelect;
export type InsertSocialLinkEvent = typeof socialLinkEvents.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// PORTFOLIO MANAGEMENT SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Portfolio photos — each row is one photo shown on the public portfolio page.
 * sortOrder controls drag-and-drop display sequence (lower = first).
 * published = false hides the photo from the public page but keeps it in the DB.
 */
export const portfolioPhotos = mysqlTable("portfolio_photos", {
  id: int("id").autoincrement().primaryKey(),
  url: text("url").notNull(),
  fileKey: text("fileKey").notNull(),
  title: varchar("title", { length: 256 }),
  caption: text("caption"),
  sortOrder: int("sortOrder").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioPhoto = typeof portfolioPhotos.$inferSelect;
export type InsertPortfolioPhoto = typeof portfolioPhotos.$inferInsert;

/**
 * Portfolio tags — reusable labels (e.g. "EVENTS", "INVENTORY", "HEADSHOTS").
 * slug is the URL-safe version used for filtering on the public page.
 * color is an optional hex/oklch value for the admin tag chip.
 */
export const portfolioTags = mysqlTable("portfolio_tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 64 }).notNull().unique(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  color: varchar("color", { length: 32 }).default("#ffffff"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PortfolioTag = typeof portfolioTags.$inferSelect;
export type InsertPortfolioTag = typeof portfolioTags.$inferInsert;

/**
 * Portfolio photo → tag join table (many-to-many).
 */
export const portfolioPhotoTags = mysqlTable("portfolio_photo_tags", {
  id: int("id").autoincrement().primaryKey(),
  photoId: int("photoId").notNull(),
  tagId: int("tagId").notNull(),
});

export type PortfolioPhotoTag = typeof portfolioPhotoTags.$inferSelect;

/**
 * Portfolio videos — Vimeo embeds managed from the admin panel.
 * vimeoUrl accepts full Vimeo URLs (e.g. https://vimeo.com/123456789)
 * or embed URLs. thumbnailUrl is auto-fetched or manually set.
 */
export const portfolioVideos = mysqlTable("portfolio_videos", {
  id: int("id").autoincrement().primaryKey(),
  vimeoUrl: text("vimeoUrl").notNull(),
  title: varchar("title", { length: 256 }),
  caption: text("caption"),
  thumbnailUrl: text("thumbnailUrl"),
  sortOrder: int("sortOrder").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioVideo = typeof portfolioVideos.$inferSelect;
export type InsertPortfolioVideo = typeof portfolioVideos.$inferInsert;

/**
 * Portfolio video → tag join table (many-to-many).
 * Shares the same portfolioTags table as photos.
 */
export const portfolioVideoTags = mysqlTable("portfolio_video_tags", {
  id: int("id").autoincrement().primaryKey(),
  videoId: int("videoId").notNull(),
  tagId: int("tagId").notNull(),
});

export type PortfolioVideoTag = typeof portfolioVideoTags.$inferSelect;

/**
 * Portfolio graphics — design work, brand assets, social media graphics.
 * Same structure as portfolio_photos but kept separate for clean tab navigation.
 */
export const portfolioGraphics = mysqlTable("portfolio_graphics", {
  id: int("id").autoincrement().primaryKey(),
  url: text("url").notNull(),
  fileKey: text("fileKey").notNull(),
  title: varchar("title", { length: 256 }),
  caption: text("caption"),
  /** Client/brand name for filter tabs (e.g. "Lexus of Henderson", "Findlay Nissan", "Centennial Subaru") */
  client: varchar("client", { length: 128 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioGraphic = typeof portfolioGraphics.$inferSelect;
export type InsertPortfolioGraphic = typeof portfolioGraphics.$inferInsert;

/**
 * Portfolio graphic → tag join table (many-to-many).
 * Shares the same portfolioTags table as photos and videos.
 */
export const portfolioGraphicTags = mysqlTable("portfolio_graphic_tags", {
  id: int("id").autoincrement().primaryKey(),
  graphicId: int("graphicId").notNull(),
  tagId: int("tagId").notNull(),
});

export type PortfolioGraphicTag = typeof portfolioGraphicTags.$inferSelect;

/**
 * Featured Work — cards shown on the public Use Cases page "Featured Work" tab.
 * Admin can add, delete, and reorder via the admin panel.
 * sortOrder controls display sequence (lower = first).
 */
export const featuredWork = mysqlTable("featured_work", {
  id: int("id").autoincrement().primaryKey(),
  /** Display title shown on the card overlay */
  title: varchar("title", { length: 256 }).notNull(),
  /** Short category label (e.g. "Inventory Photography") */
  category: varchar("category", { length: 128 }),
  /** CDN URL of the cover image */
  imageUrl: text("imageUrl").notNull(),
  /** S3 file key for the cover image */
  imageKey: text("imageKey"),
  /** Optional URL slug linking to a project detail page */
  slug: varchar("slug", { length: 128 }),
  /** Controls display order — lower numbers appear first */
  sortOrder: int("sortOrder").default(0).notNull(),
  /** Whether this card is visible on the public page */
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FeaturedWork = typeof featuredWork.$inferSelect;
export type InsertFeaturedWork = typeof featuredWork.$inferInsert;
