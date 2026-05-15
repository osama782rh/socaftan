// =====================================================================
// SO Caftan - Edge Function: public-order-status
// =====================================================================
// Permet de recuperer le statut d'une commande SANS authentification,
// en utilisant le order_number ET l'email de la cliente comme cle composee.
//
// Securite : sans le couple (order_number, email), impossible d'acceder
// aux infos. Les emails ne sont jamais retournes dans la reponse.
//
// POST { orderNumber, email } -> { status, statusLabel, items, total, ... }
//
// DEPLOY: npx supabase functions deploy public-order-status --no-verify-jwt
// =====================================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente de paiement',
  paid: 'Paiement recu',
  confirmed: 'Commande confirmee',
  preparing: 'En preparation',
  ready: 'Prete pour livraison/retrait',
  delivered: 'Livree',
  returned: 'Retournee',
  cancelled: 'Annulee',
}

const errorResponse = (status: number, message: string) =>
  new Response(
    JSON.stringify({ error: message }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status },
  )

const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase()

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
  const orderNumber = String(payload?.orderNumber || '').trim()
  const email = normalizeEmail(payload?.email)

  if (!orderNumber || !email) {
    return errorResponse(400, 'orderNumber et email requis.')
  }

  // Cherche la commande
  const { data: order, error: orderError } = await serviceClient
    .from('orders')
    .select('id, user_id, order_number, status, order_type, subtotal, deposit_amount, total, delivery_method, delivery_city, delivered_at, created_at, stripe_invoice_pdf_url, stripe_invoice_hosted_url, stripe_invoice_number')
    .eq('order_number', orderNumber)
    .single()

  if (orderError || !order) {
    return errorResponse(404, 'Commande introuvable.')
  }

  // Verifie l'email de la cliente
  const { data: userData } = await serviceClient.auth.admin.getUserById(order.user_id)
  const userEmail = normalizeEmail(userData?.user?.email || '')
  if (userEmail !== email) {
    // On ne donne pas d'info specifique pour ne pas reveler l'existence de la commande
    return errorResponse(404, 'Commande introuvable.')
  }

  // Recupere les items
  const { data: items } = await serviceClient
    .from('order_items')
    .select('id, item_type, quantity, unit_price, rental_start_date, rental_end_date, products:product_id(name, category)')
    .eq('order_id', order.id)

  // Recupere le prenom (pour personnalisation)
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('first_name')
    .eq('id', order.user_id)
    .single()

  return new Response(
    JSON.stringify({
      orderNumber: order.order_number,
      firstName: profile?.first_name || null,
      status: order.status,
      statusLabel: STATUS_LABELS[order.status] || order.status,
      orderType: order.order_type || 'location',
      total: Number(order.total || 0),
      subtotal: Number(order.subtotal || 0),
      deposit: Number(order.deposit_amount || 0),
      deliveryMethod: order.delivery_method,
      deliveryCity: order.delivery_city,
      createdAt: order.created_at,
      deliveredAt: order.delivered_at,
      invoicePdfUrl: order.stripe_invoice_pdf_url,
      invoiceHostedUrl: order.stripe_invoice_hosted_url,
      invoiceNumber: order.stripe_invoice_number,
      items: (items || []).map((item: any) => ({
        name: item.products?.name || 'Article',
        category: item.products?.category || '',
        type: item.item_type,
        quantity: Number(item.quantity || 1),
        unitPrice: Number(item.unit_price || 0),
        rentalStartDate: item.rental_start_date,
        rentalEndDate: item.rental_end_date,
      })),
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
  )
})
