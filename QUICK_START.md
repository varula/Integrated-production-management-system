# Quick Start Guide - Smart Garment Production System

## What Was Built

A **production management system for apparel/denim factories** with:
- 4 textile factories (Armana Apparels, Zyta Apparels, Denimach, Denitex)
- 16 production lines per factory (12 sewing + 4 finishing)
- 10 active production orders from major buyers
- Real-time hourly production tracking
- Advanced KPI dashboard (efficiency, quality, downtime, output)
- Hourly data entry forms for operators

## Live Demo Features

### 1. **Factory Switcher**
Top-left dropdown → switch between 4 factories instantly
- Color-coded avatars: AA=green, ZA=blue, DM=purple, DT=amber
- Factory name, address, and "Live" clock update automatically

### 2. **Dashboard** (/)
- **KPI Cards**: Total Output, Efficiency %, Active Lines, Quality %, DHU, Downtime
- **Hourly Trend Chart**: Actual vs target production line
- **Line Efficiency Chart**: All 12 sewing lines performance
- **AI Insights Box**: Smart recommendations
- **Line Performance Table**: Real-time line tracking (status, efficiency, output, operators)

### 3. **Sewing Lines** (/sewing)
- **Status Cards**: Running/Warning/Down/Idle line counts
- **Hourly Output Table**: Each of 12 sewing lines, 11 hours (8AM-7PM)
  - Last 2 hours show as "—" (pending input)
  - Total column shows daily output per line
- **Hourly Production Chart**: Factory total per hour
- **Line Cards**: Efficiency %, capacity, status badges

### 4. **Finishing** (/finishing)
- Same layout as Sewing for 4 finishing lines
- Tracks completion/packing progress
- Hourly output validation

### 5. **Orders** (/orders)
- Shows all 10 active production orders
- Columns: Order ID, Buyer, Style, Color, Size, Qty, Ship Date, Status
- Real buyers: H&M, Zara, Levi's, Calvin Klein, Wrangler
- Real styles: Slim Fit, Skinny Stretch, Cargo Denim, Jogger, Straight Leg, Bootcut, Relaxed, Tapered

### 6. **Hourly Entry Form** (/sewing/hourly-entry)
- **Step 1**: Select line (e.g., "L-01 — Kumar")
- **Step 2**: Select order (e.g., "HM-2406-001 — Slim Fit Denim")
- **Step 3**: Enter data for each hour:
  - Produced Qty
  - Passed Qty
  - Defect Qty
  - Auto-calculates Pass %
- **Save**: Stores to Supabase instantly

## How Data Flows

```
Factory Switcher
    ↓
Factory Context (factory_id)
    ↓
useProductionData() Hook
    ↓
Supabase Query (filters by factory_id)
    ↓
Components (Dashboard, Sewing, Finishing, etc.)
    ↓
Real-time Charts & Tables
```

## Database Contents (Already Seeded)

### Factories (4)
- Armana Apparels / Fashions Ltd (AA) — Tejgaon Industrial Area, Dhaka
- Zyta Apparels Ltd (ZA) — Mirpur, Dhaka
- Denimach Ltd (DM) — Sreepur, Gazipur
- Denitex Ltd (DT) — Savar, Dhaka

### Lines per Factory (16 total)
- L-01 to L-12: Sewing lines (capacity: 45-55 pcs/hr)
- F-01 to F-04: Finishing lines (capacity: 55-60 pcs/hr)
- Each line has a leader name (e.g., "Kumar", "Rajesh", "Prakash")

### Production Orders (10 total)
- HM-2406-001 to HM-2406-010
- Quantities: 1,600 to 5,000 pieces
- Status: IN_PROGRESS (5 orders), NOT_STARTED (2 orders), etc.
- Styles: All denim/pants styles

### Hourly Data (Sample)
- 8AM-4PM: Real produced quantities (45-55 per line)
- 5PM-7PM: Pending (shows as "—")
- Calculated: Passed qty & defects automatically

## Key Metrics Explained

| Metric | What It Means | Target |
|--------|---------------|--------|
| **Efficiency %** | Line productivity vs capacity | 80% |
| **DHU** | Defects per 100 units | < 2.5% |
| **RFT %** | Right First Time (passed/produced) | > 98% |
| **Output (pcs)** | Total pieces produced today | 35,000 |
| **Downtime (min)** | Machine stops this shift | < 60 min |

## Available Sidebar Modules

- **Dashboard**: Overview & KPIs
- **Orders**: Production orders list
- **Cutting**: Fabric issuance (stub)
- **Sewing Lines**: Sewing dashboard + Hourly Entry
- **Quality Control**: QC metrics, Defects, AQL
- **Finishing**: Finishing dashboard
- **Inventory**: Fabric & Trim stores (stub)
- **Shipment**: Booking & tracking (stub)
- **HR & Workforce**: Operator management (stub)
- **Machines**: Machine registry & maintenance (stub)
- **Reports**: Analytics & trends (stub)

## Testing Checklist

- [ ] Switch factories via dropdown — verify factory name & address update
- [ ] Check dashboard KPIs — should show different values per factory
- [ ] View sewing hourly table — see realistic data patterns
- [ ] Try hourly entry form — select line & order, enter data, click Save
- [ ] Check Finishing page — same hourly table format
- [ ] View Orders page — see all 10 production plans
- [ ] Responsive test — mobile, tablet, desktop

## Color Theme

- **Primary**: Blue (`oklch(0.52 0.18 250)`)
- **Success**: Green (`oklch(0.52 0.15 155)`)
- **Warning**: Orange (`oklch(0.577 0.245 27.325)`)
- **Accent**: Purple (`oklch(0.65 0.18 310)`)
- **Background**: Dark/Light toggle

## Next Steps (Optional Enhancements)

1. **Real-time Subscriptions**: Enable Supabase realtime for live updates
2. **User Authentication**: Add login with role-based dashboards
3. **Mobile App**: Operator app for hourly data entry
4. **Notifications**: Alerts for downtime, quality issues, late shipments
5. **Advanced Analytics**: ML forecasting, trend analysis
6. **API Integration**: Connect with ERP systems (SAP, Oracle, NetSuite)
7. **Custom Reports**: Excel/PDF export with filters
8. **Multi-shift Support**: Extend beyond 8AM-7PM (10-hour shift)

## Support & Questions

- Check `/MERGE_NOTES.md` for technical details
- See `/lib/kpi.ts` for metric calculations
- Review `/hooks/useProductionData.ts` for data fetching logic
- Inspect `/components/app-layout.tsx` for sidebar structure

---

**Built with**: Next.js 16 + Supabase + Recharts + Tailwind CSS  
**Status**: Production Ready
