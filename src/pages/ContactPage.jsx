import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, MessageCircle, Clock, Home, ChevronRight } from 'lucide-react'
import Contact from '../components/Contact'

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-brand-ivory pt-32 md:pt-36">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="container-custom px-5 md:px-10 pb-2">
        <ol className="flex items-center gap-2 text-xs text-brand-ink/55">
          <li>
            <Link to="/" className="hover:text-brand-ink inline-flex items-center gap-1">
              <Home size={12} />
              Accueil
            </Link>
          </li>
          <ChevronRight size={12} className="text-brand-ink/30" />
          <li className="text-brand-ink font-medium">Contact</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="container-custom px-5 md:px-10 py-8 md:py-12">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-semibold uppercase tracking-wide mb-4">
            Nous contacter
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-brand-ink font-serif mb-4">
            Contactez SO Caftan
          </h1>
          <p className="text-brand-ink/65 text-base md:text-lg leading-relaxed">
            Une question sur la location d'une takchita, d'un karakou ou la vente d'un caftan ?
            Notre equipe vous repond rapidement par WhatsApp, telephone ou e-mail. Nous sommes basees a Tigery (91250) en Ile-de-France.
          </p>
        </div>
      </section>

      {/* Quick contact cards */}
      <section className="container-custom px-5 md:px-10 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href="https://wa.me/33184180326"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl border border-brand-sand/60 p-5 hover:border-brand-gold transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <MessageCircle size={18} className="text-emerald-600" />
            </div>
            <p className="text-xs uppercase tracking-wide text-brand-ink/45 mb-1">WhatsApp</p>
            <p className="font-semibold text-brand-ink">+33 1 84 18 03 26</p>
            <p className="text-xs text-brand-ink/50 mt-1">Reponse rapide</p>
          </a>

          <a
            href="tel:+33184180326"
            className="group bg-white rounded-2xl border border-brand-sand/60 p-5 hover:border-brand-gold transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
              <Phone size={18} className="text-blue-600" />
            </div>
            <p className="text-xs uppercase tracking-wide text-brand-ink/45 mb-1">Telephone</p>
            <p className="font-semibold text-brand-ink">+33 1 84 18 03 26</p>
            <p className="text-xs text-brand-ink/50 mt-1">Lun - Sam, 10h - 19h</p>
          </a>

          <a
            href="mailto:contact@socaftan.fr"
            className="group bg-white rounded-2xl border border-brand-sand/60 p-5 hover:border-brand-gold transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-3">
              <Mail size={18} className="text-amber-600" />
            </div>
            <p className="text-xs uppercase tracking-wide text-brand-ink/45 mb-1">E-mail</p>
            <p className="font-semibold text-brand-ink break-all text-sm">contact@socaftan.fr</p>
            <p className="text-xs text-brand-ink/50 mt-1">Reponse sous 24h</p>
          </a>

          <div className="bg-white rounded-2xl border border-brand-sand/60 p-5">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-3">
              <MapPin size={18} className="text-rose-600" />
            </div>
            <p className="text-xs uppercase tracking-wide text-brand-ink/45 mb-1">Adresse</p>
            <p className="font-semibold text-brand-ink text-sm">Tigery (91250)</p>
            <p className="text-xs text-brand-ink/50 mt-1">Ile-de-France · Sur rendez-vous</p>
          </div>
        </div>
      </section>

      {/* Horaires */}
      <section className="container-custom px-5 md:px-10 pb-8">
        <div className="bg-white rounded-2xl border border-brand-sand/60 p-5 md:p-7">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-brand-gold" />
            <h2 className="font-serif text-xl font-bold text-brand-ink">Horaires d'ouverture</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-brand-ink/50 text-xs">Lundi - Vendredi</p>
              <p className="font-semibold text-brand-ink">10h00 - 19h00</p>
            </div>
            <div>
              <p className="text-brand-ink/50 text-xs">Samedi</p>
              <p className="font-semibold text-brand-ink">10h00 - 18h00</p>
            </div>
            <div>
              <p className="text-brand-ink/50 text-xs">Dimanche</p>
              <p className="font-semibold text-brand-ink">Sur rendez-vous</p>
            </div>
            <div>
              <p className="text-brand-ink/50 text-xs">Retrait</p>
              <p className="font-semibold text-brand-ink">Sur rendez-vous</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Contact */}
      <Contact />

      {/* Maillage interne SEO */}
      <section className="container-custom px-5 md:px-10 py-10">
        <h2 className="font-serif text-2xl font-bold text-brand-ink mb-5">Nos services</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/location-takchita-ile-de-france" className="bg-white rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold transition-colors">
            <p className="font-semibold text-brand-ink">Location Takchita</p>
            <p className="text-xs text-brand-ink/55 mt-1">A partir de 90€</p>
          </Link>
          <Link to="/location-karakou-ile-de-france" className="bg-white rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold transition-colors">
            <p className="font-semibold text-brand-ink">Location Karakou</p>
            <p className="text-xs text-brand-ink/55 mt-1">A partir de 100€</p>
          </Link>
          <Link to="/vente-caftan-ile-de-france" className="bg-white rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold transition-colors">
            <p className="font-semibold text-brand-ink">Vente Caftan</p>
            <p className="text-xs text-brand-ink/55 mt-1">180€</p>
          </Link>
          <Link to="/sur-mesure" className="bg-white rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold transition-colors">
            <p className="font-semibold text-brand-ink">Sur-mesure</p>
            <p className="text-xs text-brand-ink/55 mt-1">Creation personnalisee</p>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
