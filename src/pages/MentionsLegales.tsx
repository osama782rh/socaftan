import { motion } from 'framer-motion'
import { Scale, Building2, Mail, Phone, MapPin, Server } from 'lucide-react'

const MentionsLegales = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-rose-100 px-5 py-2 rounded-full mb-4">
            <Scale className="text-rose-600" size={20} />
            <span className="text-rose-600 font-semibold text-sm">Informations Légales</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Mentions Légales</h1>
          <p className="text-gray-600 text-lg">
            Informations légales concernant le site SO Caftan
          </p>
        </motion.div>

        {/* Contenu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12"
        >
          
          {/* Section 1 : Identification */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                <Building2 className="text-rose-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">1. Identification de l'éditeur</h2>
            </div>
            
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-rose-600">
                <p className="mb-2"><strong>Raison sociale :</strong> SO Caftan</p>
                <p className="mb-2"><strong>Forme juridique :</strong> Microentreprise (EI)</p>
                <p className="mb-2"><strong>SIREN :</strong>  999 110 984 </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <p className="mb-2 flex items-start gap-2">
                  <MapPin className="text-rose-600 flex-shrink-0 mt-1" size={20} />
                  <span><strong>Siège social :</strong><br />
                  20 rue du Commandant Maurice Lissac<br />
                  91250 Tigery<br />
                  France</span>
                </p>
                <p className="mb-2 flex items-center gap-2">
                  <Phone className="text-rose-600" size={20} />
                  <span><strong>Téléphone :</strong> 06 99 83 29 02</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="text-rose-600" size={20} />
                  <span><strong>Email :</strong> contact@socaftan.fr</span>
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <p><strong>Directeur de la publication :</strong> SO Caftan</p>
              </div>
            </div>
          </section>

          {/* Section 2 : Hébergement */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Server className="text-purple-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">2. Hébergement du site</h2>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 text-gray-700">
              <p className="mb-2"><strong>Hébergeur :</strong> OVH</p>
              <p className="mb-2"><strong>Adresse :</strong> 2 rue Kellermann, 59100 Roubaix, France</p>
              <p className="mb-2"><strong>Site web :</strong> <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:underline">ovhcloud.com</a></p>
              <p className="mb-2"><strong>Téléphone :</strong> 1007</p>
            </div>
          </section>

          {/* Section 3 : Propriété intellectuelle */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Propriété intellectuelle</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes, etc.) est la propriété exclusive de <strong>SO Caftan</strong> ou de ses partenaires, et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit est interdite sans l'autorisation écrite préalable de <strong>SO Caftan</strong>.
              </p>
              <p>
                La marque <strong>SO Caftan</strong> ainsi que les logos figurant sur le site sont des marques déposées. Toute reproduction totale ou partielle de ces marques ou de ces logos effectuée à partir des éléments du site sans l'autorisation expresse de <strong>SO Caftan</strong> est donc prohibée.
              </p>
            </div>
          </section>

          {/* Section 4 : Données personnelles */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Protection des données personnelles</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD) du 27 avril 2016, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
              </p>
              <p>
                Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante : <strong>contact@socaftan.fr</strong>
              </p>
              <p>
                Pour plus d'informations sur la collecte et le traitement de vos données personnelles, consultez notre <a href="/politique-confidentialite" className="text-rose-600 hover:underline font-semibold">Politique de Confidentialité</a>.
              </p>
            </div>
          </section>

          {/* Section 5 : Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                Le site <strong>socaftan.fr</strong> peut être amené à vous demander l'acceptation de cookies pour des besoins de statistiques et d'affichage. Un cookie est une information déposée sur votre disque dur par le serveur du site que vous visitez.
              </p>
              <p>
                Il contient plusieurs données qui sont stockées sur votre ordinateur dans un simple fichier texte auquel un serveur accède pour lire et enregistrer des informations.
              </p>
              <p>
                Vous pouvez à tout moment désactiver les cookies dans les paramètres de votre navigateur.
              </p>
            </div>
          </section>

          {/* Section 6 : Responsabilité */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation de responsabilité</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                <strong>SO Caftan</strong> met tout en œuvre pour offrir aux utilisateurs des informations et/ou des outils disponibles et vérifiés, mais ne saurait être tenu responsable des erreurs, d'une absence de disponibilité des informations et/ou de la présence de virus sur son site.
              </p>
              <p>
                Les liens hypertextes mis en place dans le cadre du présent site internet en direction d'autres ressources présentes sur le réseau Internet ne sauraient engager la responsabilité de <strong>SO Caftan</strong>.
              </p>
              <p>
                Les photographies des produits présentés sur le site ne sont pas contractuelles. Les couleurs et les détails peuvent varier légèrement en fonction des écrans et de l'éclairage.
              </p>
            </div>
          </section>

          {/* Section 7 : Droit applicable */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Droit applicable et juridiction compétente</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                Les présentes mentions légales sont régies par le droit français.
              </p>
              <p>
                En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
              </p>
              <p className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <strong>Médiation de la consommation :</strong><br />
                Conformément à l'article L.612-1 du Code de la consommation, le consommateur a le droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable du litige qui l'oppose à un professionnel.
              </p>
              <p>
                <span className="text-sm text-gray-500">Le médiateur compétent est référencé sur la liste officielle : <a href="https://www.economie.gouv.fr/mediation-conso/mediateurs-references" target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:underline">economie.gouv.fr/mediation-conso</a></span>
              </p>
            </div>
          </section>

          {/* Section 8 : Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact</h2>
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
              <p className="text-gray-700 mb-4">
                Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
              </p>
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center gap-2">
                  <Mail className="text-rose-600" size={20} />
                  <strong>Par email :</strong> contact@socaftan.fr
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="text-rose-600" size={20} />
                  <strong>Par téléphone :</strong> 06 99 83 29 02
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="text-rose-600 flex-shrink-0 mt-1" size={20} />
                  <span><strong>Par courrier :</strong><br />20 rue du Commandant Maurice Lissac, 91250 Tigery</span>
                </p>
              </div>
            </div>
          </section>

          {/* Footer de la page */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>Dernière mise à jour : <strong>17 mars 2026</strong></p>
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

export default MentionsLegales
