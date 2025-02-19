import { redirect } from 'next/navigation'

import SuccessClient from '@/components/Store/checkout/SuccessClient'
import { stripe } from '@/lib/stripe'

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent: string }>
}) {
  const { payment_intent: paymentIntentId } = await searchParams

  if (!paymentIntentId) redirect('/')

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

  if (!paymentIntent) redirect('/')

  const { status } = paymentIntent
  console.log('status', status)
  return (
    <SuccessClient
      paymentIntentId={paymentIntentId || ''}
      status={status || ''}
    />
  )
}
