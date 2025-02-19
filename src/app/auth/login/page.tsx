import Login from '@/components/auth/Login'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'

const LoginPage = () => {
  return (
    <>
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Login />
      <Footer />
    </>
  )
}

export default LoginPage
