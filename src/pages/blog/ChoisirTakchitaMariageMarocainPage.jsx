import { Link } from 'react-router-dom'
import BlogArticleLayout from '../../components/BlogArticleLayout'
import { findPostBySlug } from '../../lib/blog'

const post = findPostBySlug('choisir-takchita-mariage-marocain')

const ChoisirTakchitaMariageMarocainPage = () => {
  return (
    <BlogArticleLayout post={post}>
      <p>
        Le mariage marocain est une celebration somptueuse, riche en traditions et en symbolique. Au coeur de cette journee
        unique, la <strong>takchita</strong> occupe une place centrale. Plus qu'un vetement, elle incarne l'elegance,
        l'heritage et la fierte culturelle de la mariee. Voici notre guide complet pour bien la choisir.
      </p>

      <h2>1. Comprendre ce qu'est une takchita</h2>
      <p>
        La takchita est une tenue traditionnelle marocaine composee de <strong>deux pieces superposees</strong> :
        une robe interieure (la tahtiya) et une robe exterieure ouverte sur le devant (la fouqia). Elle est ceinturee
        par une mdamma, ceinture brodee qui met en valeur la silhouette.
      </p>
      <p>
        Contrairement au caftan qui est une seule piece, la takchita offre une superposition de tissus, broderies et
        couleurs qui permet une infinite de variations. C'est pourquoi elle est privilegiee pour les ceremonies
        importantes comme le mariage.
      </p>

      <h2>2. Les couleurs traditionnelles selon le moment du mariage</h2>
      <p>
        Un mariage marocain s'etale souvent sur plusieurs jours, et la mariee change plusieurs fois de tenue.
        Chaque moment a ses codes couleur :
      </p>
      <ul>
        <li><strong>Henna (1ere soiree)</strong> : vert (couleur de la baraka), dore ou blanc casse</li>
        <li><strong>Soiree de mariage</strong> : blanc immacule, parfois avec des touches dorees</li>
        <li><strong>Mlak (signature du contrat)</strong> : couleurs riches comme le rouge bordeaux, l'emeraude, le bleu nuit</li>
        <li><strong>Cocktail / reception</strong> : couleurs plus modernes : pourpre, rose poudre, vieux rose, dore</li>
      </ul>
      <p>
        Si vous ne portez qu'<em>une seule</em> takchita, optez pour une couleur intemporelle comme le bordeaux,
        l'emeraude ou le dore : elles flattent toutes les carnations et restent elegantes en photo.
      </p>

      <h2>3. Le choix du tissu : luxueux mais confortable</h2>
      <p>
        Une mariee porte sa tenue plusieurs heures, parfois en exterieur. Le tissu doit etre a la fois <strong>noble
        et respirant</strong> :
      </p>
      <ul>
        <li><strong>Soie</strong> : la plus prestigieuse, parfaite pour les photos, mais coute cher en achat</li>
        <li><strong>Mousseline brodee</strong> : leger, fluide, ideal pour les robes d'ete</li>
        <li><strong>Velours</strong> : majestueux, recommande pour les mariages d'hiver</li>
        <li><strong>Brocart (mensoudj)</strong> : tisse de fil d'or ou d'argent, tres prestigieux</li>
      </ul>
      <blockquote>
        Astuce : si vous louez votre tenue (chez SO Caftan a partir de 90€), vous pouvez vous offrir des matieres
        premium qui couteraient plusieurs milliers d'euros a l'achat.
      </blockquote>

      <h2>4. Les broderies : un art a part entiere</h2>
      <p>
        Les broderies racontent l'histoire et la region. Certaines des plus prisees pour les mariages :
      </p>
      <ul>
        <li><strong>Sfifa et akkad</strong> : passementerie en fil de soie, motifs traditionnels</li>
        <li><strong>Brodeerie de Fes</strong> : tres detaillee, motifs floraux, considéree comme la plus raffinee</li>
        <li><strong>Maallem (perles et cristaux)</strong> : pour un effet etincelant sous la lumiere</li>
        <li><strong>Tarz Lbniqa</strong> : style nord-marocain, broderies geometriques</li>
      </ul>

      <h2>5. La mdamma (ceinture) : le detail qui change tout</h2>
      <p>
        La ceinture mdamma sculpte la silhouette en marquant la taille. Elle peut etre :
      </p>
      <ul>
        <li>Brodee dans le meme tissu que la takchita (effet harmonieux)</li>
        <li>Contrastee (noir sur dore, par exemple, pour un effet graphique)</li>
        <li>Sertie de pierres ou de cristaux pour les ceremonies importantes</li>
      </ul>

      <h2>6. Adapter la takchita a votre morphologie</h2>
      <p>
        Toutes les takchitas ne flattent pas toutes les silhouettes de la meme maniere :
      </p>
      <ul>
        <li><strong>Silhouette en A</strong> : optez pour une fouqia ample qui recouvre les hanches</li>
        <li><strong>Silhouette en H</strong> : la mdamma marquee creera l'illusion d'une taille</li>
        <li><strong>Silhouette en X</strong> : presque tous les modeles fonctionnent, jouez la carte de la sobriete pour eviter la surcharge</li>
        <li><strong>Petites tailles</strong> : evitez les broderies trop denses qui tassent la silhouette</li>
      </ul>

      <h2>7. Combien depenser pour sa takchita de mariage ?</h2>
      <p>
        Trois options principales :
      </p>
      <ul>
        <li><strong>Achat sur-mesure (Maroc)</strong> : entre 800€ et 5000€ selon les tissus et broderies</li>
        <li><strong>Achat pret-a-porter</strong> : entre 400€ et 2000€</li>
        <li><strong>Location</strong> : entre 90€ et 200€ pour une tenue de qualite equivalente</li>
      </ul>
      <p>
        La location est la solution choisie par la majorite des mariees aujourd'hui : elle permet d'avoir
        plusieurs tenues (henna + mariage) sans se ruiner. Chez{' '}
        <Link to="/location-takchita-ile-de-france">SO Caftan</Link>, nos takchitas sont disponibles a 90€,
        avec caution de 100€ remise et restituee en main propre.
      </p>

      <h2>8. Quand reserver sa takchita ?</h2>
      <p>
        Le plus tot possible. Les meilleures pieces partent vite, surtout en haute saison (mai a septembre).
        Voici un retroplanning ideal :
      </p>
      <ol>
        <li><strong>3 a 6 mois avant</strong> : reperage des modeles, premieres demandes de devis</li>
        <li><strong>2 a 3 mois avant</strong> : reservation ferme avec acompte</li>
        <li><strong>2 semaines avant</strong> : essayage et derniers ajustements</li>
        <li><strong>3 a 5 jours avant</strong> : recuperation de la tenue</li>
      </ol>

      <h2>9. Notre selection de takchitas pour mariage</h2>
      <p>
        Chez SO Caftan, nous avons selectionne nos plus belles takchitas adaptees aux mariages marocains :
      </p>
      <ul>
        <li><strong>Andalouse</strong> : broderies fes, parfaite pour la soiree de henna</li>
        <li><strong>Takchita Sultana</strong> : majestueuse, ideale pour la signature du contrat</li>
        <li><strong>Soultana de Fes</strong> : la plus prestigieuse de notre collection</li>
        <li><strong>Sfifa Royale</strong> : passementerie traditionnelle, elegance intemporelle</li>
      </ul>

      <h2>En resume</h2>
      <p>
        Choisir sa takchita de mariage, c'est trouver le juste equilibre entre tradition, confort et personnalite.
        Prenez le temps d'essayer, fiez-vous a votre instinct, et surtout : entourez-vous de personnes qui vous
        conseilleront sincerement.
      </p>
      <p>
        Vous voulez etre conseillee personnellement ? <Link to="/contact">Contactez SO Caftan</Link> pour un
        accompagnement gratuit via WhatsApp ou en rendez-vous a Tigery (91).
      </p>
    </BlogArticleLayout>
  )
}

export default ChoisirTakchitaMariageMarocainPage
