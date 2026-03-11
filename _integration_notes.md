# CRM Integration Notes

## Current State
- Dev server is running on port 3000 and the site loads correctly
- The TS errors are pre-existing (13 errors in AdminCRM.tsx, DealerAdmin.tsx, VendorAdmin.tsx) - non-blocking
- The LSP error about typescript@5.6.3 is stale cache - actual version is 5.9.3
- The Navbar JSX error from devserver.log was from a previous HMR cycle, not current

## CRM Export Contents (both ZIPs are identical)
Located at: /tmp/crm-zip2/home/ubuntu/crm-export/

### Pages (7 files)
- Home.tsx → rename to CrmOverview.tsx
- DealershipDetail.tsx
- Pipeline.tsx
- PitchMode.tsx
- NewDealerWizard.tsx
- AdminSettings.tsx
- ProposalMicrosite.tsx

### Server Files
- server/routers.ts (898 lines - full tRPC procedures)
- server/db.ts (all database query helpers)
- server/storage.ts (S3 file storage helpers)

### Schema
- drizzle/schema.ts (full schema with all CRM tables)
- drizzle/relations.ts
- 4 SQL migration files

### UI Components
- 40+ shadcn/ui components
- DashboardLayout.tsx, DashboardLayoutSkeleton.tsx, AIChatBox.tsx

### Other
- hooks: useComposition.ts, useMobile.tsx, usePersistFn.ts
- lib/utils.ts, lib/trpc.ts
- contexts/ThemeContext.tsx
- const.ts, shared/const.ts, shared/types.ts
- seed-data.mjs (36 South Florida dealers)

## Integration Strategy
1. Copy UI components (won't conflict - just adding new shadcn components)
2. Copy CRM pages (rename Home.tsx to CrmOverview.tsx)
3. Copy hooks, lib, contexts (merge carefully)
4. Merge schema - keep existing tables, add CRM tables
5. Merge server routers - keep existing procedures, add CRM procedures
6. Run SQL migrations for new CRM tables
7. Wire routes in App.tsx under /crm prefix
8. Add auth guards
