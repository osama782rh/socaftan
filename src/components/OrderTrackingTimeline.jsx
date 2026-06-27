import { motion } from 'framer-motion'
import { CreditCard, Check, Sparkles, Package, Truck, ExternalLink, Calendar } from 'lucide-react'
import { buildTrackingUrl, getCarrierName } from '../lib/carriers'

const TIMELINE_STEPS = [
  { id: 'paid', label: 'Paiement recu', icon: CreditCard },
  { id: 'confirmed', label: 'Commande confirmee', icon: Check },
  { id: 'preparing', label: 'En preparation', icon: Sparkles },
  { id: 'ready', label: 'Expediee / prete', icon: Package },
  { id: 'delivered', label: 'Livree', icon: Truck },
]

const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Timeline visuelle du suivi de commande, reutilisable.
 *
 * Props :
 *   status                  : 'paid'|'confirmed'|'preparing'|'ready'|'delivered'|...
 *   trackingCarrier         : id du transporteur (ex: 'chronopost')
 *   trackingNumber          : n° de suivi
 *   trackingUrl             : URL explicite (sinon auto-construite)
 *   estimatedDeliveryDate   : date estimee (ISO)
 *   deliveredAt             : timestamp de livraison effective
 *   shippedAt               : timestamp d'expedition
 */
const OrderTrackingTimeline = ({
  status,
  trackingCarrier,
  trackingNumber,
  trackingUrl,
  estimatedDeliveryDate,
  deliveredAt,
  shippedAt,
}) => {
  const currentStepIdx = TIMELINE_STEPS.findIndex((s) => s.id === status)
  const url = buildTrackingUrl({ carrier: trackingCarrier, number: trackingNumber, explicitUrl: trackingUrl })

  if (status === 'cancelled' || status === 'pending') {
    return null
  }

  return (
    <div className="rounded-xl border border-brand-sand/40 bg-brand-ivory/30 p-4 md:p-5">
      <p className="text-[11px] font-semibold text-brand-ink/40 uppercase tracking-wide mb-4 flex items-center gap-1.5">
        <Truck size={11} className="text-brand-gold" />
        Suivi de livraison
      </p>

      {/* Timeline */}
      <div className="relative">
        {/* Ligne de fond */}
        <div className="absolute left-[14px] top-2 bottom-2 w-0.5 bg-brand-sand/40" />
        {/* Ligne de progression */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: currentStepIdx >= 0 ? `${(currentStepIdx / (TIMELINE_STEPS.length - 1)) * 100}%` : 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute left-[14px] top-2 w-0.5 bg-brand-gold"
        />

        <div className="space-y-3">
          {TIMELINE_STEPS.map((stepDef, idx) => {
            const Icon = stepDef.icon
            const isReached = currentStepIdx >= idx
            const isCurrent = currentStepIdx === idx
            return (
              <motion.div
                key={stepDef.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="relative pl-10"
              >
                <div className={`absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center ${isReached ? 'bg-brand-gold text-white' : 'bg-brand-sand/50 text-brand-ink/35'} ${isCurrent ? 'ring-4 ring-brand-gold/20' : ''}`}>
                  <Icon size={12} />
                </div>
                <div className="pt-1">
                  <p className={`text-sm font-semibold ${isReached ? 'text-brand-ink' : 'text-brand-ink/40'}`}>
                    {stepDef.label}
                  </p>
                  {isCurrent && (
                    <p className="text-[11px] text-brand-gold mt-0.5 font-medium">Etape en cours</p>
                  )}
                  {isReached && stepDef.id === 'ready' && shippedAt && (
                    <p className="text-[11px] text-brand-ink/50 mt-0.5">Expediee le {formatDate(shippedAt)}</p>
                  )}
                  {isReached && stepDef.id === 'delivered' && deliveredAt && (
                    <p className="text-[11px] text-brand-ink/50 mt-0.5">Livree le {formatDate(deliveredAt)}</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Detail transporteur */}
      {(trackingCarrier || trackingNumber || estimatedDeliveryDate) && (
        <div className="mt-4 pt-4 border-t border-brand-sand/40 space-y-2 text-xs">
          {trackingCarrier && (
            <div className="flex items-center justify-between">
              <span className="text-brand-ink/50">Transporteur</span>
              <span className="font-semibold text-brand-ink">{getCarrierName(trackingCarrier)}</span>
            </div>
          )}
          {trackingNumber && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-brand-ink/50 shrink-0">N° de suivi</span>
              <span className="font-mono font-semibold text-brand-ink text-right truncate">{trackingNumber}</span>
            </div>
          )}
          {estimatedDeliveryDate && status !== 'delivered' && (
            <div className="flex items-center justify-between">
              <span className="text-brand-ink/50 flex items-center gap-1">
                <Calendar size={10} />
                Livraison estimee
              </span>
              <span className="font-semibold text-brand-ink">{formatDate(estimatedDeliveryDate)}</span>
            </div>
          )}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-brand-ink text-white text-xs font-semibold hover:bg-brand-night transition-colors"
            >
              <ExternalLink size={11} />
              Suivre mon colis sur {getCarrierName(trackingCarrier)}
            </a>
          )}
        </div>
      )}

      {/* Message si pas encore de tracking */}
      {!trackingNumber && currentStepIdx >= 2 && status !== 'delivered' && (
        <div className="mt-4 pt-4 border-t border-brand-sand/40">
          <p className="text-[11px] text-brand-ink/55 leading-relaxed">
            💡 Le numero de suivi sera renseigne par SO Caftan des l'expedition de votre colis.
            Vous recevrez egalement un email de confirmation.
          </p>
        </div>
      )}
    </div>
  )
}

export default OrderTrackingTimeline
