import { useState, Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { 
  Environment, 
  ContactShadows, 
  PerspectiveCamera, 
  Float, 
  PresentationControls,
  useGLTF,
  Html,
  useProgress
} from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Sparkles, Scissors, ArrowRight, Package, RotateCw, Loader2, Check, Info, Clock, Award, Ruler, Eye, Shirt, Gem } from 'lucide-react'
import * as THREE from 'three'

/**
 * Loader personnalisé
 */
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-brand-gold" size={48} />
        <div className="text-center">
          <p className="text-white font-bold text-lg">{Math.round(progress)}%</p>
          <p className="text-gray-400 text-sm">Chargement du mannequin...</p>
        </div>
      </div>
    </Html>
  )
}

/**
 * Mannequin 3D avec Caftan
 */
function MannequinWithCaftan({ configuration }) {
  const { scene } = useGLTF('/models/mannequin.glb')
  const mannequin = useMemo(() => scene.clone(), [scene])

  const caftanMaterial = useMemo(() => {
    const baseColor = new THREE.Color(configuration.colorHex)
    
    switch (configuration.fabric) {
      case 'Velours':
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: 0.95,
          metalness: 0.05,
          envMapIntensity: 0.4,
        })
      case 'Soie':
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: 0.15,
          metalness: 0.5,
          envMapIntensity: 2.5,
          clearcoat: 0.5,
          clearcoatRoughness: 0.1,
          sheen: 1,
          sheenColor: new THREE.Color(0xffffff),
        })
      case 'Brocart':
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: 0.4,
          metalness: 0.8,
          envMapIntensity: 2.2,
        })
      case 'Organza':
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: 0.1,
          metalness: 0.2,
          transparent: true,
          opacity: 0.85,
          envMapIntensity: 2,
        })
      case 'Dentelle':
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: 0.6,
          metalness: 0.1,
          transparent: true,
          opacity: 0.9,
          envMapIntensity: 1,
        })
      default: // Satin
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: 0.3,
          metalness: 0.5,
          envMapIntensity: 1.8,
          clearcoat: 0.4,
        })
    }
  }, [configuration.fabric, configuration.colorHex])

  // Calcul de la longueur
  const lengthScale = configuration.length === 'Courte (120 cm)' ? 0.7 :
                      configuration.length === 'Standard (150 cm)' ? 1 :
                      configuration.length === 'Longue (160 cm)' ? 1.1 : 1.15
  const broderieCount = configuration.broderies === 'Sans broderie'
    ? 0
    : configuration.broderies === 'Broderie Luxe'
      ? 30
      : 20
  const broderiePositions = useMemo(() => {
    if (broderieCount === 0) {
      return []
    }

    return Array.from({ length: broderieCount }, (_, i) => ([
      0,
      15 - (i * 0.5),
      2.6,
    ]))
  }, [broderieCount])
  const hasPerles = configuration.finitions.includes('Perles')
  const perlePositions = useMemo(() => {
    if (!hasPerles) {
      return []
    }

    return Array.from({ length: 40 }, (_, i) => {
      const angle = (i / 40) * Math.PI * 2
      const radius = 2.3 + Math.random() * 0.3
      const yPos = 12 - (i * 0.3)
      return [
        Math.cos(angle) * radius,
        yPos,
        Math.sin(angle) * radius + 0.3,
      ]
    })
  }, [hasPerles])

  return (
    <group position={[0, -14.7, 0]}>
      <primitive object={mannequin} scale={0.9} rotation={[0, Math.PI, 0]} />
      
      <group position={[0, 0, 0]}>
        {/* Corps du caftan */}
        <mesh position={[0, 9, 0]} castShadow receiveShadow scale={[1, lengthScale, 1]}>
          <cylinderGeometry args={[2.5, configuration.coupe === 'Évasée' ? 4.8 : 4.2, 12, 32]} />
          <primitive object={caftanMaterial} attach="material" />
        </mesh>

        {/* Buste */}
        <mesh position={[0, 14.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2, 2.5, 3, 32]} />
          <primitive object={caftanMaterial} attach="material" />
        </mesh>

        {/* Col selon le style */}
        {configuration.col === 'Col Rond' && (
          <mesh position={[0, 16.2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[1.1, 0.2, 16, 32, Math.PI * 1.8]} />
            <primitive object={caftanMaterial} attach="material" />
          </mesh>
        )}
        {configuration.col === 'Col V' && (
          <mesh position={[0, 16, 0.3]} rotation={[Math.PI / 4, 0, 0]} castShadow>
            <boxGeometry args={[2.2, 0.3, 1]} />
            <primitive object={caftanMaterial} attach="material" />
          </mesh>
        )}
        {configuration.col === 'Col Bateau' && (
          <mesh position={[0, 16.2, 0]} castShadow>
            <boxGeometry args={[3, 0.2, 0.3]} />
            <primitive object={caftanMaterial} attach="material" />
          </mesh>
        )}

        {/* Manches selon le style */}
        {configuration.manches !== 'Sans manches' && (
          <>
            <mesh 
              position={[-2.8, 14.2, 0]} 
              rotation={[0, 0, Math.PI / 5]} 
              castShadow 
              scale={[1, configuration.manches === 'Manches 3/4' ? 0.7 : configuration.manches === 'Manches Courtes' ? 0.5 : 1, 1]}
            >
              <cylinderGeometry args={[0.5, 0.7, 5, 16]} />
              <primitive object={caftanMaterial} attach="material" />
            </mesh>
            <mesh 
              position={[2.8, 14.2, 0]} 
              rotation={[0, 0, -Math.PI / 5]} 
              castShadow
              scale={[1, configuration.manches === 'Manches 3/4' ? 0.7 : configuration.manches === 'Manches Courtes' ? 0.5 : 1, 1]}
            >
              <cylinderGeometry args={[0.5, 0.7, 5, 16]} />
              <primitive object={caftanMaterial} attach="material" />
            </mesh>
          </>
        )}

        {/* Broderies */}
        {broderiePositions.length > 0 && (
          <group>
            {broderiePositions.map((position, i) => (
              <mesh key={`brod-${i}`} position={position} castShadow>
                <sphereGeometry args={[0.08, 12, 12]} />
                <meshStandardMaterial
                  color={configuration.couleurBroderie}
                  metalness={0.95}
                  roughness={0.05}
                  emissive={configuration.couleurBroderie}
                  emissiveIntensity={0.5}
                />
              </mesh>
            ))}
          </group>
        )}

        {/* Perles et sequins */}
        {hasPerles && (
          <group>
            {perlePositions.map((position, i) => (
              <mesh key={`perle-${i}`} position={position} castShadow>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color="#FFFFFF" metalness={0.9} roughness={0.1} />
              </mesh>
            ))}
          </group>
        )}

        {/* Ceinture */}
        {configuration.ceinture !== 'Sans ceinture' && (
          <mesh position={[0, 9, 0]} castShadow>
            <torusGeometry args={[2.6, configuration.ceinture === 'Large' ? 0.2 : 0.12, 16, 64]} />
            <meshStandardMaterial 
              color={configuration.couleurCeinture}
              metalness={0.95}
              roughness={0.1}
              emissive={configuration.couleurCeinture}
              emissiveIntensity={0.25}
            />
          </mesh>
        )}

        {/* Ourlet décoratif */}
        <mesh position={[0, 3 * lengthScale, 0]}>
          <torusGeometry args={[4.5, 0.08, 16, 64]} />
          <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  )
}

function Scene({ configuration }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3.1, 255]} fov={14} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 15, 10]} intensity={3} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <spotLight position={[-8, 12, 8]} angle={0.5} penumbra={1} intensity={2} castShadow />
      <pointLight position={[0, 5, -5]} intensity={1} color="#ffd700" />

      <Suspense fallback={<Loader />}>
        <PresentationControls
          global
          config={{ mass: 2, tension: 300 }}
          snap={{ mass: 4, tension: 1200 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 6, Math.PI / 6]}
          azimuth={[-Math.PI / 1.8, Math.PI / 1.8]}
        >
          <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
            <MannequinWithCaftan configuration={configuration} />
          </Float>
        </PresentationControls>
        <ContactShadows position={[0, -14.7, 0]} opacity={0.4} scale={8} blur={3} far={6} />
        <Environment preset="sunset" />
      </Suspense>
    </>
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

  const categories = [
    { id: 'style', name: 'Style', icon: <Package size={18} />, color: 'from-brand-forest to-brand-night' },
    { id: 'tissu', name: 'Tissu', icon: <Scissors size={18} />, color: 'from-brand-clay to-brand-gold' },
    { id: 'couleur', name: 'Couleur', icon: <Palette size={18} />, color: 'from-brand-gold to-brand-sand' },
    { id: 'forme', name: 'Forme', icon: <Shirt size={18} />, color: 'from-brand-forestLight to-brand-night' },
    { id: 'details', name: 'Détails', icon: <Sparkles size={18} />, color: 'from-brand-clay to-brand-forest' },
    { id: 'finitions', name: 'Finitions', icon: <Gem size={18} />, color: 'from-brand-forest to-brand-gold' },
  ]

  const options = {
    style: {
      type: [
        { name: 'Caftan', image: 'CF', desc: 'Traditionnel élégant' },
        { name: 'Karakou', image: 'KR', desc: 'Style moderne' },
        { name: 'Takchita', image: 'TK', desc: 'Deux pièces luxe' },
      ]
    },
    tissu: {
      fabric: [
        { name: 'Satin', description: 'Élégant et fluide', icon: 'SA', price: 0 },
        { name: 'Velours', description: 'Noble et luxueux', icon: 'VE', price: 30 },
        { name: 'Soie', description: 'Premium et délicat', icon: 'SO', price: 80 },
        { name: 'Brocart', description: 'Tissage royal', icon: 'BR', price: 100 },
        { name: 'Organza', description: 'Transparent et léger', icon: 'OR', price: 60 },
        { name: 'Dentelle', description: 'Romantique et raffiné', icon: 'DE', price: 70 },
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
        ...(hex && { colorHex: hex })
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

  return (
    <section id="custom" className="min-h-screen bg-gradient-to-b from-brand-ivory via-brand-mist to-brand-ivory pt-36 pb-16">
      <div className="container mx-auto px-4">
        
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto mb-8 bg-gradient-to-r from-brand-ivory via-brand-goldSoft/30 to-brand-ivory border-2 border-brand-gold/30 rounded-3xl p-6 shadow-xl"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Configurateur 3D professionnel</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Créez votre caftan unique avec notre système de personnalisation avancé. Plus de <strong>100 combinaisons</strong> possibles.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full">
                  <Clock size={14} className="text-brand-forest" />
                  <span className="text-gray-700">4-6 semaines</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full">
                  <Award size={14} className="text-brand-forest" />
                  <span className="text-gray-700">100% sur-mesure</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full">
                  <Sparkles size={14} className="text-brand-forest" />
                  <span className="text-gray-700">Acompte 50%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">Atelier sur-mesure</h2>
          <p className="text-gray-600 text-lg">Plus de 6 catégories de personnalisation - Rendu 3D temps réel</p>
        </motion.div>

        {/* Navigation par catégories */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCurrentCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all ${
                  currentCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                    : 'bg-white/80 text-brand-ink border-2 border-brand-gold/20 hover:border-brand-gold/50'
                }`}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid xl:grid-cols-[380px_1fr_340px] gap-8 items-start max-w-[1700px] mx-auto">
          
          {/* COLONNE GAUCHE : Options */}
          <div className="space-y-6 max-h-[900px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
            <AnimatePresence mode="wait">
              {Object.keys(options[currentCategory]).map((optKey) => {
                const opts = options[currentCategory][optKey]
                return (
                  <motion.div
                    key={optKey}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="rounded-3xl bg-white p-6 shadow-xl border border-brand-gold/20"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 capitalize">{optKey}</h3>
                    <div className={`grid gap-3 ${optKey === 'color' || optKey === 'couleurBroderie' || optKey === 'couleurCeinture' ? 'grid-cols-4' : optKey === 'type' ? 'grid-cols-3' : 'grid-cols-1'}`}>
                      {opts.map((opt) => (
                        <button
                          key={opt.name}
                          onClick={() => handleOptionSelect(optKey, opt.name, opt.hex)}
                          className={`p-3 rounded-2xl border-2 transition-all ${
                            (Array.isArray(configuration[optKey]) ? configuration[optKey].includes(opt.name) : configuration[optKey] === opt.name)
                              ? 'border-brand-gold bg-gradient-to-br from-brand-goldSoft/30 to-brand-sand/30 shadow-lg'
                              : 'border-gray-200 bg-gray-50 hover:border-brand-gold/60'
                          }`}
                        >
                          {opt.hex ? (
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-10 h-10 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: opt.hex }} />
                              <span className="text-[9px] font-semibold text-gray-700">{opt.name}</span>
                            </div>
                          ) : opt.image ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-xl font-bold tracking-[0.3em] text-brand-forest">{opt.image}</span>
                              <span className="text-xs font-bold text-gray-900">{opt.name}</span>
                              <span className="text-[10px] text-gray-500">{opt.desc}</span>
                            </div>
                          ) : (
                            <div className="flex items-start gap-3 text-left">
                              {opt.icon && (
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-ivory text-brand-forest text-[10px] font-bold tracking-[0.2em] border border-brand-gold/30">
                                  {opt.icon}
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-bold text-gray-900">{opt.name}</span>
                                  {opt.price !== undefined && opt.price !== 0 && (
                                    <span className={`text-xs font-bold ${opt.price > 0 ? 'text-brand-forest' : 'text-brand-clay'}`}>
                                      {opt.price > 0 ? '+' : ''}{opt.price}€
                                    </span>
                                  )}
                                </div>
                                {opt.desc && <div className="text-xs text-gray-500">{opt.desc}</div>}
                                {opt.description && <div className="text-xs text-gray-500">{opt.description}</div>}
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* COLONNE CENTRALE : 3D */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-[900px] rounded-[32px] bg-gradient-to-b from-brand-night via-[#15161b] to-[#0d0f14] border border-white/10 shadow-[0_50px_150px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />
            <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }}>
              <Scene configuration={configuration} />
            </Canvas>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/40 backdrop-blur-xl px-5 py-3 rounded-full border border-white/20">
              <RotateCw size={16} className="text-brand-gold" />
              <span className="text-white/90 text-sm font-medium">Vue 360° interactive</span>
            </div>
            <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
              <span className="text-white/90 text-xs font-semibold">Rendu HD</span>
            </div>
          </motion.div>

          {/* COLONNE DROITE : Résumé */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-gradient-to-br from-brand-night to-[#171a20] p-6 shadow-2xl border border-white/10"
            >
              <div className="text-sm text-gray-400 mb-4">Votre configuration</div>
              <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Style</div>
                  <div className="text-white font-bold">{configuration.type}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Tissu</div>
                  <div className="text-white font-bold">{configuration.fabric}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Couleur</div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border-2 border-white/20" style={{ backgroundColor: configuration.colorHex }} />
                    <div className="text-white font-bold text-sm">{configuration.color}</div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Col</div>
                  <div className="text-white font-bold text-sm">{configuration.col}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Manches</div>
                  <div className="text-white font-bold text-sm">{configuration.manches}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Longueur</div>
                  <div className="text-white font-bold text-sm">{configuration.length}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Broderies</div>
                  <div className="text-white font-bold text-sm">{configuration.broderies}</div>
                </div>
                {configuration.finitions.length > 0 && (
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">Finitions</div>
                    <div className="text-white font-bold text-sm">{configuration.finitions.join(', ')}</div>
                  </div>
                )}
              </div>
              
              <div className="mb-6 pt-6 border-t border-white/10">
                <div className="text-xs text-gray-500 mb-2">Prix estimé</div>
                <motion.div 
                  key={calculatePrice()}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-sand"
                >
                  {calculatePrice()}€
                </motion.div>
              </div>

              
              <a
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-forest via-brand-forestLight to-brand-night text-white font-bold py-4 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                <span>Commander maintenant</span>
                <ArrowRight size={20} />
              </a>

              <p className="text-xs text-gray-500 text-center mt-4">
                Délai 4-6 semaines - Acompte 50% requis
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

useGLTF.preload('/models/mannequin.glb')

export default Custom3D
