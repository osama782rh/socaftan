// =====================================================================
// SO Caftan - Edge Function: admin-moderate-photo
// =====================================================================
// Permet a l'admin de :
//   - Lister toutes les photos (status filter)
//   - Approuver une photo (passe en 'approved' + envoie email a la cliente)
//   - Refuser une photo (passe en 'rejected' + supprime du storage)
//   - Supprimer une photo deja approuvee
//
// DEPLOY: npx supabase functions deploy admin-moderate-photo
// =====================================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DEFAULT_ADMIN_EMAILS = ['contact@socaftan.fr', 'sara.ltr@outlook.fr']
const BUCKET = 'customer-photos'

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

const extractTokens = (req: Request, payload: any): string[] => {
  const tokens: string[] = []
  const authHeader = req.headers.get('Authorization') || ''
  if (authHeader.startsWith('Bearer ')) tokens.push(authHeader.substring(7).trim())
  if (typeof payload?.accessToken === 'string') tokens.push(payload.accessToken.trim())
  return [...new Set(tokens.filter(Boolean))]
}

const sendApprovalEmail = async (
  resendApiKey: string,
  recipient: string,
  firstName: string,
  publicUrl: string,
  siteUrl: string,
) => {
  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><title>Votre photo a ete publiee</title></head>
<body style="margin:0;padding:0;background-color:#faf6f1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2b201a;">
<div style="max-width:520px;margin:0 auto;padding:20px;">
  <div style="background-color:#2b201a;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;">
    <h1 style="color:#c9a46b;font-size:28px;margin:0;font-family:Georgia,serif;letter-spacing:2px;">SO CAFTAN</h1>
  </div>
  <div style="background-color:#ffffff;padding:36px 30px;text-align:center;">
    <div style="width:56px;height:56px;background-color:#fef3f2;border-radius:50%;margin:0 auto 16px;line-height:56px;font-size:28px;">💛</div>
    <h2 style="margin:0;font-size:22px;color:#2b201a;font-family:Georgia,serif;">Merci ${firstName} !</h2>
    <p style="margin:14px 0 24px;color:#6b5d52;font-size:15px;line-height:1.6;">
      Votre photo a bien ete publiee sur la galerie SO Caftan. Vous inspirez d'autres futures mariees a oser la beaute orientale.
    </p>
    <div style="margin:24px 0;">
      <img src="${publicUrl}" alt="Votre photo" style="max-width:100%;border-radius:12px;" />
    </div>
    <a href="${siteUrl}/galerie" style="display:inline-block;background-color:#c9a46b;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:999px;font-weight:600;font-size:15px;">Voir la galerie</a>
  </div>
  <div style="background-color:#2b201a;padding:20px;text-align:center;border-radius:0 0 12px 12px;">
    <p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;">SO Caftan — Tigery (91250), Ile-de-France</p>
  </div>
</div></body></html>`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'SO Caftan <contact@socaftan.fr>',
      to: [recipient],
      subject: 'SO Caftan — Votre photo est publiee 💛',
      html,
    }),
  }).catch(() => {})
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

  const serviceClient = createClient(supabaseUrl, serviceRoleKey)
  const payload = await req.json().catch(() => ({}))
  const tokens = extractTokens(req, payload)
  if (tokens.length === 0) return errorResponse(401, 'Session invalide.')

  // Authentifie + admin
  let authedUser: { id?: string; email?: string } | null = null
  for (const token of tokens) {
    const { data } = await serviceClient.auth.getUser(token)
    if (data?.user?.email) {
      authedUser = data.user
      break
    }
  }
  if (!authedUser) return errorResponse(401, 'Session invalide.')

  const adminEmails = getAdminEmails()
  if (!adminEmails.has(normalizeEmail(authedUser.email || ''))) {
    return errorResponse(403, 'Acces refuse.')
  }

  const action = String(payload?.action || 'list').trim()

  // ===== LIST =====
  if (action === 'list') {
    const status = typeof payload?.status === 'string' ? payload.status.trim() : ''

    let query = serviceClient
      .from('customer_photos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) return errorResponse(500, error.message)
    return new Response(
      JSON.stringify({ photos: data || [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  }

  const photoId = String(payload?.photoId || '').trim()
  if (!photoId) return errorResponse(400, 'photoId requis.')

  const { data: photo, error: fetchError } = await serviceClient
    .from('customer_photos')
    .select('*')
    .eq('id', photoId)
    .single()

  if (fetchError || !photo) return errorResponse(404, 'Photo introuvable.')

  // ===== APPROVE =====
  if (action === 'approve') {
    const moderationNote = typeof payload?.note === 'string' ? payload.note : null

    const { error: updateError } = await serviceClient
      .from('customer_photos')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: authedUser.id,
        moderation_note: moderationNote,
      })
      .eq('id', photoId)

    if (updateError) return errorResponse(500, updateError.message)

    // Envoie email a la cliente si on a son email + Resend configure
    if (resendApiKey && photo.submitter_email) {
      await sendApprovalEmail(
        resendApiKey,
        photo.submitter_email,
        photo.submitter_name || 'Cliente',
        photo.public_url || '',
        siteUrl,
      )
    }

    return new Response(
      JSON.stringify({ status: 'approved', photoId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  }

  // ===== REJECT =====
  if (action === 'reject') {
    const moderationNote = typeof payload?.note === 'string' ? payload.note : null

    const { error: updateError } = await serviceClient
      .from('customer_photos')
      .update({
        status: 'rejected',
        moderation_note: moderationNote,
      })
      .eq('id', photoId)

    if (updateError) return errorResponse(500, updateError.message)

    // Supprime du storage pour liberer l'espace
    if (photo.storage_path) {
      await serviceClient.storage.from(BUCKET).remove([photo.storage_path]).catch(() => {})
    }

    return new Response(
      JSON.stringify({ status: 'rejected', photoId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  }

  // ===== DELETE (supprimer une photo deja approuvee) =====
  if (action === 'delete') {
    if (photo.storage_path) {
      await serviceClient.storage.from(BUCKET).remove([photo.storage_path]).catch(() => {})
    }
    const { error: deleteError } = await serviceClient
      .from('customer_photos')
      .delete()
      .eq('id', photoId)

    if (deleteError) return errorResponse(500, deleteError.message)
    return new Response(
      JSON.stringify({ status: 'deleted', photoId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  }

  return errorResponse(400, `Action inconnue: ${action}`)
})
