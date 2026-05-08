import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Copy, Check, RotateCw, EyeOff, Loader2, Link as LinkIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://www.socaftan.fr'

const WishlistShareCard = () => {
  const { user } = useAuth()
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  // Charge le token actuel au montage
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const { data, error: queryError } = await supabase
          .from('profiles')
          .select('wishlist_share_token')
          .eq('id', user.id)
          .single()

        if (cancelled) return
        if (queryError) {
          setError('Impossible de charger le statut de partage.')
        } else {
          setToken(data?.wishlist_share_token || null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user])

  const generateToken = async () => {
    if (!user) return
    setActionLoading(true)
    setError('')
    try {
      const { data, error: rpcError } = await supabase.rpc('regenerate_wishlist_share_token')
      if (rpcError) throw rpcError
      setToken(data)
      setCopied(false)
    } catch (err) {
      console.warn('[wishlist-share] generate error:', err)
      setError('Impossible de generer le lien.')
    } finally {
      setActionLoading(false)
    }
  }

  const revokeToken = async () => {
    if (!user) return
    setActionLoading(true)
    setError('')
    try {
      const { error: rpcError } = await supabase.rpc('revoke_wishlist_share_token')
      if (rpcError) throw rpcError
      setToken(null)
      setCopied(false)
    } catch (err) {
      console.warn('[wishlist-share] revoke error:', err)
      setError('Impossible de revoquer.')
    } finally {
      setActionLoading(false)
    }
  }

  const copyLink = async () => {
    if (!token) return
    const url = `${SITE_URL}/wishlist/${token}`
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = url
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      setError('Impossible de copier.')
    }
  }

  if (!user) return null
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-brand-sand/60 p-5 flex items-center justify-center min-h-[100px]">
        <Loader2 size={18} className="animate-spin text-brand-ink/30" />
      </div>
    )
  }

  const shareUrl = token ? `${SITE_URL}/wishlist/${token}` : ''

  return (
    <div className="bg-white rounded-2xl border border-brand-sand/60 p-5 md:p-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
          <Share2 size={16} className="text-rose-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-base md:text-lg font-bold text-brand-ink">Partager ma wishlist</h3>
          <p className="text-xs text-brand-ink/55 mt-1 leading-relaxed">
            Generez un lien public a partager avec vos proches pour leur montrer vos coups de coeur.
            Vous pouvez revoquer ce lien a tout moment.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {token ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-4"
          >
            <div className="bg-brand-ivory border border-brand-sand/60 rounded-xl px-3 py-2.5 flex items-center gap-2 mb-3">
              <LinkIcon size={14} className="text-brand-gold shrink-0" />
              <p className="text-xs text-brand-ink/65 font-mono truncate flex-1" title={shareUrl}>
                {shareUrl}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-ink text-white text-xs font-semibold hover:bg-brand-night transition-colors"
              >
                {copied ? <><Check size={12} />Copie !</> : <><Copy size={12} />Copier le lien</>}
              </button>
              <button
                type="button"
                onClick={generateToken}
                disabled={actionLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-brand-sand text-brand-ink text-xs font-semibold hover:bg-brand-sand/30 transition-colors disabled:opacity-60"
                title="Generer un nouveau lien (l'ancien sera revoque)"
              >
                {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <RotateCw size={12} />}
                Regenerer
              </button>
              <button
                type="button"
                onClick={revokeToken}
                disabled={actionLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50 transition-colors disabled:opacity-60"
              >
                <EyeOff size={12} />
                Desactiver le partage
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="inactive"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-4"
          >
            <button
              type="button"
              onClick={generateToken}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-gold hover:bg-brand-gold/90 text-white text-xs font-semibold transition-colors disabled:opacity-60"
            >
              {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <Share2 size={12} />}
              Generer mon lien de partage
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-xs text-rose-600 mt-3">{error}</p>
      )}
    </div>
  )
}

export default WishlistShareCard
