'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from './supabase'

interface User {
  id: string
  email: string
  factory_id: string
  role: 'admin' | 'manager' | 'operator' | 'viewer'
  full_name: string | null
}

interface AuthContextType {
  user: User | null
  session: any | null
  loading: boolean
  error: string | null
  login: (email: string, password: string, factory_id: string) => Promise<void>
  logout: () => Promise<void>
  isAdmin: boolean
  isManager: boolean
  isOperator: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for demo admin mode first
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
        if (storedUser) {
          const demoUser = JSON.parse(storedUser)
          setUser(demoUser)
          setLoading(false)
          return
        }

        const { data: { session: currentSession } } = await supabase.auth.getSession()
        setSession(currentSession)
        
        if (currentSession) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentSession.user.id)
            .single()
          
          if (error) throw error
          setUser(data)
        }
      } catch (err: any) {
        console.error('[v0] Auth initialization error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession)
      if (newSession?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', newSession.user.id)
          .single()
        setUser(data)
      } else {
        setUser(null)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const login = async (email: string, password: string, factory_id: string) => {
    try {
      setError(null)
      const { data: { user: authUser }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (authError) throw authError
      if (!authUser) throw new Error('Login failed')

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .eq('factory_id', factory_id)
        .single()

      if (userError) throw new Error('User not found in this factory')
      if (!userData.is_active) throw new Error('User account is inactive')

      setUser(userData)
      
      await supabase.from('audit_logs').insert({
        user_id: authUser.id,
        factory_id,
        action: 'LOGIN',
      })
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      if (user) {
        // If demo mode, just clear localStorage
        if (user.id === 'demo-admin-001') {
          localStorage.removeItem('user')
          setUser(null)
          return
        }

        // Otherwise use Supabase
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          factory_id: user.factory_id,
          action: 'LOGOUT',
        })
      }
      await supabase.auth.signOut()
      setUser(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        error,
        login,
        logout,
        isAdmin: user?.role === 'admin',
        isManager: user?.role === 'manager',
        isOperator: user?.role === 'operator',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
