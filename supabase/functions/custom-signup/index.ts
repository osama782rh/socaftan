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

    const { email, password, firstName, lastName, phone } = await req.json()

    if (!email || !password) {
      throw new Error('Email et mot de passe requis.')
    }

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find((u: any) => u.email === email)
    if (existingUser?.email_confirmed_at) {
      throw new Error('Un compte existe deja avec cet email.')
    }

    // Create or update user (if exists but not confirmed, update it)
    let userId: string
    if (existingUser && !existingUser.email_confirmed_at) {
      // User exists but not verified - update password
      const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
        password,
        user_metadata: { first_name: firstName, last_name: lastName, phone },
      })
      if (updateError) throw updateError
      userId = existingUser.id
    } else {
      // Create new user (without auto-confirm)
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
        user_metadata: { first_name: firstName, last_name: lastName, phone },
      })
      if (createError) throw createError
      userId = newUser.user.id
    }

    // Create/update profile
    await supabase.from('profiles').upsert({
      id: userId,
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
    })

    // Generate 6-digit OTP
    const code = String(Math.floor(100000 + Math.random() * 900000))
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    // Invalidate old codes
    await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('email', email)
      .eq('type', 'signup')
      .eq('used', false)

    // Insert new code
    const { error: codeError } = await supabase.from('verification_codes').insert({
      email,
      code,
      user_id: userId,
      type: 'signup',
      expires_at: expiresAt,
      used: false,
    })
    if (codeError) throw codeError

    // Send OTP email via Resend
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <head><meta charset="UTF-8"></head>
      <body style="margin:0;padding:0;background-color:#faf6f1;font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:480px;margin:0 auto;padding:20px;">
        <div style="background-color:#2b201a;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;">
          <h1 style="color:#c9a46b;font-size:28px;margin:0;font-family:Georgia,serif;letter-spacing:2px;">SO CAFTAN</h1>
          <p style="color:rgba(255,255,255,0.5);font-size:11px;margin:8px 0 0;letter-spacing:3px;text-transform:uppercase;">L'art du caftan marocain</p>
        </div>
        <div style="background-color:#ffffff;padding:40px 32px;text-align:center;">
          <h2 style="color:#2b201a;font-size:22px;margin:0 0 8px;font-family:Georgia,serif;">Bienvenue chez SO Caftan</h2>
          <p style="color:#2b201a99;font-size:14px;margin:0 0 32px;line-height:1.6;">
            Utilisez le code ci-dessous pour confirmer votre inscription.
          </p>
          <div style="background-color:#faf6f1;border:2px solid #c9a46b;border-radius:12px;padding:24px;margin:0 auto 32px;max-width:280px;">
            <p style="color:#2b201a99;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Votre code de verification</p>
            <p style="color:#2b201a;font-size:36px;font-weight:bold;letter-spacing:8px;margin:0;font-family:'Courier New',monospace;">${code}</p>
          </div>
          <p style="color:#2b201a60;font-size:12px;margin:0;line-height:1.5;">
            Ce code expire dans 24 heures.<br>
            Si vous n'avez pas cree de compte, ignorez cet email.
          </p>
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
        subject: 'SO Caftan - Votre code de verification',
        html: emailHtml,
      }),
    })

    if (!emailRes.ok) {
      const emailError = await emailRes.text()
      console.error('Resend error:', emailError)
      throw new Error('Impossible d\'envoyer l\'email de verification.')
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Code de verification envoye.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
