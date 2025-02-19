import { getAppEngineClient } from '@/framework/appengine-client'
import { appEndpoints } from '@jaclight/dbsdk'
import ProductDetails from '../clients/ProductDetails'

const ProductDetailsServer = async ({ productId }: { productId: string }) => {
  const productDetails = await getAppEngineClient().processRequest(
    'get',
    `${appEndpoints.product.path}/${productId}`,
  )
  if (!productDetails) {
    return <div>Product not found</div>
  }
  return <ProductDetails productDetails={productDetails} />
}

export default ProductDetailsServer
