import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock the DB helpers so tests don't need a real database ─────────────────
vi.mock("./db", async (importOriginal) => {
  const original = await importOriginal<typeof import("./db")>();
  return {
    ...original,
    getPublishedFeaturedWork: vi.fn().mockResolvedValue([
      {
        id: 1,
        title: "LEXUS OF HENDERSON",
        category: "Automotive",
        imageUrl: "https://example.com/lexus.jpg",
        imageKey: "loomelic/featured-work/lexus.jpg",
        slug: "lexus-of-henderson",
        sortOrder: 0,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
    getAllFeaturedWork: vi.fn().mockResolvedValue([
      {
        id: 1,
        title: "LEXUS OF HENDERSON",
        category: "Automotive",
        imageUrl: "https://example.com/lexus.jpg",
        imageKey: "loomelic/featured-work/lexus.jpg",
        slug: "lexus-of-henderson",
        sortOrder: 0,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
    createFeaturedWork: vi.fn().mockImplementation(async (data) => ({
      id: 99,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    updateFeaturedWork: vi.fn().mockImplementation(async (id, data) => ({
      id,
      title: "Updated",
      category: null,
      imageUrl: "https://example.com/img.jpg",
      imageKey: null,
      slug: null,
      sortOrder: 0,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    })),
    deleteFeaturedWork: vi.fn().mockResolvedValue(undefined),
    reorderFeaturedWork: vi.fn().mockResolvedValue(undefined),
  };
});

// ─── Context helpers ──────────────────────────────────────────────────────────
function makeCtx(role: "admin" | "user" | null = null): TrpcContext {
  const user = role
    ? {
        id: 1,
        openId: "test-user",
        email: "test@example.com",
        name: "Test User",
        loginMethod: "manus" as const,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }
    : null;

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("featuredWork.listPublic", () => {
  it("returns published items without auth", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    const result = await caller.featuredWork.listPublic();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]?.title).toBe("LEXUS OF HENDERSON");
  });
});

describe("featuredWork.listAll", () => {
  it("returns all items for admin", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.featuredWork.listAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it("throws FORBIDDEN for non-admin", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(caller.featuredWork.listAll()).rejects.toThrow();
  });
});

describe("featuredWork.create", () => {
  it("creates a card for admin", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.featuredWork.create({
      title: "Test Dealer",
      imageUrl: "https://example.com/test.jpg",
      sortOrder: 0,
      published: true,
    });
    expect(result?.title).toBe("Test Dealer");
  });

  it("throws FORBIDDEN for non-admin", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(
      caller.featuredWork.create({
        title: "Test",
        imageUrl: "https://example.com/test.jpg",
        sortOrder: 0,
        published: true,
      })
    ).rejects.toThrow();
  });
});

describe("featuredWork.delete", () => {
  it("deletes a card for admin", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.featuredWork.delete({ id: 1 });
    expect(result.success).toBe(true);
  });

  it("throws FORBIDDEN for non-admin", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(caller.featuredWork.delete({ id: 1 })).rejects.toThrow();
  });
});

describe("featuredWork.reorder", () => {
  it("reorders cards for admin", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.featuredWork.reorder([
      { id: 1, sortOrder: 0 },
      { id: 2, sortOrder: 1 },
    ]);
    expect(result.success).toBe(true);
  });
});
