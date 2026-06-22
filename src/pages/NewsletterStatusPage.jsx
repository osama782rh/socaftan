import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X, AlertCircle, Mail, ArrowRight, Heart } from 'lucide-react'

/**
 * Page polymorphe utilisee pour afficher le resultat des actions newsletter :
 *  - /newsletter/confirme    : confirmation reussie
 *  - /newsletter/desabonne   : desabonnement reussi
 *  - /newsletter/lien-invalide : token invalide ou expire
 *
 * Le statut est passe via la prop `variant` (defini par App.jsx).
 */
const NewsletterStatusPage = ({ variant = 'confirmed' }) => {
  const [searchParams] = useSearchParams()
  const firstName = searchParams.get('name') || ''

  const config = {
    confirmed: {
      icon: <Check size={32} className="text-emerald-600" />,
      iconBg: 'bg-emerald-50',
      title: firstName ? `Bienvenue ${firstName} !` : 'Inscription confirmee !',
      subtitle: 'Vous etes desormais abonnee a la newsletter SO Caftan.',
      message: (
        <>
          Vous recevrez desormais nos actualites, nos nouveaux modeles et nos conseils
          en avant-premiere. Merci de faire partie de la communaute SO Caftan.
        </>
      ),
      ctaPrimary: { label: 'Decouvrir le catalogue', to: '/' },
      ctaSecondary: { label: 'Faire le quiz personnalise', to: '/quiz' },
    },
    unsubscribed: {
      icon: <X size={32} className="text-rose-500" />,
      iconBg: 'bg-rose-50',
      title: 'Vous avez ete desabonnee',
      subtitle: 'Votre adresse email a ete retiree de notre newsletter.',
      message: (
        <>
          Nous sommes desolees de vous voir partir. Si vous changez d'avis, vous pouvez vous reinscrire
          depuis le footer de notre site a tout moment.
        </>
      ),
      ctaPrimary: { label: 'Retour sur SO Caftan', to: '/' },
      ctaSecondary: null,
    },
    invalid: {
      icon: <AlertCircle size={32} className="text-amber-600" />,
      iconBg: 'bg-amber-50',
      title: 'Lien invalide ou expire',
      subtitle: 'Ce lien de confirmation n\'est plus valable.',
      message: (
        <>
          Le lien que vous avez utilise est expire ou n\'existe plus. Veuillez vous reinscrire
          depuis le formulaire newsletter en bas de notre site.
        </>
      ),
      ctaPrimary: { label: 'Retour sur SO Caftan', to: '/' },
      ctaSecondary: { label: 'Nous contacter', to: '/contact' },
    },
  }

  const cfg = config[variant] || config.confirmed

  return (
    <div className="min-h-screen bg-brand-ivory pt-32 md:pt-36 pb-16 px-5 md:px-10">
      <div className="container-custom max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, type: 'spring', stiffness: 200, damping: 24 }}
          className="bg-white rounded-3xl border border-brand-sand/60 p-7 md:p-12 text-center shadow-sm"
        >
          {/* Icone */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.18, type: 'spring', stiffness: 260, damping: 20 }}
            className={`w-20 h-20 ${cfg.iconBg} rounded-full flex items-center justify-center mx-auto mb-5`}
          >
            {cfg.icon}
          </motion.div>

          {/* Titre */}
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-brand-ink mb-2 leading-tight">
            {cfg.title}
          </h1>
          <p className="text-brand-ink/65 text-sm md:text-base mb-5">
            {cfg.subtitle}
          </p>

          {/* Message */}
          {variant === 'confirmed' ? (
            <div className="bg-gradient-to-br from-brand-gold/10 to-brand-gold/5 border border-brand-gold/25 rounded-2xl p-5 mb-6 text-left">
              <p className="text-sm text-brand-ink/75 leading-relaxed">
                <Mail size={14} className="inline-block mr-1.5 -mt-0.5 text-brand-gold" />
                {cfg.message}
              </p>
            </div>
          ) : (
            <p className="text-sm text-brand-ink/65 leading-relaxed mb-6 max-w-md mx-auto">
              {cfg.message}
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <Link
              to={cfg.ctaPrimary.to}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full bg-brand-ink hover:bg-brand-night text-white text-sm font-semibold transition-colors"
            >
              {cfg.ctaPrimary.label}
              <ArrowRight size={14} />
            </Link>
            {cfg.ctaSecondary && (
              <Link
                to={cfg.ctaSecondary.to}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full border border-brand-sand text-brand-ink/75 hover:bg-brand-sand/30 text-sm font-semibold transition-colors"
              >
                {cfg.ctaSecondary.label}
              </Link>
            )}
          </div>

          {/* Note de bas de page */}
          {variant === 'confirmed' && (
            <p className="text-[11px] text-brand-ink/40 mt-7 leading-relaxed flex items-center justify-center gap-1">
              <Heart size={10} className="fill-rose-400 text-rose-400" />
              Merci de faire partie de la communaute SO Caftan
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default NewsletterStatusPage
