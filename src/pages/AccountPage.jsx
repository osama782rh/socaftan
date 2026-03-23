import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Package, LogOut, Save, AlertCircle, CheckCircle, Calendar, MapPin, Clock } from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
  })
  const [saveStatus, setSaveStatus] = useState(null)

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
    { id: 'profile', label: 'Mon profil', icon: User },
  ]

  return (
    <div className="min-h-screen bg-brand-ivory pt-28 pb-20 px-5 md:px-10">
      <div className="container-custom max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-headline font-bold text-brand-ink">Mon espace</h1>
              <p className="text-brand-ink/50 mt-1">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-brand-sand text-brand-ink/60 hover:text-brand-ink hover:border-brand-ink/30 transition-colors text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
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
                  Chargement...
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
                    Voir la collection
                  </a>
                </div>
              ) : (
                orders.map(order => {
                  const status = statusLabels[order.status] || statusLabels.pending
                  return (
                    <div key={order.id} className="bg-white rounded-2xl border border-brand-sand/60 overflow-hidden">
                      {/* Order Header */}
                      <div className="p-5 md:p-6 border-b border-brand-sand/40">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-bold text-brand-ink font-serif">{order.order_number}</p>
                              <p className="text-xs text-brand-ink/40 mt-0.5">{formatDate(order.created_at)}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-brand-ink font-serif">{order.total?.toFixed(2)}€</p>
                            <p className="text-xs text-brand-ink/40 capitalize">{order.order_type}</p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-5 md:p-6 space-y-3">
                        {order.order_items?.map(item => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-brand-sand/30 flex-shrink-0 overflow-hidden">
                              {item.products?.image_key && (
                                <div className="w-full h-full bg-brand-sand/50 flex items-center justify-center text-[10px] text-brand-ink/30">
                                  {item.products.category === 'Caftans' ? 'C' : 'K'}
                                </div>
                              )}
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
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-brand-sand/60">
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
                    <label className="block text-sm font-medium text-brand-ink mb-1.5">Prénom</label>
                    <input
                      type="text"
                      value={profileForm.first_name}
                      onChange={(e) => setProfileForm(f => ({ ...f, first_name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm bg-brand-ivory/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-ink mb-1.5">Nom</label>
                    <input
                      type="text"
                      value={profileForm.last_name}
                      onChange={(e) => setProfileForm(f => ({ ...f, last_name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm bg-brand-ivory/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-ink mb-1.5">Téléphone</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm bg-brand-ivory/50"
                    placeholder="06 XX XX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-ink mb-1.5">Adresse</label>
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
                    <label className="block text-sm font-medium text-brand-ink mb-1.5">Ville</label>
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm(f => ({ ...f, city: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm bg-brand-ivory/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-ink mb-1.5">Code postal</label>
                    <input
                      type="text"
                      value={profileForm.postal_code}
                      onChange={(e) => setProfileForm(f => ({ ...f, postal_code: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm bg-brand-ivory/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-brand-ink text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-colors"
                >
                  <Save size={16} />
                  Enregistrer
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AccountPage
