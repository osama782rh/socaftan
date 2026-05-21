import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, Loader2, Check, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

const MONTHS_FR = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
]

const DAYS_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const toIsoDate = (date) => {
  // Renvoie YYYY-MM-DD en UTC pour eviter les drifts de fuseau
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const fromIsoDate = (iso) => {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const daysBetween = (start, end) => {
  const a = fromIsoDate(start)
  const b = fromIsoDate(end)
  if (!a || !b) return 0
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

/**
 * AvailabilityCalendar
 * ====================
 * Selecteur de dates avec visualisation des disponibilites en temps reel.
 *
 * Props :
 *   productId        : ID du produit (requis pour fetch les dates bookees)
 *   selectedStart    : date de debut selectionnee (ISO YYYY-MM-DD)
 *   selectedEnd      : date de fin selectionnee (ISO YYYY-MM-DD)
 *   onChange         : ({startDate, endDate}) => void
 *   minRentalDays    : duree minimale (defaut 1)
 *   maxRentalDays    : duree maximale (defaut 7)
 *   minDate          : date minimale selectionnable (defaut aujourd'hui)
 *
 * Comportement :
 *   - Clic 1 : selectionne start
 *   - Clic 2 : selectionne end (si > start)
 *   - Clic sur une date deja blockee : pas d'effet
 *   - Si la plage selectionnee chevauche une plage bloquee : reset
 */
const AvailabilityCalendar = ({
  productId,
  selectedStart,
  selectedEnd,
  onChange,
  minRentalDays = 1,
  maxRentalDays = 7,
  minDate,
}) => {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const effectiveMinDate = useMemo(() => {
    if (minDate) {
      const m = fromIsoDate(minDate)
      if (m && m > today) return m
    }
    return today
  }, [minDate, today])

  const [viewMonth, setViewMonth] = useState(() => {
    if (selectedStart) {
      const s = fromIsoDate(selectedStart)
      if (s) return new Date(s.getFullYear(), s.getMonth(), 1)
    }
    return new Date(effectiveMinDate.getFullYear(), effectiveMinDate.getMonth(), 1)
  })

  const [blockedDates, setBlockedDates] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch des disponibilites
  useEffect(() => {
    if (!productId) {
      setBlockedDates(new Set())
      return
    }

    let cancelled = false
    setLoading(true)
    setError('')
    ;(async () => {
      try {
        const fromDate = toIsoDate(effectiveMinDate)
        const { data, error: fnError } = await supabase.functions.invoke('product-availability', {
          body: { productId, fromDate },
        })
        if (cancelled) return
        if (fnError) {
          setError('Impossible de charger les disponibilites.')
          return
        }
        const dates = Array.isArray(data?.blockedDates) ? data.blockedDates : []
        setBlockedDates(new Set(dates))
      } catch (err) {
        if (!cancelled) {
          setError('Erreur reseau.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [productId, effectiveMinDate])

  // Genere la grille du mois courant
  const monthGrid = useMemo(() => {
    const year = viewMonth.getFullYear()
    const month = viewMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // On commence le lundi (jour FR)
    let startDayOfWeek = firstDay.getDay() - 1
    if (startDayOfWeek < 0) startDayOfWeek = 6

    const cells = []

    // Cellules vides avant le 1er jour du mois
    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push(null)
    }

    // Jours du mois
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d)
      cells.push(date)
    }

    // Padding pour finir la derniere ligne
    while (cells.length % 7 !== 0) cells.push(null)

    return cells
  }, [viewMonth])

  // Verifie si une plage chevauche des dates bloquees
  const rangeContainsBlocked = useCallback((startIso, endIso) => {
    const start = fromIsoDate(startIso)
    const end = fromIsoDate(endIso)
    if (!start || !end) return false
    const cursor = new Date(start)
    while (cursor <= end) {
      if (blockedDates.has(toIsoDate(cursor))) return true
      cursor.setDate(cursor.getDate() + 1)
    }
    return false
  }, [blockedDates])

  const handleDateClick = (date) => {
    const iso = toIsoDate(date)

    // Date passee ou bloquee
    if (date < effectiveMinDate) return
    if (blockedDates.has(iso)) return

    // Si rien selectionne OU les 2 deja selectionnees -> nouveau debut
    if (!selectedStart || (selectedStart && selectedEnd)) {
      onChange?.({ startDate: iso, endDate: null })
      return
    }

    // Si on a deja un start, on essaie de fixer end
    const startDate = fromIsoDate(selectedStart)
    if (!startDate) {
      onChange?.({ startDate: iso, endDate: null })
      return
    }

    if (date < startDate) {
      // Reset : la cliente clique sur une date anterieure -> nouveau debut
      onChange?.({ startDate: iso, endDate: null })
      return
    }

    const duration = daysBetween(selectedStart, iso) + 1 // inclusive

    if (duration < minRentalDays) {
      onChange?.({ startDate: selectedStart, endDate: toIsoDate(new Date(startDate.getTime() + (minRentalDays - 1) * 86400000)) })
      return
    }
    if (duration > maxRentalDays) {
      // On limite a max
      const maxEndDate = new Date(startDate)
      maxEndDate.setDate(maxEndDate.getDate() + maxRentalDays - 1)
      const candidate = toIsoDate(maxEndDate)
      // Mais verifier que la nouvelle plage ne contient pas de date bloquee
      if (rangeContainsBlocked(selectedStart, candidate)) {
        onChange?.({ startDate: iso, endDate: null })
        return
      }
      onChange?.({ startDate: selectedStart, endDate: candidate })
      return
    }

    // Plage valide ? Verifier qu'elle ne contient pas de date bloquee
    if (rangeContainsBlocked(selectedStart, iso)) {
      // Reset : on retente avec ce clic comme nouveau debut
      onChange?.({ startDate: iso, endDate: null })
      return
    }

    onChange?.({ startDate: selectedStart, endDate: iso })
  }

  const isInSelection = (date) => {
    if (!selectedStart) return false
    const start = fromIsoDate(selectedStart)
    if (!start) return false
    if (!selectedEnd) {
      return toIsoDate(date) === selectedStart
    }
    const end = fromIsoDate(selectedEnd)
    if (!end) return false
    return date >= start && date <= end
  }

  const isSelectionEdge = (date) => {
    if (!selectedStart) return null
    const iso = toIsoDate(date)
    if (iso === selectedStart) return 'start'
    if (iso === selectedEnd) return 'end'
    return null
  }

  const canPrev = useMemo(() => {
    const firstOfView = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1)
    const firstOfMin = new Date(effectiveMinDate.getFullYear(), effectiveMinDate.getMonth(), 1)
    return firstOfView > firstOfMin
  }, [viewMonth, effectiveMinDate])

  const goPrev = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
  }
  const goNext = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
  }

  return (
    <div className="bg-white border border-brand-sand/60 rounded-2xl p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canPrev}
          aria-label="Mois precedent"
          className="w-8 h-8 rounded-full hover:bg-brand-sand/30 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-brand-gold" />
          <h3 className="font-serif text-sm md:text-base font-bold text-brand-ink">
            {MONTHS_FR[viewMonth.getMonth()]} {viewMonth.getFullYear()}
          </h3>
        </div>
        <button
          type="button"
          onClick={goNext}
          aria-label="Mois suivant"
          className="w-8 h-8 rounded-full hover:bg-brand-sand/30 flex items-center justify-center transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Status */}
      {(loading || error) && (
        <div className="mb-3 flex items-center justify-center gap-2 text-xs text-brand-ink/55">
          {loading ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              Chargement des disponibilites...
            </>
          ) : (
            <span className="text-rose-600">{error}</span>
          )}
        </div>
      )}

      {/* Grille jours */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_FR.map((day, idx) => (
          <div key={`${day}-${idx}`} className="text-center text-[10px] font-bold text-brand-ink/40 uppercase">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        <AnimatePresence mode="popLayout">
          {monthGrid.map((date, idx) => {
            if (!date) {
              return <div key={`empty-${idx}`} className="aspect-square" />
            }
            const iso = toIsoDate(date)
            const isPast = date < effectiveMinDate
            const isBlocked = blockedDates.has(iso)
            const inSel = isInSelection(date)
            const edge = isSelectionEdge(date)
            const isDisabled = isPast || isBlocked

            return (
              <motion.button
                key={iso}
                type="button"
                onClick={() => handleDateClick(date)}
                disabled={isDisabled}
                aria-label={`${date.getDate()} ${MONTHS_FR[date.getMonth()]}`}
                aria-pressed={inSel}
                whileTap={isDisabled ? undefined : { scale: 0.92 }}
                className={`
                  aspect-square text-xs md:text-sm rounded-lg flex items-center justify-center font-semibold relative transition-colors
                  ${isDisabled
                    ? isBlocked
                      ? 'bg-rose-50 text-rose-300 cursor-not-allowed line-through'
                      : 'text-brand-ink/20 cursor-not-allowed'
                    : edge
                      ? 'bg-brand-ink text-white shadow-sm'
                      : inSel
                        ? 'bg-brand-gold/25 text-brand-ink'
                        : 'text-brand-ink hover:bg-brand-sand/40'
                  }
                `}
              >
                {date.getDate()}
                {isBlocked && !isPast && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-rose-400" />
                )}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Legende */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[10px] text-brand-ink/55">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-brand-sand/40" />
          Disponible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-rose-50 border border-rose-200" />
          Indisponible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-brand-ink" />
          Selectionne
        </span>
      </div>

      {/* Recap selection */}
      {selectedStart && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-xl bg-brand-ivory/60 border border-brand-sand/40"
        >
          <p className="text-[10px] font-semibold text-brand-ink/45 uppercase tracking-wide mb-1">Vos dates</p>
          {selectedEnd ? (
            <>
              <p className="text-sm font-semibold text-brand-ink">
                Du {fromIsoDate(selectedStart)?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                {' '}au {fromIsoDate(selectedEnd)?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-[11px] text-brand-ink/55 mt-0.5 flex items-center gap-1">
                <Check size={11} className="text-emerald-600" />
                {daysBetween(selectedStart, selectedEnd) + 1} jours · Disponible
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-brand-ink">
                A partir du {fromIsoDate(selectedStart)?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-[11px] text-brand-ink/55 mt-0.5">
                Cliquez sur une date de fin
              </p>
            </>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default AvailabilityCalendar
