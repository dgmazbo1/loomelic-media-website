import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
