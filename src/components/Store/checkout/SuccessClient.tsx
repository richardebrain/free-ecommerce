'use client'

import { useCommerceStore } from '@/contexts/storeProvider'
import { isNotEmpty } from '@jaclight/dbsdk'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const SuccessClient = ({
  paymentIntentId,
  status,
}: {
  paymentIntentId: string
  status: string
}) => {
  const { checkoutCart, initializeCart, clearCart } = useCommerceStore(
    (state) => state,
  )
  const router = useRouter()

  const [emptyCart, setEmptyCart] = useState(false)

  useEffect(() => {
    ;(async () => {
      const cart = await initializeCart()
      if (!cart) {
        return
      }
      const {
        items,
        total,
        shippingAddress,
        name,
        billingAddress,
        paymentRef,
        checkoutInfo,
        discounts,
      } = cart.data
      if (isNotEmpty(items)) {
        const input = {
          items,
          total: total + 53.4 + 5.0,
          shippingAddress,
          name,
          billingAddress,
          discounts,
          paymentRef,
          ...checkoutInfo,
          cartId: cart?.sk,
          transaction: {
            captureInfo: {},
            gateway: 'paymentGateway',
          },
        }
        const order = await checkoutCart(input)
        console.log('order', order)
        // return
        if (order) {
          await clearCart()
          // window.location.href = '/products'
          //   window.location.href = `/store/order?ordernumber=${order.data.number}&email=${order.data.email}`
        }
      } else {
        setEmptyCart(true)
      }
    })()
  }, [status])
  return (
    <div id="payment-status">
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          {/* <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" /> */}
          <h2 className="mt-4 text-2xl font-semibold">Payment Successful!</h2>
          <p className="mt-2 text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          <p className="mt-2 text-gray-600">
            Your payment reference is: {paymentIntentId}
          </p>

          <button
            onClick={() => router.push('/')}
            className="mt-6 rounded-lg bg-green-600 px-6 py-2 text-white transition hover:bg-green-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessClient
