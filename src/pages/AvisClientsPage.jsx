import { Link } from 'react-router-dom'
import { Home, ChevronRight, Star, Quote, MessageCircle, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { REVIEWS, aggregateRating as aggregateRatingShared } from '../lib/reviews'

// Avis importes depuis src/lib/reviews.js (partage avec le SEO pour les Review schemas)
const reviews = REVIEWS

const aggregateRating = aggregateRatingShared

const StarRating = ({ rating, size = 14 }) => (
  <div className="inline-flex items-center gap-0.5" aria-label={`Note: ${rating} sur 5`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={size}
        className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-brand-ink/15'}
      />
    ))}
  </div>
)

const AvisClientsPage = () => {
  return (
    <div className="min-h-screen bg-brand-ivory pt-32 md:pt-36 pb-16">
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
          <li className="text-brand-ink font-medium">Avis clients</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="container-custom px-5 md:px-10 py-8 md:py-12">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-semibold uppercase tracking-wide mb-4">
            Avis verifies
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-brand-ink font-serif mb-4">
            Ce qu'en disent nos clientes
          </h1>
          <p className="text-brand-ink/65 text-base md:text-lg leading-relaxed">
            Decouvrez les retours des futures mariees, des mamans et des invitees qui ont fait confiance a SO Caftan
            pour leurs evenements en Ile-de-France.
          </p>
        </div>
      </section>

      {/* Bandeau note moyenne */}
      <section className="container-custom px-5 md:px-10 pb-8">
        <div className="bg-gradient-to-br from-brand-ink to-brand-night rounded-2xl p-6 md:p-8 text-white">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="text-center md:text-left">
              <p className="text-5xl md:text-6xl font-bold text-brand-gold font-serif">{aggregateRating.value}</p>
              <div className="mt-2 flex justify-center md:justify-start">
                <StarRating rating={5} size={18} />
              </div>
              <p className="text-white/70 text-sm mt-2">Sur la base de {aggregateRating.count} avis</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-white/85 text-base md:text-lg leading-relaxed">
                <Quote size={20} className="inline-block mr-2 -mt-1 text-brand-gold" />
                Une note de <strong className="text-brand-gold">{aggregateRating.value}/5</strong> qui reflete la qualite
                de nos tenues, la rapidite de notre service et l'attention portee a chaque cliente.
              </p>
              <a
                href="https://wa.me/33184180326"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors"
              >
                <MessageCircle size={15} />
                Poser une question
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Grille d'avis */}
      <section className="container-custom px-5 md:px-10 pb-10">
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map((review, index) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
              className="bg-white rounded-2xl border border-brand-sand/60 p-5 md:p-6 hover:border-brand-gold/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-sand/40 flex items-center justify-center text-brand-ink font-semibold text-sm shrink-0">
                    {review.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-ink text-sm">{review.name}</p>
                    <p className="text-xs text-brand-ink/45">{review.date}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-xs text-brand-gold font-semibold uppercase tracking-wide mb-3">{review.occasion}</p>
              <p className="text-brand-ink/70 text-sm leading-relaxed">
                <Quote size={14} className="inline-block mr-1 -mt-0.5 text-brand-gold/60" />
                {review.quote}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Section : laissez votre avis */}
      <section className="container-custom px-5 md:px-10 py-8">
        <div className="bg-white rounded-2xl border border-brand-sand/60 p-6 md:p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={20} className="text-amber-600" />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-ink mb-3">
            Vous avez ete cliente ?
          </h2>
          <p className="text-brand-ink/65 max-w-xl mx-auto mb-5">
            Votre temoignage compte enormement pour nous et pour les futures mariees qui hesitent encore.
            Si vous avez vecu une bonne experience, partagez-la sur Google en moins d'une minute.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://g.page/r/socaftan/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-gold hover:bg-brand-gold/90 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              <Star size={15} className="fill-current" />
              Laisser un avis Google
            </a>
            <a
              href="https://wa.me/33184180326?text=Bonjour%20SO%20Caftan%2C%20je%20souhaite%20laisser%20un%20temoignage"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
            >
              <MessageCircle size={15} />
              Envoyer mon temoignage
            </a>
          </div>
        </div>
      </section>

      {/* Maillage interne */}
      <section className="container-custom px-5 md:px-10 py-8">
        <h2 className="font-serif text-2xl font-bold text-brand-ink mb-5">Decouvrez nos tenues</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/location-takchita-ile-de-france" className="bg-white rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold transition-colors">
            <p className="font-semibold text-brand-ink">Location Takchita</p>
            <p className="text-xs text-brand-ink/55 mt-1">A partir de 90€</p>
          </Link>
          <Link to="/location-karakou-ile-de-france" className="bg-white rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold transition-colors">
            <p className="font-semibold text-brand-ink">Location Karakou</p>
            <p className="text-xs text-brand-ink/55 mt-1">A partir de 100€</p>
          </Link>
          <Link to="/galerie" className="bg-white rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold transition-colors">
            <p className="font-semibold text-brand-ink">Galerie</p>
            <p className="text-xs text-brand-ink/55 mt-1">Inspirations & realisations</p>
          </Link>
          <Link to="/contact" className="bg-white rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold transition-colors">
            <p className="font-semibold text-brand-ink">Contact</p>
            <p className="text-xs text-brand-ink/55 mt-1">WhatsApp, email, telephone</p>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AvisClientsPage
