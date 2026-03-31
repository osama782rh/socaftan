import { Sparkles, MapPin, MessageCircle, RefreshCw, Shield, Clock, Award } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

const easePremium = [0.22, 1, 0.36, 1]

const gridContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
}

const revealItem = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easePremium,
    },
  },
}

const Services = () => {
  const prefersReducedMotion = useReducedMotion()

  const services = [
    {
      icon: <Sparkles size={24} />,
      title: 'Nettoyage inclus',
      description: 'Chaque piece louee est nettoyee et repassee avant mise a disposition.',
    },
    {
      icon: <MapPin size={24} />,
      title: 'Retrait pratique',
      description: 'Point de retrait convenu ensemble lors de la réservation.',
    },
    {
      icon: <MessageCircle size={24} />,
      title: 'Conseils personnalisés',
      description: 'On vous aide à choisir le caftan qui vous correspond le mieux.',
    },
    {
      icon: <RefreshCw size={24} />,
      title: 'Échange possible',
      description: 'Changez de modèle jusqu\'à 48h avant votre événement.',
    },
  ]

  const stats = [
    { icon: <Shield size={20} />, value: '100%', label: 'Qualité vérifiée' },
    { icon: <Clock size={20} />, value: '24h', label: 'Réponse rapide' },
    { icon: <Award size={20} />, value: '90€', label: 'Location Takchita' },
  ]

  return (
    <section id="services" className="section-padding bg-white relative">
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-gold/12 blur-3xl"
          animate={{ y: [0, 10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="container-custom">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="section-label justify-center">Nos services</p>
          <h2 className="section-title text-center">
            Simple et <span className="italic font-light">sans prise de tête</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            On s'occupe de l'essentiel pour que vous profitiez pleinement de votre événement.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={revealItem}
              whileHover={prefersReducedMotion ? undefined : { y: -6 }}
              className="group p-6 md:p-7 rounded-2xl border border-brand-sand/60 hover:border-brand-gold/30 hover:shadow-md transition-all duration-400 bg-brand-ivory/50"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-sand flex items-center justify-center text-brand-ink mb-5 group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-brand-ink font-serif mb-2">
                {service.title}
              </h3>
              <p className="text-brand-ink/50 text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.6, ease: easePremium }}
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              className="text-center py-6 px-4 rounded-2xl bg-brand-ivory"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-sand text-brand-ink mb-3">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-brand-ink font-serif">{stat.value}</div>
              <div className="text-brand-ink/40 text-xs font-medium mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-brand-ink rounded-2xl md:rounded-3xl p-8 md:p-14 text-center relative overflow-hidden"
        >
          {!prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              className="absolute -left-20 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-brand-gold/25 blur-3xl"
              animate={{ x: [0, 35, 0], opacity: [0.25, 0.42, 0.25] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          <h3 className="text-2xl md:text-3xl font-bold text-white font-serif mb-3">
            Une question ? Besoin d'aide ?
          </h3>
          <p className="text-white/50 mb-8 max-w-lg mx-auto text-sm md:text-base">
            Contactez-nous pour réserver ou obtenir plus d'informations.
            On vous répond rapidement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#contact"
              className="px-8 py-3.5 bg-brand-gold text-brand-ink rounded-full font-semibold text-sm hover:bg-brand-goldSoft transition-colors"
            >
              Nous contacter
            </a>
            <a
              href="tel:+33184180326"
              className="px-8 py-3.5 border border-white/20 text-white rounded-full font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Appeler maintenant
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services

