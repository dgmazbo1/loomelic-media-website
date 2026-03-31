import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ownerProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getAllVendors, getVendorById, getVendorByToken, createVendor, updateVendor, updateVendorByToken,
  getVendorJobs, createVendorJob, updateVendorJobStatus,
} from "../db";
import { nanoid } from "nanoid";

// ─── Admin-only guard (owner-only) ───────────────────────────────────────────────
const adminProcedure = ownerProcedure;

export const vendorRouter = router({

  // ─── Admin: Vendor Management ──────────────────────────────────────────────

  listVendors: adminProcedure.query(async () => {
    return getAllVendors();
  }),

  getVendor: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const vendor = await getVendorById(input.id);
      if (!vendor) throw new TRPCError({ code: "NOT_FOUND", message: "Vendor not found" });
      const jobs = await getVendorJobs(input.id);
      return { vendor, jobs };
    }),

  createVendor: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email().optional(),
      role: z.enum(["photographer", "videographer", "editor", "drone_operator", "social_media", "graphic_designer", "other"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const token = nanoid(32);
      const id = await createVendor({ token, name: input.name, email: input.email, role: input.role });
      return { id, token };
    }),

  updateVendorStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["invited", "active", "inactive", "suspended"]),
    }))
    .mutation(async ({ input }) => {
      await updateVendor(input.id, { status: input.status });
      return { success: true };
    }),

  createJob: adminProcedure
    .input(z.object({
      vendorId: z.number(),
      title: z.string().min(1),
      description: z.string().optional(),
      eventDate: z.string().optional(),
      eventCity: z.string().optional(),
      deliverablesDue: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await createVendorJob(input);
      return { id };
    }),

  updateJobStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "confirmed", "in_progress", "completed", "cancelled"]),
    }))
    .mutation(async ({ input }) => {
      await updateVendorJobStatus(input.id, input.status);
      return { success: true };
    }),

  // ─── Vendor Portal: Token-based access ────────────────────────────────────

  getVendorByToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const vendor = await getVendorByToken(input.token);
      if (!vendor) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid or expired invite link" });
      const jobs = await getVendorJobs(vendor.id);
      return { vendor, jobs };
    }),

  updateVendorProfile: publicProcedure
    .input(z.object({
      token: z.string(),
      name: z.string().optional(),
      phone: z.string().optional(),
      bio: z.string().optional(),
      location: z.string().optional(),
      portfolioUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { token, ...data } = input;
      const vendor = await getVendorByToken(token);
      if (!vendor) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid token" });
      await updateVendorByToken(token, { ...data, status: "active" });
      return { success: true };
    }),

  respondToJob: publicProcedure
    .input(z.object({
      token: z.string(),
      jobId: z.number(),
      accept: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      const vendor = await getVendorByToken(input.token);
      if (!vendor) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid token" });
      const jobs = await getVendorJobs(vendor.id);
      const job = jobs.find(j => j.id === input.jobId);
      if (!job) throw new TRPCError({ code: "FORBIDDEN", message: "Job not found" });
      await updateVendorJobStatus(input.jobId, input.accept ? "confirmed" : "cancelled");
      return { success: true };
    }),
});
