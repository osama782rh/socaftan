import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { trackPurchase } from '../lib/analytics'

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams()
  const { items, total, clearCart } = useCart()
  const sessionId = searchParams.get('session_id')
  const purchaseTracked = useRef(false)

  useEffect(() => {
    // Track la conversion (1 fois max, AVANT clearCart) - critique pour Meta/GA
    if (!purchaseTracked.current && items.length > 0 && total > 0) {
      purchaseTracked.current = true
      trackPurchase({
        value: total,
        currency: 'EUR',
        orderId: sessionId || `order_${Date.now()}`,
        items: items.map((item) => ({
          item_id: item.productId,
          item_name: item.name,
          item_category: item.category,
          item_variant: item.type,
          price: item.unitPrice,
          quantity: item.quantity,
        })),
      })
    }
    clearCart()
  }, [clearCart, items, total, sessionId])

  return (
    <div className="min-h-screen bg-brand-ivory flex items-center justify-center px-5 pt-28 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg text-center"
      >
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-brand-sand/60 shadow-sm">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
            className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={40} className="text-green-500" />
          </motion.div>

          <h1 className="text-3xl font-bold text-brand-ink font-serif mb-3">
            Commande confirmée !
          </h1>

          <p className="text-brand-ink/50 text-sm leading-relaxed mb-8">
            Merci pour votre commande. Vous recevrez un email de confirmation
            avec tous les détails. Nous vous contacterons pour organiser le retrait ou la livraison.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/compte"
              className="inline-flex items-center justify-center gap-2 bg-brand-ink text-white px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-colors"
            >
              <Package size={16} />
              Voir mes commandes
            </Link>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-brand-sand text-brand-ink px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-brand-sand/30 transition-colors"
            >
              Retour à l'accueil
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default OrderSuccessPage
