import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ChevronRight, Upload, Image as ImageIcon, Check, Loader2, X, Heart } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { trackEvent } from '../lib/analytics'

const OCCASIONS = [
  { value: 'mariage', label: 'Mariage' },
  { value: 'henna', label: 'Henna' },
  { value: 'fiancailles', label: 'Fiancailles' },
  { value: 'aid', label: 'Aid' },
  { value: 'bapteme', label: 'Bapteme' },
  { value: 'reception', label: 'Reception / soiree' },
  { value: 'autre', label: 'Autre' },
]

const MAX_FILE_SIZE_MB = 10
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const PartagerPhotoPage = () => {
  const { user } = useAuth()
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    caption: '',
    occasion: '',
    productName: '',
    consent: false,
  })

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    setError('')

    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setError('Format invalide. JPEG, PNG ou WebP uniquement.')
      return
    }

    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Fichier trop lourd. Maximum ${MAX_FILE_SIZE_MB} Mo.`)
      return
    }

    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
  }

  const removeFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!file) {
      setError('Veuillez selectionner une photo.')
      return
    }
    if (!form.consent) {
      setError('Le consentement de publication est obligatoire.')
      return
    }
    if (!user && !form.email) {
      setError('Email requis si vous n\'avez pas de compte.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      // Upload sur Storage
      const ext = file.name.split('.').pop() || 'jpg'
      const safeName = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${ext}`
      const storagePath = `submissions/${safeName}`

      const { error: uploadError } = await supabase.storage
        .from('customer-photos')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        })

      if (uploadError) {
        throw new Error(uploadError.message || 'Echec de l\'upload.')
      }

      // Recupere l'URL publique
      const { data: urlData } = supabase.storage
        .from('customer-photos')
        .getPublicUrl(storagePath)
      const publicUrl = urlData?.publicUrl || null

      // Insertion en DB
      const submitterName = (form.name || '').trim() || null
      const submitterEmail = (form.email || user?.email || '').trim() || null
      const caption = (form.caption || '').trim() || null
      const occasion = form.occasion || null
      const productName = (form.productName || '').trim() || null

      const { error: insertError } = await supabase.from('customer_photos').insert({
        user_id: user?.id || null,
        submitter_name: submitterName,
        submitter_email: submitterEmail,
        storage_path: storagePath,
        public_url: publicUrl,
        caption,
        occasion,
        product_name: productName,
        consent_publication: true,
        consent_at: new Date().toISOString(),
      })

      if (insertError) {
        throw new Error(insertError.message || 'Echec de l\'enregistrement.')
      }

      trackEvent('ugc_photo_submitted', { occasion, has_product: Boolean(productName) })
      setSuccess(true)
      removeFile()
      setForm({ name: '', email: '', caption: '', occasion: '', productName: '', consent: false })
    } catch (err) {
      console.error('[ugc] Submit error:', err)
      setError(err?.message || 'Une erreur est survenue. Veuillez reessayer.')
    } finally {
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
          <li>
            <Link to="/galerie" className="hover:text-brand-ink">Galerie</Link>
          </li>
          <ChevronRight size={12} className="text-brand-ink/30" />
          <li className="text-brand-ink font-medium">Partager une photo</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="container-custom px-5 md:px-10 py-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold uppercase tracking-wide mb-4">
            <Heart size={11} className="fill-current" />
            Communaute SO Caftan
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-ink font-serif mb-3">
            Partagez votre plus belle photo
          </h1>
          <p className="text-brand-ink/65 text-sm md:text-base leading-relaxed">
            Vous avez porte une tenue SO Caftan ? Envoyez-nous votre photo pour figurer dans notre galerie
            et inspirer d'autres futures mariees. Votre photo sera publiee apres validation.
          </p>
        </div>
      </section>

      {/* Form ou success */}
      <section className="container-custom px-5 md:px-10 py-4 max-w-2xl">
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-emerald-200 p-7 md:p-10 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-emerald-600" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-ink mb-2">Merci infiniment !</h2>
            <p className="text-brand-ink/65 text-sm md:text-base leading-relaxed">
              Votre photo a bien ete recue. Notre equipe la verifiera dans les 24-48h
              avant de la publier sur la galerie. Vous recevrez un email des qu'elle sera en ligne.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link
                to="/galerie"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-ink text-white text-sm font-semibold"
              >
                Voir la galerie
              </Link>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-brand-sand text-brand-ink text-sm font-semibold hover:bg-brand-sand/30"
              >
                Envoyer une autre photo
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-brand-sand/60 p-5 md:p-7 space-y-5">
            {/* Upload */}
            <div>
              <label className="block text-sm font-semibold text-brand-ink mb-2">Votre photo</label>
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Apercu"
                    className="w-full max-h-96 object-contain rounded-xl bg-brand-sand/20"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-brand-ink/55 hover:text-brand-ink"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-brand-sand rounded-xl py-10 px-4 cursor-pointer hover:border-brand-gold hover:bg-brand-ivory/40 transition-colors">
                  <ImageIcon size={28} className="text-brand-ink/30" />
                  <p className="text-sm font-semibold text-brand-ink">Cliquez pour selectionner</p>
                  <p className="text-xs text-brand-ink/45">JPEG, PNG ou WebP · Max {MAX_FILE_SIZE_MB} Mo</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_TYPES.join(',')}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Nom + email (si pas connecte) */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-brand-ink/60 mb-1.5">Votre prenom</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Sara"
                  className="w-full px-3 py-2.5 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-ink/60 mb-1.5">
                  Email {!user && <span className="text-rose-500">*</span>}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder={user?.email || 'votre@email.com'}
                  required={!user}
                  disabled={Boolean(user?.email)}
                  className="w-full px-3 py-2.5 rounded-xl border border-brand-sand/70 text-sm text-brand-ink disabled:bg-brand-sand/20"
                />
              </div>
            </div>

            {/* Occasion + modele */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-brand-ink/60 mb-1.5">Occasion</label>
                <select
                  value={form.occasion}
                  onChange={(e) => updateField('occasion', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                >
                  <option value="">Choisir...</option>
                  {OCCASIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-ink/60 mb-1.5">Modele porte</label>
                <input
                  type="text"
                  value={form.productName}
                  onChange={(e) => updateField('productName', e.target.value)}
                  placeholder="Andalouse, Royale..."
                  className="w-full px-3 py-2.5 rounded-xl border border-brand-sand/70 text-sm text-brand-ink"
                />
              </div>
            </div>

            {/* Caption */}
            <div>
              <label className="block text-xs font-semibold text-brand-ink/60 mb-1.5">Un petit mot (optionnel)</label>
              <textarea
                value={form.caption}
                onChange={(e) => updateField('caption', e.target.value)}
                placeholder="Comment avez-vous vecu votre journee dans cette tenue ?"
                rows={3}
                maxLength={300}
                className="w-full px-3 py-2.5 rounded-xl border border-brand-sand/70 text-sm text-brand-ink resize-none"
              />
              <p className="text-[10px] text-brand-ink/40 mt-1 text-right">{form.caption.length}/300</p>
            </div>

            {/* Consentement */}
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-brand-ivory/50 border border-brand-sand/40 cursor-pointer">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => updateField('consent', e.target.checked)}
                className="mt-0.5 shrink-0"
                required
              />
              <span className="text-xs text-brand-ink/70 leading-relaxed">
                J'autorise SO Caftan a publier ma photo sur le site (galerie publique) et sur les reseaux sociaux
                de la marque (Instagram, TikTok). Je peux retirer ce consentement a tout moment en
                contactant <a href="mailto:contact@socaftan.fr" className="text-brand-gold underline">contact@socaftan.fr</a>.
              </span>
            </label>

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !file || !form.consent}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-brand-ink text-white font-semibold text-sm hover:bg-brand-night disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Upload size={14} />
                  Envoyer ma photo
                </>
              )}
            </button>

            <p className="text-[11px] text-brand-ink/45 text-center leading-relaxed">
              Votre photo sera moderee dans les 24-48h. Nous nous reservons le droit de refuser
              les photos non conformes (qualite, pertinence).
            </p>
          </form>
        )}
      </section>
    </div>
  )
}

export default PartagerPhotoPage
