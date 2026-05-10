import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, ChevronRight, ChevronLeft, ChevronRight as ArrowRight,
  Sparkles, Check, Loader2, Mail, Heart, MessageCircle, RotateCcw,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { resolveProductImage } from '../lib/productImages'
import { trackEvent } from '../lib/analytics'
import { QUIZ_QUESTIONS, recommendProducts, buildPersonalizedTitle } from '../lib/quiz'

const STEP_INTRO = -1
const STEP_EMAIL = QUIZ_QUESTIONS.length
const STEP_RESULT = QUIZ_QUESTIONS.length + 1

const QuizPage = () => {
  const [step, setStep] = useState(STEP_INTRO)
  const [answers, setAnswers] = useState({})
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [submittingEmail, setSubmittingEmail] = useState(false)
  const [skipEmail, setSkipEmail] = useState(false)
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  // Charge tous les produits disponibles
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, category, image_key, rental_price, purchase_price, description, available, featured')
          .eq('available', true)
        if (cancelled) return
        if (!error && data) setProducts(data)
      } catch {
        // silencieux : si Supabase down, on prendra des fallback statiques plus tard
      } finally {
        if (!cancelled) setLoadingProducts(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const recommendations = useMemo(() => {
    if (step !== STEP_RESULT) return []
    if (loadingProducts || products.length === 0) return []
    return recommendProducts(answers, products)
  }, [step, answers, products, loadingProducts])

  // Tracking analytics
  useEffect(() => {
    if (step === STEP_INTRO) trackEvent('quiz_started', {})
    if (step === STEP_RESULT) trackEvent('quiz_completed', { answers })
  }, [step, answers])

  const currentQuestion = step >= 0 && step < QUIZ_QUESTIONS.length ? QUIZ_QUESTIONS[step] : null
  const totalSteps = QUIZ_QUESTIONS.length + 1 // questions + email
  const progressPct = step < 0 ? 0 : step >= STEP_RESULT ? 100 : ((step + 1) / totalSteps) * 100

  const setAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const toggleMultiSelect = (id, value, max = Infinity) => {
    setAnswers((prev) => {
      const arr = Array.isArray(prev[id]) ? prev[id] : []
      if (arr.includes(value)) {
        return { ...prev, [id]: arr.filter((v) => v !== value) }
      }
      if (arr.length >= max) return prev
      return { ...prev, [id]: [...arr, value] }
    })
  }

  const canProceed = useMemo(() => {
    if (!currentQuestion) return true
    const ans = answers[currentQuestion.id]
    if (currentQuestion.type === 'multiple') {
      const min = currentQuestion.minSelections || 1
      return Array.isArray(ans) && ans.length >= min
    }
    return Boolean(ans)
  }, [currentQuestion, answers])

  const handleNext = () => {
    if (step === QUIZ_QUESTIONS.length - 1) {
      // Apres derniere question -> ecran email
      setStep(STEP_EMAIL)
    } else {
      setStep(step + 1)
    }
  }

  const handlePrev = () => {
    if (step === STEP_EMAIL) setStep(QUIZ_QUESTIONS.length - 1)
    else if (step > 0) setStep(step - 1)
  }

  const restart = () => {
    setStep(STEP_INTRO)
    setAnswers({})
    setEmail('')
    setFirstName('')
    setSkipEmail(false)
  }

  const handleEmailSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    setSubmittingEmail(true)
    try {
      // Inscription discrete a la newsletter (la cliente recoit un mail de confirmation)
      await supabase.functions.invoke('newsletter-subscribe', {
        body: {
          email: email.trim().toLowerCase(),
          firstName: firstName.trim() || null,
          source: 'quiz',
        },
      })
      trackEvent('newsletter_signup', { source: 'quiz' })
    } catch {
      // on continue meme si l'inscription echoue, le quiz doit donner le resultat
    } finally {
      setSubmittingEmail(false)
      setStep(STEP_RESULT)
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
          <li className="text-brand-ink font-medium">Quiz</li>
        </ol>
      </nav>

      {/* Container principal */}
      <div className="container-custom px-5 md:px-10 max-w-2xl">
        {/* Barre de progression */}
        {step > STEP_INTRO && step < STEP_RESULT && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-brand-ink/50 mb-2">
              <span>Etape {Math.min(step + 1, totalSteps)} sur {totalSteps}</span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-brand-sand/40 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4 }}
                className="h-full bg-brand-gold"
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ========= INTRO ========= */}
          {step === STEP_INTRO && (
            <motion.section
              key="intro"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-2xl border border-brand-sand/60 p-7 md:p-12 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-brand-gold/15 flex items-center justify-center mx-auto mb-5">
                <Sparkles size={26} className="text-brand-gold" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold uppercase tracking-wide mb-3">
                Selection personnalisee
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-ink font-serif mb-3">
                Quelle tenue est faite pour vous ?
              </h1>
              <p className="text-brand-ink/65 text-base leading-relaxed max-w-md mx-auto mb-7">
                Repondez a 5 petites questions et decouvrez les 3 modeles SO Caftan
                qui vous correspondent le mieux. Cela prend a peine 1 minute.
              </p>
              <button
                type="button"
                onClick={() => setStep(0)}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-ink hover:bg-brand-night text-white font-semibold text-sm transition-colors"
              >
                Commencer le quiz
                <ArrowRight size={15} />
              </button>
              <p className="text-xs text-brand-ink/40 mt-4">
                ⏱ 1 minute · 100% gratuit · sans engagement
              </p>
            </motion.section>
          )}

          {/* ========= QUESTIONS ========= */}
          {currentQuestion && (
            <motion.section
              key={`question-${currentQuestion.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-brand-sand/60 p-6 md:p-8"
            >
              <h2 className="font-serif text-xl md:text-2xl font-bold text-brand-ink leading-tight mb-1">
                {currentQuestion.label}
              </h2>
              {currentQuestion.type === 'multiple' && (
                <p className="text-xs text-brand-ink/55 mb-5">
                  Selectionnez {currentQuestion.minSelections || 1} a {currentQuestion.maxSelections || 3} reponse
                  {(currentQuestion.maxSelections || 3) > 1 ? 's' : ''}.
                </p>
              )}

              <div className={`mt-5 ${currentQuestion.type === 'multiple' ? 'grid sm:grid-cols-2 gap-2' : 'space-y-2'}`}>
                {currentQuestion.options.map((option) => {
                  const isMulti = currentQuestion.type === 'multiple'
                  const value = answers[currentQuestion.id]
                  const isSelected = isMulti
                    ? (Array.isArray(value) && value.includes(option.value))
                    : value === option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        if (isMulti) toggleMultiSelect(currentQuestion.id, option.value, currentQuestion.maxSelections || 3)
                        else setAnswer(currentQuestion.id, option.value)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-brand-gold bg-brand-gold/8 text-brand-ink'
                          : 'border-brand-sand/60 hover:border-brand-gold/45 text-brand-ink/75'
                      }`}
                    >
                      {option.emoji && <span className="text-xl shrink-0">{option.emoji}</span>}
                      {option.color && (
                        <span
                          aria-hidden="true"
                          className="w-5 h-5 rounded-full border border-brand-sand/40 shrink-0"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      <span className="flex-1 text-sm font-medium">{option.label}</span>
                      {isSelected && <Check size={16} className="text-brand-gold shrink-0" />}
                    </button>
                  )
                })}
              </div>

              {/* Navigation */}
              <div className="mt-7 flex items-center justify-between gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1.5 text-sm text-brand-ink/55 hover:text-brand-ink disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                  Precedent
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-ink hover:bg-brand-night text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {step === QUIZ_QUESTIONS.length - 1 ? 'Voir mon resultat' : 'Suivant'}
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.section>
          )}

          {/* ========= EMAIL ========= */}
          {step === STEP_EMAIL && (
            <motion.section
              key="email"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-brand-sand/60 p-7 md:p-10 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-brand-gold/15 flex items-center justify-center mx-auto mb-4">
                <Mail size={22} className="text-brand-gold" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-ink mb-2">
                Recevez votre selection par email
              </h2>
              <p className="text-brand-ink/65 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-6">
                Nous vous enverrons votre selection personnalisee + un code <strong>SOCAFTAN20</strong> de
                <strong> -20%</strong> sur votre premiere commande.
              </p>

              <div className="space-y-3 max-w-md mx-auto">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Votre prenom (optionnel)"
                  className="w-full px-4 py-3 rounded-full text-sm border border-brand-sand/70 text-brand-ink"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="w-full px-4 py-3 rounded-full text-sm border border-brand-sand/70 text-brand-ink"
                  required
                />
                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  disabled={!email || submittingEmail}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-brand-ink hover:bg-brand-night text-white text-sm font-semibold disabled:opacity-40"
                >
                  {submittingEmail ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Inscription...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Voir mon resultat + code -20%
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setSkipEmail(true); setStep(STEP_RESULT) }}
                  className="text-xs text-brand-ink/45 hover:text-brand-ink/65 transition-colors"
                >
                  Continuer sans email
                </button>
              </div>

              <p className="text-[11px] text-brand-ink/40 mt-5 max-w-sm mx-auto leading-relaxed">
                En soumettant votre email, vous acceptez de recevoir nos newsletters.
                Desabonnement en 1 clic. Conforme RGPD.
              </p>
            </motion.section>
          )}

          {/* ========= RESULTAT ========= */}
          {step === STEP_RESULT && (
            <motion.section
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-brand-ink via-brand-night to-brand-ink rounded-2xl p-7 md:p-10 text-center text-white relative overflow-hidden">
                <div aria-hidden="true" className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/15 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-semibold uppercase tracking-widest mb-3">
                    <Sparkles size={10} />
                    Votre selection
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight">
                    {firstName ? `${firstName}, voici vos pieces !` : 'Voici vos pieces !'}
                  </h2>
                  <p className="text-white/65 text-sm md:text-base mt-2 leading-relaxed max-w-lg mx-auto">
                    {buildPersonalizedTitle(answers)}. {!skipEmail && email && (
                      <span>Nous venons de vous l'envoyer aussi par email.</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Recommandations */}
              {loadingProducts ? (
                <div className="bg-white rounded-2xl border border-brand-sand/60 p-12 text-center">
                  <Loader2 size={20} className="animate-spin text-brand-ink/30 mx-auto" />
                </div>
              ) : recommendations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-brand-sand/60 p-10 text-center">
                  <p className="text-brand-ink/55 text-sm">
                    Nous n'avons pas trouve de modele parfaitement adapte. Contactez-nous via WhatsApp pour des conseils personnalises.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map(({ product, score }, idx) => (
                    <motion.article
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.12 }}
                      className="bg-white rounded-2xl border border-brand-sand/60 overflow-hidden hover:border-brand-gold/55 transition-colors"
                    >
                      <div className="aspect-[3/4] bg-brand-sand/30 relative overflow-hidden">
                        <img
                          src={resolveProductImage(product.image_key)}
                          alt={product.name}
                          loading={idx === 0 ? 'eager' : 'lazy'}
                          className="w-full h-full object-cover"
                        />
                        {/* Badge match score */}
                        <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm shadow-sm">
                          <Heart size={11} className="fill-rose-500 text-rose-500" />
                          <span className="text-[10px] font-bold text-brand-ink">{score}% match</span>
                        </div>
                        {idx === 0 && (
                          <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-gold text-white shadow-sm">
                            <Sparkles size={11} />
                            <span className="text-[10px] font-bold">Top match</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] text-brand-gold font-semibold uppercase tracking-wide">{product.category}</p>
                        <h3 className="font-serif text-lg font-bold text-brand-ink mt-1 leading-tight">{product.name}</h3>
                        <div className="mt-2 space-y-0.5 text-xs text-brand-ink/55">
                          {Number(product.rental_price) > 0 && (
                            <p>Location <strong className="text-brand-ink">{Number(product.rental_price).toFixed(0)}€</strong></p>
                          )}
                          {Number(product.purchase_price) > 0 && (
                            <p>Achat <strong className="text-brand-ink">{Number(product.purchase_price).toFixed(0)}€</strong></p>
                          )}
                        </div>
                        <a
                          href="https://wa.me/33184180326?text=Bonjour%20SO%20Caftan%2C%20je%20suis%20interessee%20par%20le%20modele%20{name}"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-brand-ink text-white text-xs font-semibold hover:bg-brand-night transition-colors"
                        >
                          <MessageCircle size={11} />
                          Reserver ce modele
                        </a>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-brand-sand text-brand-ink/65 hover:bg-brand-sand/30 text-sm font-semibold"
                >
                  <RotateCcw size={13} />
                  Refaire le quiz
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-gold hover:bg-brand-gold/90 text-white text-sm font-semibold"
                >
                  Voir tout le catalogue
                  <ArrowRight size={13} />
                </Link>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default QuizPage
