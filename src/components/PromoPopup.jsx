import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Tag, Check, Copy } from 'lucide-react'

const PROMO_CODE = 'SOCAFTAN20'
const STORAGE_KEY_DISMISSED = 'socaftan_promo_dismissed_at'
const STORAGE_KEY_USED = 'socaftan_promo_copied'
const SHOW_AGAIN_AFTER_DAYS = 14
const TRIGGER_DELAY_MS = 25000 // 25 secondes apres l'arrivee

// Le pop-up apparait uniquement sur les pages publiques de decouverte
// (pas sur le checkout, espace client, login, etc.)
const ALLOWED_PATH_PREFIXES = [
  '/',
  '/location-',
  '/vente-',
  '/sur-mesure',
  '/galerie',
  '/avis-clients',
  '/a-propos',
  '/contact',
]

const isAllowedPath = (pathname) => {
  if (pathname === '/') return true
  return ALLOWED_PATH_PREFIXES.some((prefix) => prefix !== '/' && pathname.startsWith(prefix))
}

const shouldShowAgain = () => {
  if (typeof window === 'undefined') return false
  try {
    const dismissedAt = window.localStorage?.getItem(STORAGE_KEY_DISMISSED)
    if (!dismissedAt) return true
    const dismissedDate = new Date(dismissedAt)
    if (Number.isNaN(dismissedDate.getTime())) return true
    const ageMs = Date.now() - dismissedDate.getTime()
    const ageDays = ageMs / (1000 * 60 * 60 * 24)
    return ageDays >= SHOW_AGAIN_AFTER_DAYS
  } catch {
    return false
  }
}

const PromoPopup = () => {
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isAllowedPath(pathname)) return
    if (!shouldShowAgain()) return

    const timer = setTimeout(() => setIsOpen(true), TRIGGER_DELAY_MS)
    return () => clearTimeout(timer)
  }, [pathname])

  const dismiss = () => {
    setIsOpen(false)
    try {
      window.localStorage?.setItem(STORAGE_KEY_DISMISSED, new Date().toISOString())
    } catch {
      // ignore
    }
  }

  const copyCode = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(PROMO_CODE)
      } else {
        // Fallback pour vieux navigateurs
        const textarea = document.createElement('textarea')
        textarea.value = PROMO_CODE
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      try {
        window.localStorage?.setItem(STORAGE_KEY_USED, '1')
      } catch {
        // ignore
      }
      setTimeout(() => setCopied(false), 3000)
    } catch {
      setCopied(false)
    }
  }

  // Echap pour fermer
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="promo-popup-title"
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm"
            onClick={dismiss}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Bouton fermer */}
            <button
              type="button"
              onClick={dismiss}
              aria-label="Fermer la promotion"
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-brand-ink/55 hover:text-brand-ink transition-colors shadow-sm"
            >
              <X size={16} />
            </button>

            {/* Header decoratif */}
            <div className="relative bg-gradient-to-br from-brand-ink via-brand-night to-brand-ink px-6 pt-10 pb-8 text-center text-white overflow-hidden">
              {/* Effets visuels */}
              <div aria-hidden="true" className="absolute top-0 left-0 w-32 h-32 bg-brand-gold/15 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
              <div aria-hidden="true" className="absolute bottom-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl" />

              <div className="relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-[10px] font-semibold uppercase tracking-widest mb-4">
                  <Tag size={11} />
                  Offre exclusive
                </div>
                <h2 id="promo-popup-title" className="font-serif text-3xl md:text-4xl font-bold leading-tight">
                  -20% sur votre
                  <br />
                  <span className="italic font-light text-brand-gold">premiere location</span>
                </h2>
                <p className="text-white/65 text-sm mt-3 max-w-xs mx-auto">
                  Reservez votre takchita, karakou ou caftan a tarif reduit pour votre prochain evenement.
                </p>
              </div>
            </div>

            {/* Code + CTA */}
            <div className="px-6 pt-6 pb-7">
              <p className="text-center text-brand-ink/55 text-xs uppercase tracking-wider font-semibold mb-3">
                Votre code promo
              </p>
              <button
                type="button"
                onClick={copyCode}
                className="w-full group relative bg-brand-ivory border-2 border-dashed border-brand-gold/45 hover:border-brand-gold rounded-xl px-4 py-4 transition-colors"
                aria-label="Copier le code promo"
              >
                <p className="font-mono text-2xl md:text-3xl font-bold text-brand-ink tracking-[0.2em] text-center">
                  {PROMO_CODE}
                </p>
                <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-gold">
                  {copied ? (
                    <>
                      <Check size={13} />
                      Code copie !
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Cliquez pour copier
                    </>
                  )}
                </div>
              </button>

              <a
                href="/location-caftan-mariage"
                onClick={dismiss}
                className="mt-4 block w-full text-center bg-brand-ink hover:bg-brand-night text-white font-semibold text-sm py-3 rounded-full transition-colors"
              >
                Decouvrir les tenues
              </a>

              <p className="text-center text-[11px] text-brand-ink/45 mt-4 leading-relaxed">
                Code valable a usage unique sur votre premiere reservation. A entrer lors du paiement Stripe.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PromoPopup
