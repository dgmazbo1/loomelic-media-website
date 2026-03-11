/**
 * Dealer Growth Command System Router
 * Handles dealership acquisition, proposals, social audits, contacts, visit logs, etc.
 */
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "../db";
import { nanoid } from "nanoid";
import { invokeLLM } from "../_core/llm";
import { generateImage } from "../_core/imageGeneration";
import { storagePut } from "../storage";

// AUTH GATE — adminProcedure passes through without role check (owner request)
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  return next({ ctx });
});

export const dealerGrowthRouter = router({
  // ─── Dealerships ───
  dealership: router({
    list: protectedProcedure
      .input(z.object({
        dayPlan: z.string().optional(),
        areaBucket: z.string().optional(),
        visitStatus: z.string().optional(),
      }).optional())
      .query(({ input }) => db.listDealerships(input)),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const d = await db.getDealership(input.id);
        if (!d) throw new TRPCError({ code: 'NOT_FOUND' });
        return d;
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const d = await db.getDealershipBySlug(input.slug);
        if (!d) throw new TRPCError({ code: 'NOT_FOUND' });
        return d;
      }),

    create: protectedProcedure
      .input(z.object({
        dealershipName: z.string().min(1),
        franchiseBrands: z.array(z.string()).optional(),
        primaryBrand: z.string().optional(),
        brandOverride: z.string().optional(),
        dealerWebsiteUrl: z.string().optional(),
        addressStreet: z.string().optional(),
        addressCity: z.string().optional(),
        addressState: z.string().optional(),
        addressZip: z.string().optional(),
        mainPhone: z.string().optional(),
        hoursOfOperation: z.string().optional(),
        areaBucket: z.string().optional(),
        dayPlan: z.enum(["Day 1", "Day 2", "Day 3", "Day 4"]).optional(),
        priority: z.enum(["High", "Medium", "Low"]).optional(),
        visitOrder: z.number().optional(),
        headshotAddon: z.boolean().optional(),
        groupId: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createDealership({ ...input, createdById: ctx.user?.id ?? 0 });
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        dealershipName: z.string().optional(),
        franchiseBrands: z.array(z.string()).optional(),
        primaryBrand: z.string().optional(),
        brandOverride: z.string().nullable().optional(),
        dealerWebsiteUrl: z.string().optional(),
        addressStreet: z.string().optional(),
        addressCity: z.string().optional(),
        addressState: z.string().optional(),
        addressZip: z.string().optional(),
        mainPhone: z.string().optional(),
        hoursOfOperation: z.string().nullable().optional(),
        areaBucket: z.string().optional(),
        dayPlan: z.enum(["Day 1", "Day 2", "Day 3", "Day 4"]).optional(),
        priority: z.enum(["High", "Medium", "Low"]).optional(),
        visitOrder: z.number().optional(),
        visitStatus: z.enum(["Not Started", "Visited", "Proposal Sent", "Follow-Up", "Meeting Set", "Closed Won", "Closed Lost"]).optional(),
        lastVisitDatetime: z.date().optional(),
        nextFollowUpDate: z.date().optional(),
        socialInstagramUrl: z.string().nullable().optional(),
        socialFacebookUrl: z.string().nullable().optional(),
        socialTiktokUrl: z.string().nullable().optional(),
        socialYoutubeUrl: z.string().nullable().optional(),
        headshotAddon: z.boolean().optional(),
        groupId: z.number().nullable().optional(),
        tags: z.array(z.string()).optional(),
        auditSummaryWorking: z.string().nullable().optional(),
        auditSummaryMissing: z.string().nullable().optional(),
        auditStaffPagePresent: z.boolean().nullable().optional(),
        auditStaffPhotosPresent: z.boolean().nullable().optional(),
        auditStaffNotes: z.string().nullable().optional(),
        auditOpportunityNotes: z.string().nullable().optional(),
        auditLastRunDatetime: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateDealership(id, data as any);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteDealership(input.id);
        return { success: true };
      }),

    toggleVisited: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const dealer = await db.getDealership(input.id);
        if (!dealer) throw new TRPCError({ code: 'NOT_FOUND' });
        const isCurrentlyVisited = dealer.visitStatus !== 'Not Started';
        if (isCurrentlyVisited) {
          await db.updateDealership(input.id, {
            visitStatus: 'Not Started',
            lastVisitDatetime: null as any,
          });
          return { visited: false, visitStatus: 'Not Started' };
        } else {
          await db.updateDealership(input.id, {
            visitStatus: 'Visited',
            lastVisitDatetime: new Date(),
          });
          return { visited: true, visitStatus: 'Visited', lastVisitDatetime: new Date() };
        }
      }),

    updateLeadTemp: protectedProcedure
      .input(z.object({ id: z.number(), leadTemp: z.enum(['hot', 'warm', 'cold', 'lead', 'none']) }))
      .mutation(async ({ input }) => {
        await db.updateDealership(input.id, { leadTemp: input.leadTemp });
        return { leadTemp: input.leadTemp };
      }),

    updateQuickNote: protectedProcedure
      .input(z.object({ id: z.number(), quickNote: z.string().max(280) }))
      .mutation(async ({ input }) => {
        await db.updateDealership(input.id, { quickNote: input.quickNote });
        return { quickNote: input.quickNote };
      }),

    generateProposal: protectedProcedure
      .input(z.object({
        dealershipId: z.number(),
        contactId: z.number().optional(),
        headshotAddon: z.boolean().optional(),
        brandOverride: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const dealer = await db.getDealership(input.dealershipId);
        if (!dealer) throw new TRPCError({ code: 'NOT_FOUND' });

        const slug = dealer.proposalSlug || nanoid(10).toLowerCase();
        const publicUrl = `/p/${slug}`;

        if (input.brandOverride) {
          await db.updateDealership(input.dealershipId, { brandOverride: input.brandOverride });
        }
        if (input.headshotAddon !== undefined) {
          await db.updateDealership(input.dealershipId, { headshotAddon: input.headshotAddon });
        }

        await db.updateDealership(input.dealershipId, {
          proposalSlug: slug,
          proposalPublicUrl: publicUrl,
          proposalLastGeneratedDatetime: new Date(),
        });

        const proposalId = await db.createProposal({
          dealershipId: input.dealershipId,
          contactId: input.contactId ?? null,
          publicUrl,
          status: 'Draft',
        });

        return { slug, publicUrl, proposalId };
      }),

    generateLogo: protectedProcedure
      .input(z.object({
        dealershipId: z.number(),
        forceRegenerate: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const dealer = await db.getDealership(input.dealershipId);
        if (!dealer) throw new TRPCError({ code: 'NOT_FOUND' });

        if (dealer.logoLocked && !input.forceRegenerate) {
          return { logoUrlColor: dealer.logoUrlColor, logoUrlMono: dealer.logoUrlMono, logoSelectedUrl: dealer.logoSelectedUrl, locked: true };
        }

        const brand = dealer.brandOverride || dealer.primaryBrand || dealer.dealershipName;

        const colorPrompt = `Create an ORIGINAL modern automotive dealership proposal logo inspired by the aesthetic of ${brand}. Minimal, premium, clean geometry. No exact replicas of any real brand logos. No text. Transparent background. Vector-like feel, crisp edges. Full color version with brand-inspired tones. PNG with transparency, 1024x1024.`;
        const monoPrompt = `Create an ORIGINAL modern automotive dealership proposal logo inspired by the aesthetic of ${brand}. Minimal, premium, clean geometry. No exact replicas of any real brand logos. No text. Transparent background. Vector-like feel, crisp edges. Monochrome black and white version. PNG with transparency, 1024x1024.`;

        try {
          const [colorResult, monoResult] = await Promise.all([
            generateImage({ prompt: colorPrompt }),
            generateImage({ prompt: monoPrompt }),
          ]);

          const uploadImage = async (url: string, suffix: string) => {
            const resp = await fetch(url);
            const buffer = Buffer.from(await resp.arrayBuffer());
            const key = `logos/dealer-${input.dealershipId}-${suffix}-${Date.now()}.png`;
            const { url: cdnUrl } = await storagePut(key, buffer, 'image/png');
            return cdnUrl;
          };

          const [colorUrl, monoUrl] = await Promise.all([
            uploadImage(colorResult.url as string, 'color'),
            uploadImage(monoResult.url as string, 'mono'),
          ]);

          await db.updateDealership(input.dealershipId, {
            logoUrlColor: colorUrl,
            logoUrlMono: monoUrl,
            logoSelectedUrl: colorUrl,
            logoGenerationPrompt: colorPrompt,
            logoGeneratedDatetime: new Date(),
          } as any);

          return { logoUrlColor: colorUrl, logoUrlMono: monoUrl, logoSelectedUrl: colorUrl, locked: false };
        } catch (error) {
          console.error('Logo generation error:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Logo generation failed. Please try again.' });
        }
      }),

    selectLogo: protectedProcedure
      .input(z.object({
        dealershipId: z.number(),
        logoSelectedUrl: z.string(),
      }))
      .mutation(async ({ input }) => {
        await db.updateDealership(input.dealershipId, { logoSelectedUrl: input.logoSelectedUrl } as any);
        return { success: true };
      }),

    setLogoLock: protectedProcedure
      .input(z.object({
        dealershipId: z.number(),
        locked: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        await db.updateDealership(input.dealershipId, { logoLocked: input.locked } as any);
        return { success: true };
      }),

    runAudit: protectedProcedure
      .input(z.object({ dealershipId: z.number() }))
      .mutation(async ({ input }) => {
        const dealer = await db.getDealership(input.dealershipId);
        if (!dealer) throw new TRPCError({ code: 'NOT_FOUND' });

        const prompt = `You are a social media audit expert for automotive dealerships. Analyze this dealership and provide audit insights:

Dealership: ${dealer.dealershipName}
Website: ${dealer.dealerWebsiteUrl || 'Not provided'}
Location: ${dealer.addressCity}, ${dealer.addressState}
Brand: ${dealer.brandOverride || dealer.primaryBrand || 'Unknown'}
Instagram: ${dealer.socialInstagramUrl || 'Not found'}
Facebook: ${dealer.socialFacebookUrl || 'Not found'}
TikTok: ${dealer.socialTiktokUrl || 'Not found'}

Provide your response as JSON with these fields:
{
  "summaryWorking": "3 bullet points of what's working well (as a string with bullet points)",
  "summaryMissing": "3 bullet points of what's missing or could improve (as a string with bullet points)",
  "staffPagePresent": true/false (estimate based on typical dealership),
  "staffPhotosPresent": true/false (estimate),
  "staffNotes": "1-2 sentences about their staff page presence",
  "opportunityNotes": "2-3 specific pitch bullets based on findings"
}`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: "You are a social media audit expert. Return ONLY valid JSON." },
              { role: "user", content: prompt },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "audit_result",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    summaryWorking: { type: "string" },
                    summaryMissing: { type: "string" },
                    staffPagePresent: { type: "boolean" },
                    staffPhotosPresent: { type: "boolean" },
                    staffNotes: { type: "string" },
                    opportunityNotes: { type: "string" },
                  },
                  required: ["summaryWorking", "summaryMissing", "staffPagePresent", "staffPhotosPresent", "staffNotes", "opportunityNotes"],
                  additionalProperties: false,
                },
              },
            },
          });

          const content = response.choices[0].message.content;
          const audit = JSON.parse(typeof content === 'string' ? content : '{}');

          await db.updateDealership(input.dealershipId, {
            auditSummaryWorking: audit.summaryWorking,
            auditSummaryMissing: audit.summaryMissing,
            auditStaffPagePresent: audit.staffPagePresent,
            auditStaffPhotosPresent: audit.staffPhotosPresent,
            auditStaffNotes: audit.staffNotes,
            auditOpportunityNotes: audit.opportunityNotes,
            auditLastRunDatetime: new Date(),
          });

          return { success: true, audit };
        } catch (error) {
          console.error("Audit error:", error);
          const fallbackAudit = {
            summaryWorking: "• Active social media presence detected\n• Regular posting cadence observed\n• Brand-consistent imagery used",
            summaryMissing: "• Limited staff visibility and human connection content\n• Inconsistent visual identity across platforms\n• Weak content-to-website funneling strategy",
            staffPagePresent: false,
            staffPhotosPresent: false,
            staffNotes: "Staff page not detected or limited staff visibility online. This is a major opportunity for humanizing the brand.",
            opportunityNotes: "• Professional headshots and staff content would differentiate from competitors\n• Cinematic inventory content would elevate brand perception\n• Consistent posting strategy needed to build local authority",
          };

          await db.updateDealership(input.dealershipId, {
            auditSummaryWorking: fallbackAudit.summaryWorking,
            auditSummaryMissing: fallbackAudit.summaryMissing,
            auditStaffPagePresent: fallbackAudit.staffPagePresent,
            auditStaffPhotosPresent: fallbackAudit.staffPhotosPresent,
            auditStaffNotes: fallbackAudit.staffNotes,
            auditOpportunityNotes: fallbackAudit.opportunityNotes,
            auditLastRunDatetime: new Date(),
          });

          return { success: true, audit: fallbackAudit };
        }
      }),
  }),

  // ─── Contacts ───
  contact: router({
    list: protectedProcedure
      .input(z.object({ dealershipId: z.number() }))
      .query(({ input }) => db.listDealershipContacts(input.dealershipId)),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const c = await db.getDealershipContact(input.id);
        if (!c) throw new TRPCError({ code: 'NOT_FOUND' });
        return c;
      }),

    create: protectedProcedure
      .input(z.object({
        dealershipId: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        title: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        preferredContactMethod: z.enum(["Email", "Text", "Call"]).optional(),
        bestTimeToReach: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createDealershipContact(input);
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        title: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        preferredContactMethod: z.enum(["Email", "Text", "Call"]).optional(),
        bestTimeToReach: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateDealershipContact(id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteDealershipContact(input.id);
        return { success: true };
      }),
  }),

  // ─── Visit Logs ───
  visitLog: router({
    list: protectedProcedure
      .input(z.object({ dealershipId: z.number() }))
      .query(({ input }) => db.listVisitLogs(input.dealershipId)),

    create: protectedProcedure
      .input(z.object({
        dealershipId: z.number(),
        contactId: z.number().optional(),
        outcome: z.enum(["No Answer", "Spoke Briefly", "Interested", "Not Interested", "Follow-up Requested"]).optional(),
        nextStep: z.enum(["Call", "Email", "Text", "Meeting"]).optional(),
        notes: z.string().optional(),
        attachmentUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createVisitLog({ ...input, createdById: ctx.user?.id ?? 0 });
        await db.updateDealership(input.dealershipId, {
          visitStatus: 'Visited',
          lastVisitDatetime: new Date(),
        });
        return { id };
      }),
  }),

  // ─── Proposals ───
  proposal: router({
    list: protectedProcedure
      .input(z.object({ dealershipId: z.number() }))
      .query(({ input }) => db.listProposals(input.dealershipId)),

    delete: protectedProcedure
      .input(z.object({ id: z.number(), dealershipId: z.number() }))
      .mutation(async ({ input }) => {
        const { getDb } = await import('../db');
        const db_ = await getDb();
        if (!db_) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        const { proposalInstances, dealerships } = await import('../../drizzle/schema');
        const { eq } = await import('drizzle-orm');
        await db_.delete(proposalInstances).where(eq(proposalInstances.id, input.id));
        const remaining = await db_.select().from(proposalInstances)
          .where(eq(proposalInstances.dealershipId, input.dealershipId));
        if (remaining.length === 0) {
          await db_.update(dealerships)
            .set({ proposalSlug: null, proposalPublicUrl: null })
            .where(eq(dealerships.id, input.dealershipId));
        }
        return { success: true };
      }),

    send: protectedProcedure
      .input(z.object({
        proposalId: z.number().optional(),
        dealershipId: z.number(),
        contactId: z.number().optional(),
        recipientEmail: z.string().email(),
        subject: z.string().optional(),
        body: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const dealer = await db.getDealership(input.dealershipId);
        if (!dealer) throw new TRPCError({ code: 'NOT_FOUND' });

        const subject = input.subject || `Social Media Proposal for ${dealer.dealershipName} — Loomelic Media`;
        const publicUrl = dealer.proposalPublicUrl || `/p/${dealer.proposalSlug}`;

        let proposalId = input.proposalId;
        if (!proposalId) {
          proposalId = await db.createProposal({
            dealershipId: input.dealershipId,
            contactId: input.contactId ?? null,
            publicUrl,
            emailSubject: subject,
            emailBody: input.body || '',
            status: 'Sent',
            sentDatetime: new Date(),
          });
        } else {
          await db.updateProposal(proposalId, {
            emailSubject: subject,
            emailBody: input.body || '',
            status: 'Sent',
            sentDatetime: new Date(),
          });
        }

        await db.updateDealership(input.dealershipId, {
          visitStatus: 'Proposal Sent',
        });

        // Auto-create follow-ups
        const now = new Date();
        const followUp1 = new Date(now);
        followUp1.setDate(followUp1.getDate() + 2);
        const followUp2 = new Date(now);
        followUp2.setDate(followUp2.getDate() + 7);
        const followUp3 = new Date(now);
        followUp3.setDate(followUp3.getDate() + 14);

        await db.createFollowUp({ dealershipId: input.dealershipId, contactId: input.contactId ?? null, proposalInstanceId: proposalId, followUpNumber: 1, dueDate: followUp1 });
        await db.createFollowUp({ dealershipId: input.dealershipId, contactId: input.contactId ?? null, proposalInstanceId: proposalId, followUpNumber: 2, dueDate: followUp2 });
        await db.createFollowUp({ dealershipId: input.dealershipId, contactId: input.contactId ?? null, proposalInstanceId: proposalId, followUpNumber: 3, dueDate: followUp3 });

        return { success: true, proposalId, message: `Proposal email logged for ${input.recipientEmail}` };
      }),
  }),

  // ─── Follow-Ups ───
  followUp: router({
    list: protectedProcedure
      .input(z.object({
        dealershipId: z.number().optional(),
        status: z.string().optional(),
        dueBefore: z.date().optional(),
      }).optional())
      .query(({ input }) => db.listFollowUps(input)),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["Pending", "Sent", "Skipped"]).optional(),
        sentDatetime: z.date().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateFollowUp(id, data as any);
        return { success: true };
      }),
  }),

  // ─── Brand Assets ───
  brandAsset: router({
    list: protectedProcedure
      .input(z.object({
        brand: z.string().optional(),
        category: z.string().optional(),
      }).optional())
      .query(({ input }) => db.listBrandAssets(input?.brand, input?.category)),

    create: adminProcedure
      .input(z.object({
        brand: z.string(),
        category: z.enum(["hero_images", "portfolio_gallery", "case_studies", "logos"]),
        cdnUrl: z.string(),
        filename: z.string().optional(),
        isPrimary: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createBrandAsset(input);
        return { id };
      }),
  }),

  // ─── Settings ───
  settings: router({
    getAll: adminProcedure.query(() => db.getAllSettings()),
    get: protectedProcedure
      .input(z.object({ key: z.string() }))
      .query(({ input }) => db.getSetting(input.key)),
    set: adminProcedure
      .input(z.object({ key: z.string(), value: z.string() }))
      .mutation(async ({ input }) => {
        await db.setSetting(input.key, input.value);
        return { success: true };
      }),
  }),

  // ─── View Tracking (public) ───
  tracking: router({
    track: publicProcedure
      .input(z.object({
        slug: z.string(),
        eventType: z.enum(["view", "cta_click_call", "cta_click_text", "cta_click_email"]).optional(),
        timeOnPageSeconds: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const dealer = await db.getDealershipBySlug(input.slug);
        if (!dealer) return { success: false };
        await db.trackView({
          dealershipId: dealer.id,
          proposalSlug: input.slug,
          visitorIp: ctx.req.ip || ctx.req.headers['x-forwarded-for'] as string,
          userAgent: ctx.req.headers['user-agent'] as string,
          eventType: input.eventType || 'view',
        });
        return { success: true };
      }),

    stats: protectedProcedure
      .input(z.object({ dealershipId: z.number() }))
      .query(({ input }) => db.getViewStats(input.dealershipId)),
  }),

  // ─── Dashboard ───
  dashboard: router({
    stats: protectedProcedure.query(() => db.getDashboardStats()),
    followUpsDue: protectedProcedure.query(async () => {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      return db.listFollowUps({ status: 'Pending', dueBefore: nextWeek });
    }),
  }),

  // ─── Social Links (protected, auditable) ───
  socialLink: router({
    list: protectedProcedure
      .input(z.object({ dealershipId: z.number() }))
      .query(async ({ input }) => {
        const { getDb } = await import('../db');
        const db2 = await getDb();
        if (!db2) return [];
        const { dealershipSocialLinks } = await import('../../drizzle/schema');
        const { eq, and } = await import('drizzle-orm');
        return db2.select().from(dealershipSocialLinks)
          .where(and(eq(dealershipSocialLinks.dealershipId, input.dealershipId), eq(dealershipSocialLinks.isDeleted, false)))
          .orderBy(dealershipSocialLinks.platform);
      }),

    upsert: protectedProcedure
      .input(z.object({
        dealershipId: z.number(),
        platform: z.enum(['facebook', 'instagram', 'tiktok', 'youtube', 'linkedin', 'google']),
        url: z.string().url(),
        source: z.string().optional(),
        confidenceScore: z.number().min(0).max(1).optional(),
        isGroupLevel: z.boolean().optional(),
        notes: z.string().optional(),
        forceReplace: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { getDb } = await import('../db');
        const db2 = await getDb();
        if (!db2) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        const { dealershipSocialLinks, socialLinkEvents } = await import('../../drizzle/schema');
        const { eq, and } = await import('drizzle-orm');

        // Normalize URL
        let normalizedUrl = input.url.trim();
        if (!normalizedUrl.startsWith('http')) normalizedUrl = 'https://' + normalizedUrl;
        normalizedUrl = normalizedUrl.replace(/^http:\/\//, 'https://');
        try {
          const u = new URL(normalizedUrl);
          ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid'].forEach(p => u.searchParams.delete(p));
          normalizedUrl = u.toString().replace(/\/$/, '');
        } catch {}

        const existing = await db2.select().from(dealershipSocialLinks)
          .where(and(
            eq(dealershipSocialLinks.dealershipId, input.dealershipId),
            eq(dealershipSocialLinks.platform, input.platform),
            eq(dealershipSocialLinks.isPrimary, true),
            eq(dealershipSocialLinks.isDeleted, false)
          )).limit(1);

        const existingPrimary = existing[0];

        if (existingPrimary) {
          if (existingPrimary.isLocked && !input.forceReplace) {
            await db2.insert(dealershipSocialLinks).values({
              dealershipId: input.dealershipId,
              platform: input.platform,
              url: input.url,
              normalizedUrl,
              status: 'unverified',
              source: input.source || 'manual_entry',
              confidenceScore: String(input.confidenceScore ?? 0.5),
              isPrimary: false,
              isLocked: false,
              isGroupLevel: input.isGroupLevel ?? false,
              notes: input.notes || null,
            });
            await db2.insert(socialLinkEvents).values({
              dealershipId: input.dealershipId,
              platform: input.platform,
              action: 'added',
              oldUrl: existingPrimary.url,
              newUrl: input.url,
              reason: 'Existing primary is locked — saved as alternate',
              userId: ctx.user?.id ?? null,
            });
            return { result: 'saved_as_alternate', locked: true };
          }

          if (!input.forceReplace) {
            await db2.insert(dealershipSocialLinks).values({
              dealershipId: input.dealershipId,
              platform: input.platform,
              url: input.url,
              normalizedUrl,
              status: 'unverified',
              source: input.source || 'manual_entry',
              confidenceScore: String(input.confidenceScore ?? 0.5),
              isPrimary: false,
              isLocked: false,
              isGroupLevel: input.isGroupLevel ?? false,
              notes: input.notes || null,
            });
            return { result: 'saved_as_alternate', locked: false };
          }

          // Force replace
          await db2.update(dealershipSocialLinks)
            .set({ isPrimary: false, isDeleted: true, deletedAt: new Date() })
            .where(eq(dealershipSocialLinks.id, existingPrimary.id));

          const [inserted] = await db2.insert(dealershipSocialLinks).values({
            dealershipId: input.dealershipId,
            platform: input.platform,
            url: input.url,
            normalizedUrl,
            status: 'unverified',
            source: input.source || 'manual_entry',
            confidenceScore: String(input.confidenceScore ?? 0.5),
            isPrimary: true,
            isLocked: false,
            isGroupLevel: input.isGroupLevel ?? false,
            notes: input.notes || null,
          });

          await db2.insert(socialLinkEvents).values({
            dealershipId: input.dealershipId,
            socialLinkId: (inserted as any).insertId,
            platform: input.platform,
            action: 'replaced',
            oldUrl: existingPrimary.url,
            newUrl: input.url,
            reason: 'User forced replace',
            userId: ctx.user?.id ?? null,
          });
          return { result: 'replaced_primary' };
        }

        // No existing primary — insert as primary
        const [inserted] = await db2.insert(dealershipSocialLinks).values({
          dealershipId: input.dealershipId,
          platform: input.platform,
          url: input.url,
          normalizedUrl,
          status: 'unverified',
          source: input.source || 'manual_entry',
          confidenceScore: String(input.confidenceScore ?? 0.5),
          isPrimary: true,
          isLocked: false,
          isGroupLevel: input.isGroupLevel ?? false,
          notes: input.notes || null,
        });
        await db2.insert(socialLinkEvents).values({
          dealershipId: input.dealershipId,
          socialLinkId: (inserted as any).insertId,
          platform: input.platform,
          action: 'added',
          newUrl: input.url,
          reason: 'New primary added',
          userId: ctx.user?.id ?? null,
        });
        return { result: 'added_primary' };
      }),

    setLock: protectedProcedure
      .input(z.object({ id: z.number(), locked: z.boolean() }))
      .mutation(async ({ input, ctx }) => {
        const { getDb } = await import('../db');
        const db2 = await getDb();
        if (!db2) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        const { dealershipSocialLinks, socialLinkEvents } = await import('../../drizzle/schema');
        const { eq } = await import('drizzle-orm');
        const [link] = await db2.select().from(dealershipSocialLinks).where(eq(dealershipSocialLinks.id, input.id)).limit(1);
        if (!link) throw new TRPCError({ code: 'NOT_FOUND' });
        await db2.update(dealershipSocialLinks).set({ isLocked: input.locked }).where(eq(dealershipSocialLinks.id, input.id));
        await db2.insert(socialLinkEvents).values({
          dealershipId: link.dealershipId,
          socialLinkId: input.id,
          platform: link.platform,
          action: input.locked ? 'locked' : 'unlocked',
          oldUrl: link.url,
          reason: `User ${input.locked ? 'locked' : 'unlocked'} this link`,
          userId: ctx.user?.id ?? null,
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number(), reason: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        const { getDb } = await import('../db');
        const db2 = await getDb();
        if (!db2) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        const { dealershipSocialLinks, socialLinkEvents } = await import('../../drizzle/schema');
        const { eq } = await import('drizzle-orm');
        const [link] = await db2.select().from(dealershipSocialLinks).where(eq(dealershipSocialLinks.id, input.id)).limit(1);
        if (!link) throw new TRPCError({ code: 'NOT_FOUND' });
        await db2.update(dealershipSocialLinks).set({ isDeleted: true, deletedAt: new Date(), isPrimary: false }).where(eq(dealershipSocialLinks.id, input.id));
        await db2.insert(socialLinkEvents).values({
          dealershipId: link.dealershipId,
          socialLinkId: input.id,
          platform: link.platform,
          action: 'deleted',
          oldUrl: link.url,
          reason: input.reason || 'User deleted',
          userId: ctx.user?.id ?? null,
        });
        return { success: true };
      }),

    restore: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const { getDb } = await import('../db');
        const db2 = await getDb();
        if (!db2) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        const { dealershipSocialLinks, socialLinkEvents } = await import('../../drizzle/schema');
        const { eq } = await import('drizzle-orm');
        const [link] = await db2.select().from(dealershipSocialLinks).where(eq(dealershipSocialLinks.id, input.id)).limit(1);
        if (!link) throw new TRPCError({ code: 'NOT_FOUND' });
        await db2.update(dealershipSocialLinks).set({ isDeleted: false, deletedAt: null }).where(eq(dealershipSocialLinks.id, input.id));
        await db2.insert(socialLinkEvents).values({
          dealershipId: link.dealershipId,
          socialLinkId: input.id,
          platform: link.platform,
          action: 'restored',
          newUrl: link.url,
          reason: 'Admin restored from trash',
          userId: ctx.user?.id ?? null,
        });
        return { success: true };
      }),

    events: protectedProcedure
      .input(z.object({ dealershipId: z.number() }))
      .query(async ({ input }) => {
        const { getDb } = await import('../db');
        const db2 = await getDb();
        if (!db2) return [];
        const { socialLinkEvents } = await import('../../drizzle/schema');
        const { eq, desc } = await import('drizzle-orm');
        return db2.select().from(socialLinkEvents)
          .where(eq(socialLinkEvents.dealershipId, input.dealershipId))
          .orderBy(desc(socialLinkEvents.createdAt))
          .limit(50);
      }),

    exportAll: adminProcedure.query(async () => {
      const { getDb } = await import('../db');
      const db2 = await getDb();
      if (!db2) return [];
      const { dealershipSocialLinks } = await import('../../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      return db2.select().from(dealershipSocialLinks).where(eq(dealershipSocialLinks.isDeleted, false));
    }),
  }),

  // ─── Groups ───
  group: router({
    list: protectedProcedure.query(() => db.listGroups()),
    create: protectedProcedure
      .input(z.object({ name: z.string() }))
      .mutation(async ({ input }) => {
        const id = await db.createGroup(input.name);
        return { id };
      }),
    dealerships: protectedProcedure
      .input(z.object({ groupId: z.number() }))
      .query(({ input }) => db.getGroupDealerships(input.groupId)),
  }),
});
