import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import heroPoster from '../assets/CAFTAN_JAWHARA_ROSE.jpg'

const Hero = () => {
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
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
        <div className="absolute inset-0 bg-gradient-to-b from-brand-night/70 via-brand-night/50 to-brand-night/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-5 max-w-5xl mx-auto">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-brand-gold text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-6"
        >
          Location & Vente de Caftans d'Exception
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-display font-bold text-white mb-6 md:mb-8"
        >
          Sublimez vos
          <br />
          <span className="italic font-light text-brand-goldSoft">plus beaux moments</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/70 text-base md:text-xl max-w-2xl mx-auto mb-10 md:mb-14 font-light leading-relaxed"
        >
          Des caftans et karakous soigneusement sélectionnés,
          disponibles en location, à l'achat ou sur-mesure.
        </motion.p>

        {/* Price badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 px-6 md:px-8 py-3 md:py-4 rounded-full">
            <span className="text-white/50 text-sm line-through">100€</span>
            <span className="text-white text-2xl md:text-3xl font-bold">60€</span>
            <span className="text-white/70 text-xs md:text-sm">la location</span>
            <span className="bg-brand-gold/20 text-brand-gold text-[10px] md:text-xs font-semibold px-3 py-1 rounded-full">
              Offre de lancement
            </span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#collection"
            className="group flex items-center gap-2 bg-white text-brand-ink px-8 py-4 rounded-full font-semibold text-sm hover:bg-brand-gold hover:text-white transition-all duration-300"
          >
            Découvrir la collection
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#contact"
            className="flex items-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
          >
            Réserver maintenant
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <a href="#about" className="flex flex-col items-center gap-2 text-white/40 hover:text-white/60 transition-colors">
          <span className="text-[10px] tracking-[0.2em] uppercase">Explorer</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 border border-white/30 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 bg-white/60 rounded-full" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  )
}

export default Hero
