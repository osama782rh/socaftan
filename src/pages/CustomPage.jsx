import { motion } from 'framer-motion'
import { Ruler, Palette, Clock, Package, ArrowRight, ChevronDown, Scissors, Sparkles, Shield, Phone, Wrench } from 'lucide-react'
import { useState } from 'react'

const processSteps = [
  {
    icon: <Palette size={22} />,
    title: 'Personnalisez',
    description: 'Choisissez le style, le tissu, la couleur et les finitions de votre caftan avec notre configurateur.',
  },
  {
    icon: <Ruler size={22} />,
    title: 'Vos mensurations',
    description: 'Renseignez vos mesures pour un ajustement parfait. Nous vous guidons à chaque étape.',
  },
  {
    icon: <Scissors size={22} />,
    title: 'Confection',
    description: 'Nos artisans confectionnent votre pièce unique avec les meilleurs matériaux. Délai 4 à 6 semaines.',
  },
  {
    icon: <Package size={22} />,
    title: 'Livraison',
    description: 'Votre caftan vous est livré avec soin, prêt à sublimer votre événement.',
  },
]

const faqs = [
  {
    q: 'Combien de temps prend la confection ?',
    a: 'Comptez entre 4 et 6 semaines selon la complexité de votre création. Les broderies luxe peuvent nécessiter un délai supplémentaire.',
  },
  {
    q: 'Comment prendre mes mensurations ?',
    a: 'Nous vous fournissons un guide détaillé. Vous pouvez aussi nous envoyer vos mesures par message et nous vous guiderons par téléphone si besoin.',
  },
  {
    q: 'Quel est le mode de paiement ?',
    a: 'Un acompte de 50% est demandé à la commande, le solde à la livraison. Nous acceptons les espèces, CB et virements.',
  },
  {
    q: 'Puis-je modifier ma commande en cours ?',
    a: 'Des modifications mineures (couleur, finitions) sont possibles dans les 48h suivant la commande. Au-delà, contactez-nous pour étudier les possibilités.',
  },
  {
    q: 'Les retours sont-ils possibles ?',
    a: 'Comme il s\'agit d\'une création sur-mesure, les retours ne sont pas possibles. C\'est pourquoi nous prenons le temps de valider chaque détail avec vous avant la confection.',
  },
]

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-brand-sand/60 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm md:text-base font-semibold text-brand-ink pr-4">{faq.q}</span>
        <ChevronDown
          size={18}
          className={`text-brand-ink/30 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-sm text-brand-ink/50 leading-relaxed">{faq.a}</p>
      </motion.div>
    </div>
  )
}

function CustomPage() {
  return (
    <div className="bg-brand-ivory">

      {/* Hero Sur-mesure */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 bg-brand-ink overflow-hidden">
        {/* Subtle gradient orb */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[150px]" />

        <div className="max-w-5xl mx-auto px-5 md:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase mb-5">
              Atelier Sur-Mesure
            </p>
            <h1 className="text-display font-bold text-white mb-6">
              Créez votre caftan
              <br />
              <span className="italic font-light text-brand-goldSoft">unique</span>
            </h1>
            <p className="text-white/40 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Plus de 100 combinaisons possibles. Personnalisez chaque détail
              et visualisez votre création en temps réel.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-white/50">
                <Clock size={15} className="text-brand-gold" />
                <span>4-6 semaines</span>
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <Sparkles size={15} className="text-brand-gold" />
                <span>Pièce unique</span>
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <Shield size={15} className="text-brand-gold" />
                <span>Acompte 50%</span>
              </div>
            </div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-14 flex justify-center"
          >
            <a href="#process" className="flex flex-col items-center gap-2 text-white/20 hover:text-white/40 transition-colors">
              <span className="text-[10px] tracking-[0.2em] uppercase">Comment ça marche</span>
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <ChevronDown size={18} />
              </motion.div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section id="process" className="py-16 md:py-24 px-5 md:px-10 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="section-label justify-center">Le processus</p>
            <h2 className="section-title text-center">
              De l'idée à <span className="italic font-light">la réalité</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative text-center p-6"
              >
                {/* Step number */}
                <div className="text-[80px] font-serif font-bold text-brand-sand/60 leading-none absolute top-0 left-1/2 -translate-x-1/2 select-none">
                  {i + 1}
                </div>
                <div className="relative pt-10">
                  <div className="w-12 h-12 rounded-xl bg-brand-sand flex items-center justify-center text-brand-ink mx-auto mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold font-serif text-brand-ink mb-2">{step.title}</h3>
                  <p className="text-sm text-brand-ink/45 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <a
              href="#custom"
              className="group inline-flex items-center gap-2 bg-brand-ink text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-colors"
            >
              Commencer la personnalisation
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* 3D Configurator — Coming Soon */}
      <section id="custom" className="py-16 md:py-24 px-5 md:px-10 bg-brand-ivory">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-white rounded-3xl border border-brand-sand/50 p-10 md:p-16 text-center overflow-hidden"
          >
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-brand-sand flex items-center justify-center mx-auto mb-6">
                <Wrench size={28} className="text-brand-gold" />
              </div>

              <p className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
                En cours de développement
              </p>

              <h2 className="text-2xl md:text-3xl font-bold font-serif text-brand-ink mb-4">
                Configurateur 3D
                <br />
                <span className="italic font-light">bientôt disponible</span>
              </h2>

              <p className="text-sm md:text-base text-brand-ink/45 max-w-lg mx-auto mb-8 leading-relaxed">
                Notre outil de personnalisation interactif arrive très bientôt.
                Vous pourrez créer votre caftan sur-mesure et le visualiser en 3D en temps réel.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {[
                  { icon: <Palette size={15} />, text: 'Choix des tissus & couleurs' },
                  { icon: <Scissors size={15} />, text: 'Personnalisation des coupes' },
                  { icon: <Sparkles size={15} />, text: 'Visualisation 3D en temps réel' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-brand-ink/40">
                    <span className="text-brand-gold">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>

              <div className="bg-brand-ink rounded-2xl p-6 md:p-8">
                <p className="text-white/40 text-sm mb-2">
                  En attendant, contactez-nous pour votre projet sur-mesure
                </p>
                <p className="text-white font-serif font-bold text-xl mb-4">
                  Nous vous accompagnons personnellement
                </p>
                <a
                  href="tel:+33699832902"
                  className="inline-flex items-center gap-2 bg-brand-gold text-brand-ink px-6 py-3 rounded-full font-semibold text-sm hover:bg-brand-goldSoft transition-colors"
                >
                  <Phone size={16} />
                  06 99 83 29 02
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Measurements Guide */}
      <section id="mesures" className="py-16 md:py-24 px-5 md:px-10 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="section-label justify-center">Guide des tailles</p>
            <h2 className="section-title text-center">
              Vos <span className="italic font-light">mensurations</span>
            </h2>
            <p className="section-subtitle mx-auto text-center">
              Pour un ajustement parfait, prenez vos mesures avec un mètre ruban souple, directement sur le corps.
            </p>
          </motion.div>

          {/* Measurements grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              { label: 'Tour de poitrine', where: 'Au niveau le plus fort de la poitrine', tip: 'Gardez le mètre bien horizontal' },
              { label: 'Tour de taille', where: 'Au creux naturel de la taille', tip: 'Ne serrez pas trop le mètre' },
              { label: 'Tour de hanches', where: 'Au niveau le plus fort des hanches', tip: 'Incluez les fesses dans la mesure' },
              { label: 'Longueur souhaitée', where: 'De l\'épaule jusqu\'à l\'ourlet souhaité', tip: 'Tenez-vous droite, pieds joints' },
              { label: 'Tour de bras', where: 'Au niveau le plus fort du biceps', tip: 'Bras détendu le long du corps' },
              { label: 'Longueur des manches', where: 'De l\'épaule au poignet', tip: 'Bras légèrement plié' },
              { label: 'Largeur d\'épaules', where: 'D\'une pointe d\'épaule à l\'autre', tip: 'Mesurez dans le dos' },
              { label: 'Hauteur buste', where: 'De l\'épaule à la taille', tip: 'Passez par la poitrine' },
            ].map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 p-5 bg-brand-ivory rounded-xl border border-brand-sand/40"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-sand flex items-center justify-center text-brand-ink flex-shrink-0">
                  <Ruler size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-ink mb-0.5">{m.label}</h4>
                  <p className="text-xs text-brand-ink/40 mb-1">{m.where}</p>
                  <p className="text-[11px] text-brand-gold italic">{m.tip}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-brand-ink rounded-2xl p-6 md:p-8 text-center"
          >
            <p className="text-white/40 text-sm mb-3">
              Besoin d'aide pour prendre vos mesures ?
            </p>
            <p className="text-white font-serif font-bold text-xl mb-5">
              Nous vous guidons par téléphone
            </p>
            <a
              href="tel:+33699832902"
              className="inline-flex items-center gap-2 bg-brand-gold text-brand-ink px-6 py-3 rounded-full font-semibold text-sm hover:bg-brand-goldSoft transition-colors"
            >
              <Phone size={16} />
              06 99 83 29 02
            </a>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 px-5 md:px-10 bg-brand-ivory">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="section-label justify-center">FAQ</p>
            <h2 className="section-title text-center">
              Questions <span className="italic font-light">fréquentes</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 md:p-8 border border-brand-sand/50"
          >
            {faqs.map((faq, i) => (
              <FaqItem key={i} faq={faq} />
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default CustomPage
