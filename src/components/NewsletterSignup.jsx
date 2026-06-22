import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, Check, Loader2, Gift } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { trackEvent } from '../lib/analytics'

/**
 * NewsletterSignup
 * ================
 * Formulaire de capture email avec double opt-in.
 * Variantes :
 *   - "compact"  : input + bouton sur 1 ligne (footer, sidebar)
 *   - "feature"  : encart promotionnel detaille (page dediee)
 *
 * Props :
 *   variant: "compact" | "feature" (defaut: "feature")
 *   source: identifiant de la source (ex: "footer", "homepage", "blog")
 */
const NewsletterSignup = ({ variant = 'feature', source = 'website' }) => {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'already' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isValid || status === 'loading') return

    setStatus('loading')
    setErrorMsg('')

    try {
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: { email: email.trim().toLowerCase(), firstName: firstName.trim() || null, source },
      })

      if (error) {
        let backend = ''
        try {
          backend = error.context ? await error.context.clone().text() : ''
        } catch {
          // ignore
        }
        throw new Error(backend || error.message || 'Erreur')
      }

      if (data?.status === 'already_subscribed') {
        setStatus('already')
      } else {
        setStatus('success')
        trackEvent('newsletter_signup', { source })
      }
      // Vide les champs sur succes
      setEmail('')
      setFirstName('')
    } catch (err) {
      console.error('[newsletter] Subscribe error:', err)
      setErrorMsg('Une erreur est survenue. Veuillez reessayer.')
      setStatus('error')
    }
  }

  // Variante compacte : input + bouton sur une ligne
  if (variant === 'compact') {
    if (status === 'success' || status === 'already') {
      return (
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <Check size={16} />
          <span>{status === 'success' ? 'Verifiez votre email pour confirmer.' : 'Vous etes deja inscrite ✓'}</span>
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            aria-label="Adresse email"
            className="flex-1 px-4 py-2.5 rounded-full text-sm bg-white/10 border border-white/25 text-white placeholder:text-white/65 focus:outline-none focus:bg-white/12 focus:border-white/30 transition-colors"
            required
          />
          <button
            type="submit"
            disabled={!isValid || status === 'loading'}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-gold hover:bg-brand-gold/90 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {status === 'loading' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <Send size={13} />
                S'inscrire
              </>
            )}
          </button>
        </div>
        {status === 'error' && (
          <p className="text-xs text-rose-300">{errorMsg}</p>
        )}
      </form>
    )
  }

  // Variante "feature" : encart complet
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-brand-ink via-brand-night to-brand-ink rounded-3xl p-8 md:p-10 text-white overflow-hidden relative"
    >
      {/* Decoration */}
      <div aria-hidden="true" className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/15 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 w-32 h-32 bg-brand-gold/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />

      <div className="relative max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-semibold uppercase tracking-wide mb-4">
          <Gift size={12} />
          Newsletter SO Caftan
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-3">
          Restez informee de nos nouveautes
        </h2>
        <p className="text-white/65 text-sm md:text-base leading-relaxed mb-6">
          Inscrivez-vous a la newsletter SO Caftan pour decouvrir nos nouveaux modeles, conseils et offres
          exclusives en avant-premiere.
        </p>

        {(status === 'success' || status === 'already') ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-5"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/25 flex items-center justify-center shrink-0">
                <Check size={16} className="text-emerald-300" />
              </div>
              <div>
                <p className="font-semibold text-white">
                  {status === 'success' ? 'Verifiez votre boite mail' : 'Vous etes deja inscrite'}
                </p>
                <p className="text-sm text-white/60 mt-1">
                  {status === 'success'
                    ? 'Nous vous avons envoye un email pour confirmer votre adresse. Cliquez sur le lien pour finaliser votre inscription.'
                    : 'Cette adresse est deja dans nos abonnees. Bonjour la fidele !'}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prenom (optionnel)"
                aria-label="Prenom"
                className="px-4 py-3 rounded-full text-sm bg-white/10 border border-white/25 text-white placeholder:text-white/65 focus:outline-none focus:bg-white/12 focus:border-white/30 transition-colors"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                aria-label="Adresse email"
                className="px-4 py-3 rounded-full text-sm bg-white/10 border border-white/25 text-white placeholder:text-white/65 focus:outline-none focus:bg-white/12 focus:border-white/30 transition-colors"
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <button
                type="submit"
                disabled={!isValid || status === 'loading'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-gold hover:bg-brand-gold/90 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Inscription...
                  </>
                ) : (
                  <>
                    <Mail size={14} />
                    Je m'inscris
                  </>
                )}
              </button>
              <p className="text-[11px] text-white/40 leading-snug">
                Pas de spam · Desabonnement en 1 clic · Conforme RGPD
              </p>
            </div>
            {status === 'error' && (
              <p className="text-xs text-rose-300">{errorMsg}</p>
            )}
          </form>
        )}
      </div>
    </motion.div>
  )
}

export default NewsletterSignup
