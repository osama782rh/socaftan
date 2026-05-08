/**
 * SO Caftan - Analytics central
 * =============================
 *
 * Wrapper unifie pour Google Analytics 4 (gtag) + Meta (Facebook) Pixel.
 *
 * Toutes les requetes sont gardees derriere le consentement RGPD :
 * - Si l'utilisateur n'a pas accepte les cookies, NOTHING n'est envoye
 * - Si la cle d'API n'est pas configuree, le call est silencieux (no-op)
 *
 * Variables d'environnement (.env / Vercel) :
 *   VITE_GA_MEASUREMENT_ID = G-XXXXXXXXXX
 *   VITE_META_PIXEL_ID     = 1234567890123456
 *
 * Usage :
 *   import { trackEvent } from '../lib/analytics'
 *   trackEvent('whatsapp_click', { source: 'floating_button' })
 *
 * Conventions d'evenements (alignes Meta Standard Events + GA4) :
 *   - page_view              -> auto (au routing)
 *   - view_content           -> consultation page produit/service
 *   - whatsapp_click         -> clic sur WhatsApp
 *   - contact_form_submit    -> envoi formulaire contact (Lead)
 *   - add_to_cart            -> ajout panier
 *   - begin_checkout         -> debut checkout
 *   - purchase               -> commande confirmee (avec value)
 *   - promo_code_copied      -> code SOCAFTAN20 copie
 */

const CONSENT_KEY = 'socaftan_consent'
export const CONSENT_ACCEPTED = 'accepted'
export const CONSENT_REFUSED = 'refused'

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || ''
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || ''

const isBrowser = () => typeof window !== 'undefined'

export const getConsent = () => {
  if (!isBrowser()) return null
  try {
    return window.localStorage?.getItem(CONSENT_KEY) || null
  } catch {
    return null
  }
}

export const setConsent = (value) => {
  if (!isBrowser()) return
  try {
    window.localStorage?.setItem(CONSENT_KEY, value)
    window.dispatchEvent(new CustomEvent('socaftan:consent-change', { detail: { value } }))
  } catch {
    // localStorage indisponible (mode prive) - accepte uniquement pour la session
  }
}

export const hasConsent = () => getConsent() === CONSENT_ACCEPTED

// Mapping de nos events vers les "Standard Events" de Meta
const META_EVENT_MAP = {
  page_view: 'PageView',
  view_content: 'ViewContent',
  whatsapp_click: 'Contact',
  contact_form_submit: 'Lead',
  add_to_cart: 'AddToCart',
  begin_checkout: 'InitiateCheckout',
  purchase: 'Purchase',
  promo_code_copied: 'Lead',
}

const safeFbq = (...args) => {
  if (!isBrowser()) return
  if (typeof window.fbq !== 'function') return
  try {
    window.fbq(...args)
  } catch {
    // ignore
  }
}

const safeGtag = (...args) => {
  if (!isBrowser()) return
  if (typeof window.gtag !== 'function') return
  try {
    window.gtag(...args)
  } catch {
    // ignore
  }
}

/**
 * Track un evenement custom
 * @param {string} eventName - nom snake_case (ex: 'whatsapp_click')
 * @param {object} params - parametres associes (ex: { value: 90, currency: 'EUR' })
 */
export const trackEvent = (eventName, params = {}) => {
  if (!hasConsent()) return

  // Google Analytics 4
  if (GA_ID) {
    safeGtag('event', eventName, params)
  }

  // Meta Pixel
  if (META_PIXEL_ID) {
    const metaEvent = META_EVENT_MAP[eventName]
    if (metaEvent) {
      safeFbq('track', metaEvent, params)
    } else {
      safeFbq('trackCustom', eventName, params)
    }
  }
}

/**
 * Track un page view (a appeler sur chaque changement de route).
 * GA4 le fait automatiquement avec config.send_page_view = true,
 * mais on l'appelle manuellement pour fiabiliser le SPA.
 */
export const trackPageView = (path, title) => {
  if (!hasConsent()) return

  if (GA_ID) {
    safeGtag('config', GA_ID, {
      page_path: path,
      page_title: title,
    })
  }

  if (META_PIXEL_ID) {
    safeFbq('track', 'PageView')
  }
}

/**
 * Track une commande payee (event critique pour les pubs).
 * @param {object} order - { value, currency, orderId, items }
 */
export const trackPurchase = ({ value, currency = 'EUR', orderId, items = [] }) => {
  if (!hasConsent()) return

  trackEvent('purchase', {
    transaction_id: orderId,
    value,
    currency,
    items,
  })
}

export const ANALYTICS_CONFIG = {
  GA_ID,
  META_PIXEL_ID,
  configured: Boolean(GA_ID || META_PIXEL_ID),
}
