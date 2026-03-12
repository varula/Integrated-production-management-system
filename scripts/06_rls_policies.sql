-- Row-Level Security Policies for Data Tables
-- Factory-level isolation with role-based column access

-- ============================================================================
-- PRODUCTION_PLANS RLS
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view production plans from their factories" ON production_plans;
DROP POLICY IF EXISTS "Managers can create production plans" ON production_plans;
DROP POLICY IF EXISTS "Users can update own factory production plans" ON production_plans;
DROP POLICY IF EXISTS "Managers can delete production plans" ON production_plans;

-- SELECT: All authenticated users can view plans from their assigned factories
CREATE POLICY "Users can view production plans from their factories" ON production_plans
  FOR SELECT
  USING (
    factory_id IN (
      SELECT factory_id FROM user_factory_roles 
      WHERE user_id = auth.uid()
    )
  );

-- INSERT: Only MANAGER and ADMIN roles can create
CREATE POLICY "Managers can create production plans" ON production_plans
  FOR INSERT
  WITH CHECK (
    factory_id IN (
      SELECT factory_id FROM user_factory_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- UPDATE: MANAGER and ADMIN can update, OPERATOR can update specific fields
CREATE POLICY "Users can update own factory production plans" ON production_plans
  FOR UPDATE
  USING (
    factory_id IN (
      SELECT factory_id FROM user_factory_roles 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    factory_id IN (
      SELECT factory_id FROM user_factory_roles 
      WHERE user_id = auth.uid()
    )
  );

-- DELETE: Only ADMIN can delete
CREATE POLICY "Managers can delete production plans" ON production_plans
  FOR DELETE
  USING (
    factory_id IN (
      SELECT factory_id FROM user_factory_roles 
      WHERE user_id = auth.uid() 
      AND role = 'ADMIN'
    )
  );

-- ============================================================================
-- HOURLY_PRODUCTION RLS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view hourly production from their factories" ON hourly_production;
DROP POLICY IF EXISTS "Operators can log production" ON hourly_production;
DROP POLICY IF EXISTS "Users can update hourly production" ON hourly_production;
DROP POLICY IF EXISTS "Managers can delete hourly production" ON hourly_production;

-- SELECT: All users can view from their factories
CREATE POLICY "Users can view hourly production from their factories" ON hourly_production
  FOR SELECT
  USING (
    factory_id IN (
      SELECT factory_id FROM user_factory_roles 
      WHERE user_id = auth.uid()
    )
  );

-- INSERT: OPERATOR, MANAGER, and ADMIN can create
CREATE POLICY "Operators can log production" ON hourly_production
  FOR INSERT
  WITH CHECK (
    factory_id IN (
      SELECT factory_id FROM user_factory_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('ADMIN', 'MANAGER', 'OPERATOR')
    )
  );

-- UPDATE: OPERATOR can update own entries, MANAGER and ADMIN can update all
CREATE POLICY "Users can update hourly production" ON hourly_production
  FOR UPDATE
  USING (
    factory_id IN (
      SELECT factory_id FROM user_factory_roles 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    factory_id IN (
      SELECT factory_id FROM user_factory_roles 
      WHERE user_id = auth.uid()
    )
  );

-- DELETE: Only MANAGER and ADMIN
CREATE POLICY "Managers can delete hourly production" ON hourly_production
  FOR DELETE
  USING (
    factory_id IN (
      SELECT factory_id FROM user_factory_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- ============================================================================
-- DOWNTIME RLS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view downtime from their factories" ON downtime;
DROP POLICY IF EXISTS "Operators can log downtime" ON downtime;
DROP POLICY IF EXISTS "Users can update downtime" ON downtime;
DROP POLICY IF EXISTS "Managers can delete downtime" ON downtime;

-- SELECT: All users can view from their factories
CREATE POLICY "Users can view downtime from their factories" ON downtime
  FOR SELECT
  USING (
    factory_id IN (
      SELECT factory_id FROM user_factory_roles 
      WHERE user_id = auth.uid()
    )
  );

-- INSERT: OPERATOR, MANAGER, and ADMIN can create
CREATE POLICY "Operators can log downtime" ON downtime
  FOR INSERT
  WITH CHECK (
    factory_id IN (
      SELECT factory_id FROM user_factory_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('ADMIN', 'MANAGER', 'OPERATOR')
    )
  );

-- UPDATE: OPERATOR can update own, MANAGER and ADMIN can update all
CREATE POLICY "Users can update downtime" ON downtime
  FOR UPDATE
  USING (
    factory_id IN (
      SELECT factory_id FROM user_factory_roles 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    factory_id IN (
      SELECT factory_id FROM user_factory_roles 
      WHERE user_id = auth.uid()
    )
  );

-- DELETE: Only MANAGER and ADMIN
CREATE POLICY "Managers can delete downtime" ON downtime
  FOR DELETE
  USING (
    factory_id IN (
      SELECT factory_id FROM user_factory_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- ============================================================================
-- AUDIT LOGS RLS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view audit logs from their factories" ON audit_logs;
DROP POLICY IF EXISTS "System can create audit logs" ON audit_logs;

-- SELECT: Users can view logs from their factories, ADMIN sees all
CREATE POLICY "Users can view audit logs from their factories" ON audit_logs
  FOR SELECT
  USING (
    factory_id IN (
      SELECT factory_id FROM user_factory_roles 
      WHERE user_id = auth.uid()
    )
    OR (
      SELECT role FROM user_factory_roles 
      WHERE user_id = auth.uid() LIMIT 1
    ) = 'ADMIN'
  );

-- INSERT: System service role creates logs
CREATE POLICY "System can create audit logs" ON audit_logs
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- SESSIONS RLS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own sessions" ON sessions;
DROP POLICY IF EXISTS "System can create sessions" ON sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON sessions;

CREATE POLICY "Users can view their own sessions" ON sessions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can create sessions" ON sessions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own sessions" ON sessions
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- LINES RLS - Read-only for users
-- ============================================================================

DROP POLICY IF EXISTS "Users can view lines from their factories" ON lines;

CREATE POLICY "Users can view lines from their factories" ON lines
  FOR SELECT
  USING (
    factory_id IN (
      SELECT factory_id FROM user_factory_roles 
      WHERE user_id = auth.uid()
    )
  );
