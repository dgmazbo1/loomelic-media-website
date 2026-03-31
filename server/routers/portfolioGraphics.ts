import { z } from "zod";
import { publicProcedure, ownerProcedure, router } from "../_core/trpc";
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
import { ENV } from "../_core/env";

function randomSuffix() {
  return Math.random().toString(36).slice(2, 10);
}

export const portfolioGraphicsRouter = router({
  listPublic: publicProcedure.query(async () => {
    return await getPublishedPortfolioGraphics();
  }),

  listAll: ownerProcedure.query(async ({ ctx }) => {
    if (ctx.user.openId !== ENV.ownerOpenId) throw new TRPCError({ code: "FORBIDDEN" });
    return await getAllPortfolioGraphics();
  }),

  create: ownerProcedure
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
      if (ctx.user.openId !== ENV.ownerOpenId) throw new TRPCError({ code: "FORBIDDEN" });
      const id = await createPortfolioGraphic(input);
      return { success: true, id };
    }),

  update: ownerProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      caption: z.string().optional(),
      client: z.string().max(128).optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.openId !== ENV.ownerOpenId) throw new TRPCError({ code: "FORBIDDEN" });
      const { id, ...data } = input;
      await updatePortfolioGraphic(id, data);
      return { success: true };
    }),

  delete: ownerProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.openId !== ENV.ownerOpenId) throw new TRPCError({ code: "FORBIDDEN" });
      await deletePortfolioGraphic(input.id);
      return { success: true };
    }),

  reorder: ownerProcedure
    .input(z.array(z.object({ id: z.number(), sortOrder: z.number() })))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.openId !== ENV.ownerOpenId) throw new TRPCError({ code: "FORBIDDEN" });
      await reorderPortfolioGraphics(input);
      return { success: true };
    }),

  uploadImage: ownerProcedure
    .input(z.object({
      filename: z.string(),
      mimeType: z.string(),
      base64: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.openId !== ENV.ownerOpenId) throw new TRPCError({ code: "FORBIDDEN" });
      const buffer = Buffer.from(input.base64, "base64");
      const ext = input.filename.split(".").pop() ?? "jpg";
      const key = `portfolio-graphics/${randomSuffix()}-${Date.now()}.${ext}`;
      const { url } = await storagePut(key, buffer, input.mimeType);
      return { url, key };
    }),
});
