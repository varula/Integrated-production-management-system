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
  factory: Factory | null
  setSelectedFactory: (factory: Factory) => void
  loading: boolean
}

const FactoryContext = createContext<FactoryContextType | undefined>(undefined)

const FACTORY_COLORS: Record<string, { initial: string; color: string; fullName: string }> = {
  'AA': { initial: 'AA', color: 'bg-green-100 text-green-700', fullName: 'Armana Apparels / Fashions Ltd' },
  'ZA': { initial: 'ZA', color: 'bg-blue-100 text-blue-700', fullName: 'Zyta Apparels Ltd' },
  'DE': { initial: 'DE', color: 'bg-purple-100 text-purple-700', fullName: 'Denimach Ltd' },
  'DT': { initial: 'DT', color: 'bg-amber-100 text-amber-700', fullName: 'Denitex Ltd' },
}

function createFactoriesWithUI(data: any[]): Factory[] {
  return (data || []).map((f: any) => {
    const colors = FACTORY_COLORS[f.code] || { initial: f.code, color: 'bg-gray-100 text-gray-700', fullName: f.name }
    return {
      ...f,
      userInitial: colors.initial,
      userColor: colors.color,
      userFull: colors.fullName,
    }
  })
}

export function FactoryProvider({ children }: { children: ReactNode }) {
  const [factories, setFactories] = useState<Factory[]>([])
  const [selectedFactory, setSelectedFactory] = useState<Factory | null>(null)
  const [loading, setLoading] = useState(true)

  const DEFAULTS = [
    { id: 'f1', code: 'AA', name: 'Armana Apparels / Fashions Ltd', location: 'Tejgaon Industrial Area, Dhaka' },
    { id: 'f2', code: 'ZA', name: 'Zyta Apparels Ltd', location: 'Mirpur, Dhaka' },
    { id: 'f3', code: 'DE', name: 'Denimach Ltd', location: 'Sreepur, Gazipur' },
    { id: 'f4', code: 'DT', name: 'Denitex Ltd', location: 'Savar, Dhaka' },
  ]

  useEffect(() => {
    const hasRealEnv = import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.startsWith('https://xyzxyz')

    if (!hasRealEnv) {
      const factoriesWithUI = createFactoriesWithUI(DEFAULTS)
      setFactories(factoriesWithUI)
      setSelectedFactory(factoriesWithUI[0])
      setLoading(false)
      return
    }

    const loadFactories = async () => {
      try {
        const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
        const query = supabase.from('factories').select('*').order('code')
        const { data, error } = await Promise.race([query, timeout]) as any

        if (error || !data || data.length === 0) {
          throw new Error(error?.message || 'No data')
        }

        const factoriesWithUI = createFactoriesWithUI(data)
        setFactories(factoriesWithUI)
        setSelectedFactory(factoriesWithUI[0])
      } catch (error) {
        console.warn('[SmartGarment] Using fallback factory data:', error)
        const factoriesWithUI = createFactoriesWithUI(DEFAULTS)
        setFactories(factoriesWithUI)
        setSelectedFactory(factoriesWithUI[0])
      } finally {
        setLoading(false)
      }
    }

    loadFactories()
  }, [])

  return (
    <FactoryContext.Provider value={{ factories, selectedFactory, factory: selectedFactory, setSelectedFactory, loading }}>
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
