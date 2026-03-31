import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!
    const contactTo = Deno.env.get('CONTACT_TO_EMAIL') || 'contact@socaftan.fr'

    const { name, email, phone, service, products, date, message } = await req.json()

    if (!name || !email || !message) {
      throw new Error('Nom, email et message requis.')
    }

    const serviceLabels: Record<string, string> = {
      location: 'Location',
      achat: 'Achat',
      'sur-mesure': 'Sur-Mesure',
      autre: 'Autre demande',
    }

    const productsHtml = products?.length
      ? `<p style="color:#2b201a;font-size:14px;margin:12px 0 0;"><strong>Pieces :</strong> ${products.join(', ')}</p>`
      : ''

    const dateHtml = date
      ? `<p style="color:#2b201a;font-size:14px;margin:8px 0 0;"><strong>Date evenement :</strong> ${new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
      : ''

    // Email to business (notification of new contact)
    const businessEmailHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <head><meta charset="UTF-8"></head>
      <body style="margin:0;padding:0;background-color:#faf6f1;font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:520px;margin:0 auto;padding:20px;">
        <div style="background-color:#2b201a;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
          <h1 style="color:#c9a46b;font-size:24px;margin:0;font-family:Georgia,serif;">Nouveau message</h1>
        </div>
        <div style="background-color:#ffffff;padding:32px;">
          <div style="background-color:#faf6f1;border-radius:12px;padding:20px;margin-bottom:24px;">
            <p style="color:#2b201a;font-size:14px;margin:0;"><strong>Nom :</strong> ${name}</p>
            <p style="color:#2b201a;font-size:14px;margin:8px 0 0;"><strong>Email :</strong> <a href="mailto:${email}" style="color:#c9a46b;">${email}</a></p>
            <p style="color:#2b201a;font-size:14px;margin:8px 0 0;"><strong>Telephone :</strong> <a href="tel:${phone}" style="color:#c9a46b;">${phone}</a></p>
            <p style="color:#2b201a;font-size:14px;margin:8px 0 0;"><strong>Service :</strong> ${serviceLabels[service] || service}</p>
            ${productsHtml}
            ${dateHtml}
          </div>
          <div style="border-top:1px solid #f5e6d3;padding-top:20px;">
            <p style="color:#2b201a80;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Message</p>
            <p style="color:#2b201a;font-size:14px;margin:0;line-height:1.6;white-space:pre-wrap;">${message}</p>
          </div>
        </div>
        <div style="background-color:#f5e6d3;padding:16px;text-align:center;border-radius:0 0 12px 12px;">
          <p style="color:#2b201a80;font-size:11px;margin:0;">Envoye depuis socaftan.fr</p>
        </div>
      </div>
      </body>
      </html>
    `

    // Email to customer (auto-reply)
    const customerEmailHtml = `
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
          <h2 style="color:#2b201a;font-size:22px;margin:0 0 16px;font-family:Georgia,serif;">Merci pour votre message !</h2>
          <p style="color:#2b201a99;font-size:14px;margin:0 0 24px;line-height:1.6;">
            Bonjour ${name},<br><br>
            Nous avons bien recu votre message et nous vous recontacterons dans les plus brefs delais.<br><br>
            En attendant, n'hesitez pas a nous appeler au <strong>+33 184180326</strong>.
          </p>
          <a href="https://socaftan.fr" style="display:inline-block;background-color:#2b201a;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:14px;font-weight:600;">
            Visiter notre site
          </a>
        </div>
        <div style="background-color:#f5e6d3;padding:20px;text-align:center;border-radius:0 0 12px 12px;">
          <p style="color:#2b201a80;font-size:11px;margin:0;">SO Caftan &middot; socaftan.fr</p>
        </div>
      </div>
      </body>
      </html>
    `

    // Send both emails
    const [businessRes, customerRes] = await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'SO Caftan <contact@socaftan.fr>',
          to: [contactTo],
          reply_to: email,
          subject: `[SO Caftan] Nouveau message de ${name} - ${serviceLabels[service] || service}`,
          html: businessEmailHtml,
        }),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'SO Caftan <contact@socaftan.fr>',
          to: [email],
          subject: 'SO Caftan - Nous avons bien recu votre message',
          html: customerEmailHtml,
        }),
      }),
    ])

    if (!businessRes.ok) {
      const errText = await businessRes.text()
      console.error('Business email error:', errText)
      throw new Error('Erreur lors de l\'envoi du message.')
    }

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

