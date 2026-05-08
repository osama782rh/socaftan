import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, ChevronRight, Heart, MessageCircle, X, Sparkles, Camera, Upload } from 'lucide-react'
import { resolveProductImage } from '../lib/productImages'
import { supabase } from '../lib/supabase'

// Galerie inspiration - chaque entree pointe vers un modele du catalogue
// Quand des photos clientes seront disponibles, elles remplaceront ces visuels
const galleryItems = [
  {
    id: 'andalouse-mariage',
    imageKey: 'ANDALOUSE',
    title: 'Andalouse',
    occasion: 'Mariage marocain',
    location: 'Paris (75)',
    category: 'takchita',
  },
  {
    id: 'jawhara-henna',
    imageKey: 'JAWHARA',
    title: 'Jawhara',
    occasion: 'Soiree henna',
    location: 'Tigery (91)',
    category: 'takchita',
  },
  {
    id: 'royale-fiancailles',
    imageKey: 'ROYALE',
    title: 'Royale',
    occasion: 'Fiancailles algeriennes',
    location: 'Creteil (94)',
    category: 'karakou',
  },
  {
    id: 'emeraude-mariage',
    imageKey: 'EMERAUDE',
    title: 'Emeraude',
    occasion: 'Mariage oriental',
    location: 'Versailles (78)',
    category: 'caftan',
  },
  {
    id: 'imperial-bronze-aid',
    imageKey: 'IMPERIAL_BRONZE',
    title: 'Imperial Bronze',
    occasion: 'Soiree Aid el-Fitr',
    location: 'Evry (91)',
    category: 'caftan',
  },
  {
    id: 'safran-mariage',
    imageKey: 'SAFRAN',
    title: 'Safran',
    occasion: 'Mariage tunisien',
    location: 'Boulogne (92)',
    category: 'caftan',
  },
  {
    id: 'takchita-bleu-mariage',
    imageKey: 'TAKCHITA_BLEU_MAJESTE',
    title: 'Takchita Bleu Majeste',
    occasion: 'Mariage marocain',
    location: 'Massy (91)',
    category: 'takchita',
  },
  {
    id: 'karakou-imperial-fiancailles',
    imageKey: 'KARAKOU_IMPERIAL',
    title: 'Karakou Imperial',
    occasion: 'Fiancailles',
    location: 'Saint-Denis (93)',
    category: 'karakou',
  },
  {
    id: 'soultana-mariage',
    imageKey: 'SOULTANA_DE_FES',
    title: 'Soultana de Fes',
    occasion: 'Henna marocaine',
    location: 'Vincennes (94)',
    category: 'takchita',
  },
  {
    id: 'lilas-aid',
    imageKey: 'LILAS',
    title: 'Lilas',
    occasion: 'Reception Aid',
    location: 'Issy-les-Moulineaux (92)',
    category: 'caftan',
  },
  {
    id: 'sfifa-mariage',
    imageKey: 'SFIFA_ROYALE',
    title: 'Sfifa Royale',
    occasion: 'Mariage marocain',
    location: 'Paris (75)',
    category: 'takchita',
  },
  {
    id: 'pourpe-soiree',
    imageKey: 'POURPE',
    title: 'Pourpre',
    occasion: 'Soiree de fin d\'annee',
    location: 'Neuilly (92)',
    category: 'caftan',
  },
]

const categoryLabels = {
  all: 'Toutes',
  takchita: 'Takchitas',
  karakou: 'Karakous',
  caftan: 'Caftans',
}

const GaleriePage = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [zoomedItem, setZoomedItem] = useState(null)
  const [customerPhotos, setCustomerPhotos] = useState([])

  // Charge les photos clientes approuvees
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await supabase
          .from('customer_photos')
          .select('id, public_url, caption, occasion, product_name, submitter_name, approved_at')
          .eq('status', 'approved')
          .order('approved_at', { ascending: false })
          .limit(20)
        if (!cancelled) setCustomerPhotos(data || [])
      } catch {
        // silencieux
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredItems =
    activeCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory)

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
          <li className="text-brand-ink font-medium">Galerie</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="container-custom px-5 md:px-10 py-8 md:py-12">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-semibold uppercase tracking-wide mb-4">
            Inspirations & realisations
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-brand-ink font-serif mb-4">
            Galerie SO Caftan
          </h1>
          <p className="text-brand-ink/65 text-base md:text-lg leading-relaxed">
            Decouvrez notre collection de takchitas, karakous et caftans portes par nos clientes pour leurs mariages,
            hennas et evenements orientaux en Ile-de-France. Chaque tenue raconte une histoire unique.
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section className="container-custom px-5 md:px-10 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeCategory === key
                  ? 'bg-brand-ink text-white'
                  : 'bg-white text-brand-ink/65 border border-brand-sand/70 hover:border-brand-gold/60'
              }`}
            >
              {label}
              <span className={`ml-1.5 text-xs ${activeCategory === key ? 'text-white/60' : 'text-brand-ink/40'}`}>
                ({key === 'all' ? galleryItems.length : galleryItems.filter((i) => i.category === key).length})
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Grille */}
      <section className="container-custom px-5 md:px-10 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setZoomedItem(item)}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand-sand/30 cursor-zoom-in"
              >
                <img
                  src={resolveProductImage(item.imageKey)}
                  alt={`${item.title} - ${item.occasion} - ${item.location}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay infos */}
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-brand-ink/90 via-brand-ink/40 to-transparent text-white">
                  <p className="text-xs md:text-sm font-semibold">{item.title}</p>
                  <p className="text-[10px] md:text-xs text-white/70 mt-0.5">{item.occasion}</p>
                </div>
                {/* Badge categorie */}
                <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-white/90 text-brand-ink text-[10px] font-semibold capitalize">
                  {categoryLabels[item.category]?.replace(/s$/, '') || item.category}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && (
          <p className="text-center text-brand-ink/45 py-10">Aucun modele dans cette categorie pour le moment.</p>
        )}
      </section>

      {/* Photos de la communaute (UGC approuvees) */}
      {customerPhotos.length > 0 && (
        <section className="container-custom px-5 md:px-10 py-10">
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-semibold uppercase tracking-wide mb-2">
                <Heart size={10} className="fill-current" />
                Communaute
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-ink">
                Nos clientes en SO Caftan
              </h2>
              <p className="text-sm text-brand-ink/55 mt-1">
                Les photos partagees par notre communaute (publiees avec autorisation)
              </p>
            </div>
            <Link
              to="/galerie/partager"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-gold hover:bg-brand-gold/90 text-white text-xs font-semibold transition-colors"
            >
              <Upload size={12} />
              Partager ma photo
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {customerPhotos.map((photo, idx) => (
              <motion.figure
                key={photo.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.3) }}
                className="aspect-square overflow-hidden rounded-2xl bg-brand-sand/30 relative group"
              >
                <img
                  src={photo.public_url}
                  alt={`Photo cliente ${photo.submitter_name || ''} - ${photo.occasion || ''}`.trim()}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {(photo.submitter_name || photo.occasion) && (
                  <figcaption className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-brand-ink/85 to-transparent text-white">
                    {photo.submitter_name && (
                      <p className="text-xs font-semibold">{photo.submitter_name}</p>
                    )}
                    {photo.occasion && (
                      <p className="text-[10px] text-white/70 capitalize">{photo.occasion}</p>
                    )}
                  </figcaption>
                )}
              </motion.figure>
            ))}
          </div>
        </section>
      )}

      {/* Bandeau partage */}
      <section className="container-custom px-5 md:px-10 py-8">
        <div className="bg-gradient-to-br from-brand-ink via-brand-night to-brand-ink rounded-2xl p-6 md:p-10 text-center text-white relative overflow-hidden">
          <div aria-hidden="true" className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/15 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-4">
              <Camera size={22} className="text-rose-300" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
              Partagez votre experience
            </h2>
            <p className="text-white/65 max-w-xl mx-auto mb-5 text-sm md:text-base">
              Vous avez porte une tenue SO Caftan ? Envoyez-nous votre photo et figurez dans notre galerie.
              Cela inspire d'autres futures mariees a oser la beaute orientale.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/galerie/partager"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-gold hover:bg-brand-gold/90 text-white text-sm font-semibold transition-colors"
              >
                <Upload size={15} />
                Envoyer ma photo
              </Link>
              <a
                href="https://www.instagram.com/so_caftan91/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors"
              >
                <Sparkles size={15} className="text-brand-gold" />
                Tagez @so_caftan91
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Maillage interne */}
      <section className="container-custom px-5 md:px-10 py-8">
        <h2 className="font-serif text-2xl font-bold text-brand-ink mb-5">Pour aller plus loin</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/location-takchita-ile-de-france" className="bg-white rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold transition-colors">
            <p className="font-semibold text-brand-ink">Location Takchita</p>
            <p className="text-xs text-brand-ink/55 mt-1">A partir de 90€</p>
          </Link>
          <Link to="/location-karakou-ile-de-france" className="bg-white rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold transition-colors">
            <p className="font-semibold text-brand-ink">Location Karakou</p>
            <p className="text-xs text-brand-ink/55 mt-1">A partir de 100€</p>
          </Link>
          <Link to="/location-caftan-mariage" className="bg-white rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold transition-colors">
            <p className="font-semibold text-brand-ink">Caftan Mariage</p>
            <p className="text-xs text-brand-ink/55 mt-1">Tenue pour votre mariage</p>
          </Link>
          <Link to="/avis-clients" className="bg-white rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold transition-colors">
            <p className="font-semibold text-brand-ink">Avis clients</p>
            <p className="text-xs text-brand-ink/55 mt-1">Ce qu'elles en pensent</p>
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {zoomedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-brand-ink/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={() => setZoomedItem(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${zoomedItem.title} - vue agrandie`}
          >
            <button
              type="button"
              onClick={() => setZoomedItem(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-[3/4] md:aspect-[4/3] bg-brand-sand/20">
                <img
                  src={resolveProductImage(zoomedItem.imageKey)}
                  alt={`${zoomedItem.title} - ${zoomedItem.occasion}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 md:p-7">
                <p className="text-xs text-brand-gold font-semibold uppercase tracking-wide">{categoryLabels[zoomedItem.category]?.replace(/s$/, '') || zoomedItem.category}</p>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-brand-ink mt-1">{zoomedItem.title}</h3>
                <p className="text-sm text-brand-ink/60 mt-2">
                  Porte pour {zoomedItem.occasion} · {zoomedItem.location}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    to="/location-caftan-mariage"
                    onClick={() => setZoomedItem(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-ink text-white text-sm font-semibold hover:bg-brand-night transition-colors"
                  >
                    Reserver une tenue similaire
                  </Link>
                  <a
                    href="https://wa.me/33184180326"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
                  >
                    <MessageCircle size={14} />
                    Me renseigner
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GaleriePage
