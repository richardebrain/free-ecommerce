import { useRouter } from 'next/navigation'

const useRoute = () => {
  const router = useRouter()
  return {
    router,
  }
}

export default useRoute
