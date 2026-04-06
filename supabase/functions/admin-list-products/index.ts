import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase()

const getAdminEmails = () => {
  const blocked = new Set(['osama.rahim@outlook.fr'])
  const defaults = ['contact@socaftan.fr', 'sara.ltr@outlook.fr']
  const configured = (Deno.env.get('ADMIN_EMAILS') || '')
    .split(',')
    .map(normalizeEmail)
    .filter((email) => email && !blocked.has(email))

  return new Set([...defaults, ...configured])
}

const extractBearerTokens = (header: string | null): string[] => {
  if (!header) return []

  const matches = [...header.matchAll(/Bearer\s+([^,\s]+)/gi)]
    .map((match) => match[1])
    .filter(Boolean)

  return [...new Set(matches)]
}

const errorResponse = (status: number, message: string) =>
  new Response(
    JSON.stringify({ error: message }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status },
  )

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return errorResponse(405, 'Methode non autorisee.')
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !serviceRoleKey) {
      return errorResponse(500, 'Secrets Supabase manquants.')
    }

    const payload = await req.json().catch(() => ({}))
    const bodyToken = typeof payload?.accessToken === 'string' ? payload.accessToken.trim() : ''
    const authHeader = req.headers.get('Authorization')
    const candidateTokens = [
      ...(bodyToken ? [bodyToken] : []),
      ...extractBearerTokens(authHeader),
    ]
    const uniqueTokens = [...new Set(candidateTokens)]
    if (uniqueTokens.length === 0) {
      return errorResponse(401, 'Session invalide.')
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey)
    let authenticatedUser: any = null

    for (const token of uniqueTokens) {
      const { data: authData, error: authError } = await serviceClient.auth.getUser(token)
      if (!authError && authData?.user) {
        authenticatedUser = authData.user
        break
      }
    }

    if (!authenticatedUser) {
      return errorResponse(401, 'Session invalide.')
    }

    const requesterEmail = normalizeEmail(authenticatedUser.email || '')
    const adminEmails = getAdminEmails()
    if (!adminEmails.has(requesterEmail)) {
      return errorResponse(403, 'Acces refuse.')
    }

    const { data: products, error } = await serviceClient
      .from('products')
      .select('id, name, category, description, price_rent:rental_price, price_buy:purchase_price, image_key, featured, available, created_at')
      .order('name', { ascending: true })

    if (error) {
      return errorResponse(400, `Impossible de charger les produits: ${error.message}`)
    }

    return new Response(
      JSON.stringify({ products: products || [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  } catch (error: any) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return errorResponse(400, message)
  }
})
