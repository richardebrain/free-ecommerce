// src/providers/counter-store-provider.tsx
'use client'

import { type ReactNode, createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

import { createCommerceStore, type StoreType } from '@/contexts/stores'

export type CommerceStoreApi = ReturnType<typeof createCommerceStore>

export const CommerceStoreContext = createContext<CommerceStoreApi | undefined>(
  undefined,
)

export interface CommercestoreProps {
  children: ReactNode
}

export const CommerceStoreProvider = ({ children }: CommercestoreProps) => {
  const storeRef = useRef<CommerceStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createCommerceStore()
  }

  return (
    <CommerceStoreContext.Provider value={storeRef.current}>
      {children}
    </CommerceStoreContext.Provider>
  )
}

export const useCommerceStore = <T,>(selector: (store: StoreType) => T): T => {
  const commerceStoreContext = useContext(CommerceStoreContext)

  if (!commerceStoreContext) {
    throw new Error(`useCommerceStore must be used within Commercestore`)
  }

  return useStore(commerceStoreContext, selector)
}
