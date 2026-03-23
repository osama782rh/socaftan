import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')!
    const siteUrl = Deno.env.get('SITE_URL') || 'https://socaftan.fr'

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Non authentifie')

    const token = authHeader.replace('Bearer ', '')
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey)
    const { data: { user }, error: userError } = await serviceClient.auth.getUser(token)
    if (userError || !user) throw new Error('Non authentifie')

    const { orderId } = await req.json()
    if (!orderId) throw new Error('orderId requis')

    // Fetch order with items
    const { data: order, error: orderError } = await serviceClient
      .from('orders')
      .select(`*, order_items (*, products:product_id (name, category))`)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (orderError || !order) throw new Error('Commande introuvable: ' + (orderError?.message || ''))

    // Generate order number if empty
    if (!order.order_number) {
      const orderNumber = `SC-${Date.now().toString(36).toUpperCase()}`
      await serviceClient
        .from('orders')
        .update({ order_number: orderNumber })
        .eq('id', orderId)
      order.order_number = orderNumber
    }

    // Build Stripe line items via REST API
    const lineItems: any[] = []

    for (const item of order.order_items || []) {
      const productName = item.products?.name || 'Article SO Caftan'
      const typeSuffix = item.item_type === 'location' ? ' (Location)' : ' (Achat)'

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: `${productName}${typeSuffix}` },
          unit_amount: Math.round(item.unit_price * 100),
        },
        quantity: item.quantity,
      })
    }

    // Add deposit as separate line item if rental
    if (order.deposit_amount > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Caution (remboursable au retour)' },
          unit_amount: Math.round(order.deposit_amount * 100),
        },
        quantity: 1,
      })
    }

    // Create Stripe Checkout session via REST API
    const params = new URLSearchParams()
    params.append('mode', 'payment')
    params.append('customer_email', user.email!)
    params.append('success_url', `${siteUrl}/commande-confirmee?session_id={CHECKOUT_SESSION_ID}`)
    params.append('cancel_url', `${siteUrl}/checkout`)
    params.append('metadata[order_id]', orderId)
    params.append('metadata[order_number]', order.order_number)
    params.append('metadata[user_id]', user.id)
    params.append('payment_method_types[0]', 'card')

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

    const stripeData = await stripeRes.json()

    if (!stripeRes.ok) {
      console.error('Stripe error:', JSON.stringify(stripeData))
      throw new Error(stripeData.error?.message || 'Erreur Stripe')
    }

    return new Response(
      JSON.stringify({ url: stripeData.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  } catch (error) {
    console.error('create-checkout error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
