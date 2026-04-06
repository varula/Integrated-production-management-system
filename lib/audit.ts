export type AuditAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'

export interface AuditLog {
  user_id: string
  factory_id: string
  action: AuditAction
  table_name?: string
  record_id?: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
}

export async function logAudit(log: AuditLog, ip_address?: string, user_agent?: string) {
  try {
    // Demo mode - log to console instead of database
    console.log('[v0] Audit:', { ...log, ip_address, user_agent })
  } catch (err) {
    console.error('[v0] Audit log failed:', err)
  }
}

export async function logCreate(
  user_id: string,
  factory_id: string,
  table_name: string,
  record_id: string,
  new_values: Record<string, any>
) {
  return logAudit({
    user_id,
    factory_id,
    action: 'CREATE',
    table_name,
    record_id,
    new_values,
  })
}

export async function logUpdate(
  user_id: string,
  factory_id: string,
  table_name: string,
  record_id: string,
  old_values: Record<string, any>,
  new_values: Record<string, any>
) {
  return logAudit({
    user_id,
    factory_id,
    action: 'UPDATE',
    table_name,
    record_id,
    old_values,
    new_values,
  })
}

export async function logDelete(
  user_id: string,
  factory_id: string,
  table_name: string,
  record_id: string,
  old_values: Record<string, any>
) {
  return logAudit({
    user_id,
    factory_id,
    action: 'DELETE',
    table_name,
    record_id,
    old_values,
  })
}

export async function getAuditLogs(factory_id: string, limit: number = 100) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*, users(email, full_name)')
    .eq('factory_id', factory_id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[v0] Fetch audit logs error:', error)
    return []
  }

  return data || []
}
