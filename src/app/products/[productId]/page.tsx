import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import ProductDetails from '@/components/Store/ProductDetails'
const ProductPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>
}) => {
  const productid = (await params).productId
  return (
    <div>
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <ProductDetails />
      <Footer />
    </div>
  )
}

export default ProductPage
