import { Heart, Award, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import jawharaRose from '../assets/CAFTAN_JAWHARA_ROSE.jpg'
import imgMalaki from '../assets/CAFTAN_MALAKI.jpg'

const About = () => {
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
                <img
                  src={jawharaRose}
                  alt="Caftan Jawhara Rose"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Secondary image */}
              <div className="col-span-4 mt-12 aspect-[3/4] rounded-2xl overflow-hidden">
                <img
                  src={imgMalaki}
                  alt="Caftan Malaki"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-4 left-8 md:left-12 bg-white rounded-2xl px-6 py-4 shadow-lg border border-brand-sand"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-ink font-serif">60€</div>
                <div className="text-[11px] text-brand-ink/50 font-semibold tracking-wide uppercase">la location</div>
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
            <p className="section-label">Pourquoi nous choisir</p>
            <h2 className="section-title mb-5">
              L'excellence au service
              <br />
              <span className="italic font-light">de votre élégance</span>
            </h2>
            <p className="section-subtitle mb-10">
              Plus qu'une simple location, une expérience soignée qui transforme vos moments précieux en souvenirs inoubliables.
            </p>

            <div className="space-y-5">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
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
        </div>
      </div>
    </section>
  )
}

export default About
