import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import heroPoster from '../assets/JAWHARA.jpeg'

const easePremium = [0.22, 1, 0.36, 1]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easePremium,
    },
  },
}

const Hero = () => {
  const heroRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const contentY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -70])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, prefersReducedMotion ? 1 : 1.12])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, prefersReducedMotion ? 1 : 0.86])

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Video Background */}
      <motion.div
        className="absolute inset-0"
        style={prefersReducedMotion ? undefined : { scale: videoScale }}
      >
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

        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-brand-night/75 via-brand-night/45 to-brand-night/85"
          style={prefersReducedMotion ? undefined : { opacity: overlayOpacity }}
        />
      </motion.div>

      {!prefersReducedMotion && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-brand-gold/30 blur-3xl"
            animate={{ x: [0, 18, 0], y: [0, 22, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 bottom-16 h-80 w-80 rounded-full bg-brand-forest/20 blur-3xl"
            animate={{ x: [0, -20, 0], y: [0, -18, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-5 max-w-5xl mx-auto"
        style={prefersReducedMotion ? undefined : { y: contentY }}
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Label */}
          <motion.p
            variants={itemVariants}
            className="text-brand-gold text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-6"
          >
            Location de Takchitas & Karakous • Vente de Caftans
          </motion.p>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-display font-bold text-white mb-6 md:mb-8"
          >
            Sublimez vos
            <br />
            <span className="italic font-light text-brand-goldSoft">plus beaux moments</span>
          </motion.h1>

          <motion.div variants={itemVariants} className="mb-7">
            <div className="mx-auto h-px w-40 bg-white/25 overflow-hidden rounded-full">
              {!prefersReducedMotion && (
                <motion.span
                  className="block h-full w-1/2 bg-gradient-to-r from-transparent via-brand-gold to-transparent"
                  animate={{ x: ['-60%', '220%'] }}
                  transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
                />
              )}
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-white/70 text-base md:text-xl max-w-2xl mx-auto mb-10 md:mb-14 font-light leading-relaxed"
          >
            Takchitas et karakous en location, caftans en vente,
            et créations sur-mesure pour vos événements.
          </motion.p>

          {/* Price badge */}
          <motion.div variants={itemVariants} className="mb-10 md:mb-14">
            <motion.div
              whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.01 }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 px-6 md:px-8 py-3 md:py-4 rounded-full shadow-[0_10px_45px_rgba(0,0,0,0.2)]"
            >
              <span className="text-white text-2xl md:text-3xl font-bold">90€ - 100€</span>
              <span className="text-white/70 text-xs md:text-sm">la location</span>
              <span className="bg-brand-gold/20 text-brand-gold text-[10px] md:text-xs font-semibold px-3 py-1 rounded-full">
                Takchita & Karakou
              </span>
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              href="#collection"
              whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              className="group flex items-center gap-2 bg-white text-brand-ink px-8 py-4 rounded-full font-semibold text-sm hover:bg-brand-gold hover:text-white transition-all duration-300 shadow-[0_12px_35px_rgba(0,0,0,0.2)]"
            >
              Découvrir la collection
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <motion.a
              href="#contact"
              whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              className="flex items-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
            >
              Réserver maintenant
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.25, duration: 0.65 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <a href="#about" className="flex flex-col items-center gap-2 text-white/40 hover:text-white/60 transition-colors">
          <span className="text-[10px] tracking-[0.2em] uppercase">Explorer</span>
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
            transition={prefersReducedMotion ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
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
