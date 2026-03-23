import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Package, LogOut, Save, AlertCircle, CheckCircle,
  Calendar, Heart, Trash2, ShoppingBag, Eye, Lock,
  MapPin, CreditCard, ChevronRight, Plus, Edit3,
  LayoutDashboard, Clock, TrendingUp, Star, Phone,
  Mail, Shield, KeyRound, X, Menu, ArrowRight, EyeOff
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const statusLabels = {
  pending: { label: 'En attente', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  paid: { label: 'Payee', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
  confirmed: { label: 'Confirmee', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  preparing: { label: 'En preparation', color: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-400' },
  ready: { label: 'Prete', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-400' },
  delivered: { label: 'Livree', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  returned: { label: 'Retournee', color: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
  cancelled: { label: 'Annulee', color: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-400' },
}

const statusFlow = ['pending', 'paid', 'confirmed', 'preparing', 'ready', 'delivered']

const sidebarItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'orders', label: 'Mes commandes', icon: Package },
  { id: 'wishlist', label: 'Ma wishlist', icon: Heart },
  { id: 'addresses', label: 'Mes adresses', icon: MapPin },
  { id: 'profile', label: 'Informations personnelles', icon: User },
  { id: 'security', label: 'Securite', icon: Shield },
]

const AccountPage = () => {
  const { user, profile, signOut, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'dashboard')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [wishlist, setWishlist] = useState([])
  const [wishlistLoading, setWishlistLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileForm, setProfileForm] = useState({
    first_name: '', last_name: '', phone: '', address: '', city: '', postal_code: '',
  })
  const [saveStatus, setSaveStatus] = useState(null)
  const [passwordForm, setPasswordForm] = useState({ current: '', new_password: '', confirm: '' })
  const [passwordStatus, setPasswordStatus] = useState(null)
  const [showPasswords, setShowPasswords] = useState({ current: false, new_password: false, confirm: false })

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && sidebarItems.some(i => i.id === tab)) setActiveTab(tab)
  }, [searchParams])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setSearchParams({ tab: tabId })
    setSidebarOpen(false)
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
        .select(`*, order_items (*, products:product_id (name, category, image_key))`)
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
        .select(`*, products:product_id (id, name, category, image_key, price_rent, price_buy)`)
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

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordStatus(null)
    if (passwordForm.new_password !== passwordForm.confirm) {
      setPasswordStatus({ type: 'error', message: 'Les mots de passe ne correspondent pas.' })
      return
    }
    if (passwordForm.new_password.length < 6) {
      setPasswordStatus({ type: 'error', message: 'Le mot de passe doit contenir au moins 6 caracteres.' })
      return
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordForm.new_password })
      if (error) throw error
      setPasswordStatus({ type: 'success', message: 'Mot de passe modifie avec succes.' })
      setPasswordForm({ current: '', new_password: '', confirm: '' })
      setTimeout(() => setPasswordStatus(null), 3000)
    } catch {
      setPasswordStatus({ type: 'error', message: 'Erreur lors du changement de mot de passe.' })
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  const formatDateShort = (dateStr) =>
    new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })

  // Stats
  const totalOrders = orders.length
  const activeOrders = orders.filter(o => ['paid', 'confirmed', 'preparing', 'ready'].includes(o.status)).length
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const completedOrders = orders.filter(o => ['delivered', 'returned'].includes(o.status)).length

  const getStatusStep = (status) => {
    const idx = statusFlow.indexOf(status)
    return idx === -1 ? 0 : idx
  }

  const recentOrders = orders.slice(0, 3)

  // Input class helper
  const inputClass = 'w-full px-4 py-3 rounded-xl border border-brand-sand/80 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm bg-white transition-all'

  return (
    <div className="min-h-screen bg-brand-ivory pt-20">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-20 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-b border-brand-sand/40 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 text-sm font-medium text-brand-ink"
        >
          <Menu size={18} />
          <span>{sidebarItems.find(i => i.id === activeTab)?.label || 'Menu'}</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold/70 flex items-center justify-center text-xs font-bold text-white">
            {(profile?.first_name || user?.email || '?').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-5rem)]">
        {/* Sidebar overlay on mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-20 left-0 h-[calc(100vh-5rem)] w-72 bg-white border-r border-brand-sand/40
          z-50 lg:z-10 transition-transform duration-300 overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* User card */}
          <div className="p-6 border-b border-brand-sand/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold/70 flex items-center justify-center text-lg font-bold text-white shadow-md">
                {(profile?.first_name || user?.email || '?').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-brand-ink font-serif text-base truncate">
                  {profile?.first_name && profile?.last_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : profile?.first_name || 'Mon compte'}
                </h3>
                <p className="text-xs text-brand-ink/40 truncate">{user?.email}</p>
              </div>
            </div>
            {/* Member since */}
            <div className="mt-4 flex items-center gap-2 text-[11px] text-brand-ink/35">
              <Star size={12} className="text-brand-gold" />
              <span>Membre depuis {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '...'}</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3">
            <div className="space-y-0.5">
              {sidebarItems.map(item => {
                const isActive = activeTab === item.id
                const badge = item.id === 'orders' && activeOrders > 0 ? activeOrders : null
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-brand-ink text-white shadow-md'
                        : 'text-brand-ink/60 hover:bg-brand-sand/30 hover:text-brand-ink'
                    }`}
                  >
                    <item.icon size={18} className={isActive ? 'text-brand-gold' : 'text-brand-ink/35 group-hover:text-brand-ink/60'} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-brand-gold text-brand-ink' : 'bg-brand-gold/15 text-brand-gold'
                      }`}>
                        {badge}
                      </span>
                    )}
                    {!badge && <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`} />}
                  </button>
                )
              })}
            </div>

            {/* Separator */}
            <div className="my-3 border-t border-brand-sand/30" />

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <LogOut size={18} />
              <span>Deconnexion</span>
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-4 md:px-8 lg:px-10 py-6 lg:py-8 mt-14 lg:mt-0 max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >

              {/* ===== DASHBOARD ===== */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Welcome banner */}
                  <div className="bg-gradient-to-r from-brand-ink to-brand-ink/90 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/10 rounded-full -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-brand-gold/5 rounded-full translate-y-1/2" />
                    <div className="relative">
                      <p className="text-brand-gold/80 text-xs font-semibold tracking-widest uppercase mb-2">Bienvenue</p>
                      <h1 className="text-2xl md:text-3xl font-bold font-serif">
                        Bonjour, {profile?.first_name || 'Bienvenue'} !
                      </h1>
                      <p className="text-white/50 text-sm mt-2 max-w-md">
                        Gerez vos commandes, votre wishlist et vos informations personnelles depuis votre espace client.
                      </p>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {[
                      { label: 'Commandes totales', value: totalOrders, icon: Package, color: 'blue', suffix: '' },
                      { label: 'En cours', value: activeOrders, icon: Clock, color: 'amber', suffix: '' },
                      { label: 'Total depense', value: `${totalSpent.toFixed(0)}`, icon: TrendingUp, color: 'emerald', suffix: '\u20AC' },
                      { label: 'Wishlist', value: wishlist.length, icon: Heart, color: 'rose', suffix: '' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white rounded-xl p-4 md:p-5 border border-brand-sand/50 hover:shadow-md transition-shadow">
                        <div className={`w-9 h-9 rounded-lg bg-${stat.color}-50 flex items-center justify-center mb-3`}>
                          <stat.icon size={17} className={`text-${stat.color}-500`} />
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-brand-ink font-serif">{stat.value}{stat.suffix}</p>
                        <p className="text-[11px] text-brand-ink/40 mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Quick actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Voir la collection', href: '/#collection', icon: ShoppingBag, desc: 'Decouvrez nos caftans' },
                      { label: 'Sur-mesure', href: '/sur-mesure', icon: Star, desc: 'Creez votre piece unique' },
                      { label: 'Nous contacter', href: '/#contact', icon: Phone, desc: 'Besoin d\'aide ?' },
                    ].map((action, i) => (
                      <a
                        key={i}
                        href={action.href}
                        className="bg-white rounded-xl p-4 border border-brand-sand/50 hover:border-brand-gold/40 hover:shadow-md transition-all group flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold/20 transition-colors">
                          <action.icon size={18} className="text-brand-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-brand-ink">{action.label}</p>
                          <p className="text-[11px] text-brand-ink/40">{action.desc}</p>
                        </div>
                        <ArrowRight size={14} className="text-brand-ink/20 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
                      </a>
                    ))}
                  </div>

                  {/* Recent orders */}
                  <div className="bg-white rounded-2xl border border-brand-sand/50 overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-brand-sand/30">
                      <div className="flex items-center gap-2">
                        <Package size={18} className="text-brand-ink/40" />
                        <h2 className="text-base font-bold text-brand-ink font-serif">Commandes recentes</h2>
                      </div>
                      {orders.length > 0 && (
                        <button
                          onClick={() => handleTabChange('orders')}
                          className="text-xs font-semibold text-brand-gold hover:text-brand-gold/80 transition-colors flex items-center gap-1"
                        >
                          Tout voir <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                    {ordersLoading ? (
                      <div className="p-8 text-center text-sm text-brand-ink/30">Chargement...</div>
                    ) : recentOrders.length === 0 ? (
                      <div className="p-8 text-center">
                        <Package size={36} className="text-brand-ink/10 mx-auto mb-3" />
                        <p className="text-sm text-brand-ink/40">Aucune commande pour le moment</p>
                        <a href="/#collection" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-gold mt-3 hover:text-brand-gold/80">
                          Decouvrir la collection <ArrowRight size={12} />
                        </a>
                      </div>
                    ) : (
                      <div className="divide-y divide-brand-sand/20">
                        {recentOrders.map(order => {
                          const status = statusLabels[order.status] || statusLabels.pending
                          return (
                            <div key={order.id} className="px-5 py-4 flex items-center gap-4 hover:bg-brand-ivory/30 transition-colors">
                              <div className="w-10 h-10 rounded-lg bg-brand-sand/20 flex items-center justify-center flex-shrink-0">
                                <Package size={16} className="text-brand-ink/30" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-brand-ink">{order.order_number}</p>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.color}`}>
                                    {status.label}
                                  </span>
                                </div>
                                <p className="text-[11px] text-brand-ink/35 mt-0.5">
                                  {formatDate(order.created_at)} · {order.order_items?.length || 0} article{(order.order_items?.length || 0) > 1 ? 's' : ''}
                                </p>
                              </div>
                              <p className="text-sm font-bold text-brand-ink font-serif">{order.total?.toFixed(2)}\u20AC</p>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Profile completion hint */}
                  {(!profile?.first_name || !profile?.phone || !profile?.address) && (
                    <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/40 flex items-start gap-3">
                      <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-amber-800">Completez votre profil</p>
                        <p className="text-xs text-amber-600/70 mt-0.5">Ajoutez vos informations personnelles pour faciliter vos futures commandes.</p>
                      </div>
                      <button
                        onClick={() => handleTabChange('profile')}
                        className="text-xs font-semibold text-amber-700 hover:text-amber-800 whitespace-nowrap"
                      >
                        Completer
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ===== ORDERS ===== */}
              {activeTab === 'orders' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold text-brand-ink font-serif">Mes commandes</h1>
                      <p className="text-xs text-brand-ink/40 mt-1">Suivez l'etat de vos commandes et locations</p>
                    </div>
                    {orders.length > 0 && (
                      <span className="text-xs font-semibold text-brand-ink/30 bg-brand-sand/30 px-3 py-1.5 rounded-full">
                        {totalOrders} commande{totalOrders > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {ordersLoading ? (
                    <div className="bg-white rounded-2xl p-12 border border-brand-sand/50 text-center">
                      <div className="animate-pulse space-y-4">
                        {[1,2,3].map(i => (
                          <div key={i} className="h-16 bg-brand-sand/20 rounded-xl" />
                        ))}
                      </div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 border border-brand-sand/50 text-center">
                      <div className="w-16 h-16 bg-brand-sand/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={28} className="text-brand-ink/15" />
                      </div>
                      <h3 className="text-lg font-bold text-brand-ink font-serif mb-2">Aucune commande</h3>
                      <p className="text-sm text-brand-ink/40 mb-6 max-w-sm mx-auto">Vous n'avez pas encore passe de commande. Decouvrez notre collection de caftans et karakous.</p>
                      <a href="/#collection" className="btn-primary inline-flex items-center gap-2">
                        Decouvrir la collection <ArrowRight size={14} />
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map(order => {
                        const status = statusLabels[order.status] || statusLabels.pending
                        const isExpanded = expandedOrder === order.id
                        const step = getStatusStep(order.status)
                        return (
                          <div key={order.id} className="bg-white rounded-2xl border border-brand-sand/50 overflow-hidden hover:shadow-sm transition-shadow">
                            <button
                              onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                              className="w-full p-4 md:p-5 flex items-center gap-4 text-left hover:bg-brand-ivory/20 transition-colors"
                            >
                              <div className="w-11 h-11 rounded-xl bg-brand-sand/20 flex items-center justify-center flex-shrink-0">
                                <Package size={18} className="text-brand-ink/30" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-sm text-brand-ink font-serif">{order.order_number}</span>
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${status.color}`}>
                                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${status.dot} mr-1`} />
                                    {status.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[11px] text-brand-ink/35">{formatDate(order.created_at)}</span>
                                  <span className="text-[11px] text-brand-ink/25">·</span>
                                  <span className="text-[11px] text-brand-ink/35 capitalize">{order.order_type === 'location' ? 'Location' : 'Achat'}</span>
                                  <span className="text-[11px] text-brand-ink/25">·</span>
                                  <span className="text-[11px] text-brand-ink/35">{order.order_items?.length || 0} article{(order.order_items?.length || 0) > 1 ? 's' : ''}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <p className="text-base font-bold text-brand-ink font-serif">{order.total?.toFixed(2)}\u20AC</p>
                                <ChevronRight size={16} className={`text-brand-ink/20 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                              </div>
                            </button>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden"
                                >
                                  <div className="border-t border-brand-sand/30 p-4 md:p-5 space-y-4">
                                    {/* Progress bar for active orders */}
                                    {!['cancelled', 'returned'].includes(order.status) && (
                                      <div className="bg-brand-ivory/50 rounded-xl p-4">
                                        <p className="text-[11px] font-semibold text-brand-ink/40 uppercase tracking-wide mb-3">Suivi de commande</p>
                                        <div className="flex items-center gap-1">
                                          {statusFlow.map((s, i) => (
                                            <div key={s} className="flex-1 flex items-center">
                                              <div className={`h-1.5 rounded-full flex-1 transition-colors ${i <= step ? 'bg-brand-gold' : 'bg-brand-sand/50'}`} />
                                            </div>
                                          ))}
                                        </div>
                                        <div className="flex justify-between mt-2">
                                          <span className="text-[10px] text-brand-ink/30">En attente</span>
                                          <span className="text-[10px] text-brand-ink/30">Livree</span>
                                        </div>
                                      </div>
                                    )}

                                    {/* Items */}
                                    <div className="space-y-2">
                                      {order.order_items?.map(item => (
                                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-brand-ivory/30">
                                          <div className="w-12 h-12 rounded-lg bg-brand-sand/30 flex-shrink-0 flex items-center justify-center">
                                            <span className="text-[10px] text-brand-ink/25 font-bold">
                                              {item.products?.category === 'Caftans' ? 'C' : 'K'}
                                            </span>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-brand-ink">{item.products?.name || 'Produit'}</p>
                                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                              <span className="text-[11px] text-brand-ink/40 bg-brand-sand/20 px-2 py-0.5 rounded-full">
                                                {item.item_type === 'location' ? 'Location' : 'Achat'} x{item.quantity}
                                              </span>
                                              {item.rental_start_date && (
                                                <span className="text-[11px] text-brand-ink/35 flex items-center gap-1">
                                                  <Calendar size={10} />
                                                  {formatDateShort(item.rental_start_date)} - {formatDateShort(item.rental_end_date)}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <p className="text-sm font-semibold text-brand-ink">{(item.unit_price * item.quantity).toFixed(2)}\u20AC</p>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Order summary */}
                                    <div className="flex items-center justify-between pt-3 border-t border-brand-sand/20">
                                      <div className="text-[11px] text-brand-ink/35">
                                        {order.delivery_method === 'delivery' ? 'Livraison' : 'Retrait en boutique'}
                                        {order.deposit_amount > 0 && (
                                          <span className="ml-3">· Caution : {order.deposit_amount?.toFixed(2)}\u20AC</span>
                                        )}
                                      </div>
                                      <p className="text-base font-bold text-brand-ink font-serif">Total : {order.total?.toFixed(2)}\u20AC</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ===== WISHLIST ===== */}
              {activeTab === 'wishlist' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold text-brand-ink font-serif">Ma wishlist</h1>
                      <p className="text-xs text-brand-ink/40 mt-1">Les pieces qui vous font envie</p>
                    </div>
                    {wishlist.length > 0 && (
                      <span className="text-xs font-semibold text-brand-ink/30 bg-brand-sand/30 px-3 py-1.5 rounded-full">
                        {wishlist.length} article{wishlist.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {wishlistLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-brand-sand/50 overflow-hidden animate-pulse">
                          <div className="aspect-[3/4] bg-brand-sand/20" />
                          <div className="p-4 space-y-2">
                            <div className="h-4 bg-brand-sand/20 rounded w-3/4" />
                            <div className="h-3 bg-brand-sand/20 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : wishlist.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 border border-brand-sand/50 text-center">
                      <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart size={28} className="text-rose-300" />
                      </div>
                      <h3 className="text-lg font-bold text-brand-ink font-serif mb-2">Votre wishlist est vide</h3>
                      <p className="text-sm text-brand-ink/40 mb-6 max-w-sm mx-auto">Ajoutez des pieces a votre liste de souhaits depuis notre collection.</p>
                      <a href="/#collection" className="btn-primary inline-flex items-center gap-2">
                        Decouvrir la collection <ArrowRight size={14} />
                      </a>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlist.map(item => (
                        <div key={item.id} className="bg-white rounded-2xl border border-brand-sand/50 overflow-hidden group hover:shadow-md transition-all">
                          <div className="relative aspect-[3/4] bg-gradient-to-b from-brand-sand/15 to-brand-sand/30 flex items-center justify-center">
                            <span className="text-5xl text-brand-ink/5 font-serif font-bold">
                              {item.products?.category === 'Caftans' ? 'C' : 'K'}
                            </span>
                            <button
                              onClick={() => removeFromWishlist(item.id)}
                              className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100"
                              title="Retirer de la wishlist"
                            >
                              <Trash2 size={15} />
                            </button>
                            <div className="absolute bottom-3 left-3">
                              <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-semibold text-brand-ink/60">
                                {item.products?.category === 'Caftans' ? 'Caftan' : 'Karakou'}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-brand-ink font-serif text-base">{item.products?.name}</h3>
                            <div className="flex items-center gap-3 mt-3">
                              {item.products?.price_rent && (
                                <span className="text-sm font-semibold text-brand-gold">
                                  {item.products.price_rent}\u20AC <span className="text-[10px] font-normal text-brand-ink/30">location</span>
                                </span>
                              )}
                              {item.products?.price_buy && (
                                <span className="text-sm font-semibold text-brand-ink">
                                  {item.products.price_buy}\u20AC <span className="text-[10px] font-normal text-brand-ink/30">achat</span>
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

              {/* ===== ADDRESSES ===== */}
              {activeTab === 'addresses' && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-brand-ink font-serif">Mes adresses</h1>
                    <p className="text-xs text-brand-ink/40 mt-1">Gerez vos adresses de livraison</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Main address */}
                    <div className={`bg-white rounded-2xl border ${profile?.address ? 'border-brand-gold/30' : 'border-brand-sand/50'} p-5 relative`}>
                      {profile?.address && (
                        <div className="absolute top-4 right-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
                            Principale
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center">
                          <MapPin size={18} className="text-brand-gold" />
                        </div>
                        <h3 className="font-bold text-brand-ink font-serif">Adresse de livraison</h3>
                      </div>
                      {profile?.address ? (
                        <div className="space-y-1 text-sm text-brand-ink/70">
                          <p>{profile.address}</p>
                          <p>{profile.postal_code} {profile.city}</p>
                          <p className="text-brand-ink/40">France</p>
                          <button
                            onClick={() => handleTabChange('profile')}
                            className="flex items-center gap-1 text-brand-gold text-xs font-semibold mt-3 hover:text-brand-gold/80 transition-colors"
                          >
                            <Edit3 size={12} /> Modifier
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-brand-ink/40 mb-3">Aucune adresse enregistree.</p>
                          <button
                            onClick={() => handleTabChange('profile')}
                            className="flex items-center gap-1 text-brand-gold text-xs font-semibold hover:text-brand-gold/80 transition-colors"
                          >
                            <Plus size={12} /> Ajouter une adresse
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Add new address CTA */}
                    <button
                      onClick={() => handleTabChange('profile')}
                      className="bg-white rounded-2xl border-2 border-dashed border-brand-sand/60 p-5 flex flex-col items-center justify-center gap-3 hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all min-h-[180px]"
                    >
                      <div className="w-12 h-12 rounded-full bg-brand-sand/20 flex items-center justify-center">
                        <Plus size={20} className="text-brand-ink/30" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-brand-ink/50">Modifier l'adresse</p>
                        <p className="text-[11px] text-brand-ink/30 mt-0.5">Depuis vos informations personnelles</p>
                      </div>
                    </button>
                  </div>

                  {/* Delivery info */}
                  <div className="bg-blue-50/40 rounded-xl p-4 border border-blue-200/30">
                    <div className="flex items-start gap-3">
                      <CreditCard size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-800">A propos de la livraison</p>
                        <p className="text-xs text-blue-600/60 mt-1 leading-relaxed">
                          Nous livrons en region parisienne et proposons egalement le retrait en boutique.
                          L'adresse enregistree sera utilisee par defaut lors de vos prochaines commandes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== PROFILE ===== */}
              {activeTab === 'profile' && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-brand-ink font-serif">Informations personnelles</h1>
                    <p className="text-xs text-brand-ink/40 mt-1">Modifiez vos informations de compte</p>
                  </div>

                  <AnimatePresence>
                    {saveStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm p-4 rounded-xl border border-emerald-200/40"
                      >
                        <CheckCircle size={16} />
                        Profil mis a jour avec succes.
                      </motion.div>
                    )}
                    {saveStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center gap-2 bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-200/40"
                      >
                        <AlertCircle size={16} />
                        Erreur lors de la mise a jour.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    {/* Identity */}
                    <div className="bg-white rounded-2xl border border-brand-sand/50 p-5 md:p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <User size={18} className="text-brand-gold" />
                        <h2 className="text-sm font-bold text-brand-ink uppercase tracking-wide">Identite</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-brand-ink/40 mb-1.5">Prenom</label>
                          <input
                            type="text"
                            value={profileForm.first_name}
                            onChange={(e) => setProfileForm(f => ({ ...f, first_name: e.target.value }))}
                            className={inputClass}
                            placeholder="Votre prenom"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-brand-ink/40 mb-1.5">Nom</label>
                          <input
                            type="text"
                            value={profileForm.last_name}
                            onChange={(e) => setProfileForm(f => ({ ...f, last_name: e.target.value }))}
                            className={inputClass}
                            placeholder="Votre nom"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-white rounded-2xl border border-brand-sand/50 p-5 md:p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <Mail size={18} className="text-brand-gold" />
                        <h2 className="text-sm font-bold text-brand-ink uppercase tracking-wide">Contact</h2>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-brand-ink/40 mb-1.5">Email</label>
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-brand-sand/50 text-sm bg-brand-sand/10 text-brand-ink/40 cursor-not-allowed"
                          />
                          <p className="text-[10px] text-brand-ink/25 mt-1">L'email ne peut pas etre modifie.</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-brand-ink/40 mb-1.5">Telephone</label>
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                            className={inputClass}
                            placeholder="06 XX XX XX XX"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="bg-white rounded-2xl border border-brand-sand/50 p-5 md:p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <MapPin size={18} className="text-brand-gold" />
                        <h2 className="text-sm font-bold text-brand-ink uppercase tracking-wide">Adresse de livraison</h2>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-brand-ink/40 mb-1.5">Adresse</label>
                          <input
                            type="text"
                            value={profileForm.address}
                            onChange={(e) => setProfileForm(f => ({ ...f, address: e.target.value }))}
                            className={inputClass}
                            placeholder="Votre adresse"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-brand-ink/40 mb-1.5">Ville</label>
                            <input
                              type="text"
                              value={profileForm.city}
                              onChange={(e) => setProfileForm(f => ({ ...f, city: e.target.value }))}
                              className={inputClass}
                              placeholder="Votre ville"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-brand-ink/40 mb-1.5">Code postal</label>
                            <input
                              type="text"
                              value={profileForm.postal_code}
                              onChange={(e) => setProfileForm(f => ({ ...f, postal_code: e.target.value }))}
                              className={inputClass}
                              placeholder="75001"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-brand-ink text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-all hover:shadow-lg"
                      >
                        <Save size={16} />
                        Enregistrer les modifications
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ===== SECURITY ===== */}
              {activeTab === 'security' && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-brand-ink font-serif">Securite</h1>
                    <p className="text-xs text-brand-ink/40 mt-1">Gerez la securite de votre compte</p>
                  </div>

                  {/* Change password */}
                  <div className="bg-white rounded-2xl border border-brand-sand/50 p-5 md:p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <KeyRound size={18} className="text-brand-gold" />
                      <h2 className="text-sm font-bold text-brand-ink uppercase tracking-wide">Changer le mot de passe</h2>
                    </div>

                    <AnimatePresence>
                      {passwordStatus && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className={`flex items-center gap-2 text-sm p-4 rounded-xl mb-5 border ${
                            passwordStatus.type === 'success'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/40'
                              : 'bg-red-50 text-red-600 border-red-200/40'
                          }`}
                        >
                          {passwordStatus.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                          {passwordStatus.message}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                      {[
                        { key: 'current', label: 'Mot de passe actuel', placeholder: 'Votre mot de passe actuel' },
                        { key: 'new_password', label: 'Nouveau mot de passe', placeholder: 'Minimum 6 caracteres' },
                        { key: 'confirm', label: 'Confirmer le mot de passe', placeholder: 'Repetez le nouveau mot de passe' },
                      ].map(field => (
                        <div key={field.key}>
                          <label className="block text-xs font-semibold text-brand-ink/40 mb-1.5">{field.label}</label>
                          <div className="relative">
                            <input
                              type={showPasswords[field.key] ? 'text' : 'password'}
                              value={passwordForm[field.key]}
                              onChange={(e) => setPasswordForm(f => ({ ...f, [field.key]: e.target.value }))}
                              className={inputClass + ' pr-10'}
                              placeholder={field.placeholder}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(s => ({ ...s, [field.key]: !s[field.key] }))}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-ink/25 hover:text-brand-ink/50 transition-colors"
                            >
                              {showPasswords[field.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-brand-ink text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-all mt-2"
                      >
                        <Lock size={14} />
                        Modifier le mot de passe
                      </button>
                    </form>
                  </div>

                  {/* Account info */}
                  <div className="bg-white rounded-2xl border border-brand-sand/50 p-5 md:p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <Shield size={18} className="text-brand-gold" />
                      <h2 className="text-sm font-bold text-brand-ink uppercase tracking-wide">Informations du compte</h2>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-brand-sand/20">
                        <span className="text-sm text-brand-ink/50">Email</span>
                        <span className="text-sm font-medium text-brand-ink">{user?.email}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-brand-sand/20">
                        <span className="text-sm text-brand-ink/50">Membre depuis</span>
                        <span className="text-sm font-medium text-brand-ink">
                          {user?.created_at ? formatDate(user.created_at) : '...'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-brand-sand/20">
                        <span className="text-sm text-brand-ink/50">Derniere connexion</span>
                        <span className="text-sm font-medium text-brand-ink">
                          {user?.last_sign_in_at ? formatDate(user.last_sign_in_at) : '...'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-brand-ink/50">Statut du compte</span>
                        <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          Actif
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Danger zone */}
                  <div className="bg-white rounded-2xl border border-red-200/40 p-5 md:p-6">
                    <h2 className="text-sm font-bold text-red-500 uppercase tracking-wide mb-3">Zone de danger</h2>
                    <p className="text-xs text-brand-ink/40 mb-4">
                      La suppression de votre compte est irreversible. Toutes vos donnees seront definitivement supprimees.
                    </p>
                    <button
                      className="text-xs font-semibold text-red-400 hover:text-red-500 transition-colors border border-red-200/40 px-4 py-2 rounded-full hover:bg-red-50"
                      onClick={() => alert('Pour supprimer votre compte, veuillez nous contacter a contact@socaftan.com')}
                    >
                      Supprimer mon compte
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default AccountPage
