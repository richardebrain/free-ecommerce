import { getAppEngineClient } from '@/framework/appengine-client'
import { appEndpoints } from '@jaclight/dbsdk'
import ProductClientList from '../clients/ProductClientList'

export default async function ProductList() {
  const producs = await getAppEngineClient().processRequest(
    'get',
    appEndpoints.products.path,
  )

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
        <ProductClientList products={producs} />
      </div>
    </div>
  )
}
