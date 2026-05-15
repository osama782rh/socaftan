import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, ChevronRight, Package, Check, Clock, CreditCard,
  Truck, Sparkles, Mail, Loader2, Search, MessageCircle, MapPin, Calendar, FileText,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

const TIMELINE_STEPS = [
  { id: 'paid', label: 'Paiement reçu', icon: CreditCard },
  { id: 'confirmed', label: 'Commande confirmée', icon: Check },
  { id: 'preparing', label: 'En préparation', icon: Sparkles },
  { id: 'ready', label: 'Prête pour livraison', icon: Package },
  { id: 'delivered', label: 'Livrée', icon: Truck },
]

const STATUS_ORDER = ['pending', 'paid', 'confirmed', 'preparing', 'ready', 'delivered', 'returned']

const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
const formatPrice = (value) => `${Number(value || 0).toFixed(2)}€`

const OrderTrackingPage = () => {
  const { orderNumber: orderNumberParam } = useParams()
  const [searchParams] = useSearchParams()
  const emailFromUrl = searchParams.get('email') || ''

  const [orderNumber, setOrderNumber] = useState(orderNumberParam || '')
  const [email, setEmail] = useState(emailFromUrl)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const lookup = async (numberArg, emailArg) => {
    const number = (numberArg || orderNumber || '').trim()
    const mail = (emailArg || email || '').trim().toLowerCase()
    if (!number || !mail) {
      setError('Renseignez votre numero de commande et votre email.')
      return
    }
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const { data, error: fnError } = await supabase.functions.invoke('public-order-status', {
        body: { orderNumber: number, email: mail },
      })
      if (fnError) {
        let backendMsg = ''
        try {
          backendMsg = fnError.context ? await fnError.context.clone().text() : ''
        } catch {
          // ignore
        }
        if (/404|introuvable/i.test(backendMsg) || fnError.context?.status === 404) {
          setError('Aucune commande trouvee avec ce numero et cet email.')
        } else {
          setError('Une erreur est survenue. Veuillez reessayer.')
        }
        return
      }
      if (data?.error) {
        setError(data.error)
        return
      }
      setOrder(data)
    } catch (err) {
      console.warn('[order-tracking]', err)
      setError('Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-lookup si url contient orderNumber + email
  useEffect(() => {
    if (orderNumberParam && emailFromUrl) {
      lookup(orderNumberParam, emailFromUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Calcul de l'etape courante dans la timeline
  const currentStepIdx = order ? TIMELINE_STEPS.findIndex((s) => s.id === order.status) : -1

  return (
    <div className="min-h-screen bg-brand-ivory pt-32 md:pt-36 pb-16">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="container-custom px-5 md:px-10 pb-2">
        <ol className="flex items-center gap-2 text-xs text-brand-ink/55">
          <li>
            <Link to="/" className="hover:text-brand-ink inline-flex items-center gap-1">
              <Home size={12} />
              Accueil
            </Link>
          </li>
          <ChevronRight size={12} className="text-brand-ink/30" />
          <li className="text-brand-ink font-medium">Suivre ma commande</li>
        </ol>
      </nav>

      <div className="container-custom px-5 md:px-10 max-w-2xl">
        {/* Hero */}
        <header className="py-6 md:py-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-semibold uppercase tracking-wide mb-3">
            <Package size={11} />
            Suivi de commande
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-ink font-serif mb-2 leading-tight">
            Suivre ma commande
          </h1>
          <p className="text-brand-ink/65 text-sm md:text-base leading-relaxed">
            Saisissez votre numéro de commande et l'email utilisé pour passer commande.
          </p>
        </header>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            lookup()
          }}
          className="bg-white rounded-2xl border border-brand-sand/60 p-5 md:p-6 mb-6"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-ink/60 mb-1.5">N° de commande</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="SC-XXXXXX"
                className="w-full px-3 py-2.5 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-ink/60 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-3 py-2.5 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !orderNumber || !email}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-brand-ink hover:bg-brand-night text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <><Loader2 size={14} className="animate-spin" />Recherche...</> : <><Search size={14} />Suivre ma commande</>}
          </button>
          {error && (
            <div className="mt-3 bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-700">
              {error}
            </div>
          )}
        </form>

        {/* Result */}
        <AnimatePresence>
          {order && (
            <motion.div
              key={order.orderNumber}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              {/* En-tete commande */}
              <div className="bg-gradient-to-br from-brand-ink via-brand-night to-brand-ink rounded-2xl p-5 md:p-7 text-white relative overflow-hidden">
                <div aria-hidden="true" className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/15 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
                <div className="relative">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-1">Commande</p>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold">{order.orderNumber}</h2>
                  {order.firstName && (
                    <p className="text-white/65 text-sm mt-2">Bonjour {order.firstName}, voici l'avancement :</p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-brand-gold/20 text-brand-gold font-semibold">
                      {order.statusLabel}
                    </span>
                    <span className="text-white/55">
                      <Calendar size={11} className="inline mr-1" />
                      Passee le {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {!['cancelled', 'pending'].includes(order.status) && (
                <div className="bg-white rounded-2xl border border-brand-sand/60 p-5 md:p-7">
                  <h3 className="font-serif text-lg font-bold text-brand-ink mb-5">Avancement de votre commande</h3>

                  <div className="relative">
                    {/* Ligne de fond */}
                    <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-brand-sand/40" />
                    {/* Ligne progression */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: currentStepIdx >= 0 ? `${(currentStepIdx / (TIMELINE_STEPS.length - 1)) * 100}%` : 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="absolute left-[18px] top-2 w-0.5 bg-brand-gold"
                    />

                    <div className="space-y-4">
                      {TIMELINE_STEPS.map((stepDef, idx) => {
                        const Icon = stepDef.icon
                        const isReached = currentStepIdx >= idx
                        const isCurrent = currentStepIdx === idx

                        return (
                          <motion.div
                            key={stepDef.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className="relative pl-12"
                          >
                            <div className={`absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center ${isReached ? 'bg-brand-gold text-white' : 'bg-brand-sand/50 text-brand-ink/35'} ${isCurrent ? 'ring-4 ring-brand-gold/20' : ''}`}>
                              <Icon size={15} />
                            </div>
                            <div className="pt-1.5">
                              <p className={`font-semibold text-sm ${isReached ? 'text-brand-ink' : 'text-brand-ink/40'}`}>
                                {stepDef.label}
                              </p>
                              {isCurrent && (
                                <p className="text-xs text-brand-gold mt-0.5 font-medium">Etape en cours</p>
                              )}
                              {isReached && stepDef.id === 'delivered' && order.deliveredAt && (
                                <p className="text-xs text-brand-ink/50 mt-0.5">Livree le {formatDate(order.deliveredAt)}</p>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Cancellation */}
              {order.status === 'cancelled' && (
                <div className="bg-white rounded-2xl border border-rose-200 p-5 md:p-6 text-center">
                  <p className="text-sm text-rose-600 font-semibold mb-1">Commande annulee</p>
                  <p className="text-xs text-brand-ink/55">Cette commande a ete annulee. Si vous avez des questions, contactez-nous.</p>
                </div>
              )}

              {/* Articles */}
              <div className="bg-white rounded-2xl border border-brand-sand/60 p-5 md:p-7">
                <h3 className="font-serif text-lg font-bold text-brand-ink mb-4">Articles ({order.items.length})</h3>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 pb-3 border-b border-brand-sand/30 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-semibold text-brand-ink text-sm">{item.name}</p>
                        <p className="text-xs text-brand-ink/55 mt-0.5">
                          {item.type === 'location' ? 'Location' : 'Achat'} · x{item.quantity}
                        </p>
                        {item.rentalStartDate && (
                          <p className="text-[11px] text-brand-ink/45 mt-0.5">
                            Du {formatDate(item.rentalStartDate)}
                            {item.rentalEndDate ? ` au ${formatDate(item.rentalEndDate)}` : ''}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold text-brand-ink text-sm whitespace-nowrap">
                        {formatPrice(Number(item.unitPrice) * Number(item.quantity))}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totaux */}
                <div className="mt-4 pt-4 border-t border-brand-sand/40 space-y-1.5 text-sm">
                  <div className="flex justify-between text-brand-ink/65">
                    <span>Sous-total</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.deposit > 0 && (
                    <div className="flex justify-between text-brand-ink/65">
                      <span>Caution</span>
                      <span>{formatPrice(order.deposit)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-brand-ink pt-2 border-t border-brand-sand/30">
                    <span>Total</span>
                    <span className="font-serif">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Facture */}
              {(order.invoicePdfUrl || order.invoiceHostedUrl) && (
                <div className="bg-white rounded-2xl border border-brand-sand/60 p-5 md:p-7">
                  <h3 className="font-serif text-lg font-bold text-brand-ink mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-brand-gold" />
                    Facture
                  </h3>
                  {order.invoiceNumber && (
                    <p className="text-xs text-brand-ink/55 mb-3">
                      N° <span className="font-mono text-brand-ink">{order.invoiceNumber}</span>
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {order.invoicePdfUrl && (
                      <a
                        href={order.invoicePdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-ink text-white text-xs font-semibold hover:bg-brand-night transition-colors"
                      >
                        <FileText size={11} />
                        Telecharger PDF
                      </a>
                    )}
                    {order.invoiceHostedUrl && (
                      <a
                        href={order.invoiceHostedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-brand-sand text-brand-ink/70 text-xs font-semibold hover:bg-brand-sand/20"
                      >
                        Voir en ligne
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Livraison */}
              {(order.deliveryMethod || order.deliveryCity) && (
                <div className="bg-white rounded-2xl border border-brand-sand/60 p-5 md:p-7">
                  <h3 className="font-serif text-lg font-bold text-brand-ink mb-3 flex items-center gap-2">
                    <MapPin size={16} className="text-brand-gold" />
                    Livraison
                  </h3>
                  <p className="text-sm text-brand-ink/65">
                    Mode : <strong className="text-brand-ink">{order.deliveryMethod === 'delivery' ? 'Livraison' : order.deliveryMethod === 'pickup' ? 'Retrait sur RDV' : order.deliveryMethod || '-'}</strong>
                  </p>
                  {order.deliveryCity && (
                    <p className="text-sm text-brand-ink/65 mt-1">
                      Ville : <strong className="text-brand-ink">{order.deliveryCity}</strong>
                    </p>
                  )}
                </div>
              )}

              {/* CTA support */}
              <div className="bg-brand-ivory/60 rounded-2xl p-4 md:p-5 text-center">
                <p className="text-xs text-brand-ink/65 mb-2">
                  Une question sur votre commande ?
                </p>
                <a
                  href={`https://wa.me/33184180326?text=Bonjour%20SO%20Caftan%2C%20j%27ai%20une%20question%20sur%20la%20commande%20${encodeURIComponent(order.orderNumber)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
                >
                  <MessageCircle size={12} />
                  Contacter le service client
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Aide */}
        {!order && !loading && (
          <div className="bg-white rounded-2xl border border-brand-sand/60 p-5 md:p-6 text-center">
            <Mail size={22} className="text-brand-ink/30 mx-auto mb-2" />
            <p className="text-sm text-brand-ink/65">
              Vous trouverez votre numero de commande dans l'email de confirmation que nous vous avons envoye.
            </p>
            <p className="text-xs text-brand-ink/45 mt-2">
              Pas de mail ?{' '}
              <a href="https://wa.me/33184180326" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline font-semibold">
                Contactez-nous sur WhatsApp
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderTrackingPage
