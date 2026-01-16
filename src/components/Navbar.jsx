import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, X, Sparkles, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const isSolid = isScrolled || pathname !== '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Accueil', href: '/#hero' },
    { name: 'À Propos', href: '/#about' },
    { name: 'Collection', href: '/#collection' },
    { name: 'Sur-mesure', href: '/sur-mesure' },
    { name: 'Services', href: '/#services' },
    { name: 'Tarifs', href: '/#pricing' },
    { name: 'Contact', href: '/#contact' },
  ]

  return (
    <>
      {/* Top Bar - Ultra luxe - Masqué sur mobile si pas scrollé */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-brand-forest via-brand-forestLight to-brand-night text-white transition-all duration-300 ${
          isScrolled ? 'py-1.5 md:py-2' : 'py-2 md:py-2'
        }`}
      >
        <div className="container-custom flex items-center justify-between px-4 md:px-6">
          <motion.div 
            className="flex items-center space-x-1.5 md:space-x-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={14} className="text-brand-gold flex-shrink-0" />
            <span className="font-semibold text-[10px] md:text-sm">
              <span className="hidden sm:inline">Location 60€ - Achat dès 180€ - Sur-mesure dès 220€</span>
              <span className="sm:hidden">60€ - 180€ - 220€</span>
            </span>
          </motion.div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:+33612345678" className="flex items-center space-x-2 hover:text-brand-gold transition-colors">
              <Phone size={16} />
              <span>+33 6 12 34 56 78</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`fixed left-0 right-0 z-40 transition-all duration-700 ${
          isSolid
            ? 'top-6 md:top-6 bg-brand-ivory/95 backdrop-blur-2xl shadow-2xl border-b border-brand-goldSoft/60'
            : 'top-5 md:top-6 bg-transparent'
        }`}
      >
        <div className="container-custom px-4 md:px-6">
          <div className={`flex items-center justify-between transition-all duration-500 ${
            isScrolled ? 'py-2 md:py-3' : 'py-3 md:py-6'
          }`}>
            
            {/* Logo Premium - Réduit sur mobile */}
            <motion.a
              href="/"
              className="flex items-center space-x-2 md:space-x-4 group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Logo Circle avec gradient animé */}
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-brand-gold via-brand-goldSoft to-brand-forest rounded-full blur-md opacity-75"
                />
                <div className={`relative w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center overflow-hidden transition-all duration-500 ${
                  isSolid 
                    ? 'bg-gradient-to-br from-brand-forest via-brand-forestLight to-brand-night shadow-lg' 
                    : 'bg-white/10 backdrop-blur-xl border-2 border-white/30 shadow-2xl'
                }`}>
                  <motion.span 
                    className="text-lg md:text-2xl font-bold text-white z-10"
                    animate={{ 
                      textShadow: [
                        "0 0 10px rgba(255,255,255,0.5)",
                        "0 0 20px rgba(255,255,255,0.8)",
                        "0 0 10px rgba(255,255,255,0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    SC
                  </motion.span>
                  {/* Effet de brillance */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>

              {/* Texte Logo */}
              <div className="flex flex-col">
                <motion.span
                  className={`text-lg md:text-2xl font-bold font-serif transition-all duration-500 ${
                    isSolid 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-brand-forest to-brand-gold' 
                      : 'text-white drop-shadow-lg'
                  }`}
                >
                  SO Caftan
                </motion.span>
                <motion.span
                  className={`text-[9px] md:text-xs tracking-wider transition-all duration-500 ${
                    isSolid ? 'text-gray-600' : 'text-white/90'
                  }`}
                >
                  LOCATION & VENTE
                </motion.span>
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className={`relative px-5 py-2.5 font-medium transition-all duration-300 rounded-lg group ${
                    isSolid 
                      ? 'text-brand-ink hover:text-brand-forest' 
                      : 'text-brand-ivory hover:text-brand-gold'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  
                  {/* Effet de fond au survol */}
                  <motion.div
                    className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      isSolid
                        ? 'bg-gradient-to-r from-brand-goldSoft/40 to-brand-sand/40'
                        : 'bg-white/10 backdrop-blur-sm'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  />
                  
                  {/* Ligne animée en dessous */}
                  <motion.span 
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-brand-gold to-brand-forest ${
                      isSolid ? '' : 'opacity-80'
                    }`}
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </div>

            {/* CTA Button - Caché sur tablette, visible sur desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              <motion.a
                href="/#contact"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-6 md:px-8 py-2.5 md:py-3.5 rounded-full font-semibold overflow-hidden group transition-all duration-500 text-sm md:text-base ${
                  isSolid
                    ? 'bg-gradient-to-r from-brand-forest via-brand-forestLight to-brand-night text-white shadow-lg hover:shadow-2xl'
                    : 'bg-brand-ivory text-brand-forest shadow-2xl'
                }`}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <Sparkles size={16} />
                  <span>Réserver</span>
                </span>
                
                {/* Effet de brillance animé */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="lg:hidden relative z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className={`p-1.5 md:p-2 rounded-lg transition-all duration-300 ${
                isSolid 
                  ? 'bg-gradient-to-r from-brand-goldSoft/40 to-brand-sand/40' 
                  : 'bg-white/10 backdrop-blur-sm'
              }`}>
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="text-black" size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className={isSolid ? 'text-brand-forest' : 'text-brand-ivory'} size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 lg:hidden"
          >
            {/* Backdrop avec blur */}
            <motion.div
              initial={{ backdropFilter: 'blur(0px)' }}
              animate={{ backdropFilter: 'blur(20px)' }}
              exit={{ backdropFilter: 'blur(0px)' }}
              className="absolute inset-0 bg-gradient-to-br from-brand-night/95 via-[#16191f]/95 to-brand-forest/95"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-2xl overflow-y-auto"
            >
              <div className="p-8 pt-20">
                {/* Logo dans le menu mobile */}
                <div className="mb-12 text-center">
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-forest to-brand-gold">
                    SO Caftan
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Location & Vente</p>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-6 py-4 rounded-xl text-brand-ink hover:bg-gradient-to-r hover:from-brand-goldSoft/40 hover:to-brand-sand/40 hover:text-brand-forest font-medium transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <span>{link.name}</span>
                        <motion.span
                          initial={{ x: -10, opacity: 0 }}
                          whileHover={{ x: 0, opacity: 1 }}
                          className="text-brand-forest"
                        >
                          >
                        </motion.span>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* CTA Button Mobile */}
                <motion.a
                  href="/#contact"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-8 block w-full bg-gradient-to-r from-brand-forest via-brand-forestLight to-brand-night text-white text-center py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Sparkles size={20} />
                    <span>Réserver</span>
                  </span>
                </motion.a>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 pt-8 border-t border-gray-200 text-center"
                >
                  <p className="text-sm text-gray-600 mb-2">Une question ?</p>
                  <a href="tel:+33612345678" className="text-brand-forest font-semibold flex items-center justify-center space-x-2">
                    <Phone size={18} />
                    <span>+33 6 12 34 56 78</span>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
