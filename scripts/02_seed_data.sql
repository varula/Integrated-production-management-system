-- ========================================
-- Seed Data: Factories & Production Data
-- ========================================

-- INSERT FACTORIES (4 factories)
INSERT INTO factories (id, name, code, location) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Dhanaperumal Textiles', 'DP', 'Tiruppur, Tamil Nadu'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Abhiram Industries', 'AB', 'Erode, Tamil Nadu'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Mallikarjun Garments', 'MK', 'Bangalore, Karnataka'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Vishwa Apparel Co.', 'VS', 'Hyderabad, Telangana')
ON CONFLICT DO NOTHING;

-- ========================================
-- INSERT SEWING LINES (12 sewing lines per factory)
-- ========================================
-- DP Factory Lines
INSERT INTO lines (factory_id, line_code, line_name, line_type, line_leader_name, capacity_per_hour) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'L-01', 'Sewing Line 01', 'SEWING', 'Kumar', 55),
  ('550e8400-e29b-41d4-a716-446655440001', 'L-02', 'Sewing Line 02', 'SEWING', 'Rajesh', 55),
  ('550e8400-e29b-41d4-a716-446655440001', 'L-03', 'Sewing Line 03', 'SEWING', 'Pradeep', 50),
  ('550e8400-e29b-41d4-a716-446655440001', 'L-04', 'Sewing Line 04', 'SEWING', 'Arun', 50),
  ('550e8400-e29b-41d4-a716-446655440001', 'L-05', 'Sewing Line 05', 'SEWING', 'Suresh', 52),
  ('550e8400-e29b-41d4-a716-446655440001', 'L-06', 'Sewing Line 06', 'SEWING', 'Vijay', 52),
  ('550e8400-e29b-41d4-a716-446655440001', 'L-07', 'Sewing Line 07', 'SEWING', 'Karthik', 48),
  ('550e8400-e29b-41d4-a716-446655440001', 'L-08', 'Sewing Line 08', 'SEWING', 'Siva', 48),
  ('550e8400-e29b-41d4-a716-446655440001', 'L-09', 'Sewing Line 09', 'SEWING', 'Mohan', 50),
  ('550e8400-e29b-41d4-a716-446655440001', 'L-10', 'Sewing Line 10', 'SEWING', 'Ravi', 55),
  ('550e8400-e29b-41d4-a716-446655440001', 'L-11', 'Sewing Line 11', 'SEWING', 'Dinesh', 50),
  ('550e8400-e29b-41d4-a716-446655440001', 'L-12', 'Sewing Line 12', 'SEWING', 'Akshay', 45)
ON CONFLICT DO NOTHING;

-- Finishing Lines for DP
INSERT INTO lines (factory_id, line_code, line_name, line_type, line_leader_name, capacity_per_hour) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'F-01', 'Finishing Line 01', 'FINISHING', 'Prakash', 60),
  ('550e8400-e29b-41d4-a716-446655440001', 'F-02', 'Finishing Line 02', 'FINISHING', 'Hari', 60),
  ('550e8400-e29b-41d4-a716-446655440001', 'F-03', 'Finishing Line 03', 'FINISHING', 'Nitin', 55),
  ('550e8400-e29b-41d4-a716-446655440001', 'F-04', 'Finishing Line 04', 'FINISHING', 'Deepak', 55)
ON CONFLICT DO NOTHING;

-- Insert similar lines for AB, MK, VS factories (simplified for brevity)
INSERT INTO lines (factory_id, line_code, line_name, line_type, line_leader_name, capacity_per_hour) VALUES
  ('550e8400-e29b-41d4-a716-446655440002', 'L-01', 'Sewing Line 01', 'SEWING', 'Anand', 55),
  ('550e8400-e29b-41d4-a716-446655440002', 'L-02', 'Sewing Line 02', 'SEWING', 'Bhavesh', 55),
  ('550e8400-e29b-41d4-a716-446655440002', 'L-03', 'Sewing Line 03', 'SEWING', 'Chandra', 50),
  ('550e8400-e29b-41d4-a716-446655440002', 'L-04', 'Sewing Line 04', 'SEWING', 'Dileep', 50),
  ('550e8400-e29b-41d4-a716-446655440002', 'L-05', 'Sewing Line 05', 'SEWING', 'Ezhil', 52),
  ('550e8400-e29b-41d4-a716-446655440002', 'L-06', 'Sewing Line 06', 'SEWING', 'Faisal', 52),
  ('550e8400-e29b-41d4-a716-446655440002', 'L-07', 'Sewing Line 07', 'SEWING', 'Girish', 48),
  ('550e8400-e29b-41d4-a716-446655440002', 'L-08', 'Sewing Line 08', 'SEWING', 'Hari', 48),
  ('550e8400-e29b-41d4-a716-446655440002', 'L-09', 'Sewing Line 09', 'SEWING', 'Inder', 50),
  ('550e8400-e29b-41d4-a716-446655440002', 'L-10', 'Sewing Line 10', 'SEWING', 'Jagan', 55),
  ('550e8400-e29b-41d4-a716-446655440002', 'L-11', 'Sewing Line 11', 'SEWING', 'Kiran', 50),
  ('550e8400-e29b-41d4-a716-446655440002', 'L-12', 'Sewing Line 12', 'SEWING', 'Lokesh', 45),
  ('550e8400-e29b-41d4-a716-446655440002', 'F-01', 'Finishing Line 01', 'FINISHING', 'Mahesh', 60),
  ('550e8400-e29b-41d4-a716-446655440002', 'F-02', 'Finishing Line 02', 'FINISHING', 'Naveen', 60),
  ('550e8400-e29b-41d4-a716-446655440002', 'F-03', 'Finishing Line 03', 'FINISHING', 'Omkar', 55),
  ('550e8400-e29b-41d4-a716-446655440002', 'F-04', 'Finishing Line 04', 'FINISHING', 'Prem', 55)
ON CONFLICT DO NOTHING;

-- ========================================
-- INSERT PRODUCTION PLANS (10 orders)
-- ========================================
INSERT INTO production_plans (factory_id, order_id, buyer_name, style, color, size_range, planned_qty, target_end_date, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'HM-2406-001', 'H&M', 'Slim Fit Denim', 'Dark Blue', 'XS-3XL', 5000, '2026-03-25', 'IN_PROGRESS'),
  ('550e8400-e29b-41d4-a716-446655440001', 'ZR-2406-002', 'Zara', 'Skinny Stretch', 'Medium Blue', 'XS-XXL', 3500, '2026-03-28', 'IN_PROGRESS'),
  ('550e8400-e29b-41d4-a716-446655440001', 'LV-2406-003', 'Levi''s', 'Cargo Denim', 'Black', 'S-XL', 2500, '2026-03-22', 'IN_PROGRESS'),
  ('550e8400-e29b-41d4-a716-446655440001', 'CK-2406-004', 'Calvin Klein', 'Jogger Denim', 'Light Blue', 'XS-L', 1800, '2026-03-30', 'NOT_STARTED'),
  ('550e8400-e29b-41d4-a716-446655440001', 'WG-2406-005', 'Wrangler', 'Straight Leg', 'Navy', 'M-XL', 4200, '2026-03-26', 'IN_PROGRESS'),
  ('550e8400-e29b-41d4-a716-446655440002', 'HM-2406-006', 'H&M', 'Bootcut Denim', 'Dark Blue', 'XS-XXL', 3200, '2026-03-27', 'IN_PROGRESS'),
  ('550e8400-e29b-41d4-a716-446655440002', 'ZR-2406-007', 'Zara', 'Relaxed Fit', 'Medium Blue', 'S-XL', 2800, '2026-03-29', 'IN_PROGRESS'),
  ('550e8400-e29b-41d4-a716-446655440003', 'LV-2406-008', 'Levi''s', 'Tapered Ankle', 'Black', 'XS-L', 2200, '2026-03-24', 'IN_PROGRESS'),
  ('550e8400-e29b-41d4-a716-446655440003', 'CK-2406-009', 'Calvin Klein', 'Premium Denim', 'Dark Indigo', 'M-XXL', 1600, '2026-03-31', 'NOT_STARTED'),
  ('550e8400-e29b-41d4-a716-446655440004', 'WG-2406-010', 'Wrangler', 'Vintage Denim', 'Light Wash', 'S-XL', 3800, '2026-03-28', 'IN_PROGRESS')
ON CONFLICT DO NOTHING;

-- ========================================
-- INSERT HOURLY PRODUCTION DATA (Sample for today)
-- ========================================
-- Sample hourly production for DP factory, L-01, HM-2406-001 order
INSERT INTO hourly_production (factory_id, line_id, production_plan_id, hour_slot, hour_index, produced_qty, passed_qty, defect_qty, date) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM lines WHERE factory_id = '550e8400-e29b-41d4-a716-446655440001' AND line_code = 'L-01'),
  (SELECT id FROM production_plans WHERE factory_id = '550e8400-e29b-41d4-a716-446655440001' AND order_id = 'HM-2406-001'),
  slot,
  idx,
  CASE WHEN idx < 8 THEN 45 + (RANDOM() * 10)::INT ELSE NULL END,
  CASE WHEN idx < 8 THEN 44 + (RANDOM() * 9)::INT ELSE NULL END,
  CASE WHEN idx < 8 THEN (RANDOM() * 2)::INT ELSE NULL END,
  CURRENT_DATE
FROM (
  VALUES 
    ('8-9AM', 0), ('9-10AM', 1), ('10-11AM', 2), ('11-12PM', 3),
    ('12-1PM', 4), ('1-2PM', 5), ('2-3PM', 6), ('3-4PM', 7),
    ('4-5PM', 8), ('5-6PM', 9), ('6-7PM', 10)
) AS t(slot, idx)
ON CONFLICT DO NOTHING;

-- ========================================
-- INSERT DOWNTIME DATA (Sample)
-- ========================================
INSERT INTO downtime (factory_id, line_id, start_time, end_time, duration_minutes, reason, created_by)
SELECT 
  '550e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM lines WHERE factory_id = '550e8400-e29b-41d4-a716-446655440001' AND line_code = 'L-03'),
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '1.5 hours',
  30,
  'MECHANICAL',
  'Kumar'
UNION ALL
SELECT 
  '550e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM lines WHERE factory_id = '550e8400-e29b-41d4-a716-446655440001' AND line_code = 'L-05'),
  NOW() - INTERVAL '4 hours',
  NOW() - INTERVAL '3.5 hours',
  30,
  'MATERIAL',
  'Suresh'
UNION ALL
SELECT 
  '550e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM lines WHERE factory_id = '550e8400-e29b-41d4-a716-446655440001' AND line_code = 'L-09'),
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '5.5 hours',
  30,
  'ELECTRICAL',
  'Mohan'
ON CONFLICT DO NOTHING;
