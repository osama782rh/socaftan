// =====================================================================
// SO Caftan - Edge Function: send-cart-reminder
// =====================================================================
// Trouve les paniers abandonnes (>= 1h sans modification, items > 0,
// pas encore relances) et envoie un email avec code promo SOCAFTAN20.
//
// MODE BATCH (cron, header x-cron-secret) :
//   POST { mode: "batch" }
//
// MODE MANUEL (admin, JWT) :
//   POST { mode: "manual", userId: "..." }
//
// DEPLOY: npx supabase functions deploy send-cart-reminder
// SECRETS: RESEND_API_KEY, CRON_SECRET, SITE_URL (defauts a www.socaftan.fr)
// =====================================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
}

const ABANDONMENT_DELAY_MINUTES = 60 // 1h apres derniere modif
const PROMO_CODE = 'SOCAFTAN20'

const errorResponse = (status: number, message: string) =>
  new Response(
    JSON.stringify({ error: message }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status },
  )

const formatPrice = (value: number | string) => `${Number(value || 0).toFixed(2)}€`

const buildEmailHtml = (params: {
  firstName: string
  items: any[]
  subtotal: number
  total: number
  cartUrl: string
  promoCode: string
}) => {
  const itemsHtml = params.items
    .map((item) => {
      const lineTotal = Number(item.unitPrice || 0) * Number(item.quantity || 1)
      const variant = item.type === 'location' ? 'Location' : 'Achat'
      return `<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f5e6d3;">
        <div>
          <p style="margin:0;font-weight:600;color:#2b201a;font-size:14px;">${item.name || 'Article'}</p>
          <p style="margin:2px 0 0;color:#9b8b7d;font-size:12px;">${variant} · x${item.quantity || 1}</p>
        </div>
        <p style="margin:0;font-weight:600;color:#2b201a;font-size:14px;">${formatPrice(lineTotal)}</p>
      </div>`
    })
    .join('')

  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>SO Caftan - Votre selection vous attend</title></head>
<body style="margin:0;padding:0;background-color:#faf6f1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2b201a;">
<div style="max-width:520px;margin:0 auto;padding:20px;">
  <div style="background-color:#2b201a;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;">
    <h1 style="color:#c9a46b;font-size:28px;margin:0;font-family:Georgia,serif;letter-spacing:2px;">SO CAFTAN</h1>
    <p style="color:rgba(255,255,255,0.5);font-size:11px;margin:8px 0 0;letter-spacing:3px;text-transform:uppercase;">L'art du caftan oriental</p>
  </div>
  <div style="background-color:#ffffff;padding:36px 30px;">
    <div style="text-align:center;margin-bottom:26px;">
      <div style="width:56px;height:56px;background-color:#fef3f2;border-radius:50%;margin:0 auto 16px;line-height:56px;font-size:28px;">🛍️</div>
      <h2 style="margin:0;font-size:22px;color:#2b201a;font-family:Georgia,serif;font-weight:600;line-height:1.3;">Bonjour ${params.firstName},</h2>
      <p style="margin:14px 0 0;color:#6b5d52;font-size:15px;line-height:1.6;">
        Vous avez selectionne de jolies pieces sur SO Caftan mais n'avez pas finalise votre commande.<br>
        Votre panier est encore disponible.
      </p>
    </div>

    <!-- Recap du panier -->
    <div style="background-color:#faf6f1;border-radius:12px;padding:16px 20px;margin:24px 0;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#9b8b7d;text-transform:uppercase;letter-spacing:1px;">Votre selection</p>
      ${itemsHtml}
      <div style="display:flex;justify-content:space-between;padding-top:12px;margin-top:8px;border-top:2px solid #c9a46b;">
        <p style="margin:0;font-weight:700;color:#2b201a;font-size:15px;">Total</p>
        <p style="margin:0;font-weight:700;color:#2b201a;font-size:15px;">${formatPrice(params.total)}</p>
      </div>
    </div>

    <!-- Code promo -->
    <div style="background:linear-gradient(135deg,#c9a46b 0%,#b08d54 100%);border-radius:12px;padding:24px;margin:24px 0;text-align:center;color:#ffffff;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:2px;opacity:0.85;">Cadeau de bienvenue</p>
      <p style="margin:0;font-size:13px;opacity:0.9;">Utilisez le code</p>
      <p style="margin:8px 0;font-family:Courier,monospace;font-size:32px;font-weight:700;letter-spacing:4px;">${params.promoCode}</p>
      <p style="margin:0;font-size:13px;opacity:0.95;font-weight:600;">et beneficiez de <span style="font-size:16px;">-20%</span> sur votre premiere commande</p>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:30px 0 8px;">
      <a href="${params.cartUrl}" style="display:inline-block;background-color:#2b201a;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:999px;font-weight:600;font-size:15px;letter-spacing:0.3px;">
        Finaliser ma commande →
      </a>
    </div>

    <p style="margin:24px 0 0;font-size:12px;color:#9b8b7d;text-align:center;line-height:1.7;">
      Une question ? Repondez a cet email ou contactez-nous via WhatsApp au<br>
      <a href="https://wa.me/33184180326" style="color:#c9a46b;text-decoration:none;font-weight:600;">+33 1 84 18 03 26</a>
    </p>
  </div>
  <div style="background-color:#2b201a;padding:24px;text-align:center;border-radius:0 0 12px 12px;">
    <p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;line-height:1.6;">SO Caftan — Tigery (91250), Ile-de-France<br>
    <a href="https://www.socaftan.fr" style="color:#c9a46b;text-decoration:none;">www.socaftan.fr</a></p>
  </div>
</div>
</body></html>`
}

interface CartRow {
  user_id: string
  items: any[]
  subtotal: number | null
  total: number | null
}

interface SendResult {
  userId: string
  recipient: string
  status: 'sent' | 'skipped' | 'failed'
  reason?: string
}

const sendReminder = async (
  serviceClient: ReturnType<typeof createClient>,
  cart: CartRow,
  resendApiKey: string,
  siteUrl: string,
): Promise<SendResult> => {
  const items = Array.isArray(cart.items) ? cart.items : []
  if (items.length === 0) {
    return { userId: cart.user_id, recipient: '', status: 'skipped', reason: 'empty_cart' }
  }

  // Recupere email + first_name
  const [{ data: profile }, { data: userData }] = await Promise.all([
    serviceClient.from('profiles').select('first_name').eq('id', cart.user_id).single(),
    serviceClient.auth.admin.getUserById(cart.user_id),
  ])

  const recipient = userData?.user?.email
  if (!recipient) {
    return { userId: cart.user_id, recipient: '', status: 'skipped', reason: 'no_email' }
  }

  const firstName = profile?.first_name || 'Cliente'
  const subtotal = Number(cart.subtotal || 0)
  const total = Number(cart.total || subtotal)

  const html = buildEmailHtml({
    firstName,
    items,
    subtotal,
    total,
    cartUrl: `${siteUrl}/checkout`,
    promoCode: PROMO_CODE,
  })

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SO Caftan <contact@socaftan.fr>',
        to: [recipient],
        subject: 'SO Caftan — Votre selection vous attend (-20% pour finaliser 🎁)',
        html,
        reply_to: 'contact@socaftan.fr',
      }),
    })

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text().catch(() => '')
      return {
        userId: cart.user_id,
        recipient,
        status: 'failed',
        reason: `resend_${resendResponse.status}: ${errorBody.substring(0, 120)}`,
      }
    }

    // Marquer comme envoye
    await serviceClient
      .from('user_carts')
      .update({ reminder_email_sent_at: new Date().toISOString() })
      .eq('user_id', cart.user_id)

    return { userId: cart.user_id, recipient, status: 'sent' }
  } catch (err) {
    return {
      userId: cart.user_id,
      recipient,
      status: 'failed',
      reason: err instanceof Error ? err.message : 'unknown',
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return errorResponse(405, 'Methode non autorisee.')
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  const siteUrl = Deno.env.get('SITE_URL') || 'https://www.socaftan.fr'

  if (!supabaseUrl || !serviceRoleKey) return errorResponse(500, 'Config Supabase manquante.')
  if (!resendApiKey) return errorResponse(500, 'RESEND_API_KEY manquant.')

  const serviceClient = createClient(supabaseUrl, serviceRoleKey)
  const payload = await req.json().catch(() => ({}))
  const mode = (typeof payload?.mode === 'string' ? payload.mode : 'manual').trim()

  // ===== MODE BATCH (cron) =====
  if (mode === 'batch') {
    const cronSecret = Deno.env.get('CRON_SECRET')
    const providedSecret = req.headers.get('x-cron-secret') || ''
    if (!cronSecret) return errorResponse(500, 'CRON_SECRET non configure.')
    if (providedSecret !== cronSecret) return errorResponse(401, 'Secret cron invalide.')

    const cutoff = new Date()
    cutoff.setMinutes(cutoff.getMinutes() - ABANDONMENT_DELAY_MINUTES)
    const cutoffIso = cutoff.toISOString()

    const { data, error } = await serviceClient
      .from('user_carts')
      .select('user_id, items, subtotal, total')
      .is('reminder_email_sent_at', null)
      .is('recovered_at', null)
      .lte('updated_at', cutoffIso)
      .neq('items', '[]')
      .order('updated_at', { ascending: true })
      .limit(100)

    if (error) return errorResponse(500, `DB error: ${error.message}`)

    const carts = (data || []) as CartRow[]
    const results: SendResult[] = []
    for (const cart of carts) {
      const r = await sendReminder(serviceClient, cart, resendApiKey, siteUrl)
      results.push(r)
    }

    return new Response(
      JSON.stringify({
        total: results.length,
        sent: results.filter((r) => r.status === 'sent').length,
        skipped: results.filter((r) => r.status === 'skipped').length,
        failed: results.filter((r) => r.status === 'failed').length,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  }

  return errorResponse(400, 'Mode non reconnu. Seul "batch" est supporte.')
})
