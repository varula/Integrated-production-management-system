# SmartGarment System Architecture

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  BROWSER / CLIENT SIDE                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              App Layout (app-layout.tsx)             │   │
│  │  - Sidebar Navigation                               │   │
│  │  - Factory Switcher (top-left)                       │   │
│  │  - Live Clock (top-right)                            │   │
│  │  - Header with factory info                          │   │
│  └──────────┬───────────────────────────────────────────┘   │
│             │                                                │
│  ┌──────────▼───────────────────────────────────────────┐   │
│  │         FactoryProvider (Context)                    │   │
│  │  selectedFactory → affects all data fetches          │   │
│  │  factories [] → list all 4 factories                 │   │
│  │  setSelectedFactory() → trigger updates              │   │
│  └──────────┬───────────────────────────────────────────┘   │
│             │                                                │
│  ┌──────────▼───────────────────────────────────────────┐   │
│  │     useProductionData() Hook                         │   │
│  │  - Gets factory ID from context                      │   │
│  │  - Calls 3 SWR hooks:                                │   │
│  │    • useLinesData(factoryId)                         │   │
│  │    • useProductionPlansData(factoryId)               │   │
│  │    • useTodayProductionByLine(factoryId)             │   │
│  │  - Returns: { lines, productionPlans, hourlyData }   │   │
│  └──────────┬───────────────────────────────────────────┘   │
│             │                                                │
│  ┌──────────▼───────────────────────────────────────────┐   │
│  │        Pages (Dashboard, Sewing, etc)                │   │
│  │  1. Call useProductionData()                         │   │
│  │  2. Call calculateKPIs() to process data             │   │
│  │  3. Render components with real data                 │   │
│  └──────────┬───────────────────────────────────────────┘   │
│             │                                                │
│  ┌──────────▼───────────────────────────────────────────┐   │
│  │      Shared Components                               │   │
│  │  - KpiCard (displays metrics)                        │   │
│  │  - SectionHeader (section titles)                    │   │
│  │  - StatusBadge (status colors)                       │   │
│  │  - ProgressBar (efficiency bars)                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTP/HTTPS via Supabase Client
                         │
┌────────────────────────▼─────────────────────────────────────┐
│               SUPABASE / SERVER SIDE                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          PostgreSQL Database                        │   │
│  │                                                      │   │
│  │  Tables:                                            │   │
│  │  • factories (4 rows)                               │   │
│  │    - id, name, code, location                       │   │
│  │                                                      │   │
│  │  • lines (64 rows = 4 factories × 16 lines)         │   │
│  │    - id, factory_id, line_code, line_type           │   │
│  │    - line_leader_name, capacity_per_hour            │   │
│  │    - efficiency, current_status                     │   │
│  │                                                      │   │
│  │  • production_plans (10 rows)                        │   │
│  │    - id, factory_id, order_id, buyer_name           │   │
│  │    - style, color, planned_qty, target_end_date     │   │
│  │    - status                                         │   │
│  │                                                      │   │
│  │  • hourly_production (640 rows)                      │   │
│  │    - id, factory_id, line_id, date, hour_index      │   │
│  │    - produced_qty, passed_qty, defect_qty           │   │
│  │                                                      │   │
│  │  • downtime (50 rows)                               │   │
│  │    - id, factory_id, line_id, date, time            │   │
│  │    - duration_minutes, reason                       │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
RootLayout
├── FactoryProvider
│   └── AppLayout
│       ├── Header
│       │   ├── Factory Switcher
│       │   ├── Live Clock
│       │   └── Breadcrumb
│       ├── Sidebar
│       │   ├── NavItems (11 modules)
│       │   └── User Profile
│       └── Main Content
│           ├── PageContainer
│           │   ├── KpiCard × 4
│           │   ├── SectionHeader
│           │   ├── Charts (Recharts)
│           │   ├── DataTables
│           │   └── StatusCards
│           └── Page-specific components
│               ├── DashboardPage
│               ├── SewingPage
│               ├── FinishingPage
│               ├── OrdersPage
│               └── [8 more pages]
```

---

## Data Fetching Strategy

### Pattern: SWR (Stale-While-Revalidate)

```typescript
// Example: useLinesData hook
const { data, error, isLoading } = useSWR(
  ['lines', factoryId],  // Cache key
  () => supabase
    .from('lines')
    .select('*')
    .eq('factory_id', factoryId)
    .then(res => res.data),
  { revalidateOnFocus: false }  // Don't refetch on window focus
)
```

**Benefits:**
- Automatic caching per factory
- Instant UI updates when switching factories
- Background refresh without blocking renders
- Fallback to stale data if network fails

---

## KPI Calculation Flow

```
Raw Data (from Supabase)
├── hourlyData []  (640 hourly records)
├── lines []       (64 line records)
└── productionPlans [] (10 orders)
       │
       ▼
calculateKPIs() Function
├── Total Production = SUM(hourlyData.produced_qty)
├── Total Passed = SUM(hourlyData.passed_qty)
├── Total Defect = SUM(hourlyData.defect_qty)
├── Efficiency = AVG(lines.efficiency)
├── DHU = (defects / produced) × 100
├── RFT = (passed / produced) × 100
└── Returns: FactoryMetrics object
       │
       ▼
Dashboard renders with KPI values
```

---

## Factory Switching Lifecycle

```
1. User clicks Factory Dropdown
   ↓
2. Factory selection changed in context
   ↓
3. selectedFactory value updates
   ↓
4. All useProductionData() hooks re-run (due to factoryId change)
   ↓
5. SWR cache keys update: ['lines', newFactoryId]
   ↓
6. New Supabase queries execute for selected factory
   ↓
7. Components re-render with new data
   ↓
8. Dashboard, charts, tables all show selected factory's data
```

**Result:** Instant factory switching with automatic data update.

---

## File Structure

```
/app
├── layout.tsx (RootLayout with FactoryProvider)
├── page.tsx (Dashboard)
├── globals.css (Tailwind + design tokens)
├── orders/
│   ├── page.tsx
│   └── tracking/page.tsx
├── sewing/
│   ├── page.tsx
│   └── hourly-entry/page.tsx
├── cutting/
│   ├── page.tsx
│   └── fabric-issued/page.tsx
├── finishing/page.tsx
├── quality/page.tsx
├── inventory/page.tsx
├── shipment/page.tsx
├── hr/page.tsx
├── machines/page.tsx
├── reports/page.tsx
└── settings/page.tsx

/components
├── app-layout.tsx (Sidebar + Header)
├── shared.tsx (Reusable components)
└── ui/* (shadcn components)

/lib
├── factory-context.tsx (FactoryProvider + useFactory hook)
├── supabase.ts (Supabase client)
├── kpi.ts (KPI calculations)
├── data.ts (Fallback dummy data)
└── utils.ts (Helper functions)

/hooks
└── useProductionData.ts (Main composite hook + 3 individual hooks)

/scripts
├── 01_create_schema.sql (Create tables)
└── 02_seed_data.sql (Seed 4 factories + data)
```

---

## Error Handling Strategy

### Frontend
- Try/catch in useProductionData()
- Fallback to empty arrays if fetch fails
- Show loading spinners while data loads
- Display error badges if needed

### Backend
- Supabase RLS policies (row-level security)
- Factory_id filtering on all queries
- On cascade delete for cleanup

### Database
- UUID primary keys
- Foreign key constraints
- Timestamps for all records

---

## Performance Optimizations

1. **SWR Caching**: Data cached per factory ID
2. **Lazy Components**: Pages code-split per route
3. **Memoization**: useCallback for event handlers
4. **Efficient Queries**: Only select needed columns
5. **Sidebar Menu**: Collapsible sections reduce DOM
6. **Chart.js Alternative**: Recharts with responsive containers

---

## Scale Considerations

**Current Setup (Test Phase):**
- 4 factories, 16 lines each = 64 lines
- 10 production orders
- 640 hourly records (10 hours × 64 lines)
- ~50 downtime events

**Production Ready For:**
- 100+ factories (SWR caching makes this scalable)
- 1000+ production lines (indexed by factory_id)
- 100,000+ hourly records (partitioned by date in SQL)
- Real-time updates (via Supabase subscriptions - future enhancement)
