import Register from '@/components/auth/Register'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'

const RegisterPage = () => {
  return (
    <>
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Register />
      <Footer />
    </>
  )
}

export default RegisterPage
