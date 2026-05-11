import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Ruler, MessageCircle, Info } from 'lucide-react'

/**
 * Modal "Guide des tailles" reutilisable depuis n'importe ou.
 *
 * Props :
 *   open: boolean - controle l'ouverture
 *   onClose: function - callback de fermeture
 */

const SIZE_TABLE = [
  { size: 'XS', fr: '34', poitrine: '78-82', taille: '60-64', hanches: '86-90' },
  { size: 'S', fr: '36', poitrine: '82-86', taille: '64-68', hanches: '90-94' },
  { size: 'M', fr: '38', poitrine: '86-90', taille: '68-72', hanches: '94-98' },
  { size: 'L', fr: '40', poitrine: '90-94', taille: '72-76', hanches: '98-102' },
  { size: 'XL', fr: '42', poitrine: '94-98', taille: '76-80', hanches: '102-106' },
  { size: 'XXL', fr: '44', poitrine: '98-104', taille: '80-86', hanches: '106-112' },
  { size: 'XXXL', fr: '46', poitrine: '104-110', taille: '86-92', hanches: '112-118' },
]

const MEASURING_TIPS = [
  {
    label: 'Poitrine',
    description: 'Mesurez horizontalement au niveau le plus fort de votre poitrine, sans serrer.',
  },
  {
    label: 'Taille',
    description: 'Mesurez la partie la plus fine de votre taille, juste au-dessus du nombril.',
  },
  {
    label: 'Hanches',
    description: 'Mesurez la partie la plus large de vos hanches, environ 20 cm sous la taille.',
  },
]

const SizeGuideModal = ({ open, onClose }) => {
  // Echap pour fermer
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKey)
    // Bloque le scroll body
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
          >
            {/* Header sticky */}
            <div className="sticky top-0 bg-white border-b border-brand-sand/40 px-5 md:px-7 py-4 flex items-center justify-between gap-3 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-brand-gold/15 flex items-center justify-center">
                  <Ruler size={16} className="text-brand-gold" />
                </div>
                <div>
                  <h2 id="size-guide-title" className="font-serif text-lg md:text-xl font-bold text-brand-ink leading-tight">
                    Guide des tailles
                  </h2>
                  <p className="text-[11px] text-brand-ink/45">Trouvez la taille parfaite</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="w-9 h-9 rounded-full bg-brand-ivory hover:bg-brand-sand/40 flex items-center justify-center text-brand-ink/55 hover:text-brand-ink transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 md:px-7 py-6 space-y-7">
              {/* Tableau de correspondances */}
              <section>
                <h3 className="font-semibold text-brand-ink text-sm md:text-base mb-3">
                  Correspondances (cm)
                </h3>
                <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-brand-ivory">
                        <th className="text-left font-semibold text-brand-ink/70 px-3 py-2.5 rounded-l-lg">Taille</th>
                        <th className="text-center font-semibold text-brand-ink/70 px-3 py-2.5">FR</th>
                        <th className="text-center font-semibold text-brand-ink/70 px-3 py-2.5">Poitrine</th>
                        <th className="text-center font-semibold text-brand-ink/70 px-3 py-2.5">Taille</th>
                        <th className="text-center font-semibold text-brand-ink/70 px-3 py-2.5 rounded-r-lg">Hanches</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SIZE_TABLE.map((row, idx) => (
                        <tr
                          key={row.size}
                          className={`border-b border-brand-sand/30 last:border-b-0 ${idx % 2 === 0 ? '' : 'bg-brand-ivory/30'}`}
                        >
                          <td className="px-3 py-2.5 font-bold text-brand-ink">{row.size}</td>
                          <td className="px-3 py-2.5 text-center text-brand-ink/70">{row.fr}</td>
                          <td className="px-3 py-2.5 text-center text-brand-ink/70">{row.poitrine}</td>
                          <td className="px-3 py-2.5 text-center text-brand-ink/70">{row.taille}</td>
                          <td className="px-3 py-2.5 text-center text-brand-ink/70">{row.hanches}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-brand-ink/45 mt-2 leading-relaxed flex items-start gap-1.5">
                  <Info size={11} className="shrink-0 mt-0.5" />
                  Ces correspondances sont indicatives. Les coupes orientales (takchitas, karakous, caftans)
                  sont generalement amples : si vous etes entre deux tailles, optez pour la plus petite.
                </p>
              </section>

              {/* Comment se mesurer */}
              <section>
                <h3 className="font-semibold text-brand-ink text-sm md:text-base mb-3">
                  Comment prendre vos mesures
                </h3>
                <div className="space-y-2.5">
                  {MEASURING_TIPS.map((tip, idx) => (
                    <div key={tip.label} className="flex gap-3 bg-brand-ivory/60 rounded-xl p-3.5">
                      <div className="w-7 h-7 rounded-full bg-brand-gold text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-brand-ink text-sm">{tip.label}</p>
                        <p className="text-xs text-brand-ink/60 mt-0.5 leading-relaxed">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Conseils + WhatsApp CTA */}
              <section className="bg-gradient-to-br from-brand-ink via-brand-night to-brand-ink rounded-2xl p-5 md:p-6 text-white relative overflow-hidden">
                <div aria-hidden="true" className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/15 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
                <div className="relative">
                  <h3 className="font-serif text-lg md:text-xl font-bold mb-2">Encore des doutes ?</h3>
                  <p className="text-white/65 text-sm leading-relaxed mb-4">
                    Notre equipe vous conseille personnellement par WhatsApp. Envoyez-nous vos mesures,
                    nous vous indiquons le modele et la taille ideale pour votre morphologie.
                  </p>
                  <a
                    href="https://wa.me/33184180326?text=Bonjour%20SO%20Caftan%2C%20j%27aurais%20besoin%20d%27un%20conseil%20sur%20ma%20taille"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
                  >
                    <MessageCircle size={14} />
                    Me faire conseiller
                  </a>
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SizeGuideModal
