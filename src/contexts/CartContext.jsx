import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { trackEvent } from '../lib/analytics'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'socaftan_cart'
const CART_SYNC_DEBOUNCE_MS = 1500

/**
 * Caution remise EN MAIN PROPRE lors du retrait/livraison (NON encaissee via Stripe).
 *  - Karakou : 150€ (piece premium)
 *  - Takchita / Caftan / autres : 100€
 */
const KARAKOU_DEPOSIT = 150
const STANDARD_DEPOSIT = 100

export const getDepositForItem = (item) => {
  if (!item || item.type !== 'location') return 0
  const cat = String(item.category || '').toLowerCase()
  return cat.includes('karakou') ? KARAKOU_DEPOSIT : STANDARD_DEPOSIT
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const syncTimerRef = useRef(null)
  const initialLoadDoneRef = useRef(false)

  // Persistance localStorage (toujours active)
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // Au login : charger le panier serveur et le merger avec le panier local
  useEffect(() => {
    if (!user) {
      initialLoadDoneRef.current = false
      return
    }
    if (initialLoadDoneRef.current) return

    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('user_carts')
          .select('items')
          .eq('user_id', user.id)
          .maybeSingle()

        if (cancelled) return
        if (error) {
          console.warn('[cart] Load server cart failed:', error.message)
          initialLoadDoneRef.current = true
          return
        }

        const serverItems = Array.isArray(data?.items) ? data.items : []
        // Merge server + local : on garde les items locaux + on ajoute ceux du serveur absents en local
        setItems((local) => {
          if (local.length === 0) return serverItems
          if (serverItems.length === 0) return local
          // Merge basique : par productId+type, on garde la quantite max
          const map = new Map()
          for (const item of [...serverItems, ...local]) {
            const key = `${item.productId}-${item.type}-${item.rentalStartDate || ''}`
            const existing = map.get(key)
            if (!existing || item.quantity > existing.quantity) {
              map.set(key, item)
            }
          }
          return [...map.values()]
        })
        initialLoadDoneRef.current = true
      } catch (err) {
        console.warn('[cart] Load error:', err)
        initialLoadDoneRef.current = true
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user])

  // Sync debounced du panier vers la DB pour les utilisateurs connectes
  useEffect(() => {
    if (!user) return
    if (!initialLoadDoneRef.current) return

    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current)
    }

    syncTimerRef.current = setTimeout(async () => {
      try {
        const subtotalLocal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
        // La caution est remise EN MAIN PROPRE, elle n'entre pas dans le total a payer.

        await supabase
          .from('user_carts')
          .upsert({
            user_id: user.id,
            items,
            subtotal: subtotalLocal,
            total: subtotalLocal,
          }, { onConflict: 'user_id' })
      } catch (err) {
        console.warn('[cart] Sync error:', err)
      }
    }, CART_SYNC_DEBOUNCE_MS)

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    }
  }, [items, user])

  const addItem = useCallback((product, type = 'location', rentalDates = null) => {
    setItems(prev => {
      const canRent = typeof product.rentalPrice === 'number' && product.rentalPrice > 0
      const canBuy = typeof product.purchasePrice === 'number' && product.purchasePrice > 0

      if ((type === 'location' && !canRent) || (type === 'achat' && !canBuy)) {
        return prev
      }

      const existingIndex = prev.findIndex(
        item => item.productId === product.id && item.type === type
          && item.rentalStartDate === rentalDates?.startDate
      )

      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        }
        return updated
      }

      const unitPrice = type === 'location' ? product.rentalPrice : product.purchasePrice
      if (typeof unitPrice !== 'number' || unitPrice <= 0) {
        return prev
      }

      return [...prev, {
        id: `${product.id}-${type}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
        type,
        unitPrice,
        quantity: 1,
        rentalStartDate: rentalDates?.startDate || null,
        rentalEndDate: rentalDates?.endDate || null,
      }]
    })

    // Track add to cart
    const unitPrice = type === 'location' ? product.rentalPrice : product.purchasePrice
    trackEvent('add_to_cart', {
      currency: 'EUR',
      value: unitPrice || 0,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        item_variant: type,
        price: unitPrice,
        quantity: 1,
      }],
    })

    setIsCartOpen(true)
  }, [])

  const removeItem = useCallback((itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId))
  }, [])

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ))
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  // Caution informationnelle (remise en main propre, NON encaissee)
  const deposit = items.reduce((sum, item) => sum + getDepositForItem(item) * item.quantity, 0)
  const hasKarakouDeposit = items.some(
    (item) => item.type === 'location' && String(item.category || '').toLowerCase().includes('karakou'),
  )

  // Total a payer en ligne : SANS la caution
  const total = subtotal

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      subtotal,
      deposit,
      hasKarakouDeposit,
      total,
      isCartOpen,
      setIsCartOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}
