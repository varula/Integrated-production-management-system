'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
        // Check for demo admin mode from localStorage
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
        if (storedUser) {
          const demoUser = JSON.parse(storedUser)
          setUser(demoUser)
        }
      } catch (err: any) {
        console.error('[v0] Auth initialization error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string, factory_id: string) => {
    try {
      setError(null)
      // Demo mode - store user in localStorage
      const demoUser: User = {
        id: 'demo-user-' + Date.now(),
        email,
        factory_id,
        role: 'admin',
        full_name: 'Demo User',
      }
      localStorage.setItem('user', JSON.stringify(demoUser))
      setUser(demoUser)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem('user')
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
