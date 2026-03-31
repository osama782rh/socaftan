import { ArrowRight, MapPin, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const seoCards = [
  {
    href: '/location-takchita-ile-de-france',
    title: 'Location Takchita Ile-de-France',
    description: 'Takchitas en location a 90€ avec reservation rapide.',
  },
  {
    href: '/location-karakou-ile-de-france',
    title: 'Location Karakou Ile-de-France',
    description: 'Karakous en location a 100€ pour vos evenements.',
  },
  {
    href: '/vente-caftan-ile-de-france',
    title: 'Vente Caftan Ile-de-France',
    description: 'Caftans disponibles a la vente a 150€.',
  },
]

const faq = [
  {
    question: 'SO Caftan propose-t-il des locations en Ile-de-France ?',
    answer: 'Oui, nous proposons la location de takchitas et karakous avec retrait organise en Ile-de-France.',
  },
  {
    question: 'Comment contacter SO Caftan rapidement ?',
    answer: 'Vous pouvez nous contacter via WhatsApp Business au +33 184180326 ou depuis le formulaire de contact.',
  },
  {
    question: 'Quel est le montant de la caution location ?',
    answer: 'La caution est de 100€ par piece louee.',
  },
]

const SEOContentSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="section-label justify-center">Visibilite locale</p>
          <h2 className="section-title text-center">SO Caftan en Ile-de-France</h2>
          <p className="section-subtitle mx-auto text-center">
            Plateforme specialisee dans la location de takchitas et karakous, et la vente de caftans.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {seoCards.map((card) => (
            <a
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-brand-sand/60 bg-brand-ivory/40 p-5 hover:border-brand-gold/50 transition-colors"
            >
              <h3 className="text-lg font-bold text-brand-ink mb-2">{card.title}</h3>
              <p className="text-brand-ink/60 text-sm mb-4">{card.description}</p>
              <span className="inline-flex items-center gap-1 text-brand-gold text-sm font-semibold">
                Voir la page
                <ArrowRight size={14} />
              </span>
            </a>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-brand-sand/60 p-6 bg-brand-ivory/30">
            <h3 className="text-xl font-bold text-brand-ink mb-4">Zones desservies</h3>
            <ul className="space-y-2 text-brand-ink/70">
              {['Paris', 'Essonne', 'Seine-et-Marne', 'Yvelines', 'Hauts-de-Seine', 'Val-de-Marne', "Val-d'Oise"].map((zone) => (
                <li key={zone} className="flex items-center gap-2">
                  <MapPin size={14} className="text-brand-gold" />
                  <span>{zone}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-brand-sand/60 p-6 bg-brand-ivory/30">
            <h3 className="text-xl font-bold text-brand-ink mb-4">FAQ rapide</h3>
            <div className="space-y-3">
              {faq.map((item) => (
                <div key={item.question}>
                  <p className="font-semibold text-brand-ink text-sm">{item.question}</p>
                  <p className="text-brand-ink/60 text-sm mt-1">{item.answer}</p>
                </div>
              ))}
            </div>
            <a
              href="https://wa.me/33184180326"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-gold"
            >
              WhatsApp Business
              <MessageCircle size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SEOContentSection
