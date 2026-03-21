import { Instagram, Mail, Phone, MapPin, ChevronUp } from 'lucide-react'

const TikTokIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" />
  </svg>
)
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: <Instagram size={18} />, href: 'https://www.instagram.com/so_caftan91/', label: 'Instagram' },
    { icon: <TikTokIcon size={18} />, href: 'https://www.tiktok.com/@so_caftan91', label: 'TikTok' },
    { icon: <Mail size={18} />, href: 'mailto:contact@socaftan.fr', label: 'Email' },
  ]

  const quickLinks = [
    { name: 'Accueil', href: '#hero' },
    { name: 'Collection', href: '#collection' },
    { name: 'Services', href: '#services' },
    { name: 'Tarifs', href: '#pricing' },
    { name: 'Sur-mesure', href: '/sur-mesure#custom' },
    { name: 'Contact', href: '#contact' },
  ]

  const legalLinks = [
    { name: 'Mentions légales', to: '/mentions-legales' },
    { name: 'CGV', to: '/cgv' },
    { name: 'Confidentialité', to: '/confidentialite' },
  ]

  return (
    <footer className="bg-brand-ink text-white">
      <div className="container-custom px-5 md:px-10 lg:px-20 pt-16 md:pt-20 pb-8">

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-serif font-bold mb-4">
              SO <span className="italic font-light">Caftan</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              Votre destination pour des caftans d'exception. Location, achat ou création sur-mesure.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors text-white/60 hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/30 mb-5">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-white/50 hover:text-white text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/30 mb-5">
              Nos services
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Location de Caftans', price: 'dès 60€' },
                { name: 'Achat de Caftans', price: 'dès 180€' },
                { name: 'Création sur-mesure', price: 'dès 220€' },
              ].map((service, index) => (
                <li key={index}>
                  <div className="text-white/70 text-sm">{service.name}</div>
                  <div className="text-brand-gold text-xs">{service.price}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/30 mb-5">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <span className="text-white/50">Île-de-France, France</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <a href="tel:+33699832902" className="text-white/50 hover:text-white transition-colors">
                  06 99 83 29 02
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={15} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <a href="mailto:contact@socaftan.fr" className="text-white/50 hover:text-white transition-colors">
                  contact@socaftan.fr
                </a>
              </li>
            </ul>

            <div className="mt-5 inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              <span className="text-white/40 text-[10px] font-medium">Disponible</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/8 pt-6" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/25 text-xs">
            © {currentYear} SO Caftan. Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            {legalLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-white/25 hover:text-white/50 text-xs transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Back to top */}
      <a
        href="#hero"
        className="fixed bottom-6 right-6 w-11 h-11 bg-brand-ink border border-white/10 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-ink/80 transition-colors z-50"
        aria-label="Retour en haut"
      >
        <ChevronUp size={18} className="text-white/60" />
      </a>
    </footer>
  )
}

export default Footer
