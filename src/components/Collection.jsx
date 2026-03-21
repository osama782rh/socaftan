import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, X, ArrowRight } from 'lucide-react'

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
  const [zoomedItem, setZoomedItem] = useState(null)

  const filters = ['Tous', 'Caftans', 'Karakous']

  const caftans = [
    { id: 1, name: 'Sfifa Royale', category: 'Caftans', price: '60€', image: imgRougeJawhara, description: 'Travail de Maâlem traditionnel ton sur ton', featured: true },
    { id: 2, name: 'Malaki', category: 'Caftans', price: '60€', image: imgMalaki, description: 'Émeraude profond & finitions royales', featured: true },
    { id: 3, name: 'Jawhara Argenté', category: 'Caftans', price: '60€', image: imgJawharaArgent, description: 'Brocart de soie fleuri & reflets argent', featured: true },
    { id: 4, name: 'Damas d\'Or', category: 'Caftans', price: '60€', image: imgDamasOr, description: 'Tissu damassé noble & motifs andalous' },
    { id: 5, name: 'Moutarde Mokhfi', category: 'Caftans', price: '60€', image: imgMoutardeMokhfi, description: 'Broderie Sabra fine sur soie moutarde' },
    { id: 6, name: 'Zouak Royal', category: 'Caftans', price: '60€', image: imgZouakRoyal, description: 'Prune intense & broderies en relief' },
    { id: 7, name: 'Nesrine', category: 'Caftans', price: '60€', image: imgNesrine, description: 'Vieux rose poudré & fleurs de soie' },
    { id: 8, name: 'Ambre', category: 'Caftans', price: '60€', image: imgAmbre, description: 'Terre de Sienne & travail de Randa' },
    { id: 9, name: 'Majestic', category: 'Karakous', price: '60€', image: imgKarakouMajestic, description: 'Velours bleu nuit & broderies Fetla or', featured: true },
    { id: 10, name: 'Émeraude & Or', category: 'Karakous', price: '60€', image: imgKarakouEmeraude, description: 'Vert sapin impérial & perlage de cristal' },
    { id: 11, name: 'Obsidienne', category: 'Karakous', price: '60€', image: imgKarakouObsidienne, description: 'Velours noir & broderies baroques roses' },
    { id: 12, name: 'Bleu de Nuit', category: 'Karakous', price: '60€', image: imgKarakouBleu, description: 'Style Algérois pur & finitions argent' },
  ]

  const filteredCaftans =
    activeFilter === 'Tous'
      ? caftans
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
        <div className="flex justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-brand-ink text-white'
                  : 'bg-white text-brand-ink/60 hover:text-brand-ink border border-brand-sand'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredCaftans.map((caftan) => (
              <motion.div
                key={caftan.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer"
                onClick={() => setZoomedItem(caftan)}
              >
                <div className="relative bg-white rounded-2xl overflow-hidden border border-brand-sand/50 hover:shadow-lg hover:border-brand-gold/30 transition-all duration-500">
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
                      <div className="absolute top-3 left-3 bg-brand-gold text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">
                        Coup de coeur
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-brand-ink font-serif">{caftan.name}</h3>
                        <p className="text-brand-ink/40 text-xs mt-0.5">{caftan.category === 'Caftans' ? 'Caftan' : 'Karakou'}</p>
                      </div>
                      <span className="text-lg font-bold text-brand-gold font-serif">{caftan.price}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

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
              transition={{ duration: 0.25 }}
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
                    {zoomedItem.category === 'Caftans' ? 'Caftan' : 'Karakou'}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-bold text-brand-ink font-serif mb-3">
                    {zoomedItem.name}
                  </h3>
                  <p className="text-brand-ink/50 text-sm leading-relaxed mb-8">
                    {zoomedItem.description}
                  </p>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-3xl font-bold text-brand-ink font-serif">{zoomedItem.price}</span>
                      <span className="text-brand-ink/40 text-sm ml-2">/ location</span>
                    </div>
                  </div>

                  <a
                    href="#contact"
                    onClick={() => setZoomedItem(null)}
                    className="flex items-center justify-center gap-2 bg-brand-ink text-white py-3.5 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-colors"
                  >
                    Réserver cette pièce
                    <ArrowRight size={16} />
                  </a>

                  <p className="mt-4 text-[11px] text-brand-ink/30 text-center">
                    Appuyez sur Esc pour fermer
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
