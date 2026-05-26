// DEPLOY WITH: npx supabase functions deploy stripe-webhook --no-verify-jwt
// Stripe webhooks don't send Authorization headers - JWT verification must be disabled.
// Security is ensured by Stripe signature verification inside the handler.
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

// HMAC-SHA256 for Stripe signature verification
async function computeHmac(secret: string, payload: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function verifyStripeSignature(body: string, signature: string, secret: string): Promise<boolean> {
  const elements = signature.split(',')
  const timestamp = elements.find(e => e.startsWith('t='))?.split('=')[1]
  const v1Sig = elements.find(e => e.startsWith('v1='))?.split('=')[1]
  if (!timestamp || !v1Sig) return false

  // Check timestamp is within 5 minutes
  const age = Math.abs(Date.now() / 1000 - parseInt(timestamp))
  if (age > 300) return false

  const expectedSig = await computeHmac(secret, `${timestamp}.${body}`)
  return expectedSig === v1Sig
}

serve(async (req) => {
  try {
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const siteUrl = Deno.env.get('SITE_URL') || 'https://www.socaftan.fr'

    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing signature' }), { status: 400 })
    }

    const isValid = await verifyStripeSignature(body, signature, webhookSecret)
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 })
    }

    const event = JSON.parse(body)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      // ===== Cas particulier : achat de carte cadeau =====
      if (session.metadata?.type === 'gift_card') {
        const giftCardId = session.metadata?.gift_card_id
        if (!giftCardId) throw new Error('gift_card_id manquant dans metadata')

        const { data: card, error: cardError } = await supabase
          .from('gift_cards')
          .update({
            status: 'active',
            stripe_payment_intent: typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent?.id || null,
            delivered_at: new Date().toISOString(),
          })
          .eq('id', giftCardId)
          .select('*')
          .single()

        if (cardError) {
          console.error('Gift card activation error:', cardError)
          throw cardError
        }

        // Envoie 2 emails : confirmation acheteur + carte cadeau au beneficiaire
        if (resendApiKey && card) {
          const formatAmount = (n: number) => `${Number(n).toFixed(0)}€`

          // Email 1 : confirmation a l'acheteur
          const purchaserHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#faf6f1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2b201a;">
<div style="max-width:520px;margin:0 auto;padding:20px;">
<div style="background:#2b201a;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;">
<h1 style="color:#c9a46b;font-size:28px;margin:0;font-family:Georgia,serif;letter-spacing:2px;">SO CAFTAN</h1></div>
<div style="background:#fff;padding:36px 30px;">
<h2 style="margin:0 0 16px;font-family:Georgia,serif;color:#2b201a;">Merci ${card.purchaser_name} !</h2>
<p style="color:#6b5d52;font-size:14px;line-height:1.6;">Votre carte cadeau de <strong>${formatAmount(card.initial_amount)}</strong> a bien ete cree et envoye a <strong>${card.recipient_name}</strong> a l'adresse <strong>${card.recipient_email}</strong>.</p>
<div style="background:#faf6f1;border-radius:12px;padding:18px;margin:20px 0;text-align:center;">
<p style="margin:0 0 4px;font-size:11px;color:#9b8b7d;text-transform:uppercase;letter-spacing:1px;">Code carte cadeau</p>
<p style="margin:0;font-family:Courier,monospace;font-size:20px;font-weight:700;letter-spacing:3px;color:#c9a46b;">${card.code}</p>
<p style="margin:6px 0 0;font-size:11px;color:#9b8b7d;">Valable jusqu'au ${new Date(card.expires_at).toLocaleDateString('fr-FR')}</p></div>
<p style="color:#6b5d52;font-size:13px;line-height:1.6;">Si la beneficiaire ne recoit pas son email d'ici quelques minutes, partagez-lui le code ci-dessus.</p></div>
<div style="background:#2b201a;padding:20px;text-align:center;border-radius:0 0 12px 12px;">
<p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;">SO Caftan — Tigery (91250), Ile-de-France</p></div></div></body></html>`

          // Email 2 : carte cadeau pour la beneficiaire
          const recipientHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#faf6f1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2b201a;">
<div style="max-width:520px;margin:0 auto;padding:20px;">
<div style="background:#2b201a;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;">
<h1 style="color:#c9a46b;font-size:28px;margin:0;font-family:Georgia,serif;letter-spacing:2px;">SO CAFTAN</h1></div>
<div style="background:#fff;padding:40px 30px;text-align:center;">
<div style="font-size:48px;margin-bottom:14px;">🎁</div>
<h2 style="margin:0 0 8px;font-family:Georgia,serif;color:#2b201a;font-size:24px;">Une surprise pour vous, ${card.recipient_name} !</h2>
<p style="color:#6b5d52;font-size:14px;line-height:1.7;"><strong>${card.purchaser_name}</strong> vous offre une carte cadeau SO Caftan d'une valeur de <strong style="color:#c9a46b;font-size:18px;">${formatAmount(card.initial_amount)}</strong></p>
${card.personal_message ? `<div style="background:#faf6f1;border-left:3px solid #c9a46b;padding:14px;margin:20px 0;text-align:left;border-radius:6px;"><p style="margin:0 0 4px;font-size:11px;color:#9b8b7d;text-transform:uppercase;letter-spacing:1px;">Message de ${card.purchaser_name}</p><p style="margin:0;font-style:italic;color:#2b201a;font-size:14px;">"${card.personal_message}"</p></div>` : ''}
<div style="background:linear-gradient(135deg,#c9a46b 0%,#b08d54 100%);border-radius:14px;padding:24px;margin:24px 0;color:#fff;">
<p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:2px;opacity:0.85;">Votre code carte cadeau</p>
<p style="margin:8px 0;font-family:Courier,monospace;font-size:24px;font-weight:700;letter-spacing:4px;">${card.code}</p>
<p style="margin:0;font-size:13px;opacity:0.95;">Valable jusqu'au ${new Date(card.expires_at).toLocaleDateString('fr-FR')}</p></div>
<a href="${siteUrl || 'https://www.socaftan.fr'}" style="display:inline-block;background:#2b201a;color:#fff;text-decoration:none;padding:14px 36px;border-radius:999px;font-weight:600;font-size:14px;margin-top:8px;">Decouvrir la collection</a>
<p style="margin:24px 0 0;font-size:12px;color:#9b8b7d;">Utilisez votre code au moment du paiement. Vous pouvez l'utiliser en plusieurs fois jusqu'a epuisement du solde.</p></div>
<div style="background:#2b201a;padding:20px;text-align:center;border-radius:0 0 12px 12px;">
<p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;">SO Caftan — Tigery (91250), Ile-de-France</p></div></div></body></html>`

          try {
            await Promise.all([
              fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  from: 'SO Caftan <contact@socaftan.fr>',
                  to: [card.purchaser_email],
                  subject: `SO Caftan — Confirmation carte cadeau ${formatAmount(card.initial_amount)}`,
                  html: purchaserHtml,
                }),
              }),
              fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  from: 'SO Caftan <contact@socaftan.fr>',
                  to: [card.recipient_email],
                  subject: `${card.purchaser_name} vous offre une carte cadeau SO Caftan 🎁`,
                  html: recipientHtml,
                }),
              }),
            ])
          } catch (emailErr) {
            console.warn('[gift-card] Email send error:', emailErr)
          }
        }

        return new Response(JSON.stringify({ received: true, type: 'gift_card_activated' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        })
      }

      // ===== Cas standard : commande produit =====
      const orderId = session.metadata?.order_id
      if (!orderId) throw new Error('order_id manquant dans metadata')

      // ===== Recupere la facture Stripe si elle existe =====
      // Stripe genere la facture en async, on la fetch via l'API pour avoir les URLs
      const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
      let invoiceData: {
        id?: string
        number?: string
        invoice_pdf?: string
        hosted_invoice_url?: string
      } | null = null

      const invoiceId = typeof session.invoice === 'string'
        ? session.invoice
        : session.invoice?.id || null

      if (invoiceId && stripeSecretKey) {
        try {
          const invoiceRes = await fetch(`https://api.stripe.com/v1/invoices/${invoiceId}`, {
            headers: { Authorization: `Bearer ${stripeSecretKey}` },
          })
          if (invoiceRes.ok) {
            const json = await invoiceRes.json()
            invoiceData = {
              id: json.id,
              number: json.number,
              invoice_pdf: json.invoice_pdf,
              hosted_invoice_url: json.hosted_invoice_url,
            }
          } else {
            console.warn('[stripe-webhook] invoice fetch non-ok:', invoiceRes.status)
          }
        } catch (e) {
          console.warn('[stripe-webhook] invoice fetch error:', e)
        }
      }

      // Update order status to paid (avec invoice si dispo)
      const { data: order, error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          stripe_session_id: session.id,
          stripe_payment_intent: typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id || null,
          ...(invoiceData ? {
            stripe_invoice_id: invoiceData.id,
            stripe_invoice_number: invoiceData.number,
            stripe_invoice_pdf_url: invoiceData.invoice_pdf,
            stripe_invoice_hosted_url: invoiceData.hosted_invoice_url,
          } : {}),
        })
        .eq('id', orderId)
        .select(`*, order_items (*, products:product_id (name, category))`)
        .single()

      // ===== Consomme la carte cadeau si appliquee =====
      const giftCardId = session.metadata?.gift_card_id
      const giftCardAmount = Number(session.metadata?.gift_card_amount || 0)
      if (giftCardId && giftCardAmount > 0) {
        const { error: applyError } = await supabase.rpc('apply_gift_card', {
          p_code: '', // on cherche par id en faisant un update direct ci-dessous
          p_amount: giftCardAmount,
          p_order_id: orderId,
          p_user_id: order?.user_id || null,
        })
        if (applyError) {
          // Fallback : update direct (la fonction RPC matche par code, pas par id)
          // Recupere le code puis applique
          const { data: card } = await supabase
            .from('gift_cards')
            .select('code')
            .eq('id', giftCardId)
            .single()
          if (card?.code) {
            await supabase.rpc('apply_gift_card', {
              p_code: card.code,
              p_amount: giftCardAmount,
              p_order_id: orderId,
              p_user_id: order?.user_id || null,
            })
          }
        }
      }

      if (updateError) {
        console.error('Update error:', updateError)
        throw updateError
      }

      // Send confirmation email via Resend
      if (resendApiKey && order) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', order.user_id)
          .single()

        const firstName = profile?.first_name || 'Client'

        const itemsHtml = (order.order_items || []).map((item: any) => `
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f5e6d3;">
            <div>
              <p style="color:#2b201a;font-size:14px;margin:0;font-weight:600;">${item.products?.name || 'Article'}</p>
              <p style="color:#2b201a80;font-size:12px;margin:2px 0 0;">${item.item_type === 'location' ? 'Location' : 'Achat'} x${item.quantity}</p>
            </div>
            <p style="color:#2b201a;font-size:14px;margin:0;font-weight:600;">${(item.unit_price * item.quantity).toFixed(2)}\u20AC</p>
          </div>
        `).join('')

        const emailHtml = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#faf6f1;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:520px;margin:0 auto;padding:20px;">
  <div style="background-color:#2b201a;padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;">
    <h1 style="color:#c9a46b;font-size:28px;margin:0;font-family:Georgia,serif;letter-spacing:2px;">SO CAFTAN</h1>
  </div>
  <div style="background-color:#ffffff;padding:40px 32px;">
    <div style="text-align:center;margin-bottom:24px;">
      <h2 style="color:#2b201a;font-size:24px;margin:0 0 8px;font-family:Georgia,serif;">Commande confirmee !</h2>
      <p style="color:#2b201a99;font-size:14px;margin:0;">Merci ${firstName}, votre commande a bien ete enregistree.</p>
    </div>
    <div style="background-color:#faf6f1;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px;">
      <p style="color:#2b201a80;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 4px;">Numero de commande</p>
      <p style="color:#2b201a;font-size:20px;font-weight:bold;margin:0;font-family:Georgia,serif;">${order.order_number}</p>
    </div>
    ${itemsHtml}
    <div style="margin-top:20px;padding-top:16px;border-top:2px solid #2b201a;">
      <table width="100%"><tr>
        <td style="color:#2b201a;font-size:16px;font-weight:bold;">Total</td>
        <td style="color:#2b201a;font-size:18px;font-weight:bold;font-family:Georgia,serif;text-align:right;">${order.total?.toFixed(2)}\u20AC</td>
      </tr></table>
    </div>
    <div style="text-align:center;margin-top:32px;">
      <a href="https://www.socaftan.fr/compte?tab=orders" style="display:inline-block;background-color:#2b201a;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:14px;font-weight:600;">Suivre ma commande</a>
    </div>
  </div>
  <div style="background-color:#f5e6d3;padding:20px;text-align:center;border-radius:0 0 12px 12px;">
    <p style="color:#2b201a80;font-size:11px;margin:0;">SO Caftan &middot; socaftan.fr</p>
  </div>
</div></body></html>`

        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'SO Caftan <contact@socaftan.fr>',
              to: [session.customer_email],
              subject: `SO Caftan - Confirmation de commande ${order.order_number}`,
              html: emailHtml,
            }),
          })
        } catch (emailErr) {
          console.error('Email send error:', emailErr)
        }
      }
    }

    // ===== invoice.finalized : fallback pour les factures generees apres checkout.session.completed =====
    // Permet de capter le PDF URL meme si l'invoice n'etait pas encore prete a la session
    if (event.type === 'invoice.finalized' || event.type === 'invoice.paid') {
      const invoice = event.data.object
      const orderIdFromInvoice = invoice.metadata?.order_id

      if (orderIdFromInvoice) {
        await supabase
          .from('orders')
          .update({
            stripe_invoice_id: invoice.id,
            stripe_invoice_number: invoice.number,
            stripe_invoice_pdf_url: invoice.invoice_pdf,
            stripe_invoice_hosted_url: invoice.hosted_invoice_url,
          })
          .eq('id', orderIdFromInvoice)
          // Ne pas ecraser si deja rempli avec une version plus recente
          .is('stripe_invoice_id', null)
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
