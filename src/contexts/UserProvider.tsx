// src/providers/counter-store-provider.tsx
'use client'

import { createUserStore, type UserState } from '@/contexts/userStore'
import { createContext, useContext, useRef, type ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import { useStore, type StoreApi, type UseBoundStore } from 'zustand'

export type UseUserStoreApi = ReturnType<typeof createUserStore>

export const UserStoreContext = createContext<UseUserStoreApi | undefined>(
  undefined,
)

export interface UseUserStoreProps {
  children: ReactNode
}

export const UserStoreProvider = ({ children }: UseUserStoreProps) => {
  const storeRef = useRef<UseUserStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createUserStore()
  }

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
      <ToastContainer />
    </UserStoreContext.Provider>
  )
}

export const useUserStores = <T,>(selector: (store: UserState) => T): T => {
  const userStoreContext = useContext(UserStoreContext)

  if (!userStoreContext) {
    throw new Error(`useUserStore must be used within UserStore`)
  }

  return useStore(userStoreContext, selector)
}

