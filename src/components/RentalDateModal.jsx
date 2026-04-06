import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Calendar, ArrowRight, Info } from 'lucide-react'
import { useUiFeedback } from '../contexts/UiFeedbackContext'

const RENTAL_DAYS = 5

const RentalDateModal = ({ product, onConfirm, onClose }) => {
  const { notifyError } = useUiFeedback()
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const [startDate, setStartDate] = useState('')

  const getEndDate = (start) => {
    if (!start) return ''
    const end = new Date(start)
    end.setDate(end.getDate() + RENTAL_DAYS - 1)
    return end.toISOString().split('T')[0]
  }

  const endDate = getEndDate(startDate)

  const formatDateFr = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const handleConfirm = () => {
    if (!startDate) {
      notifyError('Veuillez selectionner une date de debut.')
      return
    }
    onConfirm({
      startDate,
      endDate,
    })
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 w-9 h-9 bg-brand-sand/50 rounded-full flex items-center justify-center hover:bg-brand-sand transition-colors"
        >
          <X size={16} className="text-brand-ink" />
        </button>

        <div className="p-6 md:p-8">
          {/* Product info */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-20 rounded-xl object-cover"
            />
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand-gold font-semibold">
                Location
              </p>
              <h3 className="text-xl font-bold text-brand-ink font-serif">{product.name}</h3>
              <p className="text-sm text-brand-ink/40">{product.rentalPrice}€ / {RENTAL_DAYS} jours</p>
            </div>
          </div>

          {/* Date picker */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-brand-ink mb-2">
              Date de début de location
            </label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/30" />
              <input
                type="date"
                value={startDate}
                min={minDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm bg-brand-ivory/50"
              />
            </div>
          </div>

          {/* Summary */}
          {startDate && (
            <div className="bg-brand-ivory rounded-xl p-4 mb-5">
              <div className="flex items-start gap-2">
                <Info size={14} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <div className="text-sm text-brand-ink/60">
                  <p><strong className="text-brand-ink">Retrait :</strong> {formatDateFr(startDate)}</p>
                  <p><strong className="text-brand-ink">Retour :</strong> {formatDateFr(endDate)}</p>
                  <p className="mt-1 text-xs text-brand-ink/40">
                    Caution de 100€ restituée uniquement si la pièce est rendue dans l'état fourni
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-brand-sand text-brand-ink/60 text-sm font-semibold hover:bg-brand-sand/30 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-brand-ink text-white text-sm font-semibold hover:bg-brand-ink/90 transition-colors"
            >
              Ajouter au panier
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RentalDateModal
