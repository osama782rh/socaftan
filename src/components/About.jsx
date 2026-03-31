import { Heart, Award, Clock } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import jawharaImage from '../assets/JAWHARA.jpeg'
import emeraudeImage from '../assets/EMERAUDE.png'

const easePremium = [0.22, 1, 0.36, 1]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: easePremium,
    },
  },
}

const About = () => {
  const prefersReducedMotion = useReducedMotion()

  const features = [
    {
      icon: <Heart size={22} />,
      title: 'Passion & excellence',
      description: 'Chaque pièce est sélectionnée avec soin pour sublimer votre élégance.',
    },
    {
      icon: <Award size={22} />,
      title: 'Qualité garantie',
      description: 'Tissus nobles, broderies artisanales et finitions impeccables.',
    },
    {
      icon: <Clock size={22} />,
      title: 'Service express',
      description: 'Réservation en 2 minutes, livraison garantie 48h avant votre événement.',
    },
  ]

  return (
    <section id="about" className="section-padding bg-brand-ivory relative overflow-hidden">
      {!prefersReducedMotion && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-16 h-72 w-72 rounded-full bg-brand-gold/20 blur-3xl"
            animate={{ x: [0, -10, 0], y: [0, 14, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-24 h-80 w-80 rounded-full bg-brand-forest/10 blur-3xl"
            animate={{ x: [0, 14, 0], y: [0, -10, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      <div className="container-custom">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="grid grid-cols-12 gap-4">
              {/* Main image */}
              <div className="col-span-8 aspect-[3/4] rounded-2xl overflow-hidden">
                <motion.img
                  src={jawharaImage}
                  alt="Caftan Jawhara"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                  transition={{ duration: 0.7, ease: easePremium }}
                />
              </div>
              {/* Secondary image */}
              <div className="col-span-4 mt-12 aspect-[3/4] rounded-2xl overflow-hidden">
                <motion.img
                  src={emeraudeImage}
                  alt="Caftan Émeraude"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                  transition={{ duration: 0.7, ease: easePremium }}
                />
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.55, ease: easePremium }}
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              className="absolute -bottom-4 left-8 md:left-12 bg-white rounded-2xl px-6 py-4 shadow-lg border border-brand-sand"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-ink font-serif">90€</div>
                <div className="text-[11px] text-brand-ink/50 font-semibold tracking-wide uppercase">location des takchitas</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.22 }}
            >
              <motion.p variants={itemVariants} className="section-label">Pourquoi nous choisir</motion.p>
              <motion.h2 variants={itemVariants} className="section-title mb-5">
                L'excellence au service
                <br />
                <span className="italic font-light">de votre élégance</span>
              </motion.h2>
              <motion.p variants={itemVariants} className="section-subtitle mb-10">
                Une expérience soignée pour la location et la vente de pièces d'exception.
              </motion.p>

              <div className="space-y-5">
                {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? undefined : { x: 5 }}
                  transition={{ duration: 0.5, ease: easePremium }}
                  className="flex items-start gap-4 p-5 rounded-xl hover:bg-brand-sand/30 transition-colors duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-sand flex items-center justify-center text-brand-ink flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-ink font-serif mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-brand-ink/55 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
