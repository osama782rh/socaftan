import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const extractBearerTokens = (header: string | null): string[] => {
  if (!header) return []

  const matches = [...header.matchAll(/Bearer\s+([^,\s]+)/gi)]
    .map((m) => m[1])
    .filter(Boolean)

  return [...new Set(matches)]
}

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const siteUrl = Deno.env.get('SITE_URL') || 'https://socaftan.fr'

    if (!supabaseUrl) throw new Error('SUPABASE_URL manquant')
    if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY manquant')
    if (!stripeSecretKey) throw new Error('STRIPE_SECRET_KEY manquant')

    const payload = await req.json().catch(() => ({}))
    const orderId = typeof payload?.orderId === 'string' ? payload.orderId.trim() : payload?.orderId
    if (!orderId) throw new Error('orderId requis')

    const accessTokenFromBody = typeof payload?.accessToken === 'string'
      ? payload.accessToken.trim()
      : ''
    const userIdFromBody = typeof payload?.userId === 'string'
      ? payload.userId.trim()
      : ''
    const customerEmailFromBody = typeof payload?.customerEmail === 'string'
      ? payload.customerEmail.trim()
      : ''
    const authHeader = req.headers.get('Authorization')
    const candidateTokens = [
      ...(accessTokenFromBody ? [accessTokenFromBody] : []),
      ...extractBearerTokens(authHeader),
    ]
    const uniqueCandidateTokens = [...new Set(candidateTokens)]

    // Get user from JWT (try body token first, then Authorization variants)
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey)
    let user: any = null
    let effectiveUserId = ''
    let lastAuthError = 'JWT'

    for (const token of uniqueCandidateTokens) {
      const { data: userData, error: userError } = await serviceClient.auth.getUser(token)
      if (!userError && userData?.user) {
        user = userData.user
        effectiveUserId = user.id
        break
      }
      if (userError?.message) {
        lastAuthError = userError.message
      }
    }

    if (!effectiveUserId && isUuid(userIdFromBody)) {
      effectiveUserId = userIdFromBody
      const { data: adminUserData, error: adminUserError } = await serviceClient.auth.admin.getUserById(effectiveUserId)
      if (!adminUserError && adminUserData?.user) {
        user = adminUserData.user
      } else if (adminUserError?.message) {
        console.warn('create-checkout fallback auth warning:', adminUserError.message)
      }
    }

    if (!effectiveUserId) {
      console.error('create-checkout auth error:', lastAuthError)
      throw new Error(`Session invalide (${lastAuthError}).`)
    }

    // Fetch order (without relying on nested PostgREST relations)
    const { data: order, error: orderError } = await serviceClient
      .from('orders')
      .select('id, user_id, order_number, deposit_amount')
      .eq('id', orderId)
      .eq('user_id', effectiveUserId)
      .single()

    if (orderError || !order) {
      throw new Error('Commande introuvable: ' + (orderError?.message || ''))
    }

    const { data: orderItems, error: orderItemsError } = await serviceClient
      .from('order_items')
      .select('product_id, item_type, unit_price, quantity')
      .eq('order_id', orderId)

    if (orderItemsError) {
      throw new Error('Impossible de recuperer les articles: ' + orderItemsError.message)
    }

    if (!orderItems || orderItems.length === 0) {
      throw new Error('Aucun article dans la commande.')
    }

    const productIds = [...new Set(
      orderItems
        .map((item: any) => item.product_id)
        .filter(Boolean),
    )]

    const productNameById = new Map<string, string>()
    if (productIds.length > 0) {
      const { data: products, error: productsError } = await serviceClient
        .from('products')
        .select('id, name')
        .in('id', productIds)

      if (productsError) {
        console.warn('create-checkout: products lookup failed, fallback to generic names', productsError.message)
      } else {
        for (const product of products || []) {
          productNameById.set(String(product.id), product.name || 'Article SO Caftan')
        }
      }
    }

    // Generate order number if empty
    if (!order.order_number) {
      const orderNumber = `SC-${Date.now().toString(36).toUpperCase()}`
      const { error: updateOrderError } = await serviceClient
        .from('orders')
        .update({ order_number: orderNumber })
        .eq('id', orderId)
      if (updateOrderError) {
        throw new Error('Impossible de generer le numero de commande: ' + updateOrderError.message)
      }
      order.order_number = orderNumber
    }

    // Build Stripe line items via REST API
    const lineItems: any[] = []

    for (const item of orderItems) {
      const price = Number(item.unit_price)
      const quantity = Number(item.quantity)

      if (!Number.isFinite(price) || price <= 0) {
        throw new Error('Prix invalide pour un article de la commande.')
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error('Quantite invalide pour un article de la commande.')
      }

      const unitAmount = Math.round(price * 100)
      if (!Number.isInteger(unitAmount) || unitAmount < 50) {
        throw new Error('Montant d\'article invalide pour Stripe.')
      }

      const productName = productNameById.get(String(item.product_id)) || 'Article SO Caftan'
      const typeSuffix = item.item_type === 'location' ? ' (Location)' : ' (Achat)'

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: `${productName}${typeSuffix}` },
          unit_amount: unitAmount,
        },
        quantity,
      })
    }

    // Add deposit as separate line item if rental
    const depositAmount = Number(order.deposit_amount || 0)
    if (Number.isFinite(depositAmount) && depositAmount > 0) {
      const depositCents = Math.round(depositAmount * 100)
      if (depositCents < 50) {
        throw new Error('Montant de caution invalide pour Stripe.')
      }

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Caution location (validee selon etat au retour)' },
          unit_amount: depositCents,
        },
        quantity: 1,
      })
    }

    const customerEmail = user?.email || customerEmailFromBody
    if (!customerEmail) {
      throw new Error('Email client manquant pour le paiement.')
    }

    // Create Stripe Checkout session via REST API
    const params = new URLSearchParams()
    params.append('mode', 'payment')
    params.append('customer_email', customerEmail)
    params.append('success_url', `${siteUrl}/commande-confirmee?session_id={CHECKOUT_SESSION_ID}`)
    params.append('cancel_url', `${siteUrl}/checkout?from=stripe`)
    params.append('metadata[order_id]', String(orderId))
    params.append('metadata[order_number]', String(order.order_number))
    params.append('metadata[user_id]', effectiveUserId)
    params.append('payment_method_types[0]', 'card')
    params.append('allow_promotion_codes', 'true')

    lineItems.forEach((item, i) => {
      params.append(`line_items[${i}][price_data][currency]`, item.price_data.currency)
      params.append(`line_items[${i}][price_data][product_data][name]`, item.price_data.product_data.name)
      params.append(`line_items[${i}][price_data][unit_amount]`, String(item.price_data.unit_amount))
      params.append(`line_items[${i}][quantity]`, String(item.quantity))
    })

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const stripeData = await stripeRes.json().catch(() => null)

    if (!stripeRes.ok) {
      console.error('Stripe error:', JSON.stringify(stripeData))
      throw new Error(stripeData?.error?.message || `Erreur Stripe (${stripeRes.status})`)
    }

    if (!stripeData?.url) {
      throw new Error('Stripe n\'a pas renvoye d\'URL de checkout.')
    }

    return new Response(
      JSON.stringify({ url: stripeData.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  } catch (error: any) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    console.error('create-checkout error:', message)
    return new Response(
      JSON.stringify({ error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
