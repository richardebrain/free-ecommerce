'use client'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Spinner } from '@/components/Spinner'
import Checkout from '@/components/Store/checkout/Checkout'
import { useUser } from '@/contexts/userStore'
import { processRequestAuth } from '@/framework/http'
import { useEffect, useState } from 'react'

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState('')
  const { user, userLoading } = useUser()

  const handleStripePayment = async () => {
    const clientSecret = await processRequestAuth(
      'get',
      `/api/payment_secret?user=${user?.data?.email}`,
    )
    if (clientSecret) {
      setClientSecret(clientSecret)
    }
  }
  useEffect(() => {
    if (user) {
      handleStripePayment()
    }
  }, [user])

  return (
    <div>
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      {/* <CheckoutForm clientSecret={clientSecret} /> */}
      {!clientSecret || userLoading ? (
        <div className="flex h-screen items-center justify-center">
          <Spinner className="mx-auto size-[200px]" />
        </div>
      ) : (
        <Checkout clientSecret={clientSecret} />
      )}
      {/* <ProductList /> */}
      <Footer />
    </div>
  )
}

export default CheckoutPage
