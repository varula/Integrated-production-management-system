-- ============================================================================
-- AUTHENTICATION & AUTHORIZATION SCHEMA
-- ============================================================================

-- Create ENUM types for roles
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'operator', 'viewer');
CREATE TYPE audit_action AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT');

-- Create users table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  factory_id UUID NOT NULL REFERENCES public.factories(id),
  role user_role DEFAULT 'viewer' NOT NULL,
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user_roles junction table for multi-factory access
CREATE TABLE IF NOT EXISTS public.user_factory_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  factory_id UUID NOT NULL REFERENCES public.factories(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, factory_id)
);

-- Create sessions table for session tracking
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  factory_id UUID NOT NULL REFERENCES public.factories(id),
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create audit_logs table for tracking all operations
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  factory_id UUID NOT NULL REFERENCES public.factories(id),
  action audit_action NOT NULL,
  table_name VARCHAR(255),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_factory ON public.users(factory_id);
CREATE INDEX IF NOT EXISTS idx_user_factory_roles_user ON public.user_factory_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_factory_roles_factory ON public.user_factory_roles(factory_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_factory ON public.sessions(factory_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_factory ON public.audit_logs(factory_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record ON public.audit_logs(table_name, record_id);

-- Enable RLS on new tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_factory_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy for users table - users can only see their own record
CREATE POLICY users_select_own ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_update_own ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policy for user_factory_roles - users can see roles for their own factories
CREATE POLICY user_factory_roles_select ON public.user_factory_roles
  FOR SELECT USING (
    user_id = auth.uid() OR 
    factory_id IN (
      SELECT factory_id FROM public.user_factory_roles WHERE user_id = auth.uid()
    )
  );

-- RLS Policy for sessions - users can only see their own sessions
CREATE POLICY sessions_select_own ON public.sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY sessions_insert_own ON public.sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY sessions_update_own ON public.sessions
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policy for audit_logs - users can see audit logs from their factories
CREATE POLICY audit_logs_select_factory ON public.audit_logs
  FOR SELECT USING (
    factory_id IN (
      SELECT factory_id FROM public.user_factory_roles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY audit_logs_insert ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- Update RLS policies for existing tables to enforce factory-level isolation
-- production_plans table
DROP POLICY IF EXISTS "Enable read access for all" ON public.production_plans;
CREATE POLICY production_plans_select ON public.production_plans
  FOR SELECT USING (
    factory_id IN (
      SELECT factory_id FROM public.user_factory_roles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY production_plans_insert ON public.production_plans
  FOR INSERT WITH CHECK (
    factory_id IN (
      SELECT factory_id FROM public.user_factory_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY production_plans_update ON public.production_plans
  FOR UPDATE USING (
    factory_id IN (
      SELECT factory_id FROM public.user_factory_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY production_plans_delete ON public.production_plans
  FOR DELETE USING (
    factory_id IN (
      SELECT factory_id FROM public.user_factory_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- hourly_production table
DROP POLICY IF EXISTS "Enable read access for all" ON public.hourly_production;
DROP POLICY IF EXISTS "Enable update for all" ON public.hourly_production;
DROP POLICY IF EXISTS "Enable insert for all" ON public.hourly_production;

CREATE POLICY hourly_production_select ON public.hourly_production
  FOR SELECT USING (
    factory_id IN (
      SELECT factory_id FROM public.user_factory_roles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY hourly_production_insert ON public.hourly_production
  FOR INSERT WITH CHECK (
    factory_id IN (
      SELECT factory_id FROM public.user_factory_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'operator')
    )
  );

CREATE POLICY hourly_production_update ON public.hourly_production
  FOR UPDATE USING (
    factory_id IN (
      SELECT factory_id FROM public.user_factory_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'operator')
    )
  );

CREATE POLICY hourly_production_delete ON public.hourly_production
  FOR DELETE USING (
    factory_id IN (
      SELECT factory_id FROM public.user_factory_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- downtime table
DROP POLICY IF EXISTS "Enable insert for all" ON public.downtime;
DROP POLICY IF EXISTS "Enable update for all" ON public.downtime;
DROP POLICY IF EXISTS "Enable read access for all" ON public.downtime;

CREATE POLICY downtime_select ON public.downtime
  FOR SELECT USING (
    factory_id IN (
      SELECT factory_id FROM public.user_factory_roles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY downtime_insert ON public.downtime
  FOR INSERT WITH CHECK (
    factory_id IN (
      SELECT factory_id FROM public.user_factory_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'operator')
    )
  );

CREATE POLICY downtime_update ON public.downtime
  FOR UPDATE USING (
    factory_id IN (
      SELECT factory_id FROM public.user_factory_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY downtime_delete ON public.downtime
  FOR DELETE USING (
    factory_id IN (
      SELECT factory_id FROM public.user_factory_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
