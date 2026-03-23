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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { email } = await req.json()

    if (!email) throw new Error('Email requis.')

    // Check rate limit: max 1 code per 60 seconds
    const { data: recentCode } = await supabase
      .from('verification_codes')
      .select('created_at')
      .eq('email', email)
      .eq('type', 'signup')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (recentCode) {
      const elapsed = Date.now() - new Date(recentCode.created_at).getTime()
      if (elapsed < 60000) {
        throw new Error('Veuillez patienter avant de demander un nouveau code.')
      }
    }

    // Find user
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const user = existingUsers?.users?.find((u: any) => u.email === email)
    if (!user) throw new Error('Aucun compte trouve avec cet email.')

    // Invalidate old codes
    await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('email', email)
      .eq('type', 'signup')
      .eq('used', false)

    // Generate new code
    const code = String(Math.floor(100000 + Math.random() * 900000))
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    await supabase.from('verification_codes').insert({
      email,
      code,
      user_id: user.id,
      type: 'signup',
      expires_at: expiresAt,
      used: false,
    })

    // Send email
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <head><meta charset="UTF-8"></head>
      <body style="margin:0;padding:0;background-color:#faf6f1;font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:480px;margin:0 auto;padding:20px;">
        <div style="background-color:#2b201a;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;">
          <h1 style="color:#c9a46b;font-size:28px;margin:0;font-family:Georgia,serif;letter-spacing:2px;">SO CAFTAN</h1>
        </div>
        <div style="background-color:#ffffff;padding:40px 32px;text-align:center;">
          <h2 style="color:#2b201a;font-size:22px;margin:0 0 8px;font-family:Georgia,serif;">Nouveau code de verification</h2>
          <p style="color:#2b201a99;font-size:14px;margin:0 0 32px;">Voici votre nouveau code :</p>
          <div style="background-color:#faf6f1;border:2px solid #c9a46b;border-radius:12px;padding:24px;margin:0 auto 32px;max-width:280px;">
            <p style="color:#2b201a;font-size:36px;font-weight:bold;letter-spacing:8px;margin:0;font-family:'Courier New',monospace;">${code}</p>
          </div>
          <p style="color:#2b201a60;font-size:12px;margin:0;">Ce code expire dans 24 heures.</p>
        </div>
        <div style="background-color:#f5e6d3;padding:20px;text-align:center;border-radius:0 0 12px 12px;">
          <p style="color:#2b201a80;font-size:11px;margin:0;">SO Caftan &middot; socaftan.fr</p>
        </div>
      </div>
      </body>
      </html>
    `

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SO Caftan <contact@socaftan.fr>',
        to: [email],
        subject: 'SO Caftan - Nouveau code de verification',
        html: emailHtml,
      }),
    })

    if (!emailRes.ok) throw new Error('Impossible d\'envoyer l\'email.')

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
