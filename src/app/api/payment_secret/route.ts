import { API_ENDPOINTS } from '@/framework/api-endpoints'
import { getAppEngineClient } from '@/framework/appengine-client'
import { getRequestInfo } from '@/framework/log-request-helper'
import { stripe } from '@/lib/stripe'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const clientInfo = await getRequestInfo(req)
  const authorization =
    req.headers.get('authorization') || req.headers.get('Authorization')
  const query = req.nextUrl.searchParams
  const user = query.get('user')
  const queryString = query.toString()
  try {
    const cart = await getAppEngineClient().processRequest(
      'get',
      `${API_ENDPOINTS.CART_GET}/${user}`,
      {},
      authorization as string,
      queryString,
      clientInfo,
      false,
    )
    const subTotal = cart.data.total
    const total = subTotal + 53.4 + 5.0
    if (total) {
      const { client_secret: clientSecret } =
        await stripe.paymentIntents.create({
          amount: Math.floor(total * 100),
          currency: 'usd',
          automatic_payment_methods: {
            enabled: true,
          },
        })
      return new Response(clientSecret, { status: 200 })
    } else {
      return new Response('Empty cart', { status: 500 })
    }
  } catch (error) {
    console.error(error)
    return new Response('Error', { status: 500 })
  }
}

export async function POST(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

