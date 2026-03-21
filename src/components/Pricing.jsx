import { Check, Sparkles, ShoppingBag, Palette, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const Pricing = () => {
  const plans = [
    {
      name: 'Location',
      icon: <Sparkles size={24} />,
      price: '60',
      unit: '€',
      period: '3-5 jours',
      features: [
        'Caftans & Karakous disponibles',
        'Nettoyage inclus',
        'Retrait pratique',
        'Échange possible sous 48h',
        'Conseil personnalisé',
      ],
      highlighted: false,
      buttonText: 'Voir la collection',
      link: '#collection',
    },
    {
      name: 'Achat',
      icon: <ShoppingBag size={24} />,
      price: '180',
      unit: '€',
      period: 'à partir de',
      features: [
        'Large choix de modèles',
        'Prix variables selon qualité',
        'Caftans de 180€ à 450€+',
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
            Location ponctuelle, achat ou création sur-mesure : trouvez l'option qui vous correspond.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-14">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-7 md:p-8 transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-brand-ink text-white shadow-xl md:-mt-4 md:mb-[-16px] md:py-10'
                  : 'bg-white border border-brand-sand/60 hover:shadow-md'
              }`}
            >
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
        </div>

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
                { label: 'Location', info: 'Caution de 100€ remboursable' },
                { label: 'Achat', info: 'Prix variables selon le modèle' },
                { label: 'Sur-Mesure', info: 'Acompte de 50% à la commande' },
                { label: 'Paiement', info: 'Espèces, CB ou virement' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2">
                  <Check size={14} className="text-brand-gold flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-brand-ink/60">
                    <span className="font-semibold text-brand-ink">{item.label} :</span> {item.info}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing
