import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { adminRouter } from "./routers/admin";
import { mediaRouter } from "./routers/media";
import { dealerRouter } from "./routers/dealer";
import { vendorRouter } from "./routers/vendor";
import { crmRouter } from "./routers/crm";
import { contractsRouter } from "./routers/contracts";
import { dealerAdminRouter } from "./routers/dealerAdmin";
import { vendorAdminRouter } from "./routers/vendorAdmin";
import { dealerGrowthRouter } from "./routers/dealerGrowth";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  admin: adminRouter,
  media: mediaRouter,
  dealer: dealerRouter,
  vendor: vendorRouter,
  crm: crmRouter,
  contract: contractsRouter,
  dealerAdmin: dealerAdminRouter,
  vendorAdmin: vendorAdminRouter,
  dealerGrowth: dealerGrowthRouter,
});

export type AppRouter = typeof appRouter;
