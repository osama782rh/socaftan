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

      const orderId = session.metadata?.order_id
      if (!orderId) throw new Error('order_id manquant dans metadata')

      // Update order status to paid
      const { data: order, error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          stripe_session_id: session.id,
          stripe_payment_intent: typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id || null,
        })
        .eq('id', orderId)
        .select(`*, order_items (*, products:product_id (name, category))`)
        .single()

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
      <a href="https://socaftan.fr/compte?tab=orders" style="display:inline-block;background-color:#2b201a;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:14px;font-weight:600;">Suivre ma commande</a>
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
