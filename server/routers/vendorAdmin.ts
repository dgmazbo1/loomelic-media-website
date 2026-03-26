/**
 * Vendor Admin Router
 * All procedures for the Vendor Portal Admin panel at /vendor/admin
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { vendors, vendorJobs, contracts, crmTasks, crmIncidents } from "../../drizzle/schema";
import { eq, desc, count, sql } from "drizzle-orm";
import { randomBytes } from "crypto";

function generateToken() {
  return randomBytes(24).toString("hex");
}

export const vendorAdminRouter = router({
  /* ── Dashboard Stats ─────────────────────────────────────────── */
  getDashboardStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

    const [totalRow] = await db.select({ count: count() }).from(vendors);
    const totalVendors = Number(totalRow?.count ?? 0);

    const [contractRow] = await db
      .select({ count: count() })
      .from(contracts)
      .where(eq(contracts.status, "sent"));
    const activeContracts = Number(contractRow?.count ?? 0);

    const [jobRow] = await db
      .select({ count: count() })
      .from(vendorJobs)
      .where(eq(vendorJobs.status, "pending"));
    const openJobs = Number(jobRow?.count ?? 0);

    const [incidentRow] = await db
      .select({ count: count() })
      .from(crmIncidents)
      .where(eq(crmIncidents.status, "open"));
    const openIncidents = Number(incidentRow?.count ?? 0);

    const recentContracts = await db
      .select({
        id: contracts.id,
        contractorName: contracts.contractorName,
        status: contracts.status,
      })
      .from(contracts)
      .orderBy(desc(contracts.createdAt))
      .limit(5);

    const vendorsByRole = await db
      .select({ role: vendors.role, count: count() })
      .from(vendors)
      .groupBy(vendors.role);

    const [activeRow] = await db
      .select({ count: count() })
      .from(vendors)
      .where(sql`${vendors.createdAt} > DATE_SUB(NOW(), INTERVAL 7 DAY)`);
    const activeThisWeek = Number(activeRow?.count ?? 0);

    return {
      totalVendors,
      activeContracts,
      openJobs,
      openIncidents,
      recentContracts,
      vendorsByRole: vendorsByRole.map(r => ({ role: r.role, count: Number(r.count) })),
      activeThisWeek,
    };
  }),

  /* ── Vendors ─────────────────────────────────────────────────── */
  listVendors: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
    return db
      .select({
        id: vendors.id,
        token: vendors.token,
        status: vendors.status,
        name: vendors.name,
        email: vendors.email,
        role: vendors.role,
        createdAt: vendors.createdAt,
      })
      .from(vendors)
      .orderBy(desc(vendors.createdAt));
  }),

  createVendor: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email().optional(),
      role: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const token = generateToken();
      await db.insert(vendors).values({
        token,
        status: "invited",
        name: input.name,
        email: input.email ?? "",
        role: (input.role as any) ?? "photographer",
      });
      return { token };
    }),

  /* ── Contracts ───────────────────────────────────────────────── */
  listContracts: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
    return db
      .select({
        id: contracts.id,
        contractorName: contracts.contractorName,
        projectName: contracts.projectName,
        status: contracts.status,
        token: contracts.token,
        createdAt: contracts.createdAt,
      })
      .from(contracts)
      .orderBy(desc(contracts.createdAt));
  }),

  /* ── Jobs ────────────────────────────────────────────────────── */
  listJobs: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
    return db
      .select()
      .from(vendorJobs)
      .orderBy(desc(vendorJobs.createdAt));
  }),

  createJob: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      shootDate: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const [firstVendor] = await db.select({ id: vendors.id }).from(vendors).limit(1);
      if (!firstVendor) {
        throw new Error("No vendors exist yet. Create a vendor first.");
      }
      await db.insert(vendorJobs).values({
        vendorId: firstVendor.id,
        title: input.title,
        description: input.description ?? "",
        status: "pending",
        eventDate: input.shootDate ? new Date(input.shootDate).toISOString().split("T")[0] : null,
      });
    }),

  /* ── Tasks ───────────────────────────────────────────────────── */
  listTasks: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
    return db
      .select()
      .from(crmTasks)
      .orderBy(desc(crmTasks.createdAt));
  }),

  createTask: publicProcedure
    .input(z.object({
      title: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db.insert(crmTasks).values({
        title: input.title,
        status: "open",
        priority: "medium",
      });
    }),

  /* ── Incidents ───────────────────────────────────────────────── */
  listIncidents: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
    return db
      .select()
      .from(crmIncidents)
      .orderBy(desc(crmIncidents.createdAt));
  }),

  createIncident: publicProcedure
    .input(z.object({
      title: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db.insert(crmIncidents).values({
        title: input.title,
        status: "open",
        severity: "medium",
      });
    }),
});
