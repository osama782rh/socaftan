import { Sparkles, MapPin, MessageCircle, RefreshCw, Shield, Clock, Award, Gift } from 'lucide-react'
import { motion } from 'framer-motion'

const Services = () => {
  const services = [
    {
      icon: <Sparkles size={40} />,
      title: 'Nettoyage inclus',
      description: 'Chaque caftan est nettoyé et repassé avant et après location pour garantir la qualité.',
      gradient: 'from-brand-forest to-brand-forestLight',
      color: 'forest',
    },
    {
      icon: <MapPin size={40} />,
      title: 'Retrait pratique',
      description: 'Point de retrait convenu ensemble lors de la réservation pour votre confort.',
      gradient: 'from-brand-clay to-brand-gold',
      color: 'clay',
    },
    {
      icon: <MessageCircle size={40} />,
      title: 'Conseils disponibles',
      description: 'On vous aide à choisir le caftan qui vous correspond le mieux selon vos préférences.',
      gradient: 'from-brand-gold to-brand-sand',
      color: 'gold',
    },
    {
      icon: <RefreshCw size={40} />,
      title: 'Échange possible',
      description: 'Possibilité d\'échanger de modèle jusqu\'à 48 h avant votre événement.',
      gradient: 'from-brand-forest to-brand-night',
      color: 'night',
    },
  ]

  const guarantees = [
    {
      icon: <Shield size={32} />,
      title: 'Qualité Vérifiée',
      value: '100%',
    },
    {
      icon: <Clock size={32} />,
      title: 'Réponse Rapide',
      value: '24 h',
    },
    {
      icon: <Award size={32} />,
      title: 'Prix Unique',
      value: '60€',
    },
  ]

  return (
    <section id="services" className="section-padding bg-gradient-to-b from-brand-ivory via-brand-mist to-brand-ivory relative overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-gold/20 to-brand-sand/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-forest/15 to-brand-night/15 rounded-full blur-3xl" />

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
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-brand-goldSoft/50 to-brand-sand/50 px-6 py-3 rounded-full mb-6"
          >
            <Gift className="text-brand-forest" size={20} />
            <span className="text-brand-forest font-semibold">Nos services</span>
          </motion.div>
          
          <h2 className="section-title mb-6">
            Simple et sans prise de tête
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            On s'occupe de l'essentiel pour que vous profitiez pleinement de votre événement.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${service.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
              
              <div className="relative h-full bg-white rounded-3xl p-8 shadow-xl group-hover:shadow-2xl transition-all duration-500 border border-gray-100">
                
                {/* Icon Container */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  {service.icon}
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-forest group-hover:to-brand-gold transition-all duration-300">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>

                {/* Decorative Corner */}
                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Guarantees Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {guarantees.map((guarantee, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative bg-gradient-to-br from-white to-brand-goldSoft/20 rounded-2xl p-8 shadow-lg text-center overflow-hidden group"
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 to-brand-forest/10"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.5, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              <div className="relative">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-brand-forest to-brand-night rounded-2xl mb-4 text-white"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {guarantee.icon}
                </motion.div>
                
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-forest to-brand-gold mb-2">
                  {guarantee.value}
                </div>
                
                <div className="text-gray-700 font-semibold">
                  {guarantee.title}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Premium CTA Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          {/* Glow Background */}
          <div className="absolute -inset-2 bg-gradient-to-r from-brand-forest via-brand-forestLight to-brand-night rounded-[2.5rem] blur-2xl opacity-30" />
          
          <div className="relative bg-gradient-to-br from-brand-night via-[#171a20] to-brand-night rounded-[2rem] p-12 md:p-16 text-center overflow-hidden shadow-2xl">
            
            {/* Animated Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              {/* Icon */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-6"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-brand-gold to-brand-sand rounded-full flex items-center justify-center shadow-2xl shadow-brand-gold/40">
                  <Sparkles className="text-brand-ink" size={36} />
                </div>
              </motion.div>

              <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Une Question ? Besoin d'Infos ?
              </h3>
              
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Contactez-nous pour réserver ou obtenir plus d'informations.
                <span className="block mt-2 text-brand-gold font-semibold">
                  On vous répond rapidement !
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-12 py-5 rounded-2xl font-bold text-lg overflow-hidden shadow-2xl"
                >
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-gold via-brand-goldSoft to-brand-sand" />
                  
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  
                    <span className="relative z-10 text-brand-ink flex items-center space-x-2">
                      <span>Nous Contacter</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        &gt;
                      </motion.span>
                    </span>
                </motion.a>

                <motion.a
                  href="tel:+33612345678"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 rounded-2xl font-bold text-lg border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                >
                  Appelez-nous
                </motion.a>
              </div>

              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-10 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full"
              >
                <Shield className="text-green-400" size={20} />
                <span className="text-white text-sm font-medium">Simple et sans engagement</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default Services
