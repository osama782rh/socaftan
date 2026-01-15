import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart, Eye, Star, ShoppingBag } from 'lucide-react'

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

  return (
    <section id="collection" className="section-padding bg-gradient-to-b from-neutral-900 via-gray-900 to-black relative overflow-hidden">
      
      {/* Luxury Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container-custom relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 backdrop-blur-xl border border-amber-500/30 px-8 py-4 rounded-full mb-8">
            <Star className="text-amber-400 fill-amber-400" size={24} />
            <span className="text-amber-400 font-bold text-lg tracking-wider">COLLECTION EXCLUSIVE</span>
            <Star className="text-amber-400 fill-amber-400" size={24} />
          </div>

          <h2 className="text-6xl md:text-7xl font-bold mb-6 text-white">
            Nos Pièces <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400">d'Exception</span>
          </h2>
        </motion.div>

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-20">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-10 py-4 rounded-full font-bold transition-all ${
                activeFilter === filter ? 'bg-amber-400 text-black' : 'bg-white/10 text-white hover:bg-white/20'
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
                <div className="relative bg-gray-800 rounded-3xl overflow-hidden border border-white/10 hover:border-amber-400/50 transition-colors">
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
                      <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform">
                        <Eye size={20} />
                      </button>
                      <button className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform">
                        <ShoppingBag size={20} />
                      </button>
                    </motion.div>

                    {caftan.featured && (
                      <div className="absolute top-4 left-4 bg-amber-400 text-black px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                        PREMIUM
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{caftan.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 h-10">{caftan.description}</p>
                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <span className="text-3xl font-bold text-amber-400">{caftan.price}</span>
                      <button className="bg-white/10 hover:bg-amber-400 hover:text-black text-white px-6 py-2 rounded-xl transition-all font-semibold">
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
    </section>
  )
}

export default Collection