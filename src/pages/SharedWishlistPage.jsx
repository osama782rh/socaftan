import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Home, ChevronRight, Heart, MessageCircle, Loader2, Calendar, Tag } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { resolveProductImage } from '../lib/productImages'

const SharedWishlistPage = () => {
  const { token } = useParams()
  const [items, setItems] = useState([])
  const [ownerName, setOwnerName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setError('Lien invalide.')
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const { data, error: queryError } = await supabase
          .from('shared_wishlists')
          .select('*')
          .eq('token', token)
          .order('added_at', { ascending: false })

        if (cancelled) return
        if (queryError) {
          setError('Une erreur est survenue.')
          setLoading(false)
          return
        }

        const list = data || []
        if (list.length === 0) {
          setError('Cette wishlist est vide ou n\'existe plus.')
        } else {
          setItems(list)
          setOwnerName(list[0]?.owner_first_name || '')
        }
        setLoading(false)
      } catch {
        if (!cancelled) {
          setError('Une erreur est survenue.')
          setLoading(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [token])

  const formatPrice = (value) => `${Number(value || 0).toFixed(0)}€`

  return (
    <div className="min-h-screen bg-brand-ivory pt-32 md:pt-36 pb-16">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="container-custom px-5 md:px-10 pb-2">
        <ol className="flex items-center gap-2 text-xs text-brand-ink/55">
          <li>
            <Link to="/" className="hover:text-brand-ink inline-flex items-center gap-1">
              <Home size={12} />
              Accueil
            </Link>
          </li>
          <ChevronRight size={12} className="text-brand-ink/30" />
          <li className="text-brand-ink font-medium">Wishlist partagee</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="container-custom px-5 md:px-10 py-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold uppercase tracking-wide mb-4">
            <Heart size={11} className="fill-current" />
            Wishlist partagee
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-ink font-serif mb-3">
            {ownerName ? `Les coups de coeur de ${ownerName}` : 'Wishlist partagee'}
          </h1>
          <p className="text-brand-ink/65 text-sm md:text-base leading-relaxed">
            Decouvrez la selection de tenues SO Caftan choisies avec amour.
            Vous pouvez consulter cette wishlist librement et passer commande sur les modeles preferes.
          </p>
        </div>
      </section>

      {/* Items */}
      <section className="container-custom px-5 md:px-10 py-6">
        {loading && (
          <div className="bg-white rounded-2xl border border-brand-sand/60 p-12 flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-brand-ink/30" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-white rounded-2xl border border-brand-sand/60 p-10 text-center">
            <Heart size={32} className="text-brand-ink/20 mx-auto mb-4" />
            <p className="text-brand-ink/65">{error}</p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-full bg-brand-ink text-white text-sm font-semibold"
            >
              Decouvrir SO Caftan
            </Link>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {items.map((item, idx) => (
              <motion.article
                key={item.wishlist_item_id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.25) }}
                className="bg-white rounded-2xl border border-brand-sand/60 overflow-hidden hover:border-brand-gold/55 transition-colors"
              >
                <div className="aspect-[3/4] bg-brand-sand/30 overflow-hidden">
                  <img
                    src={resolveProductImage(item.product_image_key)}
                    alt={item.product_name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-brand-gold font-semibold uppercase tracking-wide mb-1 inline-flex items-center gap-1">
                    <Tag size={10} />
                    {item.product_category}
                  </p>
                  <h3 className="font-serif text-base font-bold text-brand-ink leading-tight">{item.product_name}</h3>
                  <div className="mt-2 space-y-0.5 text-xs text-brand-ink/55">
                    {Number(item.product_rental_price) > 0 && (
                      <p>Location <strong className="text-brand-ink">{formatPrice(item.product_rental_price)}</strong></p>
                    )}
                    {Number(item.product_purchase_price) > 0 && (
                      <p>Achat <strong className="text-brand-ink">{formatPrice(item.product_purchase_price)}</strong></p>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-[10px] text-brand-ink/40">
                    <Calendar size={9} />
                    Ajoute le {new Date(item.added_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      {!loading && !error && (
        <section className="container-custom px-5 md:px-10 py-8">
          <div className="bg-gradient-to-br from-brand-ink via-brand-night to-brand-ink rounded-2xl p-6 md:p-8 text-white text-center">
            <h2 className="font-serif text-xl md:text-2xl font-bold mb-2">Vous aimez cette selection ?</h2>
            <p className="text-white/65 text-sm md:text-base mb-4">
              Decouvrez tout le catalogue SO Caftan : takchitas, karakous et caftans pour vos evenements en Ile-de-France.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-gold hover:bg-brand-gold/90 text-white text-sm font-semibold transition-colors"
              >
                Voir le catalogue complet
              </Link>
              <a
                href="https://wa.me/33184180326?text=Bonjour%20SO%20Caftan%2C%20je%20viens%20de%20la%20wishlist%20partagee"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors"
              >
                <MessageCircle size={14} />
                Nous contacter
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default SharedWishlistPage
