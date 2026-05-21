// =====================================================================
// SO Caftan - Edge Function: product-availability
// =====================================================================
// Retourne la liste des plages de dates bookees pour un produit donne.
// Inclut un buffer de +1 jour avant et apres chaque location (nettoyage,
// transit, marge de securite).
//
// Statuts consideres comme "actifs" (bloquent les dates) :
//   - paid, confirmed, preparing, ready, delivered
//
// POST { productId, fromDate?, toDate? } -> { blockedRanges: [{start, end}, ...] }
//
// Note : on accepte aussi GET avec query params pour faciliter le debug.
//
// DEPLOY: npx supabase functions deploy product-availability --no-verify-jwt
// =====================================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BUFFER_DAYS = 1 // jour(s) de marge ajoutee de chaque cote d'une location
const BLOCKING_STATUSES = ['paid', 'confirmed', 'preparing', 'ready', 'delivered']

const errorResponse = (status: number, message: string) =>
  new Response(
    JSON.stringify({ error: message }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status },
  )

const addDays = (dateIso: string, days: number): string => {
  const d = new Date(dateIso)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().substring(0, 10)
}

const isValidDateString = (value: unknown): boolean =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)

interface BookedRange {
  start: string
  end: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) return errorResponse(500, 'Config manquante.')

  const serviceClient = createClient(supabaseUrl, serviceRoleKey)

  // Accepte POST avec JSON ou GET avec query params
  let productId: string | number | undefined
  let fromDate: string | undefined
  let toDate: string | undefined

  if (req.method === 'POST') {
    const payload = await req.json().catch(() => ({}))
    productId = payload?.productId
    fromDate = payload?.fromDate
    toDate = payload?.toDate
  } else if (req.method === 'GET') {
    const url = new URL(req.url)
    productId = url.searchParams.get('productId') || undefined
    fromDate = url.searchParams.get('fromDate') || undefined
    toDate = url.searchParams.get('toDate') || undefined
  } else {
    return errorResponse(405, 'Methode non autorisee.')
  }

  if (!productId) {
    return errorResponse(400, 'productId requis.')
  }

  // Construction de la requete
  let query = serviceClient
    .from('order_items')
    .select(`
      rental_start_date,
      rental_end_date,
      orders!inner (
        id,
        status
      )
    `)
    .eq('product_id', productId)
    .eq('item_type', 'location')
    .not('rental_start_date', 'is', null)
    .not('rental_end_date', 'is', null)
    .in('orders.status', BLOCKING_STATUSES)

  // Filtre optionnel sur la plage (defaut : a partir d'aujourd'hui)
  const defaultFrom = new Date().toISOString().substring(0, 10)
  const effectiveFrom = isValidDateString(fromDate) ? (fromDate as string) : defaultFrom
  query = query.gte('rental_end_date', effectiveFrom)

  if (isValidDateString(toDate)) {
    query = query.lte('rental_start_date', toDate as string)
  }

  const { data: items, error } = await query

  if (error) {
    console.error('[product-availability] DB error:', error)
    return errorResponse(500, `Erreur DB: ${error.message}`)
  }

  // Construction des plages bloquees avec buffer
  const blockedRanges: BookedRange[] = []
  for (const item of items || []) {
    if (!item.rental_start_date || !item.rental_end_date) continue
    const start = addDays(item.rental_start_date, -BUFFER_DAYS)
    const end = addDays(item.rental_end_date, BUFFER_DAYS)
    blockedRanges.push({ start, end })
  }

  // Tri par date de debut
  blockedRanges.sort((a, b) => a.start.localeCompare(b.start))

  // Fusion des plages qui se chevauchent (clean output)
  const merged: BookedRange[] = []
  for (const range of blockedRanges) {
    const last = merged[merged.length - 1]
    if (last && range.start <= addDays(last.end, 1)) {
      // chevauchement ou contigus -> on etend
      if (range.end > last.end) {
        last.end = range.end
      }
    } else {
      merged.push({ ...range })
    }
  }

  return new Response(
    JSON.stringify({
      productId: String(productId),
      bufferDays: BUFFER_DAYS,
      blockedRanges: merged,
      // Genere aussi la liste flat des dates pour faciliter l'usage frontend
      blockedDates: expandRanges(merged),
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
  )
})

function expandRanges(ranges: BookedRange[]): string[] {
  const set = new Set<string>()
  for (const r of ranges) {
    let current = r.start
    while (current <= r.end) {
      set.add(current)
      current = addDays(current, 1)
    }
  }
  return [...set].sort()
}
