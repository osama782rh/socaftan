import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Package, AlertCircle, Calendar } from 'lucide-react'

const MONTHS_FR = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
]
const DAYS_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const ACTIVE_STATUSES = new Set(['paid', 'confirmed', 'preparing', 'ready', 'delivered'])

const toIsoDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const fromIsoDate = (iso) => {
  if (!iso) return null
  const [y, m, d] = iso.substring(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d)
}

/**
 * AdminRentalPlanning
 * ===================
 * Vue calendrier de toutes les locations actives a venir.
 * Aide Sara a voir d'un coup d'oeil le planning d'occupation.
 *
 * Props :
 *   orders : tableau de commandes (avec items et order_items.rental_*)
 */
const AdminRentalPlanning = ({ orders = [] }) => {
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  // Extrait toutes les locations en cours / a venir
  const rentals = useMemo(() => {
    const result = []
    for (const order of orders) {
      if (!ACTIVE_STATUSES.has(order.status)) continue
      const items = order.items || []
      for (const item of items) {
        if (item.item_type !== 'location') continue
        if (!item.rental_start_date || !item.rental_end_date) continue
        result.push({
          orderId: order.id,
          orderNumber: order.order_number,
          status: order.status,
          customerName: `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim() || 'Cliente',
          productName: item.products?.name || 'Article',
          productCategory: item.products?.category || '',
          start: item.rental_start_date.substring(0, 10),
          end: item.rental_end_date.substring(0, 10),
        })
      }
    }
    return result.sort((a, b) => a.start.localeCompare(b.start))
  }, [orders])

  // Grille du mois courant
  const monthGrid = useMemo(() => {
    const year = viewMonth.getFullYear()
    const month = viewMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    let startDayOfWeek = firstDay.getDay() - 1
    if (startDayOfWeek < 0) startDayOfWeek = 6

    const cells = []
    for (let i = 0; i < startDayOfWeek; i++) cells.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) {
      cells.push(new Date(year, month, d))
    }
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [viewMonth])

  // Pour chaque cellule, on cherche les locations qui couvrent cette date
  const rentalsByDate = useMemo(() => {
    const map = new Map()
    for (const rental of rentals) {
      const start = fromIsoDate(rental.start)
      const end = fromIsoDate(rental.end)
      if (!start || !end) continue
      const cursor = new Date(start)
      while (cursor <= end) {
        const key = toIsoDate(cursor)
        if (!map.has(key)) map.set(key, [])
        map.get(key).push(rental)
        cursor.setDate(cursor.getDate() + 1)
      }
    }
    return map
  }, [rentals])

  // Locations du mois en cours pour la liste cote droit
  const monthRentals = useMemo(() => {
    const year = viewMonth.getFullYear()
    const month = viewMonth.getMonth()
    const firstOfMonth = new Date(year, month, 1)
    const lastOfMonth = new Date(year, month + 1, 0)
    const firstIso = toIsoDate(firstOfMonth)
    const lastIso = toIsoDate(lastOfMonth)

    return rentals
      .filter((r) => r.end >= firstIso && r.start <= lastIso)
      .sort((a, b) => a.start.localeCompare(b.start))
  }, [rentals, viewMonth])

  // Detection des conflits (memes dates, meme produit)
  const conflictedRentalIds = useMemo(() => {
    const map = new Map()
    for (const rental of rentals) {
      const start = fromIsoDate(rental.start)
      const end = fromIsoDate(rental.end)
      if (!start || !end) continue
      const cursor = new Date(start)
      while (cursor <= end) {
        const key = `${rental.productName}-${toIsoDate(cursor)}`
        if (!map.has(key)) map.set(key, [])
        map.get(key).push(rental.orderId)
        cursor.setDate(cursor.getDate() + 1)
      }
    }
    const conflicts = new Set()
    for (const ids of map.values()) {
      if (ids.length > 1) {
        ids.forEach((id) => conflicts.add(id))
      }
    }
    return conflicts
  }, [rentals])

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const goPrev = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
  const goNext = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
  const goToday = () => setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1))

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-brand-sand/60 p-4 md:p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-lg font-bold text-brand-ink font-serif flex items-center gap-2">
              <Calendar size={18} className="text-brand-gold" />
              Planning des locations
            </h2>
            <p className="text-xs text-brand-ink/55 mt-0.5">
              Vue d'ensemble des reservations actives (paid, confirmed, preparing, ready, delivered)
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Mois precedent"
              className="w-9 h-9 rounded-full hover:bg-brand-sand/30 flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={goToday}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border border-brand-sand/70 hover:bg-brand-sand/20 text-brand-ink/65"
            >
              Aujourd'hui
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Mois suivant"
              className="w-9 h-9 rounded-full hover:bg-brand-sand/30 flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
            <span className="ml-3 font-serif text-base font-bold text-brand-ink">
              {MONTHS_FR[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </span>
          </div>
        </div>
      </div>

      {/* Alerte conflits */}
      {conflictedRentalIds.size > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Attention : conflit detecte</p>
            <p className="text-xs mt-0.5">
              {conflictedRentalIds.size} commandes ont au moins une date qui se chevauche sur le meme produit.
              Verifier les locations marquees en rouge ci-dessous.
            </p>
          </div>
        </div>
      )}

      {/* Grille calendrier */}
      <div className="bg-white rounded-2xl border border-brand-sand/60 p-4 md:p-5">
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          {DAYS_FR.map((day, idx) => (
            <div key={`${day}-${idx}`} className="text-center text-[10px] font-bold text-brand-ink/40 uppercase">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {monthGrid.map((date, idx) => {
            if (!date) {
              return <div key={`empty-${idx}`} className="aspect-square" />
            }
            const iso = toIsoDate(date)
            const dayRentals = rentalsByDate.get(iso) || []
            const isToday = date.getTime() === today.getTime()
            const isPast = date < today
            const hasConflict = dayRentals.some((r) => conflictedRentalIds.has(r.orderId))

            return (
              <motion.div
                key={iso}
                whileHover={{ scale: dayRentals.length > 0 ? 1.05 : 1 }}
                className={`
                  aspect-square rounded-lg p-1 flex flex-col text-[10px] relative cursor-default
                  ${hasConflict
                    ? 'bg-rose-100 border border-rose-300'
                    : dayRentals.length > 0
                      ? 'bg-brand-gold/15 border border-brand-gold/40'
                      : 'bg-brand-ivory/30 border border-transparent'
                  }
                  ${isPast ? 'opacity-50' : ''}
                `}
                title={dayRentals.map((r) => `${r.productName} - ${r.customerName} (${r.orderNumber})`).join('\n')}
              >
                <span className={`text-[10px] md:text-xs font-semibold ${isToday ? 'text-brand-gold' : 'text-brand-ink/65'}`}>
                  {date.getDate()}
                </span>
                {dayRentals.length > 0 && (
                  <div className="flex-1 flex items-center justify-center">
                    <span className={`text-[10px] font-bold ${hasConflict ? 'text-rose-700' : 'text-brand-ink'}`}>
                      {dayRentals.length}
                    </span>
                  </div>
                )}
                {isToday && (
                  <span aria-hidden="true" className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-brand-gold" />
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Legende */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[10px] text-brand-ink/55">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-brand-gold/15 border border-brand-gold/40" />
            Reservee
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-100 border border-rose-300" />
            Conflit (a verifier)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-brand-ivory/30 border border-transparent" />
            Libre
          </span>
        </div>
      </div>

      {/* Liste des locations du mois */}
      <div className="bg-white rounded-2xl border border-brand-sand/60 p-4 md:p-5">
        <h3 className="text-base font-bold text-brand-ink font-serif mb-3">
          Locations en {MONTHS_FR[viewMonth.getMonth()]} ({monthRentals.length})
        </h3>
        {monthRentals.length === 0 ? (
          <p className="text-sm text-brand-ink/45 text-center py-6">
            Aucune location active ce mois-ci.
          </p>
        ) : (
          <div className="space-y-2">
            {monthRentals.map((rental, idx) => {
              const inConflict = conflictedRentalIds.has(rental.orderId)
              const startD = fromIsoDate(rental.start)
              const endD = fromIsoDate(rental.end)
              return (
                <div
                  key={`${rental.orderId}-${idx}`}
                  className={`flex items-start justify-between gap-3 p-3 rounded-xl border ${inConflict ? 'bg-rose-50 border-rose-200' : 'bg-brand-ivory/40 border-brand-sand/40'}`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${inConflict ? 'bg-rose-100' : 'bg-brand-gold/15'}`}>
                      <Package size={14} className={inConflict ? 'text-rose-600' : 'text-brand-gold'} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-brand-ink">{rental.productName}</p>
                      <p className="text-xs text-brand-ink/55 truncate">{rental.customerName} · {rental.orderNumber}</p>
                      {inConflict && (
                        <p className="text-[10px] text-rose-700 font-semibold mt-0.5 flex items-center gap-1">
                          <AlertCircle size={9} />
                          Conflit detecte
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs shrink-0">
                    <p className="font-semibold text-brand-ink">
                      {startD?.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      {' '}→{' '}
                      {endD?.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                    </p>
                    <p className="text-[10px] text-brand-ink/45 mt-0.5 capitalize">{rental.status}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminRentalPlanning
