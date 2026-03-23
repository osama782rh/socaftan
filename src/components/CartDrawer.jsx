import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Calendar } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

const CartDrawer = () => {
  const { items, itemCount, subtotal, deposit, total, isCartOpen, setIsCartOpen, removeItem, updateQuantity } = useCart()

  useEffect(() => {
    if (!isCartOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isCartOpen])

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-brand-sand/40">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-brand-ink" />
                <h2 className="text-lg font-bold text-brand-ink font-serif">
                  Panier <span className="text-brand-ink/30 font-sans text-sm font-normal">({itemCount})</span>
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-brand-sand/30 transition-colors"
              >
                <X size={18} className="text-brand-ink" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-brand-ink/15 mb-4" />
                  <p className="text-brand-ink/40 text-sm">Votre panier est vide</p>
                  <a
                    href="/#collection"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 text-brand-gold text-sm font-semibold hover:underline"
                  >
                    Voir la collection
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4 bg-brand-ivory/50 rounded-xl p-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-24 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-brand-ink font-serif truncate">{item.name}</h4>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.type === 'location'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-green-50 text-green-600'
                            }`}>
                              {item.type === 'location' ? 'Location' : 'Achat'}
                            </span>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-brand-ink/30 hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {item.rentalStartDate && (
                          <p className="flex items-center gap-1 mt-1.5 text-[11px] text-brand-ink/40">
                            <Calendar size={10} />
                            {new Date(item.rentalStartDate).toLocaleDateString('fr-FR')} - {new Date(item.rentalEndDate).toLocaleDateString('fr-FR')}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg border border-brand-sand flex items-center justify-center hover:bg-brand-sand/50 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-brand-ink">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg border border-brand-sand flex items-center justify-center hover:bg-brand-sand/50 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="text-sm font-bold text-brand-ink font-serif">
                            {(item.unitPrice * item.quantity).toFixed(2)}€
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-brand-sand/40 p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-ink/50">Sous-total</span>
                  <span className="text-brand-ink font-semibold">{subtotal.toFixed(2)}€</span>
                </div>
                {deposit > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-ink/50">Caution (remboursable)</span>
                    <span className="text-brand-ink font-semibold">{deposit.toFixed(2)}€</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t border-brand-sand/40 pt-3">
                  <span className="text-brand-ink">Total</span>
                  <span className="text-brand-ink font-serif">{total.toFixed(2)}€</span>
                </div>

                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-brand-ink text-white py-3.5 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-colors"
                >
                  Commander
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer
