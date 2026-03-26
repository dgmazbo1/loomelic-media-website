import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getAllFeaturedWork,
  getPublishedFeaturedWork,
  createFeaturedWork,
  updateFeaturedWork,
  deleteFeaturedWork,
  reorderFeaturedWork,
} from "../db";
import { storagePut } from "../storage";
import { nanoid } from "nanoid";

/**
 * Featured Work router
 * - Public: list published items (for the Use Cases page)
 * - Admin-only: full CRUD + reorder
 */
export const featuredWorkRouter = router({
  /** Public — returns only published items ordered by sortOrder */
  listPublic: publicProcedure.query(async () => {
    return getPublishedFeaturedWork();
  }),

  /** Admin — returns all items (published + unpublished) */
  listAll: protectedProcedure.use(({ ctx, next }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    return next({ ctx });
  }).query(async () => {
    return getAllFeaturedWork();
  }),

  /** Admin — create a new featured work card */
  create: protectedProcedure.use(({ ctx, next }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    return next({ ctx });
  }).input(z.object({
    title: z.string().min(1).max(256),
    category: z.string().max(128).optional(),
    imageUrl: z.string().url(),
    imageKey: z.string().optional(),
    slug: z.string().max(128).optional(),
    sortOrder: z.number().int().default(0),
    published: z.boolean().default(true),
  })).mutation(async ({ input }) => {
    return createFeaturedWork(input);
  }),

  /** Admin — update an existing card (title, category, image, slug, published) */
  update: protectedProcedure.use(({ ctx, next }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    return next({ ctx });
  }).input(z.object({
    id: z.number().int(),
    title: z.string().min(1).max(256).optional(),
    category: z.string().max(128).optional(),
    imageUrl: z.string().url().optional(),
    imageKey: z.string().optional(),
    slug: z.string().max(128).optional(),
    sortOrder: z.number().int().optional(),
    published: z.boolean().optional(),
  })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    return updateFeaturedWork(id, data);
  }),

  /** Admin — delete a card */
  delete: protectedProcedure.use(({ ctx, next }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    return next({ ctx });
  }).input(z.object({
    id: z.number().int(),
  })).mutation(async ({ input }) => {
    await deleteFeaturedWork(input.id);
    return { success: true };
  }),

  /** Admin — upload a cover image for a featured work card (base64 encoded) */
  uploadCoverImage: protectedProcedure.use(({ ctx, next }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    return next({ ctx });
  }).input(z.object({
    filename: z.string(),
    mimeType: z.string(),
    base64: z.string(),
  })).mutation(async ({ input }) => {
    const ext = input.filename.split(".").pop() ?? "jpg";
    const key = `loomelic/featured-work/${nanoid(12)}.${ext}`;
    const buffer = Buffer.from(input.base64, "base64");
    const { url } = await storagePut(key, buffer, input.mimeType);
    return { url, key };
  }),

  /** Admin — bulk-update sortOrder after drag-and-drop reorder */
  reorder: protectedProcedure.use(({ ctx, next }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    return next({ ctx });
  }).input(z.array(z.object({
    id: z.number().int(),
    sortOrder: z.number().int(),
  }))).mutation(async ({ input }) => {
    await reorderFeaturedWork(input);
    return { success: true };
  }),
});
