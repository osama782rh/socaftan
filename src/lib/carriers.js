/**
 * Transporteurs supportes par SO Caftan + generation auto des URLs de suivi.
 * Si la cliente saisit un numero de suivi, on lui propose le lien direct
 * vers la page de tracking du transporteur.
 */

export const CARRIERS = [
  {
    id: 'chronopost',
    name: 'Chronopost',
    trackingUrl: (n) => `https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumeros=${encodeURIComponent(n)}`,
  },
  {
    id: 'colissimo',
    name: 'Colissimo (La Poste)',
    trackingUrl: (n) => `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(n)}`,
  },
  {
    id: 'mondial-relay',
    name: 'Mondial Relay',
    trackingUrl: (n) => `https://www.mondialrelay.fr/suivi-de-colis/?numeroExpedition=${encodeURIComponent(n)}`,
  },
  {
    id: 'dhl',
    name: 'DHL',
    trackingUrl: (n) => `https://www.dhl.com/fr-fr/home/tracking.html?tracking-id=${encodeURIComponent(n)}`,
  },
  {
    id: 'ups',
    name: 'UPS',
    trackingUrl: (n) => `https://www.ups.com/track?loc=fr_FR&tracknum=${encodeURIComponent(n)}`,
  },
  {
    id: 'fedex',
    name: 'FedEx',
    trackingUrl: (n) => `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(n)}`,
  },
  {
    id: 'gls',
    name: 'GLS',
    trackingUrl: (n) => `https://gls-group.eu/FR/fr/suivi-colis?match=${encodeURIComponent(n)}`,
  },
  {
    id: 'in-person',
    name: 'Livraison en main propre (Sara)',
    trackingUrl: null, // pas d'URL externe
  },
  {
    id: 'other',
    name: 'Autre',
    trackingUrl: null,
  },
]

export const getCarrierById = (id) => CARRIERS.find((c) => c.id === id) || null
export const getCarrierName = (id) => getCarrierById(id)?.name || id || '-'

/**
 * Retourne l'URL de tracking : prefere tracking_url explicite si fournie,
 * sinon construit a partir du carrier + number.
 */
export const buildTrackingUrl = ({ carrier, number, explicitUrl }) => {
  if (explicitUrl && /^https?:\/\//.test(explicitUrl)) return explicitUrl
  if (!number) return null
  const c = getCarrierById(carrier)
  if (!c || !c.trackingUrl) return null
  return c.trackingUrl(number)
}
