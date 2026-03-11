# Loomelic CRM — Integration Guide

## Overview
CRM includes:
- Acquisition Overview — dealer cards with Day tabs, area filters, lead temperature tags (Hot/Warm/Cold/Lead), and quick notes
- Pipeline — Kanban-style deal stage tracker
- Dealership Detail — full profile, contacts, visit logs, social links, and AI audit
- Rapid Pitch — on-site pitch mode
- Add Target — new dealer wizard
- Proposal Microsite — public-facing proposal pages at /p/:slug
- Admin Settings — app configuration panel

## Step 1 — Download and Unzip the Export

## Step 2 — Install Dependencies
```bash
pnpm add nanoid framer-motion streamdown recharts date-fns
pnpm add @radix-ui/react-hover-card @radix-ui/react-popover
pnpm add @radix-ui/react-scroll-area @radix-ui/react-tabs
pnpm add @radix-ui/react-tooltip @radix-ui/react-select
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu
pnpm add @radix-ui/react-accordion @radix-ui/react-collapsible
pnpm add @radix-ui/react-separator @radix-ui/react-switch
pnpm add @radix-ui/react-progress @radix-ui/react-slider
pnpm add @radix-ui/react-avatar @radix-ui/react-checkbox
pnpm add @radix-ui/react-radio-group @radix-ui/react-toggle
pnpm add @radix-ui/react-toggle-group @radix-ui/react-menubar
pnpm add @radix-ui/react-navigation-menu @radix-ui/react-alert-dialog
pnpm add @radix-ui/react-aspect-ratio @radix-ui/react-context-menu
pnpm add @radix-ui/react-label @radix-ui/react-slot
pnpm add embla-carousel-react react-resizable-panels input-otp cmdk vaul
pnpm add @hookform/resolvers react-hook-form react-day-picker
pnpm add next-themes sonner nprogress @types/nprogress
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## Step 3 — Copy Source Files
### 3a. UI Components
- Copy crm-export/client/src/components/ui/ → client/src/components/ui/
- Copy DashboardLayout.tsx, DashboardLayoutSkeleton.tsx, AIChatBox.tsx → client/src/components/

### 3b. CRM Pages
- Home.tsx → CrmOverview.tsx
- DealershipDetail.tsx
- Pipeline.tsx
- PitchMode.tsx
- NewDealerWizard.tsx
- AdminSettings.tsx
- ProposalMicrosite.tsx

### 3c. Hooks, Lib, Contexts
- hooks/useComposition.ts, useMobile.tsx, usePersistFn.ts
- lib/utils.ts
- contexts/ThemeContext.tsx
- const.ts

### 3d. Server Files
- server/routers.ts (merge with existing)
- server/db.ts
- server/storage.ts

### 3e. Drizzle Schema and Migrations
- drizzle/schema.ts (merge with existing)
- drizzle/relations.ts
- shared/const.ts, shared/types.ts

## Step 4 — Apply Database Migrations
Run 4 SQL migration files in order:
1. 0000_purple_franklin_storm.sql — Core tables (dealerships, contacts, visitLogs, proposalInstances, followUps, dealershipGroups, brandAssets, viewTracking)
2. 0001_wild_deadpool.sql — appSettings and brandAssets tables
3. 0002_broken_oracle.sql — dealershipSocialLinks and socialLinkEvents
4. 0003_broad_thunderbird.sql — leadTemp, quickNote columns on dealerships

## Step 5 — Merge Server Code
### 5a. Schema (drizzle/schema.ts)
Keep existing tables (users, etc.), add all CRM tables from export

### 5b. Database Helpers (server/db.ts)
Replace server/db.ts with CRM export version (it includes all helpers)

### 5c. Router (server/routers.ts)
Merge CRM procedures into existing router. Keep auth procedures, add all CRM procedures.

## Step 6 — Wire CRM Routes
Add routes under /crm prefix:
- /crm → CrmOverview
- /crm/pipeline → Pipeline
- /crm/dealerships/:id → DealershipDetail
- /crm/pitch/:id → PitchMode
- /crm/new → NewDealerWizard
- /crm/settings → AdminSettings
- /p/:slug → ProposalMicrosite (public)

## Step 7 — Update DashboardLayout Navigation
Add CRM sidebar items to DashboardLayout

## Step 8 — Seed Data (Optional)
Run seed-data.mjs for 36 South Florida dealers

## Step 9 — CSS Integration
Merge CRM design tokens into index.css

## Step 10 — Verify
Test all routes and functionality
