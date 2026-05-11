// =====================================================================
// SO Caftan - Edge Function: gift-card-purchase
// =====================================================================
// Cree une carte cadeau (status 'pending') et lance une session Stripe
// Checkout pour le paiement. Apres paiement, le webhook stripe-webhook
// mettra la carte en 'active' et enverra les emails.
//
// POST { amount, purchaserName, purchaserEmail, recipientName,
//        recipientEmail, personalMessage } -> { url } (Stripe Checkout URL)
//
// DEPLOY: npx supabase functions deploy gift-card-purchase --no-verify-jwt
// SECRETS: STRIPE_SECRET_KEY, SITE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// =====================================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ALLOWED_AMOUNTS = [50, 90, 100, 150, 180, 200, 250]
const MIN_AMOUNT = 30
const MAX_AMOUNT = 1000

const errorResponse = (status: number, message: string) =>
  new Response(
    JSON.stringify({ error: message }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status },
  )

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// Genere un code de carte cadeau au format XXXX-XXXX-XXXX (caracteres
// alphanumeriques sans confusion 0/O/1/I)
const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const groups = []
  for (let g = 0; g < 3; g++) {
    let group = ''
    const bytes = new Uint8Array(4)
    crypto.getRandomValues(bytes)
    for (let i = 0; i < 4; i++) {
      group += chars[bytes[i] % chars.length]
    }
    groups.push(group)
  }
  return groups.join('-')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return errorResponse(405, 'Methode non autorisee.')
  }

  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
  const siteUrl = Deno.env.get('SITE_URL') || 'https://www.socaftan.fr'
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!stripeSecretKey) return errorResponse(500, 'STRIPE_SECRET_KEY manquant.')
  if (!supabaseUrl || !serviceRoleKey) return errorResponse(500, 'Config Supabase manquante.')

  const serviceClient = createClient(supabaseUrl, serviceRoleKey)

  const payload = await req.json().catch(() => ({}))
  const amount = Number(payload?.amount)
  const purchaserName = String(payload?.purchaserName || '').trim()
  const purchaserEmail = String(payload?.purchaserEmail || '').trim().toLowerCase()
  const recipientName = String(payload?.recipientName || '').trim()
  const recipientEmail = String(payload?.recipientEmail || '').trim().toLowerCase()
  const personalMessage = String(payload?.personalMessage || '').trim().substring(0, 500)
  const accessToken = typeof payload?.accessToken === 'string' ? payload.accessToken.trim() : ''

  // Validation
  if (!Number.isFinite(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
    return errorResponse(400, `Montant invalide. Min ${MIN_AMOUNT}€, max ${MAX_AMOUNT}€.`)
  }
  if (!purchaserName) return errorResponse(400, 'Votre nom est requis.')
  if (!purchaserEmail || !isValidEmail(purchaserEmail)) {
    return errorResponse(400, 'Email acheteur invalide.')
  }
  if (!recipientName) return errorResponse(400, 'Nom du beneficiaire requis.')
  if (!recipientEmail || !isValidEmail(recipientEmail)) {
    return errorResponse(400, 'Email du beneficiaire invalide.')
  }

  // Recupere le user_id si la cliente est connectee
  let purchaserUserId: string | null = null
  if (accessToken) {
    const { data: authData } = await serviceClient.auth.getUser(accessToken)
    if (authData?.user?.id) {
      purchaserUserId = authData.user.id
    }
  }

  // Genere un code unique (boucle de securite jusqu'a 10 tentatives)
  let code = ''
  for (let i = 0; i < 10; i++) {
    const candidate = generateCode()
    const { data: existing } = await serviceClient
      .from('gift_cards')
      .select('id')
      .eq('code', candidate)
      .maybeSingle()
    if (!existing) {
      code = candidate
      break
    }
  }
  if (!code) {
    return errorResponse(500, 'Impossible de generer un code unique. Reessayez.')
  }

  // Cree la carte cadeau en 'pending'
  const { data: card, error: cardError } = await serviceClient
    .from('gift_cards')
    .insert({
      code,
      initial_amount: amount,
      balance: amount,
      currency: 'EUR',
      purchaser_name: purchaserName,
      purchaser_email: purchaserEmail,
      purchaser_user_id: purchaserUserId,
      recipient_name: recipientName,
      recipient_email: recipientEmail,
      personal_message: personalMessage || null,
      status: 'pending',
    })
    .select('id, code')
    .single()

  if (cardError || !card) {
    return errorResponse(500, `Creation impossible: ${cardError?.message || 'unknown'}`)
  }

  // Cree la session Stripe Checkout
  try {
    const params = new URLSearchParams()
    params.append('mode', 'payment')
    params.append('payment_method_types[0]', 'card')
    params.append('success_url', `${siteUrl}/cartes-cadeaux/confirmation?gift_card_id=${card.id}`)
    params.append('cancel_url', `${siteUrl}/cartes-cadeaux?cancelled=1`)
    params.append('customer_email', purchaserEmail)
    params.append('client_reference_id', `gift_card:${card.id}`)
    params.append('metadata[type]', 'gift_card')
    params.append('metadata[gift_card_id]', card.id)
    params.append('metadata[gift_card_code]', card.code)
    params.append('metadata[recipient_email]', recipientEmail)
    params.append('line_items[0][quantity]', '1')
    params.append('line_items[0][price_data][currency]', 'eur')
    params.append('line_items[0][price_data][unit_amount]', String(Math.round(amount * 100)))
    params.append('line_items[0][price_data][product_data][name]', `Carte cadeau SO Caftan - ${amount}€`)
    params.append('line_items[0][price_data][product_data][description]', `Pour ${recipientName}`)

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const stripeData = await stripeResponse.json()
    if (!stripeResponse.ok) {
      console.error('[gift-card-purchase] Stripe error:', stripeData)
      // On supprime la carte cadeau pending pour ne pas polluer la DB
      await serviceClient.from('gift_cards').delete().eq('id', card.id)
      return errorResponse(500, stripeData?.error?.message || 'Erreur Stripe.')
    }

    // Enregistre le session_id
    await serviceClient
      .from('gift_cards')
      .update({ stripe_session_id: stripeData.id })
      .eq('id', card.id)

    return new Response(
      JSON.stringify({ url: stripeData.url, giftCardId: card.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  } catch (err) {
    console.error('[gift-card-purchase] Exception:', err)
    await serviceClient.from('gift_cards').delete().eq('id', card.id)
    return errorResponse(500, err instanceof Error ? err.message : 'Erreur inconnue.')
  }
})
