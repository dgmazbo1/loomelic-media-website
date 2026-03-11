- [x] Add Findlay Nissan, Ascent Automotive Group, Lexus Western Area, The Blast to Trusted By strip
- [x] Convert Trusted By strip to auto-scrolling marquee
- [x] Fix admin sign-in: after OAuth login, redirect back to /admin instead of homepage
- [x] Fix admin role assignment: ensure site owner is automatically granted admin role on first login
- [x] Add "Sign In" button on /admin that preserves /admin as the return path after OAuth
- [x] Fix admin upload error: "project doesn't exist" when uploading photos
- [x] Add "Publish Changes" button to admin panel sidebar UI
- [x] Admin panel: show per-project status (hero image, gallery count, video count) in sidebar
- [x] Admin panel: drag-and-drop gallery image reordering
- [x] Admin panel: create new project from sidebar
- [x] Admin panel: delete project from sidebar
- [x] Bulk upload: multi-file selection with parallel S3 uploads and per-file progress tracking
- [x] Bulk upload: live thumbnail preview grid showing each image as it finishes uploading

## Enterprise Portals
- [x] Extend DB schema: dealers, vendors, onboarding_submissions, crm_contacts, crm_deals, vendor_jobs, contracts tables
- [x] Dealer Portal: /dealer route with login, onboarding wizard (7 steps), dashboard, documents, status tracker
- [x] Vendor Portal: /vendor route with login, jobs board, contracts, deliverables, schedule
- [x] Admin CRM: /admin/crm section with Dealers, Vendors, Contracts, Tasks, Incidents, Analytics, Reminders, Settings
- [x] Main site: Dealer Portal and Vendor Portal entry buttons on homepage
- [x] Admin panel: CRM navigation buttons linking to each CRM section
- [x] Role-based access: dealer role, vendor role, admin role gating
- [x] Add Dealer Portal and Vendor Portal buttons to homepage and navbar
- [x] Contract system: port contracts, w9Forms, contractTemplates, clientContracts tables to schema
- [x] Contract system: port contractDb.ts helpers into server/db.ts
- [x] Contract system: create server/routers/contracts.ts with all contract procedures (no email)
- [x] Contract system: 7-step slide form in admin panel (AdminCreateContract page)
- [x] Contract system: vendor signing page at /vendor/sign/:token (token-based, no login required)
- [x] Contract system: Admin CRM Contracts tab to view/manage all contracts
- [x] Contract system: vendor token auth - /vendor?token=... shows contractor dashboard with their contracts

- [x] Dealer Portal Admin: /dealer/admin - full admin panel matching reference design (black + yellow-green theme)
- [x] Dealer Portal Admin: Dashboard with stats cards (Total Dealers, In Progress, Submitted, Open Incidents)
- [x] Dealer Portal Admin: Dealers management section (list, search, filter, new dealer, detail view)
- [x] Dealer Portal Admin: Tasks section (list, create, status filter)
- [x] Dealer Portal Admin: Incidents section (list, create, manage)
- [x] Dealer Portal Admin: Reminders section
- [x] Dealer Portal Admin: Analytics section (stats, status distribution, SLA performance)
- [x] Dealer Portal Admin: Settings section
- [x] Vendor Portal Admin: /vendor/admin - full admin panel matching reference design
- [x] Vendor Portal Admin: Dashboard with stats cards (Total Vendors, Active Contracts, Open Jobs, Incidents)
- [x] Vendor Portal Admin: Vendors management section (list, search, filter, invite vendor)
- [x] Vendor Portal Admin: Contracts section (list, create, manage)
- [x] Vendor Portal Admin: Jobs section (list, assign, manage)
- [x] Vendor Portal Admin: Tasks section
- [x] Vendor Portal Admin: Analytics section
- [x] Vendor Portal Admin: Settings section
- [x] Shared: PortalAdminLayout component with black/yellow-green sidebar navigation

## Dealer CRM Module
- [x] CRM: Add crmInteractions table (call/email/meeting log per contact) to schema
- [x] CRM: Add status field to crmContacts (active, inactive, prospect, churned)
- [x] CRM: Add probability field to crmDeals
- [x] CRM: Build InteractionsTab in AdminCRM with create/list/delete per contact
- [x] CRM: Enhance ContactsTab with status badge, edit inline, and link to interactions
- [x] CRM: Enhance DealsTab with Kanban-style pipeline view (Lead → Qualified → Proposal → Negotiation → Closed Won/Lost)
- [x] CRM: Add CRM section to main /admin sidebar with sub-tabs (Contacts, Deals, Interactions)

## CRM Dashboard at /crm
- [x] Add crmProposals table to schema (title, contactId, dealId, services, totalValue, status, sentAt, viewedAt, signedAt)
- [x] Add leadTemp field to crmContacts (hot/warm/cold)
- [x] Add quickNotes field to crmContacts for inline quick notes
- [x] Add lastContactedAt field to crmContacts for day tab filtering
- [x] Build CRM Dashboard page at /crm with dealer cards, lead temp tags, quick notes, day tab filters
- [x] Build pipeline view section showing deals across stages with drag-style visual
- [x] Build proposals section with create/list/send/track proposals
- [x] Add tRPC procedures for proposals CRUD
- [x] Wire DEALER PORTAL nav button to /crm
- [x] Match black/white/yellow Loomelic brand aesthetic throughout
- [x] Write vitest tests for new CRM dashboard procedures
- [x] CRITICAL: Preserve ALL existing data — schema changes are additive only, no drops or renames

## Enterprise Platform Upgrade — Phase 1: Public Site Evolution
- [x] Nav: Rebuild Navbar with Solutions mega-menu (Dealerships, Dealer Groups, Enterprise/Regional, Events, Headshots, Website Design, CRM Video)
- [x] Nav: Rebuild Services mega-menu (Inventory Photography, Walkaround Videos, Social Reels, Event Coverage, Headshots, Website Building, CRM Video, Drone)
- [x] Nav: Add Case Studies, Process, Portals nav items
- [x] Homepage: Reposition hero for enterprise buyers — keep cinematic video bg, add enterprise positioning statement
- [x] Homepage: Add client category segmentation section (Dealerships, Dealer Groups, Events, Brands)
- [x] Homepage: Add solutions overview section
- [x] Homepage: Add "How Loomelic Works" process section
- [x] Homepage: Enhance proof/metrics section with enterprise credibility
- [x] Homepage: Add featured case studies section
- [x] Homepage: Keep portals preview section
- [x] Homepage: Add structured workflow/process section
- [x] Homepage: Upgrade CTA for discovery/strategy call

## Enterprise Platform Upgrade — Phase 2: Case Studies
- [x] Build CaseStudyTemplate component with structured sections (overview, challenge, scope, deliverables, workflow, media types, metrics, testimonial, gallery, video, CTA)
- [x] Create case study: Lexus of Las Vegas
- [x] Create case study: Lexus of Henderson
- [x] Create case study: Centennial Subaru
- [x] Create case study: Wondr Nation G2E
- [x] Create case study: Las Vegas Raiders Tour
- [x] Create case study: Bob Marley Hope Road
- [x] Create case study: Sports Illustrated
- [x] Add /case-studies listing page
- [x] Route all case studies under /case-studies/:slug

## Enterprise Platform Upgrade — Phase 3: Solutions & Process Pages
- [x] Build SolutionPageTemplate for solution verticals
- [x] Create /solutions page with all 4 verticals (Dealer, Dealer Group, Events, Brand)
- [x] Build /process page (How We Work — onboarding, execution, reporting, optimization)

## Enterprise Platform Upgrade — Phase 4: Contact & Enterprise Trust
- [ ] Upgrade contact form with enterprise fields (company type, locations, monthly needs, timeline, pain points, reporting cadence)
- [ ] Add enterprise trust content blocks (onboarding process, reporting cadence, turnaround model, security posture, asset management)

## Enterprise Platform Upgrade — Phase 5: Admin Security & RBAC
- [ ] Add auth guards on /admin, /dealer/admin, /vendor/admin routes (redirect to login if not authenticated)
- [ ] Add role-based route protection (admin-only routes blocked for non-admin users)
- [ ] Add noindex meta tags to admin/portal routes
- [ ] Add session expiration handling

## Enterprise Platform Upgrade — Phase 6: Admin Operations Hub
- [ ] Build Executive Overview dashboard (account health, production totals, overdue tasks, readiness, publish queue, alerts)
- [ ] Enhance Accounts/Clients section (locations, service plans, SLA settings)
- [ ] Enhance Projects section (deadlines, team assignments, deliverable checklists, revision status)
- [ ] Add Asset Management section (metadata, tags, alt text, archive status)
- [ ] Add Portal Management section (manage users, invites, disable/revoke, activity logs)
- [ ] Add Reporting section (monthly summaries, content volume, turnaround metrics)

## Enterprise Platform Upgrade — Phase 7: Publish Governance
- [ ] Add readiness checklist to projects (hero image, video, thumbnails, metadata, alt text, QA, client approval)
- [ ] Add readiness progress bar visual
- [ ] Block publish button until all requirements met
- [ ] Add rollback snapshot storage

## Bug Fixes — Route 404s
- [x] Fix /solutions/dealerships 404 — add route and page
- [x] Fix /solutions/headshots 404 — add route and page
- [x] Audit and fix all /solutions/* sub-routes (dealer-groups, enterprise, events, websites, crm-video)

## Move Dealer Verticals to Services (Mar 10)
- [x] Move Dealerships section from Solutions to Dealer Services under Services
- [x] Move Dealer Groups section from Solutions to Dealer Services under Services
- [x] Move Headshots section from Solutions to Dealer Services under Services
- [x] Move CRM Video section from Solutions to Dealer Services under Services
- [x] Keep Premium Web Services, Event Coverage, Enterprise/Regional, Website Design under Solutions
- [x] Add Dealer Services sub-section in Services mega-menu in Navbar
- [x] Remove moved items from Solutions mega-menu in Navbar
- [x] Create /services/dealer-services page with exact same section format/photos/videos
- [x] Add routes for /services/dealer-services/* paths
- [x] Preserve all section content exactly as-is — no changes to text, photos, or videos
