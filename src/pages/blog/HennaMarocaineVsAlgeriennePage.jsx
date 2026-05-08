import { Link } from 'react-router-dom'
import BlogArticleLayout from '../../components/BlogArticleLayout'
import { findPostBySlug } from '../../lib/blog'

const post = findPostBySlug('henna-marocaine-vs-algerienne')

const HennaMarocaineVsAlgeriennePage = () => {
  return (
    <BlogArticleLayout post={post}>
      <p>
        La <strong>nuit du henne</strong> (ou henna) est l'un des moments les plus emouvants des mariages d'Afrique
        du Nord. Mais selon que la tradition est marocaine ou algerienne, les codes vestimentaires changent.
        Voici tout ce qu'il faut savoir pour choisir la bonne tenue.
      </p>

      <h2>La henna : un rituel partage, des traditions distinctes</h2>
      <p>
        Au Maroc comme en Algerie, la nuit du henne se deroule generalement quelques jours avant le mariage.
        Elle reunit la famille proche et les amies de la mariee, qui se peignent les mains et les pieds avec
        des motifs au henne. C'est un moment de joie, de chants traditionnels et de complicite feminine.
      </p>
      <p>
        Mais malgre cette base commune, chaque tradition a ses propres tenues, couleurs et symboliques.
      </p>

      <h2>La henna marocaine : la takchita verte ou doree</h2>
      <p>
        Au Maroc, la mariee porte le plus souvent une <strong>takchita verte</strong>. Le vert est la couleur
        de la <em>baraka</em> (benediction divine en Islam). Les autres choix populaires :
      </p>
      <ul>
        <li><strong>Vert emeraude</strong> : le plus traditionnel, brode en fil dore</li>
        <li><strong>Dore / champagne</strong> : pour celles qui veulent briller sans le vert</li>
        <li><strong>Blanc casse avec broderies dorees</strong> : tendance moderne, tres photogenique</li>
        <li><strong>Bordeaux</strong> : alternative chaleureuse pour l'hiver</li>
      </ul>
      <p>
        La <strong>takchita</strong> est la tenue par excellence : deux pieces superposees ceinturees par une
        mdamma. Les broderies de Fes ou la passementerie sfifa sont privilegiees pour cette ceremonie sacree.
      </p>
      <blockquote>
        Les invitees portent generalement un caftan ou une djellaba colores, mais evitent le blanc reserve
        a la mariee.
      </blockquote>

      <h2>La henna algerienne : le karakou et le chedda de Tlemcen</h2>
      <p>
        En Algerie, la tenue de henne est tres differente. La piece emblematique est le <strong>karakou</strong>,
        un ensemble compose de :
      </p>
      <ul>
        <li>Une <strong>veste cintree richement brodee</strong> (le karakou proprement dit)</li>
        <li>Un <strong>seroual</strong> (pantalon traditionnel large)</li>
        <li>Une <strong>ceinture en or ou doree</strong></li>
      </ul>
      <p>
        Selon les regions, on retrouve aussi :
      </p>
      <ul>
        <li><strong>Chedda de Tlemcen</strong> : la plus prestigieuse, classee au patrimoine immateriel de l'UNESCO. Brocart d'or, perles, parures impressionnantes.</li>
        <li><strong>Blousa de Constantine</strong> : tunique brodee de fil d'or (fetla), portee avec une jupe</li>
        <li><strong>Fergani d'Annaba</strong> : tenue plus epuree, dominee par le rouge et l'or</li>
      </ul>

      <h2>Henna marocaine vs algerienne : tableau comparatif</h2>
      <p>
        Voici les principales differences a retenir :
      </p>
      <ul>
        <li><strong>Tenue principale</strong> : Maroc -&gt; takchita / Algerie -&gt; karakou ou chedda</li>
        <li><strong>Couleurs dominantes</strong> : Maroc -&gt; vert, dore, blanc casse / Algerie -&gt; or, rouge, bordeaux</li>
        <li><strong>Coupe</strong> : Maroc -&gt; deux pieces longues superposees / Algerie -&gt; veste + pantalon</li>
        <li><strong>Broderies</strong> : Maroc -&gt; sfifa, Fes / Algerie -&gt; fetla, fil d'or</li>
        <li><strong>Bijoux</strong> : Maroc -&gt; ceinture mdamma / Algerie -&gt; parure complete (collier, diademe, ceinture)</li>
      </ul>

      <h2>Et si vous etes d'origine mixte ?</h2>
      <p>
        De plus en plus de mariees franco-maghrebines choisissent de melanger les deux traditions sur leur
        soiree de henne. Quelques idees :
      </p>
      <ul>
        <li>Porter une takchita pour la premiere partie (ceremonie du henne) puis un karakou pour la reception</li>
        <li>Choisir une takchita aux broderies dorees inspirees du chedda algerien</li>
        <li>Faire entrer la mariee en chedda et la voir ressortir en takchita verte</li>
      </ul>
      <p>
        Chez <Link to="/location-tenue-henna">SO Caftan</Link>, nous proposons les deux types de tenues en
        location : takchitas marocaines (90€) et karakous algeriens (100€). Vous pouvez tout a fait louer
        deux tenues differentes pour votre soiree.
      </p>

      <h2>Combien coute la location pour une henna ?</h2>
      <p>
        En Ile-de-France, comptez :
      </p>
      <ul>
        <li><strong>Takchita</strong> : a partir de <strong>90€</strong> + 100€ de caution remboursable</li>
        <li><strong>Karakou</strong> : a partir de <strong>100€</strong> + 100€ de caution remboursable</li>
        <li><strong>Pack 2 tenues</strong> (henna + mariage) : nous contacter pour une offre personnalisee</li>
      </ul>

      <h2>Conseils pratiques pour le jour J</h2>
      <ol>
        <li><strong>Reservez tot</strong> : 3 a 4 semaines avant la henne minimum</li>
        <li><strong>Prevoyez une jupe en plus</strong> : le henne tache facilement les tissus clairs</li>
        <li><strong>Preparez vos accessoires</strong> : foulard, bijoux, plateau a henne (souvent loue avec la tenue)</li>
        <li><strong>Pensez au confort</strong> : la soiree dure plusieurs heures, vous serez assise au sol</li>
        <li><strong>Enlevez le henne</strong> : laissez-le secher naturellement, il fonce avec le temps</li>
      </ol>

      <h2>En conclusion</h2>
      <p>
        Que vous soyez d'origine marocaine, algerienne, ou des deux, votre henne doit refleter VOTRE histoire.
        Les traditions sont des guides precieux, pas des obligations. Choisissez la tenue qui vous fait sentir
        belle et connectee a vos racines.
      </p>
      <p>
        Vous hesitez ? <Link to="/contact">Contactez-nous</Link> sur WhatsApp, on vous conseille gratuitement
        et avec amour.
      </p>
    </BlogArticleLayout>
  )
}

export default HennaMarocaineVsAlgeriennePage
