'use client'
import { useCommerceStore } from '@/contexts/storeProvider'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
  const { cart } = useCommerceStore((state) => state)
  const router = useRouter()
  useEffect(() => {
    console.log('cart', cart)
    if (!cart || cart?.data?.items! == 0) {
      router.push('/products')
    }
  }, [])
  return <>{children}</>
}

export default CheckoutLayout
