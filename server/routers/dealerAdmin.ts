/**
 * Dealer Admin Router
 * All procedures for the Dealer Portal Admin panel at /dealer/admin
 */
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { dealers, crmTasks, crmIncidents } from "../../drizzle/schema";
import { eq, desc, count, sql, and } from "drizzle-orm";
import { randomBytes } from "crypto";

function generateToken() {
  return randomBytes(24).toString("hex");
}

export const dealerAdminRouter = router({
  /* ── Dashboard Stats ─────────────────────────────────────────── */
  getDashboardStats: publicProcedure.query(async () => {
    const db = await getDb();

    const [totalRow] = await db.select({ count: count() }).from(dealers);
    const totalDealers = Number(totalRow?.count ?? 0);

    const statusRows = await db
      .select({ status: dealers.status, count: count() })
      .from(dealers)
      .groupBy(dealers.status);

    const inProgress = Number(statusRows.find(r => r.status === "in_progress")?.count ?? 0);
    const submitted = Number(statusRows.find(r => r.status === "submitted")?.count ?? 0);

    const [incidentRow] = await db
      .select({ count: count() })
      .from(crmIncidents)
      .where(eq(crmIncidents.status, "open"));
    const openIncidents = Number(incidentRow?.count ?? 0);

    const recentIncidents = await db
      .select({ id: crmIncidents.id, title: crmIncidents.title, status: crmIncidents.status })
      .from(crmIncidents)
      .orderBy(desc(crmIncidents.createdAt))
      .limit(5);

    const [activeRow] = await db
      .select({ count: count() })
      .from(dealers)
      .where(sql`${dealers.createdAt} > DATE_SUB(NOW(), INTERVAL 7 DAY)`);
    const activeThisWeek = Number(activeRow?.count ?? 0);

    return {
      totalDealers,
      inProgress,
      submitted,
      openIncidents,
      recentIncidents,
      statusBreakdown: statusRows.map(r => ({ status: r.status, count: Number(r.count) })),
      activeThisWeek,
    };
  }),

  /* ── Dealers ─────────────────────────────────────────────────── */
  listDealers: publicProcedure.query(async () => {
    const db = await getDb();
    const rows = await db
      .select({
        id: dealers.id,
        token: dealers.token,
        status: dealers.status,
        legalName: dealers.legalName,
        storeName: dealers.storeName,
        createdAt: dealers.createdAt,
      })
      .from(dealers)
      .orderBy(desc(dealers.createdAt));

    // Normalize to name/company for the UI
    return rows.map(r => ({
      id: r.id,
      token: r.token,
      status: r.status,
      name: r.legalName || r.storeName || "Unnamed Dealer",
      company: r.storeName || "",
      createdAt: r.createdAt,
    }));
  }),

  createDealer: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      company: z.string().optional(),
      email: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      const token = generateToken();
      await db.insert(dealers).values({
        token,
        status: "invited",
        legalName: input.name,
        storeName: input.company ?? "",
      });
      return { token };
    }),

  /* ── Tasks ───────────────────────────────────────────────────── */
  listTasks: publicProcedure.query(async () => {
    const db = await getDb();
    return db
      .select()
      .from(crmTasks)
      .orderBy(desc(crmTasks.createdAt));
  }),

  createTask: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.insert(crmTasks).values({
        title: input.title,
        description: input.description ?? "",
        status: "open",
        priority: "medium",
      });
    }),

  /* ── Incidents ───────────────────────────────────────────────── */
  listIncidents: publicProcedure.query(async () => {
    const db = await getDb();
    return db
      .select()
      .from(crmIncidents)
      .orderBy(desc(crmIncidents.createdAt));
  }),

  createIncident: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.insert(crmIncidents).values({
        title: input.title,
        description: input.description ?? "",
        status: "open",
        severity: "medium",
      });
    }),

  /* ── Reminders (stored as pending tasks) ────────────────────── */
  listReminders: publicProcedure.query(async () => {
    const db = await getDb();
    return db
      .select()
      .from(crmTasks)
      .where(eq(crmTasks.priority, "high"))
      .orderBy(desc(crmTasks.createdAt));
  }),

  createReminder: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      dueDate: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.insert(crmTasks).values({
        title: input.title,
        description: input.dueDate ? `Due: ${new Date(input.dueDate).toLocaleString()}` : "",
        status: "open",
        priority: "high",
        dueDate: input.dueDate ? new Date(input.dueDate).toISOString() : null,
      });
    }),
});
