# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## SmartGarment Dashboard Artifact

**Path**: `artifacts/smartgarment/`
**Preview**: `/` (root)
**Port**: 25023

A full-featured apparel production management dashboard migrated from a Vercel/Next.js v0 app to Vite + React.

### Features
- Real-time factory production dashboard with KPI cards and charts
- Sewing lines hourly output tracking with status (Running/Warning/Down/Idle)
- Quality control inspection records with defect analysis charts
- Cutting plans management
- Finishing & packing progress
- Fabric & trim inventory management with status alerts
- Shipment tracking
- HR & workforce attendance management
- Machine register with service status
- Reports with weekly output and buyer analysis charts
- Multi-factory selector (sidebar dropdown)

### Tech
- **Routing**: wouter
- **Data fetching**: SWR + Supabase (`@supabase/supabase-js`)
- **Charts**: Recharts
- **UI**: Tailwind CSS v4 with shadcn/ui components, oklch color tokens
- **Fallback**: All pages work with mock static data when Supabase env vars are not set

### Environment Variables
- `VITE_SUPABASE_URL` — Supabase project URL (optional; falls back to mock data)
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key (optional; falls back to mock data)

### Key Files
- `src/App.tsx` — wouter routing for all pages
- `src/lib/factory-context.tsx` — factory selector context with Supabase + fallback
- `src/lib/data.ts` — static mock data for quality/inventory/hr/machines/reports
- `src/hooks/useProductionData.ts` — SWR hooks for Supabase tables
- `src/components/app-layout.tsx` — sidebar + header layout
- `src/components/shared.tsx` — shared UI (KpiCard, StatusBadge, ProgressBar, SectionHeader)
- `src/pages/` — all page components
