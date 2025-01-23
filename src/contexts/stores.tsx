import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

export type StoreState = {
  cart: {
    id: number
    name: string
    price: number
    imageSrc: string
    imageAlt: string
    attributes: {
      color: string
      size: string
    }
    quantity?: number
    productKey?: string
    amount?: number
  }[]
}

export type storeActions = {
  addToCart: (product: {
    id: number
    name: string
    price: number
    imageSrc: string
    imageAlt: string
    attributes: {
      color: string
      size: string
    }
    quantity?: number
    productKey?: string
  }) => void
  removeFromCart: (productKey: string) => void
  removeAllFromCart: () => void
  updateQuantity: (productKey: string, quantity: number) => void
}
export type StoreType = StoreState & storeActions

const defatultState: StoreState = {
  cart: [],
}
export const createCommerceStore = (initState: StoreState = defatultState) => {
  return createStore<StoreType>()(
    persist(
      (set, get) => ({
        ...initState,
        addToCart: (product) =>
          set((state) => {
            const productKey = `${product.id}-${product.attributes.color.toLowerCase()}-${product.attributes.size.toLowerCase()}`
            const existingProduct = state.cart.find(
              (item) => item.productKey === productKey,
            )
            if (existingProduct) {
              return {
                cart: state.cart.map((item) =>
                  item.productKey === productKey
                    ? {
                        ...item,
                        quantity: (item?.quantity || 1) + 1,
                        amount: item.price * ((item?.quantity || 1) + 1),
                      }
                    : item,
                ),
              }
            } else {
              return {
                cart: [
                  ...state.cart,
                  {
                    ...product,
                    quantity: 1,
                    productKey,
                    amount: product.price,
                  },
                ],
              }
            }
          }),
        removeFromCart(productkey) {
          set((state) => ({
            cart: state.cart.filter(
              (product) => product.productKey !== productkey,
            ),
          }))
        },
        removeAllFromCart: () => set({ cart: [] }),
        updateQuantity: (productKey, quantity) => {
          set((state) => ({
            cart: state.cart.map((product) =>
              product.productKey === productKey
                ? {
                    ...product,
                    quantity,
                    amount: product.price * quantity,
                  }
                : product,
            ),
          }))
        },
      }),
      {
        name: 'commerce-store',
        storage: createJSONStorage(() => sessionStorage),
        version: 1,
      },
    ),
  )
}
