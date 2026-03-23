import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Menu, X, Phone, ShoppingBag, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { itemCount, setIsCartOpen } = useCart()
  const { user } = useAuth()
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
    { name: 'Collection', href: '/#collection' },
    { name: 'Services', href: '/#services' },
    { name: 'Tarifs', href: '/#pricing' },
    { name: 'Sur-mesure', href: '/sur-mesure' },
    { name: 'Contact', href: '/#contact' },
  ]

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-brand-ink text-white/90">
        <div className="container-custom flex items-center justify-between px-5 md:px-10 py-2">
          <span className="text-[11px] tracking-wide">
            <span className="hidden sm:inline">Location dès 60€ &nbsp;·&nbsp; Achat dès 180€ &nbsp;·&nbsp; Sur-mesure dès 220€</span>
            <span className="sm:hidden text-[10px]">Location 60€ · Achat 180€ · Sur-mesure 220€</span>
          </span>
          <a href="tel:+33699832902" className="hidden md:flex items-center gap-1.5 text-[11px] hover:text-brand-gold transition-colors">
            <Phone size={12} />
            <span>06 99 83 29 02</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`fixed left-0 right-0 z-40 transition-all duration-500 ${
          isSolid
            ? 'top-[32px] bg-white/95 backdrop-blur-xl shadow-sm border-b border-brand-sand/60'
            : 'top-[32px] bg-transparent'
        }`}
      >
        <div className="container-custom px-5 md:px-10">
          <div className={`flex items-center justify-between transition-all duration-500 ${
            isScrolled ? 'py-3' : 'py-4 md:py-5'
          }`}>

            {/* Logo */}
            <a href="/" className="flex items-center gap-2 group">
              <div className={`font-serif font-bold transition-all duration-500 ${
                isSolid
                  ? 'text-xl md:text-2xl text-brand-ink'
                  : 'text-2xl md:text-3xl text-white'
              }`}>
                SO <span className="italic font-light">Caftan</span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 text-[13px] font-medium tracking-wide transition-colors duration-300 rounded-full ${
                    isSolid
                      ? 'text-brand-ink/70 hover:text-brand-ink hover:bg-brand-sand/40'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* CTA + Cart + Account + Mobile */}
            <div className="flex items-center gap-2">
              {/* Account */}
              <Link
                to={user ? '/compte' : '/connexion'}
                className={`hidden lg:flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${
                  isSolid
                    ? 'text-brand-ink/50 hover:text-brand-ink hover:bg-brand-sand/40'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title={user ? 'Mon compte' : 'Se connecter'}
              >
                <User size={18} />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${
                  isSolid
                    ? 'text-brand-ink/50 hover:text-brand-ink hover:bg-brand-sand/40'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title="Panier"
              >
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* CTA */}
              <a
                href="/#contact"
                className={`hidden lg:inline-flex px-6 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300 ${
                  isSolid
                    ? 'bg-brand-ink text-white hover:bg-brand-ink/90'
                    : 'bg-white text-brand-ink hover:bg-white/90'
                }`}
              >
                Réserver
              </a>

              <button
                className="lg:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="text-brand-ink" size={24} />
                ) : (
                  <Menu className={isSolid ? 'text-brand-ink' : 'text-white'} size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl"
            >
              <div className="p-8 pt-24">
                <div className="mb-10">
                  <h3 className="text-2xl font-serif font-bold text-brand-ink">
                    SO <span className="italic font-light">Caftan</span>
                  </h3>
                </div>

                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3.5 rounded-xl text-brand-ink/80 hover:text-brand-ink hover:bg-brand-sand/30 font-medium transition-colors text-[15px]"
                    >
                      {link.name}
                    </a>
                  ))}

                  {/* Mobile account link */}
                  <Link
                    to={user ? '/compte' : '/connexion'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-brand-ink/80 hover:text-brand-ink hover:bg-brand-sand/30 font-medium transition-colors text-[15px]"
                  >
                    <User size={18} />
                    {user ? 'Mon compte' : 'Se connecter'}
                  </Link>
                </div>

                <a
                  href="/#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-8 block w-full bg-brand-ink text-white text-center py-3.5 rounded-full font-semibold text-sm"
                >
                  Réserver maintenant
                </a>

                <div className="mt-8 pt-6 border-t border-brand-sand text-center">
                  <a href="tel:+33699832902" className="text-brand-ink/60 hover:text-brand-ink text-sm flex items-center justify-center gap-2">
                    <Phone size={14} />
                    <span>06 99 83 29 02</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
