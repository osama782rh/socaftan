import { Check, Sparkles, ShoppingBag, Palette, ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

const easePremium = [0.22, 1, 0.36, 1]

const cardsContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
}

const cardReveal = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: easePremium,
    },
  },
}

const Pricing = () => {
  const prefersReducedMotion = useReducedMotion()

  const plans = [
    {
      name: 'Location',
      icon: <Sparkles size={24} />,
      price: '90 - 100',
      unit: '€',
      period: 'Takchita/Karakou • 3-5 jours',
      features: [
        'Takchitas: 90€',
        'Karakous: 100€',
        'Caution location: 100€',
        'Nettoyage inclus',
        'Retrait pratique en Ile-de-France',
        'Conseil personnalisé',
      ],
      highlighted: false,
      buttonText: 'Voir la collection',
      link: '#collection',
    },
    {
      name: 'Achat',
      icon: <ShoppingBag size={24} />,
      price: '150',
      unit: '€',
      period: 'Caftans uniquement',
      features: [
        'Prix fixe sur la collection caftans',
        'Vente definitive de la piece',
        'Nettoyage offert 1ère fois',
        'Garantie qualité',
        'Support après-vente',
      ],
      highlighted: true,
      buttonText: 'Acheter un caftan',
      link: '#collection',
    },
    {
      name: 'Sur-Mesure',
      icon: <Palette size={24} />,
      price: '220',
      unit: '€',
      period: 'à partir de',
      features: [
        'Design 100% personnalisé',
        'Choix du tissu & couleurs',
        'Broderies sur-mesure',
        'Ajusté à vos mensurations',
        'Délai 4-6 semaines',
        'Pièce unique garantie',
      ],
      highlighted: false,
      buttonText: 'Créer mon caftan',
      link: '/sur-mesure#custom',
    },
  ]

  return (
    <section id="pricing" className="section-padding bg-brand-ivory relative">
      <div className="container-custom">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="section-label justify-center">Nos tarifs</p>
          <h2 className="section-title text-center">
            Choisissez <span className="italic font-light">votre formule</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Takchitas et karakous en location, caftans en vente, ou creation sur-mesure.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={cardsContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-14"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={cardReveal}
              whileHover={prefersReducedMotion ? undefined : { y: -8 }}
              className={`relative rounded-2xl p-7 md:p-8 transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-brand-ink text-white shadow-xl md:-mt-4 md:mb-[-16px] md:py-10'
                  : 'bg-white border border-brand-sand/60 hover:shadow-md'
              }`}
            >
              {plan.highlighted && !prefersReducedMotion && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 top-10 h-24 w-24 rounded-full bg-brand-gold/30 blur-2xl"
                  animate={{ x: [0, -6, 0], y: [0, 8, 0], opacity: [0.35, 0.55, 0.35] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-ink text-[10px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-full">
                  Populaire
                </div>
              )}

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                plan.highlighted ? 'bg-white/10 text-brand-gold' : 'bg-brand-sand text-brand-ink'
              }`}>
                {plan.icon}
              </div>

              {/* Name */}
              <h3 className={`text-xl font-bold font-serif mb-1 ${
                plan.highlighted ? 'text-white' : 'text-brand-ink'
              }`}>
                {plan.name}
              </h3>
              <p className={`text-xs mb-5 ${plan.highlighted ? 'text-white/40' : 'text-brand-ink/40'}`}>
                {plan.period}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className={`text-4xl font-bold font-serif ${
                  plan.highlighted ? 'text-white' : 'text-brand-ink'
                }`}>
                  {plan.price}
                </span>
                <span className={`text-lg ${plan.highlighted ? 'text-white/60' : 'text-brand-ink/40'}`}>
                  {plan.unit}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      className={`flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? 'text-brand-gold' : 'text-brand-gold'
                      }`}
                    />
                    <span className={`text-sm ${
                      plan.highlighted ? 'text-white/70' : 'text-brand-ink/60'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <a
                href={plan.link}
                className={`group flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-brand-gold text-brand-ink hover:bg-brand-goldSoft'
                    : 'bg-brand-ink text-white hover:bg-brand-ink/90'
                }`}
              >
                {plan.buttonText}
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-brand-sand/60">
            <h4 className="text-lg font-bold text-brand-ink font-serif mb-4 text-center">
              Informations pratiques
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: 'Location', info: 'Caution de 100€ (rendue apres verification de l etat)' },
                { label: 'Achat', info: 'Caftans uniquement: 150€' },
                { label: 'Sur-Mesure', info: 'Acompte de 50% à la commande' },
                { label: 'Paiement', info: 'Paiement securise via Stripe' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.45, ease: easePremium }}
                  className="flex items-start gap-2.5 py-2"
                >
                  <Check size={14} className="text-brand-gold flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-brand-ink/60">
                    <span className="font-semibold text-brand-ink">{item.label} :</span> {item.info}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing
