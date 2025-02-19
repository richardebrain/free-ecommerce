'use client'
import { useUserStores } from '@/contexts/UserProvider'

const Register = () => {
  const { signUp } = useUserStores((state) => state)
  const handleSignUp = (e) => {
    e.preventDefault()
    signUp(
      'richardebrain20@gmail.com',
      'richard adebayo',
      '12345678',
      '12345678',
    )
  }
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-sm">
          <div className="text-center">
            <img
              className="mx-auto h-12 w-auto"
              src="https://websitemint.appmint.io/favicon.ico"
              alt=""
            />
            <h1 className="mt-12 text-3xl font-bold text-gray-900">
              Create free account
            </h1>
            <p className="mt-4 text-sm font-medium text-gray-500">
              Appmint Free E-commerce
            </p>
          </div>

          <div className="mt-12">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold leading-5 text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <img
                className="mr-2 h-5 w-5"
                src="https://landingfoliocom.imgix.net/store/collection/clarity-dashboard/images/previews/sign-in/1/google-logo.svg"
                alt=""
              />
              Sign up with Google
            </button>
          </div>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-gray-400"> or </span>
            </div>
          </div>

          <form action="#" method="POST" className="mt-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="" className="text-sm font-bold text-gray-900">
                  {' '}
                  Email{' '}
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    name=""
                    id=""
                    placeholder="Email address"
                    value=""
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-500 caret-indigo-600 focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="" className="text-sm font-bold text-gray-900">
                  {' '}
                  Username{' '}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name=""
                    id=""
                    placeholder="Email address"
                    value=""
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-500 caret-indigo-600 focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="" className="text-sm font-bold text-gray-900">
                  {' '}
                  Password{' '}
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    name=""
                    id=""
                    placeholder="Password (min. 8 character)"
                    value=""
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-500 caret-indigo-600 focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="flex h-5 items-center">
                  <input
                    type="checkbox"
                    name="remember-password"
                    id="remember-password"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>

                <div className="ml-3">
                  <label
                    htmlFor="remember-password"
                    className="text-sm font-medium text-gray-900"
                  >
                    {' '}
                    I agree to the{' '}
                    <a
                      href="#"
                      title=""
                      className="text-indigo-600 hover:underline"
                    >
                      Terms & Conditions
                    </a>{' '}
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  onClick={handleSignUp}
                  className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-sm font-semibold leading-5 text-white transition-all duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                >
                  Sign up
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-medium text-gray-900">
              Already have an account?{' '}
              <a
                href="/auth/login"
                title=""
                className="font-bold hover:underline"
              >
                {' '}
                Login now{' '}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register
