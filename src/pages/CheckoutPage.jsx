import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Calendar, ShoppingBag, AlertCircle, MapPin, Truck } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const CheckoutPage = () => {
  const { items, subtotal, deposit, total, clearCart } = useCart()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('pickup')
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: profile?.address || '',
    city: profile?.city || '',
    postal_code: profile?.postal_code || '',
  })
  const [notes, setNotes] = useState('')

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

  const handleCheckout = async () => {
    setError('')
    setLoading(true)

    try {
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
          total,
          delivery_method: deliveryMethod,
          delivery_address: deliveryMethod === 'delivery' ? deliveryInfo.address : '',
          delivery_city: deliveryMethod === 'delivery' ? deliveryInfo.city : '',
          delivery_postal_code: deliveryMethod === 'delivery' ? deliveryInfo.postal_code : '',
          notes,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Ajouter les articles
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
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

      // 3. Rediriger vers Stripe Checkout
      const { data: stripeData, error: stripeError } = await supabase.functions.invoke('create-checkout', {
        body: { orderId: order.id },
      })

      if (stripeError) {
        // Try to extract the real error message
        const errorBody = stripeData?.error || stripeError?.message || 'Erreur lors du paiement.'
        throw new Error(typeof errorBody === 'string' ? errorBody : JSON.stringify(errorBody))
      }

      if (stripeData?.url) {
        window.location.href = stripeData.url
      } else if (stripeData?.error) {
        throw new Error(stripeData.error)
      } else {
        throw new Error('Impossible de créer la session de paiement.')
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err.message || 'Une erreur est survenue lors de la commande.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-ivory pt-28 pb-20 px-5 md:px-10">
      <div className="container-custom max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-brand-ink/50 hover:text-brand-ink text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour
          </button>

          <h1 className="text-headline font-bold text-brand-ink mb-8">Finaliser la commande</h1>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-6">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

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
                      <span className="text-brand-ink/50">Caution (remboursable)</span>
                      <span className="text-brand-ink">{deposit.toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-brand-sand/40">
                    <span className="text-brand-ink">Total</span>
                    <span className="text-brand-ink font-serif">{total.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full mt-6 flex items-center justify-center gap-2 bg-brand-ink text-white py-4 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock size={16} />
                  {loading ? 'Redirection vers le paiement...' : `Payer ${total.toFixed(2)}€`}
                </button>

                <p className="text-[11px] text-brand-ink/30 text-center mt-3">
                  Paiement sécurisé par Stripe
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CheckoutPage
