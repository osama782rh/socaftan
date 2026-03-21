import { useState, Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  Environment,
  ContactShadows,
  PerspectiveCamera,
  PresentationControls,
  useGLTF,
  Html,
  useProgress
} from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Scissors, ArrowRight, Package, RotateCw, Loader2, Check, Shirt, Gem, Sparkles } from 'lucide-react'

/* ─────────────────────── 3D Scene ─────────────────────── */

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-brand-gold" size={36} />
        <p className="text-white/60 text-sm font-medium">{Math.round(progress)}%</p>
      </div>
    </Html>
  )
}

function Mannequin() {
  const { scene } = useGLTF('/models/mannequin.glb')
  const mannequin = useMemo(() => scene.clone(), [scene])

  return (
    <group position={[0, -14.7, 0]}>
      <primitive object={mannequin} scale={0.9} rotation={[0, Math.PI, 0]} />
    </group>
  )
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3, 260]} fov={14} />
      <ambientLight intensity={0.8} color="#fff5ee" />

      <directionalLight
        position={[8, 18, 12]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        color="#ffffff"
      />
      <directionalLight position={[-6, 10, 8]} intensity={1.2} color="#ffe4c4" />
      <spotLight position={[0, 12, -10]} angle={0.4} penumbra={0.8} intensity={1.5} color="#ffd4a8" />

      <Suspense fallback={<Loader />}>
        <PresentationControls
          global
          config={{ mass: 2, tension: 300 }}
          snap={{ mass: 4, tension: 1200 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 6, Math.PI / 6]}
          azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
        >
          <Mannequin />
        </PresentationControls>
        <ContactShadows position={[0, -14.7, 0]} opacity={0.35} scale={10} blur={2.5} far={8} />
        <Environment preset="studio" />
      </Suspense>
    </>
  )
}

/* ─────────────────────── Configurator UI ─────────────────────── */

const categories = [
  { id: 'style', name: 'Style', icon: <Package size={16} /> },
  { id: 'tissu', name: 'Tissu', icon: <Scissors size={16} /> },
  { id: 'couleur', name: 'Couleur', icon: <Palette size={16} /> },
  { id: 'forme', name: 'Forme', icon: <Shirt size={16} /> },
  { id: 'details', name: 'Détails', icon: <Sparkles size={16} /> },
  { id: 'finitions', name: 'Finitions', icon: <Gem size={16} /> },
]

const options = {
  style: {
    type: [
      { name: 'Caftan', desc: 'Traditionnel élégant' },
      { name: 'Karakou', desc: 'Style algérois' },
      { name: 'Takchita', desc: 'Deux pièces luxe' },
    ]
  },
  tissu: {
    fabric: [
      { name: 'Satin', description: 'Élégant et fluide', price: 0 },
      { name: 'Velours', description: 'Noble et luxueux', price: 30 },
      { name: 'Soie', description: 'Premium et délicat', price: 80 },
      { name: 'Brocart', description: 'Tissage royal', price: 100 },
      { name: 'Organza', description: 'Transparent et léger', price: 60 },
      { name: 'Dentelle', description: 'Romantique et raffiné', price: 70 },
    ]
  },
  couleur: {
    color: [
      { name: 'Bordeaux', hex: '#800020' },
      { name: 'Or', hex: '#FFD700' },
      { name: 'Émeraude', hex: '#50C878' },
      { name: 'Bleu royal', hex: '#002366' },
      { name: 'Rose poudré', hex: '#F4C2C2' },
      { name: 'Noir', hex: '#000000' },
      { name: 'Blanc ivoire', hex: '#FFFFF0' },
      { name: 'Violet impérial', hex: '#5F0F8B' },
      { name: 'Turquoise', hex: '#40E0D0' },
      { name: 'Corail', hex: '#FF7F50' },
      { name: 'Argent', hex: '#C0C0C0' },
      { name: 'Champagne', hex: '#F7E7CE' },
      { name: 'Marine', hex: '#000080' },
      { name: 'Rubis', hex: '#E0115F' },
      { name: 'Jade', hex: '#00A86B' },
      { name: 'Améthyste', hex: '#9966CC' },
    ]
  },
  forme: {
    col: [
      { name: 'Col Rond', price: 0 },
      { name: 'Col V', price: 10 },
      { name: 'Col Bateau', price: 10 },
      { name: 'Col Tunisien', price: 15 },
      { name: 'Col Carré', price: 15 },
    ],
    manches: [
      { name: 'Manches Longues', price: 0 },
      { name: 'Manches 3/4', price: 0 },
      { name: 'Manches Courtes', price: -10 },
      { name: 'Manches Kimono', price: 20 },
      { name: 'Sans manches', price: -20 },
    ],
    coupe: [
      { name: 'Droite', desc: 'Coupe classique' },
      { name: 'Évasée', desc: 'Coupe ample' },
      { name: 'Ajustée', desc: 'Coupe près du corps' },
    ],
    length: [
      { name: 'Courte (120 cm)', price: -15 },
      { name: 'Standard (150 cm)', price: 0 },
      { name: 'Longue (160 cm)', price: 20 },
      { name: 'Très longue (170 cm)', price: 30 },
    ]
  },
  details: {
    broderies: [
      { name: 'Sans broderie', price: 0 },
      { name: 'Broderie Simple', price: 50 },
      { name: 'Broderie Moyenne', price: 100 },
      { name: 'Broderie Luxe', price: 150 },
    ],
    couleurBroderie: [
      { name: 'Or', hex: '#FFD700' },
      { name: 'Argent', hex: '#C0C0C0' },
      { name: 'Cuivre', hex: '#B87333' },
      { name: 'Blanc', hex: '#FFFFFF' },
    ]
  },
  finitions: {
    finitions: [
      { name: 'Perles', desc: 'Perles nacrées cousues', price: 80 },
      { name: 'Sequins', desc: 'Sequins brillants', price: 60 },
      { name: 'Strass', desc: 'Strass cristal', price: 100 },
      { name: 'Paillettes', desc: 'Paillettes dorées', price: 50 },
    ],
    ceinture: [
      { name: 'Sans ceinture', price: 0 },
      { name: 'Mince', desc: 'Ceinture fine', price: 15 },
      { name: 'Large', desc: 'Ceinture statement', price: 30 },
    ],
    couleurCeinture: [
      { name: 'Or', hex: '#DAA520' },
      { name: 'Argent', hex: '#C0C0C0' },
      { name: 'Bronze', hex: '#CD7F32' },
    ]
  }
}

const optionLabels = {
  type: 'Type de tenue',
  fabric: 'Tissu',
  color: 'Couleur principale',
  col: 'Encolure',
  manches: 'Manches',
  coupe: 'Coupe',
  length: 'Longueur',
  broderies: 'Broderies',
  couleurBroderie: 'Couleur broderie',
  finitions: 'Finitions',
  ceinture: 'Ceinture',
  couleurCeinture: 'Couleur ceinture',
}

const summaryLabels = {
  type: 'Style',
  fabric: 'Tissu',
  color: 'Couleur',
  col: 'Encolure',
  manches: 'Manches',
  coupe: 'Coupe',
  length: 'Longueur',
  broderies: 'Broderies',
  ceinture: 'Ceinture',
}

function ColorSwatch({ hex, name, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
        selected ? 'bg-brand-sand ring-2 ring-brand-gold' : 'hover:bg-brand-sand/40'
      }`}
      title={name}
    >
      <div
        className={`w-8 h-8 rounded-full border-2 transition-all ${
          selected ? 'border-brand-gold scale-110' : 'border-brand-sand'
        }`}
        style={{ backgroundColor: hex }}
      />
      <span className="text-[9px] font-medium text-brand-ink/50 leading-tight text-center">{name}</span>
    </button>
  )
}

function OptionButton({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-xl border transition-all text-sm ${
        selected
          ? 'border-brand-gold bg-brand-sand/40 ring-1 ring-brand-gold/30'
          : 'border-brand-sand/60 hover:border-brand-gold/40 bg-white'
      }`}
    >
      {children}
    </button>
  )
}

const Custom3D = () => {
  const [currentCategory, setCurrentCategory] = useState('style')
  const [configuration, setConfiguration] = useState({
    type: 'Caftan',
    fabric: 'Satin',
    color: 'Bordeaux',
    colorHex: '#800020',
    col: 'Col Rond',
    manches: 'Manches Longues',
    coupe: 'Droite',
    length: 'Standard (150 cm)',
    broderies: 'Sans broderie',
    couleurBroderie: '#FFD700',
    finitions: [],
    ceinture: 'Mince',
    couleurCeinture: '#DAA520',
  })

  const handleOptionSelect = (stepKey, optionName, hex = null) => {
    if (stepKey === 'finitions') {
      setConfiguration(prev => ({
        ...prev,
        finitions: prev.finitions.includes(optionName)
          ? prev.finitions.filter(f => f !== optionName)
          : [...prev.finitions, optionName]
      }))
    } else {
      setConfiguration(prev => ({
        ...prev,
        [stepKey]: optionName,
        ...(hex && stepKey === 'color' && { colorHex: hex }),
        ...(hex && stepKey === 'couleurBroderie' && { couleurBroderie: hex }),
        ...(hex && stepKey === 'couleurCeinture' && { couleurCeinture: hex }),
      }))
    }
  }

  const calculatePrice = () => {
    let total = 220
    Object.keys(options).forEach(cat => {
      Object.keys(options[cat]).forEach(key => {
        const opts = options[cat][key]
        const selected = configuration[key]
        if (Array.isArray(selected)) {
          selected.forEach(s => {
            const opt = opts.find(o => o.name === s)
            if (opt?.price) total += opt.price
          })
        } else {
          const opt = opts.find(o => o.name === selected)
          if (opt?.price) total += opt.price
        }
      })
    })
    return total
  }

  const currentCatIndex = categories.findIndex(c => c.id === currentCategory)

  const goNext = () => {
    if (currentCatIndex < categories.length - 1) {
      setCurrentCategory(categories[currentCatIndex + 1].id)
    }
  }

  const goPrev = () => {
    if (currentCatIndex > 0) {
      setCurrentCategory(categories[currentCatIndex - 1].id)
    }
  }

  return (
    <section id="custom" className="py-12 md:py-16 px-4 md:px-6 bg-brand-ivory">
      <div className="max-w-[1600px] mx-auto">

        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="section-label justify-center">Configurateur</p>
          <h2 className="section-title text-center">
            Personnalisez votre <span className="italic font-light">création</span>
          </h2>
        </div>

        {/* Category Stepper */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between bg-white rounded-full p-1.5 border border-brand-sand/60">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => setCurrentCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 md:px-5 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                  currentCategory === cat.id
                    ? 'bg-brand-ink text-white'
                    : i < currentCatIndex
                    ? 'text-brand-gold hover:bg-brand-sand/30'
                    : 'text-brand-ink/40 hover:text-brand-ink/60'
                }`}
              >
                <span className="hidden sm:inline">{cat.icon}</span>
                <span className="hidden md:inline">{cat.name}</span>
                <span className="md:hidden">{cat.name.slice(0, 3)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Layout: Options | 3D | Summary */}
        <div className="grid xl:grid-cols-[340px_1fr_300px] lg:grid-cols-[300px_1fr] gap-5 items-start">

          {/* LEFT: Options Panel */}
          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCategory}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {Object.keys(options[currentCategory]).map((optKey) => {
                  const opts = options[currentCategory][optKey]
                  const isColor = optKey === 'color' || optKey === 'couleurBroderie' || optKey === 'couleurCeinture'

                  return (
                    <div key={optKey} className="bg-white rounded-2xl p-5 border border-brand-sand/50">
                      <h3 className="text-xs font-semibold text-brand-ink/40 uppercase tracking-wide mb-3">
                        {optionLabels[optKey] || optKey}
                      </h3>

                      {isColor ? (
                        <div className="grid grid-cols-4 gap-1">
                          {opts.map((opt) => (
                            <ColorSwatch
                              key={opt.name}
                              hex={opt.hex}
                              name={opt.name}
                              selected={
                                optKey === 'color'
                                  ? configuration.color === opt.name
                                  : configuration[optKey] === opt.hex
                              }
                              onClick={() => handleOptionSelect(optKey, optKey === 'color' ? opt.name : opt.hex, opt.hex)}
                            />
                          ))}
                        </div>
                      ) : optKey === 'type' ? (
                        /* Type cards: stacked with centered content */
                        <div className="grid grid-cols-1 gap-2">
                          {opts.map((opt) => {
                            const isSelected = configuration[optKey] === opt.name
                            return (
                              <button
                                key={opt.name}
                                onClick={() => handleOptionSelect(optKey, opt.name)}
                                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                                  isSelected
                                    ? 'border-brand-gold bg-brand-sand/40 ring-1 ring-brand-gold/30'
                                    : 'border-brand-sand/60 hover:border-brand-gold/40 bg-white'
                                }`}
                              >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                  isSelected ? 'bg-brand-gold text-white' : 'bg-brand-sand text-brand-ink/60'
                                }`}>
                                  {opt.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-sm font-medium text-brand-ink">{opt.name}</div>
                                  {opt.desc && <div className="text-[11px] text-brand-ink/35">{opt.desc}</div>}
                                </div>
                                {isSelected && <Check size={14} className="text-brand-gold ml-auto flex-shrink-0" />}
                              </button>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="grid gap-2 grid-cols-1">
                          {opts.map((opt) => {
                            const isSelected = optKey === 'finitions'
                              ? configuration.finitions.includes(opt.name)
                              : configuration[optKey] === opt.name

                            return (
                              <OptionButton
                                key={opt.name}
                                selected={isSelected}
                                onClick={() => handleOptionSelect(optKey, opt.name)}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    {isSelected && <Check size={14} className="text-brand-gold flex-shrink-0" />}
                                    <div className="min-w-0">
                                      <span className={`font-medium ${isSelected ? 'text-brand-ink' : 'text-brand-ink/70'}`}>
                                        {opt.name}
                                      </span>
                                      {(opt.desc || opt.description) && (
                                        <p className="text-[11px] text-brand-ink/35 mt-0.5 truncate">
                                          {opt.desc || opt.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  {opt.price !== undefined && opt.price !== 0 && (
                                    <span className={`text-xs font-semibold flex-shrink-0 ${opt.price > 0 ? 'text-brand-gold' : 'text-green-600'}`}>
                                      {opt.price > 0 ? '+' : ''}{opt.price}€
                                    </span>
                                  )}
                                </div>
                              </OptionButton>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={goPrev}
                disabled={currentCatIndex === 0}
                className="flex-1 py-3 rounded-xl border border-brand-sand/60 text-sm font-medium text-brand-ink/50 hover:border-brand-ink/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Précédent
              </button>
              <button
                onClick={goNext}
                disabled={currentCatIndex === categories.length - 1}
                className="flex-1 py-3 rounded-xl bg-brand-ink text-white text-sm font-medium hover:bg-brand-ink/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>

          {/* CENTER: 3D Viewer */}
          <div className="relative h-[600px] lg:h-[800px] rounded-2xl bg-brand-ink overflow-hidden border border-white/5">
            <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }}>
              <Scene />
            </Canvas>

            {/* Overlay UI */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full">
              <RotateCw size={14} className="text-brand-gold" />
              <span className="text-white/60 text-xs">Glissez pour tourner</span>
            </div>
          </div>

          {/* RIGHT: Summary */}
          <div className="space-y-4">
            {/* Configuration Summary */}
            <div className="bg-white rounded-2xl p-5 border border-brand-sand/50">
              <h3 className="text-xs font-semibold text-brand-ink/40 uppercase tracking-wide mb-4">
                Récapitulatif
              </h3>

              <div className="space-y-2.5 mb-5">
                {Object.keys(summaryLabels).map((key) => {
                  const val = configuration[key]
                  if (!val || (Array.isArray(val) && val.length === 0)) return null
                  return (
                    <div key={key} className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-brand-ink/40">{summaryLabels[key]}</span>
                      <span className="text-xs font-semibold text-brand-ink flex items-center gap-1.5">
                        {key === 'color' && (
                          <span className="w-3 h-3 rounded-full border border-brand-sand" style={{ backgroundColor: configuration.colorHex }} />
                        )}
                        {val}
                      </span>
                    </div>
                  )
                })}
                {configuration.finitions.length > 0 && (
                  <div className="flex items-start justify-between py-1.5">
                    <span className="text-xs text-brand-ink/40">Finitions</span>
                    <span className="text-xs font-semibold text-brand-ink text-right">
                      {configuration.finitions.join(', ')}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-brand-sand/40 pt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-brand-ink/40">Prix estimé</span>
                  <span className="text-xs text-brand-ink/40">TTC</span>
                </div>
                <div className="text-3xl font-bold text-brand-ink font-serif">
                  {calculatePrice()}€
                </div>
              </div>
            </div>

            {/* CTA */}
            <a
              href="#contact"
              className="group flex items-center justify-center gap-2 w-full bg-brand-ink text-white py-4 rounded-xl font-semibold text-sm hover:bg-brand-ink/90 transition-colors"
            >
              Commander
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </a>

            <p className="text-[11px] text-brand-ink/30 text-center leading-relaxed">
              Acompte de 50% à la commande
              <br />
              Délai de confection : 4-6 semaines
            </p>

            {/* Contact shortcut */}
            <div className="bg-brand-sand/30 rounded-xl p-4 text-center">
              <p className="text-xs text-brand-ink/40 mb-2">Besoin de conseils ?</p>
              <a
                href="tel:+33699832902"
                className="text-sm font-semibold text-brand-ink hover:text-brand-gold transition-colors"
              >
                06 99 83 29 02
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

useGLTF.preload('/models/mannequin.glb')

export default Custom3D
