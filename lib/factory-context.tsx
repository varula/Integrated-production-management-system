'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { supabase } from './supabase'

export interface Factory {
  id: string
  name: string
  code: string
  location: string
  userInitial?: string
  userColor?: string
  userFull?: string
}

interface FactoryContextType {
  factories: Factory[]
  selectedFactory: Factory | null
  setSelectedFactory: (factory: Factory) => void
  loading: boolean
}

const FactoryContext = createContext<FactoryContextType | undefined>(undefined)

const FACTORY_COLORS: Record<string, { initial: string; color: string; fullName: string }> = {
  'DP': { initial: 'DP', color: 'bg-green-100 text-green-700', fullName: 'Dhanaperumal Textiles' },
  'AB': { initial: 'AB', color: 'bg-blue-100 text-blue-700', fullName: 'Abhiram Industries' },
  'MK': { initial: 'MK', color: 'bg-purple-100 text-purple-700', fullName: 'Mallikarjun Garments' },
  'VS': { initial: 'VS', color: 'bg-amber-100 text-amber-700', fullName: 'Vishwa Apparel Co.' },
}

export function FactoryProvider({ children }: { children: ReactNode }) {
  const [factories, setFactories] = useState<Factory[]>([])
  const [selectedFactory, setSelectedFactory] = useState<Factory | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFactories = async () => {
      try {
        const { data, error } = await supabase
          .from('factories')
          .select('*')
          .order('code')

        if (error) throw error

        const factoriesWithUI = (data || []).map((f: any) => {
          const colors = FACTORY_COLORS[f.code] || { initial: f.code, color: 'bg-gray-100 text-gray-700', fullName: f.name }
          return {
            ...f,
            userInitial: colors.initial,
            userColor: colors.color,
            userFull: colors.fullName,
          }
        })

        setFactories(factoriesWithUI)
        
        // Set first factory as default
        if (factoriesWithUI.length > 0) {
          setSelectedFactory(factoriesWithUI[0])
        }
      } catch (error) {
        console.error('Failed to load factories:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFactories()
  }, [])

  return (
    <FactoryContext.Provider value={{ factories, selectedFactory, setSelectedFactory, loading }}>
      {children}
    </FactoryContext.Provider>
  )
}

export function useFactory() {
  const context = useContext(FactoryContext)
  if (!context) {
    throw new Error('useFactory must be used within FactoryProvider')
  }
  return context
}
