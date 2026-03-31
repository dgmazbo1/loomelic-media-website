/**
 * CRM Proposals & Enhanced Contact Tests
 * Tests the tRPC procedures for proposals, lead temp, and quick notes.
 */
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createOwnerContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
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

describe("CRM Proposals & Enhanced Contacts", () => {
  const { ctx } = createOwnerContext();
  const caller = appRouter.createCaller(ctx);

  // ─── Proposals ──────────────────────────────────────────────────────────────

  describe("proposals", () => {
    it("should list proposals (returns array)", async () => {
      const proposals = await caller.crm.listProposals();
      expect(Array.isArray(proposals)).toBe(true);
    });

    it("should create a proposal and return an id", async () => {
      const result = await caller.crm.createProposal({
        title: "Monthly Content Package — Test Dealer",
        services: "Inventory photography (200 units/mo), Short-form reels (8/mo)",
        totalValue: 5000,
        status: "draft",
      });
      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });

    it("should create a proposal linked to a contact", async () => {
      const contact = await caller.crm.createContact({
        name: "Proposal Contact",
        contactType: "client",
        status: "active",
      });
      const result = await caller.crm.createProposal({
        title: "Linked Proposal",
        contactId: contact.id,
        totalValue: 8500,
      });
      expect(result).toHaveProperty("id");
    });

    it("should update a proposal status", async () => {
      const created = await caller.crm.createProposal({
        title: "Status Update Test",
        totalValue: 3000,
      });
      const result = await caller.crm.updateProposal({
        id: created.id,
        status: "sent",
      });
      expect(result).toHaveProperty("success", true);
    });

    it("should update proposal value and services", async () => {
      const created = await caller.crm.createProposal({
        title: "Value Update Test",
        totalValue: 1000,
      });
      const result = await caller.crm.updateProposal({
        id: created.id,
        totalValue: 7500,
        services: "Full video production package",
      });
      expect(result).toHaveProperty("success", true);
    });

    it("should delete a proposal", async () => {
      const created = await caller.crm.createProposal({
        title: "Delete Me Proposal",
      });
      const result = await caller.crm.deleteProposal({ id: created.id });
      expect(result).toHaveProperty("success", true);
    });
  });

  // ─── Lead Temperature ──────────────────────────────────────────────────────

  describe("lead temperature", () => {
    it("should create a contact with leadTemp", async () => {
      const result = await caller.crm.createContact({
        name: "Hot Lead Contact",
        leadTemp: "hot",
        contactType: "lead",
      });
      expect(result).toHaveProperty("id");
    });

    it("should update contact lead temperature", async () => {
      const contact = await caller.crm.createContact({
        name: "Temp Update Contact",
        leadTemp: "warm",
      });
      const result = await caller.crm.updateContactLeadTemp({
        id: contact.id,
        leadTemp: "cold",
      });
      expect(result).toHaveProperty("success", true);
    });
  });

  // ─── Quick Notes ────────────────────────────────────────────────────────────

  describe("quick notes", () => {
    it("should update contact quick notes", async () => {
      const contact = await caller.crm.createContact({
        name: "Notes Contact",
      });
      const result = await caller.crm.updateContactQuickNotes({
        id: contact.id,
        quickNotes: "Follow up on inventory shoot schedule",
      });
      expect(result).toHaveProperty("success", true);
    });

    it("should create a contact with quickNotes", async () => {
      const result = await caller.crm.createContact({
        name: "Pre-noted Contact",
        quickNotes: "Met at NADA conference",
      });
      expect(result).toHaveProperty("id");
    });
  });

  // ─── Last Contacted ─────────────────────────────────────────────────────────

  describe("last contacted", () => {
    it("should update contact lastContactedAt timestamp", async () => {
      const contact = await caller.crm.createContact({
        name: "Timestamp Contact",
      });
      const result = await caller.crm.updateContactLastContacted({
        id: contact.id,
      });
      expect(result).toHaveProperty("success", true);
    });
  });
});
