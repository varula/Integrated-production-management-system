-- ========================================
-- AFL Production Management System
-- Database Schema Migration
-- ========================================

-- Drop existing tables if needed (for fresh start)
DROP TABLE IF EXISTS hourly_production CASCADE;
DROP TABLE IF EXISTS downtime CASCADE;
DROP TABLE IF EXISTS production_plans CASCADE;
DROP TABLE IF EXISTS lines CASCADE;
DROP TABLE IF EXISTS factories CASCADE;

-- ========================================
-- Factories Table
-- ========================================
CREATE TABLE factories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(10) NOT NULL UNIQUE,
  location VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- Sewing Lines Table
-- ========================================
CREATE TABLE lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factory_id UUID NOT NULL REFERENCES factories(id) ON DELETE CASCADE,
  line_code VARCHAR(10) NOT NULL,
  line_name VARCHAR(100) NOT NULL,
  line_type VARCHAR(20) NOT NULL, -- 'SEWING' or 'FINISHING'
  line_leader_name VARCHAR(100),
  capacity_per_hour INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(factory_id, line_code)
);

-- ========================================
-- Production Plans Table
-- ========================================
CREATE TABLE production_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factory_id UUID NOT NULL REFERENCES factories(id) ON DELETE CASCADE,
  order_id VARCHAR(50) NOT NULL,
  buyer_name VARCHAR(100) NOT NULL,
  style VARCHAR(100) NOT NULL,
  color VARCHAR(50),
  size_range VARCHAR(50),
  planned_qty INTEGER NOT NULL,
  target_end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'NOT_STARTED', -- 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(factory_id, order_id)
);

-- ========================================
-- Hourly Production Table (10 hours: 8AM-7PM)
-- ========================================
CREATE TABLE hourly_production (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factory_id UUID NOT NULL REFERENCES factories(id) ON DELETE CASCADE,
  line_id UUID NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
  production_plan_id UUID NOT NULL REFERENCES production_plans(id) ON DELETE CASCADE,
  hour_slot VARCHAR(20) NOT NULL, -- '8-9AM', '9-10AM', etc.
  hour_index INTEGER NOT NULL, -- 0-10 (0=8-9AM, 10=6-7PM)
  produced_qty INTEGER DEFAULT 0,
  passed_qty INTEGER DEFAULT 0,
  defect_qty INTEGER DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(factory_id, line_id, production_plan_id, hour_index, date)
);

-- ========================================
-- Downtime Table
-- ========================================
CREATE TABLE downtime (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factory_id UUID NOT NULL REFERENCES factories(id) ON DELETE CASCADE,
  line_id UUID NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  duration_minutes INTEGER NOT NULL,
  reason VARCHAR(100) NOT NULL, -- 'MECHANICAL', 'ELECTRICAL', 'MATERIAL', 'SKILL', 'POWER', 'OTHER'
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- Indexes for Performance
-- ========================================
CREATE INDEX idx_lines_factory ON lines(factory_id);
CREATE INDEX idx_production_plans_factory ON production_plans(factory_id);
CREATE INDEX idx_hourly_production_factory ON hourly_production(factory_id);
CREATE INDEX idx_hourly_production_line ON hourly_production(line_id);
CREATE INDEX idx_hourly_production_date ON hourly_production(date);
CREATE INDEX idx_downtime_factory ON downtime(factory_id);
CREATE INDEX idx_downtime_line ON downtime(line_id);
CREATE INDEX idx_downtime_date ON downtime(start_time);

-- ========================================
-- Row Level Security (RLS)
-- ========================================
ALTER TABLE factories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE hourly_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE downtime ENABLE ROW LEVEL SECURITY;

-- For now, allow all reads (can be restricted by user role later)
CREATE POLICY "Enable read access for all" ON factories FOR SELECT USING (true);
CREATE POLICY "Enable read access for all" ON lines FOR SELECT USING (true);
CREATE POLICY "Enable read access for all" ON production_plans FOR SELECT USING (true);
CREATE POLICY "Enable read access for all" ON hourly_production FOR SELECT USING (true);
CREATE POLICY "Enable read access for all" ON downtime FOR SELECT USING (true);

CREATE POLICY "Enable insert for all" ON hourly_production FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON hourly_production FOR UPDATE USING (true);
CREATE POLICY "Enable insert for all" ON downtime FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON downtime FOR UPDATE USING (true);
