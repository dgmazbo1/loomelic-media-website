import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { notifyOwner } from "../_core/notification";
import {
  getAllProjects,
  getProjectBySlug,
  upsertProject,
  updateProjectHero,
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  reorderGalleryImages,
  getProjectVideos,
  addProjectVideo,
  updateProjectVideo,
  deleteProjectVideo,
} from "../db";
import { storagePut } from "../storage";
import { nanoid } from "nanoid";

/** Guard: only admin users can call these procedures */
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const adminRouter = router({
  // ─── Projects ──────────────────────────────────────────────────────────────

  /** List all projects */
  listProjects: adminProcedure.query(async () => {
    return getAllProjects();
  }),

  /** Get a single project with its gallery and videos */
  getProject: adminProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const project = await getProjectBySlug(input.slug);
      if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      const gallery = await getGalleryImages(project.id);
      const videos = await getProjectVideos(project.id);
      return { project, gallery, videos };
    }),

  /** Seed / ensure a project row exists (called on first admin visit) */
  ensureProject: adminProcedure
    .input(z.object({ slug: z.string(), name: z.string() }))
    .mutation(async ({ input }) => {
      return upsertProject({ slug: input.slug, name: input.name });
    }),

  // ─── Hero image ────────────────────────────────────────────────────────────

  /** Upload a new hero image for a project (base64 encoded) */
  uploadHeroImage: adminProcedure
    .input(z.object({
      slug: z.string(),
      filename: z.string(),
      mimeType: z.string(),
      base64: z.string(),
    }))
    .mutation(async ({ input }) => {
      const project = await getProjectBySlug(input.slug);
      if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });

      const ext = input.filename.split(".").pop() ?? "jpg";
      const key = `loomelic/heroes/${input.slug}-${nanoid(8)}.${ext}`;
      const buffer = Buffer.from(input.base64, "base64");
      const { url } = await storagePut(key, buffer, input.mimeType);

      await updateProjectHero(input.slug, url, key);
      return { url, key };
    }),

  // ─── Gallery images ─────────────────────────────────────────────────────────

  /** Upload a new gallery image (base64 encoded) */
  uploadGalleryImage: adminProcedure
    .input(z.object({
      slug: z.string(),
      filename: z.string(),
      mimeType: z.string(),
      base64: z.string(),
      altText: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const project = await getProjectBySlug(input.slug);
      if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });

      const ext = input.filename.split(".").pop() ?? "jpg";
      const key = `loomelic/gallery/${input.slug}-${nanoid(10)}.${ext}`;
      const buffer = Buffer.from(input.base64, "base64");
      const { url } = await storagePut(key, buffer, input.mimeType);

      // Append at the end
      const existing = await getGalleryImages(project.id);
      const sortOrder = existing.length;

      await addGalleryImage({
        projectId: project.id,
        url,
        fileKey: key,
        altText: input.altText ?? null,
        sortOrder,
      });

      return { url, key };
    }),

  /** Delete a gallery image */
  deleteGalleryImage: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteGalleryImage(input.id);
      return { success: true };
    }),

  /** Reorder gallery images */
  reorderGallery: adminProcedure
    .input(z.object({
      updates: z.array(z.object({ id: z.number(), sortOrder: z.number() })),
    }))
    .mutation(async ({ input }) => {
      await reorderGalleryImages(input.updates);
      return { success: true };
    }),

  // ─── Videos ────────────────────────────────────────────────────────────────

  /** Add a video embed URL to a project */
  addVideo: adminProcedure
    .input(z.object({
      slug: z.string(),
      label: z.string().optional(),
      embedUrl: z.string().url(),
    }))
    .mutation(async ({ input }) => {
      const project = await getProjectBySlug(input.slug);
      if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });

      const existing = await getProjectVideos(project.id);
      await addProjectVideo({
        projectId: project.id,
        label: input.label ?? null,
        embedUrl: input.embedUrl,
        sortOrder: existing.length,
      });
      return { success: true };
    }),

  /** Update a video's label or URL */
  updateVideo: adminProcedure
    .input(z.object({
      id: z.number(),
      label: z.string(),
      embedUrl: z.string().url(),
    }))
    .mutation(async ({ input }) => {
      await updateProjectVideo(input.id, input.label, input.embedUrl);
      return { success: true };
    }),

  /** Delete a video */
  deleteVideo: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteProjectVideo(input.id);
      return { success: true };
    }),

  /**
   * Request a site publish — notifies the owner and returns a deep-link
   * to the Manus Management UI Publish button.
   * (The Manus platform does not expose a programmatic publish API;
   *  the owner must click Publish in the UI to deploy.)
   */
  requestPublish: adminProcedure
    .mutation(async () => {
      const now = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "medium", timeStyle: "short" });
      await notifyOwner({
        title: "🚀 Publish Requested",
        content: `A publish was requested from the Admin Panel at ${now} (PT). Please click the Publish button in the Manus Management UI to deploy the latest changes to the live site.`,
      }).catch(() => {}); // non-fatal
      return { success: true };
    }),
});
