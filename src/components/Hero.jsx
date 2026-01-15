import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, Star, ArrowRight, Award } from 'lucide-react'
import heroPoster from '../assets/CAFTAN_JAWHARA_ROSE.jpg'

const Hero = () => {
  const shouldReduceMotion = useReducedMotion()
  const [viewport, setViewport] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  const particles = useMemo(() => {
    if (shouldReduceMotion || viewport.width === 0 || viewport.height === 0) {
      return []
    }

    const count = 24
    return Array.from({ length: count }, (_, i) => {
      const size = Math.random() * 4 + 1
      const startX = Math.random() * viewport.width
      const endX = Math.random() * viewport.width
      const duration = Math.random() * 10 + 10
      const delay = Math.random() * 5
      const color = i % 3 === 0
        ? 'rgba(251, 191, 36, 0.8)'
        : i % 3 === 1
          ? 'rgba(236, 72, 153, 0.6)'
          : 'rgba(168, 85, 247, 0.6)'

      return {
        size,
        startX,
        endX,
        startY: viewport.height + 100,
        duration,
        delay,
        color,
      }
    })
  }, [shouldReduceMotion, viewport.height, viewport.width])

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={heroPoster}
          className="w-full h-full object-cover"
        >
          <source src="https://cdn.coverr.co/videos/coverr-elegant-fashion-model-9193/1080p.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient Overlay Multiple Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-rose-950/60 to-purple-950/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40"></div>
      </div>

      {/* Animated Particles - Plus élégants */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              background: `radial-gradient(circle, ${particle.color}, transparent)`,
            }}
            initial={{
              x: particle.startX,
              y: particle.startY,
              opacity: 0,
            }}
            animate={{
              y: -100,
              opacity: [0, 1, 0.8, 0],
              x: particle.endX,
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Floating Elements Decoration */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        
        {/* Badge Premium - Ajusté pour mobile */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 md:mb-8 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 px-4 md:px-6 py-2 md:py-3 rounded-full"
        >
          <Award className="text-yellow-400 flex-shrink-0" size={18} />
          <span className="text-white font-medium text-xs md:text-base">Service Premium de Location de Caftans</span>
          <Star className="text-yellow-400 flex-shrink-0" size={14} fill="currentColor" />
        </motion.div>

        {/* Main Title - Ultra Impact */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-6 md:mb-8 leading-none"
        >
          <motion.span
            className="block text-white mb-2 md:mb-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Louez Votre
          </motion.span>
          <motion.span
            className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              textShadow: '0 0 80px rgba(236, 72, 153, 0.5)',
            }}
          >
            Caftan de Rêve
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base md:text-2xl lg:text-3xl text-white/90 mb-4 font-light tracking-wide max-w-4xl mx-auto px-4"
        >
          Collection exclusive • Qualité exceptionnelle • Service sur-mesure
        </motion.p>

        {/* Price Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-8 md:mb-12 inline-block"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 blur-xl opacity-75"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-gray-900 px-6 md:px-10 py-3 md:py-5 rounded-2xl font-bold text-xl md:text-3xl shadow-2xl border-2 border-yellow-300">
              <span className="line-through text-gray-800 text-base md:text-lg mr-2 md:mr-3 opacity-75">100€</span>
              <span className="text-3xl md:text-4xl">60€</span>
              <span className="block md:inline ml-0 md:ml-3 text-sm md:text-lg font-medium mt-1 md:mt-0">Offre de Lancement</span>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4"
        >
          <motion.a
            href="#collection"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="group relative w-full sm:w-auto"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg shadow-2xl overflow-hidden">
              <span className="relative z-10 flex items-center justify-center space-x-2 md:space-x-3">
                <span>Découvrir la Collection</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.a>

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="group relative w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg overflow-hidden border-2 border-white/40 backdrop-blur-xl bg-white/5 text-white hover:bg-white hover:text-gray-900 transition-all duration-500 shadow-2xl"
          >
            <span className="flex items-center justify-center space-x-2 md:space-x-3">
              <span>Réserver Maintenant</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </motion.a>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12 md:mt-16 flex flex-wrap justify-center items-center gap-4 md:gap-8 text-white/70 text-xs md:text-sm"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Star className="text-yellow-400" size={16} fill="currentColor" />
            </div>
            <span className="font-medium">Service 5 étoiles</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-white/20"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Award className="text-yellow-400" size={16} />
            </div>
            <span className="font-medium">Qualité Premium</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-white/20"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <span className="text-yellow-400 font-bold text-base md:text-lg">✓</span>
            </div>
            <span className="font-medium">Livraison Gratuite</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Plus moderne */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer group"
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-white/60 text-xs md:text-sm font-medium tracking-wider">DÉCOUVRIR</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-white rounded-full"
            />
          </motion.div>
        </div>
      </motion.a>
    </section>
  )
}

export default Hero
