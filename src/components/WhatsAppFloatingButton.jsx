import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { trackEvent } from '../lib/analytics'

const PHONE = '33184180326'
const PRESET_MESSAGE = 'Bonjour SO Caftan, je souhaite me renseigner sur la location d\'une tenue.'

const WHATSAPP_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent(PRESET_MESSAGE)}`

// Routes sur lesquelles on cache le bouton (espace prive, parcours d'achat)
const HIDDEN_PATH_PREFIXES = [
  '/admin',
  '/compte',
  '/checkout',
  '/connexion',
  '/inscription',
  '/commande-confirmee',
]

const STORAGE_KEY = 'socaftan_wa_tooltip_shown'
const TOOLTIP_DELAY_MS = 8000
const TOOLTIP_DISPLAY_MS = 7000

const WhatsAppFloatingButton = () => {
  const { pathname } = useLocation()
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipDismissed, setTooltipDismissed] = useState(false)

  const isHidden = HIDDEN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  // Petit tooltip non-intrusif au premier passage uniquement
  useEffect(() => {
    if (isHidden) return
    if (typeof window === 'undefined') return
    if (window.localStorage?.getItem(STORAGE_KEY)) return

    const showTimer = setTimeout(() => setShowTooltip(true), TOOLTIP_DELAY_MS)
    const hideTimer = setTimeout(() => {
      setShowTooltip(false)
      try {
        window.localStorage?.setItem(STORAGE_KEY, '1')
      } catch {
        // localStorage peut etre indisponible (mode prive, etc.)
      }
    }, TOOLTIP_DELAY_MS + TOOLTIP_DISPLAY_MS)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [isHidden])

  const handleDismiss = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setShowTooltip(false)
    setTooltipDismissed(true)
    try {
      window.localStorage?.setItem(STORAGE_KEY, '1')
    } catch {
      // ignore
    }
  }

  if (isHidden) return null

  return (
    <div className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {showTooltip && !tooltipDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            className="relative max-w-[260px] bg-white rounded-2xl shadow-2xl border border-brand-sand/60 px-4 py-3 pr-9"
          >
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Fermer le message"
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full hover:bg-brand-sand/40 flex items-center justify-center text-brand-ink/45"
            >
              <X size={12} />
            </button>
            <p className="text-sm font-semibold text-brand-ink leading-tight">Une question ?</p>
            <p className="text-xs text-brand-ink/60 mt-1 leading-snug">
              On vous repond directement sur WhatsApp 🌸
            </p>
            <div className="absolute -bottom-1 right-7 w-3 h-3 bg-white border-r border-b border-brand-sand/60 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter SO Caftan sur WhatsApp"
        title="Contacter SO Caftan sur WhatsApp"
        onClick={() => trackEvent('whatsapp_click', { source: 'floating_button', path: pathname })}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 280, damping: 22 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex items-center justify-center w-14 h-14 md:w-15 md:h-15 rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/45 transition-shadow"
      >
        {/* Pulse ring */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping"
          style={{ animationDuration: '2.4s' }}
        />
        <MessageCircle size={26} strokeWidth={2.2} className="relative z-10" />
      </motion.a>
    </div>
  )
}

export default WhatsAppFloatingButton
