import { API_ENDPOINTS } from '@/framework/api-endpoints'
import { getToken } from '@/framework/get-token'
import {
  processRequestAuth,
  processRequestNoAuth,
  refreshUser,
} from '@/framework/http'
import { getResponseErrorMessage } from '@/utils/data.utils'
import { localStorageUtils } from '@/utils/localstorage'
import {
  isEmpty,
  type AddressModel,
  type BaseModel,
  type BaseModelDTO,
  type UserModel,
} from '@jaclight/dbsdk'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { createStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useUserStores } from './UserProvider'

export interface UserState {
  setStateItem: (item: { [key: string]: any }) => void
  isAuthorized?: () => boolean
  signIn: (
    username: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<BaseModel<UserModel>>
  signOut: () => Promise<void>
  signUp: (
    email: string,
    name: string,
    password: string,
    confirmPassword: string,
  ) => Promise<BaseModel<UserModel>>
  update: (user: UserModel) => Promise<BaseModel<UserModel>>
  forgotPassword: (email: string) => Promise<BaseModel<UserModel>>
  resetPassword: (
    password: string,
    confirmPassword: string,
    token: string,
  ) => Promise<BaseModel<UserModel>>
  magicLinkLogin: (
    email: string,
    token: string,
  ) => Promise<BaseModel<UserModel>>
  loginReturn: (
    customer: any,
    token: string,
    refreshToken: string,
  ) => Promise<BaseModel<UserModel>>
  getStateItem: (key: string) => any
  getUser: () => Promise<BaseModel<UserModel>>
  getLocalUser: () => BaseModel<UserModel>
  error?: any
  isLoading?: boolean
  timestamp?: number
  user?: BaseModel<UserModel>
  addresses?: BaseModelDTO<AddressModel>
}

export const createUserStore = () => {
  return createStore<UserState>()(
    devtools((set, get) => ({
      setStateItem: (item: { [key: string]: any }) =>
        set((state: any) => ({ ...item })),
      // getStateItem: (key: string) => get()[key],
      isAuthorized: () => {
        let { user } = get()
        if (!user) {
          const hasToken = getToken()
          return !!hasToken
        }
        return !!user
      },
      getLocalUser: () => {
        let user = get().user
        if (!user) {
          const userString = Cookies.get('customer')
          if (userString) {
            try {
              user = userString ? JSON.parse(userString) : null
            } catch (e) {
              set({ error: getResponseErrorMessage(e) })
              console.error('error', e)
            }
          }
        }
        return user
      },
      getUser: async (): Promise<BaseModel<UserModel>> => {
        let user = get().getLocalUser()
        if (!user) {
          const customerInfo: any = await refreshUser()
          user = customerInfo?.user
        }
        if (Array.isArray(user?.data?.image) && !isEmpty(user?.data?.image)) {
          user.data.imageUrl = user?.data?.image[0]?.url
        }
        set({ user })
        return user
      },
      update: async (user): Promise<BaseModel<UserModel> | undefined> => {
        set({ isLoading: true, error: undefined })
        const baseUser: any = await get().getUser()
        baseUser.data = { ...baseUser.data, ...user }
        try {
          const response = await processRequestAuth(
            'post',
            API_ENDPOINTS.UPDATE_USER,
            baseUser,
          )
          if (response.data) {
            Cookies.set('customer', JSON.stringify(response.data), {
              expires: 1 / 48,
            })
            set({ user: response.data, timestamp: Date.now() })
            return response.data
          }
        } catch (e) {
          console.log('error', e)
          set({ error: getResponseErrorMessage(e) })
        } finally {
          set({ isLoading: false })
        }
      },
      signIn: async (
        username: string,
        password: string,
        rememberMe = true,
      ): Promise<BaseModel<UserModel>| undefined> => {
        set({ isLoading: true, error: undefined })
        try {
          const response = await processRequestNoAuth(
            'post',
            API_ENDPOINTS.LOGIN_EMAIL_PASSWORD,
            { email: username, username, password, rememberMe },
          )
          if (response.customer && response.token) {
            return get().loginReturn(
              response.customer,
              response.token,
              response.refreshToken,
            )
          }
        } catch (e) {
          console.error('error', e)
          set({ error: getResponseErrorMessage(e) })
        } finally {
          set({ isLoading: false })
        }
      },
      signUp: async (
        email: string,
        name: string,
        password: string,
        confirmPassword: string,
      ): Promise<BaseModel<UserModel>| null> => {
        set({ isLoading: true, error: undefined })
        try {
          const response = await processRequestNoAuth(
            'post',
            API_ENDPOINTS.REGISTER,
            { email, password, confirmPassword, name },
          )
          if (response.customer) {
            return get().loginReturn(
              response.customer,
              response.token,
              response.refreshToken,
            )
          }
        } catch (e) {
          console.error('error', e)
          set({ error: getResponseErrorMessage(e) })
        } finally {
          set({ isLoading: false })
        }
        return null
      },
      signOut: async () => {
        set({ isLoading: true, error: undefined })

        const user = await get().getUser()
        const uid = user?.sk || ''
        try {
          const response = await processRequestNoAuth(
            'get',
            API_ENDPOINTS.LOGOUT + '/' + uid,
          )
        } catch (e) {
          console.error('error', e)
          set({ error: getResponseErrorMessage(e) })
        } finally {
          localStorageUtils.clear()
          Cookies.remove('auth_token')
          Cookies.remove('refresh_token')
          Cookies.remove('customer')
          set({ user: undefined, timestamp: Date.now() })
          set({ isLoading: false })
          window.location.href = '/'
        }
      },
      forgotPassword: async (email) => {
        set({ isLoading: true, error: undefined })
        try {
          return await processRequestNoAuth(
            'get',
            API_ENDPOINTS.FORGET_PASSWORD + '/' + email,
          )
        } catch (e) {
          console.error('error', e)
          set({ error: getResponseErrorMessage(e) })
        } finally {
          set({ isLoading: false })
        }
      },
      resetPassword: async (password, confirmPassword, token) => {
        set({ isLoading: true, error: undefined })
        try {
          return await processRequestNoAuth(
            'post',
            API_ENDPOINTS.RESET_PASSWORD,
            { password, confirmPassword, token },
          )
        } catch (e) {
          console.error('error', e)
          set({ error: getResponseErrorMessage(e) })
        } finally {
          set({ isLoading: false })
        }
      },
      magicLinkLogin: async (email, token) => {
        set({ isLoading: true, error: undefined })
        try {
          const response = await processRequestNoAuth(
            'post',
            API_ENDPOINTS.LOGIN_MAGICLINK + '/redirect',
            { email, token },
          )
          if (response.customer && response.token) {
            return get().loginReturn(
              response.customer,
              response.token,
              response.refreshToken,
            )
          }
        } catch (e) {
          console.error('error', e)
          set({ error: getResponseErrorMessage(e) })
        } finally {
          set({ isLoading: false })
        }
      },
      loginReturn: async (customer, token, refreshToken) => {
        if (customer && token) {
          Cookies.set('auth_token', token, { expires: 1 / 48 })
          Cookies.set('refresh_token', refreshToken, { expires: 1 })
          Cookies.set('customer', JSON.stringify(customer), { expires: 1 / 48 })
          set({ user: customer, timestamp: Date.now() })
          // closeModal();
          return customer
        }
      },
    })),
  )
}

export const useUser = () => {
  const { getUser } = useUserStores((state) => state)
  const [user, setUser] = useState<BaseModel<UserModel>>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      if (!user) {
        await loadUser()
        setLoading(false)
      } else {
        setLoading(false)
      }
    })()
  }, [getUser])

  const loadUser = async () => {
    const _user = await getUser()
    setUser(_user)
  }
  return { user, userLoading: loading }
}
