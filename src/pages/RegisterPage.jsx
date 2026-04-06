import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useUiFeedback } from '../contexts/UiFeedbackContext'

const OTP_LENGTH = 6

const OtpInput = ({ value, onChange }) => {
  const inputsRef = useRef([])

  const handleChange = (index, digit) => {
    if (!/^\d?$/.test(digit)) return
    const newValue = value.split('')
    newValue[index] = digit
    const joined = newValue.join('').slice(0, OTP_LENGTH)
    onChange(joined)

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    onChange(pasted)
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    inputsRef.current[nextIndex]?.focus()
  }

  return (
    <div className="flex justify-center gap-2.5">
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={el => inputsRef.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          className="w-12 h-14 text-center text-xl font-bold font-serif text-brand-ink rounded-xl border-2 border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors bg-brand-ivory/50"
        />
      ))}
    </div>
  )
}

const RegisterPage = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState('form') // 'form' | 'otp' | 'success'
  const [loading, setLoading] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const navigate = useNavigate()
  const { notifyError, notifyInfo, notifySuccess } = useUiFeedback()

  const updateField = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      notifyError('Les mots de passe ne correspondent pas.')
      return
    }

    if (form.password.length < 6) {
      notifyError('Le mot de passe doit contenir au moins 6 caracteres.')
      return
    }

    setLoading(true)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('custom-signup', {
        body: {
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
        },
      })

      if (fnError) throw fnError
      if (data?.error) throw new Error(data.error)

      setStep('otp')
      notifyInfo('Code de verification envoye par email.')
    } catch (err) {
      notifyError(err.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()

    if (otpCode.length !== OTP_LENGTH) {
      notifyError('Veuillez saisir le code a 6 chiffres.')
      return
    }

    setLoading(true)

    try {
      const { data, error: verifyError } = await supabase.functions.invoke('custom-verify-otp', {
        body: {
          email: form.email,
          code: otpCode,
        },
      })

      if (verifyError) throw verifyError
      if (data?.error) throw new Error(data.error)

      // Connecter automatiquement l'utilisateur après vérification
      await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })

      setStep('success')
      notifySuccess('Compte verifie avec succes.')
    } catch (err) {
      notifyError(err.message || 'Code invalide ou expire.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setLoading(true)
    try {
      const { data, error: resendError } = await supabase.functions.invoke('custom-resend-otp', {
        body: { email: form.email },
      })

      if (resendError) throw resendError
      if (data?.error) throw new Error(data.error)

      setOtpCode('')
      // Cooldown de 60 secondes
      setResendCooldown(60)
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) { clearInterval(interval); return 0 }
          return prev - 1
        })
      }, 1000)
      notifyInfo('Un nouveau code a ete envoye.')
    } catch (err) {
      notifyError(err.message || 'Impossible de renvoyer le code.')
    } finally {
      setLoading(false)
    }
  }

  // Step: Success
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center px-5 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-white rounded-2xl p-8 border border-brand-sand/60 shadow-sm">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
              className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle size={32} className="text-green-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-brand-ink font-serif mb-3">
              Bienvenue {form.firstName} !
            </h2>
            <p className="text-brand-ink/50 text-sm mb-6">
              Votre compte a été créé et vérifié avec succès. Vous pouvez maintenant commander vos caftans.
            </p>
            <Link
              to="/compte"
              className="inline-flex items-center gap-2 bg-brand-ink text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-colors"
            >
              Accéder à mon espace
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // Step: OTP verification
  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center px-5 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} className="text-brand-gold" />
            </div>
            <h1 className="text-headline font-bold text-brand-ink">Vérification</h1>
            <p className="text-brand-ink/50 mt-2 text-sm">
              Un code à 6 chiffres a été envoyé à<br />
              <strong className="text-brand-ink">{form.email}</strong>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-brand-sand/60 shadow-sm">
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-3 text-center">
                  Saisissez le code reçu par email
                </label>
                <OtpInput value={otpCode} onChange={setOtpCode} />
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== OTP_LENGTH}
                className="w-full flex items-center justify-center gap-2 bg-brand-ink text-white py-3.5 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Vérification...' : 'Valider mon compte'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-brand-ink/40 mb-2">Vous n'avez pas reçu le code ?</p>
              <button
                onClick={handleResendCode}
                disabled={loading || resendCooldown > 0}
                className="text-brand-gold font-semibold text-sm hover:underline disabled:opacity-50"
              >
                {resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : 'Renvoyer le code'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Step: Registration form
  return (
    <div className="min-h-screen bg-brand-ivory flex items-center justify-center px-5 pt-28 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-headline font-bold text-brand-ink">Créer un compte</h1>
          <p className="text-brand-ink/50 mt-2">
            Rejoignez SO Caftan pour commander en ligne
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-brand-sand/60 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1.5">Prénom</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/30" />
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={updateField('firstName')}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm transition-colors bg-brand-ivory/50"
                    placeholder="Prénom"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1.5">Nom</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={updateField('lastName')}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm transition-colors bg-brand-ivory/50"
                  placeholder="Nom"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/30" />
                <input
                  type="email"
                  value={form.email}
                  onChange={updateField('email')}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm transition-colors bg-brand-ivory/50"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1.5">Téléphone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/30" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={updateField('phone')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm transition-colors bg-brand-ivory/50"
                  placeholder="+33 184180326"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={updateField('password')}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm transition-colors bg-brand-ivory/50"
                  placeholder="Min. 6 caractères"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-ink/30 hover:text-brand-ink/60"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1.5">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={updateField('confirmPassword')}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm transition-colors bg-brand-ivory/50"
                  placeholder="Confirmer le mot de passe"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-ink text-white py-3.5 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Création...' : 'Créer mon compte'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-brand-ink/50">
              Déjà un compte ?{' '}
              <Link to="/connexion" className="text-brand-gold font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default RegisterPage
