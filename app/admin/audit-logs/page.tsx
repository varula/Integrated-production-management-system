'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getAuditLogs } from '@/lib/audit'
import { AppLayout } from '@/components/app-layout'
import { PageContainer, SectionHeader } from '@/components/shared'

interface AuditLogRecord {
  id: string
  user_id: string
  factory_id: string
  action: string
  table_name: string | null
  record_id: string | null
  old_values: Record<string, any> | null
  new_values: Record<string, any> | null
  created_at: string
  users: {
    email: string
    full_name: string | null
  } | null
}

export default function AuditLogsPage() {
  const { user, isAdmin } = useAuth()
  const [logs, setLogs] = useState<AuditLogRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN'>('all')

  useEffect(() => {
    if (!isAdmin || !user) return

    const loadLogs = async () => {
      try {
        const data = await getAuditLogs(user.factory_id, 500)
        const filtered = filter === 'all' ? data : data.filter((log: any) => log.action === filter)
        setLogs(filtered)
      } catch (err) {
        console.error('Error loading audit logs:', err)
      } finally {
        setLoading(false)
      }
    }

    loadLogs()
  }, [user, isAdmin, filter])

  if (!isAdmin) {
    return <AppLayout>Access denied</AppLayout>
  }

  return (
    <AppLayout>
      <PageContainer>
        <div className="space-y-6">
          <SectionHeader title="Audit Logs" description="Complete audit trail of all system operations" />

          {/* Filter */}
          <div className="flex gap-2">
            {['all', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'].map((action) => (
              <button
                key={action}
                onClick={() => setFilter(action as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === action
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {action === 'all' ? 'All Actions' : action}
              </button>
            ))}
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Table</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 text-sm">
                    <td className="px-6 py-3 text-gray-900 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {log.users?.email || 'System'}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          log.action === 'CREATE'
                            ? 'bg-green-50 text-green-700'
                            : log.action === 'UPDATE'
                            ? 'bg-blue-50 text-blue-700'
                            : log.action === 'DELETE'
                            ? 'bg-red-50 text-red-700'
                            : log.action === 'LOGIN'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {log.table_name || '-'}
                    </td>
                    <td className="px-6 py-3 text-gray-600 truncate max-w-xs">
                      {log.action === 'DELETE' && log.old_values
                        ? `Deleted: ${Object.keys(log.old_values).join(', ')}`
                        : log.action === 'UPDATE' && log.new_values
                        ? `Updated: ${Object.keys(log.new_values).join(', ')}`
                        : log.action === 'CREATE' && log.new_values
                        ? `Created: ${Object.keys(log.new_values).join(', ')}`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {logs.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-600">
              No audit logs found
            </div>
          )}
        </div>
      </PageContainer>
    </AppLayout>
  )
}
