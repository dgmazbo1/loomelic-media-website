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

## Nav Label Update (Mar 10)
- [x] Rename "Case Studies" nav item to "Portfolio" in Navbar (desktop pill + mobile menu)
- [x] Update hero headline to "VISUAL CONTENT BUILT TO PERFORM", label to "A LAS VEGAS PRODUCTION COMPANY", subtext to "Photo, video, and web production for automotive dealerships, events, headshots, and brands — Las Vegas and South Florida."

## Content Restructure (Mar 10)
- [x] Rename all "Case Studies" / "case study" text to "Portfolio" on homepage sections (CaseStudiesPreview, CTAs, buttons)
- [x] Update "VIEW CASE STUDIES" hero CTA button to "VIEW PORTFOLIO"
- [x] Move Inventory Photography, Short Form Reels, Walkaround Videos under Dealer Services (navbar + DealerServicesPage)
- [x] Match visual style of existing Dealer Services sections for the 3 new items

## Broken Links Audit & Fix (Mar 10)
- [x] Fix VendorAdmin: all sidebar nav links returning 404
- [x] Audit and fix all broken links across entire site
- [x] Verify every button and nav item resolves to a valid route

## Navbar Cleanup (Mar 11)
- [x] Remove Solutions tab from desktop and mobile nav
- [x] Remove Drone / Exterior Visuals from Services menu
- [x] Convert Dealer Services into a flyout sub-menu under Services (not a flat list)
- [x] Clean up Services mega-menu layout and hierarchy

## Navbar Portal Buttons Removal (Mar 11)
- [x] Remove DEALER CRM (yellow) button from top navbar
- [x] Remove VENDOR (purple) button from top navbar

## Dealer Growth Command System (CRM) Integration (Mar 11)
- [x] Install CRM dependencies (nanoid, recharts, nprogress)
- [x] Copy CRM UI pages (CrmOverview, DealershipDetail, NewDealerWizard, RapidPitch, Pipeline, Settings, ProposalMicrosite)
- [x] Copy CRM components (TopLoadingBar, CarMakerLogo)
- [x] Merge CRM database schema (dealerships, dealerContacts, visitLogs, proposalInstances, followUps, dealershipGroups, brandAssets, appSettings, viewTracking, dealershipSocialLinks, socialLinkEvents)
- [x] Run database migrations for all CRM tables
- [x] Create dealerGrowth router with all CRM procedures (dealership, contact, visitLog, proposal, followUp, tracking, socialLink, dashboard, settings, brandAsset, group)
- [x] Append CRM db helpers to server/db.ts
- [x] Wire CRM routes in App.tsx under /growth/* prefix
- [x] Update all tRPC calls in CRM pages to use dealerGrowth.* prefix
- [x] Update all internal navigation links to /growth/* paths
- [x] Add AuthGate component to protect /growth/* routes (login required)
- [x] Convert CRM backend procedures from publicProcedure to protectedProcedure (except getBySlug and track for public proposal microsites)
- [x] Fix TypeScript errors in CRM pages (brand type, null checks)
- [x] Write vitest tests for dealerGrowth router and db helpers (all passing)
- [x] Verify all CRM routes working: Overview, Pipeline, Add Target, Rapid Pitch, Settings
- [x] Sidebar navigation working correctly for all CRM pages

## Homepage Cleanup (Mar 11)
- [x] Remove "Who We Serve" section from homepage (duplicates "What We Do")

## Use Cases Page (Mar 11)
- [x] Build /use-cases page with hero, positioning block, featured use case grid, expanded detail sections, SEO section, final CTA
- [x] Add Centennial Subaru use case with full content (Overview, Challenge, Strategy, Execution, Result, Why It Worked)
- [x] Add Findlay Nissan Henderson use case with full content (Overview, Challenge, Strategy, Execution, Result, Why It Worked)
- [x] Add Use Cases nav item to desktop navbar (between PORTFOLIO and PROCESS)
- [x] Add Use Cases nav item to mobile navbar menu
- [x] Add Use Cases link to footer navigation
- [x] Wire /use-cases route in App.tsx
- [x] Smooth anchor navigation between featured use cases (scroll-mt-24 + href anchors)
- [x] Verify all buttons and links route correctly

## Use Cases Page Cleanup (Mar 11)
- [x] Remove "Portfolio vs. Use Cases" positioning section from /use-cases
- [x] Remove "Dealership Marketing / Content Built For Results" SEO section from /use-cases

## Mobile Hero Font Fix (Mar 15)
- [x] Reduce hero heading font size on mobile for homepage HeroSection
- [x] Reduce hero heading font size on mobile for Use Cases page hero

## Use Cases Mobile Font Cleanup (Mar 15)
- [x] Reduce mobile font on REAL RESULTS grid heading (clamp 3.5rem → 2rem)
- [x] Reduce mobile font on Final CTA heading (clamp 3rem → 2rem)

## Scroll Fade-In Animations (Mar 15)
- [ ] Audit existing AnimFade usage and identify headings missing scroll animation
- [ ] Apply scroll fade-in to homepage section headings (About, Services, Stats, Projects, Portfolio, Contact)
- [ ] Apply scroll fade-in to Use Cases page section headings

## Headshots Section Image Swap (Mar 15)
- [x] Upload LOH headshot to CDN and replace video in Headshots & Portraits section

## Inventory Photography Slideshow (Mar 15)
- [ ] Upload 14 inventory photos to CDN
- [ ] Build auto-sliding carousel for INVENTORY PHOTOGRAPHY section in DealerServicesPage

## Inventory Photography Slideshow (Mar 15)
- [x] Add auto-sliding InventorySlideshow component to INVENTORY PHOTOGRAPHY section in DealerServicesPage
- [x] Carousel cycles through 14 real CDN inventory photos every 3.5 seconds with fade transition
- [x] Prev/Next buttons, dot indicators, photo counter (X / 14), pause-on-hover

## Font Size Reduction — Hero & Section Headers (Mar 15)
- [x] Reduce all hero and section header font sizes by ~1/3 on desktop across entire site

## Event Coverage Photos (Mar 15)
- [x] Upload 7 event photos to CDN and add to Event Coverage slideshow

## Remove Enterprise & Regional (Mar 15)
- [x] Remove all "Enterprise" and "Regional" labels, tags, and references site-wide

## G2E Photos in Event Coverage Service Page (Mar 15)
- [x] Display all 7 G2E 2025 photos in the Services > Event Coverage gallery section

## Event Coverage Page — G2E Gallery Section (Mar 15)
- [x] Add dedicated G2E 2025 photo gallery section directly on the Event Coverage page

## Trusted By — Add Clients (Mar 16)
- [x] Add ABC Hyundai and Lithia Group to the Trusted By section

## Hero Video Replacement (Mar 21)
- [x] Upload Website.mov to CDN and replace hero video on homepage and Dealer Services page

## Portfolio Admin Management (Mar 21)
- [ ] Database schema: portfolio_photos table (id, url, fileKey, title, sortOrder, published, createdAt) + portfolio_tags + portfolio_photo_tags join table
- [ ] tRPC procedures: list, create, update, delete photos; manage tags; reorder (drag-and-drop)
- [ ] Admin panel: portfolio manager UI with image upload, tag editor, drag-and-drop reorder, publish toggle
- [ ] Public portfolio page: read from database instead of static array
- [ ] Vitest tests for portfolio procedures
- [ ] Database schema: portfolio_videos table (id, vimeoUrl, title, caption, sortOrder, published, tagIds)
- [ ] tRPC procedures: list, create, update, delete, reorder portfolio videos
- [ ] Admin panel: Vimeo video manager with embed preview, tag assignment, drag-and-drop reorder
- [ ] Public portfolio page: Video tab/section with Vimeo embeds from database
- [ ] Database schema: portfolio_graphics table (same structure as photos — image upload + tags + drag-and-drop)
- [ ] tRPC procedures: list, create, update, delete, reorder portfolio graphics
- [ ] Admin panel: Graphics tab with image upload, tag assignment, drag-and-drop reorder
- [ ] Public Portfolio page: three-tab navigation — Photos | Videos | Graphics

## Portfolio System — Photos, Videos, Graphics (Mar 21)
- [x] Add portfolio_graphics table to Drizzle schema (url, fileKey, title, caption, sortOrder, published, tags)
- [x] Build tRPC portfolio router with full CRUD for Photos, Videos, and Graphics
- [x] Build tRPC procedures for tag management (create, list, delete) shared across all three sections
- [x] Build drag-and-drop reorder procedures for Photos, Videos, and Graphics
- [x] Build /admin/portfolio page with four tabs: Photos, Videos, Graphics, Tags
- [x] Admin Photos tab: multi-file upload to S3, tag assignment, drag-and-drop reorder, publish/hide toggle, edit/delete
- [x] Admin Videos tab: Vimeo URL embed, tag assignment, drag-and-drop reorder, publish/hide toggle, edit/delete
- [x] Admin Graphics tab: multi-file upload to S3, tag assignment, drag-and-drop reorder, publish/hide toggle, edit/delete
- [x] Admin Tags tab: create tags with custom color, delete tags (cascades across all items)
- [x] Rebuild public /portfolio page with three-section tab navigation (Photos, Videos, Graphics)
- [x] Public portfolio: tag filter bar on each section
- [x] Public portfolio: photo lightbox with prev/next navigation
- [x] Public portfolio: video lightbox with embedded Vimeo player (autoplay)
- [x] Public portfolio: graphic lightbox with prev/next navigation
- [x] Write vitest tests for portfolio router (15 tests — public queries, admin RBAC, FORBIDDEN checks)
- [x] Add /admin/portfolio route to App.tsx

## Social Media Links (Mar 21)
- [x] Add Facebook, TikTok, Threads links to HeroSection (alongside existing Instagram + YouTube)
- [x] Add Facebook, TikTok, Threads links to ContactSection contact info block (light section)
- [x] Add Facebook, TikTok, Threads links to ContactSection footer (dark section)
- [x] Update Instagram URL to full URL with trailing slash in all locations

## Admin Panel — Portfolio Link (Mar 21)
- [x] Add Portfolio Management link to admin panel sidebar (under Portals & CRM section)

## Lexus of Henderson — Vimeo Embeds (Mar 24)
- [x] Embed GX Showroom Floor (vimeo/1080433854) under Lexus of Henderson project
- [x] Embed RX Roller (vimeo/1080433702) under Lexus of Henderson project
- [x] Embed LS500 Hybrid (vimeo/1080433824) under Lexus of Henderson project
- [x] Embed fourth video (vimeo/1080433675) under Lexus of Henderson project
- [x] Remove broken video links from Lexus of Henderson project page

## Homepage — Error Section Fix (Mar 24)
- [x] Remove "Sorry we are having some trouble here" error section from homepage
- [x] Embed Lexus of Henderson Internet Welcome Video (vimeo/1021927778) in its place

## Video Autoplay Muted (Mar 24)
- [x] Update homepage About section video to autoplay muted
- [x] Update Lexus of Henderson project page videos to autoplay muted

## Broken Links Audit (Mar 24)
- [x] Scan all components and pages for broken/placeholder links
- [x] Fix or remove all broken links found

## Mobile Phone & Email Links (Mar 24)
- [x] Audit all phone/email references and ensure tel: and mailto: hrefs are used
- [x] Verify Book a Call section has live phone and email tap links

## Use Cases Page Redesign (Mar 25)
- [ ] Design and build two layout variants for Use Cases page
- [ ] Apply chosen layout variant

## Use Cases Page — Tabbed Card Layout (Mar 25)
- [x] Rewrite UseCases.tsx with Featured Work + Use Cases tabs using card grid style
- [x] Apply Layout A card style to Use Cases tab
- [x] Clean up temporary preview routes (/use-cases-a, /use-cases-b)

## Contact Form Email Notifications (Mar 25)
- [x] Send email to Denham@loomelicmedia.com on every contact form submission (Resend API key needed for email; Manus notification fires as fallback)
- [x] Include all form fields in the email (name, company, role, email, phone, service, message)

## Findlay Nissan Use Case Update (Mar 25)
- [x] Upload 5K photo as CDN asset and set as cover image
- [x] Upload CourtneyIntro.mov (English) and SoniaSpanish.mp4 (Spanish) to CDN
- [x] Embed both intro videos in the Findlay Nissan use case
- [x] Update copy to highlight bilingual sales outreach strategy

## Findlay Nissan Videos — Aspect Ratio Fix (Mar 25)
- [x] Change video containers from 9:16 portrait to 16:9 landscape in UseCases.tsx

## Centennial Subaru Use Case Update (Mar 25)
- [x] Upload #1, #2, #3 WeekendSpecial.mp4 to CDN
- [x] Embed three videos in Centennial Subaru use case
- [x] Expand challenge/solution/result copy with 5-day sales window, demographic boosting, PMA targeting

## Use Cases Video Format Fix (Mar 25)
- [x] Centennial Subaru videos: display as 9:16 portrait
- [x] All use case videos: show preview frame (not black screen) on load

## Centennial Subaru Cover Photo (Mar 25)
- [x] Upload DSC_8782.jpg to CDN and set as Centennial Subaru use case cover image

## Use Cases Scroll Fix (Mar 25)
- [x] Scroll to top of use case detail when a card is clicked

## Use Case Card Overlay (Mar 25)
- [x] Update Findlay Nissan cover image to DSC02345.jpg (Nissan Pathfinder SR)
- [x] Apply Style 1 gradient fade name overlay to all use case cards (title + location, no category label)

## Use Case Overlay Font Update (Mar 25)
- [x] Change overlay title font to font-display (Barlow Condensed 800 italic) to match hero "CONTENT"/"BUILT" style

## Bug Fix (Mar 26)
- [x] Fix missing React key prop in UseCases component list renders

## Featured Work Admin Manager (Mar 26)
- [x] Add featured_work table to DB schema with sortOrder field
- [x] Build tRPC procedures: list, create, update, delete, reorder featured work
- [x] Build admin Featured Work manager page with drag-to-reorder, add, delete
- [x] Wire public UseCases page to load featured work from DB
- [x] Fix missing React key prop on fragment in USE_CASES.map()
- [x] Write vitest tests for featured work procedures

## Portfolio Graphics Upload (Mar 26)
- [x] Upload 12 client graphic designs to CDN and add to Portfolio Graphics section

## Centennial Subaru Featured Work Videos (Mar 26)
- [ ] Collect all video IDs from Vimeo review folder link
- [ ] Embed all videos in Centennial Subaru featured work page
- [ ] Shorten hero video to 5 seconds (start/end trim via Vimeo embed params)

## Graphics Removal (Mar 26)
- [x] Remove "Lexus GX — Spring Facebook Profile" (gx_spring_facebook_profile) from portfolio_graphics

## Bug Fix — FeaturedWorkAdmin (Mar 26)
- [x] Fix React error #301 (hooks violation) in FeaturedWorkAdmin page

## Featured Work DB Seed (Mar 26)
- [x] Insert all 7 projects into featured_work table (Lexus Henderson, Lexus LV, Raiders, Centennial Subaru, Wondr Nation, Bob Marley, Sports Illustrated)

## Featured Work Card UX (Mar 26)
- [x] Add "View Project" hover CTA (slide-up label + arrow) to Featured Work cards
- [x] Embed all videos from Vimeo folder (user/189901004/folder/28722208) into Portfolio Videos section
- [x] Add location subtitles to Featured Work card overlays (e.g., "HENDERSON, NV")
- [x] Add client filter tabs to Graphics page (All / Lexus / Findlay Nissan / Centennial Subaru)
- [x] Add client field to portfolioGraphics table for filtering

## Bug Fix — Portfolio Videos Tab (Mar 27)
- [ ] Debug and fix portfolio videos not showing in the Videos tab on /portfolio
