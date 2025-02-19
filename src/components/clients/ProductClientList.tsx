'use client'

import { formatCurrency } from '@/utils/convert-currency'
import type { productTypes } from '@/utils/types'
import Link from 'next/link'

const ProductClientList = ({
  products,
}: {
  products: { data: productTypes[] }
}) => {
  console.log(products, 'products')
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {products.data.map((product) => (
        <Link
          key={product.sk}
          href={`/products/${product.data.slug ?? '2222'}`}
          className="group"
        >
          <img
            alt={product.name}
            src={
              Array.isArray(product?.data?.images) &&
              product?.data?.images.length > 0
                ? product?.data?.images[0]?.url
                : 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-03.jpg'
            }
            className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
          />
          <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
          <p className="mt-1 text-lg font-medium text-gray-900">
            {formatCurrency(product?.data?.price as number, 'USD')}
          </p>
        </Link>
      ))}
    </div>
  )
}

export default ProductClientList
