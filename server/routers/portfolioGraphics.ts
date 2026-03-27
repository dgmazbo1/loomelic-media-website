import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getAllPortfolioGraphics,
  getPublishedPortfolioGraphics,
  createPortfolioGraphic,
  updatePortfolioGraphic,
  deletePortfolioGraphic,
  reorderPortfolioGraphics,
} from "../db";
import { storagePut } from "../storage";

function randomSuffix() {
  return Math.random().toString(36).slice(2, 10);
}

export const portfolioGraphicsRouter = router({
  listPublic: publicProcedure.query(async () => {
    return await getPublishedPortfolioGraphics();
  }),

  listAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    return await getAllPortfolioGraphics();
  }),

  create: protectedProcedure
    .input(z.object({
      title: z.string().optional(),
      caption: z.string().optional(),
      client: z.string().max(128).optional(),
      url: z.string().url(),
      fileKey: z.string(),
      published: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const id = await createPortfolioGraphic(input);
      return { success: true, id };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      caption: z.string().optional(),
      client: z.string().max(128).optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const { id, ...data } = input;
      await updatePortfolioGraphic(id, data);
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      await deletePortfolioGraphic(input.id);
      return { success: true };
    }),

  reorder: protectedProcedure
    .input(z.array(z.object({ id: z.number(), sortOrder: z.number() })))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      await reorderPortfolioGraphics(input);
      return { success: true };
    }),

  uploadImage: protectedProcedure
    .input(z.object({
      filename: z.string(),
      mimeType: z.string(),
      base64: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const buffer = Buffer.from(input.base64, "base64");
      const ext = input.filename.split(".").pop() ?? "jpg";
      const key = `portfolio-graphics/${randomSuffix()}-${Date.now()}.${ext}`;
      const { url } = await storagePut(key, buffer, input.mimeType);
      return { url, key };
    }),
});
