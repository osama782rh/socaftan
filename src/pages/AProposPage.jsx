import { Link } from 'react-router-dom'
import { Home, ChevronRight, Heart, Sparkles, ShieldCheck, Truck, Star, MessageCircle } from 'lucide-react'

const AProposPage = () => {
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
          <li className="text-brand-ink font-medium">A propos</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="container-custom px-5 md:px-10 py-8 md:py-14">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-semibold uppercase tracking-wide mb-4">
            A propos de SO Caftan
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-brand-ink font-serif mb-5">
            La maison SO Caftan, l'elegance orientale en Ile-de-France
          </h1>
          <p className="text-brand-ink/65 text-base md:text-lg leading-relaxed">
            SO Caftan est ne d'une passion : celle de rendre la beaute des tenues orientales accessible
            a toutes les femmes qui celebrent leurs plus beaux moments. Basee a Tigery (91250),
            nous accompagnons les mariees, les invitees et toutes celles qui souhaitent sublimer
            leur henna, leur Aid ou leur ceremonie en Ile-de-France.
          </p>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="container-custom px-5 md:px-10 py-8">
        <div className="bg-white rounded-2xl border border-brand-sand/60 p-6 md:p-10">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-ink mb-4">Notre histoire</h2>
          <div className="space-y-4 text-brand-ink/70 leading-relaxed">
            <p>
              Tout commence par une evidence : louer une tenue de qualite ne devrait pas etre un parcours
              du combattant. Trop souvent, les futures mariees sillonnent Paris a la recherche d une boutique
              qui propose a la fois des prix accessibles, du choix et un service personnalise.
            </p>
            <p>
              SO Caftan est nee pour repondre a ce besoin. Nous proposons une selection rigoureuse de takchitas,
              karakous et caftans a des tarifs justes : <strong>90€ pour la location d une takchita</strong>,
              <strong> 100€ pour un karakou</strong>, <strong>180€ pour l achat d un caftan</strong>, sans
              compromis sur la qualite.
            </p>
            <p>
              Au-dela de la location, nous offrons un accompagnement humain : conseils sur le choix du modele,
              service WhatsApp reactif, livraison soignee dans tous les departements d Ile-de-France (91, 92, 93, 94 et Paris).
            </p>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="container-custom px-5 md:px-10 py-8">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-ink mb-5">Nos valeurs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl border border-brand-sand/60 p-5">
            <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center mb-3">
              <Heart size={18} className="text-rose-600" />
            </div>
            <h3 className="font-semibold text-brand-ink mb-1">Authenticite</h3>
            <p className="text-xs text-brand-ink/55 leading-relaxed">
              Des tenues fideles aux traditions marocaines et algeriennes, selectionnees avec soin.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-brand-sand/60 p-5">
            <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center mb-3">
              <Sparkles size={18} className="text-amber-600" />
            </div>
            <h3 className="font-semibold text-brand-ink mb-1">Qualite</h3>
            <p className="text-xs text-brand-ink/55 leading-relaxed">
              Chaque piece est entretenue, nettoyee et inspectee avant chaque location.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-brand-sand/60 p-5">
            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <ShieldCheck size={18} className="text-emerald-600" />
            </div>
            <h3 className="font-semibold text-brand-ink mb-1">Confiance</h3>
            <p className="text-xs text-brand-ink/55 leading-relaxed">
              Paiement securise, caution en main propre, service client reactif.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-brand-sand/60 p-5">
            <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center mb-3">
              <Truck size={18} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-brand-ink mb-1">Proximite</h3>
            <p className="text-xs text-brand-ink/55 leading-relaxed">
              Livraison en Ile-de-France et retrait sur rendez-vous a Tigery (91).
            </p>
          </div>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="container-custom px-5 md:px-10 py-8">
        <div className="bg-brand-ink rounded-2xl p-6 md:p-10 text-white">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">Pourquoi choisir SO Caftan ?</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-3xl font-bold text-brand-gold">90€</p>
              <p className="text-sm text-white/65 mt-1">Location takchita - tarif accessible en IDF</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-brand-gold">100€</p>
              <p className="text-sm text-white/65 mt-1">Caution main propre (100€ / 150€ karakou)</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-brand-gold">5/5</p>
              <p className="text-sm text-white/65 mt-1">Note moyenne de nos clientes en Ile-de-France</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="https://wa.me/33184180326" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600">
              <MessageCircle size={14} />
              Contacter sur WhatsApp
            </a>
            <Link to="/contact" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold hover:bg-white/20">
              Formulaire de contact
            </Link>
          </div>
        </div>
      </section>

      {/* Maillage interne */}
      <section className="container-custom px-5 md:px-10 py-10">
        <h2 className="font-serif text-2xl font-bold text-brand-ink mb-5">Decouvrez nos services</h2>
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
          <Link to="/location-caftan-mariage" className="bg-white rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold transition-colors">
            <p className="font-semibold text-brand-ink">Caftan Mariage</p>
            <p className="text-xs text-brand-ink/55 mt-1">Tenue pour votre mariage</p>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AProposPage
