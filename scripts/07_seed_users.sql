-- ============================================================================
-- SEED DEMO USERS & TEST DATA
-- ============================================================================

-- NOTE: Users must be created via Supabase Auth first, then linked in this table
-- This assumes the following auth users exist:
-- admin@smartgarment.com (password: Demo@123)
-- manager@smartgarment.com (password: Demo@123)
-- operator@smartgarment.com (password: Demo@123)

-- Insert demo users (with placeholder UUIDs - should match auth.users ids)
INSERT INTO public.users (id, email, factory_id, role, full_name, is_active) VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 'admin@smartgarment.com', '550e8400-e29b-41d4-a716-446655440001'::uuid, 'admin', 'Admin User', true),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'manager@smartgarment.com', '550e8400-e29b-41d4-a716-446655440002'::uuid, 'manager', 'Manager User', true),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'operator@smartgarment.com', '550e8400-e29b-41d4-a716-446655440001'::uuid, 'operator', 'Operator User', true)
ON CONFLICT (id) DO NOTHING;

-- Insert multi-factory role assignments
INSERT INTO public.user_factory_roles (user_id, factory_id, role) VALUES
  -- Admin has access to all factories
  ('00000000-0000-0000-0000-000000000001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'admin'),
  ('00000000-0000-0000-0000-000000000001'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'admin'),
  ('00000000-0000-0000-0000-000000000001'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid, 'admin'),
  ('00000000-0000-0000-0000-000000000001'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, 'admin'),
  -- Manager for ZA factory
  ('00000000-0000-0000-0000-000000000002'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'manager'),
  -- Operator for AA factory
  ('00000000-0000-0000-0000-000000000003'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'operator')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- NOTE: To actually create these users in Supabase Auth, run:
-- ============================================================================
-- curl -X POST 'https://YOUR_PROJECT.supabase.co/auth/v1/admin/users' \
--   -H "apikey: YOUR_API_KEY" \
--   -H "Content-Type: application/json" \
--   -d '{
--     "email": "admin@smartgarment.com",
--     "password": "Demo@123",
--     "user_metadata": {"full_name": "Admin User"}
--   }'
