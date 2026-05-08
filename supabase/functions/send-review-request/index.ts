// =====================================================================
// SO Caftan - Edge Function: send-review-request
// =====================================================================
// Deux modes d'utilisation :
//
//   1. MODE BATCH (cron J+7)
//      Trouve toutes les commandes 'delivered' depuis >= 7 jours
//      qui n'ont pas encore recu l'email d'avis, et leur envoie.
//      Authentification via le secret CRON_SECRET dans le header.
//
//      Appel via cron Supabase (pg_cron + http) ou cron externe :
//      POST { mode: "batch" } + Header "x-cron-secret: <secret>"
//
//   2. MODE MANUEL (depuis l'admin)
//      Envoie l'email pour une commande specifique.
//      Authentification : JWT admin valide.
//
//      POST { mode: "manual", orderId: "..." } + accessToken admin
//
// DEPLOY: npx supabase functions deploy send-review-request
//
// SECRETS REQUIS (Supabase Dashboard):
//   - RESEND_API_KEY        : cle API Resend
//   - SUPABASE_URL          : auto-defini
//   - SUPABASE_SERVICE_ROLE_KEY : auto-defini
//   - SITE_URL              : https://www.socaftan.fr
//   - GOOGLE_REVIEW_URL     : lien direct vers la page d'avis Google Business
//   - CRON_SECRET           : secret partage avec le cron (mode batch)
//   - ADMIN_EMAILS          : (optionnel) liste d'emails admin separes par ,
// =====================================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
}

const REVIEW_DELAY_DAYS = 7
const DEFAULT_ADMIN_EMAILS = ['contact@socaftan.fr', 'sara.ltr@outlook.fr']

const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase()

const getAdminEmails = (): Set<string> => {
  const blocked = new Set(['osama.rahim@outlook.fr'])
  const configured = (Deno.env.get('ADMIN_EMAILS') || '')
    .split(',')
    .map(normalizeEmail)
    .filter((email) => email && !blocked.has(email))
  return new Set([...DEFAULT_ADMIN_EMAILS, ...configured])
}

const errorResponse = (status: number, message: string) =>
  new Response(
    JSON.stringify({ error: message }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status },
  )

// Template HTML inline (l'Edge Function n'a pas acces au filesystem du repo)
const buildEmailHtml = (params: {
  firstName: string
  orderNumber: string
  googleReviewUrl: string
  whatsappUrl: string
}) => `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>SO Caftan - Votre avis compte</title></head>
<body style="margin:0;padding:0;background-color:#faf6f1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2b201a;">
<div style="max-width:520px;margin:0 auto;padding:20px;">
  <div style="background-color:#2b201a;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;">
    <h1 style="color:#c9a46b;font-size:28px;margin:0;font-family:Georgia,'Times New Roman',serif;letter-spacing:2px;">SO CAFTAN</h1>
    <p style="color:rgba(255,255,255,0.5);font-size:11px;margin:8px 0 0;letter-spacing:3px;text-transform:uppercase;">L'art du caftan oriental</p>
  </div>
  <div style="background-color:#ffffff;padding:40px 32px;">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="width:56px;height:56px;background-color:#fef3f2;border-radius:50%;margin:0 auto 16px;line-height:56px;font-size:28px;">💛</div>
      <h2 style="margin:0;font-size:22px;color:#2b201a;font-family:Georgia,'Times New Roman',serif;font-weight:600;line-height:1.3;">Bonjour ${params.firstName},</h2>
      <p style="margin:14px 0 0;color:#6b5d52;font-size:15px;line-height:1.6;">Nous esperons que votre evenement s'est deroule a merveille et que vous avez ete sublime dans votre tenue SO Caftan.</p>
    </div>
    <div style="background-color:#faf6f1;border-radius:12px;padding:24px;margin:24px 0;">
      <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#2b201a;">Votre satisfaction est notre plus belle recompense. Si l'experience vous a plu, nous serions honorees que vous partagiez votre ressenti avec une autre future cliente.</p>
      <p style="margin:0;font-size:15px;line-height:1.7;color:#2b201a;"><strong>Un avis Google de 30 secondes</strong> nous aide enormement a continuer de proposer des tenues d'exception accessibles a toutes.</p>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="${params.googleReviewUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background-color:#c9a46b;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:999px;font-weight:600;font-size:15px;letter-spacing:0.3px;">⭐ Laisser un avis Google</a>
      <p style="margin:12px 0 0;font-size:12px;color:#9b8b7d;">Cela nous prend a peine 30 secondes</p>
    </div>
    <div style="height:1px;background-color:#f5e6d3;margin:32px 0;"></div>
    <p style="margin:0 0 16px;font-size:13px;color:#9b8b7d;text-align:center;">Commande de reference : <strong style="color:#2b201a;">${params.orderNumber}</strong></p>
    <div style="background-color:#fdfaf5;border-left:3px solid #c9a46b;padding:16px 18px;margin:20px 0;border-radius:4px;">
      <p style="margin:0;font-size:13px;line-height:1.6;color:#6b5d52;"><strong style="color:#2b201a;">Un souci ou une question ?</strong> Contactez-nous directement sur WhatsApp.</p>
      <a href="${params.whatsappUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:10px;color:#c9a46b;font-size:13px;font-weight:600;text-decoration:none;">Ouvrir WhatsApp →</a>
    </div>
    <div style="text-align:center;margin:28px 0 8px;padding:20px;background:linear-gradient(135deg,#faf6f1 0%,#fdfaf5 100%);border-radius:12px;">
      <p style="margin:0 0 6px;font-size:14px;font-weight:600;color:#2b201a;">🎁 Parrainez une amie</p>
      <p style="margin:0;font-size:13px;color:#6b5d52;line-height:1.6;">Avec le code <strong style="color:#c9a46b;font-family:Courier,monospace;">SOCAFTAN20</strong>, vous beneficiez toutes les deux de <strong>-20%</strong> sur votre prochaine location.</p>
    </div>
    <p style="margin:32px 0 0;font-size:14px;color:#6b5d52;text-align:center;line-height:1.7;">Avec toute notre gratitude,<br><strong style="color:#2b201a;">L'equipe SO Caftan</strong></p>
  </div>
  <div style="background-color:#2b201a;padding:24px;text-align:center;border-radius:0 0 12px 12px;">
    <p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;line-height:1.6;">SO Caftan — Tigery (91250), Ile-de-France<br><a href="https://www.socaftan.fr" style="color:#c9a46b;text-decoration:none;">www.socaftan.fr</a> &nbsp;·&nbsp; <a href="mailto:contact@socaftan.fr" style="color:#c9a46b;text-decoration:none;">contact@socaftan.fr</a></p>
  </div>
</div></body></html>`

interface OrderForReview {
  id: string
  user_id: string
  order_number: string
}

interface SendResult {
  orderId: string
  orderNumber: string
  recipient: string
  status: 'sent' | 'skipped' | 'failed'
  reason?: string
}

const sendEmailForOrder = async (
  serviceClient: ReturnType<typeof createClient>,
  order: OrderForReview,
  resendApiKey: string,
  googleReviewUrl: string,
  siteUrl: string,
): Promise<SendResult> => {
  // Recupere le profil + email
  const [{ data: profile }, { data: userData }] = await Promise.all([
    serviceClient.from('profiles').select('first_name').eq('id', order.user_id).single(),
    serviceClient.auth.admin.getUserById(order.user_id),
  ])

  const recipient = userData?.user?.email
  if (!recipient) {
    return {
      orderId: order.id,
      orderNumber: order.order_number,
      recipient: '',
      status: 'skipped',
      reason: 'no_email',
    }
  }

  const firstName = profile?.first_name || 'Cliente'
  const whatsappUrl = `https://wa.me/33184180326?text=${encodeURIComponent('Bonjour SO Caftan, suite a ma commande ' + order.order_number + ',')}`

  const html = buildEmailHtml({
    firstName,
    orderNumber: order.order_number,
    googleReviewUrl,
    whatsappUrl,
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
        subject: 'SO Caftan — Votre avis nous aiderait beaucoup 💛',
        html,
        reply_to: 'contact@socaftan.fr',
      }),
    })

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text().catch(() => '')
      return {
        orderId: order.id,
        orderNumber: order.order_number,
        recipient,
        status: 'failed',
        reason: `resend_${resendResponse.status}: ${errorBody.substring(0, 120)}`,
      }
    }

    // Marque l'order comme ayant recu l'email (idempotence)
    const { error: updateError } = await serviceClient
      .from('orders')
      .update({ review_email_sent_at: new Date().toISOString() })
      .eq('id', order.id)

    if (updateError) {
      console.warn(`[review-email] Could not flag order ${order.id}:`, updateError.message)
    }

    return {
      orderId: order.id,
      orderNumber: order.order_number,
      recipient,
      status: 'sent',
    }
  } catch (err) {
    return {
      orderId: order.id,
      orderNumber: order.order_number,
      recipient,
      status: 'failed',
      reason: err instanceof Error ? err.message : 'unknown_error',
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
  const googleReviewUrl = Deno.env.get('GOOGLE_REVIEW_URL')
  const siteUrl = Deno.env.get('SITE_URL') || 'https://www.socaftan.fr'

  if (!supabaseUrl || !serviceRoleKey) {
    return errorResponse(500, 'Configuration Supabase manquante.')
  }
  if (!resendApiKey) {
    return errorResponse(500, 'RESEND_API_KEY non configure.')
  }
  if (!googleReviewUrl) {
    return errorResponse(500, 'GOOGLE_REVIEW_URL non configure (lien direct vers la page d\'avis Google Business).')
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey)
  const payload = await req.json().catch(() => ({}))
  const mode = (typeof payload?.mode === 'string' ? payload.mode : 'manual').trim()

  // ===========================================================================
  // MODE BATCH (cron) : envoie a toutes les commandes eligibles J+7
  // ===========================================================================
  if (mode === 'batch') {
    const cronSecret = Deno.env.get('CRON_SECRET')
    const providedSecret = req.headers.get('x-cron-secret') || ''

    if (!cronSecret) {
      return errorResponse(500, 'CRON_SECRET non configure.')
    }
    if (providedSecret !== cronSecret) {
      return errorResponse(401, 'Secret cron invalide.')
    }

    // Calcul de la date seuil (J-7)
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - REVIEW_DELAY_DAYS)
    const cutoffIso = cutoff.toISOString()

    const { data: orders, error: queryError } = await serviceClient
      .from('orders')
      .select('id, user_id, order_number')
      .eq('status', 'delivered')
      .is('review_email_sent_at', null)
      .lte('delivered_at', cutoffIso)
      .order('delivered_at', { ascending: true })
      .limit(50) // batch raisonnable par run

    if (queryError) {
      return errorResponse(500, `Erreur DB: ${queryError.message}`)
    }

    const orderList = (orders || []) as OrderForReview[]
    const results: SendResult[] = []
    for (const order of orderList) {
      const result = await sendEmailForOrder(serviceClient, order, resendApiKey, googleReviewUrl, siteUrl)
      results.push(result)
    }

    const summary = {
      total: results.length,
      sent: results.filter((r) => r.status === 'sent').length,
      skipped: results.filter((r) => r.status === 'skipped').length,
      failed: results.filter((r) => r.status === 'failed').length,
      results,
    }

    return new Response(
      JSON.stringify(summary),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  }

  // ===========================================================================
  // MODE MANUEL : declenche depuis l'admin pour une commande precise
  // ===========================================================================
  const orderId = typeof payload?.orderId === 'string' ? payload.orderId.trim() : ''
  if (!orderId) {
    return errorResponse(400, 'orderId requis en mode manuel.')
  }

  // Authentification admin
  const accessToken = typeof payload?.accessToken === 'string' ? payload.accessToken.trim() : ''
  const authHeader = req.headers.get('Authorization') || ''
  const headerToken = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : ''
  const tokens = [accessToken, headerToken].filter(Boolean)

  if (tokens.length === 0) {
    return errorResponse(401, 'Session invalide.')
  }

  let authedUser: { email?: string } | null = null
  for (const token of tokens) {
    const { data: authData } = await serviceClient.auth.getUser(token)
    if (authData?.user?.email) {
      authedUser = authData.user
      break
    }
  }

  if (!authedUser) {
    return errorResponse(401, 'Session invalide.')
  }

  const adminEmails = getAdminEmails()
  if (!adminEmails.has(normalizeEmail(authedUser.email || ''))) {
    return errorResponse(403, 'Acces refuse.')
  }

  // Recupere la commande
  const { data: order, error: orderError } = await serviceClient
    .from('orders')
    .select('id, user_id, order_number, status, review_email_sent_at')
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    return errorResponse(404, 'Commande introuvable.')
  }

  // En mode manuel on autorise meme si pas encore livre, mais on previent
  if (order.review_email_sent_at) {
    return new Response(
      JSON.stringify({
        warning: 'Email d\'avis deja envoye precedemment.',
        sentAt: order.review_email_sent_at,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  }

  const result = await sendEmailForOrder(
    serviceClient,
    { id: order.id, user_id: order.user_id, order_number: order.order_number },
    resendApiKey,
    googleReviewUrl,
    siteUrl,
  )

  if (result.status === 'failed') {
    return errorResponse(500, `Envoi echoue: ${result.reason || 'inconnu'}`)
  }

  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
  )
})
