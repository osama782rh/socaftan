import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'
import {
  getConsent,
  setConsent,
  CONSENT_ACCEPTED,
  CONSENT_REFUSED,
  ANALYTICS_CONFIG,
} from '../lib/analytics'

/**
 * Banniere de consentement RGPD.
 *
 * Apparait uniquement si :
 * - L'utilisateur n'a pas encore choisi (ni "accepted" ni "refused" en localStorage)
 * - Au moins un tracker est configure (GA ou Meta Pixel)
 *
 * Conforme RGPD :
 * - Explicit consent (choix clair entre Accepter / Refuser)
 * - Pas de consent par defaut, pas de scroll = consent
 * - Lien vers la politique de confidentialite
 * - Possibilite de revenir sur son choix (boutton flottant si "refused")
 */
const CookieConsent = () => {
  const [decision, setDecision] = useState(() => getConsent())
  const [animatingOut, setAnimatingOut] = useState(false)

  // Si pas de tracking configure, on ne montre rien (pas besoin de consentement)
  if (!ANALYTICS_CONFIG.configured) return null

  // Synchronise si le state localStorage change (autre onglet)
  useEffect(() => {
    const sync = () => setDecision(getConsent())
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const handleChoice = (value) => {
    setAnimatingOut(true)
    // Petit delay pour que l'animation de sortie s'execute
    setTimeout(() => {
      setConsent(value)
      setDecision(value)
    }, 280)
  }

  // Affiche la banniere si l'utilisateur n'a pas encore choisi
  const showBanner = decision === null

  return (
    <AnimatePresence>
      {showBanner && !animatingOut && (
        <motion.div
          key="banner"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 md:px-5 md:pb-5"
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-consent-title"
        >
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-brand-sand/60 overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="hidden sm:flex w-10 h-10 rounded-full bg-brand-gold/15 items-center justify-center shrink-0">
                  <Cookie size={18} className="text-brand-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 id="cookie-consent-title" className="font-serif text-base md:text-lg font-bold text-brand-ink">
                    Vos preferences en matiere de cookies
                  </h2>
                  <p className="text-xs md:text-sm text-brand-ink/65 mt-1.5 leading-relaxed">
                    Nous utilisons des cookies pour mesurer l'audience du site et ameliorer votre experience.
                    Aucun cookie publicitaire tiers n'est depose sans votre accord.{' '}
                    <Link to="/confidentialite" className="text-brand-gold hover:underline font-semibold">
                      En savoir plus
                    </Link>
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={() => handleChoice(CONSENT_REFUSED)}
                  className="px-4 py-2 rounded-full text-sm font-semibold border border-brand-sand/70 text-brand-ink/65 hover:bg-brand-sand/20 transition-colors"
                >
                  Refuser
                </button>
                <button
                  type="button"
                  onClick={() => handleChoice(CONSENT_ACCEPTED)}
                  className="px-5 py-2 rounded-full text-sm font-semibold bg-brand-ink text-white hover:bg-brand-night transition-colors"
                >
                  Accepter
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Petit bouton flottant qui permet a l'utilisateur de revenir sur son choix.
 * Apparait uniquement si l'utilisateur a refuse les cookies.
 * Le menu d'options reste discret pour ne pas gener.
 */
export const CookieReopenButton = () => {
  const [decision, setDecision] = useState(() => getConsent())
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleConsentChange = (e) => setDecision(e?.detail?.value || null)
    window.addEventListener('socaftan:consent-change', handleConsentChange)
    return () => window.removeEventListener('socaftan:consent-change', handleConsentChange)
  }, [])

  if (!ANALYTICS_CONFIG.configured) return null
  if (decision === null) return null // la banniere est affichee, pas besoin de bouton de re-ouverture

  const reopen = () => setOpen((prev) => !prev)
  const choose = (value) => {
    setConsent(value)
    setDecision(value)
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={reopen}
        title="Gerer mes preferences cookies"
        aria-label="Gerer mes preferences cookies"
        className="fixed bottom-5 left-5 md:bottom-7 md:left-7 z-30 w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-brand-sand/60 text-brand-ink/55 hover:text-brand-ink shadow-md flex items-center justify-center transition-colors"
      >
        <Cookie size={15} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-16 left-5 md:bottom-20 md:left-7 z-40 bg-white rounded-2xl shadow-2xl border border-brand-sand/60 p-4 max-w-xs"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-brand-sand/30 flex items-center justify-center text-brand-ink/45"
            >
              <X size={11} />
            </button>
            <p className="text-xs font-semibold text-brand-ink mb-1">Cookies</p>
            <p className="text-[11px] text-brand-ink/55 leading-relaxed mb-3">
              Statut actuel :{' '}
              <strong className="text-brand-ink">
                {decision === CONSENT_ACCEPTED ? 'Acceptes' : 'Refuses'}
              </strong>
            </p>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => choose(decision === CONSENT_ACCEPTED ? CONSENT_REFUSED : CONSENT_ACCEPTED)}
                className="w-full px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-ink text-white hover:bg-brand-night transition-colors"
              >
                {decision === CONSENT_ACCEPTED ? 'Desactiver' : 'Activer'} les cookies
              </button>
              <Link
                to="/confidentialite"
                onClick={() => setOpen(false)}
                className="text-center text-[11px] text-brand-ink/55 hover:text-brand-ink"
              >
                Politique de confidentialite
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CookieConsent
