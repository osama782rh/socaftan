import { useEffect, useState } from 'react'
import { Star, Gift, Sparkles, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const STEP = 5

/**
 * Carte affichant la progression du programme de fidelite SO Caftan.
 * - Compte les locations validees (paid/confirmed/preparing/ready/delivered/returned)
 * - Affiche progression visuelle vers le prochain palier de 5
 * - Affiche les jetons disponibles a utiliser
 */
const LoyaltyProgressCard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalRentals: 0, availableRewards: 0, usedRewards: 0 })

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        // Compte les locations validees
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('id, status, order_type')
          .eq('user_id', user.id)

        if (cancelled) return
        if (ordersError) throw ordersError

        const validRentalStatuses = ['paid', 'confirmed', 'preparing', 'ready', 'delivered', 'returned']
        const totalRentals = (orders || []).filter(
          (o) => validRentalStatuses.includes(o.status) && (o.order_type || 'location') === 'location',
        ).length

        // Compte les jetons disponibles vs utilises
        const { data: rewards, error: rewardsError } = await supabase
          .from('loyalty_rewards')
          .select('id, consumed_at')
          .eq('user_id', user.id)

        if (cancelled) return
        if (rewardsError) throw rewardsError

        const availableRewards = (rewards || []).filter((r) => !r.consumed_at).length
        const usedRewards = (rewards || []).filter((r) => r.consumed_at).length

        setStats({ totalRentals, availableRewards, usedRewards })
      } catch (err) {
        console.warn('[loyalty] Load error:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user])

  if (!user) return null

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-brand-sand/60 p-6 flex items-center justify-center min-h-[140px]">
        <Loader2 size={20} className="animate-spin text-brand-ink/30" />
      </div>
    )
  }

  // Position dans le palier courant (0 a STEP-1)
  const positionInLevel = stats.totalRentals % STEP
  const remainingForNextReward = STEP - positionInLevel
  const progressPct = (positionInLevel / STEP) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-brand-ink via-brand-night to-brand-ink rounded-2xl p-6 md:p-7 text-white relative overflow-hidden"
    >
      {/* Decoration */}
      <div aria-hidden="true" className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/15 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-semibold uppercase tracking-widest mb-2">
              <Sparkles size={10} />
              Fidelite
            </div>
            <h3 className="font-serif text-xl md:text-2xl font-bold leading-tight">
              {stats.availableRewards > 0
                ? `${stats.availableRewards} location${stats.availableRewards > 1 ? 's' : ''} offerte${stats.availableRewards > 1 ? 's' : ''} !`
                : 'Vos prochaines locations'}
            </h3>
          </div>
          {stats.availableRewards > 0 && (
            <div className="shrink-0 bg-brand-gold rounded-2xl p-2.5 shadow-lg">
              <Gift size={20} className="text-brand-ink" />
            </div>
          )}
        </div>

        {stats.availableRewards > 0 && (
          <div className="bg-brand-gold/15 border border-brand-gold/30 rounded-xl p-3 mb-4">
            <p className="text-sm text-brand-gold leading-snug">
              ✨ Felicitations ! Vous avez <strong>{stats.availableRewards}</strong> location{stats.availableRewards > 1 ? 's' : ''} offerte{stats.availableRewards > 1 ? 's' : ''}.
              Contactez-nous via WhatsApp pour l'utiliser sur votre prochaine reservation.
            </p>
          </div>
        )}

        {/* Progression vers le prochain palier */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Progression</span>
            <span className="font-semibold text-white">
              {positionInLevel}/{STEP} locations
            </span>
          </div>

          {/* Barre */}
          <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-brand-gold to-yellow-400 rounded-full"
            />
          </div>

          {/* Etoiles */}
          <div className="flex items-center justify-between mt-3">
            {[1, 2, 3, 4, 5].map((idx) => {
              const filled = idx <= positionInLevel
              return (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: filled ? 1 : 0.85, opacity: filled ? 1 : 0.4 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${filled ? 'bg-brand-gold text-brand-ink' : 'bg-white/10 text-white/40'}`}
                >
                  <Star size={14} className={filled ? 'fill-current' : ''} />
                </motion.div>
              )
            })}
          </div>

          <p className="text-xs text-white/55 mt-3 leading-relaxed">
            {remainingForNextReward === STEP
              ? `Effectuez 5 locations pour gagner une location offerte. Vous avez deja realise ${stats.totalRentals} location${stats.totalRentals > 1 ? 's' : ''} au total.`
              : `Plus que ${remainingForNextReward} location${remainingForNextReward > 1 ? 's' : ''} pour gagner une location offerte (${stats.totalRentals} au total).`}
          </p>
        </div>

        {stats.usedRewards > 0 && (
          <p className="text-[11px] text-white/40 mt-4 pt-4 border-t border-white/10">
            🎁 Vous avez deja utilise <strong className="text-white/60">{stats.usedRewards}</strong> recompense{stats.usedRewards > 1 ? 's' : ''} fidelite.
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default LoyaltyProgressCard
