import { Heart, Award, Clock, Star, Sparkles, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import jawharaRose from '../assets/CAFTAN_JAWHARA_ROSE.jpg'

const About = () => {
  const features = [
    {
      icon: <Heart size={32} />,
      title: 'Passion & excellence',
      description: 'Chaque caftan est sélectionné avec soin pour sublimer votre élégance naturelle.',
      gradient: 'from-brand-forest to-brand-forestLight',
    },
    {
      icon: <Award size={32} />,
      title: 'Qualité garantie',
      description: 'Tissus nobles, broderies artisanales et finitions impeccables.',
      gradient: 'from-brand-gold to-brand-sand',
    },
    {
      icon: <Clock size={32} />,
      title: 'Service express',
      description: 'Réservation en 2 minutes, livraison garantie 48 h avant votre événement.',
      gradient: 'from-brand-clay to-brand-forest',
    },
  ]

  return (
    <section id="about" className="section-padding bg-gradient-to-b from-brand-ivory via-brand-mist to-brand-ivory relative overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-forest/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container-custom relative">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-brand-goldSoft/50 to-brand-sand/50 px-6 py-3 rounded-full mb-6"
          >
            <Sparkles className="text-brand-forest" size={20} />
            <span className="text-brand-forest font-semibold">Pourquoi nous choisir</span>
          </motion.div>
          <h2 className="section-title">
            L'excellence au service de votre élégance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
            Plus qu'une simple location, une expérience soignée qui transforme vos moments précieux en souvenirs inoubliables.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          
          {/* Left: Image with Effects */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            {/* Main Image Container */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={jawharaRose}
                alt="Caftan Jawhara Rose"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              {/* Overlay Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="absolute -top-6 -right-6 bg-gradient-to-br from-brand-gold to-brand-sand text-brand-ink px-6 py-4 rounded-2xl shadow-2xl z-10"
            >
              <div className="flex items-center space-x-2">
                <Star className="fill-current" size={24} />
                <div className="text-left">
                  <div className="text-2xl font-bold">60€</div>
                  <div className="text-xs font-medium">Prix Unique</div>
                </div>
              </div>
            </motion.div>

            {/* Decorative Blur */}
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-brand-gold/25 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500" />
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-brand-forest/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500" />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="group relative"
                >
                  <div className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                    
                    {/* Background Gradient on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    <div className="relative flex items-start space-x-5">
                      {/* Icon with Gradient */}
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg`}
                      >
                        {feature.icon}
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-forest group-hover:to-brand-gold transition-all duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>

                      {/* Check Icon */}
                      <CheckCircle2 className="text-green-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 relative"
        >
          <div className="relative bg-gradient-to-r from-brand-forest via-brand-forestLight to-brand-night rounded-3xl p-12 text-center overflow-hidden shadow-2xl">
            {/* Animated Background Pattern */}
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '50px 50px',
              }}
            />

            <div className="relative">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Prête à briller lors de votre événement ?
              </h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Réservez dès maintenant et profitez de notre offre exceptionnelle à 60€.
              </p>
              <motion.a
                href="#collection"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-brand-ivory text-brand-forest px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-brand-gold/40 transition-all duration-300"
              >
                Découvrir la collection
              </motion.a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default About
