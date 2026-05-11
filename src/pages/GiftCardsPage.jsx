import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home, ChevronRight, Gift, Sparkles, Loader2, Check,
  Mail, MessageCircle, Heart, ArrowRight,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { trackEvent } from '../lib/analytics'

const PRESET_AMOUNTS = [50, 90, 100, 150, 180, 250]
const MIN_AMOUNT = 30
const MAX_AMOUNT = 1000

const GiftCardsPage = () => {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const cancelled = searchParams.get('cancelled') === '1'

  const [amount, setAmount] = useState(90)
  const [customAmount, setCustomAmount] = useState('')
  const [usingCustom, setUsingCustom] = useState(false)

  const [purchaserName, setPurchaserName] = useState('')
  const [purchaserEmail, setPurchaserEmail] = useState(user?.email || '')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [personalMessage, setPersonalMessage] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.email && !purchaserEmail) setPurchaserEmail(user.email)
  }, [user, purchaserEmail])

  const finalAmount = usingCustom ? Number(customAmount) : amount
  const isValid =
    Number.isFinite(finalAmount) &&
    finalAmount >= MIN_AMOUNT &&
    finalAmount <= MAX_AMOUNT &&
    purchaserName.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(purchaserEmail) &&
    recipientName.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isValid || submitting) return
    setSubmitting(true)
    setError('')

    try {
      let accessToken = ''
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        accessToken = sessionData?.session?.access_token || ''
      } catch {
        // ignore
      }

      const { data, error: fnError } = await supabase.functions.invoke('gift-card-purchase', {
        body: {
          amount: finalAmount,
          purchaserName: purchaserName.trim(),
          purchaserEmail: purchaserEmail.trim().toLowerCase(),
          recipientName: recipientName.trim(),
          recipientEmail: recipientEmail.trim().toLowerCase(),
          personalMessage: personalMessage.trim(),
          ...(accessToken ? { accessToken } : {}),
        },
      })

      if (fnError) {
        let backend = ''
        try {
          backend = fnError.context ? await fnError.context.clone().text() : ''
        } catch {
          // ignore
        }
        throw new Error(backend || fnError.message || 'Erreur lors de la creation.')
      }

      if (!data?.url) throw new Error('URL Stripe manquante.')

      trackEvent('gift_card_purchase_initiated', { value: finalAmount, currency: 'EUR' })
      window.location.href = data.url
    } catch (err) {
      console.error('[gift-card] Submit error:', err)
      setError(err?.message || 'Une erreur est survenue. Veuillez reessayer.')
      setSubmitting(false)
    }
  }

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
          <li className="text-brand-ink font-medium">Cartes cadeaux</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="container-custom px-5 md:px-10 py-6 md:py-10 max-w-3xl">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold uppercase tracking-wide mb-4">
          <Gift size={11} />
          Cadeau parfait
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-brand-ink font-serif mb-3 leading-tight">
          Offrez une carte cadeau SO Caftan
        </h1>
        <p className="text-brand-ink/65 text-sm md:text-base leading-relaxed">
          Anniversaire, Saint-Valentin, fete des meres, naissance ou simple geste : offrez une carte cadeau
          a une personne qui aime l'elegance orientale. Elle pourra l'utiliser pour une location ou un achat
          dans toute la collection.
        </p>
      </section>

      {/* Bandeau cancel */}
      {cancelled && (
        <section className="container-custom px-5 md:px-10 max-w-3xl">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            Le paiement a ete annule. Aucune carte n'a ete debitee. Vous pouvez reessayer ci-dessous.
          </div>
        </section>
      )}

      {/* Form */}
      <section className="container-custom px-5 md:px-10 py-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-brand-sand/60 p-6 md:p-8 space-y-6">
          {/* Montants */}
          <div>
            <label className="block text-sm font-semibold text-brand-ink mb-3">
              Choisissez le montant
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_AMOUNTS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setAmount(value); setUsingCustom(false) }}
                  className={`px-3 py-3 rounded-xl border-2 font-bold text-sm transition-colors ${
                    !usingCustom && amount === value
                      ? 'border-brand-gold bg-brand-gold/8 text-brand-ink'
                      : 'border-brand-sand/60 text-brand-ink/65 hover:border-brand-gold/40'
                  }`}
                >
                  {value}€
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="custom_amount_check"
                checked={usingCustom}
                onChange={(e) => setUsingCustom(e.target.checked)}
                className="shrink-0"
              />
              <label htmlFor="custom_amount_check" className="text-xs text-brand-ink/65 cursor-pointer">
                Montant libre :
              </label>
              <input
                type="number"
                min={MIN_AMOUNT}
                max={MAX_AMOUNT}
                step="1"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setUsingCustom(true) }}
                placeholder={`${MIN_AMOUNT}-${MAX_AMOUNT}€`}
                className="flex-1 max-w-[140px] px-3 py-1.5 rounded-lg border border-brand-sand/70 text-sm text-brand-ink"
              />
            </div>
          </div>

          {/* Acheteur */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-brand-ink">Vos coordonnees (acheteur)</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={purchaserName}
                onChange={(e) => setPurchaserName(e.target.value)}
                placeholder="Votre nom complet"
                className="w-full px-3 py-2.5 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                required
              />
              <input
                type="email"
                value={purchaserEmail}
                onChange={(e) => setPurchaserEmail(e.target.value)}
                placeholder="Votre email"
                className="w-full px-3 py-2.5 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                required
              />
            </div>
          </div>

          {/* Beneficiaire */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-brand-ink">A qui offrir ?</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Prenom de la beneficiaire"
                className="w-full px-3 py-2.5 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                required
              />
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Email de la beneficiaire"
                className="w-full px-3 py-2.5 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                required
              />
            </div>
            <textarea
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              placeholder="Un petit mot personnel (optionnel)"
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2.5 rounded-xl border border-brand-sand/70 text-sm text-brand-ink resize-none"
            />
            <p className="text-[10px] text-brand-ink/40 text-right">{personalMessage.length}/500</p>
          </div>

          {/* Recap */}
          <div className="bg-brand-ivory/60 border border-brand-sand/40 rounded-xl p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-ink/65">Montant de la carte cadeau</span>
              <span className="font-bold text-brand-ink font-serif text-lg">
                {Number.isFinite(finalAmount) && finalAmount > 0 ? `${finalAmount}€` : '—'}
              </span>
            </div>
            <p className="text-[11px] text-brand-ink/50 mt-2 leading-relaxed flex items-start gap-1.5">
              <Mail size={11} className="shrink-0 mt-0.5" />
              Apres paiement, la carte cadeau sera envoyee par email a la beneficiaire (et une confirmation a vous).
              Validite : 1 an.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-brand-ink hover:bg-brand-night text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Redirection vers le paiement...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Offrir cette carte ({Number.isFinite(finalAmount) && finalAmount > 0 ? `${finalAmount}€` : '...'})
                <ArrowRight size={14} />
              </>
            )}
          </button>

          <p className="text-[11px] text-brand-ink/40 text-center leading-relaxed">
            Paiement securise via Stripe. La carte est generee instantanement apres paiement.
          </p>
        </form>
      </section>

      {/* Pourquoi offrir */}
      <section className="container-custom px-5 md:px-10 py-8 max-w-3xl">
        <h2 className="font-serif text-2xl font-bold text-brand-ink mb-5">Pourquoi offrir une carte cadeau ?</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-brand-sand/60 p-5">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-3">
              <Heart size={18} className="text-rose-500" />
            </div>
            <h3 className="font-semibold text-brand-ink text-sm">Cadeau personnalise</h3>
            <p className="text-xs text-brand-ink/55 mt-1 leading-relaxed">
              La beneficiaire choisit elle-meme la tenue qui lui correspond, du modele a la taille.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-brand-sand/60 p-5">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-3">
              <Gift size={18} className="text-amber-600" />
            </div>
            <h3 className="font-semibold text-brand-ink text-sm">Livraison instantanee</h3>
            <p className="text-xs text-brand-ink/55 mt-1 leading-relaxed">
              La carte est envoyee par email immediatement apres paiement. Aucun delai de livraison.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-brand-sand/60 p-5">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <Check size={18} className="text-emerald-600" />
            </div>
            <h3 className="font-semibold text-brand-ink text-sm">Utilisation flexible</h3>
            <p className="text-xs text-brand-ink/55 mt-1 leading-relaxed">
              Utilisable en plusieurs fois, valable 1 an, sur tout le catalogue (location ou achat).
            </p>
          </div>
        </div>
      </section>

      {/* CTA WhatsApp */}
      <section className="container-custom px-5 md:px-10 py-4 max-w-3xl">
        <div className="bg-brand-ivory/60 rounded-2xl p-4 md:p-5 text-center">
          <p className="text-xs text-brand-ink/65 mb-2">Une question sur les cartes cadeaux ?</p>
          <a
            href="https://wa.me/33184180326?text=Bonjour%20SO%20Caftan%2C%20j%27ai%20une%20question%20sur%20les%20cartes%20cadeaux"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
          >
            <MessageCircle size={12} />
            Nous contacter
          </a>
        </div>
      </section>
    </div>
  )
}

export default GiftCardsPage
