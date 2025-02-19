import { siteConfig } from '@/framework/site-config'
import { isNotEmpty } from '@jaclight/dbsdk'
import  Cookies  from 'js-cookie'
import { API_ENDPOINTS } from './api-endpoints'
import { getRefreshToken, getToken } from './get-token'

let refreshingToken = false

// Cookie configuration
// export const authCookie = createCookie("auth_token", {
//     httpOnly: true,
//     sameSite: "lax",
//     path: "/",
//     secure: process.env.NODE_ENV === "production",
// });

// export const refreshCookie = createCookie("refresh_token", {
//     httpOnly: true,
//     sameSite: "lax",
//     path: "/",
//     secure: process.env.NODE_ENV === "production",
// });

// Helper to convert data and files into FormData
const convertToFormData = (data: any, files: File[] = []) => {
  const formData = new FormData()
  formData.append('data', JSON.stringify(data || {}))

  files.forEach((file, index) => {
    formData.append(`file${index}`, file)
  })

  return formData
}

// Helper function for requests without auth
const processRequestNoAuth = async (
  method: string,
  path: string,
  data?: any,
  files?: File[],
  headers: Record<string, string> = {},
): Promise<any> => {
  const url = `${siteConfig.siteURL}${path}`
  const options: any = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (isNotEmpty(files)) {
    options.body = convertToFormData(data, files)
    options.headers!['Content-Type'] = 'multipart/form-data'
  } else if (data) {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// Helper function for requests with auth
const processRequestAuth = async (
  method: string,
  path: string,
  data?: any,
  files?: File[],
  headers: Record<string, string> = {},
): Promise<any> => {
  const token = getToken()
  if (!token) {
    throw new Error('No valid token found')
  }

  const url = `${siteConfig.siteURL}${path}`
  const options: any = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...headers,
    },
  }

  if (isNotEmpty(files)) {
    options.body = convertToFormData(data, files)
    options.headers!['Content-Type'] = 'multipart/form-data'
  } else if (data) {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(url, options)

  // Handle 401 and token refresh
  if (response.status === 401 && !refreshingToken) {
    refreshingToken = true
    const refreshed = await refreshUser()
    refreshingToken = false

    if (refreshed) {
      return processRequestAuth(method, path, data, files, headers)
    } else {
      throw new Error('Failed to refresh token')
    }
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// Refresh token logic
const refreshUser = async () => {
  console.log('token expired, refreshing token')
  try {
    if (getRefreshToken()) {
      refreshingToken = true
      const tResponse: any = await processRequestNoAuth(
        'post',
        API_ENDPOINTS.REFRESH_TOKEN,
        { refresh_token: getRefreshToken() },
      )
      if (tResponse) {
        Cookies.set('auth_token', tResponse.token, { expires: 1 / 48 })
        Cookies.set('customer', JSON.stringify(tResponse.user), {
          expires: 1 / 48,
        })
        return tResponse
      } else {
        Cookies.remove('refresh_token')
        Cookies.remove('auth_token')
        Cookies.remove('customer')
      }
    }
  } finally {
    refreshingToken = false
  }
  return null
}

export {
  convertToFormData,
  processRequestAuth,
  processRequestNoAuth,
  refreshUser,
}
