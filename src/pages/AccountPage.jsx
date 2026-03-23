import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  User, Package, LogOut, Save, AlertCircle, CheckCircle,
  Calendar, Heart, Settings, Trash2, ShoppingBag, Eye
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const statusLabels = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  paid: { label: 'Payée', color: 'bg-blue-100 text-blue-700' },
  confirmed: { label: 'Confirmée', color: 'bg-green-100 text-green-700' },
  preparing: { label: 'En préparation', color: 'bg-purple-100 text-purple-700' },
  ready: { label: 'Prête', color: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-700' },
  returned: { label: 'Retournée', color: 'bg-gray-100 text-gray-600' },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-600' },
}

const AccountPage = () => {
  const { user, profile, signOut, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [wishlist, setWishlist] = useState([])
  const [wishlistLoading, setWishlistLoading] = useState(true)
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
  })
  const [saveStatus, setSaveStatus] = useState(null)
  const [expandedOrder, setExpandedOrder] = useState(null)

  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['orders', 'wishlist', 'profile'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setSearchParams({ tab: tabId })
  }

  useEffect(() => {
    if (profile) {
      setProfileForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        postal_code: profile.postal_code || '',
      })
    }
  }, [profile])

  useEffect(() => {
    if (!supabase || !user) return
    const fetchOrders = async () => {
      setOrdersLoading(true)
      const { data } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products:product_id (name, category, image_key)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setOrders(data || [])
      setOrdersLoading(false)
    }
    fetchOrders()
  }, [user])

  useEffect(() => {
    if (!supabase || !user) return
    const fetchWishlist = async () => {
      setWishlistLoading(true)
      const { data } = await supabase
        .from('wishlist')
        .select(`
          *,
          products:product_id (id, name, category, image_key, price_rent, price_buy)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setWishlist(data || [])
      setWishlistLoading(false)
    }
    fetchWishlist()
  }, [user])

  const removeFromWishlist = async (wishlistId) => {
    if (!supabase) return
    await supabase.from('wishlist').delete().eq('id', wishlistId)
    setWishlist(prev => prev.filter(w => w.id !== wishlistId))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaveStatus(null)
    try {
      await updateProfile(profileForm)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
    } catch {
      setSaveStatus('error')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const tabs = [
    { id: 'orders', label: 'Mes commandes', icon: Package },
    { id: 'wishlist', label: 'Ma wishlist', icon: Heart },
    { id: 'profile', label: 'Informations personnelles', icon: Settings },
  ]

  // Stats
  const totalOrders = orders.length
  const activeOrders = orders.filter(o => ['paid', 'confirmed', 'preparing', 'ready'].includes(o.status)).length
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <div className="min-h-screen bg-brand-ivory pt-28 pb-20 px-5 md:px-10">
      <div className="container-custom max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-gold/15 flex items-center justify-center text-xl font-bold text-brand-gold">
                {(profile?.first_name || user?.email || '?').charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-brand-ink font-serif">
                  Bonjour, {profile?.first_name || 'Bienvenue'}
                </h1>
                <p className="text-brand-ink/50 text-sm mt-0.5">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-brand-sand text-brand-ink/60 hover:text-red-500 hover:border-red-200 transition-colors text-sm"
            >
              <LogOut size={16} />
              <span>Déconnexion</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-brand-sand/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Package size={18} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand-ink font-serif">{totalOrders}</p>
                  <p className="text-xs text-brand-ink/40">Commande{totalOrders > 1 ? 's' : ''} totale{totalOrders > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-brand-sand/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <ShoppingBag size={18} className="text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand-ink font-serif">{activeOrders}</p>
                  <p className="text-xs text-brand-ink/40">Commande{activeOrders > 1 ? 's' : ''} en cours</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-brand-sand/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center">
                  <Heart size={18} className="text-brand-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand-ink font-serif">{wishlist.length}</p>
                  <p className="text-xs text-brand-ink/40">Dans ma wishlist</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-brand-ink text-white'
                    : 'bg-white text-brand-ink/60 hover:text-brand-ink border border-brand-sand'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {ordersLoading ? (
                <div className="bg-white rounded-2xl p-12 border border-brand-sand/60 text-center text-brand-ink/40">
                  Chargement de vos commandes...
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border border-brand-sand/60 text-center">
                  <Package size={48} className="text-brand-ink/20 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-brand-ink font-serif mb-2">Aucune commande</h3>
                  <p className="text-brand-ink/50 text-sm mb-6">Vous n'avez pas encore passé de commande.</p>
                  <a
                    href="/#collection"
                    className="inline-flex items-center gap-2 bg-brand-ink text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-colors"
                  >
                    Découvrir la collection
                  </a>
                </div>
              ) : (
                orders.map(order => {
                  const status = statusLabels[order.status] || statusLabels.pending
                  const isExpanded = expandedOrder === order.id
                  return (
                    <div key={order.id} className="bg-white rounded-2xl border border-brand-sand/60 overflow-hidden">
                      {/* Order Header */}
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="w-full p-5 md:p-6 flex flex-wrap items-center justify-between gap-3 text-left hover:bg-brand-ivory/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-brand-sand/30 flex items-center justify-center">
                            <Package size={18} className="text-brand-ink/40" />
                          </div>
                          <div>
                            <p className="font-bold text-brand-ink font-serif">{order.order_number}</p>
                            <p className="text-xs text-brand-ink/40 mt-0.5">{formatDate(order.created_at)}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-bold text-brand-ink font-serif">{order.total?.toFixed(2)}€</p>
                            <p className="text-xs text-brand-ink/40 capitalize">{order.order_type}</p>
                          </div>
                          <Eye size={16} className={`text-brand-ink/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      {/* Order Details (expandable) */}
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-brand-sand/40"
                        >
                          <div className="p-5 md:p-6 space-y-3">
                            {order.order_items?.map(item => (
                              <div key={item.id} className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-brand-sand/30 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                  <span className="text-[10px] text-brand-ink/30 font-bold">
                                    {item.products?.category === 'Caftans' ? 'C' : 'K'}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm text-brand-ink">{item.products?.name || 'Produit'}</p>
                                  <div className="flex items-center gap-3 mt-0.5">
                                    <span className="text-xs text-brand-ink/40">
                                      {item.item_type === 'location' ? 'Location' : 'Achat'} x{item.quantity}
                                    </span>
                                    {item.rental_start_date && (
                                      <span className="text-xs text-brand-ink/40 flex items-center gap-1">
                                        <Calendar size={10} />
                                        {formatDate(item.rental_start_date)} - {formatDate(item.rental_end_date)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm font-semibold text-brand-ink">{(item.unit_price * item.quantity).toFixed(2)}€</p>
                              </div>
                            ))}
                          </div>

                          {/* Deposit info for rentals */}
                          {order.order_type === 'location' && order.deposit_amount > 0 && (
                            <div className="px-5 md:px-6 pb-4">
                              <p className="text-xs text-brand-ink/40 italic">
                                Caution : {order.deposit_amount?.toFixed(2)}€ (remboursable au retour)
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div>
              {wishlistLoading ? (
                <div className="bg-white rounded-2xl p-12 border border-brand-sand/60 text-center text-brand-ink/40">
                  Chargement de votre wishlist...
                </div>
              ) : wishlist.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border border-brand-sand/60 text-center">
                  <Heart size={48} className="text-brand-ink/20 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-brand-ink font-serif mb-2">Votre wishlist est vide</h3>
                  <p className="text-brand-ink/50 text-sm mb-6">Ajoutez des pièces à votre liste de souhaits depuis la collection.</p>
                  <a
                    href="/#collection"
                    className="inline-flex items-center gap-2 bg-brand-ink text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-colors"
                  >
                    Découvrir la collection
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist.map(item => (
                    <div key={item.id} className="bg-white rounded-2xl border border-brand-sand/60 overflow-hidden group">
                      <div className="relative aspect-[3/4] bg-brand-sand/20 flex items-center justify-center">
                        <span className="text-4xl text-brand-ink/10 font-serif font-bold">
                          {item.products?.category === 'Caftans' ? 'C' : 'K'}
                        </span>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100"
                          title="Retirer de la wishlist"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-brand-ink font-serif">{item.products?.name}</h3>
                        <p className="text-xs text-brand-ink/40 mt-0.5">{item.products?.category === 'Caftans' ? 'Caftan' : 'Karakou'}</p>
                        <div className="flex items-center gap-3 mt-3">
                          {item.products?.price_rent && (
                            <span className="text-sm font-semibold text-brand-gold">
                              {item.products.price_rent}€ <span className="text-xs font-normal text-brand-ink/30">location</span>
                            </span>
                          )}
                          {item.products?.price_buy && (
                            <span className="text-sm font-semibold text-brand-ink">
                              {item.products.price_buy}€ <span className="text-xs font-normal text-brand-ink/30">achat</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-brand-sand/60">
              <div className="flex items-center gap-3 mb-6">
                <User size={20} className="text-brand-gold" />
                <h2 className="text-lg font-bold text-brand-ink font-serif">Informations personnelles</h2>
              </div>

              {saveStatus === 'success' && (
                <div className="flex items-center gap-2 bg-green-50 text-green-600 text-sm p-3 rounded-xl mb-6">
                  <CheckCircle size={16} />
                  Profil mis à jour avec succès.
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-6">
                  <AlertCircle size={16} />
                  Erreur lors de la mise à jour.
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-ink/50 mb-1.5 uppercase tracking-wide">Prénom</label>
                    <input
                      type="text"
                      value={profileForm.first_name}
                      onChange={(e) => setProfileForm(f => ({ ...f, first_name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm bg-brand-ivory/50"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-ink/50 mb-1.5 uppercase tracking-wide">Nom</label>
                    <input
                      type="text"
                      value={profileForm.last_name}
                      onChange={(e) => setProfileForm(f => ({ ...f, last_name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm bg-brand-ivory/50"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-ink/50 mb-1.5 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-brand-sand text-sm bg-brand-sand/20 text-brand-ink/50 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-brand-ink/30 mt-1">L'email ne peut pas être modifié.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-ink/50 mb-1.5 uppercase tracking-wide">Téléphone</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm bg-brand-ivory/50"
                    placeholder="06 XX XX XX XX"
                  />
                </div>

                <div className="border-t border-brand-sand/40 pt-5">
                  <h3 className="text-sm font-semibold text-brand-ink mb-4">Adresse de livraison</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-ink/50 mb-1.5 uppercase tracking-wide">Adresse</label>
                      <input
                        type="text"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm(f => ({ ...f, address: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm bg-brand-ivory/50"
                        placeholder="Votre adresse"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-brand-ink/50 mb-1.5 uppercase tracking-wide">Ville</label>
                        <input
                          type="text"
                          value={profileForm.city}
                          onChange={(e) => setProfileForm(f => ({ ...f, city: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm bg-brand-ivory/50"
                          placeholder="Votre ville"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-brand-ink/50 mb-1.5 uppercase tracking-wide">Code postal</label>
                        <input
                          type="text"
                          value={profileForm.postal_code}
                          onChange={(e) => setProfileForm(f => ({ ...f, postal_code: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm bg-brand-ivory/50"
                          placeholder="75001"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-brand-ink text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-colors"
                  >
                    <Save size={16} />
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AccountPage
