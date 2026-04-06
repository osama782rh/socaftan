import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  BarChart3,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Mail,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useUiFeedback } from '../contexts/UiFeedbackContext'
import { isAdminEmail } from '../lib/admin'
import { PRODUCT_IMAGE_KEYS } from '../lib/productImageKeys'
import { resolveProductImage } from '../lib/productImages'

const ADMIN_EMAIL_HINT = 'contact@socaftan.fr, sara.ltr@outlook.fr'

const statusOptions = [
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Payee' },
  { value: 'confirmed', label: 'Confirmee' },
  { value: 'preparing', label: 'En preparation' },
  { value: 'ready', label: 'Prete' },
  { value: 'delivered', label: 'Livree' },
  { value: 'returned', label: 'Retournee' },
  { value: 'cancelled', label: 'Annulee' },
]

const statusLabelMap = Object.fromEntries(statusOptions.map((status) => [status.value, status.label]))

const modelTypeOptions = [
  { value: 'takchita', label: 'Takchita (location 90EUR)' },
  { value: 'karakou', label: 'Karakou (location 100EUR)' },
  { value: 'caftan', label: 'Caftan (vente 180EUR)' },
]
const categoryOptions = ['Caftans', 'Karakous']
const DEFAULT_IMAGE_KEY = PRODUCT_IMAGE_KEYS[0] || 'ANDALOUSE'
const productImageKeySet = new Set(PRODUCT_IMAGE_KEYS)

const parseNullableNumberInput = (value, label) => {
  const normalized = String(value ?? '').replace(',', '.').trim()
  if (!normalized) return null

  const parsed = Number(normalized)
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${label} invalide.`)
  }

  return Math.round(parsed * 100) / 100
}

const toPriceInput = (value) => {
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? String(number) : ''
}

const sanitizeImageKey = (value) => {
  const normalized = String(value || '').trim().toUpperCase()
  return productImageKeySet.has(normalized) ? normalized : DEFAULT_IMAGE_KEY
}

const toImagePreviewSrc = (value) => resolveProductImage(value)

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-'

const formatCurrency = (value) => `${Number(value || 0).toFixed(2)}EUR`

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const toFriendlyError = (message) => {
  const raw = String(message || '')
  if (/invalid jwt|jwt invalide|session invalide|session expir/i.test(raw)) {
    return 'Session admin invalide ou expiree. Deconnectez-vous puis reconnectez-vous.'
  }
  return raw || 'Erreur serveur.'
}

const extractFunctionErrorMessage = async (fnError, fnData) => {
  let backendError = ''

  if (fnError?.context) {
    try {
      const json = await fnError.context.clone().json()
      backendError = typeof json?.error === 'string' ? json.error : json?.message || ''
    } catch {
      try {
        backendError = await fnError.context.clone().text()
      } catch {
        backendError = ''
      }
    }
  }

  return backendError || fnData?.error || fnError?.message || 'Erreur serveur.'
}

const inferModelType = (product) => {
  const name = normalizeText(product?.name)
  const category = normalizeText(product?.category)
  const priceRent = Number(product?.price_rent || 0)
  const priceBuy = Number(product?.price_buy || 0)
  if (category.includes('karakou')) return 'karakou'
  if (name.includes('takchita')) return 'takchita'
  if (priceRent > 0 && priceBuy <= 0) return 'takchita'
  if (priceBuy > 0) return 'caftan'
  return 'caftan'
}

const modelTypeLabelMap = { takchita: 'Takchita', karakou: 'Karakou', caftan: 'Caftan' }
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const AdminOrdersPage = () => {
  const { user } = useAuth()
  const { notifyError, notifySuccess, confirmAction } = useUiFeedback()
  const isAdmin = isAdminEmail(user?.email)

  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [orderStatusDrafts, setOrderStatusDrafts] = useState({})

  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [productSearch, setProductSearch] = useState('')

  const [newModelForm, setNewModelForm] = useState({
    name: '',
    modelType: 'caftan',
    imageKey: DEFAULT_IMAGE_KEY,
    priceRent: '',
    priceBuy: '',
    description: '',
    available: true,
    featured: false,
  })
  const [editingProductId, setEditingProductId] = useState('')
  const [editModelForm, setEditModelForm] = useState({
    name: '',
    category: 'Caftans',
    imageKey: DEFAULT_IMAGE_KEY,
    priceRent: '',
    priceBuy: '',
    description: '',
    available: true,
    featured: false,
  })

  const [expandedOrderId, setExpandedOrderId] = useState('')

  const [loadingOrders, setLoadingOrders] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [savingOrderId, setSavingOrderId] = useState('')
  const [creatingModel, setCreatingModel] = useState(false)
  const [updatingProductId, setUpdatingProductId] = useState('')
  const [deletingProductId, setDeletingProductId] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const refreshSessionRequestRef = useRef(null)

  useEffect(() => {
    if (!error) return
    notifyError(error)
  }, [error, notifyError])

  useEffect(() => {
    if (!success) return
    notifySuccess(success)
  }, [success, notifySuccess])

  const refreshSessionSafely = useCallback(async () => {
    if (!refreshSessionRequestRef.current) {
      refreshSessionRequestRef.current = supabase.auth.refreshSession()
        .finally(() => {
          refreshSessionRequestRef.current = null
        })
    }
    return refreshSessionRequestRef.current
  }, [])

  const invokeAdminFunction = useCallback(async (name, body = {}) => {
    if (!supabase) throw new Error('Supabase non configure.')

    const buildPayload = (token) => (token ? { ...body, accessToken: token } : body)

    const callFunction = async (token = '') => {
      const payload = buildPayload(token)
      const gatewayHeaders = supabaseAnonKey
        ? { Authorization: `Bearer ${supabaseAnonKey}`, apikey: supabaseAnonKey }
        : {}
      const invokeOptions = {
        body: payload,
        ...(Object.keys(gatewayHeaders).length > 0 ? { headers: gatewayHeaders } : {}),
      }
      const { data, error: fnError } = await supabase.functions.invoke(name, invokeOptions)
      return { data, fnError }
    }

    const getAccessToken = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData?.session?.access_token) {
        return sessionData.session.access_token
      }

      const { data: refreshedData, error: refreshError } = await refreshSessionSafely()
      if (!refreshError && refreshedData?.session?.access_token) {
        return refreshedData.session.access_token
      }

      return ''
    }

    let accessToken = await getAccessToken()
    if (!accessToken) {
      throw new Error('Session invalide.')
    }

    let { data, fnError } = await callFunction(accessToken)

    if (fnError) {
      const firstMessage = await extractFunctionErrorMessage(fnError, data)
      const shouldRetryWithRefresh = /invalid jwt|jwt invalide|session invalide|session expir/i.test(firstMessage)

      if (shouldRetryWithRefresh) {
        const { data: refreshedData, error: refreshError } = await refreshSessionSafely()
        const refreshedToken = refreshedData?.session?.access_token || ''

        if (!refreshError && refreshedToken) {
          accessToken = refreshedToken
          const retry = await callFunction(accessToken)
          data = retry.data
          fnError = retry.fnError
        }
      }
    }

    if (fnError) {
      const message = await extractFunctionErrorMessage(fnError, data)
      throw new Error(message)
    }

    return data
  }, [refreshSessionSafely])

  const loadOrders = useCallback(async () => {
    const data = await invokeAdminFunction('admin-list-orders', { limit: 250 })
    const nextOrders = Array.isArray(data?.orders) ? data.orders : []
    setOrders(nextOrders)
    const drafts = {}
    nextOrders.forEach((order) => {
      drafts[order.id] = order.status
    })
    setOrderStatusDrafts(drafts)
  }, [invokeAdminFunction])

  const loadProducts = useCallback(async () => {
    const data = await invokeAdminFunction('admin-list-products')
    setProducts(Array.isArray(data?.products) ? data.products : [])
  }, [invokeAdminFunction])

  const refreshAll = useCallback(async ({ showLoader = false } = {}) => {
    if (!isAdmin) return
    setRefreshing(true)
    setError('')
    if (showLoader) {
      setLoadingOrders(true)
      setLoadingProducts(true)
    }

    try {
      await Promise.all([loadOrders(), loadProducts()])
    } catch (err) {
      setError(toFriendlyError(err?.message))
    } finally {
      setRefreshing(false)
      setLoadingOrders(false)
      setLoadingProducts(false)
    }
  }, [isAdmin, loadOrders, loadProducts])

  useEffect(() => {
    if (!isAdmin) {
      setLoadingOrders(false)
      setLoadingProducts(false)
      return
    }
    refreshAll({ showLoader: true })
  }, [isAdmin, refreshAll])

  const filteredOrders = useMemo(() => {
    const search = normalizeText(orderSearch)
    return [...orders]
      .filter((order) => {
        if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) return false
        if (!search) return true
        const haystack = [
          order.order_number,
          order.customer?.first_name,
          order.customer?.last_name,
          order.customer?.phone,
          order.customer?.email,
          order.delivery_city,
          order.delivery_address,
          order.notes,
          ...(order.items || []).map((item) => item?.products?.name || ''),
        ].map(normalizeText).join(' ')
        return haystack.includes(search)
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [orders, orderSearch, orderStatusFilter])

  const filteredProducts = useMemo(() => {
    const search = normalizeText(productSearch)
    if (!search) return products
    return products.filter((product) =>
      [
        product.name,
        product.category,
        product.image_key,
        product.description,
        product.available ? 'disponible' : 'indisponible',
        product.featured ? 'mis en avant' : '',
        modelTypeLabelMap[inferModelType(product)],
      ].map(normalizeText).join(' ').includes(search)
    )
  }, [products, productSearch])

  const summary = useMemo(() => {
    const countByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {})
    const revenue = orders
      .filter((order) => !['pending', 'cancelled'].includes(order.status))
      .reduce((sum, order) => sum + Number(order.total || 0), 0)
    const activeOrders = orders.filter((order) => ['paid', 'confirmed', 'preparing', 'ready'].includes(order.status)).length
    const topModelsMap = new Map()
    orders.forEach((order) => {
      ;(order.items || []).forEach((item) => {
        const key = item?.products?.name || 'Produit'
        topModelsMap.set(key, (topModelsMap.get(key) || 0) + Number(item.quantity || 0))
      })
    })
    const topModels = [...topModelsMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
    return {
      countByStatus,
      revenue,
      activeOrders,
      totalOrders: orders.length,
      totalProducts: products.length,
      topModels,
    }
  }, [orders, products])

  const handleUpdateOrderStatus = async (orderId) => {
    const nextStatus = orderStatusDrafts[orderId]
    const order = orders.find((item) => item.id === orderId)
    if (!order || nextStatus === order.status) return

    setSavingOrderId(orderId)
    setError('')
    setSuccess('')
    try {
      await invokeAdminFunction('admin-update-order-status', { orderId, status: nextStatus })
      setOrders((prev) => prev.map((item) => (item.id === orderId ? { ...item, status: nextStatus } : item)))
      setSuccess(`Commande ${order.order_number || order.id} mise a jour en ${statusLabelMap[nextStatus] || nextStatus}.`)
    } catch (err) {
      setError(toFriendlyError(err?.message))
    } finally {
      setSavingOrderId('')
    }
  }

  const handleCreateModel = async (event) => {
    event.preventDefault()
    const name = String(newModelForm.name || '').trim()
    if (name.length < 2) {
      setError('Le nom du modele est requis.')
      return
    }

    setCreatingModel(true)
    setError('')
    setSuccess('')
    try {
      const priceRent = parseNullableNumberInput(newModelForm.priceRent, 'Prix location')
      const priceBuy = parseNullableNumberInput(newModelForm.priceBuy, 'Prix vente')

      const data = await invokeAdminFunction('admin-create-product', {
        name,
        modelType: newModelForm.modelType,
        imageKey: sanitizeImageKey(newModelForm.imageKey),
        priceRent,
        priceBuy,
        description: newModelForm.description,
        available: newModelForm.available,
        featured: newModelForm.featured,
      })
      const created = data?.product
      if (created) {
        setProducts((prev) => [created, ...prev].sort((a, b) => String(a.name).localeCompare(String(b.name), 'fr')))
      } else {
        await loadProducts()
      }
      setNewModelForm({
        name: '',
        modelType: 'caftan',
        imageKey: DEFAULT_IMAGE_KEY,
        priceRent: '',
        priceBuy: '',
        description: '',
        available: true,
        featured: false,
      })
      setSuccess(`Modele "${name}" ajoute.`)
    } catch (err) {
      setError(toFriendlyError(err?.message))
    } finally {
      setCreatingModel(false)
    }
  }

  const handleStartEditModel = (product) => {
    setEditingProductId(String(product.id))
    setEditModelForm({
      name: String(product?.name || ''),
      category: String(product?.category || 'Caftans'),
      imageKey: sanitizeImageKey(product?.image_key),
      priceRent: toPriceInput(product?.price_rent),
      priceBuy: toPriceInput(product?.price_buy),
      description: String(product?.description || ''),
      available: product?.available !== false,
      featured: Boolean(product?.featured),
    })
  }

  const handleCancelEditModel = () => {
    setEditingProductId('')
    setEditModelForm({
      name: '',
      category: 'Caftans',
      imageKey: DEFAULT_IMAGE_KEY,
      priceRent: '',
      priceBuy: '',
      description: '',
      available: true,
      featured: false,
    })
  }

  const handleUpdateModel = async (product) => {
    const productId = Number(product?.id)
    if (!Number.isInteger(productId) || productId <= 0) {
      setError('Modele invalide.')
      return
    }

    const name = String(editModelForm.name || '').trim()
    if (name.length < 2) {
      setError('Le nom du modele est requis.')
      return
    }

    setUpdatingProductId(String(productId))
    setError('')
    setSuccess('')

    try {
      const priceRent = parseNullableNumberInput(editModelForm.priceRent, 'Prix location')
      const priceBuy = parseNullableNumberInput(editModelForm.priceBuy, 'Prix vente')

      if (priceRent === null && priceBuy === null) {
        throw new Error('Renseignez au moins un prix (location ou vente).')
      }

      const payload = {
        productId,
        name,
        category: editModelForm.category,
        imageKey: sanitizeImageKey(editModelForm.imageKey),
        priceRent,
        priceBuy,
        description: editModelForm.description,
        available: editModelForm.available,
        featured: editModelForm.featured,
      }

      const data = await invokeAdminFunction('admin-update-product', payload)
      const updated = data?.product
      if (updated) {
        setProducts((prev) => prev.map((item) => (item.id === productId ? updated : item)))
      } else {
        await loadProducts()
      }

      handleCancelEditModel()
      setSuccess(`Modele "${name}" mis a jour.`)
    } catch (err) {
      setError(toFriendlyError(err?.message))
    } finally {
      setUpdatingProductId('')
    }
  }

  const handleDeleteModel = async (product) => {
    if (!product) return

    const confirmed = await confirmAction({
      title: 'Confirmer la suppression',
      message: `Voulez-vous vraiment supprimer le modele "${product.name}" ? Cette action est irreversible.`,
      confirmLabel: 'Supprimer',
      cancelLabel: 'Annuler',
      variant: 'danger',
    })
    if (!confirmed) return

    setDeletingProductId(String(product.id))
    setError('')
    setSuccess('')
    try {
      await invokeAdminFunction('admin-delete-product', { productId: product.id })
      setProducts((prev) => prev.filter((item) => item.id !== product.id))
      if (editingProductId === String(product.id)) {
        handleCancelEditModel()
      }
      setSuccess(`Modele "${product.name}" supprime.`)
    } catch (err) {
      setError(toFriendlyError(err?.message))
    } finally {
      setDeletingProductId('')
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-brand-ivory pt-36 md:pt-40 pb-20 px-5 md:px-10">
        <div className="container-custom max-w-3xl">
          <div className="bg-white rounded-2xl border border-red-200 p-6 md:p-8">
            <h1 className="text-2xl font-bold text-brand-ink font-serif">Acces admin refuse</h1>
            <p className="text-sm text-brand-ink/65 mt-3">Ce compte ({user?.email || 'inconnu'}) n est pas autorise.</p>
            <p className="text-sm text-brand-ink/65 mt-1">Comptes admin autorises: {ADMIN_EMAIL_HINT}</p>
            <Link to="/compte?tab=orders" className="inline-flex mt-4 items-center gap-2 text-sm bg-brand-ink text-white px-4 py-2 rounded-full">
              <ArrowLeft size={14} />
              Retour espace client
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-ivory pt-36 md:pt-40 pb-20 px-4 md:px-8">
      <div className="mx-auto w-full max-w-[1450px]">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-brand-ink font-serif">Back-office SO Caftan</h1>
            <p className="text-sm text-brand-ink/50 mt-1">Connectee en tant que {user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/compte?tab=orders" className="inline-flex items-center gap-2 text-sm border border-brand-sand/70 px-3 py-2 rounded-full text-brand-ink/70 hover:bg-brand-sand/20">
              <ArrowLeft size={14} />
              Retour espace client
            </Link>
            <button type="button" onClick={() => refreshAll()} disabled={refreshing} className="inline-flex items-center gap-2 text-sm bg-brand-ink text-white px-4 py-2 rounded-full disabled:opacity-60">
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              Rafraichir tout
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-full text-sm font-semibold border ${activeTab === 'overview' ? 'bg-brand-ink text-white border-brand-ink' : 'bg-white text-brand-ink/65 border-brand-sand/70'}`}><BarChart3 size={14} className="inline mr-1.5" />Vue globale</button>
          <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-full text-sm font-semibold border ${activeTab === 'orders' ? 'bg-brand-ink text-white border-brand-ink' : 'bg-white text-brand-ink/65 border-brand-sand/70'}`}><ShoppingBag size={14} className="inline mr-1.5" />Commandes</button>
          <button onClick={() => setActiveTab('models')} className={`px-4 py-2 rounded-full text-sm font-semibold border ${activeTab === 'models' ? 'bg-brand-ink text-white border-brand-ink' : 'bg-white text-brand-ink/65 border-brand-sand/70'}`}><Truck size={14} className="inline mr-1.5" />Modeles</button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-3">
              <div className="bg-white rounded-2xl border border-brand-sand/60 p-4"><p className="text-xs text-brand-ink/45 uppercase tracking-wide">Commandes totales</p><p className="text-2xl font-bold text-brand-ink mt-1">{summary.totalOrders}</p></div>
              <div className="bg-white rounded-2xl border border-brand-sand/60 p-4"><p className="text-xs text-brand-ink/45 uppercase tracking-wide">En cours</p><p className="text-2xl font-bold text-amber-700 mt-1">{summary.activeOrders}</p></div>
              <div className="bg-white rounded-2xl border border-brand-sand/60 p-4"><p className="text-xs text-brand-ink/45 uppercase tracking-wide">Livrees</p><p className="text-2xl font-bold text-emerald-700 mt-1">{summary.countByStatus.delivered || 0}</p></div>
              <div className="bg-white rounded-2xl border border-brand-sand/60 p-4"><p className="text-xs text-brand-ink/45 uppercase tracking-wide">Modeles actifs</p><p className="text-2xl font-bold text-brand-ink mt-1">{summary.totalProducts}</p></div>
              <div className="bg-white rounded-2xl border border-brand-sand/60 p-4"><p className="text-xs text-brand-ink/45 uppercase tracking-wide">Chiffre suivi</p><p className="text-2xl font-bold text-brand-ink mt-1">{formatCurrency(summary.revenue)}</p></div>
            </div>

            <div className="grid xl:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-brand-sand/60 p-4 md:p-5">
                <h2 className="text-lg font-bold text-brand-ink font-serif mb-3">Distribution des statuts</h2>
                <div className="space-y-2">{statusOptions.map((status) => <div key={status.value} className="flex items-center justify-between text-sm"><span className="text-brand-ink/70">{status.label}</span><span className="font-semibold text-brand-ink">{summary.countByStatus[status.value] || 0}</span></div>)}</div>
              </div>
              <div className="bg-white rounded-2xl border border-brand-sand/60 p-4 md:p-5">
                <h2 className="text-lg font-bold text-brand-ink font-serif mb-3">Modeles les plus commandes</h2>
                {summary.topModels.length === 0 ? <p className="text-sm text-brand-ink/50">Pas assez de donnees.</p> : <div className="space-y-2">{summary.topModels.map(([name, qty], index) => <div key={`${name}-${index}`} className="flex items-center justify-between text-sm"><span className="text-brand-ink/75">{index + 1}. {name}</span><span className="font-semibold text-brand-ink">{qty}</span></div>)}</div>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-brand-sand/60 p-4">
              <div className="flex flex-wrap gap-2 mb-3">
                <button onClick={() => setOrderStatusFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${orderStatusFilter === 'all' ? 'bg-brand-ink text-white border-brand-ink' : 'bg-white border-brand-sand/70 text-brand-ink/65'}`}>Tous ({orders.length})</button>
                {statusOptions.map((status) => <button key={status.value} onClick={() => setOrderStatusFilter(status.value)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${orderStatusFilter === status.value ? 'bg-brand-ink text-white border-brand-ink' : 'bg-white border-brand-sand/70 text-brand-ink/65'}`}>{status.label} ({summary.countByStatus[status.value] || 0})</button>)}
              </div>
              <input value={orderSearch} onChange={(event) => setOrderSearch(event.target.value)} placeholder="Rechercher numero, cliente, ville, article..." className="w-full px-3 py-2 rounded-xl border border-brand-sand/70 text-sm text-brand-ink outline-none" />
            </div>

            {loadingOrders ? (
              <div className="bg-white rounded-2xl border border-brand-sand/60 p-10 text-center text-brand-ink/45">Chargement des commandes...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-brand-sand/60 p-10 text-center text-brand-ink/45">Aucune commande trouvee.</div>
            ) : (
              <div className="bg-white rounded-2xl border border-brand-sand/60 overflow-x-auto">
                <table className="w-full min-w-[1100px] text-sm">
                  <thead className="bg-brand-ivory/50">
                    <tr className="text-left text-brand-ink/55">
                      <th className="px-4 py-3 font-semibold w-6"></th>
                      <th className="px-4 py-3 font-semibold">Commande</th>
                      <th className="px-4 py-3 font-semibold">Cliente</th>
                      <th className="px-4 py-3 font-semibold">Articles</th>
                      <th className="px-4 py-3 font-semibold">Montant</th>
                      <th className="px-4 py-3 font-semibold">Statut</th>
                      <th className="px-4 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const itemPreview = (order.items || []).slice(0, 2).map((item) => item?.products?.name || 'Article').join(', ')
                      const hasMoreItems = (order.items || []).length > 2
                      const isExpanded = expandedOrderId === order.id
                      const fullName = `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim() || 'Cliente'
                      const hasAddress = order.delivery_address || order.delivery_city || order.delivery_postal_code
                      const stripePaymentUrl = order.stripe_payment_intent
                        ? `https://dashboard.stripe.com/payments/${order.stripe_payment_intent}`
                        : order.stripe_session_id
                          ? `https://dashboard.stripe.com/checkout/sessions/${order.stripe_session_id}`
                          : ''
                      return (
                        <>
                          <tr key={order.id} className="border-t border-brand-sand/35 align-top hover:bg-brand-ivory/20">
                            <td className="px-3 py-3">
                              <button
                                onClick={() => setExpandedOrderId(isExpanded ? '' : order.id)}
                                className="p-1 rounded-lg hover:bg-brand-sand/30 text-brand-ink/40 hover:text-brand-ink transition-colors"
                                title={isExpanded ? 'Reduire' : 'Voir les details'}
                              >
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-brand-ink">{order.order_number || order.id}</p>
                              <p className="text-xs text-brand-ink/45 mt-1">{formatDateTime(order.created_at)}</p>
                              {order.order_type && <p className="text-xs text-brand-ink/40 mt-0.5">{order.order_type === 'location' ? 'Location' : 'Achat'}</p>}
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-brand-ink font-medium">{fullName}</p>
                              {order.customer?.email && (
                                <p className="text-xs text-brand-ink/50 mt-0.5 flex items-center gap-1">
                                  <Mail size={10} />
                                  {order.customer.email}
                                </p>
                              )}
                              {order.customer?.phone && (
                                <p className="text-xs text-brand-ink/45 mt-0.5">{order.customer.phone}</p>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-brand-ink/75">{itemPreview || 'Aucun article'}</p>
                              {hasMoreItems && <p className="text-xs text-brand-ink/45 mt-1">+{(order.items || []).length - 2} autres</p>}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-brand-ink">{formatCurrency(order.total)}</p>
                              {Number(order.deposit_amount) > 0 && (
                                <p className="text-xs text-brand-ink/45 mt-0.5">dont {formatCurrency(order.deposit_amount)} caution</p>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <select value={orderStatusDrafts[order.id] || order.status} onChange={(event) => setOrderStatusDrafts((prev) => ({ ...prev, [order.id]: event.target.value }))} className="w-[175px] px-2 py-1.5 rounded-lg border border-brand-sand/70 text-sm text-brand-ink">
                                {statusOptions.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => handleUpdateOrderStatus(order.id)} disabled={savingOrderId === order.id || (orderStatusDrafts[order.id] || order.status) === order.status} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-ink text-white text-xs font-semibold disabled:opacity-60">
                                  <Save size={12} />
                                  {savingOrderId === order.id ? 'Maj...' : 'Sauver'}
                                </button>
                                {stripePaymentUrl && (
                                  <a href={stripePaymentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-brand-sand/70 text-brand-ink/60 text-xs hover:bg-brand-sand/20" title="Voir sur Stripe">
                                    <ExternalLink size={11} />
                                    Stripe
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr key={`${order.id}-detail`} className="border-t border-brand-sand/20 bg-brand-ivory/30">
                              <td colSpan={7} className="px-5 py-4">
                                <div className="grid md:grid-cols-3 gap-4 text-xs">
                                  {/* Articles detail */}
                                  <div>
                                    <p className="text-brand-ink/50 uppercase tracking-wide font-semibold mb-2">Articles commandes</p>
                                    <div className="space-y-1.5">
                                      {(order.items || []).length === 0 ? (
                                        <p className="text-brand-ink/40">Aucun article</p>
                                      ) : (order.items || []).map((item, idx) => (
                                        <div key={idx} className="flex justify-between gap-2 bg-white rounded-lg px-3 py-2 border border-brand-sand/40">
                                          <div>
                                            <p className="font-semibold text-brand-ink">{item?.products?.name || 'Article'}</p>
                                            <p className="text-brand-ink/50">{item.item_type === 'location' ? 'Location' : 'Achat'} · x{item.quantity}</p>
                                            {item.rental_start_date && (
                                              <p className="text-brand-ink/45 mt-0.5">
                                                {new Date(item.rental_start_date).toLocaleDateString('fr-FR')}
                                                {item.rental_end_date ? ` → ${new Date(item.rental_end_date).toLocaleDateString('fr-FR')}` : ''}
                                              </p>
                                            )}
                                          </div>
                                          <p className="font-semibold text-brand-ink whitespace-nowrap">{formatCurrency(Number(item.unit_price) * Number(item.quantity))}</p>
                                        </div>
                                      ))}
                                      {Number(order.deposit_amount) > 0 && (
                                        <div className="flex justify-between gap-2 bg-white rounded-lg px-3 py-2 border border-amber-100">
                                          <p className="text-brand-ink/70">Caution location</p>
                                          <p className="font-semibold text-amber-700">{formatCurrency(order.deposit_amount)}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Livraison */}
                                  <div>
                                    <p className="text-brand-ink/50 uppercase tracking-wide font-semibold mb-2">Livraison &amp; contact</p>
                                    <div className="bg-white rounded-lg px-3 py-3 border border-brand-sand/40 space-y-1.5">
                                      <p className="text-brand-ink font-semibold">{fullName}</p>
                                      {order.customer?.email && (
                                        <p className="flex items-center gap-1.5 text-brand-ink/65">
                                          <Mail size={11} className="shrink-0" />
                                          {order.customer.email}
                                        </p>
                                      )}
                                      {order.customer?.phone && (
                                        <p className="text-brand-ink/65">{order.customer.phone}</p>
                                      )}
                                      <div className="border-t border-brand-sand/30 pt-1.5 mt-1.5">
                                        <p className="text-brand-ink/50 mb-1">Mode: <span className="text-brand-ink font-medium">{order.delivery_method === 'delivery' ? 'Livraison' : order.delivery_method === 'pickup' ? 'Retrait' : order.delivery_method || '-'}</span></p>
                                        {hasAddress ? (
                                          <p className="flex items-start gap-1.5 text-brand-ink/70">
                                            <MapPin size={11} className="shrink-0 mt-0.5" />
                                            <span>
                                              {[order.delivery_address, order.delivery_postal_code, order.delivery_city].filter(Boolean).join(', ')}
                                            </span>
                                          </p>
                                        ) : (
                                          <p className="text-brand-ink/35">Adresse non renseignee</p>
                                        )}
                                      </div>
                                    </div>
                                    {order.notes && (
                                      <div className="bg-amber-50 rounded-lg px-3 py-2.5 border border-amber-100 mt-2">
                                        <p className="text-amber-700 font-semibold mb-1">Notes client</p>
                                        <p className="text-amber-800/80 whitespace-pre-wrap">{order.notes}</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Paiement */}
                                  <div>
                                    <p className="text-brand-ink/50 uppercase tracking-wide font-semibold mb-2">Paiement &amp; recap</p>
                                    <div className="bg-white rounded-lg px-3 py-3 border border-brand-sand/40 space-y-1.5">
                                      <div className="flex justify-between">
                                        <span className="text-brand-ink/60">Sous-total</span>
                                        <span className="font-medium text-brand-ink">{formatCurrency(order.subtotal)}</span>
                                      </div>
                                      {Number(order.deposit_amount) > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-brand-ink/60">Caution</span>
                                          <span className="font-medium text-brand-ink">{formatCurrency(order.deposit_amount)}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between border-t border-brand-sand/30 pt-1.5 mt-1.5">
                                        <span className="font-semibold text-brand-ink">Total</span>
                                        <span className="font-bold text-brand-ink">{formatCurrency(order.total)}</span>
                                      </div>
                                      <div className="border-t border-brand-sand/30 pt-1.5 mt-1.5 space-y-1">
                                        <div className="flex justify-between text-xs">
                                          <span className="text-brand-ink/50">Statut paiement</span>
                                          <span className={`font-semibold ${order.status === 'paid' || order.status === 'confirmed' || order.status === 'delivered' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {order.status === 'pending' ? 'En attente' : order.status === 'cancelled' ? 'Annule' : 'Paye'}
                                          </span>
                                        </div>
                                        {order.stripe_payment_intent && (
                                          <div className="flex justify-between items-center">
                                            <span className="text-brand-ink/50">Paiement Stripe</span>
                                            <a href={`https://dashboard.stripe.com/payments/${order.stripe_payment_intent}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-brand-gold font-semibold hover:underline">
                                              <ExternalLink size={10} />
                                              Voir le recu
                                            </a>
                                          </div>
                                        )}
                                        {order.stripe_session_id && !order.stripe_payment_intent && (
                                          <div className="flex justify-between items-center">
                                            <span className="text-brand-ink/50">Session Stripe</span>
                                            <a href={`https://dashboard.stripe.com/checkout/sessions/${order.stripe_session_id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-brand-gold font-semibold hover:underline">
                                              <ExternalLink size={10} />
                                              Voir session
                                            </a>
                                          </div>
                                        )}
                                        {!order.stripe_payment_intent && !order.stripe_session_id && (
                                          <p className="text-brand-ink/35 text-center pt-1">Pas de paiement Stripe enregistre</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'models' && (
          <div className="grid xl:grid-cols-[420px_1fr] gap-4">
            <div className="bg-white rounded-2xl border border-brand-sand/60 p-4 md:p-5">
              <h2 className="text-lg font-bold text-brand-ink font-serif mb-3">Ajouter un modele</h2>
              <form onSubmit={handleCreateModel} className="space-y-3">
                <input
                  value={newModelForm.name}
                  onChange={(event) => setNewModelForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Nom du modele"
                  className="w-full px-3 py-2 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                  required
                />
                <select
                  value={newModelForm.modelType}
                  onChange={(event) => setNewModelForm((prev) => ({ ...prev, modelType: event.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                >
                  {modelTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <div className="space-y-2">
                  <select
                    value={newModelForm.imageKey}
                    onChange={(event) => setNewModelForm((prev) => ({ ...prev, imageKey: event.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                  >
                    {PRODUCT_IMAGE_KEYS.map((key) => <option key={key} value={key}>{key}</option>)}
                  </select>
                  <div className="flex items-center gap-2">
                    <img
                      src={toImagePreviewSrc(newModelForm.imageKey)}
                      alt="Apercu nouveau modele"
                      className="w-12 h-12 rounded-lg object-cover border border-brand-sand/60 bg-brand-ivory/60"
                    />
                    <p className="text-[11px] text-brand-ink/55 leading-tight">
                      Image interne selectionnee (aucune URL exposee).
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newModelForm.priceRent}
                    onChange={(event) => setNewModelForm((prev) => ({ ...prev, priceRent: event.target.value }))}
                    placeholder="Prix location (EUR)"
                    className="w-full px-3 py-2 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newModelForm.priceBuy}
                    onChange={(event) => setNewModelForm((prev) => ({ ...prev, priceBuy: event.target.value }))}
                    placeholder="Prix vente (EUR)"
                    className="w-full px-3 py-2 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                  />
                </div>
                <textarea
                  value={newModelForm.description}
                  onChange={(event) => setNewModelForm((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Description (optionnel)"
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-brand-sand/70 text-sm text-brand-ink resize-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 text-xs text-brand-ink/70">
                    <input
                      type="checkbox"
                      checked={newModelForm.available}
                      onChange={(event) => setNewModelForm((prev) => ({ ...prev, available: event.target.checked }))}
                    />
                    Disponible
                  </label>
                  <label className="flex items-center gap-2 text-xs text-brand-ink/70">
                    <input
                      type="checkbox"
                      checked={newModelForm.featured}
                      onChange={(event) => setNewModelForm((prev) => ({ ...prev, featured: event.target.checked }))}
                    />
                    Mis en avant
                  </label>
                </div>
                <button type="submit" disabled={creatingModel} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-brand-ink text-white text-sm font-semibold disabled:opacity-60">
                  <Plus size={14} />
                  {creatingModel ? 'Ajout...' : 'Ajouter le modele'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-brand-sand/60 p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                <h2 className="text-lg font-bold text-brand-ink font-serif">Catalogue ({products.length})</h2>
                <input value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder="Rechercher un modele..." className="w-full sm:w-72 px-3 py-2 rounded-xl border border-brand-sand/70 text-sm text-brand-ink" />
              </div>

              {loadingProducts ? (
                <p className="text-sm text-brand-ink/40">Chargement des modeles...</p>
              ) : filteredProducts.length === 0 ? (
                <p className="text-sm text-brand-ink/50">Aucun modele trouve.</p>
              ) : (
                <div className="space-y-3">
                  {filteredProducts.map((product) => {
                    const isEditing = editingProductId === String(product.id)
                    return (
                      <div key={product.id} className="rounded-xl border border-brand-sand/40 bg-brand-ivory/25 p-3">
                        {isEditing ? (
                          <div className="space-y-3">
                            <div className="grid md:grid-cols-2 gap-2">
                              <input
                                value={editModelForm.name}
                                onChange={(event) => setEditModelForm((prev) => ({ ...prev, name: event.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                                placeholder="Nom"
                              />
                              <select
                                value={editModelForm.category}
                                onChange={(event) => setEditModelForm((prev) => ({ ...prev, category: event.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                              >
                                {categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                              </select>
                            </div>
                            <div className="grid md:grid-cols-3 gap-2">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editModelForm.priceRent}
                                onChange={(event) => setEditModelForm((prev) => ({ ...prev, priceRent: event.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                                placeholder="Prix location"
                              />
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editModelForm.priceBuy}
                                onChange={(event) => setEditModelForm((prev) => ({ ...prev, priceBuy: event.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                                placeholder="Prix vente"
                              />
                              <select
                                value={editModelForm.imageKey}
                                onChange={(event) => setEditModelForm((prev) => ({ ...prev, imageKey: event.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                              >
                                {PRODUCT_IMAGE_KEYS.map((key) => <option key={key} value={key}>{key}</option>)}
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <img
                                src={toImagePreviewSrc(editModelForm.imageKey)}
                                alt="Apercu modele"
                                className="w-12 h-12 rounded-lg object-cover border border-brand-sand/60 bg-brand-ivory/60"
                              />
                              <p className="text-[11px] text-brand-ink/55 leading-tight">
                                Image interne selectionnee (aucune URL exposee).
                              </p>
                            </div>
                            <textarea
                              value={editModelForm.description}
                              onChange={(event) => setEditModelForm((prev) => ({ ...prev, description: event.target.value }))}
                              rows={2}
                              placeholder="Description"
                              className="w-full px-3 py-2 rounded-xl border border-brand-sand/70 text-sm text-brand-ink resize-none"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <label className="flex items-center gap-2 text-xs text-brand-ink/70">
                                <input
                                  type="checkbox"
                                  checked={editModelForm.available}
                                  onChange={(event) => setEditModelForm((prev) => ({ ...prev, available: event.target.checked }))}
                                />
                                Disponible
                              </label>
                              <label className="flex items-center gap-2 text-xs text-brand-ink/70">
                                <input
                                  type="checkbox"
                                  checked={editModelForm.featured}
                                  onChange={(event) => setEditModelForm((prev) => ({ ...prev, featured: event.target.checked }))}
                                />
                                Mis en avant
                              </label>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={handleCancelEditModel} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-brand-sand/70 text-brand-ink/70 text-xs font-semibold">
                                <X size={12} />
                                Annuler
                              </button>
                              <button onClick={() => handleUpdateModel(product)} disabled={updatingProductId === String(product.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-ink text-white text-xs font-semibold disabled:opacity-60">
                                <Save size={12} />
                                {updatingProductId === String(product.id) ? 'Enregistrement...' : 'Enregistrer'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-brand-ink">{product.name}</p>
                              <p className="text-xs text-brand-ink/55 mt-1">{modelTypeLabelMap[inferModelType(product)]} · {product.category} · Visuel interne</p>
                              <p className="text-xs text-brand-ink/55 mt-1">Location: {Number(product.price_rent) > 0 ? `${Number(product.price_rent).toFixed(2)}EUR` : '-'} · Vente: {Number(product.price_buy) > 0 ? `${Number(product.price_buy).toFixed(2)}EUR` : '-'}</p>
                              {product.description ? <p className="text-xs text-brand-ink/50 mt-1">{product.description}</p> : null}
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`text-[10px] px-2 py-1 rounded-full ${product.available ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{product.available ? 'Disponible' : 'Indisponible'}</span>
                                {product.featured ? <span className="text-[10px] px-2 py-1 rounded-full bg-brand-gold/20 text-brand-ink">Mis en avant</span> : null}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleStartEditModel(product)} disabled={Boolean(editingProductId)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-brand-sand/70 text-brand-ink text-xs font-semibold disabled:opacity-60">
                                <Pencil size={12} />
                                Modifier
                              </button>
                              <button onClick={() => handleDeleteModel(product)} disabled={deletingProductId === String(product.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-red-200 text-red-600 text-xs font-semibold disabled:opacity-60">
                                <Trash2 size={12} />
                                {deletingProductId === String(product.id) ? 'Suppression...' : 'Supprimer'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrdersPage
