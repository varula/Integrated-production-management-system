'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { AppLayout } from '@/components/app-layout'
import { PageContainer, SectionHeader } from '@/components/shared'

interface UserRecord {
  id: string
  email: string
  full_name: string | null
  factory_id: string
  role: 'admin' | 'manager' | 'operator' | 'viewer'
  is_active: boolean
  last_login: string | null
  created_at: string
}

export default function UsersPage() {
  const { user, isAdmin } = useAuth()
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [factories, setFactories] = useState<any[]>([])

  useEffect(() => {
    if (!isAdmin) return

    const loadData = async () => {
      try {
        // Load factories
        const { data: factoriesData } = await supabase.from('factories').select('*')
        setFactories(factoriesData || [])

        // Load users for current factory
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*')
          .eq('factory_id', user?.factory_id)
          .order('created_at', { ascending: false })

        if (usersError) throw usersError
        setUsers(usersData || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, isAdmin])

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !currentStatus })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(u => 
        u.id === userId ? { ...u, is_active: !currentStatus } : u
      ))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole as any } : u
      ))
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (!isAdmin) {
    return <AppLayout>Access denied</AppLayout>
  }

  return (
    <AppLayout>
      <PageContainer>
        <div className="space-y-6">
          <SectionHeader title="User Management" description="Manage factory users and permissions" />

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Last Login</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.full_name || '-'}</td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded bg-white"
                      >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="operator">Operator</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          u.is_active
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleUserStatus(u.id, u.is_active)}
                        className="text-sm px-3 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageContainer>
    </AppLayout>
  )
}
