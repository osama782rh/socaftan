import { ArrowRight, CheckCircle2, MessageCircle, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

const ServiceLandingPage = ({
  badge,
  title,
  subtitle,
  price,
  details,
  benefits,
  process,
  faq,
  relatedLinks,
}) => {
  return (
    <div className="min-h-screen bg-brand-ivory pt-28 pb-20 px-5 md:px-10">
      <div className="container-custom max-w-6xl">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-brand-sand/60 p-8 md:p-12 shadow-sm mb-8"
        >
          <p className="section-label">{badge}</p>
          <h1 className="text-3xl md:text-5xl font-bold text-brand-ink mb-4">{title}</h1>
          <p className="text-brand-ink/60 text-base md:text-lg max-w-3xl leading-relaxed mb-6">{subtitle}</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-brand-gold/15 text-brand-ink font-semibold">
              Tarif: {price}
            </span>
            {details.map((detail) => (
              <span
                key={detail}
                className="inline-flex items-center px-3 py-2 rounded-full bg-brand-sand/50 text-brand-ink/80 text-sm"
              >
                {detail}
              </span>
            ))}
          </div>
        </motion.section>

        <section className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl border border-brand-sand/60 p-7 md:p-8">
            <h2 className="text-2xl font-bold text-brand-ink mb-4">Pourquoi choisir SO Caftan</h2>
            <ul className="space-y-3">
              {benefits.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-brand-ink/70">
                  <CheckCircle2 size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-3xl border border-brand-sand/60 p-7 md:p-8">
            <h2 className="text-2xl font-bold text-brand-ink mb-4">Comment reserver</h2>
            <ol className="space-y-3 text-brand-ink/70">
              {process.map((item, index) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-ink text-white text-xs flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-brand-sand/60 p-7 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-brand-ink mb-5">FAQ</h2>
          <div className="space-y-4">
            {faq.map((item) => (
              <div key={item.question} className="rounded-2xl border border-brand-sand/60 p-4 md:p-5">
                <h3 className="font-semibold text-brand-ink mb-2">{item.question}</h3>
                <p className="text-brand-ink/65 text-sm md:text-base">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-brand-ink rounded-3xl p-8 md:p-10 text-white mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Reservez en quelques minutes</h2>
          <p className="text-white/70 mb-6 max-w-2xl">
            Contactez-nous pour confirmer votre date et votre piece. Notre equipe vous accompagne de la reservation
            jusqu'au retrait.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/#collection"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-gold text-brand-ink font-semibold text-sm"
            >
              Voir la collection
              <ArrowRight size={16} />
            </a>
            <a
              href="https://wa.me/33184180326"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white font-semibold text-sm"
            >
              WhatsApp Business
              <MessageCircle size={16} />
            </a>
            <a
              href="tel:+33184180326"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white font-semibold text-sm"
            >
              +33 184180326
              <Phone size={16} />
            </a>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-brand-sand/60 p-7 md:p-8">
          <h2 className="text-2xl font-bold text-brand-ink mb-4">Pages utiles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold/40 hover:bg-brand-ivory transition-colors"
              >
                <p className="font-semibold text-brand-ink">{link.title}</p>
                <p className="text-sm text-brand-ink/55 mt-1">{link.description}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default ServiceLandingPage
