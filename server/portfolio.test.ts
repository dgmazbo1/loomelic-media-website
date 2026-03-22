/**
 * Portfolio router — unit tests
 * Tests cover: tag creation, photo listing (public/admin), video listing, graphic listing,
 * and role-based access control (admin-only procedures reject non-admins).
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Context helpers ──────────────────────────────────────────────────────────

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function makeUser(role: "admin" | "user" = "user"): AuthenticatedUser {
  return {
    id: 1,
    openId: "test-open-id",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

function makeCtx(user?: AuthenticatedUser): TrpcContext {
  return {
    user: user ?? null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── Public procedures ────────────────────────────────────────────────────────

describe("portfolio.listPhotos (public)", () => {
  it("returns an array (empty when no data)", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.portfolio.listPhotos();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("portfolio.listVideos (public)", () => {
  it("returns an array (empty when no data)", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.portfolio.listVideos();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("portfolio.listGraphics (public)", () => {
  it("returns an array (empty when no data)", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.portfolio.listGraphics();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("portfolio.listTags (public)", () => {
  it("returns an array", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.portfolio.listTags();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── Admin-only procedures — unauthenticated rejection ────────────────────────

describe("portfolio admin procedures — unauthenticated", () => {
  it("listAllPhotos throws UNAUTHORIZED when not logged in", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.portfolio.listAllPhotos()).rejects.toThrow(TRPCError);
  });

  it("listAllVideos throws UNAUTHORIZED when not logged in", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.portfolio.listAllVideos()).rejects.toThrow(TRPCError);
  });

  it("listAllGraphics throws UNAUTHORIZED when not logged in", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.portfolio.listAllGraphics()).rejects.toThrow(TRPCError);
  });
});

// ─── Admin-only procedures — non-admin rejection ──────────────────────────────

describe("portfolio admin procedures — non-admin user", () => {
  it("listAllPhotos throws FORBIDDEN when user is not admin", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser("user")));
    await expect(caller.portfolio.listAllPhotos()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("uploadPhoto throws FORBIDDEN when user is not admin", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser("user")));
    await expect(
      caller.portfolio.uploadPhoto({
        filename: "test.jpg",
        contentType: "image/jpeg",
        base64: "abc123",
      })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("createVideo throws FORBIDDEN when user is not admin", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser("user")));
    await expect(
      caller.portfolio.createVideo({ vimeoUrl: "https://vimeo.com/123456789" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("uploadGraphic throws FORBIDDEN when user is not admin", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser("user")));
    await expect(
      caller.portfolio.uploadGraphic({
        filename: "design.png",
        contentType: "image/png",
        base64: "abc123",
      })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("createTag throws FORBIDDEN when user is not admin", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser("user")));
    await expect(
      caller.portfolio.createTag({ name: "Test Tag" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

// ─── Admin procedures — admin user ────────────────────────────────────────────

describe("portfolio admin procedures — admin user", () => {
  it("listAllPhotos returns an array for admin", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser("admin")));
    const result = await caller.portfolio.listAllPhotos();
    expect(Array.isArray(result)).toBe(true);
  });

  it("listAllVideos returns an array for admin", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser("admin")));
    const result = await caller.portfolio.listAllVideos();
    expect(Array.isArray(result)).toBe(true);
  });

  it("listAllGraphics returns an array for admin", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser("admin")));
    const result = await caller.portfolio.listAllGraphics();
    expect(Array.isArray(result)).toBe(true);
  });
});
