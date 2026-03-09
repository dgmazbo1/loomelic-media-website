import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getAllCrmContacts, createCrmContact, updateCrmContact, deleteCrmContact,
  getAllCrmDeals, createCrmDeal, updateCrmDeal, deleteCrmDeal,
  getAllCrmTasks, createCrmTask, updateCrmTask, deleteCrmTask,
  getAllCrmIncidents, createCrmIncident, updateCrmIncident,
  getAllContracts, createContract, updateContractStatus,
  getCrmStats,
} from "../db";
import { nanoid } from "nanoid";

// ─── Admin-only guard ────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const crmRouter = router({

  // ─── Contacts ─────────────────────────────────────────────────────────────

  listContacts: adminProcedure.query(async () => getAllCrmContacts()),

  createContact: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      company: z.string().optional(),
      title: z.string().optional(),
      contactType: z.enum(["lead", "client", "partner", "vendor", "other"]).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await createCrmContact(input);
      return { id };
    }),

  updateContact: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      company: z.string().optional(),
      title: z.string().optional(),
      contactType: z.enum(["lead", "client", "partner", "vendor", "other"]).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateCrmContact(id, data);
      return { success: true };
    }),

  deleteContact: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteCrmContact(input.id);
      return { success: true };
    }),

  // ─── Deals ────────────────────────────────────────────────────────────────

  listDeals: adminProcedure.query(async () => getAllCrmDeals()),

  createDeal: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      contactId: z.number().optional(),
      dealerId: z.number().optional(),
      stage: z.enum(["lead", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"]).optional(),
      value: z.number().optional(),
      notes: z.string().optional(),
      expectedCloseDate: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await createCrmDeal(input);
      return { id };
    }),

  updateDeal: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      stage: z.enum(["lead", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"]).optional(),
      value: z.number().optional(),
      notes: z.string().optional(),
      expectedCloseDate: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateCrmDeal(id, data);
      return { success: true };
    }),

  deleteDeal: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteCrmDeal(input.id);
      return { success: true };
    }),

  // ─── Tasks ────────────────────────────────────────────────────────────────

  listTasks: adminProcedure.query(async () => getAllCrmTasks()),

  createTask: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      assignedTo: z.string().optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      dueDate: z.string().optional(),
      dealerId: z.number().optional(),
      vendorId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await createCrmTask(input);
      return { id };
    }),

  updateTask: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      status: z.enum(["open", "in_progress", "completed", "cancelled"]).optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      assignedTo: z.string().optional(),
      dueDate: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateCrmTask(id, data);
      return { success: true };
    }),

  deleteTask: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteCrmTask(input.id);
      return { success: true };
    }),

  // ─── Incidents ────────────────────────────────────────────────────────────

  listIncidents: adminProcedure.query(async () => getAllCrmIncidents()),

  createIncident: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      severity: z.enum(["low", "medium", "high", "critical"]).optional(),
      reportedBy: z.string().optional(),
      dealerId: z.number().optional(),
      vendorId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await createCrmIncident(input);
      return { id };
    }),

  updateIncident: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["open", "investigating", "resolved", "closed"]).optional(),
      severity: z.enum(["low", "medium", "high", "critical"]).optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const resolvedAt = (data.status === "resolved" || data.status === "closed") ? new Date() : undefined;
      await updateCrmIncident(id, { ...data, ...(resolvedAt ? { resolvedAt } : {}) });
      return { success: true };
    }),

  // ─── Contracts ────────────────────────────────────────────────────────────

  listContracts: adminProcedure.query(async () => getAllContracts()),

  createContract: adminProcedure
    .input(z.object({
      contractType: z.enum(["contractor", "client"]),
      clientName: z.string().optional(),
      clientEmail: z.string().optional(),
      contractorRole: z.string().optional(),
      eventDate: z.string().optional(),
      eventCity: z.string().optional(),
      equipmentDetails: z.string().optional(),
      amount: z.number().optional(),
      vendorId: z.number().optional(),
      dealerId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const signingToken = nanoid(32);
      const isRevenue = input.contractType === "client" ? 1 : 0;
      const id = await createContract({ ...input, signingToken, isRevenue });
      return { id, signingToken };
    }),

  updateContractStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["draft", "sent", "signed", "completed", "cancelled", "expired"]),
    }))
    .mutation(async ({ input }) => {
      await updateContractStatus(input.id, input.status);
      return { success: true };
    }),

  // ─── Stats ────────────────────────────────────────────────────────────────

  getStats: adminProcedure.query(async () => getCrmStats()),
});
