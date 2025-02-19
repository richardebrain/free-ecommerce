'use client'

import { useCommerceStore } from '@/contexts/storeProvider'
import { formatCurrency } from '@/utils/convert-currency'
import { generateCartItem } from '@/utils/generate-cart-item'
import product from '@/utils/products/product-details.json'
import type { productTypes } from '@/utils/types'
import { Radio, RadioGroup } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import {
  CurrencyDollarIcon,
  GlobeAmericasIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useUser } from '@/contexts/userStore'

const policies = [
  {
    name: 'International delivery',
    icon: GlobeAmericasIcon,
    description: 'Get your order in 2 years',
  },
  {
    name: 'Loyalty rewards',
    icon: CurrencyDollarIcon,
    description: "Don't look at other tees",
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetails({
  productDetails,
}: {
  productDetails: productTypes
}) {
  const {user } = useUser()
  // console.log(productDetails)
  const color = productDetails?.data?.attributes.find(
    (attr) => attr.name.toLowerCase() === 'color',
  )
  const sizes = productDetails?.data?.attributes.find(
    (attr) => attr.name.toLowerCase() === 'size',
  )
  // console.log(color, 'color')
  const [selectedColor, setSelectedColor] = useState(color?.options[0]!)
  const [selectedSize, setSelectedSize] = useState(sizes?.options[0]!)
  const [quantity, setQuantity] = useState(1)
  const { addToCart: addItemToCart, initializeCart } = useCommerceStore(
    (store) => store,
  )
  const images = productDetails?.data?.images

  const addToCart = () => {
    if(!user) {
      toast.error('Please login to add to cart')
      return
    }
    if (!productDetails.name) {
      return
    }
    initializeCart()
    // return
    const formattedProduct = {
      ...productDetails.data,
      name: productDetails.name,
      sk: productDetails.sk,
    }
    // console.log(productDetails, 'productDetails')
    const item = generateCartItem(formattedProduct, {
      color: selectedColor.value,
      size: selectedSize.value,
    })
    addItemToCart(item, quantity)
    toast.success('Product added to cart', {
      toastId: 'add-to-cart',
    })
  }
  return (
    <div className="bg-white">
      <div className="pb-16 pt-6 sm:pb-24">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <ol role="list" className="flex items-center space-x-4">
            {product.breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a
                    href={breadcrumb.href}
                    className="mr-4 text-sm font-medium text-gray-900"
                  >
                    {breadcrumb.name}
                  </a>
                  <svg
                    viewBox="0 0 6 20"
                    aria-hidden="true"
                    className="h-5 w-auto text-gray-300"
                  >
                    <path
                      d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <a
                href={`/product/${productDetails?.data?.slug}`}
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {productDetails?.name}
              </a>
            </li>
          </ol>
        </nav>
        <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="flex justify-between">
                <h1 className="text-xl font-medium text-gray-900">
                  {productDetails?.name}
                </h1>
                <p className="text-xl font-medium text-gray-900">
                  {formatCurrency(productDetails?.data?.price, 'USD')}
                </p>
              </div>
              {/* Reviews */}
              <div className="mt-4">
                <h2 className="sr-only">Reviews</h2>
                <div className="flex items-center">
                  <p className="text-sm text-gray-700">
                    {product.rating}
                    <span className="sr-only"> out of 5 stars</span>
                  </p>
                  <div className="ml-1 flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        aria-hidden="true"
                        className={classNames(
                          product.rating > rating
                            ? 'text-yellow-400'
                            : 'text-gray-200',
                          'size-5 shrink-0',
                        )}
                      />
                    ))}
                  </div>
                  <div
                    aria-hidden="true"
                    className="ml-4 text-sm text-gray-300"
                  >
                    ·
                  </div>
                  <div className="ml-4 flex">
                    <a
                      href="#"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      See all {product.reviewCount} reviews
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Image gallery */}
            <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
              <h2 className="sr-only">Images</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
                {Array.isArray(images) ? (
                  images.map((image, index) => (
                    <img
                      key={image.path}
                      alt={productDetails?.name}
                      src={image.url}
                      className={classNames(
                        image.url === images[0].url
                          ? 'w-full lg:col-span-2 lg:row-span-2'
                          : 'hidden lg:block',
                        'rounded-lg',
                      )}
                    />
                  ))
                ) : (
                  <img
                    key={product.images[0].imageSrc}
                    alt={productDetails?.name}
                    src={product.images[0].imageSrc}
                    className={classNames(
                      product.images[0].primary
                        ? 'lg:col-span-2 lg:row-span-2'
                        : 'hidden lg:block',
                      'rounded-lg',
                    )}
                  />
                )}
              </div>
            </div>

            <div className="mt-8 lg:col-span-5">
              <form>
                {/* Color picker */}
                <div>
                  <h2 className="text-sm font-medium text-gray-900">Color</h2>

                  <fieldset aria-label="Choose a color" className="mt-2">
                    <RadioGroup
                      value={selectedColor}
                      onChange={setSelectedColor}
                      className="flex items-center gap-x-3"
                    >
                      {color?.options.map((color) => (
                        <Radio
                          key={color.value}
                          value={color}
                          aria-label={color.label}
                          className={classNames(
                            `ring-${color?.value}-900`,
                            //  `ring-yellow-900`,
                            'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none data-[checked]:ring-2 data-[focus]:data-[checked]:ring data-[focus]:data-[checked]:ring-offset-1',
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              `bg-${color?.value!}-500`,
                              //  "bg-green-500",
                              'size-8 rounded-full border border-black/10',
                            )}
                          />
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </div>

                {/* Size picker */}
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-gray-900">Size</h2>
                    <a
                      href="#"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      See sizing chart
                    </a>
                  </div>

                  <fieldset aria-label="Choose a size" className="mt-2">
                    <RadioGroup
                      value={selectedSize}
                      onChange={setSelectedSize}
                      className="grid grid-cols-3 gap-3 sm:grid-cols-6"
                    >
                      {sizes?.options.map((size) => (
                        <Radio
                          key={size.value}
                          value={size!}
                          disabled={!product.sizes[0].inStock}
                          className={classNames(
                            product.sizes[0].inStock
                              ? 'cursor-pointer focus:outline-none'
                              : 'cursor-not-allowed opacity-25',
                            'flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-3 text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 data-[checked]:border-transparent data-[checked]:bg-indigo-600 data-[checked]:text-white data-[focus]:ring-2 data-[focus]:ring-indigo-500 data-[focus]:ring-offset-2 data-[checked]:hover:bg-indigo-700 sm:flex-1',
                          )}
                        >
                          {size.value}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </div>

                <button
                  type="button"
                  onClick={addToCart}
                  className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add to cart
                </button>
              </form>

              {/* Product details */}
              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">
                  Description
                </h2>

                <div
                  dangerouslySetInnerHTML={{
                    __html: productDetails?.data.description,
                  }}
                  className="mt-4 space-y-4 text-sm/6 text-gray-500"
                />
              </div>

              <div className="mt-8 border-t border-gray-200 pt-8">
                <h2 className="text-sm font-medium text-gray-900">
                  Fabric &amp; Care
                </h2>

                <div className="mt-4">
                  <ul
                    role="list"
                    className="list-disc space-y-1 pl-5 text-sm/6 text-gray-500 marker:text-gray-300"
                  >
                    {product.details.map((item) => (
                      <li key={item} className="pl-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Policies */}
              <section aria-labelledby="policies-heading" className="mt-10">
                <h2 id="policies-heading" className="sr-only">
                  Our Policies
                </h2>

                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {policies.map((policy) => (
                    <div
                      key={policy.name}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center"
                    >
                      <dt>
                        <policy.icon
                          aria-hidden="true"
                          className="mx-auto size-6 shrink-0 text-gray-400"
                        />
                        <span className="mt-4 text-sm font-medium text-gray-900">
                          {policy.name}
                        </span>
                      </dt>
                      <dd className="mt-1 text-sm text-gray-500">
                        {policy.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
