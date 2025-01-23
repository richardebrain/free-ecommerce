import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import ProductDetails from '@/components/Store/ProductDetails'
import { Container } from '@/components/container'
const ProductDetailsPage = () => {
  return (
    <div>
      <GradientBackground />
            <Container>
              <Navbar />
            </Container>
      <ProductDetails />
      <Footer/>
    </div>
  )
}

export default ProductDetailsPage
