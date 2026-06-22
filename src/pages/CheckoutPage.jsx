import { useState, useMemo } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Calendar, ShoppingBag, MapPin, Truck } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useUiFeedback } from '../contexts/UiFeedbackContext'
import { trackEvent } from '../lib/analytics'

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const SHIPPING_FEE = 6.99 // Frais de livraison Ile-de-France

const CheckoutPage = () => {
  const { items, subtotal, deposit, total, clearCart } = useCart()
  const { user, profile } = useAuth()
  const { notifyError } = useUiFeedback()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState('pickup')
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: profile?.address || '',
    city: profile?.city || '',
    postal_code: profile?.postal_code || '',
  })
  const [notes, setNotes] = useState('')

  // Carte cadeau
  const [giftCardCode, setGiftCardCode] = useState('')
  const [giftCardInfo, setGiftCardInfo] = useState(null) // { valid, balance, ... }
  const [giftCardError, setGiftCardError] = useState('')
  const [validatingCard, setValidatingCard] = useState(false)

  // Frais de livraison
  const shippingFee = useMemo(() => (deliveryMethod === 'delivery' ? SHIPPING_FEE : 0), [deliveryMethod])
  const finalTotal = useMemo(() => Number((total + shippingFee).toFixed(2)), [total, shippingFee])

  const normalize = (value) =>
    String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()

  const resolveCartProductIds = async (cartItems) => {
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, category')

    if (error) {
      throw new Error('Impossible de verifier les produits avant commande.')
    }

    const ids = new Set(products.map((product) => Number(product.id)))
    const byNameAndCategory = new Map()
    const byName = new Map()

    for (const product of products) {
      const normalizedName = normalize(product.name)
      const normalizedCategory = normalize(product.category)
      byNameAndCategory.set(`${normalizedName}::${normalizedCategory}`, Number(product.id))
      if (!byName.has(normalizedName)) {
        byName.set(normalizedName, Number(product.id))
      }
    }

    const resolvedByCartItemId = {}
    const unresolvedItems = []

    for (const item of cartItems) {
      const rawId = Number(item.productId)
      let resolvedId = Number.isInteger(rawId) && ids.has(rawId) ? rawId : null

      if (!resolvedId) {
        const key = `${normalize(item.name)}::${normalize(item.category)}`
        resolvedId = byNameAndCategory.get(key) || byName.get(normalize(item.name)) || null
      }

      if (!resolvedId) {
        unresolvedItems.push(item.name)
        continue
      }

      resolvedByCartItemId[item.id] = resolvedId
    }

    if (unresolvedItems.length > 0) {
      throw new Error(`Articles introuvables: ${[...new Set(unresolvedItems)].join(', ')}. Videz le panier et reessayez.`)
    }

    return resolvedByCartItemId
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center px-5 pt-28 pb-20">
        <div className="text-center">
          <Lock size={48} className="text-brand-ink/20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-brand-ink font-serif mb-3">Connexion requise</h2>
          <p className="text-brand-ink/50 text-sm mb-6">Connectez-vous pour finaliser votre commande.</p>
          <Link
            to="/connexion"
            state={{ from: '/checkout' }}
            className="inline-flex items-center gap-2 bg-brand-ink text-white px-8 py-3 rounded-full font-semibold text-sm"
          >
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center px-5 pt-28 pb-20">
        <div className="text-center">
          <ShoppingBag size={48} className="text-brand-ink/20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-brand-ink font-serif mb-3">Panier vide</h2>
          <p className="text-brand-ink/50 text-sm mb-6">Ajoutez des articles avant de passer commande.</p>
          <a href="/#collection" className="inline-flex items-center gap-2 bg-brand-ink text-white px-8 py-3 rounded-full font-semibold text-sm">
            Voir la collection
          </a>
        </div>
      </div>
    )
  }

  const hasRentals = items.some(item => item.type === 'location')
  const hasPurchases = items.some(item => item.type === 'achat')
  const orderType = hasRentals && hasPurchases ? 'location' : hasRentals ? 'location' : 'achat'
  const isStripeReturn = new URLSearchParams(location.search).get('from') === 'stripe'

  const handleBack = () => {
    if (isStripeReturn) {
      navigate('/')
      return
    }

    navigate(-1)
  }

  const extractFunctionErrorMessage = async (fnError, fnData) => {
    let backendError = ''

    if (fnError?.context) {
      try {
        const errorJson = await fnError.context.clone().json()
        if (typeof errorJson?.error === 'string') {
          backendError = errorJson.error
        } else if (typeof errorJson?.message === 'string') {
          backendError = errorJson.message
        }
      } catch {
        try {
          backendError = await fnError.context.clone().text()
        } catch {
          backendError = ''
        }
      }
    }

    const raw = backendError || fnData?.error || fnError?.message || 'Erreur lors du paiement.'
    return typeof raw === 'string' ? raw : JSON.stringify(raw)
  }

  const handleCheckout = async () => {
    if (deliveryMethod === 'delivery') {
      const missingAddress = !String(deliveryInfo.address || '').trim()
      const missingCity = !String(deliveryInfo.city || '').trim()
      const missingPostalCode = !String(deliveryInfo.postal_code || '').trim()
      if (missingAddress || missingCity || missingPostalCode) {
        notifyError('Pour la livraison, renseignez adresse, ville et code postal.')
        return
      }
    }

    setLoading(true)
    let createdOrderId = null

    try {
      const resolvedProductIds = await resolveCartProductIds(items)

      // 1. Créer la commande dans Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: '',
          status: 'pending',
          order_type: orderType,
          subtotal,
          deposit_amount: deposit,
          shipping_fee: shippingFee,
          total: finalTotal,
          delivery_method: deliveryMethod,
          delivery_address: deliveryMethod === 'delivery' ? deliveryInfo.address : '',
          delivery_city: deliveryMethod === 'delivery' ? deliveryInfo.city : '',
          delivery_postal_code: deliveryMethod === 'delivery' ? deliveryInfo.postal_code : '',
          notes,
        })
        .select()
        .single()

      if (orderError) throw orderError
      createdOrderId = order.id

      // 2. Ajouter les articles
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: resolvedProductIds[item.id],
        item_type: item.type,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        rental_start_date: item.rentalStartDate || null,
        rental_end_date: item.rentalEndDate || null,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      let { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData?.session?.access_token) {
        const { data: refreshed } = await supabase.auth.refreshSession()
        sessionData = refreshed
      }
      const accessToken = sessionData?.session?.access_token || ''
      if (!accessToken) {
        throw new Error('Session expirée ou invalide. Veuillez vous reconnecter puis réessayer.')
      }

      const gatewayHeaders = supabaseAnonKey
        ? { Authorization: `Bearer ${supabaseAnonKey}`, apikey: supabaseAnonKey }
        : {}

      // 3. Rediriger vers Stripe Checkout
      const { data: stripeData, error: stripeError } = await supabase.functions.invoke('create-checkout', {
        body: {
          orderId: order.id,
          userId: user.id,
          customerEmail: user.email,
          accessToken,
          ...(giftCardInfo?.valid && giftCardCode ? { giftCardCode: giftCardCode.trim().toUpperCase() } : {}),
        },
        ...(Object.keys(gatewayHeaders).length > 0 ? { headers: gatewayHeaders } : {}),
      })

      if (stripeError) {
        const backendErrorMessage = await extractFunctionErrorMessage(stripeError, stripeData)
        throw new Error(backendErrorMessage)
      }

      if (stripeData?.url) {
        trackEvent('begin_checkout', {
          currency: 'EUR',
          value: total,
          num_items: items.length,
        })
        window.location.href = stripeData.url
      } else if (stripeData?.error) {
        throw new Error(stripeData.error)
      } else {
        throw new Error('Impossible de créer la session de paiement.')
      }
    } catch (err) {
      if (createdOrderId) {
        try {
          // Nettoyage pour éviter les commandes "pending" fantômes en cas d'échec checkout
          await supabase.from('order_items').delete().eq('order_id', createdOrderId)
          const { error: cleanupError } = await supabase
            .from('orders')
            .delete()
            .eq('id', createdOrderId)
            .eq('user_id', user.id)
          if (cleanupError) {
            console.error('Cleanup order error:', cleanupError)
          }
        } catch (cleanupException) {
          console.error('Cleanup order exception:', cleanupException)
        }
      }
      console.error('Checkout error:', err)
      const rawMessage = err?.message || 'Une erreur est survenue lors de la commande.'
      const isSessionError = typeof rawMessage === 'string' && /invalid jwt|jwt invalide|session invalide|session expirée|non authentifie|non authentifié|jwt/i.test(rawMessage)
      const message = isSessionError
        ? 'Session expirée ou invalide. Veuillez vous reconnecter puis réessayer.'
        : rawMessage

      notifyError(message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-ivory pt-28 pb-20 px-5 md:px-10">
      <div className="container-custom max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Back */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-brand-ink/50 hover:text-brand-ink text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour
          </button>

          <h1 className="text-headline font-bold text-brand-ink mb-8">Finaliser la commande</h1>

          <div className="grid lg:grid-cols-[1fr_380px] gap-6">
            {/* Left - Details */}
            <div className="space-y-6">
              {/* Delivery Method */}
              <div className="bg-white rounded-2xl p-6 border border-brand-sand/60">
                <h3 className="font-bold text-brand-ink font-serif text-lg mb-4">Mode de retrait</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      deliveryMethod === 'pickup'
                        ? 'border-brand-gold bg-brand-gold/5'
                        : 'border-brand-sand hover:border-brand-gold/50'
                    }`}
                  >
                    <MapPin size={20} className={deliveryMethod === 'pickup' ? 'text-brand-gold' : 'text-brand-ink/30'} />
                    <div>
                      <p className="text-sm font-semibold text-brand-ink">Retrait</p>
                      <p className="text-xs text-brand-ink/40">Sur place</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      deliveryMethod === 'delivery'
                        ? 'border-brand-gold bg-brand-gold/5'
                        : 'border-brand-sand hover:border-brand-gold/50'
                    }`}
                  >
                    <Truck size={20} className={deliveryMethod === 'delivery' ? 'text-brand-gold' : 'text-brand-ink/30'} />
                    <div>
                      <p className="text-sm font-semibold text-brand-ink">Livraison</p>
                      <p className="text-xs text-brand-ink/40">À domicile</p>
                    </div>
                  </button>
                </div>

                {deliveryMethod === 'delivery' && (
                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Adresse"
                      value={deliveryInfo.address}
                      onChange={(e) => setDeliveryInfo(d => ({ ...d, address: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm bg-brand-ivory/50"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Ville"
                        value={deliveryInfo.city}
                        onChange={(e) => setDeliveryInfo(d => ({ ...d, city: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm bg-brand-ivory/50"
                      />
                      <input
                        type="text"
                        placeholder="Code postal"
                        value={deliveryInfo.postal_code}
                        onChange={(e) => setDeliveryInfo(d => ({ ...d, postal_code: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm bg-brand-ivory/50"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl p-6 border border-brand-sand/60">
                <h3 className="font-bold text-brand-ink font-serif text-lg mb-4">Notes (optionnel)</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Précisions sur votre commande, taille, préférences..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm bg-brand-ivory/50 resize-none"
                />
              </div>
            </div>

            {/* Right - Summary */}
            <div className="lg:sticky lg:top-32 h-fit">
              <div className="bg-white rounded-2xl p-6 border border-brand-sand/60">
                <h3 className="font-bold text-brand-ink font-serif text-lg mb-5">Récapitulatif</h3>

                {/* Items */}
                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-brand-ink truncate">{item.name}</p>
                        <div className="flex items-center gap-2 text-xs text-brand-ink/40">
                          <span>{item.type === 'location' ? 'Location' : 'Achat'}</span>
                          <span>x{item.quantity}</span>
                          {item.rentalStartDate && (
                            <span className="flex items-center gap-0.5">
                              <Calendar size={10} />
                              {new Date(item.rentalStartDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-brand-ink">{(item.unitPrice * item.quantity).toFixed(2)}€</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-brand-sand/60 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-ink/50">Sous-total</span>
                    <span className="text-brand-ink">{subtotal.toFixed(2)}€</span>
                  </div>
                  {deposit > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-ink/50">Caution location (sous reserve de l'etat au retour)</span>
                      <span className="text-brand-ink">{deposit.toFixed(2)}€</span>
                    </div>
                  )}
                  {shippingFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-ink/50 flex items-center gap-1.5">
                        <Truck size={12} className="text-brand-gold" />
                        Frais de livraison Ile-de-France
                      </span>
                      <span className="text-brand-ink">{shippingFee.toFixed(2)}€</span>
                    </div>
                  )}
                  {deliveryMethod === 'pickup' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-ink/50 flex items-center gap-1.5">
                        <MapPin size={12} className="text-emerald-600" />
                        Retrait sur RDV
                      </span>
                      <span className="text-emerald-600 font-semibold">Gratuit</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-brand-sand/40">
                    <span className="text-brand-ink">Total</span>
                    <span className="text-brand-ink font-serif">{finalTotal.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Carte cadeau */}
                <div className="mt-5 pt-5 border-t border-brand-sand/40">
                  <label className="block text-xs font-semibold text-brand-ink/70 mb-1">
                    Code carte cadeau (optionnel)
                  </label>
                  <p className="text-[11px] text-brand-ink/45 mb-2 leading-snug">
                    Format : XXXX-XXXX-XXXX (recu par email lors de l'achat).
                    Si vous avez un code promo Stripe, il se saisit sur la page de paiement a l'etape suivante.
                  </p>
                  {giftCardInfo?.valid ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-emerald-700 text-xs">✓ Carte appliquee</p>
                          <p className="text-[11px] text-emerald-700/80 mt-0.5">
                            Solde: {Number(giftCardInfo.balance).toFixed(2)}€ — applique au checkout Stripe
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setGiftCardCode(''); setGiftCardInfo(null); setGiftCardError('') }}
                          className="text-[11px] text-emerald-700 hover:underline font-semibold"
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={giftCardCode}
                        onChange={(e) => { setGiftCardCode(e.target.value.toUpperCase()); setGiftCardError('') }}
                        placeholder="XXXX-XXXX-XXXX"
                        className="flex-1 px-3 py-2 rounded-xl border border-brand-sand/70 text-sm text-brand-ink font-mono uppercase tracking-wider"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          if (!giftCardCode.trim()) return
                          setValidatingCard(true)
                          setGiftCardError('')
                          try {
                            const { data, error: fnError } = await supabase.functions.invoke('gift-card-validate', {
                              body: { code: giftCardCode.trim().toUpperCase() },
                            })
                            if (fnError) throw new Error(fnError.message || 'Erreur')
                            if (data?.valid) {
                              setGiftCardInfo(data)
                            } else {
                              setGiftCardError(
                                data?.reason === 'expired' ? 'Carte expiree.'
                                : data?.reason === 'depleted' ? 'Solde epuise.'
                                : data?.reason === 'not_yet_active' ? 'Carte pas encore activee (paiement en attente).'
                                : 'Code carte cadeau invalide.'
                              )
                            }
                          } catch (err) {
                            setGiftCardError('Erreur de verification.')
                          } finally {
                            setValidatingCard(false)
                          }
                        }}
                        disabled={!giftCardCode.trim() || validatingCard}
                        className="px-4 py-2 rounded-xl bg-brand-ink text-white text-xs font-semibold disabled:opacity-50 hover:bg-brand-night transition-colors"
                      >
                        {validatingCard ? '...' : 'Verifier'}
                      </button>
                    </div>
                  )}
                  {giftCardError && (
                    <p className="text-xs text-rose-600 mt-2">{giftCardError}</p>
                  )}
                </div>

                {/* Pay Button */}
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full mt-6 flex items-center justify-center gap-2 bg-brand-ink text-white py-4 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock size={16} />
                  {loading ? 'Redirection vers le paiement...' : `Payer ${finalTotal.toFixed(2)}€`}
                </button>

                <p className="text-[11px] text-brand-ink/30 text-center mt-3">
                  Paiement sécurisé par Stripe
                </p>

                {/* Badges de réassurance */}
                <div className="mt-5 pt-5 border-t border-brand-sand/40 grid grid-cols-2 gap-2">
                  <div className="flex items-start gap-2 text-[11px] text-brand-ink/55">
                    <Lock size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-brand-ink">Paiement chiffré</p>
                      <p className="text-brand-ink/50">Cartes via Stripe (PCI-DSS)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-[11px] text-brand-ink/55">
                    <ArrowLeft size={13} className="text-emerald-600 mt-0.5 shrink-0 rotate-180" />
                    <div>
                      <p className="font-semibold text-brand-ink">Caution remboursée</p>
                      <p className="text-brand-ink/50">Sous 3 à 5 jours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-[11px] text-brand-ink/55">
                    <Truck size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-brand-ink">Livraison Île-de-France</p>
                      <p className="text-brand-ink/50">91, 92, 93, 94 et Paris</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-[11px] text-brand-ink/55">
                    <Calendar size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-brand-ink">Réservation flexible</p>
                      <p className="text-brand-ink/50">Annulation possible</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CheckoutPage
