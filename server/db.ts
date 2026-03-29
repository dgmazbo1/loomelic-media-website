import { eq, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, projects, galleryImages, projectVideos, InsertProject, InsertGalleryImage, InsertProjectVideo } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Project helpers ─────────────────────────────────────────────────────────

export async function getAllProjects() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).orderBy(asc(projects.name));
}

/** Returns all projects with gallery + video counts in a single round-trip */
export async function getAllProjectsWithStatus() {
  const db = await getDb();
  if (!db) return [];

  const allProjects = await db.select().from(projects).orderBy(asc(projects.name));
  if (allProjects.length === 0) return [];

  // Fetch counts for all projects in parallel
  const statusList = await Promise.all(
    allProjects.map(async (p) => {
      const [gallery, videos] = await Promise.all([
        db.select().from(galleryImages).where(eq(galleryImages.projectId, p.id)),
        db.select().from(projectVideos).where(eq(projectVideos.projectId, p.id)),
      ]);
      return {
        ...p,
        galleryCount: gallery.length,
        videoCount: videos.length,
        hasHero: !!p.heroImageUrl,
      };
    })
  );

  return statusList;
}

export async function getProjectBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return result[0] ?? undefined;
}

export async function upsertProject(data: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(projects).values(data).onDuplicateKeyUpdate({
    set: { name: data.name, heroImageUrl: data.heroImageUrl, heroImageKey: data.heroImageKey },
  });
  const result = await db.select().from(projects).where(eq(projects.slug, data.slug)).limit(1);
  return result[0];
}

export async function createProject(slug: string, name: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Check for duplicate slug
  const existing = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  if (existing.length > 0) throw new Error(`A project with slug "${slug}" already exists`);
  await db.insert(projects).values({ slug, name });
  const result = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return result[0];
}

export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Cascade: delete gallery images and videos first
  await db.delete(galleryImages).where(eq(galleryImages.projectId, id));
  await db.delete(projectVideos).where(eq(projectVideos.projectId, id));
  await db.delete(projects).where(eq(projects.id, id));
}

export async function updateProjectHero(slug: string, heroImageUrl: string, heroImageKey: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(projects).set({ heroImageUrl, heroImageKey }).where(eq(projects.slug, slug));
}

// ─── Gallery image helpers ───────────────────────────────────────────────────

export async function getGalleryImages(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(galleryImages).where(eq(galleryImages.projectId, projectId)).orderBy(asc(galleryImages.sortOrder));
}

export async function addGalleryImage(data: InsertGalleryImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(galleryImages).values(data);
}

export async function deleteGalleryImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(galleryImages).where(eq(galleryImages.id, id));
}

export async function reorderGalleryImages(updates: { id: number; sortOrder: number }[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  for (const u of updates) {
    await db.update(galleryImages).set({ sortOrder: u.sortOrder }).where(eq(galleryImages.id, u.id));
  }
}

// ─── Video helpers ────────────────────────────────────────────────────────────

export async function getProjectVideos(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projectVideos).where(eq(projectVideos.projectId, projectId)).orderBy(asc(projectVideos.sortOrder));
}

export async function addProjectVideo(data: InsertProjectVideo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(projectVideos).values(data);
}

export async function updateProjectVideo(id: number, label: string, embedUrl: string, portrait?: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: Partial<typeof projectVideos.$inferInsert> = { label, embedUrl };
  if (portrait !== undefined) updateData.portrait = portrait;
  await db.update(projectVideos).set(updateData).where(eq(projectVideos.id, id));
}

export async function deleteProjectVideo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(projectVideos).where(eq(projectVideos.id, id));
}

export async function reorderProjectVideos(updates: { id: number; sortOrder: number }[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  for (const u of updates) {
    await db.update(projectVideos).set({ sortOrder: u.sortOrder }).where(eq(projectVideos.id, u.id));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ENTERPRISE CRM HELPERS
// ─────────────────────────────────────────────────────────────────────────────

import {
  dealers, dealerContacts, dealerMonthlyInputs, dealerPlatformAccess,
  dealerCompliance, dealerFiles, dealerComments,
  vendors, vendorJobs,
  crmContacts, crmDeals, crmTasks, crmIncidents, contracts,
  crmProposals,
  InsertDealer, InsertVendor,
} from "../drizzle/schema";
import { desc } from "drizzle-orm";

// ─── Dealers ─────────────────────────────────────────────────────────────────

export async function getAllDealers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dealers).orderBy(desc(dealers.createdAt));
}

export async function getDealerById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [dealer] = await db.select().from(dealers).where(eq(dealers.id, id));
  return dealer ?? null;
}

export async function getDealerByToken(token: string) {
  const db = await getDb();
  if (!db) return null;
  const [dealer] = await db.select().from(dealers).where(eq(dealers.token, token));
  return dealer ?? null;
}

export async function createDealer(data: { token: string; storeName?: string; status?: "invited" }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(dealers).values({ ...data, status: "invited" });
  return (result as { insertId: number }).insertId;
}

export async function updateDealer(id: number, data: Partial<InsertDealer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(dealers).set(data).where(eq(dealers.id, id));
}

export async function updateDealerByToken(token: string, data: Partial<InsertDealer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(dealers).set(data).where(eq(dealers.token, token));
}

export async function getDealerContacts(dealerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dealerContacts).where(eq(dealerContacts.dealerId, dealerId));
}

export async function replaceDealerContacts(dealerId: number, contacts: Array<{
  contactType?: string; name?: string; title?: string;
  email?: string; phone?: string; preferredMethod?: string;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(dealerContacts).where(eq(dealerContacts.dealerId, dealerId));
  if (contacts.length > 0) {
    await db.insert(dealerContacts).values(contacts.map(c => ({ ...c, dealerId })));
  }
}

export async function getDealerMonthlyInputs(dealerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dealerMonthlyInputs).where(eq(dealerMonthlyInputs.dealerId, dealerId));
}

export async function replaceDealerMonthlyInputs(dealerId: number, inputs: Array<{
  inputType: "special" | "campaign" | "promotion" | "event";
  title?: string; description?: string; startDate?: string; endDate?: string;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(dealerMonthlyInputs).where(eq(dealerMonthlyInputs.dealerId, dealerId));
  if (inputs.length > 0) {
    await db.insert(dealerMonthlyInputs).values(inputs.map(i => ({ ...i, dealerId })));
  }
}

export async function getDealerPlatformAccess(dealerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dealerPlatformAccess).where(eq(dealerPlatformAccess.dealerId, dealerId));
}

export async function replaceDealerPlatformAccess(dealerId: number, platforms: Array<{
  platform?: string; username?: string; notes?: string;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(dealerPlatformAccess).where(eq(dealerPlatformAccess.dealerId, dealerId));
  if (platforms.length > 0) {
    await db.insert(dealerPlatformAccess).values(platforms.map(p => ({ ...p, dealerId })));
  }
}

export async function getDealerCompliance(dealerId: number) {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db.select().from(dealerCompliance).where(eq(dealerCompliance.dealerId, dealerId));
  return row ?? null;
}

export async function upsertDealerCompliance(dealerId: number, data: {
  oemRestrictions?: string; brandGuidelines?: string; additionalRestrictions?: string;
  acknowledgedDeliverables?: number; acknowledgedPolicies?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getDealerCompliance(dealerId);
  if (existing) {
    await db.update(dealerCompliance).set(data).where(eq(dealerCompliance.dealerId, dealerId));
  } else {
    await db.insert(dealerCompliance).values({ ...data, dealerId });
  }
}

export async function getDealerFiles(dealerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dealerFiles).where(eq(dealerFiles.dealerId, dealerId));
}

export async function addDealerFile(data: {
  dealerId: number; filename?: string; fileKey: string; url: string;
  mimeType?: string; sizeBytes?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(dealerFiles).values(data);
}

export async function getDealerComments(dealerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dealerComments).where(eq(dealerComments.dealerId, dealerId)).orderBy(desc(dealerComments.createdAt));
}

export async function addDealerComment(data: {
  dealerId: number; authorName?: string; authorRole?: string;
  content: string; isAdminComment: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(dealerComments).values(data);
}

// ─── Vendors ─────────────────────────────────────────────────────────────────

export async function getAllVendors() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vendors).orderBy(desc(vendors.createdAt));
}

export async function getVendorById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
  return vendor ?? null;
}

export async function getVendorByToken(token: string) {
  const db = await getDb();
  if (!db) return null;
  const [vendor] = await db.select().from(vendors).where(eq(vendors.token, token));
  return vendor ?? null;
}

export async function createVendor(data: { token: string; name?: string; email?: string; role?: InsertVendor["role"] }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(vendors).values({ ...data, status: "invited", role: data.role ?? "photographer" });
  return (result as { insertId: number }).insertId;
}

export async function updateVendor(id: number, data: Partial<InsertVendor>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(vendors).set(data).where(eq(vendors.id, id));
}

export async function updateVendorByToken(token: string, data: Partial<InsertVendor>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(vendors).set(data).where(eq(vendors.token, token));
}

export async function getVendorJobs(vendorId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vendorJobs).where(eq(vendorJobs.vendorId, vendorId)).orderBy(desc(vendorJobs.createdAt));
}

export async function createVendorJob(data: {
  vendorId: number; title: string; description?: string;
  eventDate?: string; eventCity?: string; deliverablesDue?: string; notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(vendorJobs).values({ ...data, status: "pending" });
  return (result as { insertId: number }).insertId;
}

export async function updateVendorJobStatus(id: number, status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(vendorJobs).set({ status }).where(eq(vendorJobs.id, id));
}

// ─── CRM Contacts ─────────────────────────────────────────────────────────────

export async function getAllCrmContacts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(crmContacts).orderBy(desc(crmContacts.createdAt));
}

export async function createCrmContact(data: {
  name: string; email?: string; phone?: string; company?: string;
  title?: string; contactType?: "lead" | "client" | "partner" | "vendor" | "other";
  status?: "prospect" | "active" | "inactive" | "churned";
  leadTemp?: "hot" | "warm" | "cold"; quickNotes?: string; notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(crmContacts).values({ ...data, contactType: data.contactType ?? "lead", status: data.status ?? "prospect" });
  return (result as { insertId: number }).insertId;
}

export async function updateCrmContact(id: number, data: Partial<typeof crmContacts.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(crmContacts).set(data).where(eq(crmContacts.id, id));
}

export async function deleteCrmContact(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(crmContacts).where(eq(crmContacts.id, id));
}

// ─── CRM Deals ────────────────────────────────────────────────────────────────

export async function getAllCrmDeals() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(crmDeals).orderBy(desc(crmDeals.createdAt));
}

export async function createCrmDeal(data: {
  title: string; contactId?: number; dealerId?: number;
  stage?: "lead" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
  value?: number; probability?: number; notes?: string; expectedCloseDate?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(crmDeals).values({ ...data, stage: data.stage ?? "lead", probability: data.probability ?? 50 });
  return (result as { insertId: number }).insertId;
}

export async function updateCrmDeal(id: number, data: Partial<typeof crmDeals.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(crmDeals).set(data).where(eq(crmDeals.id, id));
}

export async function deleteCrmDeal(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(crmDeals).where(eq(crmDeals.id, id));
}

// ─── CRM Tasks ────────────────────────────────────────────────────────────────

export async function getAllCrmTasks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(crmTasks).orderBy(desc(crmTasks.createdAt));
}

export async function createCrmTask(data: {
  title: string; description?: string; assignedTo?: string;
  priority?: "low" | "medium" | "high" | "urgent"; dueDate?: string;
  dealerId?: number; vendorId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(crmTasks).values({ ...data, priority: data.priority ?? "medium", status: "open" });
  return (result as { insertId: number }).insertId;
}

export async function updateCrmTask(id: number, data: Partial<typeof crmTasks.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(crmTasks).set(data).where(eq(crmTasks.id, id));
}

export async function deleteCrmTask(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(crmTasks).where(eq(crmTasks.id, id));
}

// ─── CRM Incidents ────────────────────────────────────────────────────────────

export async function getAllCrmIncidents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(crmIncidents).orderBy(desc(crmIncidents.createdAt));
}

export async function createCrmIncident(data: {
  title: string; description?: string;
  severity?: "low" | "medium" | "high" | "critical";
  reportedBy?: string; dealerId?: number; vendorId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(crmIncidents).values({ ...data, severity: data.severity ?? "medium", status: "open" });
  return (result as { insertId: number }).insertId;
}

export async function updateCrmIncident(id: number, data: Partial<typeof crmIncidents.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(crmIncidents).set(data).where(eq(crmIncidents.id, id));
}

// ─── Contracts ────────────────────────────────────────────────────────────────

export async function getAllContracts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contracts).orderBy(desc(contracts.createdAt));
}

export async function createContract(data: {
  contractType: "contractor" | "client"; signingToken: string;
  clientName?: string; clientEmail?: string; contractorRole?: string;
  eventDate?: string; eventCity?: string; equipmentDetails?: string;
  amount?: number; isRevenue: number; vendorId?: number; dealerId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await (db as any).insert(contracts).values({ ...data, status: "draft" });
  return (result as { insertId: number }).insertId;
}

export async function updateContractStatus(id: number, status: "draft" | "sent" | "signed" | "completed" | "cancelled" | "expired") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contracts).set({ status: status as any }).where(eq(contracts.id, id));
}

// ─── CRM Stats ────────────────────────────────────────────────────────────────

export async function getCrmStats() {
  const db = await getDb();
  if (!db) return { totalContacts: 0, activeDeals: 0, openTasks: 0, openIncidents: 0, totalRevenue: 0, totalContracts: 0 };

  const [allContacts, allDeals, allTasks, allIncidents, allContracts, allDealers, allVendors] = await Promise.all([
    db.select().from(crmContacts),
    db.select().from(crmDeals),
    db.select().from(crmTasks),
    db.select().from(crmIncidents),
    db.select().from(contracts),
    db.select().from(dealers),
    db.select().from(vendors),
  ]);

  const openTasks = allTasks.filter((t: { status: string }) => t.status === "open" || t.status === "in_progress").length;
  const openIncidents = allIncidents.filter((i: { status: string }) => i.status === "open" || i.status === "investigating").length;
  const activeDeals = allDeals.filter((d: { stage: string }) => d.stage !== "closed_won" && d.stage !== "closed_lost").length;
  const totalRevenue = (allContracts as any[])
    .filter((c: any) => c.isRevenue === 1 && c.status === "signed")
    .reduce((sum: number, c: any) => sum + (c.amount ?? 0), 0);

  return {
    totalContacts: allContacts.length,
    activeDeals,
    openTasks,
    openIncidents,
    totalRevenue,
    totalContracts: allContracts.length,
    totalDealers: allDealers.length,
    activeDealers: allDealers.filter((d: { status: string }) => d.status === "active").length,
    totalVendors: allVendors.length,
    activeVendors: allVendors.filter((v: { status: string }) => v.status === "active").length,
  };
}


// ─── CRM Proposals ──────────────────────────────────────────────────────────

export async function getAllCrmProposals() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(crmProposals).orderBy(desc(crmProposals.createdAt));
}

export async function createCrmProposal(data: {
  title: string; contactId?: number; dealId?: number;
  services?: string; totalValue?: number;
  status?: "draft" | "sent" | "viewed" | "accepted" | "declined" | "expired";
  validUntil?: string; notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(crmProposals).values({
    ...data,
    status: data.status ?? "draft",
  });
  return (result as { insertId: number }).insertId;
}

export async function updateCrmProposal(id: number, data: Partial<typeof crmProposals.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(crmProposals).set(data).where(eq(crmProposals.id, id));
}

export async function deleteCrmProposal(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(crmProposals).where(eq(crmProposals.id, id));
}


// ─────────────────────────────────────────────────────────────────────────────
// DEALER GROWTH CRM HELPERS (from external CRM integration)
// ─────────────────────────────────────────────────────────────────────────────

import { and, lte, sql, inArray } from "drizzle-orm";
import {
  dealerships, InsertDealership, Dealership,
  dealershipContacts, InsertDealershipContact,
  visitLogs, InsertVisitLog,
  proposalInstances, InsertProposalInstance,
  followUps, InsertFollowUp,
  dealershipGroups,
  brandAssets, InsertBrandAsset,
  appSettings,
  viewTracking,
  dealershipSocialLinks, socialLinkEvents,
} from "../drizzle/schema";

// ─── Dealerships ───
export async function listDealerships(filters?: { dayPlan?: string; areaBucket?: string; visitStatus?: string }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.dayPlan) conditions.push(eq(dealerships.dayPlan, filters.dayPlan as any));
  if (filters?.areaBucket) conditions.push(eq(dealerships.areaBucket, filters.areaBucket));
  if (filters?.visitStatus) conditions.push(eq(dealerships.visitStatus, filters.visitStatus as any));
  let query = db.select().from(dealerships);
  if (conditions.length > 0) query = query.where(and(...conditions)) as any;
  const rows = await (query as any).orderBy(asc(dealerships.visitOrder));

  // Enrich with social links from DealershipSocialLinks table
  if (rows.length === 0) return rows;
  const ids = rows.map((r: any) => r.id);
  const socials = await db.select().from(dealershipSocialLinks)
    .where(inArray(dealershipSocialLinks.dealershipId, ids))
    .then((links: any[]) => links.filter((l: any) => !l.isDeleted && l.isPrimary));

  const socialMap: Record<number, Record<string, string>> = {};
  for (const s of socials) {
    if (!socialMap[s.dealershipId]) socialMap[s.dealershipId] = {};
    socialMap[s.dealershipId][s.platform] = s.url;
  }

  return rows.map((r: any) => ({
    ...r,
    socialInstagramUrl: socialMap[r.id]?.instagram || r.socialInstagramUrl || null,
    socialFacebookUrl: socialMap[r.id]?.facebook || r.socialFacebookUrl || null,
    socialTiktokUrl: socialMap[r.id]?.tiktok || r.socialTiktokUrl || null,
    socialYoutubeUrl: socialMap[r.id]?.youtube || r.socialYoutubeUrl || null,
  }));
}

export async function getDealership(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(dealerships).where(eq(dealerships.id, id)).limit(1);
  return result[0];
}

export async function getDealershipBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(dealerships).where(eq(dealerships.proposalSlug, slug)).limit(1);
  return result[0];
}

export async function createDealership(data: InsertDealership) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(dealerships).values(data);
  return result[0].insertId;
}

export async function updateDealership(id: number, data: Partial<InsertDealership>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(dealerships).set(data).where(eq(dealerships.id, id));
}

export async function deleteDealership(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(dealerships).where(eq(dealerships.id, id));
}

// ─── Dealership Contacts ───
export async function listDealershipContacts(dealershipId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dealershipContacts).where(eq(dealershipContacts.dealershipId, dealershipId)).orderBy(desc(dealershipContacts.createdAt));
}

export async function getDealershipContact(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(dealershipContacts).where(eq(dealershipContacts.id, id)).limit(1);
  return result[0];
}

export async function createDealershipContact(data: InsertDealershipContact) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(dealershipContacts).values(data);
  return result[0].insertId;
}

export async function updateDealershipContact(id: number, data: Partial<InsertDealershipContact>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(dealershipContacts).set(data).where(eq(dealershipContacts.id, id));
}

export async function deleteDealershipContact(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(dealershipContacts).where(eq(dealershipContacts.id, id));
}

// ─── Visit Logs ───
export async function listVisitLogs(dealershipId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(visitLogs).where(eq(visitLogs.dealershipId, dealershipId)).orderBy(desc(visitLogs.datetime));
}

export async function createVisitLog(data: InsertVisitLog) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(visitLogs).values(data);
  return result[0].insertId;
}

// ─── Proposal Instances ───
export async function listProposals(dealershipId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(proposalInstances).where(eq(proposalInstances.dealershipId, dealershipId)).orderBy(desc(proposalInstances.createdDatetime));
}

export async function createProposal(data: InsertProposalInstance) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(proposalInstances).values(data);
  return result[0].insertId;
}

export async function updateProposal(id: number, data: Partial<InsertProposalInstance>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(proposalInstances).set(data).where(eq(proposalInstances.id, id));
}

// ─── Follow-Ups ───
export async function listFollowUps(filters?: { dealershipId?: number; status?: string; dueBefore?: Date }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.dealershipId) conditions.push(eq(followUps.dealershipId, filters.dealershipId));
  if (filters?.status) conditions.push(eq(followUps.status, filters.status as any));
  if (filters?.dueBefore) conditions.push(lte(followUps.dueDate, filters.dueBefore));
  let query = db.select().from(followUps);
  if (conditions.length > 0) query = query.where(and(...conditions)) as any;
  return (query as any).orderBy(asc(followUps.dueDate));
}

export async function createFollowUp(data: InsertFollowUp) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(followUps).values(data);
  return result[0].insertId;
}

export async function updateFollowUp(id: number, data: Partial<InsertFollowUp>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(followUps).set(data).where(eq(followUps.id, id));
}

// ─── Brand Assets ───
export async function listBrandAssets(brand?: string, category?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (brand) conditions.push(eq(brandAssets.brand, brand));
  if (category) conditions.push(eq(brandAssets.category, category as any));
  let query = db.select().from(brandAssets);
  if (conditions.length > 0) query = query.where(and(...conditions)) as any;
  return query;
}

export async function createBrandAsset(data: InsertBrandAsset) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(brandAssets).values(data);
  return result[0].insertId;
}

// ─── App Settings ───
export async function getSetting(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(appSettings).where(eq(appSettings.settingKey, key)).limit(1);
  return result[0]?.settingValue ?? null;
}

export async function setSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(appSettings).values({ settingKey: key, settingValue: value })
    .onDuplicateKeyUpdate({ set: { settingValue: value } });
}

export async function getAllSettings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(appSettings);
}

// ─── View Tracking ───
export async function trackView(data: { dealershipId: number; proposalSlug?: string; visitorIp?: string; userAgent?: string; eventType?: string }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(viewTracking).values(data as any);
  if (data.eventType === 'view' || !data.eventType) {
    await db.update(dealerships).set({
      totalViews: sql`${dealerships.totalViews} + 1`,
    }).where(eq(dealerships.id, data.dealershipId));
  } else if (data.eventType?.startsWith('cta_click')) {
    await db.update(dealerships).set({
      ctaClicks: sql`${dealerships.ctaClicks} + 1`,
    }).where(eq(dealerships.id, data.dealershipId));
  }
}

export async function getViewStats(dealershipId: number) {
  const db = await getDb();
  if (!db) return { totalViews: 0, uniqueViews: 0, ctaClicks: 0 };
  const result = await db.select({
    totalViews: dealerships.totalViews,
    uniqueViews: dealerships.uniqueViews,
    ctaClicks: dealerships.ctaClicks,
  }).from(dealerships).where(eq(dealerships.id, dealershipId)).limit(1);
  return result[0] ?? { totalViews: 0, uniqueViews: 0, ctaClicks: 0 };
}

// ─── Dealership Groups ───
export async function listGroups() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dealershipGroups);
}

export async function createGroup(name: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(dealershipGroups).values({ groupName: name });
  return result[0].insertId;
}

export async function getGroupDealerships(groupId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dealerships).where(eq(dealerships.groupId, groupId));
}

// ─── Dashboard Stats ───
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { total: 0, visited: 0, proposalsSent: 0, meetingsSet: 0, closedWon: 0 };
  const all = await db.select().from(dealerships);
  return {
    total: all.length,
    visited: all.filter(d => d.visitStatus !== 'Not Started').length,
    proposalsSent: all.filter(d => ['Proposal Sent', 'Follow-Up', 'Meeting Set', 'Closed Won'].includes(d.visitStatus!)).length,
    meetingsSet: all.filter(d => d.visitStatus === 'Meeting Set').length,
    closedWon: all.filter(d => d.visitStatus === 'Closed Won').length,
  };
}

// ─── Featured Work helpers ────────────────────────────────────────────────────
import { featuredWork, InsertFeaturedWork } from "../drizzle/schema";

export async function getAllFeaturedWork() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(featuredWork).orderBy(asc(featuredWork.sortOrder));
}

export async function getPublishedFeaturedWork() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(featuredWork)
    .where(eq(featuredWork.published, true))
    .orderBy(asc(featuredWork.sortOrder));
}

export async function createFeaturedWork(data: Omit<InsertFeaturedWork, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(featuredWork).values(data);
  const insertId = (result as { insertId: number }).insertId;
  const [row] = await db.select().from(featuredWork).where(eq(featuredWork.id, insertId));
  return row;
}

export async function updateFeaturedWork(id: number, data: Partial<InsertFeaturedWork>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(featuredWork).set(data).where(eq(featuredWork.id, id));
  const [row] = await db.select().from(featuredWork).where(eq(featuredWork.id, id));
  return row;
}

export async function deleteFeaturedWork(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(featuredWork).where(eq(featuredWork.id, id));
}

export async function reorderFeaturedWork(updates: { id: number; sortOrder: number }[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  for (const u of updates) {
    await db.update(featuredWork).set({ sortOrder: u.sortOrder }).where(eq(featuredWork.id, u.id));
  }
}

// ─── Portfolio Graphics ───────────────────────────────────────────────────────

import { portfolioGraphics } from "../drizzle/schema";

export async function getAllPortfolioGraphics() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portfolioGraphics).orderBy(portfolioGraphics.sortOrder);
}

export async function getPublishedPortfolioGraphics() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portfolioGraphics)
    .where(eq(portfolioGraphics.published, true))
    .orderBy(portfolioGraphics.sortOrder);
}

export async function createPortfolioGraphic(data: {
  title?: string; caption?: string; url: string; fileKey: string;
  published?: boolean; sortOrder?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(portfolioGraphics).values({
    url: data.url,
    fileKey: data.fileKey,
    title: data.title,
    caption: data.caption,
    published: data.published ?? true,
    sortOrder: data.sortOrder ?? 0,
  });
  return (result as { insertId: number }).insertId;
}

export async function updatePortfolioGraphic(id: number, data: Partial<typeof portfolioGraphics.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(portfolioGraphics).set({ ...data, updatedAt: new Date() }).where(eq(portfolioGraphics.id, id));
}

export async function deletePortfolioGraphic(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(portfolioGraphics).where(eq(portfolioGraphics.id, id));
}

export async function reorderPortfolioGraphics(updates: { id: number; sortOrder: number }[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  for (const u of updates) {
    await db.update(portfolioGraphics).set({ sortOrder: u.sortOrder }).where(eq(portfolioGraphics.id, u.id));
  }
}
