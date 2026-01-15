import { Check, Sparkles, ShoppingBag, Palette } from 'lucide-react'
import { motion } from 'framer-motion'

const Pricing = () => {
  const plans = [
    {
      name: 'Location',
      icon: <Sparkles size={32} />,
      price: 'dès 60€',
      subtitle: 'Pour 3-5 jours',
      features: [
        'Caftans & Karakous disponibles',
        'Nettoyage inclus',
        'Retrait pratique',
        'Échange possible sous 48h',
        'Conseil disponible',
      ],
      highlighted: false,
      gradient: 'from-purple-500 to-indigo-500',
      buttonText: 'Voir la Collection',
      link: '#collection',
    },
    {
      name: 'Achat',
      icon: <ShoppingBag size={32} />,
      price: 'dès 180€',
      subtitle: 'Le caftan est à vous',
      features: [
        'Large choix de modèles',
        'Prix variables selon qualité',
        'Caftans de 180€ à 450€+',
        'Nettoyage offert 1ère fois',
        'Garantie qualité',
        'Support après-vente',
      ],
      highlighted: true,
      gradient: 'from-rose-500 to-pink-500',
      buttonText: 'Acheter un Caftan',
      link: '#collection',
    },
    {
      name: 'Sur-Mesure',
      icon: <Palette size={32} />,
      price: 'dès 220€',
      subtitle: 'Création personnalisée',
      features: [
        'Design 100% personnalisé',
        'Choix du tissu & couleurs',
        'Broderies sur-mesure',
        'Ajusté à vos mensurations',
        'Délai 4-6 semaines',
        'Pièce unique garantie',
      ],
      highlighted: false,
      gradient: 'from-amber-500 to-yellow-500',
      buttonText: 'Créer mon Caftan',
      link: '#custom',
    },
  ]

  return (
    <section id="pricing" className="section-padding bg-gradient-to-b from-white via-rose-50/20 to-white relative overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-rose-100 to-pink-100 px-6 py-3 rounded-full mb-6"
          >
            <Sparkles className="text-rose-600" size={20} />
            <span className="text-rose-600 font-semibold">Nos Offres</span>
          </motion.div>
          
          <h2 className="section-title mb-6">
            Choisissez Votre Formule
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Location ponctuelle, achat ou création sur-mesure : trouvez l'option qui vous correspond
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${plan.gradient} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`} />
              
              <div className={`relative h-full rounded-3xl p-8 transition-all duration-500 border-2 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-white to-rose-50/50 border-rose-300 shadow-2xl scale-105'
                  : 'bg-white border-gray-200 shadow-lg hover:shadow-2xl'
              }`}>
                
                {/* Badge for highlighted plan */}
                {plan.highlighted && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', delay: 0.3 }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg"
                  >
                    ⭐ Populaire
                  </motion.div>
                )}

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center text-white mb-6 shadow-lg`}
                >
                  {plan.icon}
                </motion.div>

                {/* Plan Name */}
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {plan.subtitle}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600">
                    {plan.price}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <Check
                        className="flex-shrink-0 mt-0.5 text-green-500"
                        size={20}
                      />
                      <span className="text-gray-700">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.a
                  href={plan.link}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`block text-center py-4 px-6 rounded-2xl font-bold transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-xl hover:shadow-2xl'
                      : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {plan.buttonText}
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-gray-50 to-rose-50/50 rounded-2xl p-8 max-w-4xl mx-auto border border-gray-200">
            <h4 className="text-2xl font-bold text-gray-900 mb-4">
              Informations Importantes
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <p className="text-gray-700">
                  <span className="font-semibold">Location :</span> Caution de 100€ remboursable
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <p className="text-gray-700">
                  <span className="font-semibold">Achat :</span> Prix variables selon le modèle et les finitions
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <p className="text-gray-700">
                  <span className="font-semibold">Sur-Mesure :</span> Acompte de 50% à la commande
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <p className="text-gray-700">
                  <span className="font-semibold">Paiement :</span> Espèces, CB ou virement acceptés
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Final */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-6 text-lg">
            Une question sur nos tarifs ? Besoin d'un devis personnalisé ?
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Contactez-nous
          </motion.a>
        </motion.div>

      </div>
    </section>
  )
}

export default Pricing