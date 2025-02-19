import { API_ENDPOINTS } from '@/framework/api-endpoints'
import { processRequestAuth, processRequestNoAuth } from '@/framework/http'
import {
  addItemWithQuantity,
  removeItem,
  updateQuantity,
} from '@/utils/cart.utils'
import { getResponseErrorMessage } from '@/utils/data.utils'
import { localStorageUtils } from '@/utils/localstorage'
import { type BaseModel, type SFCartModel } from '@jaclight/dbsdk'
import { produce } from 'immer'
import { devtools } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'
import { UserStoreContext, useUserStores } from './UserProvider'
import { createUserStore } from './userStore'

export interface Item {
  id: string | number
  price: number
  quantity?: number
  [key: string]: any
  name: string
}

export type StoreState = {
  cart?: BaseModel<SFCartModel>
  isLoading: boolean
  error?: string
}

export interface CheckoutInputType {
  items: any
  total: any
  author: any
  paymentRef: any
  shippingAddress: any
  billingAddress: any
  email: any
  status: any
  paymentGateway: any
}

export type storeActions = {
  addToCart: (
    product: {
      id: string
      name: string
      price: number
      image: string
      [key: string]: any

      quantity?: number
    },
    quantity: number,
  ) => void
  removeFromCart: (productKey: string) => void
  removeAllFromCart: () => void
  updateQuantity: (productKey: string, quantity: number) => void
  saveCart: (cart?: BaseModel<SFCartModel>) => void
  saveCartAfterWait: () => void
  request: (
    method: string,
    path: string,
    data: any,
    auth: boolean,
  ) => Promise<any>
  initializeCart: () => any
  checkoutCart: (input: CheckoutInputType) => Promise<any>
  clearCart: () => void
}
export type StoreType = StoreState & storeActions

const defaultState: StoreState = {
  isLoading: false,
  // cart: {
  //   data: {
  //     items: [],
  //     totalItems: 0,
  //     total: 0,
  //     totalUniqueItems: 0,
  //   },
  // } as any,
}
export const createCommerceStore = (initState: StoreState = defaultState) => {
  return createStore<StoreType>()(
    devtools((set, get) => {
      const savedState = localStorageUtils.get('free-commerce')
      if (savedState) {
        initState = {
          ...initState,
          cart: savedState,
        }
      } else {
        initState = defaultState
      }
      return {
        ...initState,
        initializeCart: async () => {
          const { cart } = get()
          if (cart?.data) return cart
          const localCart = localStorageUtils.get('free-commerce')
          if (localCart) {
            set({ cart: localCart })
            return localCart
          }
          console.log('no cart')
          const user = await createUserStore().getState().getUser()
          console.log(user, 'user ')
          if (user) {
            const url = API_ENDPOINTS.CART_GET + `/${user.data?.email}/${''}`
            const rt = await get().request('get', url, null, !!user)
            if (rt.error) {
              console.error(
                'error saving cart to server,  ' +
                  getResponseErrorMessage(rt.error),
              )
            } else {
              let localCart = localStorageUtils.get('free-commerce')

              if (localCart && !localCart?.author) {
                localCart.data.items.forEach((item: Item) => {
                  rt.data.items = addItemWithQuantity(
                    rt.data.items,
                    item,
                    item.quantity!,
                  )
                })
                await get().saveCart(rt)
              }
              set({ cart: rt })
              return rt
            }
          }
          // const newCart = createBaseData(
          //   DataType.sf_cart,
          //   {},
          //   user?.data?.email || '',
          // )
          // set({ cart: newCart })
          // return newCart
        },
        addToCart: (product, quantity) => {
          const oldCart = get().cart || get().initializeCart()
          let cart = produce(oldCart, (draftState) => {
            // console.log(oldCart, 'old cart')
            const items = addItemWithQuantity(
              (oldCart?.data?.items as Item[]) || [],
              product,
              quantity,
            )
            draftState!.data!.items = items
            draftState!.data!.totalItems = items.reduce(
              (acc, curr) => acc + curr.quantity!,
              0,
            )
            draftState!.data!.total = items?.reduce(
              (acc, item) => acc + item.price * item?.quantity!,
              0,
            )
            draftState!.data!.totalUniqueItems = items.length
          })
          get().saveCart(cart!)
        },
        updateQuantity: (productKey, quantity) => {
          const oldCart = get().cart || get().initializeCart()
          let cart = produce(oldCart, (draftState) => {
            // console.log(oldCart, 'old cart')

            const items = updateQuantity(
              (oldCart?.data?.items as Item[]) || [],
              productKey,
              quantity,
            )
            draftState!.data!.items = items
            draftState!.data!.totalItems = items.reduce(
              (acc, curr) => acc + curr.quantity!,
              0,
            )
            draftState!.data!.total = items?.reduce(
              (acc, item) => acc + item.price * item?.quantity!,
              0,
            )
            draftState!.data!.totalUniqueItems = items.length
          })
          get().saveCart(cart!)
        },
        removeFromCart: (productkey: string) => {
          let oldCart = get().cart!

          const cart = produce(oldCart, (draftState) => {
            const items = removeItem(oldCart!.data!.items as Item[], productkey)
            draftState!.data!.items = items
            draftState!.data!.totalItems = items?.length
            draftState!.data!.total = items!.reduce(
              (acc, item) => acc + item.price * item?.quantity!,
              0,
            )
          })
          get().saveCart(cart)
        },
        saveCart: (cart?) => {
          if (!cart) {
            cart = get().cart
          } else {
            const clonedCart = JSON.parse(JSON.stringify(cart))

            set({ cart: clonedCart })
          }

          localStorageUtils.set('free-commerce', cart)

          get().saveCartAfterWait()
        },
        saveCartAfterWait: async () => {
          const user = createUserStore().getState().getLocalUser()
          if (!user) return
          const cart = get().cart
          const url = API_ENDPOINTS.CART_UPDATE + `/${cart?.sk}`
          await get()
            .request('post', url, cart, false)
            .then((res) => {
              set({ cart: res })
            })
            .catch((e) => {
              console.error(e)
              console.error(getResponseErrorMessage(e))
            })
        },

        removeAllItemFromCart: (id: Item['id']) => {
          const cart = produce(get().cart, (draftState) => {
            const items: any[] = draftState!.data!.items!.filter(
              (item: any) => item.id !== id,
            )
            draftState!.data!.items = items
            draftState!.data!.totalItems = items.length
            draftState!.data!.totalUniqueItems = items.length
            draftState!.data!.total = items?.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0,
            )
          })
          get().saveCart(cart)
        },
        checkoutCart: async (input: CheckoutInputType) => {
          return await get().request(
            'post',
            API_ENDPOINTS.CHECKOUT_CART,
            input,
            true,
          )
        },
        clearCart: async () => {
          const cart = get().cart
          localStorageUtils.remove('free-commerce')
          set({ cart: null })
          if (cart?.sk) {
            await get().request(
              'get',
              API_ENDPOINTS.CART_CLEAR + `/${cart?.sk}`,
              '',
              false,
            )
          }
        },
        request: async (method, path, data, auth = true) => {
          set({ isLoading: true, error: undefined })
          try {
            const process = auth ? processRequestAuth : processRequestNoAuth
            const response = await process(method, path, data)
            return response
          } catch (e) {
            // useSiteStore
            //   .getState()
            //   .showNotice(getResponseErrorMessage(e), 'error')
            set({ error: getResponseErrorMessage(e) })
            return { error: e }
          } finally {
            set({ isLoading: false })
          }
        },
      }
    }),
  )
}
