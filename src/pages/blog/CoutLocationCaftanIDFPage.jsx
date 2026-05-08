import { Link } from 'react-router-dom'
import BlogArticleLayout from '../../components/BlogArticleLayout'
import { findPostBySlug } from '../../lib/blog'

const post = findPostBySlug('cout-location-caftan-ile-de-france')

const CoutLocationCaftanIDFPage = () => {
  return (
    <BlogArticleLayout post={post}>
      <p>
        Vous preparez un mariage, une henna ou une ceremonie orientale en Ile-de-France et vous vous demandez
        combien coute exactement la location d'un caftan, d'une takchita ou d'un karakou ? Cet article fait
        le point complet sur les tarifs reels du marche en 2026, sans frais caches.
      </p>

      <h2>Les tarifs moyens en Ile-de-France en 2026</h2>
      <p>
        Voici une fourchette des tarifs pratiques en Ile-de-France selon le type de tenue :
      </p>
      <ul>
        <li><strong>Location takchita</strong> : entre <strong>80€ et 250€</strong> selon la qualite et la rarete du modele</li>
        <li><strong>Location karakou</strong> : entre <strong>90€ et 300€</strong></li>
        <li><strong>Location caftan</strong> : entre <strong>70€ et 200€</strong></li>
        <li><strong>Location robe sur-mesure</strong> : entre <strong>200€ et 600€</strong></li>
      </ul>
      <p>
        Chez <Link to="/location-caftan-pas-cher">SO Caftan</Link>, nous nous positionnons sur la fourchette
        basse-moyenne avec des tenues haut de gamme :
      </p>
      <ul>
        <li><strong>Takchita</strong> : <strong>90€</strong> ferme</li>
        <li><strong>Karakou</strong> : <strong>100€</strong> ferme</li>
        <li><strong>Caftan a l'achat</strong> : <strong>180€</strong></li>
      </ul>

      <h2>Que comprend le prix de location ?</h2>
      <p>
        Un bon prestataire inclut dans sa location :
      </p>
      <ul>
        <li><strong>La tenue elle-meme</strong>, nettoyee et repassee</li>
        <li><strong>3 a 5 jours de location</strong> (selon prestataire)</li>
        <li>Parfois la mdamma (ceinture)</li>
        <li>L'<strong>accompagnement</strong> pour le choix du modele</li>
      </ul>
      <p>
        Ce qui n'est generalement <em>pas</em> inclus :
      </p>
      <ul>
        <li>Les bijoux et la diademe (a louer separement chez un bijoutier ou a apporter)</li>
        <li>Le foulard et les chaussures</li>
        <li>Les retouches sur-mesure (a prevoir 2 semaines avant la livraison)</li>
      </ul>

      <h2>La caution : combien et comment ?</h2>
      <p>
        La caution est <strong>obligatoire</strong> et permet au prestataire de couvrir un eventuel dommage.
        En Ile-de-France, elle se situe generalement entre <strong>100€ et 300€</strong>.
      </p>
      <p>
        Chez SO Caftan, la caution est de <strong>100€ par piece</strong>, integralement remboursee sous
        <strong> 3 a 5 jours</strong> apres restitution dans l'etat fourni. Aucun frais cache.
      </p>
      <blockquote>
        Vigilance : certains prestataires retiennent la caution sous pretexte de "frais de nettoyage".
        Lisez toujours les CGV avant de signer. Chez SO Caftan, le nettoyage est inclus dans le prix de
        location.
      </blockquote>

      <h2>Frais de livraison : a partir de quand ?</h2>
      <p>
        Plusieurs options en Ile-de-France :
      </p>
      <ul>
        <li><strong>Retrait sur place</strong> : gratuit (chez SO Caftan a Tigery, 91250)</li>
        <li><strong>Livraison standard</strong> : entre 10€ et 25€ selon la zone</li>
        <li><strong>Livraison express</strong> : 30€ a 50€ pour une livraison en 24h</li>
        <li><strong>Livraison dans les villes proches</strong> (Evry, Corbeil) : souvent gratuite ou a tarif reduit</li>
      </ul>

      <h2>Achat ou location : quel choix selon votre profil ?</h2>
      <p>
        La question revient souvent. Voici notre analyse honnete :
      </p>
      <h3>Choisissez la location si...</h3>
      <ul>
        <li>Vous portez une tenue orientale 1 a 3 fois par an</li>
        <li>Vous voulez varier les styles selon les evenements</li>
        <li>Votre budget est inferieur a 300€ par occasion</li>
        <li>Vous n'avez pas de place pour stocker une tenue qui se froisse</li>
      </ul>
      <h3>Choisissez l'achat si...</h3>
      <ul>
        <li>Vous portez une tenue orientale 5 fois par an ou plus</li>
        <li>Vous prevoyez de la transmettre (heritage familial)</li>
        <li>Votre budget depasse 800€ et vous voulez investir dans une piece intemporelle</li>
        <li>Vous avez des morphologies tres specifiques qui necessitent du sur-mesure</li>
      </ul>

      <h2>Le calcul rentable : un exemple concret</h2>
      <p>
        Mariem prevoit 2 mariages, 1 fiancailles et 1 henna sur l'annee. Elle hesite :
      </p>
      <ul>
        <li><strong>Option achat</strong> (1 takchita a 1500€) : 1500€ pour 4 evenements = 375€ par evenement</li>
        <li><strong>Option location</strong> (4 tenues a 90-100€) : 400€ pour 4 evenements differents = 100€ par evenement</li>
      </ul>
      <p>
        En plus, avec la location elle change de tenue a chaque evenement (les photos sont plus variees, ses
        amies ne la voient pas toujours dans la meme robe), et elle profite de pieces premium qu'elle ne
        pourrait pas s'offrir a l'achat.
      </p>

      <h2>5 questions a poser avant de reserver</h2>
      <ol>
        <li><strong>Quelle est la duree de location incluse ?</strong> (idealement 3 a 5 jours)</li>
        <li><strong>Le nettoyage est-il inclus ?</strong> Sinon, prevoir +30€</li>
        <li><strong>La caution est-elle integralement remboursee ?</strong> Lisez les CGV</li>
        <li><strong>Y a-t-il une assurance casse / tache ?</strong> Souvent en option a 10-20€</li>
        <li><strong>Que se passe-t-il si la tenue ne me va pas ?</strong> Prevoyez un essayage avant le jour J</li>
      </ol>

      <h2>Et si vous voulez aller plus loin : le sur-mesure</h2>
      <p>
        Pour les mariees qui veulent une tenue absolument unique, le sur-mesure reste une option.
        Chez SO Caftan, nous proposons un service de <Link to="/sur-mesure">creation personnalisee</Link>
        : choix des tissus, broderies, couleurs et coupe, en collaboration avec nos artisans.
      </p>
      <p>
        Comptez 2 a 3 mois de delai et un budget a partir de <strong>500€</strong> pour une piece sur-mesure.
      </p>

      <h2>Notre recommandation finale</h2>
      <p>
        Pour la grande majorite des futures mariees et invitees, la <strong>location reste la meilleure
        option en Ile-de-France</strong> en 2026. Elle permet d'acceder a des tenues haut de gamme sans
        immobiliser un budget important, tout en restant flexible.
      </p>
      <p>
        Pretes a reserver ? Decouvrez notre collection :
      </p>
      <ul>
        <li><Link to="/location-takchita-ile-de-france">Location takchita Ile-de-France a 90€</Link></li>
        <li><Link to="/location-karakou-ile-de-france">Location karakou Ile-de-France a 100€</Link></li>
        <li><Link to="/vente-caftan-ile-de-france">Achat caftan a 180€</Link></li>
      </ul>
      <p>
        Une question sur les tarifs ou la disponibilite ? <Link to="/contact">Ecrivez-nous sur WhatsApp</Link>.
      </p>
    </BlogArticleLayout>
  )
}

export default CoutLocationCaftanIDFPage
