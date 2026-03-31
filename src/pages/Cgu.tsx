import { motion } from 'framer-motion'
import { FileText, Shield, CreditCard, AlertCircle, Scale } from 'lucide-react'

const sectionClass = 'mb-10'
const bodyClass = 'text-gray-700 leading-relaxed space-y-4 ml-13'

const CGU = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 px-5 py-2 rounded-full mb-4">
            <FileText className="text-emerald-700" size={20} />
            <span className="text-emerald-700 font-semibold text-sm">Conditions d'utilisation</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Conditions Generales d'Utilisation</h1>
          <p className="text-gray-600 text-lg">Regles d'acces et d'utilisation du site SO Caftan</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12"
        >
          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-lg mb-8">
            <p className="text-gray-700 leading-relaxed">
              Les presentes CGU encadrent l'utilisation du site <strong>socaftan.fr</strong>. Toute navigation sur le site
              implique l'acceptation des presentes conditions.
            </p>
          </div>

          <section className={sectionClass}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="text-rose-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 1 - Acces au site</h2>
            </div>
            <div className={bodyClass}>
              <p>Le site est accessible 24h/24, 7j/7, sauf maintenance, incident technique ou cas de force majeure.</p>
              <p>SO Caftan peut suspendre temporairement l'acces sans preavis pour raisons techniques ou de securite.</p>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="text-purple-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 2 - Compte utilisateur</h2>
            </div>
            <div className={bodyClass}>
              <p>
                L'utilisateur est responsable des informations fournies lors de son inscription et de la confidentialite de ses identifiants.
              </p>
              <p>
                Toute activite effectuee depuis le compte est presumee faite par son titulaire. En cas d'usage non autorise, il doit en informer SO Caftan immediatement.
              </p>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="text-amber-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 3 - Commandes et paiements</h2>
            </div>
            <div className={bodyClass}>
              <p>
                Les commandes sont regies par les <a href="/cgv" className="text-emerald-700 hover:underline font-semibold">CGV</a>.
              </p>
              <p>Le paiement en ligne est securise via Stripe.</p>
              <p>
                Pour les locations, une caution de 100€ est appliquee. Si la piece n'est pas rendue dans l'etat fourni
                (tache qui ne part pas, defaut, deterioration), la caution ne sera pas rendue.
              </p>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-red-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 4 - Usage interdit</h2>
            </div>
            <div className={bodyClass}>
              <p>Sont notamment interdits :</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>l'utilisation frauduleuse du site ou du compte client ;</li>
                <li>la tentative d'acces non autorise aux systemes ou donnees ;</li>
                <li>la copie ou reutilisation non autorisee des contenus du site ;</li>
                <li>tout comportement portant atteinte a SO Caftan ou a des tiers.</li>
              </ul>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Scale className="text-indigo-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 5 - Responsabilite et droit applicable</h2>
            </div>
            <div className={bodyClass}>
              <p>
                SO Caftan met en oeuvre les moyens raisonnables pour assurer la fiabilite du site, sans garantie d'absence totale d'interruption ou d'erreur.
              </p>
              <p>
                Les presentes CGU sont soumises au droit francais. En cas de litige, une resolution amiable est recherchee avant toute action judiciaire.
              </p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
              <h3 className="font-bold text-gray-900 mb-3">Contact</h3>
              <p className="text-gray-700 mb-2">Email : <strong>contact@socaftan.fr</strong></p>
              <p className="text-gray-700">Telephone : <strong>+33 184180326</strong></p>
            </div>
            <div className="text-center text-sm text-gray-500 mt-8">
              <p>Derniere mise a jour : <strong>31 mars 2026</strong></p>
              <p className="mt-2">Version : <strong>1.0</strong></p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <a href="/" className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold">
            ← Retour a l'accueil
          </a>
        </motion.div>
      </div>
    </div>
  )
}

export default CGU

