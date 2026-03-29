import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  getProjectBySlug,
  getGalleryImages,
  getProjectVideos,
} from "../db";

export const mediaRouter = router({
  /** Get DB-managed media for a project slug. Returns null fields if not yet managed via admin. */
  getProjectMedia: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const project = await getProjectBySlug(input.slug);
      if (!project) return { heroImageUrl: null, gallery: [], videos: [] };

      const gallery = await getGalleryImages(project.id);
      const videos = await getProjectVideos(project.id);

      return {
        heroImageUrl: project.heroImageUrl,
        gallery: gallery.map(img => ({ id: img.id, url: img.url, altText: img.altText, sortOrder: img.sortOrder })),
        videos: videos.map(v => ({ id: v.id, label: v.label, embedUrl: v.embedUrl, portrait: v.portrait ?? false, sortOrder: v.sortOrder })),
      };
    }),
});
