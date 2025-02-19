import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { stripe } from '@/lib/stripe'

const endpointSecret =
  'whsec_f7f597f447834d3eb56a73b6f3d81c26c228cd143cb1b5481d032df4ce518452'

export async function POST(req: NextRequest) {
  let event

  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      (await headers()).get('stripe-signature')!,
      endpointSecret,
      // process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    const errorMessage = err.message
    // On error, log and return the error message.
    if (err) console.log(err)
    console.log(`Error message: ${errorMessage}`)
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    )
  }

  const permittedEvents = ['payment_intent.succeeded']

  if (permittedEvents.includes(event.type)) {
    let data

    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          data = event.data.object
          console.log(`Payment status: ${data.status}`)
          break
        case 'payment_intent.payment_failed':
          data = event.data.object
          console.log(`Payment failed:`)
          break
        case 'payment_intent.canceled':
          data = event.data.object
          console.log(`Payment canceled:`)
          break
        case 'payment_intent.created':
          data = event.data.object
          console.log(`Payment created:heehe`, data)
          break
        case 'charge.succeeded':
          data = event.data.object
          console.log(`Charge succeeded:`, data)
          break
        case 'charge.failed':
          data = event.data.object
          console.log(`Charge failed:`, data)
          break
        default:
          throw new Error(`Unhandled event: ${event.type}`)
      }
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { message: 'Webhook handler failed' },
        { status: 500 },
      )
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: 'Received' }, { status: 200 })
}
