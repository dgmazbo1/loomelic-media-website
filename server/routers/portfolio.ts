/**
 * Portfolio router — admin-only CRUD for portfolio photos, videos, graphics, and tags.
 * Public list procedures are available without auth for the public portfolio page.
 *
 * Sections:
 *   photos   — image uploads stored in S3
 *   videos   — Vimeo embed URLs
 *   graphics — image uploads stored in S3 (design work, brand assets)
 *   tags     — shared tag pool across all three sections
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  portfolioPhotos,
  portfolioTags,
  portfolioPhotoTags,
  portfolioVideos,
  portfolioVideoTags,
  portfolioGraphics,
  portfolioGraphicTags,
} from "../../drizzle/schema";
import { eq, asc, inArray } from "drizzle-orm";
import { storagePut } from "../storage";

// ─── helpers ──────────────────────────────────────────────────────────────────

function requireAdmin(role: string) {
  if (role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Attach tags to a list of items given a pivot table result. */
function attachTags<T extends { id: number }>(
  items: T[],
  pivotRows: { itemId: number; tagId: number }[],
  tagMap: Map<number, { id: number; name: string; slug: string; color: string | null; createdAt: Date }>
): (T & { tags: { id: number; name: string; slug: string; color: string | null; createdAt: Date }[] })[] {
  const itemTagMap = new Map<number, typeof pivotRows[0]["tagId"][]>();
  for (const row of pivotRows) {
    const existing = itemTagMap.get(row.itemId) ?? [];
    existing.push(row.tagId);
    itemTagMap.set(row.itemId, existing);
  }
  return items.map((item) => ({
    ...item,
    tags: (itemTagMap.get(item.id) ?? [])
      .map((tid) => tagMap.get(tid))
      .filter(Boolean) as { id: number; name: string; slug: string; color: string | null; createdAt: Date }[],
  }));
}

async function getTagMap() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  const tags = await db.select().from(portfolioTags);
  return new Map(tags.map((t) => [t.id, t]));
}

// ─── router ───────────────────────────────────────────────────────────────────

export const portfolioRouter = router({

  // ══════════════════════════════════════════════════════════════════════════
  // PHOTOS
  // ══════════════════════════════════════════════════════════════════════════

  /** PUBLIC — list published photos with their tags */
  listPhotos: publicProcedure.query(async () => {
    const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const photos = await db
      .select()
      .from(portfolioPhotos)
      .where(eq(portfolioPhotos.published, true))
      .orderBy(asc(portfolioPhotos.sortOrder));

    if (photos.length === 0) return [];

    const photoIds = photos.map((p) => p.id);
    const pivotRows = await db
      .select()
      .from(portfolioPhotoTags)
      .where(inArray(portfolioPhotoTags.photoId, photoIds));

    const tagMap = await getTagMap();
    return attachTags(
      photos,
      pivotRows.map((r) => ({ itemId: r.photoId, tagId: r.tagId })),
      tagMap
    );
  }),

  /** ADMIN — list ALL photos (including unpublished) */
  listAllPhotos: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const photos = await db
      .select()
      .from(portfolioPhotos)
      .orderBy(asc(portfolioPhotos.sortOrder));

    if (photos.length === 0) return [];

    const photoIds = photos.map((p) => p.id);
    const pivotRows = await db
      .select()
      .from(portfolioPhotoTags)
      .where(inArray(portfolioPhotoTags.photoId, photoIds));

    const tagMap = await getTagMap();
    return attachTags(
      photos,
      pivotRows.map((r) => ({ itemId: r.photoId, tagId: r.tagId })),
      tagMap
    );
  }),

  /** ADMIN — upload a new photo (base64 payload → S3) */
  uploadPhoto: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        base64: z.string(),
        title: z.string().optional(),
        caption: z.string().optional(),
        tagIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const buffer = Buffer.from(input.base64, "base64");
      const suffix = Math.random().toString(36).slice(2, 8);
      const fileKey = `portfolio/photos/${Date.now()}-${suffix}-${input.filename}`;
      const { url } = await storagePut(fileKey, buffer, input.contentType);

      const existing = await db
        .select({ sortOrder: portfolioPhotos.sortOrder })
        .from(portfolioPhotos)
        .orderBy(asc(portfolioPhotos.sortOrder));
      const maxOrder = existing.length > 0 ? Math.max(...existing.map((r) => r.sortOrder)) : -1;

      const [inserted] = await db
        .insert(portfolioPhotos)
        .values({ url, fileKey, title: input.title ?? null, caption: input.caption ?? null, sortOrder: maxOrder + 1, published: true })
        .$returningId();

      if (input.tagIds && input.tagIds.length > 0) {
        await db.insert(portfolioPhotoTags).values(input.tagIds.map((tagId) => ({ photoId: inserted.id, tagId })));
      }

      return { id: inserted.id, url, fileKey };
    }),

  /** ADMIN — update photo metadata + tags */
  updatePhoto: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        caption: z.string().optional(),
        published: z.boolean().optional(),
        tagIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const updateData: Record<string, unknown> = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.caption !== undefined) updateData.caption = input.caption;
      if (input.published !== undefined) updateData.published = input.published;

      if (Object.keys(updateData).length > 0) {
        await db.update(portfolioPhotos).set(updateData).where(eq(portfolioPhotos.id, input.id));
      }

      if (input.tagIds !== undefined) {
        await db.delete(portfolioPhotoTags).where(eq(portfolioPhotoTags.photoId, input.id));
        if (input.tagIds.length > 0) {
          await db.insert(portfolioPhotoTags).values(input.tagIds.map((tagId) => ({ photoId: input.id, tagId })));
        }
      }

      return { success: true };
    }),

  /** ADMIN — delete a photo */
  deletePhoto: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(portfolioPhotoTags).where(eq(portfolioPhotoTags.photoId, input.id));
      await db.delete(portfolioPhotos).where(eq(portfolioPhotos.id, input.id));
      return { success: true };
    }),

  /** ADMIN — reorder photos (drag-and-drop) */
  reorderPhotos: protectedProcedure
    .input(z.object({ order: z.array(z.object({ id: z.number(), sortOrder: z.number() })) }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await Promise.all(
        input.order.map(({ id, sortOrder }) =>
          db!.update(portfolioPhotos).set({ sortOrder }).where(eq(portfolioPhotos.id, id))
        )
      );
      return { success: true };
    }),

  // ══════════════════════════════════════════════════════════════════════════
  // VIDEOS
  // ══════════════════════════════════════════════════════════════════════════

  /** PUBLIC — list published videos with their tags */
  listVideos: publicProcedure.query(async () => {
    const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const videos = await db
      .select()
      .from(portfolioVideos)
      .where(eq(portfolioVideos.published, true))
      .orderBy(asc(portfolioVideos.sortOrder));

    if (videos.length === 0) return [];

    const videoIds = videos.map((v) => v.id);
    const pivotRows = await db
      .select()
      .from(portfolioVideoTags)
      .where(inArray(portfolioVideoTags.videoId, videoIds));

    const tagMap = await getTagMap();
    return attachTags(
      videos,
      pivotRows.map((r) => ({ itemId: r.videoId, tagId: r.tagId })),
      tagMap
    );
  }),

  /** ADMIN — list ALL videos (including unpublished) */
  listAllVideos: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const videos = await db
      .select()
      .from(portfolioVideos)
      .orderBy(asc(portfolioVideos.sortOrder));

    if (videos.length === 0) return [];

    const videoIds = videos.map((v) => v.id);
    const pivotRows = await db
      .select()
      .from(portfolioVideoTags)
      .where(inArray(portfolioVideoTags.videoId, videoIds));

    const tagMap = await getTagMap();
    return attachTags(
      videos,
      pivotRows.map((r) => ({ itemId: r.videoId, tagId: r.tagId })),
      tagMap
    );
  }),

  /** ADMIN — create a new video entry (Vimeo URL) */
  createVideo: protectedProcedure
    .input(
      z.object({
        vimeoUrl: z.string().url(),
        title: z.string().optional(),
        caption: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        tagIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const existing = await db
        .select({ sortOrder: portfolioVideos.sortOrder })
        .from(portfolioVideos)
        .orderBy(asc(portfolioVideos.sortOrder));
      const maxOrder = existing.length > 0 ? Math.max(...existing.map((r) => r.sortOrder)) : -1;

      const [inserted] = await db
        .insert(portfolioVideos)
        .values({
          vimeoUrl: input.vimeoUrl,
          title: input.title ?? null,
          caption: input.caption ?? null,
          thumbnailUrl: input.thumbnailUrl ?? null,
          sortOrder: maxOrder + 1,
          published: true,
        })
        .$returningId();

      if (input.tagIds && input.tagIds.length > 0) {
        await db.insert(portfolioVideoTags).values(input.tagIds.map((tagId) => ({ videoId: inserted.id, tagId })));
      }

      return { id: inserted.id };
    }),

  /** ADMIN — update video metadata + tags */
  updateVideo: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        vimeoUrl: z.string().url().optional(),
        title: z.string().optional(),
        caption: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        published: z.boolean().optional(),
        tagIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const updateData: Record<string, unknown> = {};
      if (input.vimeoUrl !== undefined) updateData.vimeoUrl = input.vimeoUrl;
      if (input.title !== undefined) updateData.title = input.title;
      if (input.caption !== undefined) updateData.caption = input.caption;
      if (input.thumbnailUrl !== undefined) updateData.thumbnailUrl = input.thumbnailUrl;
      if (input.published !== undefined) updateData.published = input.published;

      if (Object.keys(updateData).length > 0) {
        await db.update(portfolioVideos).set(updateData).where(eq(portfolioVideos.id, input.id));
      }

      if (input.tagIds !== undefined) {
        await db.delete(portfolioVideoTags).where(eq(portfolioVideoTags.videoId, input.id));
        if (input.tagIds.length > 0) {
          await db.insert(portfolioVideoTags).values(input.tagIds.map((tagId) => ({ videoId: input.id, tagId })));
        }
      }

      return { success: true };
    }),

  /** ADMIN — delete a video */
  deleteVideo: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(portfolioVideoTags).where(eq(portfolioVideoTags.videoId, input.id));
      await db.delete(portfolioVideos).where(eq(portfolioVideos.id, input.id));
      return { success: true };
    }),

  /** ADMIN — reorder videos (drag-and-drop) */
  reorderVideos: protectedProcedure
    .input(z.object({ order: z.array(z.object({ id: z.number(), sortOrder: z.number() })) }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await Promise.all(
        input.order.map(({ id, sortOrder }) =>
          db!.update(portfolioVideos).set({ sortOrder }).where(eq(portfolioVideos.id, id))
        )
      );
      return { success: true };
    }),

  // ══════════════════════════════════════════════════════════════════════════
  // GRAPHICS
  // ══════════════════════════════════════════════════════════════════════════

  /** PUBLIC — list published graphics with their tags */
  listGraphics: publicProcedure.query(async () => {
    const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const graphics = await db
      .select()
      .from(portfolioGraphics)
      .where(eq(portfolioGraphics.published, true))
      .orderBy(asc(portfolioGraphics.sortOrder));

    if (graphics.length === 0) return [];

    const graphicIds = graphics.map((g) => g.id);
    const pivotRows = await db
      .select()
      .from(portfolioGraphicTags)
      .where(inArray(portfolioGraphicTags.graphicId, graphicIds));

    const tagMap = await getTagMap();
    return attachTags(
      graphics,
      pivotRows.map((r) => ({ itemId: r.graphicId, tagId: r.tagId })),
      tagMap
    );
  }),

  /** ADMIN — list ALL graphics (including unpublished) */
  listAllGraphics: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const graphics = await db
      .select()
      .from(portfolioGraphics)
      .orderBy(asc(portfolioGraphics.sortOrder));

    if (graphics.length === 0) return [];

    const graphicIds = graphics.map((g) => g.id);
    const pivotRows = await db
      .select()
      .from(portfolioGraphicTags)
      .where(inArray(portfolioGraphicTags.graphicId, graphicIds));

    const tagMap = await getTagMap();
    return attachTags(
      graphics,
      pivotRows.map((r) => ({ itemId: r.graphicId, tagId: r.tagId })),
      tagMap
    );
  }),

  /** ADMIN — upload a new graphic (base64 payload → S3) */
  uploadGraphic: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        base64: z.string(),
        title: z.string().optional(),
        caption: z.string().optional(),
        tagIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const buffer = Buffer.from(input.base64, "base64");
      const suffix = Math.random().toString(36).slice(2, 8);
      const fileKey = `portfolio/graphics/${Date.now()}-${suffix}-${input.filename}`;
      const { url } = await storagePut(fileKey, buffer, input.contentType);

      const existing = await db
        .select({ sortOrder: portfolioGraphics.sortOrder })
        .from(portfolioGraphics)
        .orderBy(asc(portfolioGraphics.sortOrder));
      const maxOrder = existing.length > 0 ? Math.max(...existing.map((r) => r.sortOrder)) : -1;

      const [inserted] = await db
        .insert(portfolioGraphics)
        .values({ url, fileKey, title: input.title ?? null, caption: input.caption ?? null, sortOrder: maxOrder + 1, published: true })
        .$returningId();

      if (input.tagIds && input.tagIds.length > 0) {
        await db.insert(portfolioGraphicTags).values(input.tagIds.map((tagId) => ({ graphicId: inserted.id, tagId })));
      }

      return { id: inserted.id, url, fileKey };
    }),

  /** ADMIN — update graphic metadata + tags */
  updateGraphic: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        caption: z.string().optional(),
        published: z.boolean().optional(),
        tagIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const updateData: Record<string, unknown> = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.caption !== undefined) updateData.caption = input.caption;
      if (input.published !== undefined) updateData.published = input.published;

      if (Object.keys(updateData).length > 0) {
        await db.update(portfolioGraphics).set(updateData).where(eq(portfolioGraphics.id, input.id));
      }

      if (input.tagIds !== undefined) {
        await db.delete(portfolioGraphicTags).where(eq(portfolioGraphicTags.graphicId, input.id));
        if (input.tagIds.length > 0) {
          await db.insert(portfolioGraphicTags).values(input.tagIds.map((tagId) => ({ graphicId: input.id, tagId })));
        }
      }

      return { success: true };
    }),

  /** ADMIN — delete a graphic */
  deleteGraphic: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(portfolioGraphicTags).where(eq(portfolioGraphicTags.graphicId, input.id));
      await db.delete(portfolioGraphics).where(eq(portfolioGraphics.id, input.id));
      return { success: true };
    }),

  /** ADMIN — reorder graphics (drag-and-drop) */
  reorderGraphics: protectedProcedure
    .input(z.object({ order: z.array(z.object({ id: z.number(), sortOrder: z.number() })) }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await Promise.all(
        input.order.map(({ id, sortOrder }) =>
          db!.update(portfolioGraphics).set({ sortOrder }).where(eq(portfolioGraphics.id, id))
        )
      );
      return { success: true };
    }),

  // ══════════════════════════════════════════════════════════════════════════
  // TAGS (shared across all three sections)
  // ══════════════════════════════════════════════════════════════════════════

  /** PUBLIC — list all tags */
  listTags: publicProcedure.query(async () => {
    const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    return db.select().from(portfolioTags).orderBy(asc(portfolioTags.name));
  }),

  /** ADMIN — create a new tag */
  createTag: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(64), color: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const slug = slugify(input.name);
      const [inserted] = await db
        .insert(portfolioTags)
        .values({ name: input.name.toUpperCase(), slug, color: input.color ?? "#ffffff" })
        .$returningId();
      return { id: inserted.id, slug };
    }),

  /** ADMIN — update a tag */
  updateTag: protectedProcedure
    .input(z.object({ id: z.number(), name: z.string().min(1).max(64).optional(), color: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const updateData: Record<string, string> = {};
      if (input.name) { updateData.name = input.name.toUpperCase(); updateData.slug = slugify(input.name); }
      if (input.color) updateData.color = input.color;
      await db.update(portfolioTags).set(updateData).where(eq(portfolioTags.id, input.id));
      return { success: true };
    }),

  /** ADMIN — delete a tag (also removes from all join tables) */
  deleteTag: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.delete(portfolioPhotoTags).where(eq(portfolioPhotoTags.tagId, input.id));
      await db.delete(portfolioVideoTags).where(eq(portfolioVideoTags.tagId, input.id));
      await db.delete(portfolioGraphicTags).where(eq(portfolioGraphicTags.tagId, input.id));
      await db.delete(portfolioTags).where(eq(portfolioTags.id, input.id));
      return { success: true };
    }),
});
