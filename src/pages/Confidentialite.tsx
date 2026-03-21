import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Database, UserCheck, Cookie, Mail, AlertTriangle, FileText } from 'lucide-react'

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 px-5 py-2 rounded-full mb-4">
            <Shield className="text-green-600" size={20} />
            <span className="text-green-600 font-semibold text-sm">Protection des Données</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-gray-600 text-lg">
            Comment nous collectons, utilisons et protégeons vos données personnelles
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
          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg mb-8">
            <p className="text-gray-700 leading-relaxed">
              <strong>SO Caftan</strong>, ci-après "nous" ou "le Responsable de traitement", accorde une grande importance à la protection de vos données personnelles. Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons, stockons et protégeons vos données conformément au <strong>Règlement Général sur la Protection des Données (RGPD)</strong> et à la loi Informatique et Libertés.
            </p>
          </div>

          {/* Article 1 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Database className="text-blue-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">1. Responsable du traitement des données</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-3 ml-13">
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="mb-2"><strong>Raison sociale :</strong> SO Caftan</p>
                <p className="mb-2"><strong>Adresse :</strong> Île-de-France, France</p>
                <p className="mb-2"><strong>Email :</strong> contact@socaftan.fr</p>
                <p className="mb-2"><strong>Téléphone :</strong> 06 99 83 29 02</p>
                <p className="mb-2"><strong>SIREN :</strong> 999 110 984 </p>
              </div>
              <p className="mt-4">
                Le Responsable de traitement est la personne qui détermine les finalités et les moyens du traitement des données personnelles.
              </p>
            </div>
          </section>

          {/* Article 2 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Eye className="text-purple-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">2. Données collectées</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4 ml-13">
              
              <p>
                Nous collectons les données personnelles suivantes lorsque vous utilisez nos services :
              </p>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">2.1 Données d'identification</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Nom et prénom</li>
                  <li>Adresse postale (pour la livraison/retrait)</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">2.2 Données de commande</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Informations sur les produits commandés (location, achat, sur-mesure)</li>
                  <li>Historique des commandes</li>
                  <li>Préférences de personnalisation (pour le sur-mesure)</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">2.3 Données de paiement</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Informations de paiement (sécurisées)</li>
                  <li>Historique des transactions</li>
                </ul>
                <p className="text-sm text-gray-600 mt-3">
                  ℹ️ Les données de carte bancaire ne sont jamais stockées sur nos serveurs. Elles sont traitées directement par notre prestataire de paiement sécurisé.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">2.4 Données de navigation (cookies)</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Adresse IP</li>
                  <li>Type de navigateur</li>
                  <li>Pages visitées</li>
                  <li>Durée de visite</li>
                  <li>Données de localisation approximative</li>
                </ul>
                <p className="text-sm text-gray-600 mt-3">
                  Voir la section <a href="#cookies" className="text-blue-600 hover:underline font-semibold">Cookies</a> pour plus de détails.
                </p>
              </div>

            </div>
          </section>

          {/* Article 3 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="text-amber-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">3. Finalités du traitement</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4 ml-13">
              
              <p>Vos données personnelles sont collectées et traitées pour les finalités suivantes :</p>

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-2">✅ Gestion des commandes</h4>
                  <p className="text-sm">
                    Traitement de vos commandes de location, d'achat ou de sur-mesure, organisation du retrait et de la restitution.
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Base légale :</strong> Exécution du contrat
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-2">✅ Communication avec les clients</h4>
                  <p className="text-sm">
                    Envoi de confirmations de commande, notifications de disponibilité, rappels de restitution, réponses à vos questions.
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Base légale :</strong> Exécution du contrat et intérêt légitime
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-2">✅ Facturation et comptabilité</h4>
                  <p className="text-sm">
                    Émission de factures, gestion des paiements et remboursements, tenue de la comptabilité.
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Base légale :</strong> Obligation légale (conservation 10 ans)
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-2">✅ Service après-vente</h4>
                  <p className="text-sm">
                    Gestion des réclamations, des retours, et de l'assistance client.
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Base légale :</strong> Exécution du contrat et intérêt légitime
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-2">📧 Marketing et newsletters (optionnel)</h4>
                  <p className="text-sm">
                    Envoi d'offres promotionnelles, de nouveautés et de newsletters (uniquement si vous y avez consenti).
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Base légale :</strong> Consentement (désabonnement possible à tout moment)
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-2">✅ Amélioration du site</h4>
                  <p className="text-sm">
                    Analyse statistique de la navigation pour améliorer l'expérience utilisateur (données anonymisées).
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Base légale :</strong> Intérêt légitime
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Article 4 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="text-red-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">4. Destinataires des données</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4 ml-13">
              
              <p>
                Vos données personnelles sont destinées aux services internes de <strong>SO Caftan</strong> et peuvent être transmises aux catégories de destinataires suivantes :
              </p>

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-2">🔹 Services internes</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Service commercial</li>
                    <li>Service client</li>
                    <li>Service comptabilité</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-2">🔹 Prestataires de services</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li><strong>Hébergement web :</strong> OVH (France) - hébergement du site</li>
                    <li><strong>Paiement :</strong> [Nom du prestataire] - traitement sécurisé des paiements</li>
                    <li><strong>Emailing :</strong> [Nom du prestataire] - envoi de newsletters (si applicable)</li>
                  </ul>
                  <p className="text-xs text-gray-600 mt-2">
                    ℹ️ Ces prestataires sont liés par des engagements contractuels de confidentialité et ne peuvent utiliser vos données que pour les services commandés.
                  </p>
                </div>

                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <h4 className="font-bold text-gray-900 mb-2">⚠️ Autorités publiques</h4>
                  <p className="text-sm">
                    En cas de demande légale (réquisition judiciaire, administration fiscale, etc.), vos données peuvent être communiquées aux autorités compétentes.
                  </p>
                </div>
              </div>

              <p className="mt-4 font-semibold">
                ❌ <strong>Nous ne vendons jamais vos données personnelles à des tiers.</strong>
              </p>

            </div>
          </section>

          {/* Article 5 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Database className="text-teal-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">5. Durée de conservation des données</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4 ml-13">
              
              <p>
                Vos données personnelles sont conservées pendant les durées suivantes :
              </p>

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-900">Données clients (commandes)</h4>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">3 ans</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Après la dernière commande ou interaction
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-900">Données comptables (factures)</h4>
                    <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">10 ans</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Obligation légale (Code de commerce)
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-900">Cookies et données de navigation</h4>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">13 mois max</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Conformément à la réglementation CNIL
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-900">Prospects (newsletters non ouvertes)</h4>
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">3 ans</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Suppression automatique après 3 ans d'inactivité
                  </p>
                </div>
              </div>

              <p className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded text-sm">
                À l'issue de ces durées, vos données sont <strong>supprimées définitivement</strong> ou <strong>anonymisées</strong> (pour les statistiques).
              </p>

            </div>
          </section>

          {/* Article 6 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <UserCheck className="text-indigo-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">6. Vos droits (RGPD)</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4 ml-13">
              
              <p className="mb-4">
                Conformément au <strong>RGPD</strong> et à la loi Informatique et Libertés, vous disposez des droits suivants :
              </p>

              <div className="space-y-3">
                <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                  <h4 className="font-bold text-gray-900 mb-2">✅ Droit d'accès</h4>
                  <p className="text-sm">
                    Vous pouvez demander à consulter les données personnelles que nous détenons sur vous.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-2">✏️ Droit de rectification</h4>
                  <p className="text-sm">
                    Vous pouvez demander la correction de données inexactes ou incomplètes.
                  </p>
                </div>

                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <h4 className="font-bold text-gray-900 mb-2">🗑️ Droit à l'effacement ("droit à l'oubli")</h4>
                  <p className="text-sm">
                    Vous pouvez demander la suppression de vos données personnelles (sauf obligation légale de conservation).
                  </p>
                </div>

                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <h4 className="font-bold text-gray-900 mb-2">⏸️ Droit à la limitation du traitement</h4>
                  <p className="text-sm">
                    Vous pouvez demander la suspension temporaire du traitement de vos données dans certaines situations.
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                  <h4 className="font-bold text-gray-900 mb-2">🚫 Droit d'opposition</h4>
                  <p className="text-sm">
                    Vous pouvez vous opposer au traitement de vos données pour des raisons tenant à votre situation particulière (sauf intérêt légitime impérieux).
                  </p>
                </div>

                <div className="bg-teal-50 rounded-xl p-5 border border-teal-200">
                  <h4 className="font-bold text-gray-900 mb-2">📦 Droit à la portabilité</h4>
                  <p className="text-sm">
                    Vous pouvez récupérer vos données dans un format structuré et lisible par machine pour les transférer à un autre prestataire.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-2">📜 Droit de définir des directives post-mortem</h4>
                  <p className="text-sm">
                    Vous pouvez définir des directives relatives au sort de vos données après votre décès.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200 mt-6">
                <h4 className="font-bold text-gray-900 mb-3">📧 Comment exercer vos droits ?</h4>
                <p className="text-sm mb-3">
                  Pour exercer l'un de ces droits, contactez-nous :
                </p>
                <ul className="space-y-2 text-sm">
                  <li>✉️ <strong>Par email :</strong> contact@socaftan.fr</li>
                  <li>📞 <strong>Par téléphone :</strong> 06 99 83 29 02</li>
                  <li>📮 <strong>Par courrier :</strong> SO Caftan, Île-de-France</li>
                </ul>
                <p className="text-xs text-gray-600 mt-4">
                  ⏱️ Nous nous engageons à vous répondre dans un délai de <strong>1 mois</strong> maximum.
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  🆔 Pour des raisons de sécurité, une copie de votre pièce d'identité pourra vous être demandée.
                </p>
              </div>

            </div>
          </section>

          {/* Article 7 - Cookies */}
          <section className="mb-10" id="cookies">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cookie className="text-orange-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">7. Cookies</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4 ml-13">
              
              <p>
                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone, tablette) lors de votre visite sur notre site.
              </p>

              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-gray-900 mb-3">🍪 Types de cookies utilisés</h4>
                
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Cookies essentiels (obligatoires)</p>
                    <p className="text-sm text-gray-600">
                      Nécessaires au fonctionnement du site (panier, connexion, sécurité). Ne nécessitent pas de consentement.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Cookies de performance (optionnels)</p>
                    <p className="text-sm text-gray-600">
                      Statistiques de navigation anonymes pour améliorer le site (Google Analytics, etc.). Nécessitent votre consentement.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Cookies marketing (optionnels)</p>
                    <p className="text-sm text-gray-600">
                      Publicité ciblée et réseaux sociaux. Nécessitent votre consentement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h4 className="font-bold text-gray-900 mb-2">⚙️ Gérer les cookies</h4>
                <p className="text-sm mb-3">
                  Vous pouvez à tout moment paramétrer vos préférences de cookies via :
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Le bandeau cookies qui s'affiche lors de votre première visite</li>
                  <li>Les paramètres de votre navigateur (aide disponible sur le site de votre navigateur)</li>
                </ul>
                <p className="text-xs text-gray-600 mt-3">
                  ℹ️ La désactivation de certains cookies peut limiter les fonctionnalités du site.
                </p>
              </div>

            </div>
          </section>

          {/* Article 8 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="text-red-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">8. Sécurité des données</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4 ml-13">
              
              <p>
                Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour assurer la sécurité de vos données personnelles et empêcher qu'elles soient déformées, endommagées ou que des tiers non autorisés y aient accès.
              </p>

              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-gray-900 mb-3">🔒 Mesures de sécurité mises en place</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Chiffrement SSL/TLS :</strong> Toutes les communications avec le site sont chiffrées (HTTPS)</li>
                  <li><strong>Hébergement sécurisé :</strong> Nos serveurs sont hébergés chez des prestataires certifiés</li>
                  <li><strong>Accès restreint :</strong> Seules les personnes habilitées ont accès aux données</li>
                  <li><strong>Mots de passe sécurisés :</strong> Stockage crypté des mots de passe</li>
                  <li><strong>Sauvegardes régulières :</strong> Vos données sont sauvegardées quotidiennement</li>
                  <li><strong>Pare-feu et antivirus :</strong> Protection contre les intrusions</li>
                </ul>
              </div>

              <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                <h4 className="font-bold text-gray-900 mb-2">⚠️ Violation de données</h4>
                <p className="text-sm">
                  En cas de violation de données personnelles susceptible d'engendrer un risque élevé pour vos droits et libertés, nous vous en informerons dans les <strong>72 heures</strong> et en informerons la CNIL conformément à la réglementation.
                </p>
              </div>

            </div>
          </section>

          {/* Article 9 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="text-pink-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">9. Réclamation auprès de la CNIL</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-4 ml-13">
              
              <p>
                Si vous estimez que le traitement de vos données personnelles constitue une violation de la réglementation en vigueur, vous avez le droit d'introduire une réclamation auprès de la <strong>Commission Nationale de l'Informatique et des Libertés (CNIL)</strong>.
              </p>

              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h4 className="font-bold text-gray-900 mb-3">📞 Contacter la CNIL</h4>
                <ul className="space-y-2 text-sm">
                  <li><strong>Site web :</strong> <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.cnil.fr</a></li>
                  <li><strong>Adresse :</strong> CNIL - 3 Place de Fontenoy - TSA 80715 - 75334 Paris Cedex 07</li>
                  <li><strong>Téléphone :</strong> +33 (0)1 53 73 22 22</li>
                </ul>
              </div>

            </div>
          </section>

          {/* Article 10 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="text-gray-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">10. Modifications de la politique</h2>
            </div>
            <div className="text-gray-700 leading-relaxed space-y-3 ml-13">
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute modification prendra effet dès sa publication sur le site.
              </p>
              <p>
                Nous vous encourageons à consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.
              </p>
              <p className="font-semibold">
                Date de dernière mise à jour : <strong>17 mars 2026</strong>
              </p>
            </div>
          </section>

          {/* Footer de la page */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="font-bold text-gray-900 mb-3">💬 Questions sur vos données personnelles ?</h3>
              <p className="text-gray-700 mb-3">
                Pour toute question concernant cette politique de confidentialité ou le traitement de vos données :
              </p>
              <div className="space-y-2 text-gray-700">
                <p>📧 <strong>Email :</strong> contact@socaftan.fr</p>
                <p>📞 <strong>Téléphone :</strong> 06 99 83 29 02</p>
                <p>📮 <strong>Courrier :</strong> SO Caftan, Île-de-France</p>
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

export default PolitiqueConfidentialite
