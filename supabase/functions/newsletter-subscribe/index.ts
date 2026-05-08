// =====================================================================
// SO Caftan - Edge Function: newsletter-subscribe
// =====================================================================
// Inscription a la newsletter avec double opt-in :
//   1. POST { email, firstName, source } -> insert + envoi email confirmation
//   2. GET ?token=... -> confirmation -> envoi email de bienvenue + code SOCAFTAN20
//   3. GET ?unsubscribe=...&token=... -> desabonnement
//
// DEPLOY: npx supabase functions deploy newsletter-subscribe --no-verify-jwt
// SECRETS: RESEND_API_KEY, SITE_URL
// =====================================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PROMO_CODE_WELCOME = 'SOCAFTAN20'

const errorResponse = (status: number, message: string) =>
  new Response(
    JSON.stringify({ error: message }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status },
  )

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const generateToken = () => {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

const buildConfirmEmailHtml = (firstName: string, confirmUrl: string) => `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><title>Confirmez votre inscription</title></head>
<body style="margin:0;padding:0;background-color:#faf6f1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2b201a;">
<div style="max-width:520px;margin:0 auto;padding:20px;">
  <div style="background-color:#2b201a;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;">
    <h1 style="color:#c9a46b;font-size:28px;margin:0;font-family:Georgia,serif;letter-spacing:2px;">SO CAFTAN</h1>
  </div>
  <div style="background-color:#ffffff;padding:36px 30px;text-align:center;">
    <h2 style="margin:0;font-size:22px;color:#2b201a;font-family:Georgia,serif;">Bienvenue ${firstName} !</h2>
    <p style="margin:14px 0 24px;color:#6b5d52;font-size:15px;line-height:1.6;">
      Merci de vous etre inscrite a la newsletter SO Caftan.<br>
      Confirmez votre adresse email pour recevoir votre <strong>code -20%</strong> et nos prochaines actualites.
    </p>
    <a href="${confirmUrl}" style="display:inline-block;background-color:#c9a46b;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:999px;font-weight:600;font-size:15px;">
      Confirmer mon inscription
    </a>
    <p style="margin:24px 0 0;font-size:11px;color:#9b8b7d;line-height:1.6;">
      Vous n'avez pas demande cet email ? Ignorez ce message, aucune action ne sera prise.
    </p>
  </div>
  <div style="background-color:#2b201a;padding:20px;text-align:center;border-radius:0 0 12px 12px;">
    <p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;">SO Caftan — Tigery (91250), Ile-de-France</p>
  </div>
</div></body></html>`

const buildWelcomeEmailHtml = (firstName: string, siteUrl: string, unsubscribeUrl: string) => `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><title>Bienvenue chez SO Caftan</title></head>
<body style="margin:0;padding:0;background-color:#faf6f1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2b201a;">
<div style="max-width:520px;margin:0 auto;padding:20px;">
  <div style="background-color:#2b201a;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;">
    <h1 style="color:#c9a46b;font-size:28px;margin:0;font-family:Georgia,serif;letter-spacing:2px;">SO CAFTAN</h1>
    <p style="color:rgba(255,255,255,0.5);font-size:11px;margin:8px 0 0;letter-spacing:3px;text-transform:uppercase;">L'art du caftan oriental</p>
  </div>
  <div style="background-color:#ffffff;padding:40px 30px;">
    <div style="text-align:center;margin-bottom:30px;">
      <div style="width:64px;height:64px;background-color:#fef3f2;border-radius:50%;margin:0 auto 16px;line-height:64px;font-size:32px;">💛</div>
      <h2 style="margin:0;font-size:24px;color:#2b201a;font-family:Georgia,serif;font-weight:600;">Bienvenue ${firstName} !</h2>
      <p style="margin:14px 0 0;color:#6b5d52;font-size:15px;line-height:1.7;">
        Vous faites desormais partie de la communaute SO Caftan. <br>
        Voici votre <strong>cadeau de bienvenue</strong> :
      </p>
    </div>
    <!-- Code promo -->
    <div style="background:linear-gradient(135deg,#c9a46b 0%,#b08d54 100%);border-radius:14px;padding:28px;margin:28px 0;text-align:center;color:#ffffff;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:2px;opacity:0.85;">Cadeau de bienvenue</p>
      <p style="margin:8px 0;font-family:Courier,monospace;font-size:34px;font-weight:700;letter-spacing:5px;">${PROMO_CODE_WELCOME}</p>
      <p style="margin:0;font-size:14px;opacity:0.95;font-weight:600;">-20% sur votre premiere commande</p>
    </div>
    <!-- Decouvrir -->
    <div style="text-align:center;margin:30px 0 16px;">
      <a href="${siteUrl}" style="display:inline-block;background-color:#2b201a;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:999px;font-weight:600;font-size:15px;">
        Decouvrir nos tenues
      </a>
    </div>
    <!-- Aper-cu -->
    <div style="margin:32px 0 0;padding:20px;background-color:#faf6f1;border-radius:12px;">
      <p style="margin:0 0 12px;font-weight:600;color:#2b201a;font-size:14px;">Ce qui vous attend dans la newsletter :</p>
      <ul style="margin:0;padding-left:20px;color:#6b5d52;font-size:13px;line-height:1.8;">
        <li>Nouveaux modeles en avant-premiere</li>
        <li>Conseils mode et tradition orientale</li>
        <li>Offres exclusives reservees aux abonnees</li>
        <li>Inspirations mariages et hennas</li>
      </ul>
    </div>
    <p style="margin:32px 0 0;font-size:14px;color:#6b5d52;text-align:center;line-height:1.7;">
      Avec amour,<br>
      <strong style="color:#2b201a;">L'equipe SO Caftan</strong>
    </p>
  </div>
  <div style="background-color:#2b201a;padding:24px;text-align:center;border-radius:0 0 12px 12px;">
    <p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;line-height:1.6;">
      SO Caftan — Tigery (91250), Ile-de-France<br>
      <a href="${unsubscribeUrl}" style="color:#9b8b7d;text-decoration:underline;font-size:10px;">Se desabonner</a>
    </p>
  </div>
</div></body></html>`

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  const siteUrl = Deno.env.get('SITE_URL') || 'https://www.socaftan.fr'

  if (!supabaseUrl || !serviceRoleKey) return errorResponse(500, 'Config Supabase manquante.')
  if (!resendApiKey) return errorResponse(500, 'RESEND_API_KEY manquant.')

  const serviceClient = createClient(supabaseUrl, serviceRoleKey)

  // ===== GET = confirmation ou desabonnement =====
  if (req.method === 'GET') {
    const url = new URL(req.url)
    const token = url.searchParams.get('token')
    const unsubscribe = url.searchParams.get('unsubscribe')

    if (!token) return errorResponse(400, 'Token manquant.')

    if (unsubscribe === '1') {
      const { error } = await serviceClient
        .from('newsletter_subscribers')
        .update({ unsubscribed_at: new Date().toISOString() })
        .eq('confirmation_token', token)

      if (error) return errorResponse(500, 'Erreur de desabonnement.')
      return new Response(
        `<html><head><meta charset="UTF-8"><title>Desabonnement</title></head><body style="font-family:Arial;text-align:center;padding:60px;background:#faf6f1;color:#2b201a;"><h1>Vous avez ete desabonnee</h1><p>Nous sommes desolees de vous voir partir. Vos donnees ont ete retirees de la newsletter.</p><p><a href="${siteUrl}" style="color:#c9a46b;">Retour sur SO Caftan</a></p></body></html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 200 },
      )
    }

    // Confirmation
    const { data: existing, error: lookupError } = await serviceClient
      .from('newsletter_subscribers')
      .select('id, email, first_name, confirmed, welcome_email_sent_at')
      .eq('confirmation_token', token)
      .maybeSingle()

    if (lookupError || !existing) {
      return new Response(
        `<html><head><meta charset="UTF-8"><title>Lien invalide</title></head><body style="font-family:Arial;text-align:center;padding:60px;background:#faf6f1;color:#2b201a;"><h1>Lien invalide ou expire</h1><p>Veuillez vous reinscrire depuis le site.</p><p><a href="${siteUrl}" style="color:#c9a46b;">Retour sur SO Caftan</a></p></body></html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 404 },
      )
    }

    // Marque comme confirme et envoie email de bienvenue si pas deja fait
    if (!existing.confirmed) {
      await serviceClient
        .from('newsletter_subscribers')
        .update({ confirmed: true, welcome_email_sent_at: new Date().toISOString() })
        .eq('id', existing.id)

      const unsubscribeUrl = `${supabaseUrl}/functions/v1/newsletter-subscribe?unsubscribe=1&token=${token}`
      const html = buildWelcomeEmailHtml(existing.first_name || 'Cliente', siteUrl, unsubscribeUrl)

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SO Caftan <contact@socaftan.fr>',
          to: [existing.email],
          subject: 'SO Caftan — Bienvenue dans notre univers (-20% offert) 💛',
          html,
        }),
      }).catch(() => {})
    }

    return new Response(
      `<html><head><meta charset="UTF-8"><title>Inscription confirmee</title></head><body style="font-family:Arial;text-align:center;padding:60px;background:#faf6f1;color:#2b201a;"><h1 style="color:#c9a46b;">✓ Inscription confirmee !</h1><p>Bienvenue ${existing.first_name || ''} dans la newsletter SO Caftan.</p><p>Verifiez votre boite mail pour recevoir votre code promo de bienvenue.</p><p style="margin-top:40px;"><a href="${siteUrl}" style="background:#2b201a;color:white;padding:12px 28px;border-radius:999px;text-decoration:none;">Decouvrir SO Caftan</a></p></body></html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 200 },
    )
  }

  // ===== POST = inscription =====
  if (req.method !== 'POST') {
    return errorResponse(405, 'Methode non autorisee.')
  }

  const payload = await req.json().catch(() => ({}))
  const email = String(payload?.email || '').trim().toLowerCase()
  const firstName = String(payload?.firstName || '').trim() || null
  const source = String(payload?.source || 'website').trim() || 'website'

  if (!email || !isValidEmail(email)) {
    return errorResponse(400, 'Email invalide.')
  }

  // Cherche si deja inscrit
  const { data: existing } = await serviceClient
    .from('newsletter_subscribers')
    .select('id, confirmed, unsubscribed_at, confirmation_token')
    .eq('email', email)
    .maybeSingle()

  let subscriberId: string
  let token: string

  if (existing) {
    // Si deja confirme et actif, retour neutre
    if (existing.confirmed && !existing.unsubscribed_at) {
      return new Response(
        JSON.stringify({ status: 'already_subscribed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
      )
    }
    // Sinon on regenere le token et on renvoie la confirmation
    token = generateToken()
    await serviceClient
      .from('newsletter_subscribers')
      .update({
        confirmation_token: token,
        unsubscribed_at: null,
        first_name: firstName || existing['first_name'],
      })
      .eq('id', existing.id)
    subscriberId = existing.id
  } else {
    token = generateToken()
    const { data: inserted, error: insertError } = await serviceClient
      .from('newsletter_subscribers')
      .insert({
        email,
        first_name: firstName,
        source,
        confirmation_token: token,
        confirmed: false,
      })
      .select('id')
      .single()

    if (insertError || !inserted) {
      return errorResponse(500, `Insertion impossible: ${insertError?.message || 'unknown'}`)
    }
    subscriberId = inserted.id
  }

  // Envoie email de confirmation
  const confirmUrl = `${supabaseUrl}/functions/v1/newsletter-subscribe?token=${token}`
  const html = buildConfirmEmailHtml(firstName || 'Cliente', confirmUrl)

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SO Caftan <contact@socaftan.fr>',
        to: [email],
        subject: 'SO Caftan — Confirmez votre inscription a la newsletter',
        html,
      }),
    })
  } catch (err) {
    console.warn('[newsletter] Confirm email failed:', err)
  }

  return new Response(
    JSON.stringify({ status: 'pending_confirmation', subscriberId }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
  )
})
