import { Instagram, Facebook, Mail, Phone, Sparkles, Heart, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: <Instagram size={24} />, href: 'https://www.instagram.com/so_caftan91/', label: 'Instagram', gradient: 'from-pink-500 to-purple-500' },
    { icon: <Facebook size={24} />, href: '#', label: 'Facebook', gradient: 'from-blue-500 to-indigo-500' },
    { icon: <Mail size={24} />, href: 'mailto:contact@socaftan.fr', label: 'Email', gradient: 'from-rose-500 to-pink-500' },
    { icon: <Phone size={24} />, href: 'tel:+33612345678', label: 'Téléphone', gradient: 'from-amber-500 to-yellow-500' },
  ]

  const quickLinks = [
    { name: 'Accueil', href: '#hero' },
    { name: 'À Propos', href: '#about' },
    { name: 'Collection', href: '#collection' },
    { name: 'Sur-Mesure', href: '#custom' },
    { name: 'Services', href: '#services' },
    { name: 'Tarifs', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ]

  const services = [
    { name: 'Location de Caftans', price: 'dès 60€' },
    { name: 'Achat de Caftans', price: 'dès 180€' },
    { name: 'Création Sur-Mesure', price: 'dès 220€' },
  ]

  const legalLinks = [
    { name: 'Mentions l‚gales', to: '/mentions-legales' },
    { name: 'CGV', to: '/cgv' },
    { name: 'Confidentialité', to: '/confidentialite' },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="container-custom section-padding relative z-10">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 rounded-full flex items-center justify-center"
              >
                <Sparkles className="text-white" size={24} />
              </motion.div>
              <div>
                <span className="text-2xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                  SO Caftan
                </span>
                <p className="text-xs text-gray-400">Location & Vente</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              Votre destination pour des caftans d'exception. Location, achat ou création sur-mesure.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative group"
                >
                  {/* Glow Effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${social.gradient} rounded-full opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300`} />
                  
                  <div className={`relative w-12 h-12 bg-gradient-to-r ${social.gradient} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}>
                    {social.icon}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
              Navigation
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <span className="w-1 h-1 bg-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.name}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400">
              Nos Services
            </h3>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <li key={index} className="text-gray-400">
                  <div className="font-medium text-white text-sm">{service.name}</div>
                  <div className="text-xs text-amber-400">{service.price}</div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              Contact
            </h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="text-rose-500 flex-shrink-0 mt-0.5" size={18} />
                <span>Île-de-France, France</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="text-rose-500 flex-shrink-0 mt-0.5" size={18} />
                <a href="tel:+33612345678" className="hover:text-white transition-colors">
                  +33 6 12 34 56 78
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="text-rose-500 flex-shrink-0 mt-0.5" size={18} />
                <a href="mailto:contact@socaftan.fr" className="hover:text-white transition-colors break-all">
                  contact@socaftan.fr
                </a>
              </li>
            </ul>

            {/* Availability Badge */}
            <div className="mt-6 inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-semibold">Disponible maintenant</span>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-400 text-sm flex items-center space-x-2"
          >
            <span>© {currentYear} SO Caftan.</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center space-x-1">
              <span>Fait avec</span>
              <Heart className="text-rose-500 fill-rose-500" size={14} />
              <span>en France</span>
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6"
          >
            {legalLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-gray-400 hover:text-white text-sm transition-colors">
                {link.name}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Optional: Back to top button */}
        <motion.a
          href="#hero"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-rose-500/50 transition-all duration-300 z-50"
        >
          <span className="text-2xl text-white">↑</span>
        </motion.a>

      </div>
    </footer>
  )
}

export default Footer
