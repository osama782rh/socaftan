import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Eye, X, ArrowRight, ShoppingBag, Calendar } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import RentalDateModal from './RentalDateModal'

import imgAndalouse from '../assets/ANDALOUSE.jpeg'
import imgAzurMagenta from '../assets/AZUR_MAGENTA.jpeg'
import imgCaftanAmbre from '../assets/CAFTAN_AMBRE.jpeg'
import imgEmeraude from '../assets/EMERAUDE.png'
import imgImperialBronze from '../assets/IMPERIAL_BRONZE.png'
import imgIndigo from '../assets/INDIGO.png'
import imgJade from '../assets/JADE.jpeg'
import imgJawhara from '../assets/JAWHARA.jpeg'
import imgKarakouImperial from '../assets/KARAKOU_IMPERIAL.jpeg'
import imgLilas from '../assets/LILAS.png'
import imgPourpe from '../assets/POURPE.jpeg'
import imgRoyale from '../assets/ROYALE.jpeg'
import imgSafran from '../assets/SAFRAN.png'
import imgSfifaRoyale from '../assets/SFIFA_ROYALE.jpeg'
import imgSoultanaDeFes from '../assets/SOULTANA_DE_FES.png'
import imgTakchitaBleuMajeste from '../assets/TAKCHITA_BLEU_MAJESTE.jpeg'
import imgTakchitaNuitRoyale from '../assets/TAKCHITA_NUIT_ROYALE.jpeg'
import imgTakchitaSultana from '../assets/TAKCHITA_SULTANA.jpeg'

const easePremium = [0.22, 1, 0.36, 1]

const Collection = () => {
  const [activeFilter, setActiveFilter] = useState('Tous')
  const [zoomedItem, setZoomedItem] = useState(null)
  const [rentalModal, setRentalModal] = useState(null)
  const prefersReducedMotion = useReducedMotion()
  const { addItem } = useCart()

  const filters = ['Tous', 'Caftans', 'Karakous', 'Takchita']

  const caftans = [
    { id: 1, name: 'Andalouse', category: 'Caftans', rentalPrice: null, purchasePrice: 150, image: imgAndalouse, description: 'Coupe élégante et finitions artisanales.', featured: true },
    { id: 2, name: 'Azur Magenta', category: 'Caftans', rentalPrice: null, purchasePrice: 150, image: imgAzurMagenta, description: 'Alliance raffinée de tons vibrants et de détails couture.' },
    { id: 3, name: 'Caftan Ambre', category: 'Caftans', rentalPrice: null, purchasePrice: 150, image: imgCaftanAmbre, description: 'Pièce lumineuse au style intemporel.' },
    { id: 4, name: 'Émeraude', category: 'Caftans', rentalPrice: null, purchasePrice: 150, image: imgEmeraude, description: 'Nuance profonde sublimée par un travail délicat.' },
    { id: 5, name: 'Impérial Bronze', category: 'Caftans', rentalPrice: null, purchasePrice: 150, image: imgImperialBronze, description: 'Silhouette majestueuse et finition brillante.' },
    { id: 6, name: 'Indigo', category: 'Caftans', rentalPrice: null, purchasePrice: 150, image: imgIndigo, description: 'Équilibre parfait entre modernité et tradition.' },
    { id: 7, name: 'Jade', category: 'Karakous', rentalPrice: 100, purchasePrice: null, image: imgJade, description: 'Tonalité chic et détails raffinés.' },
    { id: 8, name: 'Jawhara', category: 'Caftans', rentalPrice: null, purchasePrice: 150, image: imgJawhara, description: 'Pièce signature au charme marocain.', featured: true },
    { id: 9, name: 'Karakou Impérial', category: 'Karakous', rentalPrice: 100, purchasePrice: null, image: imgKarakouImperial, description: 'Karakou élégant aux finitions premium.', featured: true },
    { id: 10, name: 'Lilas', category: 'Caftans', rentalPrice: null, purchasePrice: 150, image: imgLilas, description: 'Couleur douce et allure distinguée.' },
    { id: 11, name: 'Pourpe', category: 'Caftans', rentalPrice: null, purchasePrice: 150, image: imgPourpe, description: 'Style affirmé et détails soignés.' },
    { id: 12, name: 'Royale', category: 'Karakous', rentalPrice: 100, purchasePrice: null, image: imgRoyale, description: 'Inspiration royale pour vos événements.' },
    { id: 13, name: 'Safran', category: 'Caftans', rentalPrice: null, purchasePrice: 150, image: imgSafran, description: 'Teinte chaude et élégance assumée.' },
    { id: 14, name: 'Sfifa Royale', category: 'Caftans', rentalPrice: null, purchasePrice: 150, image: imgSfifaRoyale, description: 'Travail sfifa traditionnel revisité.' },
    { id: 15, name: 'Soultana de Fès', category: 'Caftans', rentalPrice: 90, purchasePrice: null, image: imgSoultanaDeFes, description: 'Hommage à l’élégance fassie.', isTakchita: true },
    { id: 16, name: 'Takchita Bleu Majesté', category: 'Caftans', rentalPrice: 90, purchasePrice: null, image: imgTakchitaBleuMajeste, description: 'Takchita d’exception aux lignes nobles.', featured: true, isTakchita: true },
    { id: 17, name: 'Takchita Nuit Royale', category: 'Caftans', rentalPrice: 90, purchasePrice: null, image: imgTakchitaNuitRoyale, description: 'Silhouette de soirée, chic et royale.', isTakchita: true },
    { id: 18, name: 'Takchita Sultana', category: 'Caftans', rentalPrice: 90, purchasePrice: null, image: imgTakchitaSultana, description: 'Takchita sophistiquée pour les grandes occasions.', isTakchita: true },
  ]

  const getProductModes = (product) => {
    const canRent = typeof product.rentalPrice === 'number' && product.rentalPrice > 0
    const canBuy = typeof product.purchasePrice === 'number' && product.purchasePrice > 0
    return { canRent, canBuy }
  }

  const formatCardPrice = (product) => {
    const { canRent, canBuy } = getProductModes(product)
    if (canRent && !canBuy) return `${product.rentalPrice}€`
    if (canBuy && !canRent) return `${product.purchasePrice}€`
    if (canRent && canBuy) return `${product.rentalPrice}€ / ${product.purchasePrice}€`
    return '-'
  }

  const handleRent = (product, e) => {
    e.stopPropagation()
    if (typeof product.rentalPrice !== 'number' || product.rentalPrice <= 0) return
    setRentalModal(product)
  }

  const handleRentalConfirm = (dates) => {
    if (rentalModal) {
      addItem(rentalModal, 'location', dates)
      setRentalModal(null)
    }
  }

  const handleBuy = (product, e) => {
    e.stopPropagation()
    if (typeof product.purchasePrice !== 'number' || product.purchasePrice <= 0) return
    addItem(product, 'achat')
  }

  const filteredCaftans =
    activeFilter === 'Tous'
      ? caftans
      : activeFilter === 'Takchita'
        ? caftans.filter((c) => c.isTakchita)
        : activeFilter === 'Caftans'
          ? caftans.filter((c) => c.category === 'Caftans' && !c.isTakchita)
          : caftans.filter((c) => c.category === activeFilter)

  useEffect(() => {
    if (!zoomedItem) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setZoomedItem(null)
    }

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [zoomedItem])

  const zoomedModes = zoomedItem ? getProductModes(zoomedItem) : { canRent: false, canBuy: false }

  return (
    <section id="collection" className="section-padding bg-brand-cream relative">
      <div className="container-custom">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="section-label justify-center">Collection exclusive</p>
          <h2 className="section-title text-center">
            Nos pièces <span className="italic font-light">d'exception</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Chaque caftan raconte une histoire d'artisanat et de raffinement.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex gap-1 rounded-full p-1.5 bg-white/85 border border-brand-sand/70 shadow-sm backdrop-blur-sm">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
                className="relative px-5 md:px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-300"
            >
                {activeFilter === filter && (
                  <motion.span
                    layoutId="collection-active-filter"
                    className="absolute inset-0 rounded-full bg-brand-ink shadow-[0_8px_20px_rgba(43,32,26,0.22)]"
                    transition={{
                      type: 'spring',
                      stiffness: 360,
                      damping: 32,
                    }}
                  />
                )}
                <span className={`relative z-10 ${activeFilter === filter ? 'text-white' : 'text-brand-ink/60 hover:text-brand-ink'}`}>
                  {filter}
                </span>
            </button>
          ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredCaftans.map((caftan, index) => {
              const { canRent, canBuy } = getProductModes(caftan)
              return (
              <motion.div
                key={caftan.id}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.97 }}
                transition={{
                  duration: 0.45,
                  ease: easePremium,
                  delay: prefersReducedMotion ? 0 : Math.min(index * 0.035, 0.3),
                }}
                className="group cursor-pointer"
                whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                onClick={() => setZoomedItem(caftan)}
              >
                <div className="relative bg-white rounded-2xl overflow-hidden border border-brand-sand/50 hover:shadow-lg hover:border-brand-gold/30 transition-all duration-500">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-brand-sand/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]" />

                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={caftan.image}
                      alt={caftan.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-brand-ink/0 group-hover:bg-brand-ink/20 transition-colors duration-500 flex items-center justify-center">
                      <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                        <Eye size={18} className="text-brand-ink" />
                      </div>
                    </div>

                    {caftan.featured && (
                      <motion.div
                        animate={prefersReducedMotion ? undefined : { y: [0, -2, 0] }}
                        transition={prefersReducedMotion ? undefined : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-3 left-3 bg-brand-gold text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase"
                      >
                        Coup de coeur
                      </motion.div>
                    )}
                    {caftan.isTakchita && (
                      <div className="absolute top-3 right-3 bg-brand-ink/85 text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">
                        Takchita
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-brand-ink font-serif">{caftan.name}</h3>
                        <p className="text-brand-ink/40 text-xs mt-0.5">
                          {caftan.isTakchita ? 'Takchita • ' : ''}
                          {caftan.category === 'Caftans' ? 'Caftan' : 'Karakou'}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-brand-gold font-serif">{formatCardPrice(caftan)}</span>
                    </div>
                    <div className="flex gap-2">
                      {canRent && (
                        <button
                          onClick={(e) => handleRent(caftan, e)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full bg-brand-ink text-white text-xs font-semibold hover:bg-brand-ink/90 transition-colors"
                        >
                          <Calendar size={12} />
                          Louer
                        </button>
                      )}
                      {canBuy && (
                        <button
                          onClick={(e) => handleBuy(caftan, e)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full border border-brand-ink text-brand-ink text-xs font-semibold hover:bg-brand-ink hover:text-white transition-colors"
                        >
                          <ShoppingBag size={12} />
                          Acheter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Rental Date Modal */}
      <AnimatePresence>
        {rentalModal && (
          <RentalDateModal
            product={rentalModal}
            onConfirm={handleRentalConfirm}
            onClose={() => setRentalModal(null)}
          />
        )}
      </AnimatePresence>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomedItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedItem(null)}
          >
            <motion.div
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: easePremium }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                onClick={() => setZoomedItem(null)}
                className="absolute right-4 top-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-ink hover:bg-white transition-colors shadow-sm"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>

              <div className="grid md:grid-cols-[1.2fr_0.8fr]">
                <div className="bg-brand-sand/20">
                  <img
                    src={zoomedItem.image}
                    alt={zoomedItem.name}
                    className="w-full h-full object-cover max-h-[80vh]"
                  />
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold mb-3">
                    {zoomedItem.isTakchita ? 'Takchita • ' : ''}
                    {zoomedItem.category === 'Caftans' ? 'Caftan' : 'Karakou'}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-bold text-brand-ink font-serif mb-3">
                    {zoomedItem.name}
                  </h3>
                  <p className="text-brand-ink/50 text-sm leading-relaxed mb-8">
                    {zoomedItem.description}
                  </p>

                  <div className="mb-6">
                    {zoomedModes.canRent && (
                      <div>
                        <span className="text-3xl font-bold text-brand-gold font-serif">{zoomedItem.rentalPrice}€</span>
                        <span className="text-brand-ink/40 text-sm ml-1">/ location</span>
                      </div>
                    )}
                    {zoomedModes.canBuy && (
                      <div>
                        <span className="text-3xl font-bold text-brand-ink font-serif">{zoomedItem.purchasePrice}€</span>
                        <span className="text-brand-ink/40 text-sm ml-1">/ achat</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {zoomedModes.canRent && (
                      <button
                        onClick={() => { setZoomedItem(null); setRentalModal(zoomedItem) }}
                        className="flex-1 flex items-center justify-center gap-2 bg-brand-ink text-white py-3.5 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-colors"
                      >
                        <Calendar size={16} />
                        Louer
                      </button>
                    )}
                    {zoomedModes.canBuy && (
                      <button
                        onClick={() => { handleBuy(zoomedItem, { stopPropagation: () => {} }); setZoomedItem(null) }}
                        className="flex-1 flex items-center justify-center gap-2 border-2 border-brand-ink text-brand-ink py-3.5 rounded-full font-semibold text-sm hover:bg-brand-ink hover:text-white transition-colors"
                      >
                        <ShoppingBag size={16} />
                        Acheter
                      </button>
                    )}
                  </div>

                  <a
                    href="#contact"
                    onClick={() => setZoomedItem(null)}
                    className="flex items-center justify-center gap-1 text-brand-gold text-xs font-semibold mt-4 hover:text-brand-gold/80 transition-colors"
                  >
                    Ou contactez-nous pour plus d'infos
                    <ArrowRight size={12} />
                  </a>
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
