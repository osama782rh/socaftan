import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { X, ArrowRight, Info } from 'lucide-react'
import { useUiFeedback } from '../contexts/UiFeedbackContext'
import SizeGuideButton from './SizeGuideButton'
import AvailabilityCalendar from './AvailabilityCalendar'

const DEFAULT_RENTAL_DAYS = 5

const RentalDateModal = ({ product, onConfirm, onClose }) => {
  const { notifyError } = useUiFeedback()

  const tomorrow = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  }, [])

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const formatDateFr = (dateStr) => {
    if (!dateStr) return ''
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const handleDateChange = ({ startDate: newStart, endDate: newEnd }) => {
    setStartDate(newStart || '')
    setEndDate(newEnd || '')
  }

  const handleConfirm = () => {
    if (!startDate) {
      notifyError('Veuillez selectionner une date de debut.')
      return
    }
    if (!endDate) {
      notifyError('Veuillez selectionner une date de fin (cliquez sur une date apres celle de debut).')
      return
    }
    onConfirm({ startDate, endDate })
  }

  // Calcul du nombre de jours
  const numberOfDays = startDate && endDate
    ? Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1
    : DEFAULT_RENTAL_DAYS

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 md:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 z-10 w-9 h-9 bg-brand-sand/50 rounded-full flex items-center justify-center hover:bg-brand-sand transition-colors"
        >
          <X size={16} className="text-brand-ink" />
        </button>

        <div className="p-5 md:p-7">
          {/* Product info */}
          <div className="flex items-center gap-4 mb-5">
            <img
              src={product.image}
              alt={`${product.name} - ${product.category || 'tenue orientale'} en location chez SO Caftan`}
              loading="lazy"
              decoding="async"
              className="w-16 h-20 rounded-xl object-cover shrink-0"
            />
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand-gold font-semibold">
                Location
              </p>
              <h3 className="text-lg md:text-xl font-bold text-brand-ink font-serif">{product.name}</h3>
              <p className="text-sm text-brand-ink/45">{product.rentalPrice}€ / {numberOfDays} jours</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-3 flex items-start gap-2 text-xs text-brand-ink/55">
            <Info size={12} className="shrink-0 mt-0.5 text-brand-gold" />
            <p>
              Cliquez sur votre <strong className="text-brand-ink">date de retrait</strong>, puis sur votre
              <strong className="text-brand-ink"> date de retour</strong>. Les dates indisponibles sont en rouge.
            </p>
          </div>

          {/* Calendrier de disponibilites */}
          <AvailabilityCalendar
            productId={product.id}
            selectedStart={startDate}
            selectedEnd={endDate}
            onChange={handleDateChange}
            minDate={tomorrow}
            minRentalDays={3}
            maxRentalDays={7}
          />

          {/* Recap caution + livraison */}
          {startDate && endDate && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-ivory rounded-xl p-4 mt-4"
            >
              <div className="flex items-start gap-2">
                <Info size={14} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <div className="text-xs text-brand-ink/65 leading-relaxed">
                  <p><strong className="text-brand-ink">Retrait :</strong> {formatDateFr(startDate)}</p>
                  <p><strong className="text-brand-ink">Retour :</strong> {formatDateFr(endDate)}</p>
                  <p className="mt-1.5 text-[11px] text-brand-ink/45">
                    Caution de 100€ restituee si la piece est rendue en bon etat. Livraison ou retrait sur rendez-vous a Tigery (91).
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Lien guide des tailles */}
          <div className="mt-4 text-center">
            <SizeGuideButton variant="link" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-brand-sand text-brand-ink/60 text-sm font-semibold hover:bg-brand-sand/30 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={!startDate || !endDate}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-brand-ink text-white text-sm font-semibold hover:bg-brand-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
