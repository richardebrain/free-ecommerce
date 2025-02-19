'use client'
import { useCommerceStore } from '@/contexts/storeProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import CheckoutForm from './CustomCheckout'

const Checkout = ({ clientSecret }: { clientSecret: string }) => {
  const router = useRouter()
  const { cart, removeFromCart } = useCommerceStore((store) => store)
  const products = cart?.data?.items!
  const subTotal = cart?.data?.total! || 0
  const total = subTotal + 5.0 + 53.4
  useEffect(() => {
    if (subTotal === 0) {
      router.push('/products')
    }
  }, [subTotal])

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-y-10 lg:grid-cols-5 lg:items-start lg:gap-x-12 xl:grid-cols-6 xl:gap-x-16">
            <div className="pt-6 lg:order-1 lg:col-span-3 xl:col-span-4">
              <CheckoutForm clientSecret={clientSecret} />
            </div>

            <div className="lg:sticky lg:top-6 lg:order-2 lg:col-span-2">
              <div className="overflow-hidden rounded bg-gray-50">
                <div className="px-4 py-6 sm:p-6 lg:p-8">
                  <h3 className="text-xl font-bold text-gray-900">
                    Order details
                  </h3>

                  <div className="mt-8 flow-root">
                    <ul className="-my-7 divide-y divide-gray-200">
                      {products?.map((product: any) => (
                        <li
                          className="flex items-stretch justify-between space-x-5 py-7"
                          key={product.id}
                        >
                          <div className="flex-shrink-0">
                            <img
                              className="h-16 w-16 rounded-lg object-cover"
                              src={product.image}
                              alt=""
                            />
                          </div>

                          <div className="ml-5 flex flex-1 flex-col justify-between">
                            <div className="flex-1">
                              <p className="text-base font-bold text-gray-900">
                                {product.name}{' '}
                                <span className="font-normal">
                                  ({product.quantity})
                                </span>
                              </p>
                              <p className="mt-1 text-sm font-medium capitalize text-gray-500">
                                {product.attributes.color}
                              </p>
                              <p className="mt-1 text-sm font-medium uppercase text-gray-500">
                                {product.attributes.size}
                              </p>
                            </div>
                            <p className="mt-2 text-sm font-bold text-gray-900">
                              {product?.price.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              })}
                            </p>
                          </div>

                          <div className="ml-auto">
                            <button
                              type="button"
                              className="-m-2 inline-flex rounded p-2 text-gray-400 transition-all duration-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                              onClick={() => removeFromCart(product.id)}
                            >
                              <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <hr className="mt-6 border-gray-200" />

                  <div className="mt-5 flow-root">
                    <div className="-my-5 divide-y divide-gray-200">
                      <div className="flex items-center justify-between py-5">
                        <p className="text-sm font-medium text-gray-600">
                          Subtotal
                        </p>
                        <p className="text-right text-sm font-medium text-gray-600">
                          {subTotal?.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          })}
                        </p>
                      </div>

                      <div className="flex items-center justify-between py-5">
                        <p className="text-sm font-medium text-gray-600">Tax</p>
                        <p className="text-right text-sm font-medium text-gray-600">
                          $53.40
                        </p>
                      </div>

                      <div className="flex items-center justify-between py-5">
                        <p className="text-sm font-medium text-gray-600">
                          Shipping
                        </p>
                        <p className="text-right text-sm font-medium text-gray-600">
                          $5.00
                        </p>
                      </div>

                      <div className="flex items-center justify-between py-5">
                        <p className="text-sm font-bold text-gray-900">Total</p>
                        <p className="text-right text-sm font-bold text-gray-900">
                          {total.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Checkout
