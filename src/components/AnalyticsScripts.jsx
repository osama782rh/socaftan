import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  ANALYTICS_CONFIG,
  hasConsent,
  trackPageView,
} from '../lib/analytics'

/**
 * AnalyticsScripts
 * ================
 * Injecte dynamiquement les scripts Google Analytics 4 + Meta Pixel
 * UNIQUEMENT apres que l'utilisateur a accepte les cookies.
 *
 * - S'auto-monte / demonte selon le consentement
 * - Track les changements de route (page_view) sur le SPA
 * - Ne fait rien si les cles VITE_GA_MEASUREMENT_ID / VITE_META_PIXEL_ID ne sont pas definies
 */
const AnalyticsScripts = () => {
  const { pathname, search } = useLocation()
  const [consented, setConsented] = useState(() => hasConsent())

  // Ecoute les changements de consentement (CookieConsent dispatch un event custom)
  useEffect(() => {
    const handleConsentChange = (e) => {
      setConsented(e?.detail?.value === 'accepted')
    }
    window.addEventListener('socaftan:consent-change', handleConsentChange)
    return () => window.removeEventListener('socaftan:consent-change', handleConsentChange)
  }, [])

  // Injection des scripts une seule fois apres consentement
  useEffect(() => {
    if (!consented) return
    if (!ANALYTICS_CONFIG.configured) return

    const { GA_ID, META_PIXEL_ID } = ANALYTICS_CONFIG

    // ============= Google Analytics 4 =============
    if (GA_ID && !document.querySelector('script[data-analytics="ga4"]')) {
      const gaScript = document.createElement('script')
      gaScript.async = true
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
      gaScript.dataset.analytics = 'ga4'
      document.head.appendChild(gaScript)

      window.dataLayer = window.dataLayer || []
      // eslint-disable-next-line prefer-rest-params
      window.gtag = function () { window.dataLayer.push(arguments) }
      window.gtag('js', new Date())
      window.gtag('config', GA_ID, {
        send_page_view: false, // on gere le page_view manuellement (SPA)
        anonymize_ip: true,
        cookie_flags: 'SameSite=Lax;Secure',
      })
    }

    // ============= Meta (Facebook) Pixel =============
    if (META_PIXEL_ID && !document.querySelector('script[data-analytics="meta-pixel"]')) {
      const pixelScript = document.createElement('script')
      pixelScript.dataset.analytics = 'meta-pixel'
      pixelScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${META_PIXEL_ID}');
      `
      document.head.appendChild(pixelScript)

      // Noscript fallback (pour le tracking serveur Meta)
      if (!document.querySelector('noscript[data-analytics="meta-noscript"]')) {
        const noscript = document.createElement('noscript')
        noscript.dataset.analytics = 'meta-noscript'
        noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1"/>`
        document.body.appendChild(noscript)
      }
    }
  }, [consented])

  // Track page views sur les changements de route
  useEffect(() => {
    if (!consented) return
    if (!ANALYTICS_CONFIG.configured) return

    const fullPath = pathname + (search || '')
    trackPageView(fullPath, document.title)
  }, [consented, pathname, search])

  return null
}

export default AnalyticsScripts
