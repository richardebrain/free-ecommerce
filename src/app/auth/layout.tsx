'use client'
import { useUser } from '@/contexts/userStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser()
  const router = useRouter()
  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user])
  return <>{children}</>
}

export default Layout
