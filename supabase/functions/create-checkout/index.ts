import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const siteUrl = Deno.env.get('SITE_URL') || 'https://socaftan.fr'

    // Auth: get user from JWT
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)
    const anonClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: userError } = await anonClient.auth.getUser()
    if (userError || !user) throw new Error('Non authentifie')

    const { orderId } = await req.json()
    if (!orderId) throw new Error('orderId requis')

    // Fetch order with items
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select(`*, order_items (*, products:product_id (name, category))`)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (orderError || !order) throw new Error('Commande introuvable')

    // Generate order number if empty
    if (!order.order_number) {
      const orderNumber = `SC-${Date.now().toString(36).toUpperCase()}`
      await supabaseClient
        .from('orders')
        .update({ order_number: orderNumber })
        .eq('id', orderId)
      order.order_number = orderNumber
    }

    // Build Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    for (const item of order.order_items || []) {
      const productName = item.products?.name || 'Article SO Caftan'
      const typeSuffix = item.item_type === 'location' ? ' (Location)' : ' (Achat)'

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${productName}${typeSuffix}`,
            metadata: { order_item_id: item.id, item_type: item.item_type },
          },
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
          product_data: {
            name: 'Caution (remboursable au retour)',
            metadata: { type: 'deposit' },
          },
          unit_amount: Math.round(order.deposit_amount * 100),
        },
        quantity: 1,
      })
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      line_items: lineItems,
      metadata: {
        order_id: orderId,
        order_number: order.order_number,
        user_id: user.id,
      },
      success_url: `${siteUrl}/commande-confirmee?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
