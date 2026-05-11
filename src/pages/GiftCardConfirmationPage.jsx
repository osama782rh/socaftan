import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Mail, Gift, Home, ChevronRight, ArrowRight } from 'lucide-react'

const GiftCardConfirmationPage = () => {
  return (
    <div className="min-h-screen bg-brand-ivory pt-32 md:pt-36 pb-16 px-5 md:px-10">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="container-custom max-w-xl pb-2">
        <ol className="flex items-center gap-2 text-xs text-brand-ink/55">
          <li>
            <Link to="/" className="hover:text-brand-ink inline-flex items-center gap-1">
              <Home size={12} />
              Accueil
            </Link>
          </li>
          <ChevronRight size={12} className="text-brand-ink/30" />
          <li>
            <Link to="/cartes-cadeaux" className="hover:text-brand-ink">Cartes cadeaux</Link>
          </li>
          <ChevronRight size={12} className="text-brand-ink/30" />
          <li className="text-brand-ink font-medium">Confirmation</li>
        </ol>
      </nav>

      <div className="container-custom max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, type: 'spring', stiffness: 200, damping: 24 }}
          className="bg-white rounded-3xl border border-brand-sand/60 p-7 md:p-12 text-center shadow-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.18, type: 'spring', stiffness: 260, damping: 20 }}
            className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5"
          >
            <Check size={32} className="text-emerald-600" />
          </motion.div>

          <h1 className="font-serif text-2xl md:text-3xl font-bold text-brand-ink mb-2">
            Carte cadeau envoyee !
          </h1>
          <p className="text-brand-ink/65 text-sm md:text-base mb-6">
            Merci pour votre achat. La carte cadeau a bien ete envoyee a son destinataire.
          </p>

          <div className="bg-gradient-to-br from-brand-gold/10 to-brand-gold/5 border border-brand-gold/25 rounded-2xl p-5 mb-6 text-left">
            <p className="text-sm text-brand-ink/75 leading-relaxed">
              <Mail size={14} className="inline-block mr-1.5 -mt-0.5 text-brand-gold" />
              <strong className="text-brand-ink">Deux emails ont ete envoyes :</strong> votre confirmation
              d'achat (avec le code) et la carte cadeau elle-meme au destinataire.
            </p>
            <p className="text-xs text-brand-ink/55 mt-2 leading-relaxed">
              Si la beneficiaire ne recoit rien d'ici 5 minutes, demandez-lui de verifier ses spams,
              ou partagez-lui directement le code que vous avez recu.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full bg-brand-ink hover:bg-brand-night text-white text-sm font-semibold"
            >
              Retour au site
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/cartes-cadeaux"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full border border-brand-sand text-brand-ink/75 hover:bg-brand-sand/30 text-sm font-semibold"
            >
              <Gift size={14} />
              Offrir une autre carte
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default GiftCardConfirmationPage
