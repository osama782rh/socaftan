import { motion } from 'framer-motion'
import { FileText, ShoppingBag, CreditCard, Truck, RefreshCw, Shield, AlertCircle, Scale } from 'lucide-react'

const CGV = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 px-5 py-2 rounded-full mb-4">
            <FileText className="text-blue-600" size={20} />
            <span className="text-blue-600 font-semibold text-sm">Conditions de Vente</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Conditions Générales de Vente
          </h1>
          <p className="text-gray-600 text-lg">
            Applicables à tous les services de SO Caftan
          </p>
        </motion.div>

        {/* Contenu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12"
        >

          {/* Préambule */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-8">
            <p className="text-gray-700 leading-relaxed">
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre <strong>SO Caftan</strong> (microentreprise), ci-après dénommée "le Vendeur", et toute personne physique ou morale, ci-après dénommée "le Client", souhaitant louer, acheter ou commander un caftan sur-mesure via le site <strong>socaftan.fr</strong>.
            </p>
          </div>

          {/* Article 1 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="text-rose-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 1 - Objet et champ d'application</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-3 ml-13">
              <p>
                Les présentes CGV s'appliquent à l'ensemble des services proposés par <strong>SO Caftan</strong> :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Location de caftans</strong> : Mise à disposition temporaire de caftans pour une durée de 3 à 5 jours</li>
                <li><strong>Achat de caftans</strong> : Vente définitive de caftans de notre collection</li>
                <li><strong>Création sur-mesure</strong> : Confection personnalisée de caftans selon les spécifications du Client</li>
              </ul>
              <p className="mt-4">
                Le Client reconnaît avoir pris connaissance des présentes CGV et les accepte sans réserve avant toute commande. Ces CGV prévalent sur tout autre document.
              </p>
            </div>
          </section>

          {/* Article 2 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="text-purple-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 2 - Prix et modalités de paiement</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4 ml-13">
              
              {/* 2.1 Prix */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">2.1 Prix</h3>
                <p className="mb-3">Les prix sont indiqués en euros (€) et toutes taxes comprises (TTC).</p>
                
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900">Location :</p>
                    <ul className="list-disc list-inside ml-4 text-sm">
                      <li>Prix : de <strong>60€ à 100€</strong> selon le modèle</li>
                      <li>Durée : <strong>3 à 5 jours</strong></li>
                      <li>Caution : <strong>100€</strong> (remboursable après restitution en bon état)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-900">Achat :</p>
                    <ul className="list-disc list-inside ml-4 text-sm">
                      <li>Prix : de <strong>180€ à 450€+</strong> selon le modèle et les finitions</li>
                      <li>Le caftan devient la propriété définitive du Client</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-900">Sur-mesure :</p>
                    <ul className="list-disc list-inside ml-4 text-sm">
                      <li>Prix : à partir de <strong>220€</strong> selon les options choisies</li>
                      <li>Acompte : <strong>50%</strong> à la commande</li>
                      <li>Solde : <strong>50%</strong> à la livraison</li>
                      <li>Délai de fabrication : <strong>4 à 6 semaines</strong></li>
                    </ul>
                  </div>
                </div>

                <p className="mt-4 text-sm bg-amber-50 border border-amber-200 rounded-lg p-3">
                  ⚠️ <strong>Important :</strong> Les prix sont susceptibles d'être modifiés à tout moment. Les prix applicables sont ceux en vigueur au moment de la validation de la commande par le Client.
                </p>
              </div>

              {/* 2.2 Modalités de paiement */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">2.2 Modalités de paiement</h3>
                <p className="mb-3">Les moyens de paiement acceptés sont :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Espèces</li>
                  <li>Carte bancaire</li>
                  <li>Virement bancaire</li>
                </ul>
                <p className="mt-4">
                  Le paiement de la caution (location) ou de l'acompte (sur-mesure) est exigé lors de la confirmation de la commande.
                </p>
              </div>

            </div>
          </section>

          {/* Article 3 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="text-amber-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 3 - Retrait et restitution</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4 ml-13">
              
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">3.1 Modalités de retrait</h3>
                <p>
                  Le retrait du caftan (location ou achat) s'effectue à un <strong>point de rendez-vous convenu mutuellement</strong> avec le Vendeur lors de la réservation.
                </p>
                <p className="mt-3">
                  Le Vendeur propose un service de <strong>retrait flexible</strong> en Île-de-France. L'adresse exacte du point de retrait sera communiquée après confirmation de la réservation.
                </p>
                <p className="mt-3 text-sm bg-blue-50 border border-blue-200 rounded-lg p-3">
                  ℹ️ <strong>Aucun service de livraison à domicile n'est proposé actuellement.</strong>
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">3.2 Restitution (Location uniquement)</h3>
                <p className="mb-3">
                  Pour les locations, le caftan doit être restitué dans les <strong>3 à 5 jours</strong> suivant le retrait, selon la durée convenue.
                </p>
                <p className="mb-3">
                  La restitution s'effectue au même point de rendez-vous que le retrait, sauf accord contraire.
                </p>
                <p className="font-semibold text-gray-900 mb-2">Conditions de restitution :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Le caftan doit être restitué <strong>propre et en bon état</strong></li>
                  <li>Un <strong>nettoyage professionnel</strong> est inclus dans le prix de location</li>
                  <li>En cas de tache légère non partie au nettoyage : aucune retenue sur caution</li>
                  <li>En cas de dégradation importante : retenue partielle ou totale de la caution (100€)</li>
                </ul>
                <p className="mt-4 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                  ⚠️ <strong>Retard de restitution :</strong> En cas de retard, des frais de <strong>20€ par jour</strong> seront appliqués.
                </p>
              </div>

            </div>
          </section>

          {/* Article 4 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <RefreshCw className="text-green-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 4 - Droit de rétractation</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4 ml-13">
              
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">4.1 Achat de caftans (prêt-à-porter)</h3>
                <p className="mb-3">
                  Conformément aux articles L221-18 et suivants du Code de la consommation, le Client dispose d'un <strong>délai de 14 jours francs</strong> pour exercer son droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités.
                </p>
                <p className="mb-3">
                  Le délai court à compter du jour de la réception du caftan.
                </p>
                <p className="font-semibold text-gray-900 mb-2">Conditions de retour :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Le caftan doit être <strong>non porté, non lavé</strong> et avec ses étiquettes</li>
                  <li>Le retour doit être effectué dans son <strong>emballage d'origine</strong></li>
                  <li>Les frais de retour sont à la charge du Client</li>
                </ul>
                <p className="mt-4">
                  Le remboursement sera effectué dans un délai de <strong>14 jours</strong> suivant la réception du caftan retourné.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3">4.2 Sur-mesure (exclusion du droit de rétractation)</h3>
                <p className="mb-3">
                  Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation <strong>ne peut être exercé pour les biens confectionnés selon les spécifications du consommateur</strong> ou nettement personnalisés.
                </p>
                <p>
                  ❌ <strong>Aucun droit de rétractation n'est donc applicable aux commandes sur-mesure.</strong>
                </p>
                <p className="mt-3">
                  Une fois la commande validée et l'acompte versé, la fabrication débute et la commande devient définitive.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">4.3 Location (non applicable)</h3>
                <p>
                  Le droit de rétractation ne s'applique pas aux services de location. Une fois la réservation confirmée et le paiement effectué, le Client s'engage à récupérer le caftan.
                </p>
                <p className="mt-3">
                  Toutefois, en cas d'<strong>annulation plus de 48h avant la date de retrait prévue</strong>, un remboursement partiel (moins 20€ de frais de gestion) pourra être effectué.
                </p>
              </div>

            </div>
          </section>

          {/* Article 5 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="text-blue-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 5 - Garanties légales</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4 ml-13">
              
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">5.1 Garantie de conformité</h3>
                <p className="mb-3">
                  Conformément aux articles L217-4 et suivants du Code de la consommation, le Vendeur est tenu de livrer un bien conforme au contrat et répond des défauts de conformité existant lors de la délivrance.
                </p>
                <p>
                  Le Vendeur répond également des défauts de conformité résultant de l'emballage, des instructions de montage ou de l'installation lorsque celle-ci a été mise à sa charge par le contrat ou a été réalisée sous sa responsabilité.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">5.2 Garantie des vices cachés</h3>
                <p className="mb-3">
                  Conformément aux articles 1641 et suivants du Code civil, le Vendeur est tenu de la garantie à raison des défauts cachés de la chose vendue qui la rendent impropre à l'usage auquel on la destine.
                </p>
                <p>
                  Le Client dispose d'un délai de <strong>2 ans</strong> à compter de la découverte du vice pour agir.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">5.3 Service après-vente</h3>
                <p>
                  Pour toute réclamation concernant un défaut de conformité ou un vice caché, le Client peut contacter le service client :
                </p>
                <ul className="list-none ml-0 mt-3 space-y-2">
                  <li>📧 Email : <strong>contact@socaftan.fr</strong></li>
                  <li>📞 Téléphone : <strong>06 99 83 29 02</strong></li>
                </ul>
              </div>

            </div>
          </section>

          {/* Article 6 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-red-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 6 - Responsabilité</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4 ml-13">
              
              <p>
                Le Vendeur ne saurait être tenu responsable de l'inexécution du contrat en cas de :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Force majeure</li>
                <li>Fait imprévisible et insurmontable d'un tiers au contrat</li>
                <li>Faute du Client (mauvaise utilisation, non-respect des consignes d'entretien)</li>
              </ul>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-lg mt-4">
                <p className="font-semibold text-gray-900 mb-2">Limitation de responsabilité :</p>
                <p>
                  Les photographies des produits présentés sur le site ne sont pas contractuelles. Les couleurs et les détails peuvent varier légèrement en fonction des écrans et de l'éclairage.
                </p>
                <p className="mt-3">
                  Pour les créations sur-mesure, le rendu 3D du configurateur est une <strong>représentation approximative</strong>. Le produit final peut présenter de légères variations.
                </p>
              </div>

            </div>
          </section>

          {/* Article 7 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="text-indigo-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 7 - Réclamations</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4 ml-13">
              
              <p>
                Pour toute réclamation, le Client peut contacter le service client par :
              </p>
              <div className="bg-gray-50 rounded-xl p-5">
                <ul className="space-y-2">
                  <li>📧 <strong>Email :</strong> contact@socaftan.fr</li>
                  <li>📞 <strong>Téléphone :</strong> 06 99 83 29 02</li>
                  <li>📮 <strong>Courrier :</strong> SO Caftan, Île-de-France</li>
                </ul>
              </div>

              <p className="mt-4">
                Le Vendeur s'engage à répondre à toute réclamation dans un délai de <strong>7 jours ouvrés</strong>.
              </p>

            </div>
          </section>

          {/* Article 8 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Scale className="text-teal-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 8 - Médiation et litiges</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4 ml-13">
              
              <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3">8.1 Médiation de la consommation</h3>
                <p className="mb-3">
                  Conformément à l'article L.612-1 du Code de la consommation, le Client a le droit de recourir gratuitement à un <strong>médiateur de la consommation</strong> en vue de la résolution amiable du litige qui l'oppose au Vendeur.
                </p>
                <p className="text-sm text-gray-600">
                  Le médiateur compétent est référencé sur la liste officielle des médiateurs agréés : <a href="https://www.economie.gouv.fr/mediation-conso/mediateurs-references" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">economie.gouv.fr/mediation-conso</a>
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">8.2 Plateforme de règlement en ligne des litiges</h3>
                <p className="mb-3">
                  La Commission Européenne met à disposition une plateforme de règlement en ligne des litiges accessible à l'adresse suivante :
                </p>
                <p>
                  🔗 <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">https://ec.europa.eu/consumers/odr</a>
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">8.3 Droit applicable et juridiction compétente</h3>
                <p className="mb-3">
                  Les présentes CGV sont soumises au <strong>droit français</strong>.
                </p>
                <p>
                  En cas de litige et à défaut d'accord amiable ou de médiation, le litige sera porté devant les <strong>tribunaux français</strong> compétents conformément aux règles de compétence en vigueur.
                </p>
              </div>

            </div>
          </section>

          {/* Article 9 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="text-gray-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Article 9 - Dispositions générales</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4 ml-13">
              
              <p>
                Si une ou plusieurs stipulations des présentes CGV sont tenues pour non valides ou déclarées comme telles en application d'une loi, d'un règlement ou à la suite d'une décision définitive d'une juridiction compétente, les autres stipulations garderont toute leur force et leur portée.
              </p>

              <p>
                Le fait pour le Vendeur de ne pas se prévaloir à un moment donné de l'une quelconque des présentes conditions générales ne peut être interprété comme valant renonciation à se prévaloir ultérieurement de l'une quelconque desdites conditions.
              </p>

              <p className="font-semibold">
                Les présentes CGV peuvent être modifiées à tout moment. Les CGV applicables sont celles en vigueur au moment de la passation de la commande par le Client.
              </p>

            </div>
          </section>

          {/* Footer de la page */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
              <h3 className="font-bold text-gray-900 mb-3">📞 Besoin d'aide ?</h3>
              <p className="text-gray-700 mb-3">
                Pour toute question concernant nos Conditions Générales de Vente :
              </p>
              <div className="space-y-2 text-gray-700">
                <p>📧 <strong>Email :</strong> contact@socaftan.fr</p>
                <p>📞 <strong>Téléphone :</strong> 06 99 83 29 02</p>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500 mt-8">
              <p>Dernière mise à jour : <strong>17 mars 2026</strong></p>
              <p className="mt-2">Version : <strong>1.0</strong></p>
            </div>
          </div>

        </motion.div>

        {/* Bouton retour */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          
          <a
            href="/"
            className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold"
            >
            ← Retour à l'accueil
          </a>
        </motion.div>

      </div>
    </div>
  )
}

export default CGV
