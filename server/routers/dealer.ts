import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ownerProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getAllDealers, getDealerById, getDealerByToken, createDealer, updateDealer, updateDealerByToken,
  getDealerContacts, replaceDealerContacts,
  getDealerMonthlyInputs, replaceDealerMonthlyInputs,
  getDealerPlatformAccess, replaceDealerPlatformAccess,
  getDealerCompliance, upsertDealerCompliance,
  getDealerFiles, addDealerFile,
  getDealerComments, addDealerComment,
} from "../db";
import { storagePut } from "../storage";
import { nanoid } from "nanoid";

// ─── Admin-only guard (owner-only) ───────────────────────────────────────────────
const adminProcedure = ownerProcedure;

export const dealerRouter = router({

  // ─── Admin: Dealer Management ──────────────────────────────────────────────

  listDealers: adminProcedure.query(async () => {
    return getAllDealers();
  }),

  getDealer: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const dealer = await getDealerById(input.id);
      if (!dealer) throw new TRPCError({ code: "NOT_FOUND", message: "Dealer not found" });
      const [contacts, monthlyInputs, platformAccess, compliance, files, comments] = await Promise.all([
        getDealerContacts(input.id),
        getDealerMonthlyInputs(input.id),
        getDealerPlatformAccess(input.id),
        getDealerCompliance(input.id),
        getDealerFiles(input.id),
        getDealerComments(input.id),
      ]);
      return { dealer, contacts, monthlyInputs, platformAccess, compliance, files, comments };
    }),

  createDealer: adminProcedure
    .input(z.object({
      storeName: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const token = nanoid(32);
      const id = await createDealer({ token, storeName: input.storeName });
      return { id, token };
    }),

  updateDealerStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["invited", "in_progress", "submitted", "under_review", "approved", "active", "paused", "rejected", "archived", "cancelled"]),
    }))
    .mutation(async ({ input }) => {
      await updateDealer(input.id, { status: input.status });
      return { success: true };
    }),

  addComment: adminProcedure
    .input(z.object({
      dealerId: z.number(),
      content: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      await addDealerComment({
        dealerId: input.dealerId,
        authorName: ctx.user.name ?? "Admin",
        authorRole: "admin",
        content: input.content,
        isAdminComment: 1,
      });
      return { success: true };
    }),

  // ─── Dealer Portal: Token-based access ────────────────────────────────────

  getDealerByToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const dealer = await getDealerByToken(input.token);
      if (!dealer) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid or expired invite link" });
      const [contacts, monthlyInputs, platformAccess, compliance, files, comments] = await Promise.all([
        getDealerContacts(dealer.id),
        getDealerMonthlyInputs(dealer.id),
        getDealerPlatformAccess(dealer.id),
        getDealerCompliance(dealer.id),
        getDealerFiles(dealer.id),
        getDealerComments(dealer.id),
      ]);
      return { dealer, contacts, monthlyInputs, platformAccess, compliance, files, comments };
    }),

  saveStep1: publicProcedure
    .input(z.object({
      token: z.string(),
      legalName: z.string().optional(),
      storeName: z.string().optional(),
      slogan: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
      phone: z.string().optional(),
      timezone: z.string().optional(),
      businessHours: z.string().optional(),
      dealershipStructure: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { token, ...data } = input;
      const dealer = await getDealerByToken(token);
      if (!dealer) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid token" });
      await updateDealerByToken(token, { ...data, status: "in_progress" });
      return { success: true };
    }),

  saveStep2: publicProcedure
    .input(z.object({
      token: z.string(),
      contacts: z.array(z.object({
        contactType: z.string().optional(),
        name: z.string().optional(),
        title: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        preferredMethod: z.string().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const dealer = await getDealerByToken(input.token);
      if (!dealer) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid token" });
      await replaceDealerContacts(dealer.id, input.contacts);
      return { success: true };
    }),

  saveStep3: publicProcedure
    .input(z.object({
      token: z.string(),
      inputs: z.array(z.object({
        inputType: z.enum(["special", "campaign", "promotion", "event"]),
        title: z.string().optional(),
        description: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const dealer = await getDealerByToken(input.token);
      if (!dealer) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid token" });
      await replaceDealerMonthlyInputs(dealer.id, input.inputs);
      return { success: true };
    }),

  saveStep4: publicProcedure
    .input(z.object({
      token: z.string(),
      platforms: z.array(z.object({
        platform: z.string().optional(),
        username: z.string().optional(),
        notes: z.string().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const dealer = await getDealerByToken(input.token);
      if (!dealer) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid token" });
      await replaceDealerPlatformAccess(dealer.id, input.platforms);
      return { success: true };
    }),

  saveStep5: publicProcedure
    .input(z.object({
      token: z.string(),
      oemRestrictions: z.string().optional(),
      brandGuidelines: z.string().optional(),
      additionalRestrictions: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { token, ...data } = input;
      const dealer = await getDealerByToken(token);
      if (!dealer) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid token" });
      await upsertDealerCompliance(dealer.id, data);
      return { success: true };
    }),

  saveStep6: publicProcedure
    .input(z.object({
      token: z.string(),
      acknowledgedDeliverables: z.number(),
      acknowledgedPolicies: z.number(),
    }))
    .mutation(async ({ input }) => {
      const dealer = await getDealerByToken(input.token);
      if (!dealer) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid token" });
      await upsertDealerCompliance(dealer.id, {
        acknowledgedDeliverables: input.acknowledgedDeliverables,
        acknowledgedPolicies: input.acknowledgedPolicies,
      });
      return { success: true };
    }),

  uploadFile: publicProcedure
    .input(z.object({
      token: z.string(),
      filename: z.string(),
      mimeType: z.string(),
      base64: z.string(),
      sizeBytes: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const dealer = await getDealerByToken(input.token);
      if (!dealer) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid token" });
      const ext = input.filename.split(".").pop() ?? "bin";
      const key = `loomelic/dealer-files/${dealer.id}-${nanoid(10)}.${ext}`;
      const buffer = Buffer.from(input.base64, "base64");
      const { url } = await storagePut(key, buffer, input.mimeType);
      await addDealerFile({
        dealerId: dealer.id,
        filename: input.filename,
        fileKey: key,
        url,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes ?? buffer.length,
      });
      return { url, key };
    }),

  submitOnboarding: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const dealer = await getDealerByToken(input.token);
      if (!dealer) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid token" });
      await updateDealerByToken(input.token, {
        status: "submitted",
        submittedAt: new Date(),
        completionScore: 100,
      });
      return { success: true };
    }),

  addDealerComment: publicProcedure
    .input(z.object({
      token: z.string(),
      content: z.string().min(1),
      authorName: z.string(),
    }))
    .mutation(async ({ input }) => {
      const dealer = await getDealerByToken(input.token);
      if (!dealer) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid token" });
      await addDealerComment({
        dealerId: dealer.id,
        authorName: input.authorName,
        authorRole: "dealer",
        content: input.content,
        isAdminComment: 0,
      });
      return { success: true };
    }),
});
