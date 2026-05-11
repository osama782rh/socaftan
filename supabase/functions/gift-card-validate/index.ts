// =====================================================================
// SO Caftan - Edge Function: gift-card-validate
// =====================================================================
// Verifie qu'un code carte cadeau est valide et retourne le solde,
// SANS le consommer (la consommation est faite cote stripe-webhook
// quand la commande est payee).
//
// POST { code } -> { valid, balance, initialAmount, currency, expiresAt }
//
// DEPLOY: npx supabase functions deploy gift-card-validate --no-verify-jwt
// =====================================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const errorResponse = (status: number, message: string) =>
  new Response(
    JSON.stringify({ error: message, valid: false }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status },
  )

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return errorResponse(405, 'Methode non autorisee.')
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) return errorResponse(500, 'Config manquante.')

  const serviceClient = createClient(supabaseUrl, serviceRoleKey)

  const payload = await req.json().catch(() => ({}))
  const code = String(payload?.code || '').trim().toUpperCase()
  if (!code) return errorResponse(400, 'Code manquant.')

  const { data: card, error } = await serviceClient
    .from('gift_cards')
    .select('code, initial_amount, balance, currency, status, expires_at')
    .eq('code', code)
    .maybeSingle()

  if (error) return errorResponse(500, error.message)
  if (!card) {
    return new Response(
      JSON.stringify({ valid: false, error: 'invalid_code' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  }

  const expired = new Date(card.expires_at) < new Date()
  const usable = !expired && ['active', 'partially_used'].includes(card.status) && Number(card.balance) > 0

  return new Response(
    JSON.stringify({
      valid: usable,
      code: card.code,
      balance: Number(card.balance),
      initialAmount: Number(card.initial_amount),
      currency: card.currency,
      status: card.status,
      expiresAt: card.expires_at,
      expired,
      reason: !usable
        ? expired ? 'expired'
        : card.status === 'depleted' ? 'depleted'
        : card.status === 'pending' ? 'not_yet_active'
        : card.status === 'cancelled' ? 'cancelled'
        : 'unknown'
        : undefined,
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
  )
})
