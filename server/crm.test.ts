/**
 * CRM Router Tests — Contacts, Deals, Interactions
 * Tests the tRPC procedures for the CRM module using the appRouter directly.
 */
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createOwnerContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    // CRM procedures are owner-only; use the owner openId so tests pass
    user: {
      id: 1,
      openId: "jkB7nWiTEoQp6VJPadCSJJ",
      email: "owner@loomelicmedia.com",
      name: "Denham",
      loginMethod: "manus" as const,
      role: "admin" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      cookies: {},
      headers: {},
    } as any,
    res: {
      cookie: () => {},
      clearCookie: () => {},
    } as any,
  };
  return { ctx };
}

describe("CRM Router", () => {
  const { ctx } = createOwnerContext();
  const caller = appRouter.createCaller(ctx);

  // ─── Contacts ───────────────────────────────────────────────────────────────

  describe("contacts", () => {
    it("should list contacts (returns array)", async () => {
      const contacts = await caller.crm.listContacts();
      expect(Array.isArray(contacts)).toBe(true);
    });

    it("should create a contact and return an id", async () => {
      const result = await caller.crm.createContact({
        name: "Test Contact",
        email: "test@example.com",
        company: "Test Corp",
        contactType: "lead",
        status: "prospect",
      });
      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });

    it("should update a contact", async () => {
      // Create first
      const created = await caller.crm.createContact({
        name: "Update Me",
        contactType: "lead",
        status: "prospect",
      });
      // Update
      const result = await caller.crm.updateContact({
        id: created.id,
        name: "Updated Name",
        status: "active",
      });
      expect(result).toHaveProperty("success", true);
    });

    it("should delete a contact", async () => {
      const created = await caller.crm.createContact({
        name: "Delete Me",
        contactType: "other",
        status: "inactive",
      });
      const result = await caller.crm.deleteContact({ id: created.id });
      expect(result).toHaveProperty("success", true);
    });
  });

  // ─── Deals ──────────────────────────────────────────────────────────────────

  describe("deals", () => {
    it("should list deals (returns array)", async () => {
      const deals = await caller.crm.listDeals();
      expect(Array.isArray(deals)).toBe(true);
    });

    it("should create a deal and return an id", async () => {
      const result = await caller.crm.createDeal({
        title: "Test Deal",
        stage: "lead",
        value: 5000,
        probability: 40,
      });
      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });

    it("should update a deal stage", async () => {
      const created = await caller.crm.createDeal({
        title: "Advance Me",
        stage: "lead",
      });
      const result = await caller.crm.updateDeal({
        id: created.id,
        stage: "qualified",
        probability: 60,
      });
      expect(result).toHaveProperty("success", true);
    });

    it("should delete a deal", async () => {
      const created = await caller.crm.createDeal({
        title: "Delete Me",
        stage: "closed_lost",
      });
      const result = await caller.crm.deleteDeal({ id: created.id });
      expect(result).toHaveProperty("success", true);
    });
  });

  // ─── Interactions ────────────────────────────────────────────────────────────

  describe("interactions", () => {
    it("should list interactions (returns array)", async () => {
      const interactions = await caller.crm.listInteractions({});
      expect(Array.isArray(interactions)).toBe(true);
    });

    it("should create an interaction and return success", async () => {
      // Create a contact first
      const contact = await caller.crm.createContact({
        name: "Interaction Test Contact",
        contactType: "client",
        status: "active",
      });

      const result = await caller.crm.createInteraction({
        contactId: contact.id,
        type: "call",
        direction: "outbound",
        subject: "Test call",
        body: "Discussed project scope",
        outcome: "positive",
        durationMinutes: 15,
        loggedBy: "Test User",
      });
      expect(result).toHaveProperty("success", true);
    });

    it("should filter interactions by contactId", async () => {
      const contact = await caller.crm.createContact({
        name: "Filter Test Contact",
        contactType: "lead",
        status: "prospect",
      });

      await caller.crm.createInteraction({
        contactId: contact.id,
        type: "email",
        subject: "Filter test email",
        outcome: "neutral",
      });

      const filtered = await caller.crm.listInteractions({ contactId: contact.id });
      expect(Array.isArray(filtered)).toBe(true);
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(i => expect(i.contactId).toBe(contact.id));
    });

    it("should delete an interaction", async () => {
      const contact = await caller.crm.createContact({
        name: "Delete Interaction Contact",
        contactType: "other",
        status: "inactive",
      });

      await caller.crm.createInteraction({
        contactId: contact.id,
        type: "note",
        subject: "Note to delete",
      });

      const allInteractions = await caller.crm.listInteractions({ contactId: contact.id });
      const toDelete = allInteractions[0];
      expect(toDelete).toBeDefined();

      const result = await caller.crm.deleteInteraction({ id: toDelete.id });
      expect(result).toHaveProperty("success", true);
    });
  });
});
