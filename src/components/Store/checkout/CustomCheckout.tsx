'use client'

import { Spinner } from '@/components/Spinner'
import {
  AddressElement,
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import {
  loadStripe,
  type StripeAddressElementOptions,
  type StripeElementsOptions,
  type StripePaymentElementOptions,
} from '@stripe/stripe-js'
import { useState } from 'react'

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: 'http://localhost:3000/checkout/success',
      },
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error?.message!)
    } else {
      setMessage('An unexpected error occurred.')
    }

    setIsLoading(false)
  }

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'accordion',
  }
  const addressElementOptions: StripeAddressElementOptions = {
    mode: 'shipping',

    fields: {
      phone: 'always',
    },
    validation: {
      phone: {
        required: 'always',
      },
    },
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="">
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <div className="my-4">
        <label htmlFor="" className="text-sm font-medium text-gray-600">
          {' '}
          Email address{' '}
        </label>
        <div className="mt-2">
          <input
            type="email"
            id=""
            name=""
            placeholder=""
            className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-normal text-gray-900 placeholder-gray-500 caret-gray-900 focus:border-gray-900 focus:ring-gray-900"
          />
        </div>
      </div>
      <AddressElement id="address-element" options={addressElementOptions} />

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-gray-900 px-6 py-4 text-sm font-bold text-white transition-all duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      >
        <span id="button-text">
          {isLoading ? <Spinner className='!mx-auto'/> : 'Pay now'}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message" className=' text-red-600 mt-2 text-sm '>{message}</div>}
    </form>
  )
}

export default function CheckoutForm({
  clientSecret,
}: {
  clientSecret: string
}) {
  const options: StripeElementsOptions = {
    appearance: { theme: 'stripe' },
    clientSecret,
  }
  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm />
    </Elements>
  )
}
