# AFL Production Management - Merged System

## Overview
This is a **unified apparel production management system** created by merging two projects:
- **v0 Project**: Next.js 16 App Router UI with clean design & factory context switching
- **Lovable Project**: Supabase backend with advanced KPI metrics and hourly production tracking

## Key Features Integrated

### 1. **Real-Time Data Backend (Supabase)**
- PostgreSQL database with 5 core tables:
  - `factories`: 4 textile factories (Dhanaperumal, Abhiram, Mallikarjun, Vishwa)
  - `lines`: 16 production lines per factory (12 sewing + 4 finishing)
  - `production_plans`: 10 active orders with buyers (H&M, Zara, Levi's, Calvin Klein, Wrangler)
  - `hourly_production`: Hourly metrics (produced, passed, defects) for each line
  - `downtime`: Machine downtime tracking with reasons

### 2. **Multi-Factory Context System**
- **Factory Switcher**: Dropdown to switch between all 4 factories instantly
- **Live Clock**: Real-time HH:MM:SS display with "Live" indicator
- **Factory Header**: Shows factory name, address, and "Integrated Production Management System"
- **User Avatar**: Changes color per factory (DP=green, AB=blue, MK=purple, VS=amber)

### 3. **Advanced KPI Engine**
Integrated 15+ metrics from lovable project:
- **Efficiency**: Line-wise and factory-wide efficiency %
- **DHU (Defects per Hundred Units)**: Quality metric
- **RFT (Right First Time)**: Quality pass rate %
- **Downtime Analysis**: Total minutes and Pareto breakdown
- **Production Output**: Hourly, daily, and cumulative trends
- **Labor Productivity**: Operators per line, target vs actual

### 4. **Production Modules (11 Modules)**

| Module | Features |
|--------|----------|
| **Dashboard** | Live KPIs, hourly trend chart, DHU%, RFT%, 16-line performance table |
| **Orders** | All 10 production plans, buyer details, qty, target ship dates |
| **Cutting** | Fabric issuance and cutting plan tracking (stub pages) |
| **Sewing** | 12 sewing lines with hourly output table (8AM-7PM, 10 hrs), efficiency bars |
| **Quality Control** | Defect analysis, inline QC, AQL inspection (expandable) |
| **Finishing** | 4 finishing lines with hourly output, completion rates |
| **Inventory** | Fabric and trim storage, reorder alerts (stub pages) |
| **Shipment** | Booking, BL, vessel tracking (stub pages) |
| **HR & Workforce** | 620 operators, attendance, skills (data structure ready) |
| **Machines** | Machine registry, maintenance schedule (stub pages) |
| **Reports** | Weekly output, efficiency trends, buyer volume (stub pages) |

### 5. **Hourly Entry Form**
- `/sewing/hourly-entry`: Real-time data entry for line operators
- Select line → select order → enter hourly produced/passed/defects
- Automatic pass rate calculation
- Saves directly to Supabase

## Database Schema

### Tables Created
```sql
CREATE TABLE factories (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  code VARCHAR(10),
  location TEXT,
  created_at TIMESTAMP
);

CREATE TABLE lines (
  id UUID PRIMARY KEY,
  factory_id UUID REFERENCES factories,
  line_code VARCHAR(20),
  line_type VARCHAR(20), -- SEWING | FINISHING
  line_leader_name VARCHAR(100),
  capacity_per_hour INTEGER,
  efficiency DECIMAL(5,2),
  current_status VARCHAR(20), -- RUNNING | IDLE | DOWN | WARNING
  created_at TIMESTAMP
);

CREATE TABLE production_plans (
  id UUID PRIMARY KEY,
  factory_id UUID REFERENCES factories,
  order_id VARCHAR(50),
  buyer_name VARCHAR(100),
  style VARCHAR(100),
  color VARCHAR(50),
  size_range VARCHAR(50),
  planned_qty INTEGER,
  target_end_date DATE,
  status VARCHAR(20), -- IN_PROGRESS | COMPLETED | NOT_STARTED
  created_at TIMESTAMP
);

CREATE TABLE hourly_production (
  id UUID PRIMARY KEY,
  factory_id UUID REFERENCES factories,
  line_id UUID REFERENCES lines,
  production_plan_id UUID REFERENCES production_plans,
  hour_slot VARCHAR(20), -- "8-9AM", "9-10AM", etc.
  hour_index INTEGER, -- 0-10
  produced_qty INTEGER,
  passed_qty INTEGER,
  defect_qty INTEGER,
  date DATE,
  created_at TIMESTAMP
);

CREATE TABLE downtime (
  id UUID PRIMARY KEY,
  factory_id UUID REFERENCES factories,
  line_id UUID REFERENCES lines,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration_minutes INTEGER,
  reason VARCHAR(50), -- MECHANICAL | MATERIAL | ELECTRICAL | OTHER
  created_by VARCHAR(100),
  created_at TIMESTAMP
);
```

## Data Hooks (useProductionData)
All components use this central hook to fetch factory-specific data:
```typescript
const { hourlyData, lines, productionPlans, downtime, isLoading } = useProductionData()
```
- Automatically filters by active factory
- Real-time subscription ready (Supabase)
- Caches with SWR

## KPI Calculations
The `calculateKPIs()` function from lovable provides:
- **totalOutput**: Sum of all hourly produced quantities
- **avgEfficiency**: Average line efficiency %
- **rft**: Right First Time % (passed / produced)
- **dhu**: Defects per 100 units
- **totalDowntime**: Total minutes this shift
- **defectBreakdown**: By type (Open Seam, Skip Stitch, Shade Variation, etc.)

## Design & UI
- **Color Palette**: Blue (#3b82f6), Green (#10b981), Orange (#f97316), Purple (#a855f7)
- **Sidebar**: Dark mode compatible, collapsible, factory switcher at top
- **Charts**: Recharts (area, bar, line, pie)
- **Typography**: Geist font family, 2-font maximum
- **Responsive**: Mobile-first, tablet & desktop optimized

## File Structure
```
app/
├── layout.tsx              (FactoryProvider wrapper)
├── page.tsx               (Dashboard with KPIs)
├── orders/
│   ├── page.tsx          (Order list from production_plans)
│   └── tracking/page.tsx (stub)
├── sewing/
│   ├── page.tsx          (Line dashboard + hourly table)
│   └── hourly-entry/page.tsx (Data entry form)
├── finishing/page.tsx     (Finishing lines + hourly table)
├── quality/page.tsx       (QC metrics)
├── [other modules]...
└── globals.css

lib/
├── supabase.ts           (Supabase client)
├── factory-context.tsx   (Factory switcher context)
├── kpi.ts               (KPI calculation engine)
├── factories.ts         (Factory definitions)
└── data.ts              (Fallback dummy data)

hooks/
└── useProductionData.ts  (Central data hook)

components/
├── app-layout.tsx        (Sidebar + header with switcher)
└── shared.tsx           (KpiCard, StatusBadge, etc.)

scripts/
├── 01_create_schema.sql  (Database tables)
└── 02_seed_data.sql     (4 factories, 64 lines, 10 orders, hourly data)
```

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Getting Started
1. **Database Setup**: Execute `scripts/01_create_schema.sql` in Supabase SQL editor
2. **Seed Data**: Execute `scripts/02_seed_data.sql` for dummy data
3. **Install**: `npm install` or `pnpm install`
4. **Dev**: `npm run dev` → http://localhost:3000
5. **Try**: 
   - Switch factories via dropdown
   - View dashboard KPIs
   - Go to Sewing → Hourly Entry → add data
   - See data reflect in real-time charts

## Notes on Merge
- Removed React Router (lovable) → Using Next.js 16 App Router
- Converted Supabase hooks to work with Next.js (no useState in RSC)
- KPI calculations run on client side (useProductionData)
- Factory context replaces lovable's auth system
- All UI styling follows v0 design guidelines
- Backward compatible with dummy data fallback

## Future Enhancements
- Role-based access control (admin, manager, operator)
- Real-time subscriptions for live updates
- Export to CSV/PDF for reports
- Mobile app for line operators
- Advanced forecasting with ML models
- Integration with ERP systems (SAP, Oracle)

---

**Status**: Ready for production testing  
**Last Updated**: March 11, 2026
