import { motion } from 'framer-motion'
import { FileText, CreditCard, Truck, AlertCircle, Scale } from 'lucide-react'

const sectionClass = 'mb-10'
const bodyClass = 'text-gray-700 leading-relaxed space-y-4 ml-13'

const CGV = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 px-5 py-2 rounded-full mb-4">
            <FileText className="text-blue-600" size={20} />
            <span className="text-blue-600 font-semibold text-sm">Conditions de Vente</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Conditions Generales de Vente</h1>
          <p className="text-gray-600 text-lg">Applicables aux commandes SO Caftan</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12"
        >
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-8">
            <p className="text-gray-700 leading-relaxed">
              Les presentes CGV regissent les ventes et locations effectuees sur <strong>socaftan.fr</strong> entre
              <strong> SO Caftan</strong> et le Client.
            </p>
          </div>

          <section className={sectionClass}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="text-rose-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 1 - Offres et prix</h2>
            </div>
            <div className={bodyClass}>
              <p>Les prix sont en euros (€), TTC.</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Takchitas :</strong> location uniquement a <strong>90€</strong> (3 a 5 jours)</li>
                <li><strong>Karakous :</strong> location uniquement a <strong>100€</strong> (3 a 5 jours)</li>
                <li><strong>Caftans :</strong> vente uniquement a <strong>150€</strong></li>
                <li><strong>Sur-mesure :</strong> a partir de <strong>220€</strong> selon options</li>
              </ul>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="text-purple-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 2 - Paiement</h2>
            </div>
            <div className={bodyClass}>
              <p>
                Le paiement est effectue en ligne via <strong>Stripe</strong> (carte bancaire) ou selon les modalites
                precisees par SO Caftan.
              </p>
              <p>
                Pour toute location, une <strong>caution de 100€ par piece</strong> est ajoutee a la commande.
              </p>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="text-amber-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 3 - Location, retrait et restitution</h2>
            </div>
            <div className={bodyClass}>
              <p>
                Le retrait et la restitution sont organises au point de rendez-vous convenu entre le Vendeur et le Client.
              </p>
              <p>
                La piece louee doit etre retournee dans l'etat fourni, avec ses accessoires et dans le delai convenu.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">Clause caution</p>
                <p>
                  Si la piece n'est pas restituee dans l'etat fourni, la caution ne sera pas rendue.
                  Cela inclut notamment : <strong>tache qui ne part pas, defaut, dechirure, brulure, odeur persistante,
                  accessoire manquant ou deterioration</strong>.
                </p>
                <p className="mt-2">
                  La retenue peut etre partielle ou totale selon le cout de remise en etat ou de remplacement.
                </p>
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-green-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 4 - Vente de caftans</h2>
            </div>
            <div className={bodyClass}>
              <p>Les caftans vendus deviennent la propriete definitive du Client apres paiement complet.</p>
              <p>
                Pour les ventes a distance, le Client beneficie du droit legal de retractation de 14 jours, sauf exception legale.
              </p>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Scale className="text-indigo-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 5 - Litiges et droit applicable</h2>
            </div>
            <div className={bodyClass}>
              <p>Les presentes CGV sont soumises au droit francais.</p>
              <p>
                En cas de litige, une resolution amiable est recherchee prioritairement. A defaut, les juridictions francaises
                competentes seront saisies.
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
              <p className="mt-2">Version : <strong>2.0</strong></p>
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

export default CGV

