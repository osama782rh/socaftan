import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'socaftan_cart'

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product, type = 'location', rentalDates = null) => {
    setItems(prev => {
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

      return [...prev, {
        id: `${product.id}-${type}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
        type,
        unitPrice: type === 'location' ? product.rentalPrice : product.purchasePrice,
        quantity: 1,
        rentalStartDate: rentalDates?.startDate || null,
        rentalEndDate: rentalDates?.endDate || null,
      }]
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

  const deposit = items
    .filter(item => item.type === 'location')
    .reduce((sum, item) => sum + 100 * item.quantity, 0)

  const total = subtotal + deposit

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      subtotal,
      deposit,
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
