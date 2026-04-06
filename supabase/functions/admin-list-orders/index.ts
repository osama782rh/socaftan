import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const allowedStatuses = new Set([
  'pending',
  'paid',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'returned',
  'cancelled',
])

const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase()

const getAdminEmails = () => {
  const blocked = new Set(['osama.rahim@outlook.fr'])
  const defaults = ['contact@socaftan.fr', 'sara.ltr@outlook.fr']
  const configured = (Deno.env.get('ADMIN_EMAILS') || '')
    .split(',')
    .map(normalizeEmail)
    .filter((email) => email && !blocked.has(email))

  return new Set([...defaults, ...configured])
}

const extractBearerTokens = (header: string | null): string[] => {
  if (!header) return []

  const matches = [...header.matchAll(/Bearer\s+([^,\s]+)/gi)]
    .map((match) => match[1])
    .filter(Boolean)

  return [...new Set(matches)]
}

const errorResponse = (status: number, message: string) =>
  new Response(
    JSON.stringify({ error: message }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status },
  )

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return errorResponse(405, 'Methode non autorisee.')
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      return errorResponse(500, 'Secrets Supabase manquants.')
    }

    const payload = await req.json().catch(() => ({}))
    const bodyToken = typeof payload?.accessToken === 'string' ? payload.accessToken.trim() : ''
    const authHeader = req.headers.get('Authorization')
    const candidateTokens = [
      ...(bodyToken ? [bodyToken] : []),
      ...extractBearerTokens(authHeader),
    ]
    const uniqueTokens = [...new Set(candidateTokens)]

    if (uniqueTokens.length === 0) {
      return errorResponse(401, 'Session invalide.')
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey)
    let authenticatedUser: any = null

    for (const token of uniqueTokens) {
      const { data: authData, error: authError } = await serviceClient.auth.getUser(token)
      if (!authError && authData?.user) {
        authenticatedUser = authData.user
        break
      }
    }

    if (!authenticatedUser) {
      return errorResponse(401, 'Session invalide.')
    }

    const requesterEmail = normalizeEmail(authenticatedUser.email || '')
    const adminEmails = getAdminEmails()
    if (!adminEmails.has(requesterEmail)) {
      return errorResponse(403, 'Acces refuse.')
    }

    const requestedStatus = typeof payload?.status === 'string' ? payload.status.trim() : ''
    if (requestedStatus && !allowedStatuses.has(requestedStatus)) {
      return errorResponse(400, 'Statut invalide.')
    }

    const rawLimit = Number(payload?.limit)
    const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(200, Math.round(rawLimit))) : 100

    let ordersQuery = serviceClient
      .from('orders')
      .select('id, user_id, order_number, status, order_type, subtotal, deposit_amount, total, delivery_method, delivery_address, delivery_city, delivery_postal_code, notes, stripe_session_id, stripe_payment_intent, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (requestedStatus) {
      ordersQuery = ordersQuery.eq('status', requestedStatus)
    }

    const { data: orders, error: ordersError } = await ordersQuery

    if (ordersError) {
      console.error('admin-list-orders ordersError:', ordersError)
      return errorResponse(400, `Impossible de recuperer les commandes: ${ordersError.message}`)
    }

    const orderList = Array.isArray(orders) ? orders : []
    const orderIds = [...new Set(orderList.map((order: any) => order.id).filter(Boolean))]
    const userIds = [...new Set(orderList.map((order: any) => order.user_id).filter(Boolean))]

    let profilesById = new Map<string, any>()
    let emailsByUserId = new Map<string, string>()
    if (userIds.length > 0) {
      const { data: profiles, error: profilesError } = await serviceClient
        .from('profiles')
        .select('id, first_name, last_name, phone')
        .in('id', userIds)

      if (profilesError) {
        console.warn('admin-list-orders profiles warning:', profilesError.message)
      } else {
        profilesById = new Map((profiles || []).map((profile: any) => [profile.id, profile]))
      }

      // Fetch emails via admin API (parallel, max 20 concurrent)
      const emailFetches = userIds.map(async (uid: string) => {
        try {
          const { data: userData } = await serviceClient.auth.admin.getUserById(uid)
          if (userData?.user?.email) {
            emailsByUserId.set(uid, userData.user.email)
          }
        } catch {
          // non-blocking
        }
      })
      await Promise.allSettled(emailFetches)
    }

    let itemsByOrderId = new Map<string, any[]>()
    if (orderIds.length > 0) {
      const { data: items, error: itemsError } = await serviceClient
        .from('order_items')
        .select('id, order_id, item_type, quantity, unit_price, rental_start_date, rental_end_date, products:product_id(name, category)')
        .in('order_id', orderIds)

      if (itemsError) {
        console.warn('admin-list-orders items warning:', itemsError.message)
      } else {
        const grouped = new Map<string, any[]>()
        for (const item of items || []) {
          const key = String(item.order_id)
          const existing = grouped.get(key) || []
          existing.push(item)
          grouped.set(key, existing)
        }
        itemsByOrderId = grouped
      }
    }

    const enrichedOrders = orderList.map((order: any) => {
      const profile = profilesById.get(order.user_id)
      return {
        ...order,
        customer: {
          id: order.user_id,
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
          phone: profile?.phone || '',
          email: emailsByUserId.get(order.user_id) || '',
        },
        items: itemsByOrderId.get(String(order.id)) || [],
      }
    })

    return new Response(
      JSON.stringify({ orders: enrichedOrders }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  } catch (error: any) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    console.error('admin-list-orders error:', message)
    return errorResponse(400, message)
  }
})
