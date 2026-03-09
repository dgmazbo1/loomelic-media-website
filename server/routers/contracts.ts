import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { contracts, w9Forms, contractTemplates, clientContracts } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";

// ─── Helpers ───────────────────────────────────────────────────────────────

async function generateToken(): Promise<string> {
  return crypto.randomUUID();
}

// ─── W-9 helpers ───────────────────────────────────────────────────────────

async function getW9ByEmailAndYear(email: string, year: number) {
  const db = await getDb();
  const results = await db
    .select()
    .from(w9Forms)
    .where(and(eq(w9Forms.contractorEmail, email), eq(w9Forms.taxYear, year)))
    .limit(1);
  return results[0] ?? null;
}

async function upsertW9Form(data: typeof w9Forms.$inferInsert) {
  const db = await getDb();
  const existing = await getW9ByEmailAndYear(data.contractorEmail, data.taxYear);
  if (existing) {
    await db.update(w9Forms).set({ ...data, updatedAt: new Date() }).where(eq(w9Forms.id, existing.id));
    return existing.id;
  }
  await db.insert(w9Forms).values(data);
  const inserted = await db
    .select()
    .from(w9Forms)
    .where(and(eq(w9Forms.contractorEmail, data.contractorEmail), eq(w9Forms.taxYear, data.taxYear)))
    .limit(1);
  return inserted[0]?.id ?? 0;
}

// ─── Contract helpers ───────────────────────────────────────────────────────

async function getContractByToken(token: string) {
  const db = await getDb();
  const results = await db.select().from(contracts).where(eq(contracts.token, token)).limit(1);
  return results[0] ?? null;
}

// ─── Router ────────────────────────────────────────────────────────────────

export const contractsRouter = router({

  // ── W-9 ──────────────────────────────────────────────────────────────────

  getW9: publicProcedure
    .input(z.object({ email: z.string().email(), year: z.number() }))
    .query(async ({ input }) => {
      return await getW9ByEmailAndYear(input.email, input.year);
    }),

  saveW9: publicProcedure
    .input(z.object({
      contractorEmail: z.string().email(),
      taxYear: z.number(),
      name: z.string(),
      businessName: z.string().optional(),
      taxClassification: z.enum(["individual", "c_corp", "s_corp", "partnership", "trust_estate", "llc", "other"]),
      llcTaxClassification: z.string().optional(),
      otherTaxClassification: z.string().optional(),
      exemptPayeeCode: z.string().optional(),
      exemptFATCACode: z.string().optional(),
      address: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      accountNumbers: z.string().optional(),
      ssn: z.string().optional(),
      ein: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const w9Id = await upsertW9Form(input as any);
      return { success: true, w9Id };
    }),

  getAllW9s: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const db = await getDb();
    return await db.select().from(w9Forms).orderBy(desc(w9Forms.createdAt));
  }),

  // ── Contractor Contracts ─────────────────────────────────────────────────

  /** Admin creates a contract and gets back a signing token */
  createContract: protectedProcedure
    .input(z.object({
      contractorName: z.string(),
      contractorEmail: z.string().email(),
      contractorRole: z.string().optional(),
      projectName: z.string().optional(),
      projectLocation: z.string().optional(),
      totalFee: z.string().optional(),
      deposit: z.string().optional(),
      finalPayment: z.string().optional(),
      paymentMethod: z.string().optional(),
      checkinDate: z.string().optional(),
      checkoutDate: z.string().optional(),
      airbnbAddress: z.string().optional(),
      eventCity: z.string().optional(),
      equipment: z.string().optional(),
      pdfData: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      const token = await generateToken();
      await db.insert(contracts).values({
        ...input,
        token,
        status: "draft",
      } as any);
      const inserted = await db
        .select()
        .from(contracts)
        .where(eq(contracts.token, token))
        .limit(1);
      const contractId = inserted[0]?.id ?? 0;
      const signingLink = `/vendor/sign/${token}`;
      return { success: true, contractId, token, signingLink };
    }),

  /** Public: get contract by token (for contractor signing page) */
  getByToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const contract = await getContractByToken(input.token);
      if (!contract) throw new TRPCError({ code: "NOT_FOUND", message: "Contract not found" });
      return contract;
    }),

  /** Public: contractor signs the contract */
  signContract: publicProcedure
    .input(z.object({
      token: z.string(),
      contractorSignature: z.string(),
      ndaSignature: z.string(),
      w9Data: z.any().optional(),
      pdfData: z.string(),
      insuranceCertificateUrl: z.string().optional(),
      insuranceCertificateFileName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      let w9FormId: number | undefined;
      if (input.w9Data) {
        w9FormId = await upsertW9Form(input.w9Data);
      }
      await db.update(contracts).set({
        contractorSignature: input.contractorSignature,
        ndaSignature: input.ndaSignature,
        pdfData: input.pdfData,
        w9FormId,
        insuranceCertificateUrl: input.insuranceCertificateUrl,
        insuranceCertificateFileName: input.insuranceCertificateFileName,
        insuranceUploadedAt: input.insuranceCertificateUrl ? new Date() : undefined,
        status: "signed",
        signedAt: new Date(),
        updatedAt: new Date(),
      } as any).where(eq(contracts.token, input.token));
      return { success: true };
    }),

  /** Admin: list all contractor contracts */
  getAllContracts: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const db = await getDb();
    return await db.select().from(contracts).orderBy(desc(contracts.createdAt));
  }),

  /** Public: get contract by ID */
  getContractById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const results = await db.select().from(contracts).where(eq(contracts.id, input.id)).limit(1);
      return results[0] ?? null;
    }),

  // ── Contract Templates ───────────────────────────────────────────────────

  getAllTemplates: publicProcedure.query(async () => {
    const db = await getDb();
    return await db.select().from(contractTemplates).orderBy(desc(contractTemplates.createdAt));
  }),

  getTemplate: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const results = await db.select().from(contractTemplates).where(eq(contractTemplates.id, input.id)).limit(1);
      return results[0] ?? null;
    }),

  createTemplate: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      contractorRole: z.string().optional(),
      projectName: z.string().optional(),
      projectLocation: z.string().optional(),
      totalFee: z.string().optional(),
      deposit: z.string().optional(),
      finalPayment: z.string().optional(),
      paymentMethod: z.string().optional(),
      equipment: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      await db.insert(contractTemplates).values({ ...input, createdBy: ctx.user.id });
      return { success: true };
    }),

  updateTemplate: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().optional(),
      contractorRole: z.string().optional(),
      projectName: z.string().optional(),
      projectLocation: z.string().optional(),
      totalFee: z.string().optional(),
      deposit: z.string().optional(),
      finalPayment: z.string().optional(),
      paymentMethod: z.string().optional(),
      equipment: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      const { id, ...data } = input;
      await db.update(contractTemplates).set({ ...data, updatedAt: new Date() }).where(eq(contractTemplates.id, id));
      return { success: true };
    }),

  deleteTemplate: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      await db.delete(contractTemplates).where(eq(contractTemplates.id, input.id));
      return { success: true };
    }),

  // ── Client Contracts (Revenue) ───────────────────────────────────────────

  createClientContract: protectedProcedure
    .input(z.object({
      clientName: z.string(),
      clientCompany: z.string().optional(),
      clientEmail: z.string().email(),
      clientPhone: z.string().optional(),
      projectName: z.string(),
      projectType: z.string().optional(),
      projectLocation: z.string().optional(),
      projectStartDate: z.string().optional(),
      projectEndDate: z.string().optional(),
      projectDescription: z.string().optional(),
      deliverables: z.string().optional(),
      totalValue: z.string().optional(),
      depositAmount: z.string().optional(),
      depositDueDate: z.string().optional(),
      finalPaymentAmount: z.string().optional(),
      finalPaymentDueDate: z.string().optional(),
      paymentTerms: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      const token = await generateToken();
      await db.insert(clientContracts).values({ ...input, token, status: "draft" } as any);
      const inserted = await db
        .select()
        .from(clientContracts)
        .where(eq(clientContracts.token, token))
        .limit(1);
      const contractId = inserted[0]?.id ?? 0;
      return { success: true, contractId, token, signingLink: `/client/sign/${token}` };
    }),

  getAllClientContracts: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const db = await getDb();
    return await db.select().from(clientContracts).orderBy(desc(clientContracts.createdAt));
  }),

  getClientContractByToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const results = await db.select().from(clientContracts).where(eq(clientContracts.token, input.token)).limit(1);
      if (!results[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Contract not found" });
      return results[0];
    }),

  signClientContract: publicProcedure
    .input(z.object({
      token: z.string(),
      clientSignature: z.string(),
      pdfData: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db.update(clientContracts).set({
        clientSignature: input.clientSignature,
        pdfData: input.pdfData,
        status: "signed",
        signedAt: new Date(),
        updatedAt: new Date(),
      } as any).where(eq(clientContracts.token, input.token));
      return { success: true };
    }),

  // ── AI Equipment Description ─────────────────────────────────────────────

  generateEquipmentDescription: protectedProcedure
    .input(z.object({ equipmentNotes: z.string() }))
    .mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are a professional contract writer. Convert equipment notes into a clear, professional paragraph suitable for a contractor agreement. Be concise but comprehensive.",
          },
          {
            role: "user",
            content: `Convert this equipment list into a professional paragraph for a contract:\n\n${input.equipmentNotes}`,
          },
        ],
      });
      const description =
        typeof response.choices[0].message.content === "string"
          ? response.choices[0].message.content
          : JSON.stringify(response.choices[0].message.content);
      return { description };
    }),
});
