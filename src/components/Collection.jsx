import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart, Eye, Star, ShoppingBag, X } from 'lucide-react'

// --- IMPORTATION DES ASSETS ---
import imgAmbre from '../assets/CAFTAN_AMBRE.jpg'
import imgBleu from '../assets/CAFTAN_BLEU.jpg'
import imgBrocard from '../assets/CAFTAN_BROCARD.jpg'
import imgDamasOr from '../assets/CAFTAN_DAMAS_OR.jpg'
import imgJawharaArgent from '../assets/CAFTAN_JAWHARA_ARGENTE.jpg'
import imgJawharaRose from '../assets/CAFTAN_JAWHARA_ROSE.jpg'
import imgMalaki from '../assets/CAFTAN_MALAKI.jpg'
import imgMauveZouak from '../assets/CAFTAN_MAUVE_ZOUAK_EL_MAALEM.jpg'
import imgMoutardeMokhfi from '../assets/CAFTAN_MOUTARDE_MOKHFI.jpg'
import imgNesrine from '../assets/CAFTAN_NESRINE.jpg'
import imgNoir from '../assets/CAFTAN_NOIR.jpg'
import imgRougeJawhara from '../assets/CAFTAN_ROUGE_JAWHARA.jpg'
import imgZouakRoyal from '../assets/CAFTAN_ZOUAK_ROYAL.jpg'
import imgKarakouBleu from '../assets/KARAKOU_BLEU_DE_NUIT.jpg'
import imgKarakouEmeraude from '../assets/KARAKOU_EMERAUDE&OR.jpg'
import imgKarakouMajestic from '../assets/KARAKOU_MAJESTIC.jpg'
import imgKarakouObsidienne from '../assets/KARAKOU_OBSIDIENNE.jpg'

const Collection = () => {
  const [activeFilter, setActiveFilter] = useState('Tous')
  const [hoveredItem, setHoveredItem] = useState(null)
  const [zoomedItem, setZoomedItem] = useState(null)

  const filters = ['Tous', 'Caftans', 'Karakous']

  const caftans = [
    // --- SECTION CAFTANS ---
    {
      id: 1,
      name: 'Caftan Sfifa Royale',
      category: 'Caftans',
      price: '60€',
      image: imgRougeJawhara,
      description: 'Travail de Maâlem traditionnel ton sur ton',
      featured: true,
    },
    {
      id: 2,
      name: 'Caftan Malaki',
      category: 'Caftans',
      price: '60€',
      image: imgMalaki,
      description: 'Émeraude profond & finitions royales',
      featured: true,
    },
    {
      id: 3,
      name: 'Caftan Jawhara Argenté',
      category: 'Caftans',
      price: '60€',
      image: imgJawharaArgent,
      description: 'Brocart de soie fleuri & reflets argent',
      featured: true,
    },
    {
      id: 4,
      name: 'Caftan Damas d\'Or',
      category: 'Caftans',
      price: '60€',
      image: imgDamasOr,
      description: 'Tissu damassé noble & motifs andalous',
      featured: false,
    },
    {
      id: 5,
      name: 'Caftan Moutarde Mokhfi',
      category: 'Caftans',
      price: '60€',
      image: imgMoutardeMokhfi,
      description: 'Broderie Sabra fine sur soie moutarde',
      featured: false,
    },
    {
      id: 6,
      name: 'Caftan Zouak Royal',
      category: 'Caftans',
      price: '60€',
      image: imgZouakRoyal,
      description: 'Prune intense & broderies en relief',
      featured: false,
    },
    {
      id: 7,
      name: 'Caftan Nesrine',
      category: 'Caftans',
      price: '60€',
      image: imgNesrine,
      description: 'Vieux rose poudré & fleurs de soie',
      featured: false,
    },
    {
      id: 8,
      name: 'Caftan Ambre',
      category: 'Caftans',
      price: '60€',
      image: imgAmbre,
      description: 'Terre de Sienne & travail de Randa',
      featured: false,
    },

    // --- SECTION KARAKOUS ---
    {
      id: 9,
      name: 'Karakou Majestic',
      category: 'Karakous',
      price: '60€',
      image: imgKarakouMajestic,
      description: 'Velours bleu nuit & broderies Fetla or',
      featured: true,
    },
    {
      id: 10,
      name: 'Karakou Émeraude & Or',
      category: 'Karakous',
      price: '60€',
      image: imgKarakouEmeraude,
      description: 'Vert sapin impérial & perlage de cristal',
      featured: false,
    },
    {
      id: 11,
      name: 'Karakou Obsidienne',
      category: 'Karakous',
      price: '60€',
      image: imgKarakouObsidienne,
      description: 'Velours noir & broderies baroques roses',
      featured: false,
    },
    {
      id: 12,
      name: 'Karakou Bleu de Nuit',
      category: 'Karakous',
      price: '60€',
      image: imgKarakouBleu,
      description: 'Style Algérois pur & finitions argent',
      featured: false,
    },
  ]

  const filteredCaftans =
    activeFilter === 'Tous'
      ? caftans
      : caftans.filter((caftan) => caftan.category === activeFilter)

  useEffect(() => {
    if (!zoomedItem) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setZoomedItem(null)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [zoomedItem])

  return (
    <section id="collection" className="section-padding bg-gradient-to-b from-brand-ivory via-brand-mist to-brand-ivory relative overflow-hidden">
      
      {/* Luxury Background Elements */}
      <div className="absolute inset-0 opacity-35">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-brand-gold/25 to-brand-clay/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-brand-forest/20 to-brand-night/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container-custom relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-brand-gold/20 via-brand-goldSoft/20 to-brand-gold/20 backdrop-blur-xl border border-brand-gold/30 px-8 py-4 rounded-full mb-8">
            <Star className="text-brand-gold fill-brand-gold" size={24} />
            <span className="text-brand-gold font-bold text-lg tracking-wider">COLLECTION EXCLUSIVE</span>
            <Star className="text-brand-gold fill-brand-gold" size={24} />
          </div>

          <h2 className="text-6xl md:text-7xl font-bold mb-6 text-brand-ink">
            Nos Pièces <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-sand">d'Exception</span>
          </h2>
        </motion.div>

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-20">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-10 py-4 rounded-full font-bold transition-all ${
                activeFilter === filter ? 'bg-brand-gold text-brand-ink shadow-lg' : 'bg-brand-ivory text-brand-ink border border-brand-gold/30 hover:bg-brand-goldSoft/40'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {filteredCaftans.map((caftan) => (
              <motion.div
                key={caftan.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onHoverStart={() => setHoveredItem(caftan.id)}
                onHoverEnd={() => setHoveredItem(null)}
                className="group relative"
              >
                <div className="relative bg-[#14161c] rounded-3xl overflow-hidden border border-white/5 hover:border-brand-gold/50 transition-colors">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={caftan.image}
                      alt={caftan.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    <motion.div 
                      className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <button
                        type="button"
                        onClick={() => setZoomedItem(caftan)}
                        className="w-12 h-12 bg-brand-ivory rounded-full flex items-center justify-center text-brand-ink hover:scale-110 transition-transform"
                        aria-label={`Agrandir ${caftan.name}`}
                      >
                        <Eye size={20} />
                      </button>
                      <button className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-brand-ink hover:scale-110 transition-transform">
                        <ShoppingBag size={20} />
                      </button>
                    </motion.div>

                    {caftan.featured && (
                      <div className="absolute top-4 left-4 bg-brand-gold text-brand-ink px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                        PREMIUM
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{caftan.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 h-10">{caftan.description}</p>
                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <span className="text-3xl font-bold text-brand-gold">{caftan.price}</span>
                      <button className="bg-white/5 hover:bg-brand-gold hover:text-brand-ink text-brand-ivory px-6 py-2 rounded-xl transition-all font-semibold">
                        Réserver
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {zoomedItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedItem(null)}
          >
            <motion.div
              className="relative w-full max-w-5xl overflow-hidden rounded-[28px] bg-brand-ivory shadow-2xl"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                onClick={() => setZoomedItem(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-brand-ink shadow-lg transition hover:bg-white"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>

              <div className="grid md:grid-cols-[1.1fr_0.9fr]">
                <div className="relative bg-black/5">
                  <img
                    src={zoomedItem.image}
                    alt={zoomedItem.name}
                    className="h-full w-full object-cover md:h-[70vh]"
                  />
                </div>
                <div className="p-6 md:p-8 text-brand-ink">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-brand-clay font-semibold mb-3">
                    Apercu piece
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-3">{zoomedItem.name}</h3>
                  <p className="text-sm text-brand-ink/70 leading-relaxed">
                    {zoomedItem.description}
                  </p>

                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-3xl font-bold text-brand-gold">{zoomedItem.price}</span>
                    <button
                      type="button"
                      className="rounded-full bg-brand-forest px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-forestLight"
                    >
                      Reserver
                    </button>
                  </div>

                  <p className="mt-4 text-xs text-brand-ink/60">
                    Cliquez en dehors de l'image ou appuyez sur Esc pour fermer.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Collection
