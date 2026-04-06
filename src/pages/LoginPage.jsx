import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useUiFeedback } from '../contexts/UiFeedbackContext'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const { notifyError, notifySuccess } = useUiFeedback()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from || '/compte'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(email, password)
      notifySuccess('Connexion reussie.')
      navigate(from, { replace: true })
    } catch (err) {
      if (err.message?.includes('Invalid login')) {
        notifyError('Email ou mot de passe incorrect.')
      } else {
        notifyError(err.message || 'Une erreur est survenue.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-ivory flex items-center justify-center px-5 pt-28 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-headline font-bold text-brand-ink">Connexion</h1>
          <p className="text-brand-ink/50 mt-2">
            Accédez à votre espace personnel
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-brand-sand/60 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm transition-colors bg-brand-ivory/50"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-brand-sand focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none text-sm transition-colors bg-brand-ivory/50"
                  placeholder="Votre mot de passe"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-ink text-white py-3.5 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-brand-ink/50">
              Pas encore de compte ?{' '}
              <Link to="/inscription" className="text-brand-gold font-semibold hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
