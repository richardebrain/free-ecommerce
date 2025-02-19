'use client'

import { useCommerceStore } from '@/contexts/storeProvider'
import type { Item } from '@/contexts/stores'
import { useUser } from '@/contexts/userStore'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { ShoppingCartIcon } from '@heroicons/react/16/solid'
import { Bars2Icon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from './link'
import { PlusGrid, PlusGridItem, PlusGridRow } from './plus-grid'
import Cart from './Store/product_cart'
import UserDropdown from './UserDropDown'

const links = [
  { href: '/products', label: 'Products' },
  // { href: '/product-details', label: 'Product Details' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/company', label: 'Company' },
  { href: '/blog', label: 'Blog' },
  { href: '/auth/login', label: 'Login' },
]

function DesktopNav({ user }: { user: any }) {
  return (
    <nav className="relative hidden lg:flex">
      {links.map(({ href, label }) => {
        if (href === '/auth/login' || href === '/auth/signup') {
          if (user) {
            return
          } else {
            return (
              <Link
                href={href}
                key={href}
                className="flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply data-[hover]:bg-black/[2.5%]"
              >
                {label}
              </Link>
            )
          }
        }
        return (
          <PlusGridItem key={href} className="relative flex">
            <Link
              href={href}
              className="flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply data-[hover]:bg-black/[2.5%]"
            >
              {label}
            </Link>
          </PlusGridItem>
        )
      })}
    </nav>
  )
}

function MobileNavButton() {
  return (
    <DisclosureButton
      className="flex size-12 items-center justify-center self-center rounded-lg data-[hover]:bg-black/5 lg:hidden"
      aria-label="Open main menu"
    >
      <Bars2Icon className="size-6" />
    </DisclosureButton>
  )
}

function MobileNav({ user }: { user?: any }) {
  return (
    <DisclosurePanel className="lg:hidden">
      <motion.div className="flex flex-col gap-6 py-4">
        {links.map(({ href, label }, linkIndex) => {
          if (href === '/auth/login' || href === '/auth/signup') {
            if (user) {
              return
            } else {
              return (
                <motion.div
                  initial={{ opacity: 0, rotateX: -90 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  transition={{
                    duration: 0.15,
                    ease: 'easeInOut',
                    rotateX: { duration: 0.3, delay: linkIndex * 0.1 },
                  }}
                  key={href}
                >
                  <Link
                    href={href}
                    key={href}
                    className="text-base font-medium text-gray-950"
                  >
                    {label}
                  </Link>
                </motion.div>
              )
            }
          }
          return (
            <motion.div
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{
                duration: 0.15,
                ease: 'easeInOut',
                rotateX: { duration: 0.3, delay: linkIndex * 0.1 },
              }}
              key={href}
            >
              <Link href={href} className="text-base font-medium text-gray-950">
                {label}
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
      <div className="absolute left-1/2 w-screen -translate-x-1/2">
        <div className="absolute inset-x-0 top-0 border-t border-black/5" />
        <div className="absolute inset-x-0 top-2 border-t border-black/5" />
      </div>
    </DisclosurePanel>
  )
}

export function Navbar({ banner }: { banner?: React.ReactNode }) {
  const { user, userLoading } = useUser()

  return (
    <Disclosure as="header" className="pt-12 sm:pt-16">
      <PlusGrid>
        <PlusGridRow className="relative flex justify-between overflow-hidden">
          <div className="relative flex gap-6">
            <PlusGridItem className="py-3">
              <Link href="/" title="Home">
                <img
                  src="https://websitemint.appmint.io/favicon.ico"
                  alt=""
                  className="size-6"
                />
                {/* <Logo className="h-9" /> */}
              </Link>
            </PlusGridItem>
            {banner && (
              <div className="relative hidden items-center py-3 lg:flex">
                {banner}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 px-5">
            <DesktopNav user={user} />
            <MobileNavButton />
            <div className="flex items-center justify-center gap-3">
              {user && <UserDropdown user={user} />}
              <div className="">
                <CartIcon />
              </div>
            </div>
          </div>
        </PlusGridRow>
      </PlusGrid>
      <MobileNav />
    </Disclosure>
  )
}

export const CartIcon = () => {
  const { cart, initializeCart } = useCommerceStore((state) => state)
  const { user } = useUser()
  const cartItems = cart?.data?.items! as Item[]
  const cartLength =
    (cartItems &&
      cartItems.reduce((acc, product) => acc + product.quantity!, 0)) ||
    0
  const [showCart, setShowCart] = useState(false)
  const userName = user?.data?.name
  useEffect(() => {
    let cart = initializeCart()
  }, [userName])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true) // Mark the component as hydrated
  }, [])
  // if (!hydrated) {
  //   return <span suppressHydrationWarning></span> // Avoid hydration mismatch
  // }
  return (
    <div className="self-center">
      <PlusGridItem className="relative flex">
        <button
          className="relative hidden items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply data-[hover]:bg-black/[2.5%] lg:flex"
          onClick={() => setShowCart(!showCart)}
        >
          <ShoppingCartIcon className="mr-2 h-5 w-5" />
          <span className="absolute bottom-1 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {!hydrated ? 0 : cartLength}
          </span>
        </button>
      </PlusGridItem>
      <Link
        href="/cart"
        className="text-base font-medium text-gray-950 lg:hidden"
      >
        <div className="relative w-fit">
          <ShoppingCartIcon className="mr-2 h-5 w-5" />
          <span className="absolute -bottom-3 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {!hydrated ? 0 : cartLength}
          </span>
        </div>
      </Link>
      <Cart showCart={showCart} setShowCart={setShowCart} />
    </div>
  )
}
