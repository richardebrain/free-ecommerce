import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import CartContent from '@/components/Store/cartContent'
import { Container } from '@/components/container'
const CartPage = () => {
  return (
    <div>
      <GradientBackground />
      <Container>
        <Navbar />
      <CartContent />
      </Container>
      <Footer />
    </div>
  )
}

export default CartPage
