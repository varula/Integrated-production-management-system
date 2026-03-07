"use client"

import React, { createContext, useContext, useState } from "react"
import { factories, defaultFactory, type FactoryDef } from "@/lib/factories"

interface FactoryContextValue {
  active: FactoryDef
  setActive: (f: FactoryDef) => void
  all: FactoryDef[]
}

const FactoryContext = createContext<FactoryContextValue>({
  active: defaultFactory,
  setActive: () => {},
  all: factories,
})

export function FactoryProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<FactoryDef>(defaultFactory)
  return (
    <FactoryContext.Provider value={{ active, setActive, all: factories }}>
      {children}
    </FactoryContext.Provider>
  )
}

export function useFactory() {
  return useContext(FactoryContext)
}
