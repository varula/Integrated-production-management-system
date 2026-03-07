"use client"

import React, { createContext, useContext, useState } from "react"
import { factories, defaultFactory, type FactoryConfig } from "@/lib/factories"

interface FactoryContextValue {
  factory: FactoryConfig
  setFactory: (id: string) => void
  allFactories: FactoryConfig[]
}

const FactoryContext = createContext<FactoryContextValue>({
  factory: defaultFactory,
  setFactory: () => {},
  allFactories: factories,
})

export function FactoryProvider({ children }: { children: React.ReactNode }) {
  const [currentId, setCurrentId] = useState(defaultFactory.id)
  const factory = factories.find((f) => f.id === currentId) ?? defaultFactory

  return (
    <FactoryContext.Provider
      value={{
        factory,
        setFactory: (id) => setCurrentId(id),
        allFactories: factories,
      }}
    >
      {children}
    </FactoryContext.Provider>
  )
}

export function useFactory() {
  return useContext(FactoryContext)
}
