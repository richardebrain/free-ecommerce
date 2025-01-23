import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import ProductList from '@/components/Store/ProductList'

const ProductPage = () => {
  return (
    <div>
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <ProductList />
      <Footer />
    </div>
  )
}

export default ProductPage
